---
layout: post
title: "Case Study: Accessibility Report for Managers - Part 1"
tags:
  - preact
  - react
  - tutorial
---

_This is a case-study of why and how I created my recent side-project - [Accessibility Report for Managers][a11yformanagers]. Part 1 talks about the idea behind it and how the Frontend was created._

Accessibility is a very important aspect of any product. If your product isn’t accessible to every possible user, then you are simply losing out on potential users. Over the past few years, I have grown to care more and more about accessibility in every work I do, not just web development, but everything. With that also comes the disappointment to see all these websites out that that break even the basic accessibility rules.

Lack of knowledge is certainly the reason for poor accessibility in websites. But it isn’t always just the lack of knowledge of developers. I feel there are times when developers do want to take time out to improve the accessibility in their work as they slowly learn new and new things, but they are not always given the freedom to do so. Again, it’s the lack of knowledge and empathy, but in a different set of people who manage these developers. That is why Accessibility, and for that matter, any part of a website, is not just a developer’s job. It needs to be a company value that starts from the early stage of idea conceptualisation, to design, development, product management, marketing, and beyond.

## The Idea behind “Accessibility Report for Managers”

The most common argument we get to hear from people who are tried to convinced about focusing on Accessibility is:

<blockquote>
Hey, do we really have those kinds of users? Has anyone ever complained about our website not being accessible?

<div>- A Manager<div>
</blockquote>

This gave me an idea - why not make an app that gives these people what they want - real feedback from actual users. But then I thought, the primary aim here is “real feedback”, not “actual users” 😉 This led to the whole concept for “Accessibility Report For Managers” - website where you can enter any website URL and generate a report full of dummy feedbacks about actual Accessibility issues on that website, by dummy users 🙂 You take this report to your manager who was asking for real customer feedback all this time, and voila!

<p style="padding:1rem;background:var(--color-blockquote-bg)">
<strong>Disclaimer</strong>: The idea here is not at all to diminish the importance of actual accessibility testing and feedback submitted by real users. That is at most important. This app is just a fun attempt to bring a different perspective to look at real accessibility issues.
</p>

## The Real value

Okay, fun part aside. **Accessibility Report for Managers** isn’t just a funny impractical website to generate these fake feedback. I realised it serves a more practical purpose. This app basically gives you a very different, a customer oriented, view of the Accessibility issues present on your website. Compare this to reading a story and actually seeing/hearing the same story in a movie. Similarly, a textual list of issues generated from a linter would not create the same amount of empathy inside the reader that probably a tweet from a disappointed user showing a screenshot of something broken on the website would do.

For example, compare these two:

**Linter**: Color contrast not sufficient. It should be at least 4.5:1.
**User Feedback**: Hey web admin, I was browsing through your website to get some work done but at some places, it’s really hard for me to read the text, probably due to poor colour contrast.

I hope you can see the huge difference between the two. I feel the latter gives a very understandable view of the same issue.

## TL;DR: Creating the App

This app, though seemingly small, has quite a few components behind the scenes. And the best part, as a frontend developer I could write it all in JavaScript and run without actually setting up or managing a server. These things really excite me and this article series is an attempt to share the whole process of creating such an app with all the latest tech out there. Let’s begin with the tech stack used in the app.

Note: The app is [open-source on Github][github].

### Component 1 - The Frontend

I chose [Preact][preact] to write this app’s frontend. Preact is an extremely lightweight (just 3KB gzipped) alternative to React with almost the same API. It’s perfect for a scenario where you have such a small app and you don’t wanna overload it with some framework’s footprint.
I used Preact’s `preact-cli` which does a basic scaffolding for a Preact Progressive Web App. There is no other dependency on Frontend apart from Preact.

The CSS is written the old-fashioned way - a single CSS file.

### Component 2 - The Backend

The backend is basically a set of serverless functions which creates 2 endpoints for the frontend. Again, they are all written in JavaScript (NodeJS).

1. There is one API endpoint to get the actual issues on a given page which uses the [pa11y][pa11y] package to extract out all the issues.
2. The second API endpoint is to get the screenshot of affected areas. This is done using [Puppeteer][puppeteer] to get screenshot of specific elements on the page.

### Component 3 - Deployment

Both, the frontend and the backend, are hosted on Zeit Now. It simply involves writing the deployment configuration for your components and everything gets deployed with a single command without managing any server!

## The Frontend

**Note**: Till we get to the Backend, assume that we have a backend API. We can send any URL to the API and it returns us a list of Accessibility issues.

### The framework

I love React. But if the project I am working on is not too demanding in terms of features and I am the only one working on it, I prefer to use [Preact][preact] - which is a 3KB alternative to React. It almost feels like I am shipping a vanilla JS app while getting the same ease as with React.

Preact also has a CLI that scaffolds a basic progressive app.

### Creating fake tweets - Content

As I mentioned, our API gives us a list of Accessibility issues (found through [pa11y][pa11y]). First of all, we need to turn these into tweets. Each issue in the list is of the following structure:

```js
    {
      code: "WCAG2AA.Principle2.Guideline2_4.2_4_1.H64.1",
      message: "Iframe element requires a non-empty title attribute that identifies the frame.",
      type: "error",
      selector: "#77c8c1c1-74e9-4d61-be2e-c1e39ffe02a0"
    }
```

