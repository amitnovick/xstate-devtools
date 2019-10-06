# XState DevTools

A browser extension for inspecting XState machines running in your app.

Powered by the awesome [XState-Viz project](https://github.com/statecharts/xstate-viz) by [David Khourshid](https://github.com/davidkpiano).

**Note**: A new XState version is required for this to work, which is yet **unavailable**. It should work with it as soon as the [necessary changes are merged](https://github.com/davidkpiano/xstate/pull/691) and a new release of XState includes these changes.

## Super quick start

In the root and public directory (`xstate-devtools/` & `xstate-devtools/public`) run

```bash
npm i
```

In root run

```bash
npm link
```

In public run

```bash
npm link @statecharts/xstate-viz
```

In root run

```bash
npm run develop
```
