---
layout: post
title: "Mistake - forgot to deploy indexes"
tags:
  - mistakes
  - firebase
  - database
  - firestore
---

Now that we have a staging environment for [CSSBattle](https://cssbattle.dev), we develop all features there i.e. local frontend is connected to staging project on Firebase. This feature involved a firestore security change. I tested the whole thing on local and then deployed it to production. Since it involved a security rule change, I made the same change on the production project too. And then, it broke on production!
I couldn't figure out why it was not working. There was nothing wrong in the production data too! Finally I had to ask one of our users for any error that might be showing in their developer console. And there it was - there was a missing index on Firestore. The feature also required a new index to be created in Firestore, which I did in the staging project but forgot to create on production.

## Learnings and fixes

1. I still make changes to Firestore security rules and indexes manually from the web UI. Firebase has a nice way to have all the configs in source files and deploy them from the command line. Had I used the source files method 1) I would have seen the diff in the PR 2) Automated the deployment of rules and indexes from command line.
2. I had to ask a user for the error in console 🤦🏼‍♂️ This actually reminded me that we have Sentry on the frontend but since I haven't made use of it ever I totally forgot about it! Need to be more active there.

See you in my next mistake!