The `code` is a unique identifier for a particular Accessibility guideline that wasn’t followed, explained in brief in the `message` value. The main gist of this app is to turn the technical guideline into seemingly real feedback from a real user. That is why I need to convert that into a tweet. And the same tweet always for a particular issue type would look unreal and boring. So I maintain 3-4 different tweets for each issue type and pick one out randomly. Like so:

```js
const supportedRules = {
  INSUFFICIENT_CONTRAST: "WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail",
  MISSING_LABEL_ON_FORM_CONTROL: "WCAG2AA.Principle1.Guideline1_3.1_3_1.F68"
};

function generateFeedback(issue, url) {
  switch (issue.code) {
    case supportedRules.MISSING_LABEL_ON_FORM_CONTROL: {
      return {
        message: [
          `Dear Web Developer, I cannot see and browse the web using a screen reader. And websites like ${url} on which you don't label your form elements are completely unusable to people like me. #fixtheweb #a11y`,
          `Oh God! It's a disaster browsing websites where the developer simply didn't care to put a label on form controls!! Encountered one such site -> ${url} #accessibility.`
        ][random(0, 2)]
      };
    }
    case supportedRules.INSUFFICIENT_CONTRAST: {
      return {
        message: [
          `Hello! I was browsing through your website ${url} and facing issues with reading few texts. I guess it could get a lil' better for people like me if the text color had some more contrast with the background.`,
          `It's such a difficult task to read websites these days. Eg. Missing text contrast here -> ${url} Someone please fix the web. #accessibility`
        ][random(0, 2)]
      };
    }
  }
}
```

What's happening here is, I have made enums for the supported Accessibility guideline codes to make it more clear while referencing them. Then there is the `generateFeedback` function which does a `switch` on the accessibility issue `code` and returns a random feedback from a list of feedbacks corresponding to that issue.

One more thing to note here is that I pass the URL of the website, whose report is being generated, to the `generateFeedback` function. This passed argument gets used in the `${url}` placeholder within the feedback strings, which are actually [template literals][template-literals].

### Creating fake tweets - Fake users

This one is interesting! Next, we need some fake users to show within our feedback tweets. I searched a lot for services which would give me random user data and finally settled on [https://randomuser.me][randomuser]. It’s free, fast and gave me the data I wanted (eg. name, photo etc). It has an API with all sorts of options, but the one that is of our interest here is the `results` option. You can pass a count in `results` parameter and the API will return that number of fake users to you. Sweet right!

So the whole report generation process till now is as follows:

1. I get a list of issues from the API
2. The issue list is converted into fake feedback tweets (only the issues which are supported)
3. As per the number of feedbacks we generate, we fetch those number of fake user from https://randomuser.me

### Creating fake tweets - Twitter handles

To complete our fake feedback tweet, we need to show the twitter handles (username) of our fake users. Now we could just create random strings out of numbers and alphabets, but that would again look unreal. And what's the fun in making unreal stuff! So here is what I do instead:

1. For each user, we have the user’s full name.
2. I extract some part of the user’s first name (**F**) and some part of their last name (**L**).
3. Then with a 50% probability, I concat **F** and **L** with an underscore. The other 50% times, I concat them straightaway. Because people generally contact their first and last names to create their handles.
4. Next, with a 30% probability, I append some digits (maximum 3) after the result of Step 3. Why? Because not everyone in the Twitter-verse gets their handle of choice. They append random numbers to make it unique :)
5. The result is appended to a “@” character.

And we have the handle ready! If you are wondering how do we do something with X% probability, it can be done easily by checking the result of `Math.random()`.
For example: To run a code with 70% probability, we could use `Math.random() > 0.3`. This condition means we want the number returned by `Math.random()` to be greater than 0.3. And `Math.random()` return from 0 to 1. So basically we are checking that the returned number should be between 0.3 and 0.1. This translates to having a 70% chance:

0 - 0.3 → 30% probably outcomes
0.3 - 1 → 70% probably outcomes

Here is how the complete function looks like:

```js
function getHandleFromName(fname, lname) {
  // Concatenating extracts from first and last name, with _ maybe?
  let handle = [
    `${fname.substr(0, random(1, fname.length - 1))}`,
    Math.random() > 0.5 ? "_" : "",
    `${lname.substr(0, random(1, lname.length - 1))}`
  ].join("");

  // Add some digits?
  if (Math.random() > 0.7) {
    handle = `${handle}${random(0, 999)}`;
  }

  // Append to @
  return `@${handle}`;
}
```

### Creating fake tweets - Final items

To all the above data, we add random “like” count and tweet date. One more thing that the tweet shows is the image of the element on the website that failed the Accessibility guideline. Remember the issue structure that we get from the API? It had a key called `selector` is the CSS selector of the corresponding element. I created another API to which I pass the CSS selector and website URL and it returns me the screenshot of that element. More on that later.

And combining all the fake data, we generate this beautiful fake feedback tweet:

<figure>
<img src="/images/2019/a11yformanagers-tweet.png">
<figcaption>Tweet screenshot of a fake user complaining about color contrast user</figcaption>
</figure>

That is it for this article. In [the next article](/blog/case-study-accessibility-report-for-managers-p2/), we’ll go through the app’s backend and how its deployed.

[a11yformanagers]: https://a11yformanagers.now.sh
[github]: https://github.com/chinchang/a11y-for-managers/
[preact]: https://preactjs.com
[template-literals]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
[pa11y]: https://github.com/pa11y/pa11y
[puppeteer]: https://pptr.dev
[zeit]: https://zeit.co/now
[randomuser]: https://randomuser.me
