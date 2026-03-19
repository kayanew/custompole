// loadComponent({
//     url: '/components/navbar.html',
//     placeholder: '#navbar-container', 
//     init: initModals
// });

export function loadComponent({url, placeholder, init}){
    const container = document.getElementById(placeholder);
    if(!container){
        console.error('Placeholder not found:', placeholder);
        return;
    }
    fetch(url)
    .then(res => res.text())
    .then(html =>{
        container.innerHTML = html;
        if(typeof init === 'function'){
            init();
        }
    }).catch(err =>console.error('Failed to load components:', url, err));
}