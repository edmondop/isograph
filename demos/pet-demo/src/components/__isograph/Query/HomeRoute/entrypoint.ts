import type {IsographEntrypoint, NormalizationAst, RefetchQueryArtifactWrapper} from '@isograph/react';
import type {ReadFromStoreType, Query__HomeRoute__param, ReadOutType} from './reader';
import readerResolver from './reader';
const nestedRefetchQueries: RefetchQueryArtifactWrapper[] = [];

const queryText = 'query HomeRoute  {\
  pets {\
    id,\
    name,\
    picture,\
    tagline,\
  },\
}';

const normalizationAst: NormalizationAst = [
  {
    kind: "Linked",
    fieldName: "pets",
    arguments: null,
    selections: [
      {
        kind: "Scalar",
        fieldName: "id",
        arguments: null,
      },
      {
        kind: "Scalar",
        fieldName: "name",
        arguments: null,
      },
      {
        kind: "Scalar",
        fieldName: "picture",
        arguments: null,
      },
      {
        kind: "Scalar",
        fieldName: "tagline",
        arguments: null,
      },
    ],
  },
];
const artifact: IsographEntrypoint<ReadFromStoreType, Query__HomeRoute__param, ReadOutType> = {
  kind: "Entrypoint",
  queryText,
  normalizationAst,
  nestedRefetchQueries,
  readerArtifact: readerResolver,
};

export default artifact;
