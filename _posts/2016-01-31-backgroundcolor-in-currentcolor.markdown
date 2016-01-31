---
layout: post
title: 'Using background color in currentColor'
---

I had the following situation recently - I have a container with some background color and it needs to have an arrow coming out from inside of the same background color. I implemented the arrow using `:after` pseudo element. Something like this:

![](/images/2016/currentcolor-propagation.png)
{% highlight css %}
.container {
  display: inline-block;
  padding: 30px;
  background-color: indianred;
  position: relative;
}

/* Arrow */
.container:after {
  content: '';
  display: block;
  position: absolute;
  left: 100%;
  top: calc(50% - 10px);
  border: 10px solid transparent;
  border-left-color: indianred;
}
{% endhighlight %}

Now this code works, but the container could be multi-colored and also the arrow can show either right or left for any container. With above implementation, for each different container, we'll have to change the border color as well like so:

{% highlight css %}
/* Modifier for a container having left arrow */
.container--inverted:after {
  left: auto;
  right: 100%;
  border-left-color: transparent !important;
}

/* New container */
.container--2 {
  background-color: skyblue;
}

/* Arrow */
.container--2:after {
  border-left-color: skyblue;
}
.container--2.container--inverted:after {
  border-right-color: skyblue;
}
{% endhighlight %}


**Bad Demo:**

<p data-height="268" data-theme-id="0" data-slug-hash="rxKrag" data-default-tab="result" data-user="chinchang" data-preview="true" class='codepen'>See the Pen <a href='http://codepen.io/chinchang/pen/rxKrag/'>BjVPNJ</a> by Kushagra Gour (<a href='http://codepen.io/chinchang'>@chinchang</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

### Issues

This code has 2 visible issues:

- **Not DRY** - Every new container has to define the color of its arrow by specifying the border color and that too 2 times, one for left and right each. So in total we'll need to write a single color value 3 times for every container...too much repeatition.
- **Coupling** - The container styling needs to be aware of the arrow implementation, whether its using border trick or something else. Changing the arrow implementation in future will require changing it for every container.

### Solution

One thing that might come to your mind to prevent these issues is `currentColor`. Close enough, just that `currentColor` refers to the `color` property and not `background-color`. Bummer!

To overcome this limitation I came up with a trick I call `currentColor propagation` :) The trick is basically to propagate `background-color` to `color` property of the arrow and then use `currentColor` for coloring arrows! That solves both our issues:


{% highlight css %}
.container {
	/* Other styles here */
	color: indianred;
}
.container:after {
	/* Other styles here */
	color: indianred;
	border-left-color: currentColor;
}
.container--inverted:after {
	border-left-color: transparent;
	border-right-color: currentColor;
}

/* Modifiers can just be like so */
.container--2 {
  background-color: skyblue;
}
/* Arrow */
.container--2:after {
  color: skyblue;
}
{% endhighlight %}

Yes, we need still need to mention color 2 times for each new container, but still better than 3 times. More importantly, all the arrow related code is just at one place and not duplicated for each container. Plus we don't have to use that dirty `!important` and have much less code.

**Improved Demo:**

<p data-height="268" data-theme-id="0" data-slug-hash="BjVPNJ" data-default-tab="result" data-user="chinchang" data-preview="true" class='codepen'>See the Pen <a href='http://codepen.io/chinchang/pen/BjVPNJ/'>BjVPNJ</a> by Kushagra Gour (<a href='http://codepen.io/chinchang'>@chinchang</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Thats it for this article. Hope it will help you sometime :)

