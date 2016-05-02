var React = require('react');

function Popbox (){

  return (
    <div>
      <div className="popbox signupbox">
        <a className="close"><img src="/images/orange-close.png" className="btn_close" title="Close Window" alt="Close"/></a>
        <div className='form'>
          <div className='formheading'>Sign Up</div>
            <span className="error"></span>
            <div><span>Username <span className="required">*</span></span><input type="text" className="input-field username" maxLength="20"/></div>
            <div><span>Email </span><input type="text" className="input-field email" maxLength="50"/></div>
            <div><span>Password <span className="required">*</span></span><input type="password" className="input-field password" maxLength="50"/></div>
            <div><span>Confirm Password <span className="required">*</span></span><input type="password" className="input-field confirmPassword" maxLength="50"/></div>
            <div><span>&nbsp;</span><input type="submit" className="submitSignup" value="Sign Up"/></div>
        </div>
      </div>

       <div className="popbox loginbox">
          <a className="close"><img src="/images/orange-close.png" className="btn_close" title="Close Window" alt="Close"/></a>
          <div className='form'>
            <div className='formheading'>Login</div>
              <span className="error"></span>
              <div><span>Username <span className="required">*</span></span><input type="text" className="input-field usernameLogin" maxLength="20"/></div>
              <div><span>Password <span className="required">*</span></span><input type="password" className="input-field passwordLogin" maxLength="50"/></div>
              <div><span>&nbsp;</span><input type="submit" className="submitLogin" value="Login" /></div>
        </div>
      </div>
    </div>
  );
}

module.exports = Popbox;
