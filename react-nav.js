
var React = require('react');

function Nav(user, tablist) {

  var userbar;
  if (user)
  userbar = (
    <div className="userbar">
      <a className="userbarElement">{user}</a>
      <a href="/Logout" className="userbarElement elementLink">Logout</a>
    </div>);

  else userbar = (
    <div className="userbar">
      <a href="/SignUp" className="userbarElement elementLink">Sign Up</a>
      <a href="/Login" className="userbarElement elementLink">Login</a>
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
            <a className="siteTitle">fuggedabouddit</a>
            {tabs}
          </div>
          {userbar}
        </div>
      </nav>
  )
}

module.exports = Nav;
