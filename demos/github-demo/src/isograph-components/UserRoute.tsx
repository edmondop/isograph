import React from 'react';
import { IsographEntrypoint, iso, read, useLazyReference } from '@isograph/react';
import { Container } from '@mui/material';

import { ResolverParameterType as UserRouteComponentParams } from '@iso/Query/UserPage/reader.isograph';
import { FullPageLoading, Route, type UserRoute as UserRouteType } from './GithubDemo';

import Entrypoint from '@iso/Query/UserPage/entrypoint.isograph';

export const UserPage = iso<UserRouteComponentParams>`
  field Query.UserPage($first: Int!, $userLogin: String!) @component {
    Header,
    UserDetail,
  }
`(UserRouteComponentComponent);

function UserRouteComponentComponent({ data, route, setRoute }: UserRouteComponentParams) {
  return (
    <>
      <data.Header route={route} setRoute={setRoute} />
      <Container maxWidth="md">
        <React.Suspense fallback={<FullPageLoading />}>
          <data.UserDetail setRoute={setRoute} />
        </React.Suspense>
      </Container>
    </>
  );
}

export function UserRoute({
  route,
  setRoute,
}: {
  route: UserRouteType;
  setRoute: (route: Route) => void;
}) {
  const { queryReference } = useLazyReference<typeof Entrypoint>(iso`entrypoint Query.UserPage`, {
    userLogin: route.userLogin,
    first: 20,
  });
  const Component = read(queryReference);
  return <Component route={route} setRoute={setRoute} />;
}