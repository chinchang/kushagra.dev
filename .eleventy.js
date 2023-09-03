const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

const markdownItConfig = {
  html: true,
  breaks: true,
  linkify: true,
};
const markdownItAnchorConfig = {
  permalink: true,
  permalinkClass: "bookmark",
  permalinkSymbol: "#",
};

const markdownLib = markdownIt(markdownItConfig).use(
  markdownItAnchor,
  markdownItAnchorConfig
);

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginWebc, {
    components: "_includes/components/**/*.webc",
  });
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addLayoutAlias("default", "layouts/default.html");
  eleventyConfig.addLayoutAlias("post", "layouts/post.html");

  eleventyConfig.addPairedShortcode("demo", function (content, height) {
    // console.log(122, content);
    const html = content
      .replace(/\n/g, "")
      .replace(/\s\s+/g, "")
      .replace(/\\\*/g, "*");
    // console.log(99, html);
    return `
       <div class="demo-frame" ${
         height ? `style="--height:${height}"` : ""
       }> <iframe  srcDoc='${html}'></iframe> </div>
      `;
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    const d = new Date(dateObj);
    return d.toDateString().substr(4);
  });

  // only content in the `posts/` directory
  eleventyConfig.addCollection("posts", function (collection) {
    return collection
      .getFilteredByGlob("./posts/*")
      .sort(function (a, b) {
        return a.date - b.date;
      })
      .reverse();
  });

  eleventyConfig.addCollection("tagList", (collection) => {
    const set = new Set();
    const coll = collection.getAllSorted();

    for (const item of collection.getAllSorted()) {
      if ("tags" in item.data) {
        const tags = item.data.tags;
        if (typeof tags === "string") {
          tags = [tags];
        }
        for (const tag of tags) {
          set.add(tag);
        }
      }
    }
    return [...set].sort();
  });

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("lab");
  eleventyConfig.addPassthroughCopy("games");
  eleventyConfig.addPassthroughCopy("uploads");
  eleventyConfig.addPassthroughCopy("ankitjain");
  eleventyConfig.addPassthroughCopy("cssconfasia");
  eleventyConfig.addPassthroughCopy("stuff");
  eleventyConfig.addPassthroughCopy("concert");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  return {};
};
