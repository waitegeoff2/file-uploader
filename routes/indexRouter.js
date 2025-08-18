const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController")
const passport = require("passport");

//home page
indexRouter.get('/', (req, res) => res.render('index'))

//sign up form
indexRouter.get('/sign-up', (req, res) => res.render('sign-up-form'))
indexRouter.post('/sign-up', indexController.addUser)

//log in
indexRouter.get('/log-in', (req, res) => res.render('log-in-form'))
indexRouter.post(
      "/log-in",
  passport.authenticate("local", {
    successRedirect: "/file-page",
    failureRedirect: "/"
  })
);
//log out (passport adds a logout function to the req object)
indexRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//file management page
indexRouter.get('/file-page', indexController.renderFilePage)

//create folder 
//take user to new folder form, make a new form and tie it to that user's id
indexRouter.post('/folder', indexController.addFolder)
//THEN display it in the index (map same as messages)

//OR
//go to param URL with user's id for new form (maybe won't work with multiple)
//indexRouter.get('folder/:folderId', indexController.addFolder)
//that folder id is the USER ID and can add a folder to that guy's id


module.exports = indexRouter;