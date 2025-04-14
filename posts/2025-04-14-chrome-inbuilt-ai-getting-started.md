---
layout: post
title: "Getting started with Chrome's Inbuilt AI"
tags:
  - tutorial
  - ai
  - chrome
---

I recently wanted to tinker with Chrome's in-built AI, that uses the Gemini nano LLM. Though there are several articles/videos around getting started with it, I am still writing this guide post because most of them are dated now. Because the in-built AI is an experimental feature, it is undergoing very rapid iterations and so within a few months, all the information out there becomes old and invalid - even the official docs.

So if you want to get started with the in-built AI on Chrome (on Apr 14, 2025), follow along!

## Browser version

In-built AI isn't limited to dev/carany channel anymore. You can try it on stable Chrome too.

## The experimental flags

Switch on the following 2 experimental flags from `chrome://flags`

1. [Enables optimization guide on device](chrome://flags/#optimization-guide-on-device-model) - Set it to Enable BypassPerPerfRequirement"
2. [Prompt API for Gemini Nano](chrome://flags/#prompt-api-for-gemini-nano) - Set it to "Enabled"

And now relaunch your Chrome.

## Downloading the model

If the model is downloaded or downloading, you would see "Optimization Guide On Device Model" listed on [chrome://components/](chrome://components/)

For me the model, didn't download automatically, so I saw nothing there. In that case, first check if the LLM is available to you or not. Open the developer tools, go to Console and run:

```js
await ai.languageModel.availability();
```

It should return "downloadable". If yes, run the following:

```js
await window.ai.languageModel.create({
  monitor(m) {
    m.addEventListener("downloadprogress", (e) => {
      console.log(`Downloaded ${(e.loaded / e.total) * 100}%`);
    });
  },
});
```

This basically triggers the model to download on your machine and also adds a listener to the progress event of this process - so that you know when it has finished downloading.

Note: Even during download, if you visit [chrome://components/](chrome://components/), you should now see "Optimization Guide On Device Model" listed.

## Using AI

Once the LLM has downloaded, you can verify it by running the following in the developer console:

```js
await ai.languageModel.availability();
```

and it should return "available"! ✅

Now, run a small example to test out the new AI:

```js
const _ai = await window.ai.languageModel.create();
await _ai.prompt("a small poem in 100 chars about dog");
```

<figure>
    <img src="/images/2025/chromeai-example.png" alt="">
    <figcaption>Running a small example to test Chrome AI.</figcaption>
</figure>

That is it! Have fun!
