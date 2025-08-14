// npm install express express-session pg passport passport-local ejs dotenv express-validator
const path = require("node:path");
const pool = require("./db/pool")
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
const indexRouter = require("./routes/indexRouter")
require('dotenv').config();

//this allows the app to parse form data into req.
app.use(express.urlencoded({ extended: true }));

//static assets path (CSS, etc.)
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

//session/passport
app.use(session({ secret: "dog", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//view library
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//PASSPORT PASSWORD/COOKIE FUNCTIONS (UPDATE)
//match un and pw
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);

    if (!user) {
        return done(null, false, { message: "Incorrect username" });
    }
    if (!match) {
        // passwords do not match!
        console.log("wrong password!")
        return done(null, false, { message: "Incorrect password" })
    }
    //if successful, return the user
        console.log('logged in!')
        console.log(user)
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);
//function TWO and THREE:
//allowing users to log in and stay logged in as they move around
//creates a cookie called connect.sid that is stored in the user's browser 
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

//CURRENTUSER middleware: to allow access to currentUser in views to render the current user without having to pass it in
// insert this code somewhere between where you instantiate the passport middleware 
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//router
app.use("/", indexRouter);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});