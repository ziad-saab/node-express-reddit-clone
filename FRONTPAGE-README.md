# Enhancing our Reddit clone with semantic HTML5, CSS3 and some JavaScript/jQuery

We ended week four of the bootcamp with a basic working Reddit clone. In doing so, we learned many things about HTTP and the web, more specifically on the back-end side of things.

In the next two weeks, we will be concentrating more on the browser side -- so-called front-end development -- keeping in mind that both "sides" are somewhat connected.

This first front-end workshop is more open-ended than the ones we have previously worked on. As a trainee, you are starting to become more independent. You have worked hard to find more and more information by yourself, and it has paid off :)

Therefore, instead of concentrating on one particular subject, today we propose to start discovering the world of front-end development by looking at many different aspects at the same time. In the coming days, we will formalize some of this knowledge with the help of a few short lectures.

## Semantic HTML5 tags
In this section, we will enhance our Reddit clone with HTML5 semantic tags. To do this, we'll have to rewrite some of our rendering functions to take advantage of these new elements. Here are some resources to get you started:

### Resources
* [Let's talk about semantics](http://html5doctor.com/lets-talk-about-semantics/)
* [MDN's HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Content_sectioning)
* [Why to use semantic elements instead of DIV?](http://stackoverflow.com/a/17272444/1420728)
* [How to use HTML5 sectioning elements?](http://blog.teamtreehouse.com/use-html5-sectioning-elements)

### Work
Using your newly acquired knowledge, modify the HTML structure of your Reddit clone to take advantage of semantic HTML5 elements. Among other things, you can make use of `<nav>`, `<article>`, `<main>` and `<aside>`.

**Before doing so**, you would be better served reading and implementing the ReactJS server-side rendering in your Reddit clone by looking at [this repo](https://github.com/ziad-saab/serverside-jsx-demo) and/or asking us for help in the matter.

### Pre-work: using JSX with React to render our pages
JSX can help us render pretty much everything, except that pesky `<!doctype html>` string. Moreover, a component function that uses JSX will not actually return an HTML *string*, but more something like an *HTML structure*. Transforming it to a string means you have to call one more of React's functions to transform the HTML structure into a string.

Here's a function that will do that with any structure you pass it, and add the `<!doctype html>` to it:

```javascript
var ReactDOMServer = require('react-dom/server');
function renderHtml(jsxStructure) {
  var outputHtml = ReactDOMServer.renderToStaticMarkup(jsxStructure);

  return '<!doctype html>' + outputHtml;
}
```

One more thing: NodeJS does not understand JSX. This means that if we put JSX code in our `server.js`, we will get back a Syntax Error.

To help NodeJS understand JSX, we have to make use of the [Babel transpiler](http://babeljs.io). Babel transforms newer JavaScript code (ES6, JSX) into an equivalent ES5 that Node and our browsers can understand.

Based on the current setup of your `server.js`, here is the easiest way to get started with JSX:

* Install the following NPM packages and make sure to `--save`:
  * `babel-register`: This package will hook into Node's `require` function, and enable loading files with JSX syntax
  * `babel-preset-react`: Babel does nothing by default without presets. This tells Babel to transform JSX
  * `babel-preset-es2015`: While this is not necessary, it will enable us to use ES6 features in our code, even the ones NodeJS may not support
  * `react`: Will help us write our view components
  * `react-dom`: Will help us transform our view structures into strings of HTML

* Create a file called `.babelrc` at the root of your project, with the following in it:

  ```json
{
    "presets": ["react", "es2015"]
}
```

This file tells Babel what transformations to do on your code, because by default it will not do anything :)

* In your `server.js`, add the following line on top:

  ```javascript
require('babel-register');
```

You don't need to assign this to a variable. Requiring this module will hook to the `require` function, and enable us to require files with JSX!

* Create a file called `rendering.jsx`. This will contain all our JSX components. Later on we can modularize this file even more :)
* In `rendering.jsx`, have the following basic code:

  ```javascript
var React = require('react');
```

* Add the code of the `renderHtml` function from above.

Once that is setup, you can start with your first component! Let's look at something like the login form for example...

Here's what your login form code could look like right now:

```javascript
app.get('/login', function(req, res) {
  var maybeError = request.query.error;

  var html = "<form action='/login' method='post'>";
  if (maybeError) {
    html += "<div>" + maybeError + "</div>";
  }
  html += "<input type='text' name='username'>";
  //...
  // and then finally
  res.send(html);
})
```

1. Take only the part that returns the HTML, and put it in a function that receives a data object.
2. Put that function in `rendering.jsx` and add it to the module.exports
3. Make it render a full page starting at the `<html>` tag
4. Use the `renderHtml` function to make it output a string:

```javascript
function renderLogin(data) {
  // create the HTML structure with interpolations
  var structure = (
    <html>
      <head>
        <title>Login!</title>
      </head>
      <body>
        <h1>Login</h1>
        <form action="/login" method="post">
          {data.error && <div>{data.error}</div>}
          <input type="text" name="username"/>
          .....
        </form>
      </body>
    </html>
  );

  // return the html
  var html = renderHtml(structure);

  return html;
}
```

As a first step, try to do the same thing for every page that outputs HTML:

* login form
* signup form
* content create form
* homepage

Once this is done, perhaps we can extract the layout element?

```javascript
function Layout(data) {
  return (
    <html>
      <head>
        <title>{data.title}</title>
      </head>
      <body>
      {data.children}
      </body>
    </html>
  );
}
```

This component is the same across all pages, except a different TITLE and CONTENT. Here's how to refactor the login function above to use this component:

```javascript
function renderLogin(data) {
  // create the HTML structure with interpolations
  var structure = (
    <Layout title="Login!">
      <h1>Login</h1>
      <form action="/login" method="post">
        {data.error ? <div>{data.error}</div> : null}
        <input type="text" name="username"/>
        .....
      </form>
    </Layout>
  );

  // return the html
  var html = renderHtml(structure);

  return html;
}
```

Notice the part that says `{data.children}` inside the `Layout` component? It will be replaced with everything inside the `<Layout>...</Layout>` above :)

See if you can refactor every page to use the layout. When that is done, go back to the beginning of the exercise and try to output your structure using HTML semantic tags!

Use the `Layout` component to add a **navigation menu** to all your pages, using the `<nav>` component. As this is an open-ended exercise, see in what other places you can use HTML semantic elements like article, main, aside or section.

---

## CSS3, Flexbox and styling forms
Learn more about CSS3 and flexbox using the following resources, and any other you can find:

### Flexbox: layouts the easy way
* http://flexbox.io/#/
* http://flexboxin5.com/
* http://flexboxfroggy.com/

Using your newly-acquired knowledge on flexbox, as well as anything else you found out about CSS, refactor the homepage's list of posts to look like the following:

![](https://i.imgur.com/erVHYGq.png)

Each post item in the list should be organized as a flexbox container.

The left side should take only as much space as it needs to output the up/down vote arrows and the vote score. **If you don't have vote scores in your app, replace it with a random number for the moment**.

The right side should expand to take all remaining space. Inside should be the title, and below that, yet another container.

The bottom of the right side container should have the "created by" on the left, and "created at" all the way to the right.

**HINT**: Remember, the goal here is to use as much of flexbox as possible. You shouldn't need to float things to the left or right, or any vertical alignment.

### Styling forms
Our Reddit clone, however tiny it may be already contains three FORMS! After reading [this MDN article about styling forms](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Styling_HTML_forms), use some CSS to make your forms look nice.

Try to implement an overall look for your forms and use some CSS classes to style them as you wish.

### More...
You can come back to this section and keep adding CSS to your page as we discover more together in class.

## Adding interactivity with JavaScript and jQuery
At the moment our Reddit clone is a little bit less user-friendly than it could be. For one thing, voting on content is refreshing the page every time. Another thing we may want to do is suggest a title for a user as they're adding a new URL, to make it easier.

As you know, any interactivity happening in your browser will be mostly due to JavaScript. So far, we've been writing JavaScript for quite a few weeks, but never actually used it in the browser. It turns out that the browser offers us a lot of APIs for doing interactive things **once a webpage has already loaded**. Some of these things include:

* Manipulating the content of the current document using [the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
* [Listening for various events like clicking, hovering, typing](https://developer.mozilla.org/en-US/docs/Web/Events)
* [Making HTTP requests directly from the browser](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)

If you read the above documents, you may get a feeling that these APIs provided by the browser are quite low-level. They're not super straight forward and some pitfalls exist.

You may have heard of [jQuery](http://jquery.com/) as the go-to library for adding interactivity on your page. jQuery is no more than JavaScript code that packages some nice functions for doing the things we mentioned above. As it turns out, some of these things are much easier to do with jQuery, which explains why it has become so popular.

Here are the jQuery references for the above activities:

* [Manipulating the contents of a page with jQuery](https://learn.jquery.com/using-jquery-core/)
* [Listening for events like clicking, typing, etc. on a page](https://learn.jquery.com/events/)
* [Making HTTP requests directly from the browser with jQuery](https://learn.jquery.com/ajax/)
* [Try jQuery!](http://try.jquery.com/)

Based on the above references as well as your own research, try to complete one or two of the following activities:

### Suggesting a title before someone adds new content (browser-side only)
Here we are basically going to reproduce the following functionality:

![](http://g.recordit.co/x9OS40EY9n.gif)

1. Next to the URL field, let's add a button that says "suggest title".
2. **On click** of this button, we want to make an **ajax request** for the URL
3. When we receive the HTML for the page, we want to parse it again using jQuery
4. Using jQuery's DOM functions, find the `title` element and put its content in the title field
5. Optionally show a "loading" text while your are doing the work

**NOTE**: The user stays on the same page while this is going on. Everything happens without refreshing the page.

### Voting without refreshing the page!
When a user clicks on the submit button of either of the two voting forms, the following happens:

1. The browser takes the form data and makes a query string out of it: `voteDirection=1&contentId=123`
2. The browser looks at the form's `action` and `method` and makes an HTTP request accordingly
3. The server receives the (POST) request and form data, and does what it needs to do
4. The server sends a **redirect response** back to the homepage
5. The browser receives the redirect, and does another HTTP GET to the homepage

While this experience follows the **statelessness** principle of HTTP, it's not super friendly for our users. For one thing, there is a flash of content as the page refreshes. Moreover, the server is indiscriminately redirecting to the homepage, but we may have been on another page that displays posts. Not only that, but we may have been scrolled to the bottom of the page and now we are back to the top.

For all these reasons, it may be nicer for our users if we could take such a small interaction as voting and make it happen **without refreshing the page**. Even though we're staying on the same page, we still have to follow the rules of HTTP. Among other things, it means that *our browser will still have to send an HTTP POST request to make the vote happen*. The difference is, this request will be done by the JavaScript code running in the browser. This is AJAX :)

Here are the high level steps we will be following...

When a user submits either of the two voting forms:

1. Our code should **listen to this submit event** and prevent the submit from taking place
2. Our code should **find the two hidden inputs** inside the form, and [find out their value](https://api.jquery.com/val/)
3. Our code should **do an ajax POST request** to our `/vote` URL, passing it the parameters `voteDirection` and `contentId`
4. At this point, our server will receive the POST and do its usual business of creating the vote
5. For now, our server is sending a redirect response, which our AJAX code may not have much use for...

In the server-side version, our POST handler was redirecting us back to the homepage, the browser was requesting the home page again, and the new votes count would display itself. In this browser-only version, what could we do? We made the POST request, but the vote count stays the same... How could we fix this?

If only we could get the new vote count as the result of our POST request... Well why not? We're the ones who wrote the web server, so we can make it do whatever we want! Let's modify our Reddit server's POST handler to `/vote`. Instead of sending a redirect response to the client, let's find out the new vote score for the content that was voted on, and return it to the user as JSON. Instead of:

1. Check if the user is logged in
2. Create a vote or update existing vote
3. Send a `response.redirect` response to `/` homepage

Let's do the following:

1. Check if the user is logged in (this stays the same)
2. Create a vote or update existing vote (this stays the same)
3. Make a new Sequelize query for the Content with its vote score
4. Send a `response.json` with an object `{newVoteScore: XX}` where `XX` is the new vote score

Then, on the browser side, in the response to our AJAX query, we will receive this JSON. Let's do the following:

1. Receive the JSON response from doing the POST to `/vote` by AJAX
2. Parse the JSON response to an object using `JSON.parse`
3. Retrieve the `newVoteScore` property of the object
4. Update the user interface to represent the new vote score using jQuery's DOM functions
