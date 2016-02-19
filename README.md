# Let's build a tiny Reddit clone -- the "full thing" edition
In a previous workshop, we set out to build a Reddit clone from the data perspective. Finishing this workshop gave us many functions that we'll still be able to use for this one like `createNewUser`, `createNewContent` and `voteOnContent`.

In this workshop, we are going to take the functionality that we already built, and make a website out of it! To do this, we are going to use many of the technologies we have already seen, but we will also be adding a bit more stuff on top.

At the end of this workshop, we should have a Reddit clone with the following functionality:

  * Non-logged in users will be able to view a paginated list of posts ordered by one of hot, top, newest and controversial
  * Non-logged in users will be able to signup or login to the site
  * Logged in users will be able to view the same paginated list of posts. But in addition, they will also be able to cast either an up or down vote for each piece of content.
  * Logged in users will be able to post new content to the site. A content will be a combination of a URL and a title.

## Getting started
To get started, we are going to create a new workspace in Cloud 9. In this workspace we will be creating a new, empty MySQL database called "`reddit_clone`".

Then, we are going to use the Sequelize library to create our three models (Content, User and Vote). We can do this by re-using the code provided in [the previous Sequelize workshop](https://github.com/DecodeMTL/nodejs-reddit-clone-workshop). Let's put all this code in a module called `data-model.js`. As needed, we will export stuff from this module so that we can use it in other parts of the code.

Once your code has been imported, don't forget to run `db.sync()` once in order to create the initial tables in your MySQL database. Then, we are going to start creating our web server.

## Creating our web server
Before starting to write any code, let's figure out the different pages we will need:

  * **Homepage**:

    The homepage lists up to 25 posts, by default sorted by descending "hotness" (more on that later). The homepage is accessible at the `/` resource path. But in addition to showing the top 25 "hot" posts, the homepage resource can take a **query string parameter** called `sort` that can have the following values:

      1. **top**: Sort the posts by decreasing "vote score". The "vote score" is simply the difference between the number of upvotes and the number of downvotes.
      2. **hot**: Sort the posts by decreasing "hotness score". The "hotness score" is simply the ratio of the "vote score" (see 1.) to the number of seconds since a post has been created. Basically, given the same number of "vote score", a newer post will get a better "hotness score"
      3. **new**: Sort the posts by increasing order of `createdAt`, basically the newest posts first.
      4. **controversial**: A post is considered  controversial if it has almost as many upvotes as it has downvotes. The more of each it has the better! I don't have a perfect formula for this, but perhaps something like `min(numUpvotes, numDownvotes) / (numUpvotes - numDownvotes)^2`?

      *Hint: Do we need to implement this functionality from the start???*

      *Hint #2: The answer is a two-letter word ;)*

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

Here's the simplest code example using `bcrypt` and `Sequelize`:

```javascript
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

var db = new Sequelize('reddit', 'db-user', 'db-pass', {dialect: 'mysql'});

var User = db.define('user', {
    username: Sequelize.STRING,
    hashed_password: Sequelize.STRING,
    password: {
        type: Sequelize.VIRTUAL,
        set: function(actualPassword) {
            this.setDataValue('hashed_password', bcrypt.hashSync(actualPassword, 10));
        }
    }
});
```

The code above will define the `User` model as having what looks like two password fields: one called `hashed_password` which is of type `STRING` and another one called `password` which is of type `VIRTUAL`. When creating a `VIRTUAL` field, **it will not be stored in the database**. This is *exactly* what we wanted :)

However, the `set` function of a virtual field will be called if we try to set that field. In this case, if we try to set the `password` field, the code will use Sequelize's `setDataValue` to instead set the value of the field called `hashed_password`. It will use bcrypt's `hashSync` function, which takes the actual password as its first parameter, and a "number of rounds" as the second argument. Tuning that second parameter can make hashed passwords more or less secure. This will not be discussed in more detail for this workshop, so we will leave it at 10.

Now that we have this virtual field setup, we can create a new user the following way:

```javascript
User.create({
  username: 'thompson',
  password: 'Hunter2'
}).then(
  function(user) {
    console.log(user.toJSON());
  }
)
```

