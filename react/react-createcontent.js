var React = require('react');
var Nav = require('./react-nav');

function CreateContent(error) {
  var nav = Nav('jimothy', []);
  return (
    <html>
      <head>
        <meta charSet="utf-8"/>
        <link href="/css/nav.css" rel="stylesheet" type="text/css"/>
        <link href="/css/createcontent.css" rel="stylesheet" type="text/css"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
        <script src="/jquery/createcontentjq.js"></script>
      </head>
      <body>
        {nav}

        <section className="contentType">
            <button className="linkButton">Link</button>
            <button className="selfButton">Self</button>
        </section>

        <div className="linkPost">
        <div className='form'>
          <div className='formheading'>Post Content</div>
                <form action="/CreateContent" method="post">
                  <label htmlFor="title"><span>Title <span className="required">*</span></span><input type="title" className="input-field" name="title" value="" maxLength="255"/></label>
                  <label htmlFor="url"><span>URL <span className="required">*</span></span><input type="url" className="input-field" name="url" value="" maxLength="255"/></label>
                  <label><span>&nbsp;</span><input type="submit" value="Create" /></label>
                </form>
        </div>
        </div>

        <div className="selfPost">
          <h3>Self</h3>
          <p>Functionality will be added eventually.</p>
        </div>

      </body>
    </html>
  )
}

module.exports = CreateContent;
