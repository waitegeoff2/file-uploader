const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController")
const passport = require("passport");
//multer
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

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
indexRouter.post('/upload', upload.single('file'), async (req,res) => {
    console.trace(req.file);
    console.trace(req.body.folderid);
    const name = req.file.fieldname;
    const type = req.file.mimetype;
    const filename = req.file.filename;
    const size = req.file.size;
    const path = req.file.path;
    //add to db
    // await db.addFile()
    res.send(req.file);
})

//add file
// indexRouter.post('/upload', indexController.addFile)

//delete folder
//indexRouter.get('/folder/delete/:folderId', indexController.deleteFolder)

//OR
//go to param URL with user's id for new form (maybe won't work with multiple)
//indexRouter.get('folder/:folderId', indexController.addFolder)
//that folder id is the USER ID and can add a folder to that guy's id


module.exports = indexRouter;