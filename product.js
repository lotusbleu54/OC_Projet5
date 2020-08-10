var request = new XMLHttpRequest();
var position = window.location.href.indexOf('?');
var urlAPI = "http://localhost:3000/api/cameras";
/*localStorage.clear();*/

if(position!=-1)
{
    var endUrl = window.location.href.substr(position + 3);
    urlAPI = urlAPI+'/'+endUrl;
}

request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var Camera = JSON.parse(this.responseText);
            displayDetails(Camera);
    }
};

request.open("GET", urlAPI);
request.send();

function displayDetails(Camera) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("col-12", "col-lg-6", "mt-4", "mx-auto");
    document.getElementById("productContainer").appendChild(newDiv);

    let newDiv2 = document.createElement("div");
    newDiv2.classList.add("card", "border-primary", "shadow");
    newDiv.appendChild(newDiv2);
    
    let newImg = document.createElement("img");
    newImg.classList.add("card-img-top");
    newImg.src = Camera.imageUrl;
    newImg.setAttribute("alt", Camera.description);
    newDiv2.appendChild(newImg);
    
    let newDiv3 = document.createElement("div");
    newDiv3.classList.add("card-body");
    newDiv2.appendChild(newDiv3);

    let newH2 = document.createElement("h2");
    newH2.classList.add("card-title");
    newH2.textContent = Camera.name;
    newDiv3.appendChild(newH2);

    let newP = document.createElement("p");
    newP.classList.add("card-text");
    newP.textContent = "Description : " + Camera.description;
    newDiv3.appendChild(newP);

    let newP2 = document.createElement("p");
    newP2.classList.add("card-text");
    newP2.textContent = "Prix : " + Camera.price + " €";
    newDiv3.appendChild(newP2);

    let newDiv4 = document.createElement("div");
    newDiv4.classList.add("card-text");
    newDiv4.innerHTML = '<label for="lense-select">Type de lentille :  &nbsp;</label><select id="lense-select"></select>'; 
    newDiv3.appendChild(newDiv4);
    let lenses= Camera.lenses;
        for (let i = 0; i < lenses.length; i++) {
        let newOption = document.createElement("option");
        newOption.setAttribute("value", lenses[i]);
        newOption.textContent = lenses[i];
        let select=document.getElementById("lense-select");
        select.appendChild(newOption);
        }
    
    let newDiv5 = document.createElement("div");
    newDiv5.classList.add("card-text");
    newDiv5.innerHTML = '<label for="qty-select">Quantité :  &nbsp;</label><select id="qty-select"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select>'; 
    newDiv3.appendChild(newDiv5);

    let newA = document.createElement("a");
    newA.classList.add("btn", "btn-primary");
    var myUrl = 'basket.html';
    newA.setAttribute("href", myUrl);
    newA.setAttribute("id", "addBasket")
    newA.textContent = "Ajouter au panier";
    newDiv3.appendChild(newA);

    var addBasketElmt = document.getElementById('addBasket');

    addBasketElmt.addEventListener('click', function(event) {
        event.preventDefault();
        let qtyElmt = document.getElementById('qty-select');
        let lenseTypeElmt = document.getElementById('lense-select');

        let cameraToAdd = { //création d'un objet caméra à renvoyer dans le localStorage puis en POST en vue de la création d'un panier
        id: Camera._id,
        name: Camera.name,
        price: Camera.price,
        quantity: parseInt(qtyElmt.value), //méthode différente pour la quantité dont on cherche la valeur dans le formulaire
        imageUrl: Camera.imageUrl
        }
  
        let inBasket = localStorage.getItem('basket');
        
        if (inBasket) { //vérifie l'existence d'un panier, sinon le crée
            basket = JSON.parse(inBasket); //parse du JSON pour pouvoir accéder aux données
            let alreadyOrdered = 0;
            for (let i = 0; i < basket.length; i++) {
                if (basket[i].id === cameraToAdd.id) {
                    basket[i].quantity += cameraToAdd.quantity;
                    alreadyOrdered ++;
                }
            }
            if (alreadyOrdered===0) {
                basket.push(cameraToAdd); //ajoute le teddy ayant les propriétés énumérées plus haut
                localStorage.setItem('basket', JSON.stringify(basket));
                alert('Ajouté au panier !'); //prévient l'utilisateur du bon déroulement de l'action
            }
            else {
                localStorage.setItem('basket', JSON.stringify(basket));
                alert('Ajouté au panier !'); //prévient l'utilisateur du bon déroulement de l'action
            }
        } else {
            basket = []; //si inexistant, crée un panier sous forme de tableau (format attendu par l'API)
            basket.push(cameraToAdd); //ajoute le teddy au tableau
            localStorage.setItem('basket', JSON.stringify(basket)); //envoie les données obtenues dans le localStorage
            alert('Ajouté au panier !'); //prévient l'utilisateur du bon déroulement de l'action
        }
        
        inBasket = localStorage.getItem('basket');
        articlesInBasket(JSON.parse(inBasket));
      });
}




