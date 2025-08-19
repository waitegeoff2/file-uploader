const newFolderBtn = document.querySelector('.new-folder-btn')
const newFileBtn = document.querySelector('.new-file-btn')
const fileModal = document.querySelector('.file-modal')
const modal = document.querySelector('.modal')
const fileClose = document.querySelector('.file-close-btn')
const closeBtn = document.querySelector('.close-btn')


newFolderBtn.addEventListener('click', () => {
    modal.style.display = 'block';
})

newFileBtn.addEventListener('click', () => {
    fileModal.style.display = 'block';
})

closeBtn.onclick = function() {
    modal.style.display = "none";
}

fileClose.onclick = function() {
    fileModal.style.display = "none";
}

//click outside modal, it closes
window.onclick = function(event) {
    if (event.target == (modal)) {
        modal.style.display = "none"
    }
}


