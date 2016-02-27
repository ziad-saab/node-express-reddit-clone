var React = require('react');
var Popbox = require('./react-popbox.js');

function Nav(user, tablist) {

  var userbar;
  if (user) {
    var submitterLink = `/user/${user}`
  userbar = (
    <div className="userbar">
      <a className="elementLink" href={submitterLink}>{user}</a>
      <a className="elementLink" href="/Logout">Logout</a>
    </div>);
  }

  else userbar = (
    <div className="userbar">
      <a className="elementLink signup">Sign Up</a>
      <a className="elementLink login">Login</a>
    </div>
  );

  var tabs = tablist.map(function(tab) {
    if (tab.selected)
    return <a href={tab.url} className="tabselected">{tab.name}</a>;
    else return <a href={tab.url} className="tab">{tab.name}</a>;
  })

  var popbox = Popbox();

  return (
      <nav className="navbar">
        <div className="flexnav">
          <div className="leftbar">
            <a className="siteTitle" href="/">fuggedabouddit</a>
            {tabs}
          </div>
          {userbar}
        </div>
        {popbox}
      </nav>
  )
}

module.exports = Nav;
