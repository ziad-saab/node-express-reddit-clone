# Let's build a tiny Reddit clone -- the "full thing" edition
In a previous workshop, we set out to build a Reddit clone from the data perspective, Finishing that workshop gave us many functions that we'll still be able to use for this one like `createPost`, `getAllPosts`, ...

In this workshop, we are going to take the functionality that we already built, and make a website out of it! To do this, we are going to use many of the technologies we have already seen, but we will also be adding a bit more stuff on top.

At the end of this workshop, we should have a Reddit clone with the following functionality:

  * Non-logged in users will be able to view a paginated list of posts ordered by one of hot, top, newest and controversial
  * Non-logged in users will be able to signup or login to the site
  * Logged in users will be able to view the same paginated list of posts. But in addition, they will also be able to cast either an up or down vote for each post.
  * Logged in users will be able to add new posts to the site. A post will be a combination of a URL and a title.

## Getting started
Since we already have some code going in our `reddit-nodejs-api` project, as well as a MySQL database and some pre-existing data, we will be starting from this project.

Currently, the `index.js` file has been the place where you test your API, making requests like `redditAPI.createUser`, or `redditAPI.createPost`, ... For this workshop, we are going to make `index.js` the centerpiece of our project: in addition to establishing a connection to our database, we'll be creating an Express server and making it listen to `process.env.PORT`. Eventually we'll be adding our `app.get`s and `app.post`s to make our Reddit clone happen!

## How does this work relate to the Reddit API we built last week?
Last week we started building a Reddit API in Node: a series of data functions that are going to drive the site. Each of us is at a different stage of this process, which is fine. This workshop is 100% related to the API workshop. If you only built the `getAllPosts` function, then you can still build parts of the web server. You can go back and forth between the API functions and the web server as you add more functionality.

## Creating our web server
Before starting to write any code, let's figure out the different pages we will need:

  * **Homepage**:

    The homepage lists up to 25 posts, by default sorted by descending "hotness" (more on that later). The homepage is accessible at the `/` resource path. But in addition to showing the top 25 "hot" posts, the homepage resource can take a **query string parameter** called `sort` that can have the following values:

      1. **top**: Sort the posts by decreasing "vote score". The "vote score" is simply the difference between the number of upvotes and the number of downvotes.
      2. **hot**: Sort the posts by decreasing "hotness score". The "hotness score" is simply the ratio of the "vote score" (see 1.) to the number of seconds since a post has been created. Basically, given the same number of "vote score", a newer post will get a better "hotness score"
      3. **new**: Sort the posts by increasing order of `createdAt`, basically the newest posts first.
      4. **controversial**: A post is considered  controversial if it has almost as many upvotes as it has downvotes. The more of each it has the better! I don't have a perfect formula for this, but perhaps something like `min(numUpvotes, numDownvotes) / (numUpvotes - numDownvotes)^2`?

      *Hint: Do we need to implement this functionality from the start? Can we get away with maybe only one sorting function, then add more?*

  * **Signup page**:

    The signup page will be a simple page with an HTML `<form>`. The form will have username and password fields, as well as a "signup" submit button. More on that later.

  * **Login page**:

    The login page will be a simple page with an HTML `<form>`. The form will have username and password fields, as well as a "login" submit button. More on that later.

  * **Create post page**

  The create post page will also be a simple page with an HTML `<form>`. The form will have title and URL fields, as well as a "create" submit button.

## Handling form submissions
We will have at least three form submissions to handle: login, signup and create post. Each form should be sent using a **POST** request to the server. Sending a **POST** request is an indication that we want to create new data on the target system. Therefore it's very important to not submit such data more than once.

Browsers are good at helping with this: notice that if you submit a form through POST, and try to refresh the resulting web page, the browser will warn that you are about to re-submit a form.

