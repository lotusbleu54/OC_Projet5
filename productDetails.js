/* Paramètres pour détecter l'url courante et faire la requête correspondant au bon appareil photo */

let urlAPI = "http://localhost:3000/api/cameras";
//Permet d'isoler l'Id du reste de la chaîne afin de charger les données correspondant au bon appareil photo
let position = window.location.href.indexOf('?');
if(position!=-1) {
    let cameraId = window.location.href.substr(position + 3); //Id après les 3 caractères ?Id
    urlAPI = urlAPI+'/'+cameraId;
}

/*Requête au serveur*/

let request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        let Camera = JSON.parse(this.responseText);
        displayDetails(Camera); //Fonction détaillée ci-dessous
    }
}
request.open("GET", urlAPI);
request.send();

/*Fonction de génération de la page et de gestion du clic sur "commander" */

function displayDetails(Camera) {

/*Etape 1 : Création de la structure html*/

    let newDiv = document.createElement("div");
    newDiv.classList.add("col-12", "col-lg-6", "mt-4", "mx-auto");
    document.getElementById("productContainer").appendChild(newDiv);

    let newDiv2 = document.createElement("div");
    newDiv2.classList.add("card", "border-primary", "shadow");
    newDiv.appendChild(newDiv2);
    
    //Image de l'appareil photo
    let newImg = document.createElement("img");
    newImg.classList.add("card-img-top");
    newImg.src = Camera.imageUrl;
    newImg.setAttribute("alt", Camera.description);
    newDiv2.appendChild(newImg);
    
    let newDiv3 = document.createElement("div");
    newDiv3.classList.add("card-body");
    newDiv2.appendChild(newDiv3);

    //Nom de la caméra
    let newH2 = document.createElement("h2");
    newH2.classList.add("card-title");
    newH2.textContent = Camera.name;
    newDiv3.appendChild(newH2);

    //Description
    let newP = document.createElement("p");
    newP.classList.add("card-text");
    newP.textContent = "Description : " + Camera.description;
    newDiv3.appendChild(newP);

    //Prix
    let newP2 = document.createElement("p");
    newP2.classList.add("card-text");
    newP2.textContent = "Prix : " + parseInt(Camera.price/100) + " €";
    newDiv3.appendChild(newP2);

    //Menu déroulant avec choix lentilles
    let newDiv4 = document.createElement("div");
    newDiv4.classList.add("card-text");
    newDiv4.innerHTML = '<label for="lense-select">Type de lentille :  &nbsp;</label><select id="lense-select"></select>'; 
    newDiv3.appendChild(newDiv4);
    let lenses= Camera.lenses;
        //Nombre d'éléments dans le menu déroulant fonction du nombre de lentilles dispos pour l'appareil sélectionné
        for (let i = 0; i < lenses.length; i++) {
        let newOption = document.createElement("option");
        newOption.setAttribute("value", lenses[i]);
        newOption.textContent = lenses[i];
        let select=document.getElementById("lense-select");
        select.appendChild(newOption);
        }
    
    //Menu déroulant avec quantités choisies (entre 1 et 10)
    let newDiv5 = document.createElement("div");
    newDiv5.classList.add("card-text");
    newDiv5.innerHTML = '<label for="qty-select">Quantité :  &nbsp;</label><select id="qty-select"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select>'; 
    newDiv3.appendChild(newDiv5);
    
    //Bouton commander
    let newButton = document.createElement("button");
    newButton.classList.add("btn", "btn-primary", "mx-2", "my-2");
    newButton.setAttribute("id", "addBasket")
    newButton.textContent = "Ajouter au panier";
    newDiv3.appendChild(newButton);

    //Renvoi vers la page d'accueil
    let newA = document.createElement("a");
    newA.textContent= "Poursuivre mes achats";
    newA.classList.add("btn", "btn-secondary", "mx-2", "my-2");
    newA.setAttribute("href", "index.html");
    newDiv3.appendChild(newA);

/*Etape 2: Actions à réaliser en cas de commande*/
    let addBasketElmt = document.getElementById('addBasket');
    addBasketElmt.addEventListener('click', function() {
        
        //On récupère la quantité d'appareils photos sélectionnés (transformation string vers nombre entier)
        let qtyElmt = parseInt(document.getElementById('qty-select').value);

        //Création d'un objet caméra à renvoyer dans le localStorage puis en POST en vue de la création d'un panier
        let cameraToAdd = {
            id: Camera._id,
            name: Camera.name,
            price: Camera.price,
            quantity: qtyElmt,
            imageUrl: Camera.imageUrl
        }
        
        let alreadyInBasket = localStorage.getItem('basket');
        
        if (alreadyInBasket) { //vérifie l'existence d'un panier, sinon le crée
            basket = JSON.parse(alreadyInBasket); //parse du JSON pour pouvoir accéder aux données

            //On teste si le produit sélectionné est déjà dans le panier. S'il y est déjà, on ajoute simplement la nouvelle quantité
            let alreadyOrdered = false;
            for (let i = 0; i < basket.length; i++) {
                if (basket[i].id === cameraToAdd.id) {
                    alreadyOrdered = true;
                    if ((cameraToAdd.quantity+basket[i].quantity)>10) {
                        alert('La quantité maximale totale pour cet article est de 10');
                    }
                    else { //Si le produit est déjà dans le panier, il suffit de stocker en mémoire la nouvelle quantité
                        basket[i].quantity += cameraToAdd.quantity;
                        localStorage.setItem('basket', JSON.stringify(basket));
                        alert('Ajouté au panier !');
                    }
                }
            }

            //Si le produit n'est pas déjà dans le panier on l'ajoute à la fin du panier
            if (!alreadyOrdered) {
                basket.push(cameraToAdd);
                localStorage.setItem('basket', JSON.stringify(basket)); //Mise à jour du panier en mémoire
                alert('Ajouté au panier !'); //prévient l'utilisateur du bon déroulement de l'action
            }

        }

        //Si panier inexistant, crée un panier sous forme de tableau (format attendu par l'API)
        else {
            basket = [];
            basket.push(cameraToAdd); //ajoute l'appareil au tableau
            localStorage.setItem('basket', JSON.stringify(basket)); //création du panier dans le localStorage
            alert('Ajouté au panier !');
        }
        
        /*Appel de la fonction de mise à jour du nombre d'articles dans le panier 
        pour la mise à jour de l'affichage du chiffre à côté de l'élément "mon panier"*/
        alreadyInBasket = localStorage.getItem('basket');
        numberOfArticlesInBasket(JSON.parse(alreadyInBasket));
      });
}