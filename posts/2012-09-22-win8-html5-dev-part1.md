---
layout: post
title: "[Tutorial] Win8 HTML5 app development- I"
tags:
  - javascript
  - tutorial
  - gamedev
---

Hola!

I recently received a prototype of the next generation Ultrabook device from Intel to support my Windows 8 app developments which had Windows 8 Release Preview installed.

[<img src="/images/ubook.jpg" alt="Ultrabook" title="Next-gen ultrabook" />](/images/ubook.png)

Excited about the new capabilities the device offers, I thought of starting by porting one my previous games to Windows 8. I started looking on forums, communities etc to get some 'getting started' guides on developing HTML5 apps for Windows 8 RT which is specifically for touch device like tablets. Unfortunately, there isn't much information for beginners...or may be I couldn't find some. But anyways, the only option that was left was to explore stuff on my own.

This tutorial series is basically a documentation about my experience of the process of porting one of my HTML5 games ([HTML5 Bouncy](https://github.com/chinchang/Bouncy_HTML5)) to Windows 8 and use its accelerometer capability to add some extra control.
The tutorial series isn't pre-decided as to how long it would be as the app is still under development. I'll share my experience here as and when there is some progress.

###PART 1: Getting the dev environment ready###

Okay, so to develop apps for Windows 8 we need Microsoft Visual 2012 which supports Metro style apps. So I headed over to the [Visual Studio download page](http://www.microsoft.com/visualstudio/eng/downloads) as prescribed [by few](http://software.intel.com/en-us/blogs/2012/07/13/getting-started-with-ultrabook-development) [articles](http://blogs.msdn.com/b/jennifer/archive/2012/06/19/developing-a-windows-8-metro-app-part-2-getting-started.aspx) I read.

Then I downloaded **Visual Studio Express 2012 for Windows 8** from there. But upon installing, it gave a weird error:

> Windows 8 Release Preview does not have the required .NET framework 4.5.50709

Well, that was annoying as I expected my windows 8 to come bundled with all the dependencies. My next step was to obviously search the Microsoft website for the required .NET updates. I even found some updates to .NET but each one on installation gave the message that **_I already had the same .NET version installed_**. That was more weird.

After some googling about the issue, I hit a [Stackoverflow page](http://stackoverflow.com/questions/12389297/unable-to-install-visual-studio-professional-2012-on-windows-8-cp-and-also-not-o) that had the information I wanted. So it turns out that Visual Studio cannot be installed on Windows 8 Release Preview due to some restrictions by Microsoft. It can be installed only on Windows 8 RTM. Besides this, if you want to have Visual Studio 2012 for Win 8 RP, you can do so using Visual Studio 2012 Release Candidate. God bless Microsoft!

So basically I had 2 options now to choose from:

- Get Windows 8 RTM
- Get Visual Studio 2012 RC

And obviously I picked the latter as whose gonna download and install Window 8 :) Finally [downloaded Visual Studio 2012 RC](http://www.microsoft.com/en-us/download/details.aspx?id=29915) and it installed without any issues on my Ultrabook device. A moment of rejoice!

And there I had in front of my eyes, the beautiful new UI of Micorsoft Visual Studio 2012 inspired by the Metro view :D It was simply neat and clean.

[<img src="/images/vs2012_start_screen.png" alt="Visual Studio 2012" title="Visual Studio 2012 start screen" />](/images/vs2012_start_screen.png)

Just to try out things, I made a new Javascript Blank Project which provides you with a <code>default.html</code>, <code>default.js</code> and <code>default.css</code> files with some basic setup code. I added some code to make a simple Hello World app:

**HTML**

```html
<div id="hello-world">Hello World!</div>
```

**CSS**

```css
#hello-world {
  text-align: center;
  font-size: 220px;
  margin-top: 300px;
}
```

And I have my first hello world HTML5 window 8 app ready :)

[<img src="/images/helloworld_win8.png" alt="Hello World" title="Hello World!" />](/images/helloworld_win8.png)

###Whats up next?###
It seems the dev environment is setup now. Next, this is what I am going to do:

- Port [HTML5 Bouncy](https://github.com/chinchang/Bouncy_HTML5) to Visual Studio (shouldn't be much of pain)
- Explore how to use device accelerometer with Javascript
- Add some features to the game to exploit accelerometer capabilities
- May be something more...

Hope this series is useful to someone starting Windows 8 app development for the next generation Ultrabooks.

Till the next part, cya!