We can avoid this though: a good practice is to [**always redirect the user after a POST**](https://en.wikipedia.org/wiki/Post/Redirect/Get) (read this Wikipedia article). If you redirect the user to another page using an HTTP [`303 See Other` status code](https://en.wikipedia.org/wiki/Post/Redirect/Get) then the browser will load that other page with a GET request and all will be well. The user will not even be able to re-submit the same form data!

For the signup form, we could redirect the user to the login page after they're done. For the login form we can redirect users to the homepage. For the create post form, we could also redirect the user to the homepage. If we had a page per post (with comments for example) then we could also redirect the user to the new post page that they created, like they do over at Reddit.

To redirect users, we can use the [Express `res.redirect`](http://expressjs.com/en/api.html#res.redirect) function.

## User signup and login processes
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

```json
{
  "id": 2,
  "username": "thompson",
  "password": "$2a$10$26OFMwEvtb4.6nWuYOPg6OJYlyl.uh7barqO5wfKrI9J9wJOZFIei",
  "updatedAt": "2016-04-16T22:45:34.000Z",
  "createdAt": "2016-04-16T22:45:34.000Z"
}
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
6. Server receives the request and parses it into appropriate objects like `request.body`
7. In our web server callback, we use the `request.body.username` and `request.body.password` to call a function of our API, perhaps called `checkLogin`
8. Our `checkLogin` function:
  a. Takes a username, password and callback
  b. Does an SQL request to our database like `SELECT * FROM users WHERE username = ?`
  c. After retrieving the SQL result, uses `bcrypt.compare` function to check if it matches the input password
  d. If the passwords match, the function calls back perhaps the full user object
  e. If the passwords don't match, the function can callback with an error

The code might look a bit like this:
```javascript
function checkLogin(user, pass, cb) {
  conn.query('SELECT * FROM users WHERE username = ?', [user], function(err, result) {
    // check for errors, then...
    if (result.length === 0) {
      callback(new Error('username or password incorrect')); // in this case the user does not exists
    }
    else {
      var user = result[0];
      var actualHashedPassword = user.password;
      bcrypt.compare(pass, actualHashedPassword, function(err, result) {
        if(result === true) { // let's be extra safe here
          callback(null, user);
        }
        else {
          callback(new Error('username or password incorrect')); // in this case the password is wrong, but we reply with the same error
        }
      });
    }
  });
}
```

What do we do if the user provided us with a good combination of username/password? Remember that **HTTP is stateless**, so if we don't do anything right now before the login request is finished, it will be too late and we will have lost our user!

### A wild cookie has appeared!
Before terminating a login's POST request, we have to send a cookie to the user using the `Set-Cookie` header. Actually Express has a nice [`res.cookie`](http://expressjs.com/en/4x/api.html#res.cookie) function that does that. We simply need to figure out what to pass as a cookie.

Whatever we set as the cookie, the user's browser will pass that value back to us as long as the cookie has not expired. We can use an ExpressJS middleware called [`cookie-parser`](https://github.com/expressjs/cookie-parser) to get the cookie values as a nice object under `request.cookies`.

Imagine for a second that we set the cookie value as `USER=thompson`. We're doing this to "remember" the user the next time they make an HTTP request. On the next request, the browser will pass a `Cookie` header with the value `USER=thompson`. Do you see anything wrong with this?

Here's what's wrong: **because the browser is the one passing the cookie values, anyone can put a cookie in their browser that says USER=thompson**. Therefore, we have to set a cookie value that will **prove to us that the user is who they say they are**.

There are many ways to do this, but here is the one we will follow: when a user successfully logs in, we will [generate a **random number** using the `secure-random` NPM package](https://www.npmjs.com/package/secure-random) -- it's often called a session token -- and store it in a `sessions` table along with the user ID of the user.

Using the `checkLogin` code above, we can now implement a `POST /login` server function. It will receive the username and password, call `checkLogin`. If everything goes well, we will generate a token for the user and set a cookie with that token. Otherwise we will send an error message to the user. **Type in this code and understand it rather than copy/paste**:

```javascript
// At the top of our reddit.js:
var secureRandom = require('secure-random');
// this function creates a big random string
function createSessionToken() {
  return secureRandom.randomArray(100).map(code => code.toString(36)).join('');
}

function createSession(userId, callback) {
  var token = createSessionToken();
  conn.query('INSERT INTO sessions SET userId = ?, token = ?', [userId, token], function(err, result) {
    if (err) {
      callback(err);
    }
    else {
      callback(null, token); // this is the secret session token :)
    }
  })
}

// In the request handler:
app.post('/login', function(request, response) {
  RedditAPI.checkLogin(request.body.username, request.body.password, function(err, user) {
    if (err) {
      response.status(401).send(err.message);
    }
    else {
      // password is OK!
      // we have to create a token and send it to the user in his cookies, then add it to our sessions table!
      RedditAPI.createSession(user.id, function(err, token) {
        if (err) {
          response.status(500).send('an error occurred. please try again later!');
        }
        else {
          response.cookie('SESSION', token); // the secret token is now in the user's cookies!
          response.redirect('/login');
        }
      });
    }
  });
});
```

### Time to eat that cookie
Cool. We now have set a random, "unguessable" value in the user's browser. Next time they do an HTTP request to our server, their browser will send the random value. We can then check in our database if it exists and what userId it's linked to.

But where are we going to put this code? After all, pretty much every request will need to check if a user is currently "logged in"... What's one thing that we can run on every request? [Express middleware](http://expressjs.com/en/guide/using-middleware.html)!

Let's create a middleware that will run on every request. Here's how our middleware will work:

  1. Check the request cookies for a cookie called `SESSION`
  2. If it does not exist, call `next()` to exit the middleware
  3. If the cookie exists, do a database query to see if the session token belongs to a user:

    1. if it doesn't, then call `next()` again (here we could also "delete" the cookie)
    2. if it does, then we can set a `loggedInUser` property on the `request` object. This way each request handler can pick it up and do what it wants with it.

Here's what the middleware could look like:

```javascript
// At the top of the server code:
var cookieParser = require('cookie-parser');
app.use(cookieParser()); // this middleware will add a `cookies` property to the request, an object of key:value pairs for all the cookies we set

// The middleware
function checkLoginToken(request, response, next) {
  // check if there's a SESSION cookie...
  if (request.cookies.SESSION) {
    RedditAPI.getUserFromSession(request.cookies.SESSION, function(err, user) {
      // if we get back a user object, set it on the request. From now on, this request looks like it was made by this user as far as the rest of the code is concerned
      if (user) {
        request.loggedInUser = user;
      }
      next();
    });
  }
  else {
    // if no SESSION cookie, move forward
    next();
  }
}

// Adding the middleware to our express stack. This should be AFTER the cookieParser middleware
app.use(checkLoginToken);

// And later on in a request handler (this is ***only an example***):
app.post('/createPost', function(request, response) {
  // before creating content, check if the user is logged in
  if (!request.loggedInUser) {
    // HTTP status code 401 means Unauthorized
    response.status(401).send('You must be logged in to create content!');
  }
  else {
    // here we have a logged in user, let's create the post with the user!
    RedditAPI.createPost({
      title: request.body.title,
      url: request.body.url,
      userId: request.loggedInUser.id
    }, function(err, post) {
      // do something with the post object or just response OK to the user :)
    })
  }
})
```

## Votes and voting on content
How will the user cast a vote for a post eventually? Their browser will have to make a **POST** request, perhaps to a resource like `/vote` or `/votePost`? On the posts page, when outputing the `<li>` for each post, you can add two forms like this:

```html
<form action="/vote" method="post">
  <input type="hidden" name="vote" value="1">
  <input type="hidden" name="postId" value="XXXX">
  <button type="submit">upvote this</button>
</form>
<form action="/vote" method="post">
  <input type="hidden" name="vote" value="-1">
  <input type="hidden" name="postId" value="XXXX">
  <button type="submit">downvote this</button>
</form>
```

This is weird though. Imagine if on Reddit every time you cast a vote, the page would refresh? In the next weeks we will learn how to make these kind of requests (GET, POST, ...) to a server but without refreshing the page, perhaps using jQuery or even React!

## Rendering HTML
*This whole section is optional. You can render HTML on the server-side by simply doing string concatenation.*

Rendering HTML by doing things like:

```javascript
var output = "<ul>";
contents.forEach(function(item) {
  output += "<li><a href='" + item.url + "'>" + item.title + "</a>";
});
output += "</ul>";
```

can quickly get out of hand, especially as you have a more complex page.

There exist a lot of libraries and frameworks with the unique goal of letting us render HTML a bit more easily. Since we are going to look at [ReactJS](https://facebook.github.io/react/) when we study front-end development, now would be a good time to discover how React can help us render complex HTML structures directly in our JavaScript code, in a quite intuitive way.

Here's an example of how we could use React's JSX to render the posts page:

```javascript
function PostList(data) {

  var postItems = data.posts.map(function(item) {
    return <Post key={item.id} id={item.id} url={item.url} title={item.title} voteScore={item.voteScore}/>;
  });

  return (
    <div>
      <h1>Posts page!</h1>
      <ul>
        {postItems}
      </ul>
    </div>
  );
}

function Post(data) {
  return (
    <li>
      <h2>
        <a href={data.url}>{data.title}</a> (score: {data.voteScore})
      </h2>
    </li>
  );
}

var htmlStructure = <PostList posts={[]}/>

var html = render(htmlStructure);
```

**What sorcery is this?!??** We're straight up writing HTML inside our JavaScript?!

The sorcery is called [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) and it can be used to write code that looks like HTML, but with actual variables like arrays, numbers and strings inside.

While there is a lot more to React than writing this JSX template code, perhaps you can already see how this can let us separate our rendering code into **functions**. If you look at the piece of code above, we have two functions: `PostList` and `Post`. The `PostList` receives as data an array of posts, and using the `map` function transforms this list to a list of `<Post>`s, which is another rendering function.

JSX lets us nest these rendering functions the same way we would nest HTML tags, *effectively letting us write our own HTML elements*. It may sound a bit complicated, but it's not! There are a few things to know if you want to do this right now...

1. The React library is mostly useful on the front-end or browser side of things. It's used to create fully interactive applications. Here, we're using React and the JSX syntax on the server-side simply to render HTML nicely.
2. What you are looking at is not actually HTML and it's not JavaScript. It's an extension called JSX, which lets you write a nested structure of components and pass properties to them. Since you can use any JavaScript expression as a value, it's extremely powerful.
3. Neither browsers nor NodeJS understand JSX! To make this code even usable, we have to transform it. The official tool to transform newer, modern JavaScript or JSX into something the browser or even NodeJS can understand is called Babel. It's what we call a transpiler, because it transform code to other code.
4. Babel can take your JSX and transform it to regular JavaScript. When it does that, all it's doing is making calls to a function called `React.createElement`, so there's nothing magical about JSX. Here's an example before and after:

**BEFORE**:
```javascript
function Post(data) {
  return (
    <div className="post">
      <h2>{data.title}</h2>
    </div>
  )
}
```

**AFTER**:
```javascript
function Post(data) {
  return (
    React.createElement("div", {className: "post"},
      React.createElement("h2", null, data.title)
    )
  );
}
```

So really it's simply a nicer way of writing JavaScript that will create HTML :)

If you want to try this at home, you have to make some changes to your server and the way to run it. You also have to install a few NPM modules:

1. Let's install NPM packages `react` and `react-dom` and `babel-presets-react`.
2. Let's install the `babel-cli` package **globally** with `npm install --global`. This will make the package available as a command-line tool called `babel-node`
3. In our `package.json` let's add a `babel` section like this:
```json
{
  "babel": {
    "presets": ["react"]
  }
}
```

That's all that's really needed. Now, instead of running your web server with `node index.js` you can run it with `babel-node index.js`. **This is not something you should do in production**, but it's good enough for development. It will let you use JSX inside your NodeJS code.

Here's a small example of a fully functional Express server, where one of the URLs returns HTML built with this method, versus the same built with straight HTML:

```javascript
var React = require('react');
var render = require('react-dom/server').renderToStaticMarkup;
var express = require('express');

var app = express();

function PostList(data) {

  var postItems = data.posts.map(function(item) {
    return <Post url={item.url} title={item.title} voteScore={item.voteScore}/>;
  });

  return (
    <div>
      <h1>Posts page!</h1>
      <ul>
        {postItems}
      </ul>
    </div>
  );
}

function Post(data) {
  return (
    <li>
      <h2>
        <a href={data.url}>{data.title}</a> (score: {data.voteScore})
      </h2>
    </li>
  );
}

app.get('/posts', function(request, response) {
  redditAPI.getAllPosts(function(err, posts) {
    if (err) {
      response.status(500).send('try again later!');
    }
    else {
      var htmlStructure = PostList({posts: posts}); // calling the function that "returns JSX"
      var html = render(htmlStructure); // rendering the JSX "structure" to HTML
      response.send(html);
    }
  });
});
```
