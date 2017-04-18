# Let's build a Reddit clone
Last week, we set out to build a Reddit clone from the database's perspective. We ended up with a `RedditAPI` with `createPost`, `getAllPosts`, `createUser` and other data-related methods.

In this next part of the project, we are going to take the functionality that we already built, and make a website out of it! To do this, we are going to use many of the technologies we have already learned about, but we will also be adding a bit more on top.

At the end of this project, we should have at a **bare minimum** a Reddit clone with the following functionality:

  * Non logged in users will be able to view a list of posts ordered by one of hot, top, newest.
  * Non logged in users will be able to signup and/or login to the site.
  * Logged in users will be able to cast either an up or down vote for each post they are looking at.
  * Logged in users will be able to add new posts to the site. A post is a URL and a title, and it belongs to a subreddit and a user.

## Getting started
Clone this project to your Cloud9 workspace, under your home directory. Then, copy the `reddit.js` file from the `reddit-nodejs-api` directory to the current project.

## Description of the pages of the site
Before starting to write any code, let's figure out the different pages we will need:

  * **Homepage**:

    The homepage lists 25 posts, as provided by the `getAllPosts` method of the `RedditAPI`.

  * **Signup page**:

    The signup page will be a simple page with an HTML `<form>`. The form will have username and password fields, as well as a "signup" submit button. More on that later.

  * **Login page**:

    The login page will be a simple page with an HTML `<form>`. The form will have username and password fields, as well as a "login" submit button. More on that later.

  * **Create post page**

    The create post page will also be a simple page with an HTML `<form>`. The form will have title and URL text fields, a dropdown for choosing the subreddit, and a "create" submit button.

  * **Subreddits pages**

    They will work similarly to the homepage, except that the posts will be filtered for one subreddit only.

    In your Express code, you will have one `app.get('/r/:subreddit')` and use the `req.params.subreddit` to make a request to your Reddit API. Then, you can use the same rendering code as the homepage to print the posts for that subreddit :)

---

## Review: rendering HTML with a templating engine, Pug
Rendering HTML by writing code like this:

```javascript
var output = "<ul>";
contents.forEach(function(item) {
  output = output + "<li><a href='" + item.url + "'>" + item.title + "</a>";
});
output = output + "</ul>";
```

can quickly get out of hand, especially as you have a more complex page.

