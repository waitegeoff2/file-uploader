const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require('../db/queries')
const supabase = require('../config/supabase')

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
      return res.status(400).render("index", {
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

        res.redirect('/log-in');
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
    const files = await db.findFiles(folderId)
    const returnedFiles = files[0];
    
    //add a DELETE BUTTON WITH THAT ID
    res.render('folder-details', { returnedFiles: returnedFiles, folderId: folderId })
}

function removeAllSpaces(str) {
  return str.replace(/\s/g, '');
}

async function addFile (req, res) {
    if(!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log(req.file);
    console.log(req.body.folderid);
    // file details
    const id = parseInt(req.body.folderid);
    const name = encodeURIComponent(req.file.originalname);
    console.log(name)
    //buffer allows you to access the file
    const buffer = req.file.buffer;
    const type = req.file.mimetype;
    const filename = req.file.filename;
    const size = req.file.size;
    const path = `${name}`

    const bucketName = 'file-uploader-2';

    try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, buffer);

    if (error) {
      throw error;
    }
    res.send('file uploaded')
    } catch (error) {
        console.error('Error during file upload process:', error);
        res.status(500).send('An error occurred.');
    }

    // const publicURL 

    //FIRST THING (do this and figure out the downloads)
    //GET THE URL FROM SUPABASE
    //        const supabaseUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/user-files-storify/${uploadPath}`;

    // await db.addFile(id, name, size, path, type, ADD URL(to db too))

    
    // res.redirect(`folder/${id}`)
    //FIX FILE NAMES ON PAGE
}

async function deleteFolder(req, res) {
    
        const folderId = parseInt(req.params.folderId);
        console.log(folderId)
        await db.deleteFolder(folderId);
        res.redirect('/file-page')
}

async function downloadFile(req, res) {
    const fileId = parseInt(req.params.fileId);
    const file = await db.getFile(fileId)
    console.trace(file)
    res.download(file.filepath);
}

module.exports = {
    addUser,
    renderFilePage,
    addFolder, 
    addFile,
    expandFolder, 
    deleteFolder,
    downloadFile
}