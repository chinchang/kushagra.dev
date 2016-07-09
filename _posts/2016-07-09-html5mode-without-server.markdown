---
layout: post
title: "HTML5 mode without server-side code"
---

## Issue

If you ever worked on a Single Page App (SPA), you would know that the URLs in the app either work using hash(#) or without hash - also called as *HTML5 mode* in most frameworks. For *HTML5 mode* to work though, you need to write server-side rewrite code to always serve `index.html` for every page requested.

Eg. `www.yourapp.com/product/13` or `www.yourapp.com/user/setting` should all respond with `index.html` because in SPAs, there are no separate html files that can directly/independently render in the browser, except `index.html`.

But what if you could get the HTML5 mode working without any server-side code?

## The Trick

I read this trick on [Coderwall](https://coderwall.com/p/kfomwa/angularjs-html5mode-on-github-pages) sometime back and decided to give it a shot. The trick is simple, if you do not have proper rewrite rules on the server, requesting a URL like `www.yourapp.com/user/13` would try fetching a resource on the path `user/13/`, which isn't actually present. So your app would send in a `404.html` in this case. But we want it to respond with index.html. What if we make `404.html` same as `index.html`?? 😎

For this demo, I have implemented a basic SPA using [Vue.js](http://vuejs.org/) as the JavaScript framework and deployed it on Github pages.

<a href="https://kushagragour.in/vuejs-html5mode" class="button">Demo</a>
<a href="https://github.com/chinchang/vuejs-html5mode" class="button">Source</a>

The main thing to notice there is if you refresh the app on a path other than `https://kushagragour.in/vuejs-html5mode/`, you would see a 404 in the network panel.


## Things to keep in mind

First, you would have a 404 from the server when a user lands on any path other than the root. No big deal, just that there would be a red entry in the network panel.

Second, and more importantly, you are using your 404 page to make an `index.html` clone. That means that you no more have a real 404 page to show to your users. One way I think of to fix this is by having a script in `404.html` that validates the current URL for valid URL and if its not, renders the 404 stuff instead of usual `index.html` contents.
