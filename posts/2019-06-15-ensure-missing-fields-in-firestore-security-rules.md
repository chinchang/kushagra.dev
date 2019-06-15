---
layout: post
title: "Restrict specific fields updation in Firestore"
tags:
  - firebase
  - firestore
---

Let's say you have a `users` collection and each document in that collection contains the public information about a user. Something like this:

```js
users/
user_id_1: {
  name: "John Doe",
  country: "Thailand",
  website: "https://example.com",
  username: "j_deo"
}
```

And of course, since this is user's information, the users will have editing rights to their corresponding document. This can be guaranteed by the following security rule:

```js
match /users/{userId} {
  allow write: if userId == request.auth.uid;
}
```

All good till now. Here is a thing to note: Should all the fields in the above document be allowed to be written by its user? Think about the `username` field. Username of a person is a unique value in an app, generally. Meaning, if there exists a user with username "ramesh", there can't be (at least shouldn't be) another user with the same username "ramesh". How would you ensure that in Firestore, you ask? Well, that could be another blog post, but in summary, you'll have a cloud function endpoint to change username instead of directly hitting Firestore to update the username. And inside the function, you can have logic to check if there is username conflict and take appropriate actions.

This is the half solution for ensuring the username doesn't conflict. Remember that our above-mentioned security rule for any document in `users` collection doesn't stop anyone from updating the `username` field. So now we need to somehow ensure that the user cannot update their username in the document.

## resource & request

For that, we need to know about these 2 variables: `resource.data` and `request.resource.data`. These are available to use while writing the Firestore security rules.

### resource.data

This is simple. It's your document's current state, before the write. More precisely, it is a map with your current document's keys.

### request.resource.data

This one is tricky. Let's say you send an `update` request to update your document's `name` field, like so:

```js
db.collection("users/user_id_1").update({
  name: "Something else"
});
```

You would expect `request.resource.data` to be `{ name: 'Something else' }`, which is simply the data we are sending in the request. But it is not!

`request.resource.data` is your document's future state i.e. after the write. So in this case, if the write succeeds, our document would become something like this:

```js
{
  name: "Something else",
  country: "Thailand",
  website: "https://example.com",
  username: "j_deo"
}
```

This is exactly what `request.resource.data` is - A map with all your future document's keys.

### Back to ensuring the missing field

Once you understand what `resource.data` and `request.resource.data` are, you soon realize why we cannot simply check that `username` should be `undefined` in our `request.resource.data`. Because `request.resource.data` is not the object you send. But it is the object that your document will become if the write happens, and in that object `username` still lives. So what do we do now?

Let's take a small example:

Current document:

```js
// resource.data
{
  name: "John Doe",
  username: "j_deo"
}
```

And we send an update request like so: `db.collection('users/user_id_1').update({ name: 'John Doe - the great' })`. Here is what our future document will look like, i.e. our `request.resource.data`:

```js
// request.resource.data
{
  name: "John Doe - the great",
  username: "j_deo"
}
```

If you compare the current and future state, you'll notice that the username remains same when we don't send the `username` field. That means to validate the user not sending the `username` field, we can check for the `username` being the same in before and after states with the following security rule:

```js
match /users/{userId} {
  allow write: if userId == request.auth.uid
    && resource.data.username == request.resource.data.username;
}
```

Are we done? No, one more small thing. There could be a scenario where the `username` field doesn't exist in the current document. In that case, the above security rule errors out (it probably shouldn't, but it does) with a strange error `Property username is undefined on object`! To bypass this error, we can simply check for the field `username` to be absent in future state (`request.resource.data`). Because if there was no `username` initially and we don't update it, it won't be present in the future state too. Here is how we do that:

```js
match /users/{userId} {
  allow write: if userId == request.auth.uid
    && !('username' in request.resource.data)
    || resource.data.username == request.resource.data.username;
}
```

## Bonus refactor

You might probably have more such fields that need to be restricted for writing. Repeating above conditions for all such fields can make the rules difficult to read. We can abstract the logic in a function to make it manageable:

```js
function notUpdating(field) {
  return !(field in request.resource.data) || resource.data[field] == request.resource.data[field]
}

match /users/{userId} {
  allow write: if userId == request.auth.uid
    && notUpdating('username') && notUpdating('isAdmin');
}
```

Neat, right?

That's all folks. If you have any questions or comments, reply in the comments or ask on Twitter [@chinchang457](https://twitter.com/chinchang457).
