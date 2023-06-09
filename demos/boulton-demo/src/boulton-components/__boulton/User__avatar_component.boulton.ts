import type {BoultonNonFetchableResolver, ReaderAst} from '@boulton/react';
import { avatar_component as resolver } from '../avatar.tsx';

// TODO generate actual types
export type ReadOutType = string;

const readerAst: ReaderAst<ResolverParameterType> = [
  {
    kind: "Scalar",
    response_name: "name",
    alias: null,
    arguments: null,
  },
  {
    kind: "Scalar",
    response_name: "email",
    alias: null,
    arguments: null,
  },
  {
    kind: "Scalar",
    response_name: "avatar_url",
    alias: null,
    arguments: null,
  },
];

const artifact: BoultonNonFetchableResolver = {
  kind: 'NonFetchableResolver',
  resolver,
  readerAst,
};

export default artifact;
