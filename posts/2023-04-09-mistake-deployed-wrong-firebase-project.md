---
layout: post
title: "Mistake - deployed to wrong firebase project"
tags:
  - mistakes
  - firebase
  - debugging
---

Hello, we meet so soon after my last mistake. 😄 Yesterday I was deploying [CSSBattle's](https://cssbattle.dev) backend because new targets were to be unlocked and it did happen fine. Soon after, players started reporting that submissions are acting weirdly. There was an error in the submission call but the target scores were recorded correctly. Also, for the 2 new targets, the high score was not being added to the battle score!

This happened for the first time…I couldn’t really see why this should happen. The gcloud logs showed an error while recalculating the battle score - which happens after saving the target score. So that made sense, the call worked partially till saving the target score but failed while recalculating the battle score.

## The bug

The error looked like the code I had deployed never got deployed - strange! There is one thing peculiar about that code though - it was from a yarn monorepo package outside the Firebase package. And because of how Firebase works, it's deployed in a little hacky manner. 🤷🏻 So I thought maybe that got messed up and I re-deployed. But even that didn’t fix anything.

Just then I remembered - we had [introduced a staging environment on Firebase](https://twitter.com/chinchang457/status/1637825848223969281?s=20)! I quickly went into the terminal to check which project did I deploy to…and yes, I had deployed to the staging environment (which I was working on before deployment). 🤦🏻‍♂️

## Solution

That was pretty simple — I switched to the production environment with `firebase use <projectID>` and re-deployed!

But that is not actually the solution to the problem. I can make the same mistake again in the future. It’s very easy to miss which Firebase project/environment is set in the terminal. I still have to solve this for us, but I have a few ideas:

- I could add the Firebase project name in my terminal prompt. That way it always shows without explicit checking. But still, I could miss seeing my prompt.
  <figure>
  <img src="/images/2023/terminal-prompt.png">
  <figcaption>My terminal prompt</figcaption>
  </figure>
- I use a shell script that internally does Firebase deployment. I could make that script print out loud something like “DEPLOYING TO X PROJECT”…in s big font! So that as soon as deployment starts, I clearly see where I am deploying.

I think I’ll go with 2nd one and see how it goes. Do you have a better solution to this? Let me know on [Twitter](https://twitter.com/chinchang457) or [LinkedIn](https://www.linkedin.com/in/chinchang/).

See you in my next mistake!
