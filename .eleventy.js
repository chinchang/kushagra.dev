const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addLayoutAlias("default", "layouts/default.html");
  eleventyConfig.addLayoutAlias("post", "layouts/post.html");

  // only content in the `posts/` directory
  eleventyConfig.addCollection("posts", function(collection) {
    return collection
      .getFilteredByGlob("./posts/*")
      .sort(function(a, b) {
        return a.date - b.date;
      })
      .reverse();
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
  return {};
};
