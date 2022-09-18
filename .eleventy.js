const yaml = require('js-yaml');
const { DateTime } = require('luxon');
// const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
// const navigation = require('@11ty/eleventy-navigation');
const htmlmin = require('html-minifier');

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'dd LLL yyyy'
    );
  });

  // eleventyConfig.addPlugin(syntaxHighlight); // coloring for code blocks
  // eleventyConfig.addPlugin(navigation);

  // eleventyConfig.addShortcode('year', function () {
  //   console.log("CALLING YEAR");
  //   return new Date().getFullYear();
  // });
  // eleventyConfig.addNunjucksGlobal('year', new Date().getFullYear().toString());

  // Allow YAML everywhere that JSON is supported.
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents));

  // Copy Static Files to /_Site

  eleventyConfig.addPassthroughCopy({
    './node_modules/alpinejs/dist/cdn.min.js': './static/js/alpine.js',
    './node_modules/prismjs/themes/prism-tomorrow.css':
      './static/css/prism-tomorrow.css',
  });

  // Netlify CMS gets transformed for local vs. production...
  const cmsConfig = `./src/admin/config${(process.env.NODE_ENV || 'development') === 'development' ? '.dev' : ''}.yml`;
  eleventyConfig.addPassthroughCopy(
    {
      [cmsConfig]: './admin/config.yml',
    }
  );

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy('./src/static/media');

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy('./src/favicon.ico');

  // Minify HTML
  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: 'src',
    },
    // dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
