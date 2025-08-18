const prisma = require('./prisma');

async function addUser(fullName, userName, password) {
    await prisma.user.create({
        data: {
            fullname: fullName,
            username: userName,
            password: password
        }
    })
}

async function addFolder(folderName, user) {
    await prisma.folder.create({
        data: {
            userId: user,
            name: folderName
        }
    })
}

module.exports = {
    addUser,
    addFolder
}