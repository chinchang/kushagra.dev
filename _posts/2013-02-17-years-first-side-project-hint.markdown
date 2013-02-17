---
layout: post
title: Year's first side project- Hint.css
---

Hey everyone!

It has been around a month and a half since we jumped into 2013. And this is my first post of the year. I released a side project called [**Hint.css**](http://kushagragour.in/lab/hint/) some days back on Hacker News and this post is primarily about what it is, how it works and what all I learned while creating it.

First I would like to mention how nicely it was received and appreciated by the community. Here are some stats for the same:

- I [released it on Hacker News](http://news.combinator.com/bc324734) on 4th Feb 2013 where it attained #1 ranking just after half an hour or so. Cool eh? BTW, this was the first time my submission got to #1 :) It got **224 upvotes**. Thank you!

- As a result of the above, the project page around 20K+ unique views. Heres an image showing some realtime stats after ~3 hours of release (*Note: The realtime count did went above 300, but come on...I was not in a state to take a screenshot then :P*):

<img src="/images/2013/hint-realtime-stats.png" alt="Hint GA realtime stats">

- The [github repo](https://github.com/chinchang/hint.css/) has been starred and forked 1.4K+ and 100+ times respectively.

- Also the repo is still in the [list of most trending repos](https://github.com/explore/month) on github.

So all in all, the launch was beyond expectations and really good.

###About hint.css

**hint.css** is a library written in SASS to create simple tooltips. So basically it uses only HTML and CSS to create tooltips for your lovely websites. Yes you heard that right, no JavaScript required. [Learn more](http://kushagragour.in/lab/hint/) about how to use it.

The library uses the [BEM naming convention](https://gist.github.com/necolas/1309546) by [Nicolas Gallagher](http://nicolasgallagher.com/about-html-semantics-front-end-architecture/).

###How does it work
The library uses 4 basic concepts to create the tooltips without a line of JavaScript or any extra markup:

####1. Pseudo elements
Pseudo elements are a gift for web developers which open numerous possibilities for creating amazing stuff. **Hint.css** makes use of these pseudo elements (<code>::before</code> and <code>::after</code> elements) to create the actual tooltip.

This has the advantage that you do not have to add any extra markup on your page. But it has a downside too. As the tooltip is created using pseudo elements, its not possible to use them for any other purpose on the element you put tooltip on.

####2. data-* atributes
The tooltips need to be told what text to show. How do we provide this text? [<code>data-*</code>](http://www.w3.org/TR/2011/WD-html5-20110525/elements.html#embedding-custom-non-visible-data-with-the-data-attributes) attributes to the rescue. They let you put custom data on any element using attributes. So **hint.css** expects you to define an attribute called <code>data-hint</code> on the element which needs a tooltip:

{% highlight html linenos %}
Out of the many, <span data-hint="Tooltip text">this</span> word needs a tooltip.
{% endhighlight %}


####3. attr function for content
Now the most important part on which **hint.css** is based on. You may have heard about the <code>content</code> property of pseudo elements. As is clear from the name, it lets you specify content of the pseudo element.

What was really great for me was the **attr** function which gives you the power of grabbing the value of any attribute on the element and set it as the pseudo element's content. Isn't that really neat? So the meat of the library is this one line:

{% highlight css linenos %}
content: attr(data-hint);
{% endhighlight %}

And you are DONE!

####4. CSS3 transitions
Finally to add some eye candy, the tooltips are loaded with subtle fade & translate effect using [CSS3 Transitions](https://developer.mozilla.org/en-US/docs/CSS/Tutorials/Using_CSS_transitions).

One thing to note here is that Transitions on pseudo elements work only in Firefox presently. But do not worry guyz...thanks to Elliott Sprehn, [the feature](https://bugs.webkit.org/show_bug.cgi?id=92591) has arrived in Google Chrome 26 dev version and it's not too far when we'll all have it in the stable one too :)


###What I learned

If you are passionate about creating cool new stuff, you surely understand the importance of developing small side projects, something you can own completely. It teaches you a hell lot of things...not only about the tech side but about managing stuff from planning to releasing to maintaining a small product. You should probably read this [awesome post on creating side projects](http://sachagreif.com/the-side-project-project/) by [Sacha Grief](http://sachagreif.com/).

While making **hint.css** I too learned many things which I would like to share here.

####SASS

This was the first time I tried [SASS](http://sass-lang.com/). SASS is basically a CSS preprocessor...meaning it provides you some great features (like variables, mixins etc) to write your CSS in a more efficient way.

I had never felt the need of using a preprocessor ever. And same was with **hint** also. If you happen to see the [original demo of **hint.css**](http://codepen.io/chinchang/pen/lICaq) I released, it was written in CSS. Even when I started writing the actual library I was using plain CSS but then things started getting very repetitive and unmanageable.

Adding any new type of tooltip required to change certain properties on all four tooltip positions (top, bottom, left and right) which I had to write again and again. Also at times, inconsistencies occurred with respect to color values and other static numbers used at different places. And hence I was forced to look into a preprocessor that could make me write smarter code.

Basically its the *mixins* (check out [src/color-types.scss](https://github.com/chinchang/hint.css/blob/master/src/hint-color-types.scss) for example) and *variables* that made the whole library very easy to extend and consistent everywhere.

####Grunt

[Grunt](http://gruntjs.com/) is a build tool basically made for JavaScript projects. I helps you create a build flow using variety of tasks it supports like concatenation, minification etc. As I started using SASS for **Hint** it made sense to incorporate a build tool in my workflow and having a little experience of using Grunt in my previous game projects, I thought why not try it on a CSS project.

It has worked quite well till now. I had to install some extra tasks for [SASS compilation](https://github.com/sindresorhus/grunt-sass) and [CSS minification](https://npmjs.org/package/grunt-contrib-mincss) as they don't come bundled by default with Grunt and now I simply run <code>grunt watch</code> and all building happens silently in the background as I develop.

####Release preparation

This one is a tough and I would say a phase which needs more consideration and effort than the actual development itself.
Coding the library hardly took a day or two but rest of the work took around 300% of the already spent time and that includes:
- Writing README for the repo
- Creating a project page with demo, usage explanation etc
- Writing a blog post about the project
- Making sure I did not miss anything
- Finally releasing!

During this I became better at writing (I only love writing code though) and managing multiple tasks.

####More CSS knowledge
Last but not the least, as I was working on a CSS library I came to know more about it as mentioned earlier. CSS is really beautiful :)

###In the end

Finally **Hint.css** was released as an Open Source project on Github. But it didn't stop there. People have been liking it and started using and [contributing to it](https://github.com/chinchang/hint.css/pulls) which marks the beginning of the final phase of a software: Maintenance. To keep a library fresh you need to constantly keep it up to date with latest technology, keep adding new features your users want, fix bugs that get reported regularly. And all this in very organized and planned manner so that the user's know exactly what changed when, whats coming up etc. In short, everyone should be able to track the project without difficulties.

Doing all this is fun. I am getting to know GIT better and better now that I have started using branches, merging etc a lot. I only hope I don't face the [Cute Puppy Syndrome](http://fat.github.com/slides-os-guilt/) (a term coined by [@fat](https://twitter.com/fat)) in future :P

Talking about issues, one thing that I have been [hearing a lot from people](https://github.com/chinchang/hint.css/issues/12) is that BEM naming convention is kind of an overkill, specifically in **Hint**. For example people prefer <code>hint-top</code> class over <code>hint--top</code>. I am still thinking over this if BEM was at all necessary or is really an overkill in my library. Though I would really appreciate if BEM masters could really comment on this.


Would love to hear your comments, suggestion or anything you feel like saying about my work, this post...anything.

<a href="http://kushagragour.in/lab/hint/" class="button button-big">Take me to Hint.css</a>

P.S. Discussion on [Hacker News](http://news.ycombinator.com/item?id=5164029).

Cheers!