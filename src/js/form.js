const form = document.getElementById('myForm');
const modal = document.getElementById('successModal');
const closeModalButton = document.getElementById('closeModal');

form.addEventListener('submit', function(event) {
    event.preventDefault(); 
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active'); 
    }, 0);
    
    form.reset();
});

closeModalButton.addEventListener('click', function() {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); 
});

modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
});