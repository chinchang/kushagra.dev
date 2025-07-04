---
layout: post
title: "Strong vs Em"
tags:
  - accessibility
  - html
course_banner: true
---

`<strong>` and `<em>` are two of the most basic tags that we learn when we start learning HTML. I am sure you must have used both these tags multiple times. I have too. But somewhere at the back of my mind I always had that slight confusion about which cases each should be used. In fact about which places one tag shouldn't be used. So I finally decided to look up the specifications to clear that doubt once and for all. And I must admit, the specification does a great job at explaining the purpose of each.

If you also face that slight confusion about using `<strong>` and `<em>` tags, you are at the right place. This article tries to re-express the learnings I got by reading the <cite>W3C specification</cite>.

## TL;DR

<div class="info-box">
If it's just visual importance, you want <code>strong</code>. If it alters the sentence meaning, use <code>em</code>.
</div>

## The `<strong>` tag

Firstly, to quote the <cite><a href="https://www.w3.org/TR/html50/text-level-semantics.html#the-strong-element">W3C specification</a></cite>

<blockquote>
The strong element represents strong importance, seriousness, or urgency for its contents.
</blockquote>

Let's try to understand those 3 use cases.

### Importance

Importance can be thought of like "hierarchy". For example, say you are describing certain items in different paragraphs. You will probably start the paragraph by putting the item name in `strong` tags, like so:

```html
<p>
  <strong>Item X</strong>: This paragraph is all about describing Item X, it's
  properties and behaviour.
</p>

<p>
  <strong>Item Y</strong>: This paragraph is all about describing Item Y, it's
  properties and behaviour.
</p>
```

They are acting similar to headings, visually. I compare importance with hierarchy because if someone needs to quickly scan all such items described in the paragraphs, they can just glance at the `strong` texts which also appear bold (and hence seemingly higher up the hierarchy).

### Seriousness

A classic example of this is when you need to show a warning or error. You could simply show a sentence describing the whole warning but there could be a chance that user ignores reading the whole text, and thus the warning. To make it more evident that the particular text is conveying a warning, we can wrap it in `strong` tags. Again, the bold appearance of the `strong` tag helps us convey that this is not just another text. It's something serious and needs to be seen.

A simple example:

```html
<strong>Warning: You data will lost in 35 seconds</strong>
```

which renders as:

<strong>Warning: You data will be lost in 35 seconds</strong>

### Urgency

This use case is something I have encountered quite a lot, especially while writing emails. Say you are writing a long paragraph and there are certain things that you want the reader to read first and foremost. Those things can be wrapped in `strong` tags.

Again, the whole premise is that the person reading your long text doesn't have the time to read all the text and even if they do, there might be certain important pieces of text that are intended to be read first and act urgently. The `strong` tag helps us achieve that.

I know all the 3 use cases seem similar and overlapping each other. That is true. But overall they do help to construct a good set of intentions where you would use the `strong` tag.

## The `<em>` tag

`em` tag reads as `emphasis` but it certainly isn't just that. In fact, it's that word _emphasis_ that has confused a lot of us in thinking that it is similar to the `strong` tag, which is also used to emphasize the importance of something. And it is not!

Again, to quote the <cite><a href="https://www.w3.org/TR/html50/text-level-semantics.html#the-em-element">W3C specification</a></cite>:

<blockquote>
The em element represents stress emphasis of its contents.
</blockquote>

**Stress emphasis** is the important thing to note here. It actually has to do with how you speak a particular piece of text.
Let me explain the gist of `em` tag with a gif:

<img src="" class="visually-hidden" alt="A person making air quotes while text shows on then screen: Get the &quot;Laundry&quot; (with quotes around the word - &quot;laundry&quot;)">
<iframe tabindex="-1" aria-hidden="true" src="https://giphy.com/embed/31P5RGyIVBhMMfw0F7" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com">via GIPHY</a></p>

I am sure you have seen people doing this quote gesture while speaking a particular word or phrase in a long sentence. Imagine they hadn't done that gesture while speaking that word/phrase. Would you have got the same meaning out of that speaker? No. Because the specific stress that the speaker put on that particular part of the sentence, changed their intended meaning.

