---
layout: post
title: "Adding search in your jekyll blog"
tags:
  - tutorial
---

I recently implemented search on this website (made in Jekyll). Its a complete client-side search and hence very quick and easy to use. To try it out, press the '/' or ESC key and type something.

There are not too many articles out there on implementing a functional post search on a Jekyll blog, so I thought of writing about it. The following method described works over your blog's RSS feeds. So make sure you have your RSS feed URL ready. If you have a jekyll/octopress blog, chances are you already have a `feed.xml` in your root folder. If not, [read here](http://joelglovier.com/writing/rss-for-jekyll/).

### tl;dr

[**super-search**](https://github.com/chinchang/super-search/) - A library to easily add search on your jekyll or any other blog.

Lets start implementing the search.

### Fetching the RSS feeds.

First thing we need to do is fetch the RSS feed XML. This is simple with `XMLHttpRequest`. We fetch the XML and create a DOM out of it for parsing later.

```js
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "/feed.xml");
xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState != 4) return;
  if (xmlhttp.status != 200 && xmlhttp.status != 304) {
    return;
  }

  // Create a DOM out of the XML string.
  var node = new DOMParser().parseFromString(xmlhttp.responseText, "text/xml");
  node = node.children[0];
  posts = xmlToJson(node).channel.item;
};
xmlhttp.send();
```

### Parsing XML feeds into JSON

This can be done by traversing the XML tree and creating a JavaScript object as we go. I used [David Walsh's](http://davidwalsh.name/convert-xml-json) `xmlToJson` function with some modifications to make it more suitable:

<pre><code class="language-javascript">
function xmlToJson(xml) {
	// Create the return object
	var obj = {};
	if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	// If just one text node inside
	if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
		obj = xml.childNodes[0].nodeValue;
	}
	else if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}
</code></pre>

Now you get a simple to use JavaScript object to search upon.

### Matching the input with post data

Now all that remains is taking user input and matching it with the parsed posts we have. In my implementation, matching posts are ones which contain the input string in their title or full content.

<pre><code class="language-javascript">
document.querySelector('#your-search-input').addEventListener('input', onInputChange);

function onInputChange(e) {
	var currentInputValue = e.target.value,
		date;

	// We ignore input of less than 3 characters in length.
	if (!currentInputValue || currentInputValue.length < 3) {
		return;
	}

	// Filter out all posts that have entered string in their
	// title or description.
	var matchingPosts = posts.filter(function (post) {
		if (post.title.indexOf(currentInputValue) !== -1 || post.description.indexOf(currentInputValue) !== -1) {
			return true;
		}
	});

	document.querySelector('#your-results-container').innerHTML = matchingPosts.map(function (post) {
		date = new Date(post.pubDate);
		return '<li><a href="' + post.link + '">' + post.title + '<span class="search__result-date">' + date.toUTCString().replace(/.*(\d{2})\s+(\w{3})\s+(\d{4}).*/,'$2 $1, $3') + '</span></a></li>';
	}).join('');
}
</code></pre>

And done! You have a quick search system in your blog.

### Thats not all!

I am releasing a library which implements the search system described above and even much more addons. Presenting [**super-search**](https://github.com/chinchang/super-search/), an easy to add search system for your blog. It works equally good with any blog having RSS feed file.

Simply add the JS and CSS files to your blog:

<pre><code class="language-markup">
&lt;script src="super-search.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="super-search.css"&gt;
</code></pre>

And initiate the library at the end of your page (before closing BODY tag):

<pre><code class="language-javascript">
superSearch();
</code></pre>

Now enjoy a fast search system on your blog. [Read more about it here](https://github.com/chinchang/super-search/).

Until next time!
