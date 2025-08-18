const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require('../db/queries')

const emptyErr = "is required"
const lengthErr = "must be between 1 and 50 characters."
const emailErr = "must be formatted like an email."
const pwMatchErr = "Passwords do not match"

const validateUser = [
    body("fullname").trim()
    .notEmpty().withMessage(`Full name ${emptyErr}`)
    .isLength({ min: 1, max: 50 }).withMessage(`Full name ${lengthErr}`),
    body("username").trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Full name ${lengthErr}`)
    .isEmail().withMessage(`Email ${emailErr}`), 
    body('password')
    .notEmpty().withMessage(`Password ${emptyErr}`)
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('confirmpassword')
        .notEmpty().withMessage(`Confirm Password ${lengthErr}`)
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(`${pwMatchErr}`);
            }
            return true;
        }),
]

const addUser = [
validateUser,
async(req, res, next) => {
    //display errors if any
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        errors: errors.array(),
      });
    }

//if valid, put values into db
    try {
        console.log(req.body)
        const user = req.body;
        const fullName = req.body.fullname;
        const userName = req.body.username;
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await db.addUser(fullName, userName, hashedPassword);

        await db.addDefaultFolder();

        res.redirect('/');
    } catch(error){
        console.error(error);
        next(error);
    }
}
]

async function renderFilePage(req, res) {
    console.trace(req.session)
    const current = req.session.passport.user;
    console.log(current)
    const folders = await db.findFolders(current)

    console.trace(folders)

    res.render("file-page", {folders: folders})
}

async function addFolder(req, res) {
        const folderName = req.body.folderName;
        const user = req.body.userInfo;
        const userId = parseInt(user);

        await db.addFolder(folderName, userId);
        res.redirect('/file-page');
}

async function expandFolder(req, res) {
    const folderId = req.params.folderId;
    console.trace(folderId)
    //add db to look up FILES based on folder ID and 
    //add a DELETE BUTTON WITH THAT ID
    res.end()
    //res.render('folderDetails'{ folderId: folderId, files: files })
}

module.exports = {
    addUser,
    renderFilePage,
    addFolder, 
    expandFolder
}