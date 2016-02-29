'use strict';

var React = require('react');
var Nav = require('./react-nav');

function page404(username) {
  var nav = Nav({ user: username, pageTitle: 404 });
  return React.createElement(
    'html',
    null,
    React.createElement(
      'head',
      null,
      React.createElement(
        'title',
        null,
        'fuggedabouddit'
      ),
      React.createElement('meta', { charSet: 'utf-8' }),
      React.createElement('link', { href: '/css/nav.css', rel: 'stylesheet', type: 'text/css' })
    ),
    React.createElement(
      'body',
      null,
      nav,
      React.createElement(
        'main',
        { className: 'contents' },
        React.createElement(
          'h1',
          null,
          '404, GET OUTTA HERE!'
        )
      )
    )
  );
}

module.exports = page404;

