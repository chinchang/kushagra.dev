---
layout: post
title: "Mistake - comparison with optional chaining"
tags:
  - mistakes
  - javascript
  - debugging
---

I broke [CSSBattle’s](https://cssbattle.dev) leaderboard recently because of an interesting bug. We had a piece of code, whose simplified version looked something like this:

```jsx
const isMore = a.score > b.score;
```

This got recently changed so that score was now inside a key called `overall` and also, the `overall` key was optional - could be there or not. Also, in the old scenario `score` was always guaranteed to be there. But in the new structure, because `original` key itself isn’t guaranteed, hence the `score` key too. So very conveniently I changed the above comparison to access `score` from `overall` key through an optional chaining operator so that I don't get an error if `overall` key doesn’t exist:

```jsx
const isMore = a.overall?.score > b.overall?.score;
```

Everything seemed to be working with the change…until I noticed that the comparison was returning faulty results in some cases.

## The Bug

Here’s what happened. Assume in the original code, we have `a.score` as 40 and `b.score` as 0. With those values, `isMore` would come out to be `true` - which is correct. But what if now, `a.original.score` is 40, but `b.orginal` doesn’t exist. We expect `isMore` to be still `true` because 40 is more than _nothing_, right? But that doesn’t happen - `isMore` is `false` in the new case. Let’s see why.

Putting values in our expression, we get:

```jsx
const isMore = 40 > undefined; // evaluates to false
```

Note: right side of the `>` operator would evaluate to `undefined` because of the optional chaining operator on a key which doesn’t exists. And `40` , though we expect to be more than something which doesn’t exists, is actually not more than `undefined` !

That makes sense too (now at least 😛). I say the value “doesn’t exists” a lot of times above, but `undefined` doesn’t mean “doesn’t exist”, it means the value isn’t defined. In JS, the closest to “doesn’t exists” would be `null`. And as should be expected, `40 > null` actually is `true`!

<figure>
<img src="/images/2023/optional-chaining-comparison.png">
<figcaption>Comparison with undefined gives false and null gives true, shown in devtools</figcaption>
</figure>

## Solution

I patched the above expression to have `0` as default value when `original` key doesn’t exist:

```jsx
const isMore = (a.overall?.score || 0) > (b.overall?.score || 0);
```

Now, we won’t have `undefined` ever so numeric comparisons work correctly. Fixed!

I’ll see you again with my next mistake! 👋🙂
