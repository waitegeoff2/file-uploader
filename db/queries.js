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

async function findFolders(userId) {
    const folders = await prisma.folder.findMany({
        where: {
            userId: userId,
        }
    })

    return folders;
}

async function addDefaultFolder() {
    const userId = await prisma.user.findFirst({
        orderBy: {
            id: 'desc',
        }
    })

    await prisma.folder.create({
        data: {
            userId: userId.id,
            name: `Default folder for ${userId.fullname}`
        }
    })

    console.trace(userId.id)
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
    findFolders,
    addDefaultFolder,
    addFolder
}