import type {ReaderArtifact, ReaderAst} from '@isograph/react';
import { PullRequest as resolver } from '../../../PullRequestRoute.tsx';
import Query__Header, { ReadOutType as Query__Header__outputType } from '../Header/reader';
import Query__PullRequestDetail, { ReadOutType as Query__PullRequestDetail__outputType } from '../PullRequestDetail/reader';

// the type, when read out (either via useLazyReference or via graph)
export type ReadOutType = (React.FC<any>);

export type ReadFromStoreType = Query__PullRequest__param;

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
    alias: "PullRequestDetail",
    arguments: null,
    readerArtifact: Query__PullRequestDetail,
    usedRefetchQueries: [],
  },
];

export type Query__PullRequest__param = { data:
{
  Header: Query__Header__outputType,
  PullRequestDetail: Query__PullRequestDetail__outputType,
},
[index: string]: any };

// The type, when returned from the resolver
export type ResolverReturnType = ReturnType<typeof resolver>;

const artifact: ReaderArtifact<ReadFromStoreType, Query__PullRequest__param, ReadOutType> = {
  kind: "ReaderArtifact",
  resolver: resolver as any,
  readerAst,
  variant: { kind: "Component", componentName: "Query.PullRequest" },
};

export default artifact;
