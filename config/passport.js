//putting all the passport stuff here and then making it available in the app
const passport = require("passport");
//import your prisma client into here
const prisma = require("../db/prisma");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");

//PASSPORT PASSWORD/COOKIE FUNCTIONS (UPDATE)
//passport middleware - match un and pw
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
        //find user details
        const user = await prisma.user.findFirst({
        where: {
            username: username,
        },
        });
        console.log(user)
        //if user not in database
        if (!user) {
            console.log('no user');
            return done(null, false, { message: "Incorrect username" });
        }  
        //define match 
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
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
    const user = await prisma.user.findFirst({
    where: {
        id: id,
    },
    });
    done(null, user);
  } catch(err) {
    done(err);
  }
});