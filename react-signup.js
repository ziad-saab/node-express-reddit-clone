
var React = require('react');

function SignUp(error) {
  return (
    <html>
        <head>
            <meta charSet="utf-8"/>
            <link href="style.css" rel="stylesheet" type="text/css"/>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
            <script src="/signup.js"></script>
        </head>
        <body>
            <div className='form'>
            <div className='formheading'>Sign Up!</div>

            <span id="error">
              {error}
            </span>
            <form action="/SignUp" method="post">
              <label htmlFor="username"><span>Username <span className="required">*</span></span><input type="text" className="input-field" name="username" value="" maxLength="20"/></label>
              <label htmlFor="email"><span>Email </span><input type="text" className="input-field" name="email" value="" maxLength="50"/></label>
              <label htmlFor="password"><span>Password <span className="required">*</span></span><input type="password" className="input-field" name="password" maxLength="50"/></label>
              <label htmlFor="confirmpassword"><span>Confirm Password <span className="required">*</span></span><input type="password" className="input-field" name="confirmpassword" maxLength="50"/></label>
              <label><span>&nbsp;</span><input type="submit" value="Sign Up" /></label>
            </form>
            </div>
        </body>
    </html>
  )
}

module.exports = SignUp;
