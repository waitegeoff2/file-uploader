const newFolderBtn = document.querySelector('.new-folder-btn')
const modal = document.querySelector('.modal')
const closeBtn = document.querySelector('.close-btn')


newFolderBtn.addEventListener('click', () => {
    modal.style.display = 'block';
})

closeBtn.onclick = function() {
    modal.style.display = "none";
}

//click outside modal, it closes
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


