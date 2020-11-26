const path = require('path')
const config = require('./config')

module.exports = {
  // returns absolute path from cache directory and replacing jsx for js
  getBundleFromInputPath: inputPath => {
    return path.join(process.cwd(), config.cacheDir, inputPath.split('/').pop().replace('.jsx', '.js'))
  },

  // returns absolute path
  getFullInputPath: inputPath => {
    return path.join(process.cwd(), inputPath)
  },

  // if it is a component, return the name of the folder (not the index.jsx), otherwise the name of the file
  getBundleFileName: bundlePath => {
    const pathArray = bundlePath.split('/')
    if (bundlePath.indexOf('components') !== -1) {
      return `${pathArray[pathArray.length - 2]}.js`
    } else {
      return pathArray.pop().replace('.jsx', '.js')
    }
  },
}
