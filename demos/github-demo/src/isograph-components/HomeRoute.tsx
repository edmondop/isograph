import React, { useEffect, useState } from 'react';
import { useRead, useLazyReference, subscribe } from '@isograph/react';

import { iso } from '@iso';
import { Container } from '@mui/material';

import { ResolverParameterType as HomePageComponentParams } from '@iso/Query/HomePage/reader';
import HomePageEntrypoint from '@iso/Query/HomePage/entrypoint';

import { FullPageLoading, Route } from './GithubDemo';
import { RepoGitHubLink } from './RepoGitHubLink';

export const HomePage = iso(`
  field Query.HomePage($first: Int!) @component {
    Header,
    HomePageList,
  }
`)(HomePageComponent);

function HomePageComponent({ data, route, setRoute }: HomePageComponentParams) {
  return (
    <>
      <data.Header route={route} setRoute={setRoute} />
      <Container maxWidth="md">
        <RepoGitHubLink filePath="demos/github-demo/src/isograph-components/HomeRoute.tsx">
          Home Page Route
        </RepoGitHubLink>
        <React.Suspense fallback={<FullPageLoading />}>
          <data.HomePageList route={route} setRoute={setRoute} />
        </React.Suspense>
      </Container>
    </>
  );
}

export function HomeRoute({
  route,
  setRoute,
}: {
  route: Route;
  setRoute: (route: Route) => void;
}) {
  const { queryReference } = useLazyReference<typeof HomePageEntrypoint>(
    iso(`entrypoint Query.HomePage`),
    {
      first: 15,
    },
  );
  const Component = useRead(queryReference);
  return <Component route={route} setRoute={setRoute} />;
}
