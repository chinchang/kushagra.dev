---
layout: post
title: "Scroll-based 3D card carousel"
tags:
  - css
  - learning
  - tutorial
---

In this blog post I'll show how we can simulate cards with 3D depth based on scrolling using the newly arrived scroll-based animations.

We’ll be creating a carousel of cards that change inclination while scrolling. The cards will seem to have a 3D depth i.e we’ll be able to see either of left or right sides of the card based on the carousel’s inclination while scrolling. [See the final effect we’ll create](#final-demo-🥳).

### 1. Place the cards

```html
<div class="carousel-wrap">
  <div class="carousel">
    <div class="card" style="--height: 7ex">Card 1</div>
    <div class="card" style="--height: 9ex">Card 2</div>
    <div class="card" style="--height: 10ex">Card 3</div>
    <div class="card" style="--height: 6ex">Card 4</div>
    <div class="card" style="--height: 12ex">Card 5</div>
  </div>
</div>
```

```css
.carousel {
  display: flex;
  padding: 1rem;
  overflow-x: scroll;
}
.card {
  flex-shrink: 0;
  width: 28ch;
  height: var(--height);
  margin: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: #f7f1f2;
  text-align: center;
  font-family: sans-serif;
  border: 2px solid #222;
  box-shadow: -10px 5px 0px 2px rgba(0, 0, 0, 0.75);
}
```

Few things about the code above:

1. `carousel-wrap` doesn’t do anything for now 🤷🏻‍♂️. We’ll use it later.
2. Cards are given different heights, just for for visual enhancement, through a custom property called `--height`. Interestingly, the unit of these heights are `ex` which is height of the letter `x` in the current font...something you might want to use to approximate a set number of lines in an element.
3. `.carousel` is a flex container.
4. `.card` is given a `flex-shrink: 0` so that the cards don’t shrink because of limited width of the parent. And instead take the given width and overflow the parent.
5. We give the cards a box-shadow to create an illusion of a depth on the cards. The left side shadow gives the impression of the visible left side of our 3D cards.

Here is what we get:

{% demo "22ex" %}

<div class="carousel-wrap">	
	<div class="carousel">
		<div class="card" style="--height: 7ex">Card 1</div>
		<div class="card" style="--height: 9ex">Card 2</div>
		<div class="card" style="--height: 10ex">Card 3</div>
		<div class="card" style="--height: 6ex">Card 4</div>
		<div class="card" style="--height: 12ex">Card 5</div>
	</div>
</div>
<style>
  .carousel {
  display: flex;
  padding: 1rem;
  overflow-x: scroll;
}
.card {
  flex-shrink: 0;
  width: 28ch;
  height: var(--height);
  margin: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: #f7f1f2;
  text-align: center;
  font-family: sans-serif;
  border: 2px solid #222;
  box-shadow: -10px 5px 0px 2px rgba(0, 0, 0, 0.75);
}
</style>
{% enddemo %}

### 2. Scroll-based inclination - give a timeline name for x-direction scrolling

Now the fun part starts. The overflowing set of cards create a scroll in their parent. We'll make this scroll the basis of our cool effect on the cards. First effect is inclining the set of cards from left-to-right when scrolling. We'll start by making use of the newly available `scroll-timeline` property to associate the x-direction scroll (`inline`) of the carousel to a name.

```css
.carousel {
  scroll-timeline: --carousel-scroll inline;
}
```

`--carousel-scroll` is called the timeline-name and is associated with x-direction scroll of the element `.carousel` .

### 3. Create animation to rotate

Scroll-based animation allows us to attach any animation to a scroll timeline i.e. the animation would progress as the scroll progresses. So let’s define an animation for rotating our carousel along y-axis and attach it will the scroll timeline we created above.

```css
@keyframes anim-rotate {
  from {
    transform: rotateY(8deg);
  }
  to {
    transform: rotateY(-8deg);
  }
}
.carousel-wrap {
  perspective: 600px;
}
.carousel {
  ...
  scroll-timeline: --carousel-scroll inline;
  animation: anim-rotate auto linear;
  animation-timeline: --carousel-scroll;
}
```

1. `anim-rotate` is an animation that rotates the carousel along y-axis from `8deg` to `-8deg`.
2. We attach the animation to the scroll timeline using the `animation-timeline` property.
3. We now need the `.carousel-wrap` element to create a 3d perspective of `600px`.

Scroll inside the carousel now and see it tilting from one side to another as you scroll! Voila!

{% demo "22ex" %}

<div class="carousel-wrap">	
	<div class="carousel">
		<div class="card" style="--height: 7ex">Card 1</div>
		<div class="card" style="--height: 9ex">Card 2</div>
		<div class="card" style="--height: 10ex">Card 3</div>
		<div class="card" style="--height: 6ex">Card 4</div>
		<div class="card" style="--height: 12ex">Card 5</div>
	</div>
</div>
<style>
  @keyframes anim-rotate {
  from {
    transform: rotateY(8deg);
  }
  to {
    transform: rotateY(-8deg);
  }
}
.carousel-wrap {
  perspective: 600px;
}
.carousel {
  display: flex;
  padding: 1rem;
  overflow-x: scroll;
  scroll-timeline: --carousel-scroll inline;
  animation: anim-rotate auto linear;
  animation-timeline: --carousel-scroll;
}
.card {
  flex-shrink: 0;
  width: 28ch;
  height: var(--height);
  margin: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: #f7f1f2;
  text-align: center;
  font-family: sans-serif;
  border: 2px solid #222;
  box-shadow: -10px 5px 0px 2px rgba(0, 0, 0, 0.75);
}
</style>
{% enddemo %}

But if you scroll and reach the last card, the depth looks incorrect - with that tilt we should be seeing the right side (depth) of the cards, not left. Let’s make it dynamic!

### 5. Parametrize the shadow's x offset and animate on scroll

```css
@keyframes anim-shadow {
  from {
    --shadow-x: -10px;
  }
  to {
    --shadow-x: 10px;
  }
}
.card {
  ...
  box-shadow: var(--shadow-x) 5px 0px 2px rgba(0, 0, 0, 0.75);
  animation: anim-shadow auto linear;
  animation-timeline: --carousel-scroll;
}
```

1. We create a animation for the card’s box-shadow. The animation basically animates a custom property called `--shadow-x` from `-10px` to `10px` - which represents the x-offset in our `box-shadow`.
2. We make the x-offset dynamic in our `box-shadow` by using the `--shadow-x` custom property.
3. As before, we set the animation on the card and attach it to the `--carousel-scroll` scroll timeline.

Try scrolling inside the carousel and you’ll notice something strange - The box-shadow doesn’t animates! Instead, half way through the scroll, the box-shadow’s x-offset changes abruptly from `-10px` to `10px` (Notice in the center card). That’s not what we want…we want the shadow to animate smoothly as we scroll.

{% demo "22ex" %}

<div class="carousel-wrap">	
	<div class="carousel">
		<div class="card" style="--height: 7ex">Card 1</div>
		<div class="card" style="--height: 9ex">Card 2</div>
		<div class="card" style="--height: 10ex">Card 3</div>
		<div class="card" style="--height: 6ex">Card 4</div>
		<div class="card" style="--height: 12ex">Card 5</div>
	</div>
</div>
<style>
@keyframes anim-rotate {
  from {
    transform: rotateY(8deg);
  }
  to {
    transform: rotateY(-8deg);
  }
}
@keyframes anim-shadow {
  from {
    --shadow-x: -10px;
  }
  to {
    --shadow-x: 10px;
  }
}
.carousel-wrap {
  perspective: 600px;
}
.carousel {
  display: flex;
  padding: 1rem;
  overflow-x: scroll;
  scroll-timeline: --carousel-scroll inline;
  animation: anim-rotate auto linear;
  animation-timeline: --carousel-scroll;
}
.card {
  flex-shrink: 0;
  width: 28ch;
  height: var(--height);
  margin: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: #f7f1f2;
  text-align: center;
  font-family: sans-serif;
  border: 2px solid #222;
  box-shadow: var(--shadow-x) 5px 0px 2px rgba(0, 0, 0, 0.75);
  animation: anim-shadow auto linear;
	animation-timeline: --carousel-scroll;
}
</style>
{% enddemo %}

### 6. Fixing the animation

Even though the offsets in the `box-shadow` value are animatable, they don’t animate for us. It's because of the custom property being used for the x-offset. The browser doesn’t know about our custom property and hence doesn’t animate it. We need to give some extra information about our custom property to the browser for it figure out how to animate the property.

```css
@property --shadow-x {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}
@keyframes anim-shadow {
  from {
    --shadow-x: -10px;
  }
  to {
    --shadow-x: 10px;
  }
}
.card {
  ...
  box-shadow: var(--shadow-x) 5px 0px 2px rgba(0, 0, 0, 0.75);
  animation: anim-shadow auto linear;
	animation-timeline: --carousel-scroll;
}
```

With the `@property` declaration we are telling the browser to treat `--shadow-x` as a `length` type value (like `width` is). And there we go, now the shadow offset animates perfectly!!

Now you have your nice pseudo 3D cards! 🥳

### Final demo 🥳

{% demo "22ex" %}

<div class="carousel-wrap">	
	<div class="carousel">
		<div class="card" style="--height: 7ex">Card 1</div>
		<div class="card" style="--height: 9ex">Card 2</div>
		<div class="card" style="--height: 10ex">Card 3</div>
		<div class="card" style="--height: 6ex">Card 4</div>
		<div class="card" style="--height: 12ex">Card 5</div>
	</div>
</div>
<style>
@keyframes anim-rotate {
  from {
    transform: rotateY(8deg);
  }
  to {
    transform: rotateY(-8deg);
  }
}
@property --shadow-x {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}
@keyframes anim-shadow {
  from {
    --shadow-x: -10px;
  }
  to {
    --shadow-x: 10px;
  }
}
.carousel-wrap {
  perspective: 600px;
}
.carousel {
  display: flex;
  padding: 1rem;
  overflow-x: scroll;
  scroll-timeline: --carousel-scroll inline;
  animation: anim-rotate auto linear;
  animation-timeline: --carousel-scroll;
}
.card {
  flex-shrink: 0;
  width: 28ch;
  height: var(--height);
  margin: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: #f7f1f2;
  text-align: center;
  font-family: sans-serif;
  border: 2px solid #222;
  box-shadow: var(--shadow-x) 5px 0px 2px rgba(0, 0, 0, 0.75);
  animation: anim-shadow auto linear;
	animation-timeline: --carousel-scroll;
}
</style>
{% enddemo %}

If you enjoyed reading this, do share!
