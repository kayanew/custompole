const accordions = document.querySelectorAll(".accordion");
accordions.forEach(accordion => {
    accordion.addEventListener('click', ()=>{
        accordion.classList.toggle('active');
        const panel = accordion.nextElementSibling;
        const showArrow = accordion.firstElementChild;
        if(panel.style.display === "block"){
            panel.style.display = "none";
            showArrow.style.display = "block";
        }
        else{
            panel.style.display = "block";
            showArrow.style.display = "none";
        }
    })
});