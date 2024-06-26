import type {EagerReaderArtifact, ReaderAst, RefetchQueryNormalizationArtifact} from '@isograph/react';
import { Mutation__SetTagline__param } from './param_type';
import { Mutation__SetTagline__outputType } from './output_type';
import { setTagline as resolver } from '../../../PetTaglineCard.tsx';

const readerAst: ReaderAst<Mutation__SetTagline__param> = [
  {
    kind: "Linked",
    fieldName: "set_pet_tagline",
    alias: null,
    arguments: [
      [
        "input",
        { kind: "Variable", name: "input" },
      ],
    ],
    selections: [
      {
        kind: "Linked",
        fieldName: "pet",
        alias: null,
        arguments: null,
        selections: [
          {
            kind: "Scalar",
            fieldName: "tagline",
            alias: null,
            arguments: null,
          },
        ],
      },
    ],
  },
];

const artifact: EagerReaderArtifact<
  Mutation__SetTagline__param,
  Mutation__SetTagline__outputType
> = {
  kind: "EagerReaderArtifact",
  resolver,
  readerAst,
};

export default artifact;
