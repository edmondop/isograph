import type {ReaderArtifact, ReaderAst} from '@isograph/react';
import { HomePage as resolver } from '../../../HomeRoute.tsx';
import Query__Header, { ReadOutType as Query__Header__outputType } from '../Header/reader';
import Query__HomePageList, { ReadOutType as Query__HomePageList__outputType } from '../HomePageList/reader';

// the type, when read out (either via useLazyReference or via graph)
export type ReadOutType = (React.FC<any>);

export type ReadFromStoreType = Query__HomePage__param;

const readerAst: ReaderAst<ReadFromStoreType> = [
  {
    kind: "Resolver",
    alias: "Header",
    arguments: null,
    readerArtifact: Query__Header,
    usedRefetchQueries: [],
  },
  {
    kind: "Resolver",
    alias: "HomePageList",
    arguments: null,
    readerArtifact: Query__HomePageList,
    usedRefetchQueries: [0, ],
  },
];

export type Query__HomePage__param = { data:
{
  Header: Query__Header__outputType,
  HomePageList: Query__HomePageList__outputType,
},
[index: string]: any };

// The type, when returned from the resolver
export type ResolverReturnType = ReturnType<typeof resolver>;

const artifact: ReaderArtifact<ReadFromStoreType, Query__HomePage__param, ReadOutType> = {
  kind: "ReaderArtifact",
  resolver: resolver as any,
  readerAst,
  variant: { kind: "Component", componentName: "Query.HomePage" },
};

export default artifact;
