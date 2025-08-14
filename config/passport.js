const passport = require("passport");
const prisma = require("../db/prisma");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");

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