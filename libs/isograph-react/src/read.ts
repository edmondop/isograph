import { getParentRecordKey, onNextChange } from './cache';
import { getOrCreateCachedComponent } from './componentCache';
import { RefetchQueryArtifactWrapper } from './entrypoint';
import { FragmentReference } from './FragmentReference';
import {
  assertLink,
  DataId,
  defaultMissingFieldHandler,
  IsographEnvironment,
} from './IsographEnvironment';
import { ReaderAst } from './reader';

export function read<TReadFromStore extends Object, TClientFieldValue>(
  environment: IsographEnvironment,
  fragmentReference: FragmentReference<TReadFromStore, TClientFieldValue>,
): TClientFieldValue {
  const variant = fragmentReference.readerArtifact.variant;
  if (variant.kind === 'Eager') {
    const data = readData(
      environment,
      fragmentReference.readerArtifact.readerAst,
      fragmentReference.root,
      fragmentReference.variables ?? {},
      fragmentReference.nestedRefetchQueries,
    );
    if (data.kind === 'MissingData') {
      throw onNextChange(environment);
    } else {
      // @ts-expect-error This not properly typed yet
      return fragmentReference.readerArtifact.resolver(data.data);
    }
  } else if (variant.kind === 'Component') {
    // @ts-ignore
    return getOrCreateCachedComponent(
      environment,
      fragmentReference.root,
      variant.componentName,
      fragmentReference.readerArtifact,
      fragmentReference.variables ?? {},
      fragmentReference.nestedRefetchQueries,
    );
  }
  // Why can't Typescript realize that this is unreachable??
  throw new Error('This is unreachable');
}

export function readButDoNotEvaluate<TReadFromStore extends Object>(
  environment: IsographEnvironment,
  reference: FragmentReference<TReadFromStore, unknown>,
): TReadFromStore {
  const response = readData(
    environment,
    reference.readerArtifact.readerAst,
    reference.root,
    reference.variables ?? {},
    reference.nestedRefetchQueries,
  );
  if (typeof window !== 'undefined' && window.__LOG) {
    console.log('done reading', { response });
  }
  if (response.kind === 'MissingData') {
    throw onNextChange(environment);
  } else {
    return response.data;
  }
}

type ReadDataResult<TReadFromStore> =
  | {
      kind: 'Success';
      data: TReadFromStore;
    }
  | {
      kind: 'MissingData';
      reason: string;
      nestedReason?: ReadDataResult<unknown>;
    };

