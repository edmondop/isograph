import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { User__RepositoryList__param } from './param_type';
import { RepositoryList as resolver } from '../../../UserRepositoryList';
import User__RepositoryConnection__entrypoint from '../../User/RepositoryConnection/entrypoint';

const readerAst: ReaderAst<User__RepositoryList__param> = [
  {
    kind: "LoadablySelectedField",
    alias: "RepositoryConnection",
    name: "RepositoryConnection",
    queryArguments: null,
    refetchReaderAst: [
      {
        kind: "Scalar",
        fieldName: "id",
        alias: null,
        arguments: null,
      },
    ],
    entrypoint: User__RepositoryConnection__entrypoint,
  },
];

const artifact: ComponentReaderArtifact<
  User__RepositoryList__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  componentName: "User.RepositoryList",
  resolver,
  readerAst,
};

export default artifact;
