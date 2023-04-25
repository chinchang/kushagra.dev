---
layout: post
title: "Logging query docs in Firebase Firestore"
tags:
  - firebase
  - debugging
---

Firebase is one of my favourite and most useful tools! It’s one of the reasons Frontend developers like me are able to launch end-to-end products! No matter how much I praise Firebase, there is one distinct thing about it that always bothers me - it's peculiar way of fetching data and related error reporting. In a usual REST API system, you can easily inspect network calls, see the response and debug things. In Firebase, calls are not that trivial for queries you run. Its not straightforward to inspect them in the network tab of devtools.

<figure>
<img src="/images/2023/firebase-network-response.png">
<figcaption>Response of network call made by Firebase Firestore</figcaption>
</figure>

But for this post I’ll like to focus on its error reporting. It’s not very unusual to hit an error like `Query.where() called with invalid data`] which occurs when a `where` clause is passed `undefined` compare value. This error results from some query in your code, but it won’t tell you which one. Even if you put a debugger on the calling point of this error, the stack trace is so massive and convoluted that I am not even sure if you can reach the actual query from there. So how do you debug which query is resulting this such an error in Firebase?

<div class="info-box">
Note: This post is all related to Firebase v9 and it's Firestore database.
</div>

## Solution

First thing we need is to know what queries are being made from your app. As there is no corresponding network call for each request, we can’t use the network tools for this. The only way left then is to put some log statements at all places where queries are made! What?? All places? Yes, there can be too many such places. Moreover, these log statements can’t be all same - each log statement will have to log some distinct pieces of information to be useful - eg. what doc or what collection is being queried.

What we can do is put our logging at some central place which we know gets called for all queries. Yes! We’ll monkey-patch Firebase API for this.

2 ways to read/write documents in Firebase (Firestore) are through the `doc` and `collection` functions on the Firestore's DB instance. These are the functions we’ll patch, like so:

```js
const db = firebase.firestore();

if (DEBUG_MODE) {
  const _doc = db.doc;
  const _collection = db.collection;
  db.doc = (...args) => {
    console.log("doc()", args);
    return _doc.apply(db, args);
  };
  db.collection = (...args) => {
    console.log("collection()", args);
    return _collection.apply(db, args);
  };
}
```

We set `db.doc` and `db.collection` to our own functions which first log the received arguments and then call the original functions from within. Now we see what all queries were made in the console:

<figure>
<img src="/images/2023/firebase-query-logs.png">
<figcaption>Query logs in devtools console</figcaption>
</figure>

This isn’t a complete solution though. First, it won’t tell the additional info from `where`, `orderBy` etc. You’ll need to figure out from the `doc/collection` argument, the place of the actual call, put a `debugger` point and then see the other information at that instance. Still this works as a good starting point for me as now I can at least see what all queries are being made in the app and I can spot abnormalities from there.

I’ll probably keep refining the patch here to make it more informative. Let me know how you debug such instances in Firebase.
