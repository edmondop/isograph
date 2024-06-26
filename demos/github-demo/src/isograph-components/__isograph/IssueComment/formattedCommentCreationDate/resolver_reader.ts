import type {EagerReaderArtifact, ReaderAst, RefetchQueryNormalizationArtifact} from '@isograph/react';
import { IssueComment__formattedCommentCreationDate__param } from './param_type';
import { IssueComment__formattedCommentCreationDate__outputType } from './output_type';
import { formattedCommentCreationDate as resolver } from '../../../CommentList.tsx';

const readerAst: ReaderAst<IssueComment__formattedCommentCreationDate__param> = [
  {
    kind: "Scalar",
    fieldName: "createdAt",
    alias: null,
    arguments: null,
  },
];

const artifact: EagerReaderArtifact<
  IssueComment__formattedCommentCreationDate__param,
  IssueComment__formattedCommentCreationDate__outputType
> = {
  kind: "EagerReaderArtifact",
  resolver,
  readerAst,
};

export default artifact;
