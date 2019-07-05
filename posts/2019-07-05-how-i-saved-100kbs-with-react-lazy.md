---
layout: post
title: "How I saved 100KB with React.lazy"
tags:
  - react
---

This post is about how I was able to reduce my homepage JavaScript by more around 100Kb.

<div>
<strong>TL;DR</strong>: Use <a rel="external" href="https://reactjs.org/docs/code-splitting.html#reactlazy"><code>React.lazy</code></a> and <a rel="external" href="https://reactjs.org/docs/code-splitting.html#suspense"><code>React.Suspense</code></a> to lazy load your non-critical dependencies
</div>

I have a React app bootstrapped from [create-react-app][create-react-app]. One of the page (just a React Component) in that app uses [CodeMirror][codemirror] (a code editor). The app uses [react-router][react-router] for routing. And so this page component, just like all other pages, is imported in the main `App` component to provide to the router.

**App.js**

```js
import Home from "./Home";
import Page2 from "./Page2";

function App() {
  <Router>
    <Route path="/" component={Home} />
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

_Note_: `react-codemirror` actually does a named export. But for simplicity, I am assuming a default export.

This situation leads to `Page2.js` being a synchronous dependency to render `App.js`. And `Page2.js` in turn depends on `react-codemirror`. So indirectly, `react-codemirror` becomes a synchronous dependency to render `App.js`. This basically means whatever page we visit, `react-codemirror` will be fetched and parsed before the page renders. Even if Codemirror is not even being used on that page! Let's fix this.

## Solution

The solution is pretty neat and easy. React recently introduced a new API: [`React.lazy`][react-lazy]. And an accompanying component called [`Suspense`][react-suspense]. Here is how we use them to fix our problem.

## Step 1: Make the import lazy

`Page2.js` imports `react-codemirror`. Ideally we want that `Page2.js` should load `react-codemirror` asynchronously when Page2 is actually visited.

This is our current `Page2.js`:

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

Using the `React.lazy` API, we can make the import lazy. Like so:

```js
import React from "react";
const CodeMirror = React.lazy(() => import("react-codemirror"));

function App() {
  return (
    <div>
      <CodeMirror />
    </div>
  );
}
```

And this just starts working out of the box! No more change required in the way `CodeMirror` component is used. What you'll notice now is initially when you are on homepage, CodeMirror doesn't load. When you visit _/page2/_, you see blank area where CodeMirror was to be rendered, for a short duration while CodeMirror loads asynchronously. And then when it has finished loading, `CodeMirror` component renders.

While CodeMirror is being fetched, there is just blank space where CodeMirror editor should have been present. That is not such a good experience as user is left without any information about that blank space. That is where `React.Suspense` component comes into action.

## Step 2: Improve the blank space context

Here is all we need to do to make the experience better:

```js
import React, { Suspense } from "react";
const CodeMirror = React.lazy(() => import("react-codemirror"));

function App() {
  return (
    <div>
      <Suspense fallback="Loading editor...">
        <CodeMirror />
      </Suspense>
    </div>
  );
}
```

We wrap the asynchronous/lazy components with a `Suspense` tag and give it a `fallback` which should show instead of blank space. That is it!

## Bonus tip

There is one special requirement for using `React.lazy` which you need to be aware of. It only works with component that have default [export][exports]. So components with named exports can't be lazily imported with it. But you might have components with named exports, what to do then? There is a small trick. Let's assume our `Page2.js` file exported `Page2` component so that it was initially imported as `import {CodeMirror} from 'react-codemirror'`. In that case, we can use `React.lazy` on it as follows:

```js/2
import React, { Suspense } from "react";
const CodeMirror = lazy(() =>
  import("react-codemirror").then(module => ({ default: module.CodeMirror }))
);

function App() {
  return (
    <div>
      <Suspense fallback="Loading editor...">
        <CodeMirror />
      </Suspense>
    </div>
  );
}
```

What we did here is once we import the named module, inside the `then` callback we turn it into a seemingly default exported module - an object with the module available on `default` key.

That's all folks! Go shave off some unnecessary bytes of your pages. If you have any questions or comments, ask me on Twitter [@chinchang457](https://twitter.com/chinchang457) (DMs are open).

[react-lazy]: https://reactjs.org/docs/code-splitting.html#reactlazy
[react-suspense]: https://reactjs.org/docs/code-splitting.html#suspense
[create-react-app]: https://github.com/facebook/create-react-app
[codemirror]: https://codemirror.net/
[react-router]: https://reacttraining.com/react-router/
[exports]: https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export
