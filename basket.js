let divToFill = document.getElementById("basketContainer");
const emptyBasket = function() {
    divToFill.innerHTML = '<div class="row"><div class="col"><div class="jumbotron text-center"><h1 class="h4">Votre panier est tristement vide :(-</h2><a href="index.html" class="btn btn-primary">Trouver de l\'inspiration</a></div></div></div>';
}

if (basket) {
    let newDiv0 = document.createElement("div");
    newDiv0.classList.add("d-flex", "flex-wrap", "justify-content-between", "align-items-center", "p-2");
    divToFill.appendChild(newDiv0);
    
    let newH1 = document.createElement("h1");
    newH1.classList.add("h5","mt-2");
    newH1.textContent="Votre panier";
    newDiv0.appendChild(newH1);

    let newButton0 = document.createElement("button");
    newButton0.textContent= "Vider mon panier";
    newButton0.classList.add("btn", "btn-light", "py-0", "deleteAll");
    newButton0.setAttribute("type", "button");
    newDiv0.appendChild(newButton0);

    let breakLine = document.createElement("hr");
    divToFill.appendChild(breakLine);
    
    for (let i = 0; i < basket.length; i++) {

    let newDiv = document.createElement("div");
    newDiv.classList.add("d-flex", "flex-wrap", "justify-content-between", "align-items-center", "p-2");
    divToFill.appendChild(newDiv);

    let newImg = document.createElement("img");
    newImg.src = basket[i].imageUrl;
    newImg.setAttribute("alt", basket[i].description);
    newImg.setAttribute("width", "100px");
    newImg.setAttribute("height", "75px");
    newDiv.appendChild(newImg);

    let newP = document.createElement("p");
    newP.textContent = basket[i].name;
    newP.classList.add("mb-0", "my-1");
    newDiv.appendChild(newP);
    
    let newP2 = document.createElement("p");
    newP2.textContent = "Quantité: "+basket[i].quantity;
    newP2.classList.add("mb-0", "my-1");
    newDiv.appendChild(newP2);
    
    let newP3 = document.createElement("p");
    newP3.textContent = "Prix unitaire: "+basket[i].price+" €";
    newP3.classList.add("mb-0", "my-1");
    newDiv.appendChild(newP3);
    
    let newButton = document.createElement("button");
    newButton.textContent= "Supprimer";
    newButton.classList.add("btn", "btn-light", "py-0", "deleteCamera");
    newButton.setAttribute("type", "button");
    newDiv.appendChild(newButton);
    
    }

    let newDiv3 = document.createElement("div");
    newDiv3.innerHTML = '<hr><p>Total (<span id="articleNumber"></span> articles): <span id="totalPrice"></span> €</p>'; 
    divToFill.appendChild(newDiv3);

    let totalNumberOfArticles = 0;
    let totalPrice = 0;
    for  (let i = 0; i < basket.length; i++) {
        totalNumberOfArticles += basket[i].quantity;
        totalPrice += basket[i].quantity*basket[i].price;
    }
    document.getElementById("articleNumber").innerHTML = totalNumberOfArticles;
    document.getElementById("totalPrice").innerHTML = totalPrice;

    let newDiv4 = document.createElement("div");
    newDiv4.classList.add("d-flex", "flex-wrap", "justify-content-center", "align-items-center", "p-2");
    divToFill.appendChild(newDiv4);

    let newA = document.createElement("a");
    newA.textContent= "Poursuivre mes achats";
    newA.classList.add("btn", "btn-secondary", "mx-2", "my-1");
    newA.setAttribute("href", "index.html");
    newDiv4.appendChild(newA);

    let newButton2 = document.createElement("button");
    newButton2.textContent= "Valider mon panier";
    newButton2.classList.add("btn", "btn-primary", "mx-2", "my-1", "appearForm");
    newButton2.setAttribute("type", "button");
    newDiv4.appendChild(newButton2);

}
else {
    emptyBasket();
}

document.querySelector(".deleteAll").addEventListener('click', function() {
localStorage.clear();
articlesInBasket([]);
emptyBasket();
})

var boutonsSupp = document.getElementsByClassName("deleteCamera");
console.log(boutonsSupp);
for (let i = 0; i < boutonsSupp.length; i++) {
boutonsSupp[i].addEventListener('click', function() {
    if (boutonsSupp.length==1) {
        localStorage.clear();
        articlesInBasket([]);
        emptyBasket();
    }
    else {
        basket.splice(i,1);
        console.log(basket);
        localStorage.setItem('basket', JSON.stringify(basket));
        document.location.reload(true);
    }
    })
}