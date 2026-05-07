---
layout: post
title: "Vibe-coding on Mac mini from anywhere"
tags:
  - tutorial
  - productivity
  - mac
og_image: https://kushagra.dev/images/og/og-vibecoding-on-macmini.png
---

![Vibecoding on Mac mini from anywhere](/images/og/og-vibecoding-on-macmini.png)

This post is about me wanting to use my Mac mini whenever I’m away from it. This use case started with me wanting to work from another room. Since all my work (and in-progress) is on the Mac mini (and it is not movable), I wanted to keep working on the same machine. (PS: yes I know there is GIT). And working these days means just prompting, so even a reliable SSH connection works. So here is how I did it.

### Step 1: Enable Remote Login (SSH) on your Mac mini

You need to enable remote SSH on your Mac mini. Open **System Settings → General → Sharing** and turn on **Remote Login**. That’s it — your Mac mini is now accepting SSH connections on the local network.

### Step 2: Make SSH work outside your home Wi‑Fi (use Tailscale)

You still won’t be able to SSH into your Mac mini if you are away from your location, meaning you are not on the home Wi‑Fi. You basically need a public IP for your Mac mini. That’s where [Tailscale](https://tailscale.com/) comes in.

Tailscale gives you a secure private network where you can put all your devices: your Mac mini, your laptop, maybe your phone. Then each device can talk to the others over that private network — as if they were all sitting on the same Wi‑Fi, no matter where in the world they actually are.

Install Tailscale on both your Mac mini and your client device (laptop, phone), sign in with the same account on both, and you’re done. You’ll get a stable hostname/IP for your Mac mini that works from anywhere.

### Step 3: Prevent the Mac mini from sleeping (so it stays reachable)

Cool, so now you can SSH to your Mac mini from anywhere in the world.

The issue is that most of us have a sleep timeout set on a Mac mini. This means that after a while the display turns off, then after some time the hard disk turns off, and the system goes to sleep.

When that happens, your SSH connection breaks and your Mac mini won’t be accessible anymore. You won’t be able to set up a new SSH connection either.

So we need to do one more thing to prevent it from sleeping. Run this command on your Mac mini:

```bash
sudo pmset -a disablesleep 1
```

This makes sure your Mac mini does not sleep even after the display turns off. After some time the display will turn off, but don’t worry — at this point it will still be SSH-able.

Just make sure you don’t put your Mac mini to sleep explicitly (Eg. from Apple menu > Sleep). In that case, it won’t be accessible.

> ⚠️ **One important thing: don’t run this command on your laptop.**
>
> Laptops can be inside bags while they are on. If they don’t go to sleep when the lid is closed, ventilation can be blocked and the laptop can heat up.
>
> This also applies to your Mac mini if it’s not properly ventilated or kept in a cool area. If so, avoid this.

### Step 4: Keep work running even if your client device sleeps (use tmux)

Now you can SSH to your Mac mini from anywhere in the world and your Mac mini won’t sleep. It will always be accessible over SSH.

But what about the machine you are SSH-ing from?

In my case, it was my MacBook Air. I can SSH into my Mac mini and then open Claude Code, give it a prompt, and the thing starts running.

Now let’s say I have to go somewhere and I close the lid of my MacBook Air. That will put the MacBook Air to sleep after some time, and then the SSH connection will terminate. That means the Claude Code run would also stop midway, and your work will be lost.

We need to do one final thing: when you SSH to your Mac mini, you should use the terminal through **tmux**.

tmux is a terminal multiplexer that also has state persistence. If you run a session through tmux, anything that is going on will keep running even if the SSH connection closes.

That gives you two benefits:

1. Your MacBook Air, or whatever client device you are using, can go to sleep at any time. You can just walk away or shut down your client device, and your Mac mini will keep running Claude Code (or whatever you’re running) even if the SSH connection terminates. Next time you SSH back in, you just attach to the tmux session and pick up exactly where you left off.
2. A tmux session can also have multiple panes, just like you have in terminals like iTerm and Ghostty. To work on any project, you can maintain a tmux session per project which probably would have multiple panes for say, claude code, your server, vim etc etc. As soon as you attach to a particular session, all the panes related to that project — which you had opened last time — open up in one go. This is so cool to get in that working state very quickly. Also applies if you are working on a single machine too.

> PS: Credit to this tip goes to [Ayush Soni](https://x.com/ayysoni) who suggested this at the IndieHacking Retreat when I refused to close my laptop lid! 😆

That’s it. Three small pieces — SSH, Tailscale, and tmux — and your Mac mini quietly becomes a Vibe-coding machine you can use from anywhere, with work that survives sleeps and disconnects on either end.

### Bonus update: try Zellij instead of tmux

tmux is actually painful to use sometimes. I don’t like its default keyboard shortcuts. You can’t easily copy things from there. Even when you get it working, it works only half the time. No good mouse support either.

Ayush recently suggested a newer terminal multiplexer called [Zellij](https://zellij.dev/). I gave it a quick spin and am liking it. So try that too.
