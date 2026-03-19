const featuredItems = [
    {id: 1,name: "Demo Dog Food", price: 2200, image: "assets/images/dogProducts/dog-chain.png"},
    {id: 2,name: "Demo Puppy Collar", price: 3200, image: "assets/images/dogProducts/collar.png"},
    {id: 3,name: "Drools Balls", price: 2200, image: "assets/images/dogProducts/play-balls.png"},
    {id: 4,name: "Fur scrubber", price: 1200, image: "assets/images/dogProducts/cleaner.png"},
    {id: 5,name: "Fur scrubber", price: 1200, image: "assets/images/dogProducts/cleaner.png"} 
];

const dfeaturedItems = [
    {id: 6,name: "Monge Adult Food", price: 2200, image: "assets/images/dogProducts/biscuit.png"},
    {id: 7, name: "Monge Puppy Dog", price: 3200, image: "assets/images/dogProducts/mattress.png"},
    {id: 8,name: "Drools Balls", price: 2200, image: "assets/images/dogProducts/play-balls.png"},
    {id: 9,name: "Fur scrubber", price: 1200, image: "assets/images/dogProducts/bowl.png"},
    {id: 10,name: "Pedigree Biscrok", price: 2010, image: "assets/images/dogProducts/cleaner.png"}
];

const cfeaturedItems = [
    {id: 11,name: "Monge Adult Dog Food", price: 2200, image: "assets/images/catProducts/cat-wear.png"},
    {id: 12,name: "Monge Puppy Dog", price: 3200, image: "assets/images/catProducts/fish-doll.png"},
    {id: 13, name: "Drools Balls", price: 2200, image: "assets/images/catProducts/frog-mask.png"},
    {id: 14,name: "Fur scrubber", price: 1200, image: "assets/images/dogProducts/cleaner.png"},
    {id: 15,name: "Pedigree Biscrok", price: 2010, image: "assets/images/dogProducts/play-balls.png"}
];

function renderProducts(containerId, classOfDiv, productsArray){
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    productsArray.forEach((product) =>{
        const div = document.createElement("div");
        div.className = classOfDiv;
        div.innerHTML = `
        <div class="${classOfDiv}-img">
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="${classOfDiv}-details">
            <h4><a href="#main">${product.name}</a></h4>
            <div class="price-action">
              <p id="price">Rs ${product.price}</p>
            <button class="view-btn" data-id="${product.id}"><b>View Product</b></ion-icon></button>
            </div>
          </div>
          `;
          container.appendChild(div);
    });
}

renderProducts("featured-items","fitem", featuredItems);
renderProducts("dfeatured-items","dfitem",dfeaturedItems);
renderProducts("cfeatured-items","cfitem", cfeaturedItems );