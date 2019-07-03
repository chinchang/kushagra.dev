---
layout: post
title: "How I saved 100KB with React.lazy"
tags:
  - react
---

This post is about how I was able to reduce my homepage JavaScript by more around 100Kb.

<div>
<strong>TL;DR</strong>: Use <a rel="external"><code>React.lazy</code></a> and <a rel="external"><code>React.Suspense</code></a> to lazy load your non-critical dependencies
</div>

I have a React app bootstrapped from **create-react-app**. One of the page (just a React Component) in that app uses **CodeMirror** (a code editor). The app uses _react-router_ for routing. And so this page component, just like all other pages, is imported in the main `App` component to provide to the router.

**App.js**

```js
import Page1 from "./Page1";
import Page2 from "./Page2";

function App() {
  <Router>
    <Route path="/page1" component={Page1} />
    <Route path="/page2" component={Page2} />
  </Router>;
}
```

**Page2.js**

```js
import CodeMirror from "react-codemirror";

function App() {
  return (
    <div>
      <CodeMirror />
    </div>
  );
}
```

This situation leads to `Page2.js` being a synchronous dependency to render `App.js`. And `Page2.js` in turn depends on `react-codemirror`. So indirectly, `react-codemirror` becomes a synchronous dependency to render `App.js`. This basically means whatever page we visit, `react-codemirror` will be fetched and parsed before the page renders. Even if Codemirror is not even being used on that page! Let's fix this.

That's all folks. If you have any questions or comments, reply in the comments or ask on Twitter [@chinchang457](https://twitter.com/chinchang457).
