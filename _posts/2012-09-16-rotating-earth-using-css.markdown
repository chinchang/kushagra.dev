---
layout: post
title: '[Tutorial] Rotating earth using pure CSS'
---

Recently after seeing a pen on <a target="_blank" href="http://www.codepen.io">codepen</a> by [Jack Rugile](http://codepen.io/jackrugile/pen/sadvF) and a creation on [CSSDeck](http://www.cssdeck.com) by [Tim Holman](http://cssdeck.com/labs/animated-map-icon), I thought why not use the two concepts to come up with something interesting. An illusion of a 3D rotating planet using just CSS. And so I [hacked down a pen](http://codepen.io/chinchang/pen/ygHBc) (this does a little more than mentioned, not nicely enough though). 

<div class="talign-center">
	<a href="http://codepen.io/chinchang/pen/xCkus" target="_blank"><img src="/images/css-rotating-earth.jpeg" alt="Rotating earth in CSS" width="200" height="200"></a>
</div>

I thought may be I should share the little CSS tricks being used in this CSS stuff to create the illusion. And here I am with a short walkthrough. Lets begin.

<a href="http://codepen.io/chinchang/pen/xCkus" target="_blank" class="button button-big">Demo</a>

This demo uses a single <code>div</code> tag for the HTML. So lets start by creating a <code>div</code> tag with an ID <code>earth</code>.

{% highlight css linenos %}
<div id="earth"></div>
{% endhighlight %}

Thats it. Our markup is done. Time for some CSS now. Lets break this part into numbered steps.

**STEP 1**: 

Lets give our earth some dimensions. Give it a <code>width</code> and <code>height</code> of 100 pixels. Also give a temporary <code>background</code> of blue color just to know what it is becoming.

{% highlight css linenos %}
#earth {
	width: 100px;
	height: 100px;
	background: blue;
}
{% endhighlight %}

**STEP 2**: 

Earth isn't all that square for sure. Lets make it a perfect circle by giving it a [<code>border-radius</code>](https://developer.mozilla.org/en-US/docs/CSS/border-radius) of 50%.

{% highlight css linenos %}
#earth {
	width: 100px;
	height: 100px;
	background: blue;
	border-radius: 50%;
}
{% endhighlight %}

**STEP 3**: 