In this case the output will look like this:

```json
{
  "id": 2,
  "username": "thompson",
  "hashed_password": "$2a$10$26OFMwEvtb4.6nWuYOPg6OJYlyl.uh7barqO5wfKrI9J9wJOZFIei",
  "updatedAt": "2016-02-16T22:45:34.000Z",
  "createdAt": "2016-02-16T22:45:34.000Z"
}
```

Then, in our login function, we will receive again a username and a password. This time, we will go to our database to find a user with the same username.

If we don't find a user, then we can respond with "username or password incorrect". This will prevent attackers from knowing whether or not the username exists.

If we do find a user, we can use bcrypt's `compareSync` function to compare the found user's hashed password with the password we received from the login process. It would go a bit like this:

```javascript
User.findOne({
  where: {
    username: 'thompson'
  }
}).then(
  function(user) {
    if (!user) {
      // here we would use response.send instead :)
      console.log('username or password incorrect');
    }
    else {
      // Here we found a user, compare their password!
      var isPasswordOk = bcrypt.compareSync('Hunter2', user.hashed_password);

      if (passwordOk) {
        // this is good, we can now "log in" the user
      }
      else {
        console.log('username or password incorrect');
      }
    }
  }
)
```

What do we do if the user provided us with a good combination of username/password? Remember that **HTTP is stateless**, so if we don't do anything right now before the login request is finished, it will be too late and we will have lost our user!

### A wild cookie has appeared!
Before terminating a login's POST request, we have to send a cookie to the user using the `Set-Cookie` header. Actually Express has a nice [`res.cookie`](http://expressjs.com/en/4x/api.html#res.cookie) function that does that. We simply need to figure out what to pass as a cookie.

Whatever we set as the cookie, the user's browser will pass that value back to us as long as the cookie has not expired. We can use an ExpressJS middleware called [`cookie-parser`](https://github.com/expressjs/cookie-parser) to get the cookie values as a nice object under `request.cookies`.

Imagine for a second that we set the cookie value as `USER=thompson`. We're doing this to "remember" the user the next time they make an HTTP request. On the next request, the browser will pass a `Cookie` header with the value `USER=thompson`. Do you see anything wrong with this?

Here's what's wrong: **because the browser is the one passing the cookie values, anyone can put a cookie in their browser that says USER=thompson**. Therefore, we have to set a cookie value that will **prove to us that the user is who they say they are**.

