import { Factory } from '@isograph/disposable-types';
import { FetchOptions } from './check';
import {
  IsographEntrypoint,
  IsographEntrypointLoader,
  RefetchQueryNormalizationArtifact,
  RefetchQueryNormalizationArtifactWrapper,
} from './entrypoint';
import {
  ExtractData,
  ExtractParameters,
  FragmentReference,
} from './FragmentReference';
import {
  ComponentOrFieldName,
  IsographEnvironment,
  type Link,
} from './IsographEnvironment';
import { Arguments } from './util';

export type TopLevelReaderArtifact<
  TReadFromStore extends { parameters: object; data: object },
  TClientFieldValue,
  TComponentProps extends Record<PropertyKey, never>,
> =
  | EagerReaderArtifact<TReadFromStore, TClientFieldValue>
  | ComponentReaderArtifact<TReadFromStore, TComponentProps>;

export type EagerReaderArtifact<
  TReadFromStore extends { parameters: object; data: object },
  TClientFieldValue,
> = {
  readonly kind: 'EagerReaderArtifact';
  readonly readerAst: ReaderAst<TReadFromStore>;
  readonly resolver: (
    data: ResolverFirstParameter<TReadFromStore>,
  ) => TClientFieldValue;
};

export type ComponentReaderArtifact<
  TReadFromStore extends { parameters: object; data: object },
  TComponentProps extends Record<string, unknown> = Record<PropertyKey, never>,
> = {
  readonly kind: 'ComponentReaderArtifact';
  readonly componentName: ComponentOrFieldName;
  readonly readerAst: ReaderAst<TReadFromStore>;
  readonly resolver: (
    data: ResolverFirstParameter<TReadFromStore>,
    runtimeProps: TComponentProps,
  ) => React.ReactNode;
};

export type ResolverFirstParameter<
  TReadFromStore extends { data: object; parameters: object },
> = {
  data: ExtractData<TReadFromStore>;
  parameters: ExtractParameters<TReadFromStore>;
};

export type RefetchReaderArtifact = {
  readonly kind: 'RefetchReaderArtifact';
  readonly readerAst: ReaderAst<unknown>;
  readonly resolver: (
    environment: IsographEnvironment,
    artifact: RefetchQueryNormalizationArtifact,
    // TODO type this better
    variables: any,
    // TODO type this better
    filteredVariables: any,
    rootLink: Link,
    readerArtifact: TopLevelReaderArtifact<any, any, any> | null,
    // TODO type this better
    nestedRefetchQueries: RefetchQueryNormalizationArtifactWrapper[],
  ) => () => void;
};

export type ReaderAstNode =
  | ReaderScalarField
  | ReaderLinkedField
  | ReaderNonLoadableResolverField
  | ReaderImperativelyLoadedField
  | ReaderLoadableField
  | ReaderLinkeField;

// @ts-ignore
export type ReaderAst<TReadFromStore> = ReadonlyArray<ReaderAstNode>;

export type ReaderScalarField = {
  readonly kind: 'Scalar';
  readonly fieldName: string;
  readonly alias: string | null;
  readonly arguments: Arguments | null;
};

export type ReaderLinkeField = {
  readonly kind: 'Link';
  readonly alias: string;
};

export type ReaderLinkedField = {
  readonly kind: 'Linked';
  readonly fieldName: string;
  readonly alias: string | null;
  readonly selections: ReaderAst<unknown>;
  readonly arguments: Arguments | null;
  readonly condition: EagerReaderArtifact<
    { data: object; parameters: object },
    boolean | Link | null
  > | null;
};

export type ReaderNonLoadableResolverField = {
  readonly kind: 'Resolver';
  readonly alias: string;
  // TODO don't type this as any
  readonly readerArtifact: TopLevelReaderArtifact<any, any, any>;
  readonly arguments: Arguments | null;
  readonly usedRefetchQueries: number[];
};

export type ReaderImperativelyLoadedField = {
  readonly kind: 'ImperativelyLoadedField';
  readonly alias: string;
  readonly refetchReaderArtifact: RefetchReaderArtifact;
  readonly refetchQuery: number;
  readonly name: string;
};

export type ReaderLoadableField = {
  readonly kind: 'LoadablySelectedField';
  readonly alias: string;

  // To generate a stable id, we need the parent id + the name + the args that
  // we pass to the field, which come from: queryArgs, refetchReaderAst
  // (technically, but in practice that is always "id") and the user-provided args.
  readonly name: string;
  readonly queryArguments: Arguments | null;
  readonly refetchReaderAst: ReaderAst<any>;

  // TODO we should not type these as any
  readonly entrypoint:
    | IsographEntrypoint<any, any>
    | IsographEntrypointLoader<any, any>;
};

type StableId = string;
/// Why is LoadableField the way it is? Let's work backwards.
///
/// We ultimately need a stable id (for deduplication) and a way to produce a
/// FragmentReference (i.e. a Factory). However, this stable id depends on the
/// arguments that we pass in, hence we get the current form of LoadableField.
///
/// Passing TArgs to the LoadableField should be cheap and do no "actual" work,
/// except to stringify the args or whatnot. Calling the factory can be
/// expensive. For example, doing so will probably trigger a network request.
export type LoadableField<
  TReadFromStore extends { data: object; parameters: object },
  TResult,
  TArgs = ExtractParameters<TReadFromStore>,
> = (
  args: TArgs | void,
  // Note: fetchOptions is not nullable here because a LoadableField is not a
  // user-facing API. Users should only interact with LoadableFields via APIs
  // like useClientSideDefer. These APIs should have a nullable fetchOptions
  // parameter, and provide a default value ({}) to the LoadableField.
  fetchOptions: FetchOptions<TResult>,
) => [StableId, Factory<FragmentReference<TReadFromStore, TResult>>];