As seen in class, Express offers the [Pug](https://github.com/pugjs) [templating engine](https://expressjs.com/en/guide/using-template-engines.html), which was [previously known as Jade](https://github.com/pugjs/pug/issues/2184). The syntax will look a bit weird at first, but it translates to HTML and allows you to avoid the whole string concatenation headache

Here's a full example:

In the server code:
```javascript
// At the top (already added for you)
app.set('view engine', 'pug');

app.get('/', function(request, response) {
  // This is only an example!
  redditAPI.getAllPosts().then(function(posts) {

    // Response.render will call the Pug template engine with the `post-list.pug` file.
    response.render('post-list', {
      posts: posts,
    });

  });
});
```

In your `post-list.pug`:

```pug
h1 Welcome to Reddit Clone!!!
ul.post-list
  each post in posts
    li.post
      h2
        a(href=post.url)= post.title
      p Submitted by #{post.username}
      p Score: #{post.score} Upvotes: #{post.upVotes} Downvotes: #{post.downVotes}
```

Which will return this HTML:

```html
<h1>Welcome to Reddit Clone!!!</h1>
<ul class="post-list">
  <li class="post">
    <h2>
      <a href="http://blabla">This is the first post</a>
    </h2>
    <p>Submitted by 514FOREVER</p>
    <p>Score: 100 Upvotes: 500 Downvotes: 400</p>
  </li>
  <li class="post">
    <h2>
      <a href="http://blabla123">This is the second post</a>
    </h2>
    <p>Submitted by Other_User</p>
    <p>Score: 123 Upvotes: 523 Downvotes: 400</p>
  </li>
</ul>
```

In general, we want to return a full page of HTML , not only a snippet. For this, Pug gives us [template inheritance](https://pugjs.org/language/inheritance.html). We can create a layout which has the general structure of our page, and have a placeholder for the content.

Here would be an example of `layout.pug` file. By using so-called "blocks", we can create placeholders for content.

```pug
doctype html
html
  head
    meta(charset="utf-8")
    block title
      title The Default Title
  body
    block content
```

Then, in our `post-list.pug` file, we can **extend** this layout, and provide a block for each block in the layout:

```pug
extends layout.pug

block title
  title Welcome to Reddit Clone!!!

block content
  h1 Welcome to Reddit Clone!!!
  ul.post-list
    each post in posts
      li.post
        h2
          a(href=post.url)= post.title
        p Submitted by #{post.username}
        p Score: #{post.score} Upvotes: #{post.upVotes} Downvotes: #{post.downVotes}
```

Check out the full [documentation for Pug](https://pugjs.org/api/getting-started.html) to learn more. Here are some of the important sections:

* [Tags](https://pugjs.org/language/tags.html)
* [Attributes](https://pugjs.org/language/attributes.html)
* [Conditionals](https://pugjs.org/language/conditionals.html)
* [Interpolation](https://pugjs.org/language/interpolation.html)
* [Iteration](https://pugjs.org/language/iteration.html)

---

## Review: handling form submissions
We will have at least three form submissions to handle: login, signup and create post. Each form should be sent using a **POST** request to the server. Sending a **POST** request is an indication that we want to create new data on the target system. Therefore it's very important to not submit such data more than once.

Browsers are good at helping with this: notice that if you submit a form through POST, and try to refresh the resulting web page, the browser will warn that you are about to re-submit a form.

We can avoid this though: a good practice is to [**always redirect the user after a POST**](https://en.wikipedia.org/wiki/Post/Redirect/Get) (read this Wikipedia article). If you redirect the user to another page using an HTTP [`303 See Other` status code](https://en.wikipedia.org/wiki/Post/Redirect/Get) then the browser will load that other page with a GET request and all will be well. The user will not even be able to re-submit the same form data!

For the signup form, we could redirect the user to the login page after they're done. For the login form we can redirect users to the homepage. For the create post form, we could also redirect the user to the homepage. If we had a page per post (with comments for example) then we could also redirect the user to the new post page that they created, like they do over at Reddit.

To redirect users, we can use the [Express `res.redirect`](http://expressjs.com/en/api.html#res.redirect) function.

---

## Review: User signup and login processes
One of the most sensitive aspects of a website is its security. As we've seen in the past years, even some of the largest sites out there are not immune to hacks. As web developers, it's our job to make sure that a site we build is as secure as possible. This will reduce the chances of compromising our customers' personal data and/or putting us out of business.

One field where this is super important is the user signup and login process. During this process, we are asking the user to provide us with a **username and password combination** that will be used to identify them. Some of our users will re-use that same password for all their accounts. *It would be pretty bad if we stored their password in plain text and our database got compromised.*

**WARNING**: The signup/login method described below is not meant to be 100% secure. It's only meant to give you a bit of insight into how complicated this process can be. In fact, [many](https://stormpath.com/) [companies](https://www.userapp.io/) make a business out of providing user management functionalities to other businesses. This lets us concentrate on what makes our product different!

### Hashing passwords
For this reason and many others, we will never store our customers' passwords in plain text in our database. When creating a new user, we will instead store a **hashed version of their password**.

Hashing is a function that takes a string as an input (like a password for example), and uses an **irreversible but consistent transformation** of that string to generate its output.

Let’s imagine your password was a number. My hashing function could be:

1. take the password (number) and divide it by 100 using integer division
2. return the remainder of the division as the hash.

So if your password is `1234` I would store it as `34` (`1234 % 100 = 34`). While I cannot recover your password, if you give me an input password I can check that it has the same hash. This would work well as long as there are no collisions. If you tell me your password is `134` or `2234`, they will all hash to `34` and you will be able to login!

For these reasons, n the real world we will be using hashing functions that have little chance for collision. An example of such a hashing function is SHA-1. If I pass the string `Hunter2` through the SHA-1 function I will get back `a8a00adebf1411b8baf07bdc688ce3889e8f7cb2`. Simply changing the string to `hunter2` (note the lack of capital H) then the SHA-1 will be `f3bbbd66a63d4bf1747940578ec3d0103530e21d`. While this is not a demonstration of any security feature, you can see that even a slight change in the input string will result in a completely different hash.

We can compute the number of possible combinations of SHA-1 outputs: if we see the output as a set of 40 hexadecimal digits, then the number of combinations would be `16^40` which is a huuuuge number. However big that number may be, the number of possible password strings is infinite! This means that our hashing function will definitely have collisions, meaning that two passwords will hash to the same string. However up until 2016, there has still not been a practical way to create a collision with this hashing function.

Moreover, we will not simply be storing the password has a hash of the input string. That would still be too easy to crack! For example, the `Hunter2` password above is a "popular string": it comes from an old internet joke that you may lookup in your own time. [There exists a few websites out there that can "reverse" SHA-1 outputs of popular strings](https://isc.sans.edu/tools/reversehash.html). There's no magic involved: they simply have a large database of SHA-1 input/output combinations.

For all these reasons, we will be using a library called [bcrypt](https://github.com/ncb000gt/node.bcrypt.js/) to take care of our password hashing. When signing up a new user, we will use [bcrypt's `hash` function](https://github.com/ncb000gt/node.bcrypt.js/#usage) to generate a hashed version of the password.

If you look at the Reddit API we built last week, the `createUser` function uses `bcrypt` to hash a password. In this case the output will look like this:

```
$2a$10$26OFMwEvtb4.6nWuYOPg6OJYlyl.uh7barqO5wfKrI9J9wJOZFIei
```

### Verifying passwords
Eventually we'll have to build a login function. In there, we will receive again a username and a password. This time, we will go to our database to find a user with the same username.

If we don't find a user, then we can respond with "username or password incorrect". This will prevent attackers from knowing whether or not the username exists.

If we do find a user, we can use bcrypt's `compare` function to compare the found user's hashed password with the password we received from the login process. It would go a bit like this:

1. User loads the `/login` page
2. Browser displays an HTML form with a username field and a password field
3. User fills in both fields and clicks on the LOGIN button
4. Browser constructs a query string like `username=john&password=Hunter2`
5. Browser looks at the `action` and `method` of the `<form>` and sends an HTTP request -- usually a `POST`
6. Server receives the request and parses it into appropriate object under `request.body`
7. In our web server, we use the `request.body.username` and `request.body.password` to call the `RedditAPI.checkUserLogin` function
8. The `RedditAPI.checkUserLogin` function:
  1. Takes a username and password
  2. Does an SQL query to our database `SELECT * FROM users WHERE username = ?`
  3. After retrieving the SQL result, uses the [`bcrypt.compare`](https://github.com/iceddev/bcrypt-as-promised#basic-usage) function to check if the hashed password matches the input password
  4. If the passwords match, the promise resolves with the full user object minus the hashed password
  5. If the passwords don't match, the promise throws an error "username or password invalid".
9. If we have a password match from the `RedditAPI.checkUserLogin` function:
  1. Create a session by calling `RedditAPI.createSession`, passing it the full user object from previous step.
  2. When the promise resolves, retrieve the sessionId
  3. Use [`response.cookie`] to set a cookie with the name `SESSION` and the value being the `sessionId` from the promise
  4. Use [`response.redirect`] to send the user back to the homepage, but now they'll be logged in.

### Time to eat that cookie
Cool. We now have set a random, "unguessable" `SESSION` token in the user's browser cookies. Next time they do an HTTP request to our server, their browser will send the SESSION token. We can then check in our database if it exists and what userId it's linked to.

A middleware was already created for you that does this. Its code is in `lib/check-login-token.js` and will be explained in detail later. Here's the gist of what it does:

1. Check the request cookies for a cookie called `SESSION`
2. If it does not exist, move on
3. If the cookie exists, do a database query to see if the session token belongs to a user:
  1. if it doesn't exist, move on
  2. if it does exist, then we update the `request` to contain the logged in user's info.

---

## Explanation of initial file structure
This project already contains many files and directories. In this section we go over what each one does in detail.

:warning: **ATTENTION**: Even though these explanations are given to you, *you should go over each file line by line before starting the project*. If there is something you don't understand, make sure you get an explanation before moving on.

### `index.js`
This file sits at the root of your project, and is the main file that will execute your web server. It contains a bit more logic than is normally desirable, but we tried to split up some of that logic in other modules where possible. Here's what this file does:

1. Load `express` and create a new web server
2. Load all the Express middlewares we will use and adds them to the pipeline with `app.use`
3. Loads the RedditAPI, created a database connection and sets up the API
4. Delegates anything under `/static` to the [static middleware](https://expressjs.com/en/starter/static-files.html)
5. Delegates anything under `/auth` to a custom [Express Router](https://expressjs.com/en/guide/routing.html#express-router)
6. Sets up a few other request handlers for the homepage, subreddits, creating posts and voting. These functionalities could be further split up in their own modules
7. Finally, makes the web server listen on `process.env.PORT`, which is set to `8080` on Cloud9.

### `database/tables.sql`
Contains the `CREATE TABLE` SQL statements for the whole database

### `database/data.sql`
Contains a data dump to give your Reddit Clone some initial data

### `public`
This directory contains static files like CSS and logo images. The files are served by Express' static middleware.

### `controllers/auth.js`
This file contains a custom [Express Router](https://expressjs.com/en/guide/routing.html#express-router). Here, we export a function that receives the `RedditAPI` instance, and returns the Router. An Express Router is like a tiny sub-application that takes care of its own paths. Notice that the `.get`s and `.post`s in there will say `/login` and `/signup`, but in the `index.js` file, we mount the router under `/auth`. This means that the final URLs will be `/auth/login` and `/auth/signup`.

### `lib/reddit.js`
This file contains the `RedditAPI` class. It's a correct version of the last project you worked on.

### `lib/check-login-token.js`
This file exports a function that takes a `RedditAPI` instance and returns an Express middleware that will check if the current request has a `SESSION` token. If it does, the middleware will try to find the user that corresponds to that session, and add the user object under the `request.loggedInUser` property. This same user object will also be added under `request.locals.loggedInUser`. `request.locals` is an object and its properties will be made available to the HTML template engine.

### `lib/only-logged-in.js`
This file exports a simple middleware that will force a user to be logged in. If a request comes from a non-logged in user, the middleware will not call `next()` and instead return a `401 Unauthorized` response. **This middleware is not meant to be used on every request**. Look in `index.js` for how this middleware is used.

### `views/layout.pug`
This file contains the main layout for the website. It outputs the main `<html>` structure, and uses [Pug's inheritance system](https://pugjs.org/language/inheritance.html). The part that says `block content` will be replaced with the content output by any template that extends `layout.pug`. Check `homepage.pug` for an example of extending the layout.

### `views/post-list.pug`
This file creates a [Pug mixin](https://pugjs.org/language/mixins.html) which is the equivalent of a function in that it can take arguments and be re-used. This mixin is used in `views/homepage.pug` and will be useful for you to build other views.

### `views/homepage.pug`
This file extends the `layout.pug` file and defines a block called "content". This block in turn uses the `postList` mixin to output a list of posts after outputting a generic title.

### `views/error.pug`
This file can be used anytime you have access to an error object. It is useful to output the error in a nice way to the browser.

---

## Your work!
This section details the work that you have to do on this project, as well as suggestions to improve it further.

:warning: **ATTENTION**: Even though the QA team's job is to thouroughly test the website/application, **it is still your duty as a developer to make sure you hand an app that has been tested to the best of your knowledge**. This will enable the QA team to concentrate on the really hard to find bugs or "features", and everyone will benefit.

### Signup and Login
The first thing you'll have to do is complete the signup and login features of the site.

1. Signup
  In `controllers/auth.js`, make the `app.get('/signup')` render an HTML signup form. To do this, add a file `views/signup-form.pug` and make it output the following form:
  
    ```html
    <h1>Signup</h1>
    <form action="/auth/signup" method="POST">
        <p>Username: <input type="text" name="username"></p>
        <p>Password: <input type="password" name="password"></p>
        <p><button type="submit">Signup!</button></p>
    </form>
    ```
  Make sure that your `pug` file extends the `layout.pug` so that your signup form gets output with all the surrounding HTML.
  
  Then, implement the code of `app.post('/signup')`. This code will receive the form data under `request.body`. There, you have to call `myReddit.createUser` and pass it the necessary info. Once the `createUser` promise is resolved, use `response.redirect` to send the user to `/auth/login`.

2. Login
  In `controllers/auth.js`, make the `app.get('/login')` render an HTML login form. To do this, add a file `views/login-form.pug` and make it output the following form:
  
    ```html
    <h1>Login</h1>
    <form action="/auth/login" method="POST">
        <p>Username: <input type="text" name="username"></p>
        <p>Password: <input type="password" name="password"></p>
        <p><button type="submit">Login!</button></p>
    </form>
    ```
  This form is super similar to the signup form, except for the `action`. Make sure that your `pug` file extends the `layout.pug` so that your signup form gets output with all the surrounding HTML.

  Then, implement the code of `app.post('/login')`. To do this, you'll need to complete some code in `lib/reddit.js`:
  
  1. In `lib/reddit.js`, complete the code of the `checkUserLogin` function following the instructions in comments.
  2. In `lib/reddit.js`, complete the code of the `createUserSession` function following the instructions in comments.
  
  When these two functions are done, start working on the `POST` handler for `/login`:
  
  1. Use the `checkUserLogin` function, passing it the `request.body` username and password
  2. If the login check is unsuccessful, send a `401 Unauthorized` status to the browser, else move to step 3
  3. Since login is successful, use the `checkUserLogin` response to find the user's ID, and pass it to the `createUserSession` function
  4. When that function is done, you'll get back a random session ID. Use Express `response.cookie` to set a cookie with name `SESSION` and value being that session id
  5. Use `response.redirect` to send the user back to the home page.
  
3. Checking if user is actually logged in
  The code in `lib/check-login-token.js` gets executed on every request to check if the request contains a `SESSION` cookie. Even though the code was written for you, it relies on a function called `getUserFromSession` in the RedditAPI. Implement that function by doing a `JOIN` query between the sessions and users tables, and return the full user object for the given session ID. Once you do that, refresh the home page and you should see a message at the top saying "Welcome YOUR USER".
  
That's it! You have fully implemented the signup, login, and cookie consumption process. Your Pug templates have access to a variable called `loggedInUser`. It will be `false` if there is no user, and will contain a user object otherwise. Check the code of `views/layout.pug` to see an example of using that variable.

### Subreddit pages
In `index.js`, there is an `app.get('/r/:subreddit')` that is currently not returning anything. We'd like to make it output a list of posts just like on the front page, but only for the requested subreddit. To do this, you'll have to make a few changes:

1. First, we have to go from subreddit name to subreddit ID. Create a `RedditAPI` function called `getSubredditByName(name)`. This should make a query to the database, and return a subreddit object that matches the given name. If no subreddit was found, the promise should resolve with `null`.
2. Call `getSubredditByName` from the `app.get` handler, and pass it the `request.params.subreddit`. If you get back null, send a 404 response. Otherwise move to the next step.
3. Modify the `RedditAPI.getAllPosts` function to accept a `subredditId` optional parameter. If this parameter is passed, the `SELECT` query should be changed to add a `WHERE p.subredditId = ?`, and return only posts for that subreddit.
4. Call `getAllPosts` from your `app.get` handler, passing it the subreddit ID from step 2. Then, render the resulting list of posts using the `post-list.pug` template. Since this is a subreddit, the rendering should include the name of the subreddit as well as its description before the post list. You can use Pug conditionals in `post-list.pug` to make this happen.

### Sorted pages
In `index.js`, there is an `app.get('/sort/:method') that is currently not returning anything. We'd like to make it output a list of posts just like on the front page, but sorted by something other than `createdAt DESC`.

To do this, you'll first have to make some changes to the `RedditAPI.getAllPosts` function. Make it accept an optional `sortingMethod` parameter that can be `hot` or `top`. If the sorting method is set to `top`, then the posts should be ordered by `voteScore DESC`. If the sorting method is set to `hot`, then the posts should be ordered by `voteScore / NOW() - p.createdAt DESC`. This formula will take the score, but divide it by the number of seconds the post has been online. This will make newer posts appear higher if they have the same number of votes as an older post.

In the `app.get` handler, check if `request.params.method` is either `hot` or `top`. If not, then return a 404 error. If it is, call the `getAllPosts` and then render a list of posts just like on the home page.

Finally, make sure that you have `<a href="/sort/hot">` and `<a href="/sort/top">` links somewhere on the page, so that the user can change sorting methods by clicking.

### Creating new posts
In `index.js`, there is a `GET` and `POST` handlers for `/createPost`. Let's implement them! Make the `GET` handler return an HTML form like the following one by creating a `create-post-form.pug` file:

```html
<h1>Share a new link!</h1>
<form method="POST" action="/createPost">
    <p>
        Subreddit:
        <select name="subredditId">
            <option value="1">FirstSubreddit</option>
            ... one option tag for each subreddit
        </select>
    </p>
    <p>URL: <input type="text" name="url"></p>
    <p>Title: <input type="text" name="title"></p>
</form>
```

The `<select>` element is a dropdown list. The names between `<option>` tags will be shown to the user, but the `value="XX"` part will be sent to the server. To output this `<select>` box, you'll have to use the `RedditAPI.getAllSubreddits` function before rendering the template.

Then, implement the `POST` handler: notice that the code uses the `onlyLoggedIn` middleware to make sure that this will only be called when there is a logged in user. Here you will call `RedditAPI.createPost` and you'll need to pass it the information from the form. You also need to provide a `userId`, but that will be coming from `request.user` instead of `request.body`.

Once the post is created successfully, the only thing you can do is redirect the user. Use the newly created posts' ID to redirect them to `/post/<postId>` which you will implement next.

### Single post view
In `index.js` there is a `GET` handler for `/post/:postId`. This should use the `RedditAPI.getSinglePost` function to get the post by its ID. If the post does not exist, return a 404. If it does, then create a new Pug template that will output that post as well as its comments. To do this, you'll not only need to call `getSinglePost`, but also `getCommentsForPost`. **Make sure to use `Promise.all` to do this, since the two requests are independent**.

### Votes and voting on content
How will the user cast a vote for a post eventually? Their browser will have to make a **POST** request to`/vote`. Next to each post, when outputing the `<li>` for that post, you have to add the following form:

```html
<form action="/vote" method="post">
  <input type="hidden" name="postId" value="THE ID OF THE CURRENT POST">
  <button type="submit" name="vote" value="1">upvote this</button>
  <button type="submit" name="vote" value="-1">downvote this</button>
</form>
```

This code looks weird because we have two submit buttons. The way it works is that the submit buttons are each tied to a `-1` and `1` value for the `vote` property. Clicking on one of the buttons will submit its `value` as the `vote` value in the form.

Then, you have to implement the `POST` handler for `/vote` in `index.js`. Make it call `RedditAPI.createVote` and pass the necessary information. The `postId` will come from the `hidden` input. Hidden inputs are useful because they allow us to pass information to the server without any user input.

## Done! Done?
This concludes the minimal part of the project. The following section gives you some suggestions on features you can add to make your Reddit Clone more unique.

:warning: **ATTENTION**: Even though the QA team's job is to thouroughly test the website/application, **it is still your duty as a developer to make sure you hand an app that has been tested to the best of your knowledge**. This will enable the QA team to concentrate on the really hard to find bugs or "features", and everyone will benefit. And yes, we did write this twice on purpose. Thanks for reading this far :)

---

## Extra features
TODO.

### Users listing page
In `index.js` add `GET` handler for a new `/users` endpoint. In `reddit.js` add an API function `getAllUsers` which will fetch all the users from the database such that you can call `RedditAPI.getAllUsers` in your `/users` handler to retrieve a list of all users. Create a new Pug template that will output a list of usernames.
Each username should a link to `/users/:userId` which we will create in the next step.

### User posts page
In `index.js` add `GET` handler for a new `/users/:userId` endpoint. This endpoint should serve list of all posts by a single user. Create a new API function to retrieve all the posts made by a given userId. Finally this endpoint could re-use the `post-list` Pug template.
