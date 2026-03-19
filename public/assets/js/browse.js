const productItems = [
    {name: "Monge Adult Dog Food", price: 2200, image: "../assets/images/catProducts/cat-wear.png", wishlist: false},
    {name: "Monge Puppy Dog", price: 3200, image: "../assets/images/catProducts/fish-doll.png", wishlist: false},
    {name: "Drools Balls", price: 2200, image: "../assets/images/catProducts/frog-mask.png", wishlist: false},
    {name: "Fur scrubber", price: 1200, image: "../assets/images/dogProducts/cleaner.png", wishlist: false},
    {name: "Pedigree Biscrok", price: 2010, image: "../assets/images/dogProducts/play-balls.png", wishlist: false},
     {name: "Monge Adult Food", price: 2200, image: "../assets/images/dogProducts/biscuit.png", wishlist: false},
    {name: "Monge Puppy Dog", price: 3200, image: "../assets/images/dogProducts/mattress.png", wishlist: false},
    {name: "Drools Balls", price: 2200, image: "../assets/images/dogProducts/play-balls.png", wishlist: false},
    {name: "Fur scrubber", price: 1200, image: "../assets/images/dogProducts/bowl.png", wishlist: false},
    {name: "Pedigree Biscrok", price: 2010, image: "../assets/images/dogProducts/cleaner.png", wishlist: false}
];

renderProducts("product-items", "pitem", productItems);

const productCategory = document.querySelectorAll('.catg-btn');
productCategory.forEach(element => {
    element.addEventListener('click', ()=>{
      productCategory.forEach(btn =>{
        btn.classList.remove('active');
      })
      element.classList.add('active');
    })
});