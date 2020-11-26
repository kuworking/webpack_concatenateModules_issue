const eleventyJsx = require('./eleventy/eleventy-jsx')

module.exports = eleventyConfig => {
  eleventyJsx(eleventyConfig)
  eleventyConfig.setDataDeepMerge(true)

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_build',
    },
    markdownTemplateEngine: 'jsx',
  }
}
