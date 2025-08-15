// npm install express express-session pg passport passport-local ejs dotenv express-validator
//REQUIRE brings  bring in external JavaScript files (modules) and make their exported functionalities available within the current file or scope. 
const path = require("node:path");
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const indexRouter = require("./routes/indexRouter")
require('dotenv').config();
require('./config/passport');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./db/prisma')

//multer
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

//multer middleware for single upload
app.post('/upload', upload.single('file'), (req,res) => {
    console.log(req.file);
    res.send(req.file);
})


//this allows the app to parse form data into req.
app.use(express.urlencoded({ extended: true }));

//static assets path (CSS, etc.)
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

//session/passport
app.use(
  session({
     cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//view library
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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