function readData<TReadFromStore>(
  environment: IsographEnvironment,
  ast: ReaderAst<TReadFromStore>,
  root: DataId,
  variables: { [index: string]: string },
  nestedRefetchQueries: RefetchQueryArtifactWrapper[],
): ReadDataResult<TReadFromStore> {
  let storeRecord = environment.store[root];
  if (storeRecord === undefined) {
    return { kind: 'MissingData', reason: 'No record for root ' + root };
  }

  if (storeRecord === null) {
    return { kind: 'Success', data: null as any };
  }

  let target: { [index: string]: any } = {};

  for (const field of ast) {
    switch (field.kind) {
      case 'Scalar': {
        const storeRecordName = getParentRecordKey(field, variables);
        const value = storeRecord[storeRecordName];
        // TODO consider making scalars into discriminated unions. This probably has
        // to happen for when we handle errors.
        if (value === undefined) {
          return {
            kind: 'MissingData',
            reason: 'No value for ' + storeRecordName + ' on root ' + root,
          };
        }
        target[field.alias ?? field.fieldName] = value;
        break;
      }
      case 'Linked': {
        const storeRecordName = getParentRecordKey(field, variables);
        const value = storeRecord[storeRecordName];
        if (Array.isArray(value)) {
          const results = [];
          for (const item of value) {
            const link = assertLink(item);
            if (link === undefined) {
              return {
                kind: 'MissingData',
                reason:
                  'No link for ' +
                  storeRecordName +
                  ' on root ' +
                  root +
                  '. Link is ' +
                  JSON.stringify(item),
              };
            } else if (link === null) {
              results.push(null);
              continue;
            }
            const result = readData(
              environment,
              field.selections,
              link.__link,
              variables,
              nestedRefetchQueries,
            );
            if (result.kind === 'MissingData') {
              return {
                kind: 'MissingData',
                reason:
                  'Missing data for ' +
                  storeRecordName +
                  ' on root ' +
                  root +
                  '. Link is ' +
                  JSON.stringify(item),
                nestedReason: result,
              };
            }
            results.push(result.data);
          }
          target[field.alias ?? field.fieldName] = results;
          break;
        }
        let link = assertLink(value);
        if (link === undefined) {
          // TODO make this configurable, and also generated and derived from the schema
          const missingFieldHandler =
            environment.missingFieldHandler ?? defaultMissingFieldHandler;
          const altLink = missingFieldHandler(
            storeRecord,
            root,
            field.fieldName,
            field.arguments,
            variables,
          );
          if (altLink === undefined) {
            return {
              kind: 'MissingData',
              reason:
                'No link for ' +
                storeRecordName +
                ' on root ' +
                root +
                '. Link is ' +
                JSON.stringify(value),
            };
          } else {
            link = altLink;
          }
        } else if (link === null) {
          target[field.alias ?? field.fieldName] = null;
          break;
        }
        const targetId = link.__link;
        const data = readData(
          environment,
          field.selections,
          targetId,
          variables,
          nestedRefetchQueries,
        );
        if (data.kind === 'MissingData') {
          return {
            kind: 'MissingData',
            reason: 'Missing data for ' + storeRecordName + ' on root ' + root,
            nestedReason: data,
          };
        }
        target[field.alias ?? field.fieldName] = data.data;
        break;
      }
      case 'RefetchField': {
        const data = readData(
          environment,
          field.readerArtifact.readerAst,
          root,
          variables,
          // Refetch fields just read the id, and don't need refetch query artifacts
          [],
        );
        if (typeof window !== 'undefined' && window.__LOG) {
          console.log('refetch field data', data, field);
        }
        if (data.kind === 'MissingData') {
          return {
            kind: 'MissingData',
            reason: 'Missing data for ' + field.alias + ' on root ' + root,
            nestedReason: data,
          };
        } else {
          const refetchQueryIndex = field.refetchQuery;
          if (refetchQueryIndex == null) {
            throw new Error('refetchQuery is null in RefetchField');
          }
          const refetchQuery = nestedRefetchQueries[refetchQueryIndex];
          const refetchQueryArtifact = refetchQuery.artifact;
          const allowedVariables = refetchQuery.allowedVariables;

          target[field.alias] = field.readerArtifact.resolver(
            environment,
            // resolvers for refetch fields take 3 args, and this is not reflected in types
            refetchQueryArtifact,
            // @ts-expect-error
            {
              ...data.data,
              // TODO continue from here
              // variables need to be filtered for what we need just for the refetch query
              ...filterVariables(variables, allowedVariables),
            },
          );
        }
        break;
      }
      case 'MutationField': {
        const data = readData(
          environment,
          field.readerArtifact.readerAst,
          root,
          variables,
          // Refetch fields just read the id, and don't need refetch query artifacts
          [],
        );
        if (typeof window !== 'undefined' && window.__LOG) {
          console.log('refetch field data', data, field);
        }
        if (data.kind === 'MissingData') {
          return {
            kind: 'MissingData',
            reason: 'Missing data for ' + field.alias + ' on root ' + root,
            nestedReason: data,
          };
        } else {
          const refetchQueryIndex = field.refetchQuery;
          if (refetchQueryIndex == null) {
            throw new Error('refetchQuery is null in MutationField');
          }
          const refetchQuery = nestedRefetchQueries[refetchQueryIndex];
          const refetchQueryArtifact = refetchQuery.artifact;
          const allowedVariables = refetchQuery.allowedVariables;

          target[field.alias] = field.readerArtifact.resolver(
            environment,
            refetchQueryArtifact,
            // @ts-expect-error
            data.data,
            filterVariables(variables, allowedVariables),
          );
        }
        break;
      }
      case 'Resolver': {
        const usedRefetchQueries = field.usedRefetchQueries;
        const resolverRefetchQueries = usedRefetchQueries.map(
          (index) => nestedRefetchQueries[index],
        );

        const variant = field.readerArtifact.variant;
        if (variant.kind === 'Eager') {
          const data = readData(
            environment,
            field.readerArtifact.readerAst,
            root,
            variables,
            resolverRefetchQueries,
          );
          if (data.kind === 'MissingData') {
            return {
              kind: 'MissingData',
              reason: 'Missing data for ' + field.alias + ' on root ' + root,
              nestedReason: data,
            };
          } else {
            // @ts-expect-error
            target[field.alias] = field.readerArtifact.resolver(data.data);
          }
        } else if (variant.kind === 'Component') {
          target[field.alias] = getOrCreateCachedComponent(
            environment,
            root,
            variant.componentName,
            field.readerArtifact,
            variables,
            resolverRefetchQueries,
          );
        }
        break;
      }
    }
  }
  return { kind: 'Success', data: target as any };
}

function filterVariables(
  variables: { [index: string]: string },
  allowedVariables: string[],
): { [index: string]: string } {
  const result: { [index: string]: string } = {};
  for (const key of allowedVariables) {
    result[key] = variables[key];
  }
  return result;
}
