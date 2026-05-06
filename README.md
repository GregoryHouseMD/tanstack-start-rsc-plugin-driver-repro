# TanStack Start RSC Server Function Build Repro

Minimal reproduction for a TanStack Start RSC production build regression in
the `tanstack-start-core::server-fn:rsc` plugin.

## Reproduce

```sh
pnpm install
pnpm build
```

Expected result: the build should succeed.

Actual result with the committed lockfile:

```text
[plugin tanstack-start-core::server-fn:rsc] src/server/communityPageInitialData.ts?tss-serverfn-split
Error: Errored while resolving "zod" in `this.resolve`. Got Plugin driver is already dropped..
```

## Regression Check

With the same source files and toolchain:

- `@tanstack/react-start@1.167.64` fails
- `@tanstack/react-start@1.167.57` builds successfully

## Notes

The failure is triggered by a server function module with:

- RSC enabled in `vite.config.ts`
- a top-level Zod schema
- `.inputValidator(inputSchema)`
- `createServerOnlyFn(...)`

The same application shape is accepted by the documented TanStack Start server
function API, where Zod schemas may be passed to `.inputValidator(...)`.

## Environment Used To Verify

```text
node                        25.9.0
pnpm                        11.0.0
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
