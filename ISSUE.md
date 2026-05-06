# Bug Report Draft

## Title

RSC build regression: `tanstack-start-core::server-fn:rsc` calls `this.resolve` after Rolldown plugin driver is dropped

## Description

A minimal TanStack Start app with RSC enabled fails during production build when a server function module contains a top-level Zod schema passed to `.inputValidator(...)`.

This appears to regress between `@tanstack/react-start@1.167.57` and `@tanstack/react-start@1.167.64`.

## Reproduction

```sh
git clone https://github.com/GregoryHouseMD/tanstack-start-rsc-plugin-driver-repro.git
cd tanstack-start-rsc-plugin-driver-repro
pnpm install
pnpm build
```

## Actual Behavior

The build fails during `[3/5] build rsc environment`:

```text
[plugin tanstack-start-core::server-fn:rsc] src/server/communityPageInitialData.ts?tss-serverfn-split
Error: Errored while resolving "zod" in `this.resolve`. Got Plugin driver is already dropped..
```

## Expected Behavior

The production build should succeed.

The server function shape appears to match the documented API:

```ts
const inputSchema = z.object({
  communitySlug: z.string().min(1),
})

export const getCommunityPageShellData = createServerFn({ method: 'GET' })
  .inputValidator(inputSchema)
  .handler(async ({ data }) => {
    // ...
  })
```

## Version Matrix

Fails:

```text
@tanstack/react-start       1.167.64
@tanstack/start-plugin-core 1.169.19
@tanstack/react-start-rsc   0.0.43
@vitejs/plugin-rsc          0.5.25
vite                        8.0.10
rolldown                    1.0.0-rc.17
react                       19.2.5
react-dom                   19.2.5
zod                         4.4.3
```

Builds successfully with the same source files:

```text
@tanstack/react-start 1.167.57
```

## Notes From Investigation

The failure is not a missing `zod` dependency. `zod` is installed and resolvable.

The error is thrown from Rolldown while the TanStack server-fn RSC plugin is resolving the `zod` import through `this.resolve`.

I also tested Vite's Rolldown native plugin settings:

```ts
experimental: {
  enableNativePlugin: false,
}
```

and:

```ts
experimental: {
  enableNativePlugin: 'resolver',
}
```

Both settings reproduced the same failure.
