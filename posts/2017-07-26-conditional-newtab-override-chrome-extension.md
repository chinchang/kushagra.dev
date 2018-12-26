---
layout: post
title: "Overriding new tab page in Chrome extension, conditionally!"
---

If you use Chrome extensions like Momentum, Panda etc you know that Chrome extensions have the ability to override your new tab pages i.e. the page you see when you open a new tab in the browser. They do this through the [_Override Pages_](https://developer.chrome.com/extensions/override) API, by doing so in the manifest file:

```js
{
  "name": "My extension",
  ...

  "chrome_url_overrides" : {
    "newtab": "theNewPage.html"
  },
  ...
}
```

Issue with such extensions is that you can use only one such extension, because if you have multiple extensions with each one trying to override the new tab page, only one of them can finally override. Also, these extensions don't provide any configurable setting to make the overriding of new tab optional. But, there is a very simple trick to make new tab overriding conditional which I use in [Web Maker](https://webmakerapp.com).

First, you don't do anything in the extension's manifest as mentioned above. Then you can have a background page that listens for a new tab creation event. Whenever a new tab is created and the new tab's URL is `chrome://newtab/`, we can do our condition checking and replace the URL accordingly. Heres how you do that:

```js
chrome.tabs.onCreated.addListener(function(tab) {
  if (tab.url === "chrome://newtab/") {
    if (shouldReplaceNewTabSetting === true) {
      chrome.tabs.update(tab.id, {
        url: chrome.extension.getURL("theNewPage.html")
      });
    }
  }
});
```

There you go - conditional new tab page replacement! You can also see the actual [code I use in Web Maker here](https://github.com/chinchang/web-maker/blob/master/src/eventPage.js#L13).
