var React = require('react');
var Nav = require('./react-nav');

function CreateContent(user, error) {
  var nav = Nav({user: user});

  // <section className="contentType">
  //     <button className="linkButton">Link</button>
  //     <button className="selfButton">Self</button>
  // </section>

  return (
    <html>
      <head>
        <meta charSet="utf-8"/>
        <link href="/css/nav.css" rel="stylesheet" type="text/css"/>
        <link href="/css/createcontent.css" rel="stylesheet" type="text/css"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
        <script src="/jquery/popbox.js"></script>
        <script src="/jquery/createcontentjq.js"></script>
      </head>
      <body>
        {nav}

        <div className="container">

        	<ul className="tabs">
        		<li className="tab-link current" data-tab="tab-1">Link</li>
        		<li className="tab-link" data-tab="tab-2">Self</li>
        	</ul>
        	<div id="tab-1" className="tab-content current">
            <div className="linkPost">
              <div className='form'>
                <div className='formheading'>Link Post</div>
                      <span className="error">{error}</span>
                      <form action="/CreateContent" method="post">
                        <label htmlFor="title"><span>Title <span className="required">*</span></span><input type="title" className="input-field" name="title" pattern=".{1,}" required title="1 character minimum" maxLength="255"/></label>
                        <label htmlFor="url"><span>URL <span className="required">*</span></span><input type="url" className="input-field" name="url" value="" maxLength="255"/></label>
                        <label><span>&nbsp;</span><input type="submit" value="Create" /></label>
                      </form>
                </div>
          	  </div>
            </div>
        	<div id="tab-2" className="tab-content">
            <div className="selfPost">
              <div className='form'>
                <div className='formheading'>Self Post</div>
                      <span className="error">{error}</span>
                      <form action="" method="post">
                        <label htmlFor="title"><span>Title <span className="required">*</span></span><input type="title" className="input-field" name="title" pattern=".{1,}" required title="1 character minimum" maxLength="255"/></label>
                        <label htmlFor="text"><span>Text <span className="required">*</span></span><input type="text" className="input-field" name="text" value="" maxLength="255"/></label>
                      </form>
                      <h3>Functionality Will be Added!!!</h3>
              </div>
            </div>
          </div>

        </div>

      </body>
    </html>
  )
}

module.exports = CreateContent;
