import type {ReaderArtifact, ReaderAst} from '@isograph/react';
import { PetUpdater as resolver } from '../../../components/PetUpdater.tsx';
import Pet__set_pet_best_friend, { ReadOutType as Pet__set_pet_best_friend__outputType } from '../set_pet_best_friend/reader';
import Pet__set_pet_tagline, { ReadOutType as Pet__set_pet_tagline__outputType } from '../set_pet_tagline/reader';

// the type, when read out (either via useLazyReference or via graph)
export type ReadOutType = (React.FC<any>);

export type ReadFromStoreType = ResolverParameterType;

const readerAst: ReaderAst<ReadFromStoreType> = [
  {
    kind: "MutationField",
    alias: "set_pet_best_friend",
    readerArtifact: Pet__set_pet_best_friend,
    refetchQuery: 0,
  },
  {
    kind: "Linked",
    fieldName: "potential_new_best_friends",
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
        kind: "Scalar",
        fieldName: "name",
        alias: null,
        arguments: null,
      },
    ],
  },
  {
    kind: "MutationField",
    alias: "set_pet_tagline",
    readerArtifact: Pet__set_pet_tagline,
    refetchQuery: 1,
  },
  {
    kind: "Scalar",
    fieldName: "tagline",
    alias: null,
    arguments: null,
  },
];

export type ResolverParameterType = { data:
{
  set_pet_best_friend: Pet__set_pet_best_friend__outputType,
  potential_new_best_friends: ({
    id: string,
    name: string,
  })[],
  set_pet_tagline: Pet__set_pet_tagline__outputType,
  tagline: string,
},
[index: string]: any };

// The type, when returned from the resolver
export type ResolverReturnType = ReturnType<typeof resolver>;

const artifact: ReaderArtifact<ReadFromStoreType, ResolverParameterType, ReadOutType> = {
  kind: "ReaderArtifact",
  resolver: resolver as any,
  readerAst,
  variant: { kind: "Component", componentName: "Pet.PetUpdater" },
};

export default artifact;
