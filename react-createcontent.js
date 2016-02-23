var React = require('react');
var Nav = require('./react-nav');

function CreateContent(error) {
  var nav = Nav('jimothy', []);
  return (
    <html>
        <head>
            <meta charSet="utf-8"/>
            <link href="style.css" rel="stylesheet" type="text/css"/>
            <link href="nav.css" rel="stylesheet" type="text/css"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="stylesheet" href="bootstrap.css" type="text/css"/>
            <script src="jquery.js"></script>
            <script src="bootstrap.js"></script>
        </head>
        <body>
          {nav}
            <div className='form'>
            <div className='formheading'>Post Content</div>
              <div className='container'>

                <ul className="nav nav-tabs">
                  <li className="active"><a data-toggle="tab" href="#link">Link</a></li>
                  <li><a data-toggle="tab" href="#self">Self</a></li>
                </ul>

                <div className="tab-content">
                  <div id="link" className="tab-pane fade in active">

                    <span id="error">
                      {error}
                    </span>

                    <form action="/CreateContent" method="post">
                      <label htmlFor="title"><span>Title <span className="required">*</span></span><input type="title" className="input-field" name="title" value="" maxLength="255"/></label>
                      <label htmlFor="url"><span>URL <span className="required">*</span></span><input type="url" className="input-field" name="url" value="" maxLength="255"/></label>
                      <label><span>&nbsp;</span><input type="submit" value="Create" /></label>
                    </form>

                  </div>

                  <div id="self" className="tab-pane fade">
                    <h3>Self</h3>
                    <p>Functionality will be added eventually.</p>
                  </div>

                </div>
              </div>
            </div>
        </body>
    </html>
  )
}

module.exports = CreateContent;
