var React = require('react');

function Popbox (){

  return (
    <div>
      <div className="popbox signupbox">
        <a className="close"><img src="/images/orange-close.png" className="btn_close" title="Close Window" alt="Close"/></a>
        <div className='form'>
          <div className='formheading'>Sign Up!</div>
          <form action="/SignUp" method="post">
            <label htmlFor="username"><span>Username <span className="required">*</span></span><input type="text" className="input-field" name="username" value="" maxLength="20"/></label>
            <label htmlFor="email"><span>Email </span><input type="text" className="input-field" name="email" value="" maxLength="50"/></label>
            <label htmlFor="password"><span>Password <span className="required">*</span></span><input type="password" className="input-field" name="password" maxLength="50"/></label>
            <label htmlFor="confirmpassword"><span>Confirm Password <span className="required">*</span></span><input type="password" className="input-field" name="confirmpassword" maxLength="50"/></label>
            <label><span>&nbsp;</span><input type="submit" value="Sign Up" /></label>
          </form>
        </div>
      </div>

       <div className="popbox loginbox">
          <a className="close"><img src="/images/orange-close.png" className="btn_close" title="Close Window" alt="Close"/></a>
          <div className='form'>
            <div className='formheading'>Login</div>
            <form action="/Login" method="post">
              <label htmlFor="username"><span>Username <span className="required">*</span></span><input type="text" className="input-field" name="username" value="" maxLength="20"/></label>
              <label htmlFor="password"><span>Password <span className="required">*</span></span><input type="password" className="input-field" name="password" value="" maxLength="50"/></label>
              <label><span>&nbsp;</span><input type="submit" value="Login" /></label>
            </form>
        </div>
      </div>
    </div>
  );
}

module.exports = Popbox;
