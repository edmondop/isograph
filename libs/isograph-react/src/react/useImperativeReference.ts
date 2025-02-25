import {
  UnassignedState,
  useUpdatableDisposableState,
} from '@isograph/react-disposable-state';
import { FetchOptions } from '../core/check';
import { IsographEntrypoint } from '../core/entrypoint';
import {
  ExtractParameters,
  FragmentReference,
} from '../core/FragmentReference';
import { ROOT_ID } from '../core/IsographEnvironment';
import { maybeMakeNetworkRequest } from '../core/makeNetworkRequest';
import { wrapResolvedValue } from '../core/PromiseWrapper';
import { useIsographEnvironment } from './IsographEnvironmentProvider';

// TODO rename this to useImperativelyLoadedEntrypoint

export function useImperativeReference<
  TReadFromStore extends { parameters: object; data: object },
  TClientFieldValue,
>(
  entrypoint: IsographEntrypoint<TReadFromStore, TClientFieldValue>,
): {
  fragmentReference:
    | FragmentReference<TReadFromStore, TClientFieldValue>
    | UnassignedState;
  loadFragmentReference: (
    variables: ExtractParameters<TReadFromStore>,
    fetchOptions?: FetchOptions<TClientFieldValue>,
  ) => void;
} {
  const { state, setState } =
    useUpdatableDisposableState<
      FragmentReference<TReadFromStore, TClientFieldValue>
    >();
  const environment = useIsographEnvironment();
  return {
    fragmentReference: state,
    loadFragmentReference: (
      variables: ExtractParameters<TReadFromStore>,
      fetchOptions?: FetchOptions<TClientFieldValue>,
    ) => {
      const [networkRequest, disposeNetworkRequest] = maybeMakeNetworkRequest(
        environment,
        entrypoint,
        variables,
        fetchOptions,
      );
      setState([
        {
          kind: 'FragmentReference',
          readerWithRefetchQueries: wrapResolvedValue({
            kind: 'ReaderWithRefetchQueries',
            readerArtifact: entrypoint.readerWithRefetchQueries.readerArtifact,
            nestedRefetchQueries:
              entrypoint.readerWithRefetchQueries.nestedRefetchQueries,
          }),
          root: { __link: ROOT_ID, __typename: entrypoint.concreteType },
          variables,
          networkRequest,
        },
        () => {
          disposeNetworkRequest();
        },
      ]);
    },
  };
}
