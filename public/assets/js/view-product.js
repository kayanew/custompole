document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', ()=>{
        const id = button.getAttribute('data-id'); 
        console.log('View button clicked for ID:', id);
        window.location.href = '../public/pages/product-details.php?id=' + id;
    });
});

})
