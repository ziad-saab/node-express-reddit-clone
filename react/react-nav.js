var React = require('react');
var Popbox = require('./react-popbox.js');

//takes an object with a user, a pageTitle, and a tablist
function Nav(data) {

  var userbar;
  if (data.user) {
    var submitterLink = `/user/${data.user}`
    userbar = (
      <div className="userbar">
        <a className="elementLink" href={submitterLink}>{data.user}</a>
        <a className="elementLink" href="/Logout">Logout</a>
      </div>);
    }

    else userbar = (
      <div className="userbar">
        <a className="elementLink signup">Sign Up</a>
        <a className="elementLink login">Login</a>
      </div>
    );
    var title = '';
    if(data.pageTitle)
    var title = (<a className="pageTitle">{data.pageTitle}</a>)
    var tabs = '';
    if (data.tablist) {
      var tabs = data.tablist.map(function(tab) {
        if (tab.selected)
        return (<a href={tab.url} className="tabselected">{tab.name}</a>);

        else return (<a href={tab.url} className="tab">{tab.name}</a>);
      })
    }


    var popbox = Popbox();

    return (
      <nav className="navbar">
        <div className="flexnav">
          <div className="leftbar">
            <div className="titleLine">
              <a className="siteTitle" href="/">fuggedabouddit</a>
              {title}
            </div>
            {tabs}
          </div>
          {userbar}
        </div>
        {popbox}
      </nav>
    )
  }

  module.exports = Nav;
