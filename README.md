A browser extension for inspecting XState machines running in your app.

Powered by the awesome [XState-Viz project](https://github.com/statecharts/xstate-viz) by [David Khourshid](https://github.com/davidkpiano).

**Note**: The extension requires XState version v4.7.0 or newer. For now, you can get it via:

```sh
npm install xstate@next
```

# Quick Start

If you wanna play around with it as easily as possible, I would suggest:

1. Install the [XState DevTools](https://chrome.google.com/webstore/detail/xstate-devtools/aamnodipnlopbknpklfoabalmobheehc) Chrome extension
2. Open up this [Calculator CodeSandbox](https://codesandbox.io/s/green-feather-oxcw7) here which already uses `xstate@next`
3. Make sure to click **Open in New Window**
4. Open up the DevTools and pick the XState DevTools panel
5. Let me know how it goes! 👍

# Download

| Browser | Download                                                                                                                                                                                                                                                                          |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chrome  | <a href='https://chrome.google.com/webstore/detail/xstate-devtools/aamnodipnlopbknpklfoabalmobheehc'><img alt='Get extension for Google Chrome' width="134px" src='https://raw.githubusercontent.com/amitnovick/xstate-devtools/master/docs/badge-google-chrome-340x96.png'/></a> |
| Firefox | Sometime soon™!                                                                                                                                                                                                                                                                   |

# Development

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
