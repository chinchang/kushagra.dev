---
layout: post
title: "CSS only 3D card"
tags:
  - css
  - learning
  - tutorial
---

Today we'll build a 3D card with just CSS. Yes, just CSS! This is sort of an extension to my last post - "scroll-baded 3d cards". So if you haven't read that already, I recommend to read that first.

Few more things about what we are building here. It will be a 3d card that can be rotated and viewed by same gesture as if you are scrolling the page - horizontally and vertically. [See the final demo](#final-demo-🥳).

## 1. Get the card

```html
<div class="card-wrap">
  <div class="card"></div>
</div>
```

```css
.card-wrap {
  position: fixed;
  display: grid;
  place-content: center;
  inset: 0;
  transform-style: preserve-3d;
  perspective: 800px;
}
.card {
  border-radius: 1.5rem;
  height: 80vh;
  aspect-ratio: 9 / 16;
  background: url("https://cdn.midjourney.com/f87ef132-b7e1-40a4-9e7c-0bf90e7e7724/0_3.png");
  background-size: cover;
  box-shadow: 50px 50px 30px rgba(0, 0, 0, 0.3);
  transform: rotateX(10deg) rotateY(10deg);
}
```

Few things about the code above:

1. `card-wrap` solves 2 purposes here - acts as a container to center our card. And also to give a 3D perspective to our card.
2. `card` is a usual card which takes 80% of viewport height and has 16:9 aspect ratio. It has a cool background which I generated through Midjourney for this demo.
3. For now the card has a static shadow and rotation which we'll make dynamic as we go!

Here is what we get:

{% demo "600px" %}

<div class="card-wrap">
  <div class="card"></div>
</div>
<style>
.card-wrap {
  display: grid;
  place-content: center;
  inset: 0;
  transform-style: preserve-3d;
  perspective: 800px;
}
.card {
  border-radius: 1.5rem;
  height: 80vh;
  aspect-ratio: 9 / 16;
  background: url("https://cdn.midjourney.com/f87ef132-b7e1-40a4-9e7c-0bf90e7e7724/0_3.png");
  background-size: cover;
  box-shadow: 50px 50px 30px rgba(0, 0, 0, 0.3);
  transform: rotateX(10deg) rotateY(10deg);
}
</style>
{% enddemo %}

## 2. Bring in some scroll

This is an interesting illusion! As I mentioned before, we'll enable card rotation through scroll. Which means if you have double finger scroll gesture on your track pad, you can very intuitively use it explore the card from all angles. But, how do we get scroll on the page,...there is nothing overflowing from our page? For that, we'll create a dummy invisble element which is so big that it overflows out of our viewport.

This creates another issue that our card will also glide along with the scroll. But we don't want that. So what we do is make the `card-wrap` fixed positioned. So now you get this nice illusion where you are scrolling on the page technically but nothing scrolls.

```html
<div class="dummy"></div>
<div class="card-wrap">
  <div class="card"></div>
</div>
```

```css
.card-wrap {
  position: fixed;
  display: grid;
  place-content: center;
  inset: 0;
  transform-style: preserve-3d;
  perspective: 800px;
}
.dummy {
  width: 150vw;
  height: 150vh;
}
```

1. Our dummy element is set to be 150% (i.e. 1.5 times) of our viewport. You can increase/decrease it based on how much do you want user to scroll to see the effect.
2. `card-wrap` is now fixed positioned so as to be independent from the page scroll.

Notice that now our page has scrolls.

{% demo "600px" %}

<div class="dummy"></div>
<div class="card-wrap">
  <div class="card"></div>
</div>
<style>
.card-wrap {
  position: fixed;
  display: grid;
  place-content: center;
  inset: 0;
  transform-style: preserve-3d;
  perspective: 800px;
}
.dummy {
  width: 150vw;
  height: 150vh;
}
.card {
  border-radius: 1.5rem;
  height: 80vh;
  aspect-ratio: 9 / 16;
  background: url("https://cdn.midjourney.com/f87ef132-b7e1-40a4-9e7c-0bf90e7e7724/0_3.png");
  background-size: cover;
  box-shadow: 50px 50px 30px rgba(0, 0, 0, 0.3);
  transform: rotateX(10deg) rotateY(10deg);
}
</style>
{% enddemo %}

## 3. Rotate card as we scroll

It's time to use some scroll-linked animation to rotate our card. Again, to get a recap, you can [go through my previous post about scroll-linked animations](/blog/scroll-based-3d-cards/).

We'll have the card rotated from `-10deg` to `10deg` on x and y axes as we scroll, similar to how we did in the 3d card carousel.

```css
:root {
  --rotation: 10deg;
}
.card {
  animation: rotate-x linear, rotate-y linear;
  animation-timeline: scroll(root inline), scroll(root block);
}
@keyframes rotate-x {
  from {
    transform: rotateX(var(--rotation));
  }
  to {
    transform: rotateX(calc(var(--rotation) * -1));
  }
}
@keyframes rotate-y {
  from {
    transform: rotateX(calc(var(--rotation) * -1));
  }
  to {
    transform: rotateX(var(--rotation));
  }
}
```

1. `rotate-x` & `rotate-y` are 2 animations that rotate from -10deg to 10deg respectively.
2. We add 2 animations on the card. Note how we also assign 2 different animation timelines because we want to attach the `rotate-x` animation with y-direction scroll and `rotate-y` animation with x-direction scroll.
3. Another thing different from the previous blog post is that we are not creating a named scroll here. Another shortcut to attach animation timeline to scroll is using the `scroll` function. `root` inside `scroll` simply means we are referring to document's root scroll.

Except that this doesn't work as expected! Try for yourself and observe how it behaves:

{% demo "600px" %}

<div class="dummy"></div>
<div class="card-wrap">
  <div class="card"></div>
</div>
<style>
.card-wrap {
  position: fixed;
  display: grid;
  place-content: center;
  inset: 0;
  transform-style: preserve-3d;
  perspective: 800px;
}
.dummy {
  width: 150vw;
  height: 150vh;
}
.card {
  border-radius: 1.5rem;
  height: 80vh;
  aspect-ratio: 9 / 16;
  background: url("https://cdn.midjourney.com/f87ef132-b7e1-40a4-9e7c-0bf90e7e7724/0_3.png");
  background-size: cover;
  box-shadow: 50px 50px 30px rgba(0, 0, 0, 0.3);
  animation: rotate-x linear, rotate-y linear;
  animation-timeline: scroll(root inline), scroll(root block);
}
@keyframes rotate-x {
  from {
    transform: rotateX(var(--rotation));
  }
  to {
    transform: rotateX(calc(var(--rotation) * -1));
  }
}
@keyframes rotate-y {
  from {
    transform: rotateX(calc(var(--rotation) * -1));
  }
  to {
    transform: rotateX(var(--rotation));
  }
}
</style>
{% enddemo %}

The card rotates nicely as you scroll vertically. But horizontal scroll doesn't affect the card's rotation. Do see what's wrong? Hint: It's the 2 keyframe animations.

The issue is - both animations modify the `transform` property of the card. So one overrides other. Since `rotate-y` is set after `rotate-x` on the card in the `animation` property, vertical scroll works. Let's fix this issue next.

## 4. Making both rotations work

It's clear that our animations can't simply work on the `transform` property since one overrides other. One solution here is to have each animation only work a particular axis rotation. But there are no `rotateX` or `rotateY` properties in CSS. Custom properties to the rescue! When the property we want isn't there, we can create our own custom properties.

```css
.card {
  transform: rotateX(var(--ry)) rotateY(var(--rx));
  animation: rotate-x linear, rotate-y linear;
  animation-timeline: scroll(root inline), scroll(root block);
}
@property --rx {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
@property --ry {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
@keyframes rotate-x {
  0% {
    --rx: var(--rotation);
  }
  100% {
    --rx: calc(var(--rotation) * -1);
  }
}
@keyframes rotate-y {
  0% {
    --ry: calc(var(--rotation) * -1);
  }
  100% {
    --ry: var(--rotation);
  }
}
```

1. Our keyframe animations now modify `--rx` and `--ry` custom properties now.
2. Custom properties by default are not animatable. Unless we defined what kind of value they can contain, through the `@property` rule. We define our custom properties to be of type `<angle>`.
3. And now our card uses the 2 custom properties as `transform: rotateX(var(--ry)) rotateY(var(--rx))`.

{% demo "600px" %}

<div class="dummy"></div>
<div class="card-wrap">
  <div class="card"></div>
</div>
<style>
  :root {
  --rotation: 10deg;
}
  .card-wrap {
  position: fixed;
  display: grid;
  place-content: center;
  inset: 0;
  transform-style: preserve-3d;
  perspective: 800px;
}
.dummy {
  width: 150vw;
  height: 150vh;
}
.card {
  border-radius: 1.5rem;
  height: 80vh;
  aspect-ratio: 9 / 16;
  background: url("https://cdn.midjourney.com/f87ef132-b7e1-40a4-9e7c-0bf90e7e7724/0_3.png");
  background-size: cover;
  box-shadow: 50px 50px 30px rgba(0, 0, 0, 0.3);
  transform: rotateX(var(--ry)) rotateY(var(--rx));
  animation: rotate-x linear, rotate-y linear;
  animation-timeline: scroll(root inline), scroll(root block);
}

@property --rx {
syntax: "<angle>";
initial-value: 0deg;
inherits: false;
}
@property --ry {
syntax: "<angle>";
initial-value: 0deg;
inherits: false;
}
@keyframes rotate-x {
0% {
--rx: var(--rotation);
}
100% {
--rx: calc(var(--rotation) \* -1);
}
}
@keyframes rotate-y {
0% {
--ry: calc(var(--rotation) \* -1);
}
100% {
--ry: var(--rotation);
}
}
</style>
{% enddemo %}

## 5. Make shadows dynamic

```css
:root {
  --shadow-length: 50px;
}
.card {
  box-shadow: var(--shadow-x) var(--shadow-y) 30px rgba(0, 0, 0, 0.3);
  transform: rotateX(var(--ry)) rotateY(var(--rx));
  animation: rotate-x linear, rotate-y linear, shadow-x linear, shadow-y linear;
  animation-timeline: scroll(root inline), scroll(root block), scroll(
      root inline
    ), scroll(root block);
}
/* other animations */
@property --shadow-x {
  syntax: "<length>";
  initial-value: 0px;
  inherits: false;
}
@keyframes shadow-x {
  0% {
    --shadow-x: calc(-1 * var(--shadow-length));
  }
  100% {
    --shadow-x: var(--shadow-length);
  }
}
@property --shadow-y {
  syntax: "<length>";
  initial-value: 0px;
  inherits: false;
}
@keyframes shadow-y {
  0% {
    --shadow-y: calc(-1 * var(--shadow-length));
  }
  100% {
    --shadow-y: var(--shadow-length);
  }
}
```

More or less similar to how we added rotation on both axes, we add 2 shadow animations for x and y direction. Our card is looking pretty 3D now:

{% demo "600px" %}

<div class="dummy"></div>
<div class="card-wrap">
  <div class="card"></div>
</div>
<style>
  :root {
  --rotation: 10deg;
  --shadow-length: 50px;
}
.card-wrap {
  position: fixed;
  display: grid;
  place-content: center;
  inset: 0;
  transform-style: preserve-3d;
  perspective: 800px;
}
.dummy {
  width: 150vw;
  height: 150vh;
}
.card {
  border-radius: 1.5rem;
  height: 80vh;
  aspect-ratio: 9 / 16;
  background: url("https://cdn.midjourney.com/f87ef132-b7e1-40a4-9e7c-0bf90e7e7724/0_3.png");
  background-size: cover;
  box-shadow: var(--shadow-x) var(--shadow-y) 30px rgba(0, 0, 0, 0.3);
  transform: rotateX(var(--ry)) rotateY(var(--rx));
  animation: rotate-x linear, rotate-y linear, shadow-x linear, shadow-y linear;
  animation-timeline: scroll(root inline), scroll(root block),
    scroll(root inline), scroll(root block);
}

@property --rx {
syntax: "<angle>";
initial-value: 0deg;
inherits: false;
}
@property --ry {
syntax: "<angle>";
initial-value: 0deg;
inherits: false;
}

@keyframes rotate-x {
0% {
--rx: var(--rotation);
}
100% {
--rx: calc(var(--rotation) \* -1);
}
}
@keyframes rotate-y {
0% {
--ry: calc(var(--rotation) \* -1);
}
100% {
--ry: var(--rotation);
}
}

@property --shadow-x {
syntax: "<length>";
initial-value: 0px;
inherits: false;
}
@keyframes shadow-x {
0% {
--shadow-x: calc(-1 \* var(--shadow-length));
}
100% {
--shadow-x: var(--shadow-length);
}
}
@property --shadow-y {
syntax: "<length>";
initial-value: 0px;
inherits: false;
}
@keyframes shadow-y {
0% {
--shadow-y: calc(-1 \* var(--shadow-length));
}
100% {
--shadow-y: var(--shadow-length);
}
}
</style>
{% enddemo %}

## 6. Icing - Shine ✨

There is one final effect we can add to make our card real 3D - a shine! We create the shine through a `radial-gradient` over the card's current background image. We also move that shine across the card as it rotates.

```css
.card {
  ...
  background: radial-gradient(
      circle at var(--shine-x) var(--shine-y),
      #fffa 40px,
      #0000
    ),
    url("https://cdn.midjourney.com/f87ef132-b7e1-40a4-9e7c-0bf90e7e7724/0_3.png");
  ...
  animation: rotate-y linear, shadow-y linear, rotate-x linear, shadow-x linear,
    anim-shine-x linear, anim-shine-y linear;
  animation-timeline: scroll(root), scroll(root), scroll(root inline), scroll(root inline),
    scroll(root inline), scroll(root);
}
/* other animations */
@property --shine-x {
  syntax: "<percentage>";
  initial-value: 0%;
  inherits: false;
}
@property --shine-y {
  syntax: "<percentage>";
  initial-value: 0%;
  inherits: false;
}
@keyframes anim-shine-x {
  0% {
    --shine-x: 0%;
  }
  100% {
    --shine-x: 100%;
  }
}
@keyframes anim-shine-y {
  0% {
    --shine-y: 100%;
  }
  100% {
    --shine-y: 0%;
  }
}
```

The shine is a circle created with `radial-gradient` from transparent white to complete transparent and whose center keeps on moving through the custom variables.

### Final demo 🥳

{% demo "600px" %}

<div class="dummy"></div>
<div class="card-wrap">
  <div class="card"></div>
</div>
<style>
  :root {
      --rotation: 10deg;
      --shadow-length: 50px;
    }
    ::-webkit-scrollbar,
    ::-webkit-scrollbar-thumb,
    ::-webkit-scrollbar-track,
    ::-webkit-scrollbar-corner {
      /*background: transparent;*/
    }
    .card-wrap {
      position: fixed;
      display: grid;
      place-content: center;
      inset: 0;
      transform-style: preserve-3d;
      perspective: 800px;
    }
    .card {
      border-radius: 1.5rem;
      height: 80vh;
      aspect-ratio: 9 / 16;
      background: radial-gradient(
          circle at var(--shine-x) var(--shine-y),
          #fffa 40px,
          #0000
        ),
        url("https://cdn.midjourney.com/f87ef132-b7e1-40a4-9e7c-0bf90e7e7724/0_3.png");
      background-size: cover;
      box-shadow: var(--shadow-x) var(--shadow-y) 30px rgba(0, 0, 0, 0.3);
      transform: rotateX(var(--ry)) rotateY(var(--rx));
      animation: rotate-y linear, shadow-y linear, rotate-x linear,
        shadow-x linear, anim-shine-x linear, anim-shine-y linear;
      animation-timeline: scroll(root), scroll(root), scroll(root inline),
        scroll(root inline), scroll(root inline), scroll(root);
    }
    .dummy {
      width: 150vw;
      height: 150vh;
    }
    @property --rx {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }
    @property --ry {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }
 
    @keyframes rotate-x {
    0% {
    --rx: var(--rotation);
    }
    100% {
    --rx: calc(var(--rotation) \* -1);
    }
    }
    @keyframes rotate-y {
    0% {
    --ry: calc(var(--rotation) \* -1);
    }
    100% {
    --ry: var(--rotation);
    }
    }
    @property --shadow-y {
      syntax: "<length>";
      initial-value: 0px;
      inherits: false;
    }
    @keyframes shadow-y {
      0% {
        --shadow-y: calc(-1 * var(--shadow-length));
      }
      100% {
        --shadow-y: var(--shadow-length);
      }
    }
    @property --shadow-x {
      syntax: "<length>";
      initial-value: 0px;
      inherits: false;
    }
    @keyframes shadow-x {
      0% {
        --shadow-x: var(--shadow-length);
      }
      100% {
        --shadow-x: calc(-1 * var(--shadow-length));
      }
    }
    @property --shine-x {
      syntax: "<percentage>";
      initial-value: 0%;
      inherits: false;
    }
    @property --shine-y {
      syntax: "<percentage>";
      initial-value: 0%;
      inherits: false;
    }
    @keyframes anim-shine-x {
      0% {
        --shine-x: 0%;
      }
      100% {
        --shine-x: 100%;
      }
    }
    @keyframes anim-shine-y {
      0% {
        --shine-y: 100%;
      }
      100% {
        --shine-y: 0%;
      }
    }
</style>
{% enddemo %}

This illusion works best on a mobile where scrolling is much more easy and intuitive. One improvement that can be done for mobile (or for trackpad supported devices) is hiding the scrollbars, which makes the whole effect more seamless.

```css
::-webkit-scrollbar,
::-webkit-scrollbar-thumb,
::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background: transparent;
}
```

If you enjoyed reading this, do share!