Much better now. But still doesn't looks like our earth. Yeah, you're right...we need a texture. Lets pick an earth texture to put on our present blue circle. I have selected [this image](http://www.noirextreme.com/digital/Earth-Color4096.jpg) here for this tutorial (you could use any of your choice). Set the image as the background of our <code>div</code> instead of the blue color we have.

{% highlight css linenos %}
#earth {
	width: 100px;
	height: 100px;
	background: url(http://www.noirextreme.com/digital/Earth-Color4096.jpg);
	border-radius: 50%;
}
{% endhighlight %}

**Step 4**: 

Ahh, all we see is a blue color still. Why? Well that is because the texture we are using is quite big for a 100x100 earth. We need to scale down the background a bit. Lets try giving it a <code>background-size</code> of something according to our dimensions. I find 210 pixels to be a fit here.

{% highlight css linenos %}
#earth {
	width: 100px;
	height: 100px;
	background: url(http://www.noirextreme.com/digital/Earth-Color4096.jpg);
	border-radius: 50%;
	background-size: 210px;
}
{% endhighlight %}

**Step 5**:

Seems better. But our earth still looks all flat. Time to give it some 3D feel by adding some lighting. For this we use [<code>box-shadow</code>](https://developer.mozilla.org/en-US/docs/CSS/box-shadow) CSS property. Give it an inner blackish shadow from left.

{% highlight css linenos %}
#earth {
	width: 100px;
	height: 100px;
	background: url(http://www.noirextreme.com/digital/Earth-Color4096.jpg);
	border-radius: 50%;
	background-size: 210px;
	box-shadow: inset 16px 0 40px 3px black;
}
{% endhighlight %}

To make it more realistic, add another white shadow from right side, a subtle one with some opacity.

{% highlight css linenos %}
#earth {
	width: 100px;
	height: 100px;
	background: url(http://www.noirextreme.com/digital/Earth-Color4096.jpg);
	border-radius: 50%;
	background-size: 210px;
	box-shadow: inset 16px 0 40px 3px rgb(0, 0, 0),
		inset -3px 0 6px 2px rgba(255, 255, 255, 0.2);
}
{% endhighlight %}

**Step 6**:

Now that looks like our earth. One final thing we will do is...rotate it. How? [CSS Animations](https://developer.mozilla.org/en-US/docs/CSS/Using_CSS_animations) to the rescue. We first need to define our own animation keyframes which essentially means telling which CSS property will change to what value and at what time. But wait! What CSS property can we use to make a rotation animation?

Well, the rotation illusion is actually created by simply scrolling the background image horizontally which is by default tiled both horizontally and vertically. Hence we make use of <code>background-position-x</code> CSS to do so. Add the following CSS to define the animation keyframes which we call <code>rotate</code>:

{% highlight css linenos %}
@keyframes rotate {
  from { background-position-x: 0px; }
  to { background-position-x: 210px; }
}
{% endhighlight %}

So here we are defining our animation to change the <code>background-position</code> <code>from</code> 0px when animation cycle starts <code>to</code> 210px when cycle ends. Why we chose 210px for the final value? Remember that is the size we set for our background-image. So for a seamless scrolling we shift the background image equal to its width.

**Step 7**: 

Nothing happens though because we have not yet used the above defined animation. To use it, we set the <code>animation-name</code> CSS property to our animation name (rotate).

{% highlight css linenos %}
#earth {
	width: 100px;
	height: 100px;
	background: url(http://www.noirextreme.com/digital/Earth-Color4096.jpg);
	border-radius: 50%;
	background-size: 210px;
	box-shadow: inset 16px 0 40px 3px rgb(0, 0, 0),
		inset -3px 0 6px 2px rgba(255, 255, 255, 0.2);
	animation-name: rotate;
}
{% endhighlight %}

Then we define the time it should take for one animation cycle using <code>animation-duration</code> property. Set a value of 4 seconds for the same.

{% highlight css linenos %}
#earth {
	width: 100px;
	height: 100px;
	background: url(http://www.noirextreme.com/digital/Earth-Color4096.jpg);
	border-radius: 50%;
	background-size: 210px;
	box-shadow: inset 16px 0 40px 3px rgb(0, 0, 0),
		inset -3px 0 6px 2px rgba(255, 255, 255, 0.2);
	animation-name: rotate;
	animation-duration: 4s;
}
{% endhighlight %}

Notice here how the animation plays just once and stops. We must tell the animation to play in an infinte loop using the <code>animation-iteration-count</code> property.

{% highlight css linenos %}
#earth {
	width: 100px;
	height: 100px;
	background: url(http://www.noirextreme.com/digital/Earth-Color4096.jpg);
	border-radius: 50%;
	background-size: 210px;
	box-shadow: inset 16px 0 40px 3px rgb(0, 0, 0),
		inset -3px 0 6px 2px rgba(255, 255, 255, 0.2);
	animation-name: rotate;
	animation-duration: 4s;
	animation-iteration-count: infinite;
}
{% endhighlight %}

One final adjustment to make the animation smooth, set the <code>animation-timing-function</code> to <code>linear</code>.

{% highlight css linenos %}
#earth {
	width: 100px;
	height: 100px;
	background: url(http://www.noirextreme.com/digital/Earth-Color4096.jpg);
	border-radius: 50%;
	background-size: 210px;
	box-shadow: inset 16px 0 40px 3px rgb(0, 0, 0),
		inset -3px 0 6px 2px rgba(255, 255, 255, 0.2);
	animation-name: rotate;
	animation-duration: 4s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}
{% endhighlight %}

And we are done! You may give the body a black background to get a feel of space. Also you can make different planets by just changing the background texture. So go and make some cool CSS planets.

Earth image credits: [http://www.noirextreme.com/earth](http://www.noirextreme.com/earth)

Cheers!