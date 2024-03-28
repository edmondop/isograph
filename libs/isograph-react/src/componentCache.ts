import { stableCopy } from './cache';
import { RefetchQueryArtifactWrapper } from './entrypoint';
import { IsographEnvironment, DataId } from './IsographEnvironment';
import { readButDoNotEvaluate } from './read';
import { ReaderArtifact } from './reader';

export function getOrCreateCachedComponent(
  environment: IsographEnvironment,
  root: DataId,
  componentName: string,
  readerArtifact: ReaderArtifact<any, any>,
  variables: { [key: string]: string },
  resolverRefetchQueries: RefetchQueryArtifactWrapper[],
) {
  const cachedComponentsById = environment.componentCache;
  const stringifiedArgs = JSON.stringify(stableCopy(variables));
  cachedComponentsById[root] = cachedComponentsById[root] ?? {};
  const componentsByName = cachedComponentsById[root];
  componentsByName[componentName] = componentsByName[componentName] ?? {};
  const byArgs = componentsByName[componentName];
  byArgs[stringifiedArgs] =
    byArgs[stringifiedArgs] ??
    (() => {
      function Component(additionalRuntimeProps: { [key: string]: any }) {
        const data = readButDoNotEvaluate(environment, {
          kind: 'FragmentReference',
          readerArtifact: readerArtifact,
          root,
          variables,
          nestedRefetchQueries: resolverRefetchQueries,
        });

        return readerArtifact.resolver(data, additionalRuntimeProps);
      }
      Component.displayName = `${componentName} (id: ${root}) @component`;
      return Component;
    })();
  return byArgs[stringifiedArgs];
}