This is exactly what the `em` tag helps you do while writing. You can wrap certain parts of sentences to simulate the same stress as you would while speaking.

To make it more clear, I would like to show you the exact example from the <cite>W3C specification</cite> because I think it does the job perfectly in explaining what `em` tag does.

<blockquote>
These examples show how changing the stress emphasis changes the meaning. First, a general statement of fact, with no stress:

`<p>Cats are cute animals.</p>`

By emphasizing the first word, the statement implies that the kind of animal under discussion is in question (maybe someone is asserting that dogs are cute):

`<p><em>Cats</em> are cute animals.</p>`

Moving the stress to the verb, one highlights that the truth of the entire sentence is in question (maybe someone is saying cats are not cute):

`<p>Cats <em>are</em> cute animals.</p>`

By moving it to the adjective, the exact nature of the cats is reasserted (maybe someone suggested cats were mean animals):

`<p>Cats are <em>cute</em> animals.</p>`

Similarly, if someone asserted that cats were vegetables, someone correcting this might emphasize the last word:

`<p>Cats are cute <em>animals</em>.</p>`

By emphasizing the entire sentence, it becomes clear that the speaker is fighting hard to get the point across. This kind of stress emphasis also typically affects the punctuation, hence the exclamation mark here.

`<p><em>Cats are cute animals!</em></p>`

Anger mixed with emphasizing the cuteness could lead to markup such as:

<p><em>Cats are <em>cute</em> animals!</em></p>
</blockquote>

Hope these examples make it all clear.

## Screen reader accessibility

`<strong>` and `<em>` are not just meant to convey semantics visually, but they are also supposed to convey the same meaning to screen reader users too, ideally through a change of voice.

From what I could test, VoiceOver doesn't seem to differentiate normal text from the emphasized text. Also, there seems to be no recent studies on the Web for other screen readers like JAWS and NVDA. Hence, I am not covering this topic in much details. I would appreciate if someone can share studies on this matter, which I can update here.

Nevertheless, screen readers are continuously improving and our correct use of the tags will only help users eventually.

Also, it's worth noting that accessibility isn't always about screen readers. The visual difference that comes with `strong`/`em` tag is great for increasing reading comprehension and helping with cognitive disabilities like dyslexia.

## Summary

Next time you get confused which tag to use out of `strong` and `em`, think about this: What's your intention - is it just visual importance or do you want to stress over something to communicate better by changing the meaning of the sentence (like you would have stressed while speaking)?

If it's just visual importance, you want `strong`. If it alters the sentence meaning, use `em`.

## What about `b` and `i` tags?

There is also a common confusion while choosing between `strong`/`b` and `em`/`i`. Visually they look exactly the same as their counterparts. Then what's the difference?

The difference lies in semantics. `strong` and `em` bring in some additional context or meaning wherever used. On the other hand, `b` and `i` are just for styling and visually differentiating some part of the sentence from the rest. You can consider `b` tag the same as a `span` with a CSS of `font-weight: bold` applied on it. Similarly, `i` can be thought of as a `span` with CSS of `font-style: italics` applied on it.

So if you want to communicate importance, urgency or seriousness, use `strong`. If you just need to draw attention without any importance, use `b` or rather just use CSS `font-weight`. Similarly, if you want put stress on something, use `em`. If it's just about highlighting a different type of text, such as a word in another language, then use `<i>` or just CSS `font-style`.

[Read more about `b` tag](https://www.w3.org/TR/html50/text-level-semantics.html#the-b-element)
[Read more about `i` tag](https://www.w3.org/TR/html50/text-level-semantics.html#the-i-element)

That is all for this post. Hope this helps understand these common tags better.

<hr class="post__divider" />

Special thanks to [Jitendra Vyas](https://twitter.com/jitendravyas), [@stommepoes](https://twitter.com/stommepoes), and the lovely members of [Slack Web Accessibility group](https://web-a11y.slack.com) for reviewing this post.
