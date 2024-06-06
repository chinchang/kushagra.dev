---
layout: post
title: "Mistake - Making an async function sync"
tags:
  - mistakes
  - javascript
  - debugging
---

I recently migrated Firebase to the latest version in [WebMaker](https://webmaker.app) app. As part of the migration the way database instance is retrieved changed from asynchronous to synchronous. Earlier, I had a function to get the db instance, like so:

```js
let dbPromise; // a promise that gets defined somewhere
async function getDb() {
  return dbPromise; // resolved to a dbInstance
}
```

And then wherever I wanted to do some operation in the DB, this is how would use the above `getDb` function:

```js
async function doSomethingWithDb() {
  const db = await getDb();
  return getDoc(doc(db, "colId/userId"));
}
```

Then I did the migration to latest Firebase which removed the async part in getting the db instance. So it was time to make a few things synchronous. To keep changes minimal, I made the `getDb` function return the `dbInstance` directly, instead of a promise:

```js
async function getDb() {
  return dbInstance;
}
```

And since I wasn't returning any promise now, I could use the `db` without an `await`:

```js
function doSomethingWithDb() {
  const db = getDb();
  return getDoc(doc(db, "colId/userId"));
}
```

But this didn't work! I got error from Firebase about wrong database instance being passed to it. But I was passing the same thing which I got from promise resolution earlier, being returned directly from `getDb` now. Oh wait...I spotted the mistake I made. It doesn't matter what you return from an `async` function, it always returns a promise. I had missed removing the `async` keyword from the `getDb` function and so it was still returning a promise. The fix was simple - changing the `getDb` to:

```js
function getDb() {
  return dbInstance;
}
```

And that fixed it!

I’ll see you again with my next mistake! 👋🙂
