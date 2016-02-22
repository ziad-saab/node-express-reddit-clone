
var React = require('react');

function SignUp(error) {
  return (
    <html>
        <head>
            <meta charSet="utf-8"/>
            <link href="style.css" rel="stylesheet" type="text/css"/>
        </head>
        <body>
            <div className='form'>
            <div className='formheading'>Sign Up!</div>

            <span id="error">
              {error}
            </span>
            <form action="/SignUp" method="post">
              <label for="username"><span>Username <span className="required">*</span></span><input type="text" className="input-field" name="username" value="" maxlength="20"/></label>
              <label for="email"><span>Email </span><input type="text" className="input-field" name="email" value="" maxlength="50"/></label>
              <label for="password"><span>Password <span className="required">*</span></span><input type="password" className="input-field" name="password" maxlength="50"/></label>
              <label for="confirmpassword"><span>Confirm Password <span className="required">*</span></span><input type="password" className="input-field" name="confirmpassword" maxlength="50"/></label>
              <label><span>&nbsp;</span><input type="submit" value="Sign Up" /></label>
            </form>
            </div>
        </body>
    </html>
  )
}

module.exports = SignUp;
