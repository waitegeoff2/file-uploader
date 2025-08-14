const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController")
const passport = require("passport");

//home page
indexRouter.get('/', (req, res) => res.render('index'))

//sign up form
indexRouter.get('/sign-up', (req, res) => res.render('sign-up-form'))
// indexRouter.post('/sign-up', indexController.addUser)

//log in
// indexRouter.get('/log-in', (req, res) => res.render('log-in-form'))
// indexRouter.post(
//       "/log-in",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/"
//   })
// );
// //log out (passport adds a logout function to the req object)
// indexRouter.get("/log-out", (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// });

module.exports = indexRouter;