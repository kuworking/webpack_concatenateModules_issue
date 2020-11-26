const ReactDOMServer = require('react-dom/server')
const cheerio = require('cheerio')
const { ServerStyleSheet } = require('styled-components')
const { getBundleFromInputPath } = require('./utils')

module.exports = (permalink, inputPath, data) => {
  if (permalink) {
    return typeof permalink === 'function' ? permalink(data) : permalink
  }

  const component = require(getBundleFromInputPath(inputPath))

  if (!component.default) return ''

  const sheet = new ServerStyleSheet()
  ReactDOMServer.renderToStaticMarkup(sheet.collectStyles(component.default(data)))
  const markup = ReactDOMServer.renderToStaticMarkup(component.default(data))
  const styles = sheet.getStyleTags()

  const $ = cheerio.load(markup)
  $('head').append(styles)

  return `<!doctype html>${$.html()}`
}
