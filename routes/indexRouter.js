const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController")
const passport = require("passport");
const supabase = require('../config/supabase')
//multer
const multer = require('multer')
//multer and supabase storage settings
const storage = multer.memoryStorage();
//DISK STORAGE OPTION
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/tmp/my-uploads')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// })
const upload = multer({ storage: storage });

//home page (sign up page)
indexRouter.get('/', (req, res) => res.render('index'))
indexRouter.post('/', indexController.addUser)

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

//show folder details
indexRouter.get('/folder/:folderId', indexController.expandFolder)

//upload file
indexRouter.post('/upload', upload.single('file'), indexController.addFile) 

//delete folder
indexRouter.get('/delete/:folderId', indexController.deleteFolder)

//download file
indexRouter.get('/folder/file/:fileId', indexController.downloadFile)


module.exports = indexRouter;