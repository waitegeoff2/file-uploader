const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require('../db/queries')
const supabase = require('../config/supabase');
const { name } = require("ejs");

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

function createUrlFriendlyFilename(filename) {
  // 1. Remove leading/trailing whitespace
  let urlFriendly = filename.trim();

  // 2. Replace spaces with hyphens
  urlFriendly = urlFriendly.replace(/\s+/g, '-');

  // 3. Convert to lowercase
  urlFriendly = urlFriendly.toLowerCase();

  // 4. Remove invalid characters (keep alphanumeric and hyphens)
  urlFriendly = urlFriendly.replace(/[^a-z0-9-]/g, '');

  return urlFriendly;
}

async function addFile (req, res) {
    if(!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // file details
    const id = parseInt(req.body.folderid);
    //this gets rid of characters that don't work in URLs
    const name = createUrlFriendlyFilename(req.file.originalname)
    //buffer allows you to access the file
    const buffer = req.file.buffer;
    const type = req.file.mimetype;
    const size = req.file.size;
    const path = `${Date.now()}-${name}`

    const bucketName = 'file-uploader-2';

    try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, buffer, { contentType: type });

    if (error) {
      throw error;
    }
    } catch (error) {
        console.error('Error during file upload process:', error);
        res.status(500).send('An error occurred.');
    }

    //retrieve supabase url
    const publicUrl = supabase.storage.from(bucketName).getPublicUrl(path).data.publicUrl;

    //add to database
    try {
        await db.addFile(id, name, size, path, type, publicUrl)
    } catch(err) {
        console.error("Failed to upload: ", err);
    }
    
    res.redirect(`folder/${id}`);
}

async function deleteFolder(req, res) {
    
        const folderId = parseInt(req.params.folderId);
        console.log(folderId)
        await db.deleteFolder(folderId);
        res.redirect('/file-page')
}

async function downloadFile(req, res) {
    // PROBABLY A BETTER WAY TO DO THIS
    const fileId = parseInt(req.params.fileId);

    const file = await db.getFile(fileId)
    console.log(file.filepath)
    const bucketName = 'file-uploader-2';

    const publicUrl = supabase.storage.from(bucketName).getPublicUrl(file.filepath).data.publicUrl;
    console.log(publicUrl)

    res.redirect(publicUrl)

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