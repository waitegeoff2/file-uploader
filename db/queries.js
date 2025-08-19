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
            name: `${userId.fullname}'s folder.`
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

async function addFile(folderId, name, size) {
    await prisma.file.create({
        data: {
            folderId: folderId,
            name: name,
            size: size
        }
    })
}

async function findFiles(folderId) {
    const files = await prisma.folder.findMany({
        where: {
            id: folderId,
            files: {
                name: true,
                fileSize: true,
                uploadTime: true
            }
        }
    })

    return files;
}

module.exports = {
    addUser,
    findFolders,
    addDefaultFolder,
    addFolder,
    addFile,
    findFiles
}