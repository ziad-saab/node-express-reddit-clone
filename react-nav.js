
var React = require('react');

function Nav(user, tablist) {

  var userbar;
  if (user)
  userbar = (
    <div className="userbar">
      <a className="userbarElement">{user}</a>
      <a href="/Logout" className="elementLink">Logout</a>
    </div>);

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

  return (
      <nav className="navbar">
        <div className="flexnav">
          <div className="leftbar">
            <a className="siteTitle" href="/">fuggedabouddit</a>
            {tabs}
          </div>
          {userbar}
        </div>
      </nav>
  )
}

module.exports = Nav;
