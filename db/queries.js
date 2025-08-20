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

async function addFile(folderId, name, size, path, type) {
    await prisma.file.create({
        data: {
            folderId: folderId,
            name: name,
            fileSize: size,
            filepath: path,
            filetype: type
            
        }
    })
}

async function findFiles(folderId) {
    const foldId = parseInt(folderId)
    const files = await prisma.folder.findMany({
        where: {
            id: foldId,
        },
        select: {
            files: {
                select: {
                    id: true,
                    name: true,
                    fileSize: true,
                    uploadTime: true
                }
            }
        }
    })

    return files;
}

async function deleteFolder(folderId) {
    await prisma.folder.delete({
        where: {
            id: folderId,
        }
    })
}

module.exports = {
    addUser,
    findFolders,
    addDefaultFolder,
    addFolder,
    addFile,
    findFiles,
    deleteFolder
}