import type {IsographEntrypoint} from '@isograph/react';
import entrypoint_Query__HomePage from '../__isograph/Query/HomePage/entrypoint'
import entrypoint_Query__PullRequest from '../__isograph/Query/PullRequest/entrypoint'
import entrypoint_Query__RepositoryPage from '../__isograph/Query/RepositoryPage/entrypoint'
import entrypoint_Query__UserPage from '../__isograph/Query/UserPage/entrypoint'
import { ResolverParameterType as field_Actor__UserLink } from './Actor/UserLink/reader'
import { ResolverParameterType as field_IssueComment__formattedCommentCreationDate } from './IssueComment/formattedCommentCreationDate/reader'
import { ResolverParameterType as field_PullRequest__CommentList } from './PullRequest/CommentList/reader'
import { ResolverParameterType as field_PullRequest__PullRequestLink } from './PullRequest/PullRequestLink/reader'
import { ResolverParameterType as field_PullRequest__createdAtFormatted } from './PullRequest/createdAtFormatted/reader'
import { ResolverParameterType as field_PullRequestConnection__PullRequestTable } from './PullRequestConnection/PullRequestTable/reader'
import { ResolverParameterType as field_Query__Header } from './Query/Header/reader'
import { ResolverParameterType as field_Query__HomePageList } from './Query/HomePageList/reader'
import { ResolverParameterType as field_Query__HomePage } from './Query/HomePage/reader'
import { ResolverParameterType as field_Query__PullRequestDetail } from './Query/PullRequestDetail/reader'
import { ResolverParameterType as field_Query__PullRequest } from './Query/PullRequest/reader'
import { ResolverParameterType as field_Query__RepositoryDetail } from './Query/RepositoryDetail/reader'
import { ResolverParameterType as field_Query__RepositoryPage } from './Query/RepositoryPage/reader'
import { ResolverParameterType as field_Query__UserDetail } from './Query/UserDetail/reader'
import { ResolverParameterType as field_Query__UserPage } from './Query/UserPage/reader'
import { ResolverParameterType as field_Repository__RepositoryLink } from './Repository/RepositoryLink/reader'
import { ResolverParameterType as field_User__Avatar } from './User/Avatar/reader'
import { ResolverParameterType as field_User__RepositoryList } from './User/RepositoryList/reader'

type IdentityWithParam<TParam> = <TResolverReturn>(
  x: (param: TParam) => TResolverReturn
) => (param: TParam) => TResolverReturn;

type WhitespaceCharacter = ' ' | '\t' | '\n';
type Whitespace<In> = In extends `${WhitespaceCharacter}${infer In}`
  ? Whitespace<In>
  : In;

type MatchesWhitespaceAndString<
  TString extends string,
  T
> = Whitespace<T> extends `${TString}${string}` ? T : never;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.HomePage', T>
): typeof entrypoint_Query__HomePage;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.PullRequest', T>
): typeof entrypoint_Query__PullRequest;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.RepositoryPage', T>
): typeof entrypoint_Query__RepositoryPage;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'entrypoint Query.UserPage', T>
): typeof entrypoint_Query__UserPage;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Actor.UserLink', T>
): IdentityWithParam<field_Actor__UserLink>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field IssueComment.formattedCommentCreationDate', T>
): IdentityWithParam<field_IssueComment__formattedCommentCreationDate>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field PullRequest.CommentList', T>
): IdentityWithParam<field_PullRequest__CommentList>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field PullRequest.PullRequestLink', T>
): IdentityWithParam<field_PullRequest__PullRequestLink>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field PullRequest.createdAtFormatted', T>
): IdentityWithParam<field_PullRequest__createdAtFormatted>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field PullRequestConnection.PullRequestTable', T>
): IdentityWithParam<field_PullRequestConnection__PullRequestTable>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.Header', T>
): IdentityWithParam<field_Query__Header>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.HomePageList', T>
): IdentityWithParam<field_Query__HomePageList>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.HomePage', T>
): IdentityWithParam<field_Query__HomePage>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.PullRequestDetail', T>
): IdentityWithParam<field_Query__PullRequestDetail>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.PullRequest', T>
): IdentityWithParam<field_Query__PullRequest>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.RepositoryDetail', T>
): IdentityWithParam<field_Query__RepositoryDetail>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.RepositoryPage', T>
): IdentityWithParam<field_Query__RepositoryPage>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.UserDetail', T>
): IdentityWithParam<field_Query__UserDetail>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Query.UserPage', T>
): IdentityWithParam<field_Query__UserPage>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field Repository.RepositoryLink', T>
): IdentityWithParam<field_Repository__RepositoryLink>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field User.Avatar', T>
): IdentityWithParam<field_User__Avatar>;

export function iso<T>(
  param: T & MatchesWhitespaceAndString<'field User.RepositoryList', T>
): IdentityWithParam<field_User__RepositoryList>;

export function iso(_isographLiteralText: string): IdentityWithParam<any> | IsographEntrypoint<any, any, any>{
  return function identity<TResolverReturn>(
    clientFieldOrEntrypoint: (param: any) => TResolverReturn,
  ): (param: any) => TResolverReturn {
    return clientFieldOrEntrypoint;
  };
}