There are many ways to do this, but here is the one we will follow: when a user successfully logs in, we will [generate a **random number** using the `secure-random` NPM package](https://www.npmjs.com/package/secure-random) -- it's often called a session token -- and store it in a `sessions` table along with the user ID of the user.

Here's how our `Session` model will look:

```javascript
var Session = db.define('session', {
    token: Sequelize.STRING
});
User.hasMany(Session); // This will let us do user.createSession
Session.belongsTo(User); // This will let us do Session.findOne({include: User})
```
(*don't forget to use `db.sync()` after creating this model*)

If you look at the user login code above, where it says `// this is good, we can now "log in" the user`, we can now add a session for this user:

```javascript
// At the top of our server.js:
var secureRandom = require('secure-random');
function createSessionToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('')
}

// In the request handler:
if (passwordOk) {
  var token = createSessionToken();

  user.createSession({
    token: token
  }).then(function(session) {
    // Here we can set a cookie for the user!
    response.cookie('SESSION', token);
  })
}
```

### Time to eat that cookie
Cool. We now have set a random, "unguessable" value in the user's browser. Next time they do an HTTP request to our server, their browser will send the random value. We can then check in our database if it exists and what userId it's linked to. Because we are also storing the session's `createdAt`, we could limit session time that way, by only accepting sessions that were created say less than 24 hours ago.

But where are we going to put this code? After all, pretty much every request will need to check if a user is currently "logged in"... What's one thing that we can run on every request? [Express middleware](http://expressjs.com/en/guide/using-middleware.html)!

Let's create a middleware that will run on every request. Here's how our middleware will work:

  1. Check the request cookies for a cookie called `SESSION`
  2. If it does not exist, call `next()` to exit the middleware
  3. If the cookie exists, do a database query to see if the session token belongs to a user:

    1. if it doesn't, then call `next()` again (here we could also "delete" the cookie)
    2. if it does, then we can set a `loggedInUser` property on the `request` object. This way the request handler can pick it up and do what it wants with it.

Here's what the middleware could look like:

```javascript
// At the top of the server code:
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// The middleware
function checkLoginToken(request, response, next) {
  if (request.cookies.SESSION) {
    Session.findOne({
      where: {
        token: request.cookies.SESSION
      },
      include: User // so we can add it to the request
    }).then(
      function(session) {
        // session will be null if no token was found
        if (session) {
          request.loggedInUser = session.user;
        }

        // No matter what, we call `next()` to move on to the next handler
        next();
      }
    )
  }
}

// Adding the middleware to our express stack. This should be AFTER the cookieParser middleware
app.use(checkLoginToken);

// And later on in a request handler (this is only an example):
app.post('/createContent', function(request, response) {
  // before creating content, check if the user is logged in
  if (!request.loggedInUser) {
    // HTTP status code 401 means Unauthorized
    response.status(401).send('You must be logged in to create content!');
  }
  else {
    // here we have a logged in user, let's create content on the user!
    // the addContent function is a Sequelize "magic method", added because we called User.hasMany(Content)
    request.loggedInUser.addContent({
      title: request.body.title,
      url: request.body.url
    }).then(
      function(content) {
        // here the content has been created. since we don't have a "single post" page, we could redirect the user to the posts page (home page in our case)!
        response.redirect('/');
      }
    )
  }
})
```

### The evil twin!
Our little login system is coming together nicely. There's one problem though: we can create as many users with the same username as we want! Try it out to prove it to yourself.

We will need to add a **unique index** to our `users` table to keep this from happening. Sequelize makes this easy for us. We simply have to change the definition of the `username` field in our User model. Then we need to make the same change to our MySQL table.

In our code, instead of defining username as:

```javascript
{
  username: Sequelize.STRING
}
```

We will use the following:

```javascript
{
  username: {
    type: Sequelize.STRING,
    unique: true
  }
}
```

To modify our database accordingly:

```sql
ALTER TABLE `users` ADD UNIQUE INDEX `uniqueUsername` (`username`)
```

If you try to `INSERT` two users with the same username, you will get an error:

```sql
mysql> INSERT INTO users SET username='thompson';
ERROR 1062 (23000): Duplicate entry 'thompson' for key 'username'
```

That's it for now. This should give you enough information to have a tiny, not-so-unsecure login system. Keep in mind all the warnings though ;)

## Votes and voting on content
Here's a Sequelize query that can get you Contents along with its "vote score", ordered by vote score:

```javascript
Content.findAll({
    include: {model: Vote, attributes: []},
    group: 'content.id',
    attributes: {
        include: [
            [Sequelize.fn('SUM', Sequelize.fn('IF', Sequelize.col('votes.upVote'), 1, -1)), 'voteScore']
        ]
    },
    order: [Sequelize.literal('voteScore DESC')],
    limit: 25, // this can be hard-coded to 25, and eventually in a later phase parameterized
    subQuery: false // what's this?? come see me if you feel adventurous and want to know more :)
})
```

For this to work you have to associate Content to Vote. How? Add a new association `Content.hasMany(Vote)` :)

And here's one that will let you cast a vote for a user:

```javascript
// First check if a vote already exists
Vote.findOne({
    where: {
      userId: 1, // This should be the currently logged in user's ID
      contentId: 1 // This should be the ID of the content we want to vote on
    }
}).then(
    function(vote) {
        if (!vote) {
            // here we didn't find a vote so let's add one. Notice Vote with capital V, the model
            return Vote.create({
                userId: 1, // Received from the loggedIn middleware
                contentId: 1, // Received from the user's form submit
                upVote: true // Received from the user's form submit
            });
        }
        else {
            // user already voted, perhaps we need to change the direction of the vote?
            return vote.update({
                upVote: true // Received from the user's form submit
            });
        }
    }
).then(
    // Look at the two returns in the previous callbacks. In both cases we are returning
    // a promise, one to create a vote and one to update a vote. Either way we get the result here
    function(vote) {
        // Good to go, the user was able to vote. Let's redirect them to the homepage?
        response.redirect('/');

        // Perhaps we could redirect them to where they came from?
        // Try to figure out how to do this using the Referer HTTP header :)
    }
);
```

But how will the user cast a vote? Their browser will have to make a **POST** request, perhaps to a resource like `/voteContent`? On the posts page, when outputing the `<li>` for each post, you can add two forms like this:

```html
<form action="/voteContent" method="post">
  <input type="hidden" name="upVote" value="true">
  <input type="hidden" name="contentId" value="XXXX">
  <button type="submit">upvote this</button>
</form>
<form action="/voteContent" method="post">
  <input type="hidden" name="upVote" value="false">
  <input type="hidden" name="contentId" value="XXXX">
  <button type="submit">downvote this</button>
</form>
```

This is weird though. Imagine if on Reddit every time you cast a vote, the page would refresh? In the next weeks we will learn how to make these kind of requests (GET, POST, ...) to a server but without refreshing the page.

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

can quickly get out of hand, especially as you have a more complex page. One thing that can help us here are [ES6 Template Strings](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/template_strings). They already work in NodeJS version 5 so we can use them no problem. But even then it's not ideal.

There exist a lot of libraries and frameworks with the unique goal of letting us render HTML a bit more easily. Since we are going to look at [ReactJS](https://facebook.github.io/react/) when we study front-end development, now would be a good time to discover how React can help us render complex HTML structures directly in our JavaScript code, in a not-so-unintuitive way.

Here's an example of how we could use React to render the posts page:

```javascript
function HomePage(data) {

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

var htmlStructure = HomePage({
  posts: [] // an array of contents received from Sequelize
});

var html = render(htmlStructure);
```

**What sorcery is this?!??** We're straight up writing HTML inside our JavaScript?!

The sorcery is called [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) and it can be used to write code that looks like HTML, but will be transformed to an object structure.

Unfortunately, JSX cannot render the HTML's `<!doctype>` so if we will use it, we have to create a layout and dump the output of React's HTML in the layout.

It may sound a bit complicated, but it's not :) Let's look at the steps involved...

*Hint: remember what we said in class about hacking at something in a separate workspace to get comfortable with it*

  * We will be using [EJS](http://www.embeddedjs.com/) to render the shell of our HTML document:
     `npm install --save ejs`
  * At the top of your `server.js` after initializing the `app`, add `app.set('view engine', 'ejs')`.
  * In your workspace, create a directory called `views`.
  * In this directory, create a file called `layout.ejs` with the following content:
```html
<!doctype html>
<html>
    <head>
        <title>Reddit clone!</title>
    </head>
    <body>
        <div id="app"><%-content%></div>
    </body>
</html>
```
  * Notice this looks like standard HTML, except for the `<%-content%>` part?
  * In your server code, try this layout in the following way:
```javascript
app.get('/', function(request, response) {
  var html = '<h1>Hello World!</h1>';
  response.render('layout', {content: html});
});
```
  * Test your endpoint in a browser, and look at the source of the page. The `<%-content%>` part was replaced by the string passed in the `content` property of the `response.render` function

Cool. We now have a way to render a full HTML page, and we can put any content we want in the `div#app`. Where does this content come from? We can build the "main html" any way we want. Our suggestion is to get used to ReactJS, because we'll be using it on the front-end too!

All that JSX code above is actually real. You can write code like this, but if you try to run it directly, Node will tell you that there is a syntax error. That's because the code is not actual JavaScript, but an extension of it called JSX. JSX makes it easier to create such nested structures as an HTML document requires, but it has to be **transpiled** to "real" JavaScript. How does that work?

[Take a look at this GitHub repo](https://github.com/ziad-saab/serverside-jsx-demo) which contains the smallest possible code to try out JSX.
