const { getBundleFromInputPath } = require("../react/utils");
const { pages } = require("../react/findSources");
const build = require("../react/build");
const render = require("../react/render");

module.exports = eleventyConfig => {
  eleventyConfig.addTemplateFormats("jsx");

  eleventyConfig.addExtension("jsx", {
    read: false,
    data: true,
    getData: true,
    getInstanceFromInputPath: async (inputPath) => {
      try {
        const bundle = getBundleFromInputPath(inputPath);
        return require(bundle);
      } catch (err) {
        throw new Error(err);
      }
    },
    init: async () => {
      try {
        const PAGES = await pages();
        await build(PAGES);
      } catch (err) {
        throw new Error(err);
      }
    },
    compile: (permalink, inputPath) => {
      return async (data) => {
        try {
          return render(permalink, inputPath, data);
        } catch (err) {
          throw new Error(err);
        }
      };
    },
  });
}
