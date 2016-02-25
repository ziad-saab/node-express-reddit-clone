require('babel-register');
var ReactDOMServer = require('react-dom/server');

function parseReact(reactText) {
  var html = ReactDOMServer.renderToStaticMarkup(reactText);
  return '<!doctype html>' + html;
}

module.exports = {
  parseReact: parseReact
}
