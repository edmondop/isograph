import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst, RefetchQueryNormalizationArtifact} from '@isograph/react';
import { Query__HomeRoute__param } from './param_type';
import { HomeRoute as resolver } from '../../../HomeRoute.tsx';
import Pet__PetSummaryCard from '../../Pet/PetSummaryCard/resolver_reader';

const readerAst: ReaderAst<Query__HomeRoute__param> = [
  {
    kind: "Linked",
    fieldName: "pets",
    alias: null,
    arguments: null,
    selections: [
      {
        kind: "Scalar",
        fieldName: "id",
        alias: null,
        arguments: null,
      },
      {
        kind: "Resolver",
        alias: "PetSummaryCard",
        arguments: null,
        readerArtifact: Pet__PetSummaryCard,
        usedRefetchQueries: [],
      },
    ],
  },
];

const artifact: ComponentReaderArtifact<
  Query__HomeRoute__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  componentName: "Query.HomeRoute",
  resolver,
  readerAst,
};

export default artifact;