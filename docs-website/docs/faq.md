# FAQ

## Why does Isograph not support strict mode?

In dev mode, React strict mode "will automatically unmount and remount every component, whenever a component mounts for the first time, restoring the previous state on the second mount."

This behavior is currently incompatible with the implementation of `useLazyReference`, which creates some state **during the initial render** and which is cleaned up when the component unmounts. "Restoring the previous state" causes the component to be in an invalid state, as the state is disposed but referenced.

The most obvious way to add compatibility with strict mode will mean making network requests twice in dev mode.

## Why do I need to create the Isograph environment in a component? Can I just use a global environment?

If you are using NextJS, it is **extremely important** to not create the environment at the top level (i.e. in module scope.) If you do this, **NextJS will reuse the environment across requests,** so different users will share the same environment!

Create the environment during the render of a component is sufficient to avoid this. However, you should also memoize the creation of the environment so that if (for whatever reason), your `App` component re-renders, you do not recreate the environment, thus losing data.

## What if I want to run Isograph without Typescript?

## What if I want to run Isograph without Babel?

## How do I authenticate with an external API?

You may need to provide a bearer token if you are using a public API, such as the GitHub API. See [this GitHub demo](https://github.com/rbalicki2/github-isograph-demo/tree/885530d74d9b8fb374dfe7d0ebdab7185d207c3a/src/isograph-components/SetNetworkWrapper.tsx) for an example of how to do with a token that you receive from OAuth. See also the `[...nextauth].tsx` file in the same repo.

## Why is there special handling of `@component`?