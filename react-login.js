
var React = require('react');

function Login(error) {
  return (

    <html>
        <head>
            <meta charSet="utf-8"/>
            <link href="/css/style.css" rel="stylesheet" type="text/css"/>
        </head>
        <body>
            <div className='form'>
            <div className='formheading'>Login</div>

            <span id="error">
              {error}
            </span>
            <form action="/Login" method="post">
              <label htmlFor="username"><span>Username <span className="required">*</span></span><input type="text" className="input-field" name="username" value="" maxLength="20"/></label>
              <label htmlFor="password"><span>Password <span className="required">*</span></span><input type="password" className="input-field" name="password" value="" maxLength="50"/></label>
              <label><span>&nbsp;</span><input type="submit" value="Login" /></label>
            </form>
            </div>
        </body>
    </html>
  )
}

module.exports = Login;
