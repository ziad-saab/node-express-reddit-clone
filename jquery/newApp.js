var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var htmlStructure = (<div>hello world</div>)
ReactDOM.render(htmlStructure, document.querySelector('.contents'));

function makeAjaxCallAndGetTitle(url, cb) {
  $.get('/userReq?url=' + url)
  .then(function(response) {
    var title = response;
    cb(title);
  });
}
/*fffffffffffffffffffffffffdddasdasdsadasdlgjakrlghasfhafhoasfhdddddddffdddffffffddddffffffffffffffff*/
