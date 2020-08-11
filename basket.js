/*Déclaration générale de variables*/
let totalNumberOfArticles = 0;
let totalPrice = 0;
let divToFill = document.getElementById("basketContainer");

/*Fonction pour passer la commande lorsque le formulaire est rempli et valide*/
orderCamera = function (order) {
    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/api/cameras/order");
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function() {
        //status 201 car le serveur renvoie des infos
        if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
          var response = JSON.parse(request.responseText);
          localStorage.clear(); //On réinitialise le panier lorsque la commande se passe bien
          localStorage.setItem('orderId', JSON.stringify(response.orderId)); //On sauvegarde l'id pour l'afficher dans la page confirmation
          localStorage.setItem('contact', JSON.stringify(response.contact)); //On sauvegarde aussi les infos de contact
          localStorage.setItem('amount', totalPrice); //On sauvegarde enfin le prix total
          window.location.href = 'confirmation.html'; //Redirection vers la page confirmation
        }
    }
    request.send(JSON.stringify(order));
}

/* Fonction de validation des données du formulaire lorsque l'utilisateur clique sur "Finaliser ma commande*/
validationForm = function(event) {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const email = document.getElementById('email');

    //Vérifie que tous les champs sont valides
    if (firstName.checkValidity() && lastName.checkValidity() && address.checkValidity() && city.checkValidity() && email.checkValidity()) {
        event.preventDefault(); //Permet de gérer nous-mêmes la validation du formulaire

    /*Création des 2 listes à envoyer au serveur*/
        //La liste avec les Ids des produits commandés
        let products = [];
        for (i = 0; i < basket.length; i++) {
            products.push(basket[i].id)
        }
        //La liste contenant les infos récupérées dans le formulaire pour le contact
        let contact = { "firstName": firstName.value, "lastName": lastName.value, "address": address.value, "city": city.value, "email": email.value };
        //Appel de la fonction de commande
        orderCamera({"contact": contact, "products": products});
    }

    //Si le formulaire est invalide on n'envoie rien au serveur mais on affiche un message d'alerte
    else { 
        alert("Formulaire invalide");
    }
} 

/*Fonction de vidage du panier et de remplissage de la page lorsque le panier est vide*/
emptyBasket = function() {
    localStorage.clear();
    numberOfArticlesInBasket([]);
    divToFill.innerHTML = '<div class="row"><div class="col"><div class="jumbotron text-center"><h1 class="h4">Votre panier est tristement vide :(-</h2><a href="index.html" class="btn btn-primary">Trouver de l\'inspiration</a></div></div></div>';
}

/*S'il y a au moins un produit dans le panier, on remplit la page avec la liste des produits commandés*/
if (basket) {

    //Création des blocs
    let newDiv0 = document.createElement("div");
    newDiv0.classList.add("d-flex", "flex-wrap", "justify-content-between", "align-items-center", "p-2");
    divToFill.appendChild(newDiv0);
    
    let newH1 = document.createElement("h1");
    newH1.classList.add("h5","mt-2");
    newH1.textContent="Votre panier";
    newDiv0.appendChild(newH1);

    //Bouton "vider mon panier"
    let newButton0 = document.createElement("button");
    newButton0.textContent= "Vider mon panier";
    newButton0.classList.add("btn", "btn-light", "py-0", "deleteAll");
    newButton0.setAttribute("type", "button");
    newDiv0.appendChild(newButton0);

    //Trait de séparation
    let breakLine = document.createElement("hr");
    divToFill.appendChild(breakLine);
    
    //Création d'une ligne par type d'articles commandés
    for (let i = 0; i < basket.length; i++) {
        let newDiv = document.createElement("div");
        newDiv.classList.add("d-flex", "flex-wrap", "justify-content-between", "align-items-center", "p-2");
        divToFill.appendChild(newDiv);
    
        //Photo de l'appareil redimensionnée
        let newImg = document.createElement("img");
        newImg.src = basket[i].imageUrl;
        newImg.setAttribute("alt", basket[i].description);
        newImg.setAttribute("width", "100px");
        newImg.setAttribute("height", "75px");
        newDiv.appendChild(newImg);
    
        //Nom de l'appareil
        let newP = document.createElement("p");
        newP.textContent = basket[i].name;
        newP.classList.add("mb-0", "my-1");
        newDiv.appendChild(newP);
        
        //Quantité sélectionnée
        let newP2 = document.createElement("p");
        newP2.textContent = "Quantité: "+basket[i].quantity;
        newP2.classList.add("mb-0", "my-1");
        newDiv.appendChild(newP2);
        
        //Prix unitaire
        let newP3 = document.createElement("p");
        newP3.textContent = "Prix unitaire: "+basket[i].price+" €";
        newP3.classList.add("mb-0", "my-1");
        newDiv.appendChild(newP3);
        
        //Bouton supprimer
        let newButton = document.createElement("button");
        newButton.textContent= "Supprimer";
        newButton.classList.add("btn", "btn-light", "py-0", "deleteCamera");
        newButton.setAttribute("type", "button");
        newDiv.appendChild(newButton);
    }

    //Ajout récap avec nombre d'articles prix total
    let newDiv3 = document.createElement("div");
    newDiv3.innerHTML = '<hr><p>Total (<span id="articleNumber"></span> articles): <span id="totalPrice"></span> €</p>'; 
    divToFill.appendChild(newDiv3);
    for  (let i = 0; i < basket.length; i++) { //Parcours du panier pour faire la multiplication des quantités et des prix unitaires
        totalNumberOfArticles += basket[i].quantity;
        totalPrice += basket[i].quantity*basket[i].price;
    }
    document.getElementById("articleNumber").innerHTML = totalNumberOfArticles;
    document.getElementById("totalPrice").innerHTML = totalPrice;

    //Nouveau bloc pour contenir la validation de commande
    let newDiv4 = document.createElement("div");
    newDiv4.classList.add("d-flex", "flex-wrap", "justify-content-center", "align-items-center", "p-2");
    divToFill.appendChild(newDiv4);

    //Lien vers la page d'accueil (bouton poursuivre achats)
    let newA = document.createElement("a");
    newA.textContent= "Poursuivre mes achats";
    newA.classList.add("btn", "btn-secondary", "mx-2", "my-2");
    newA.setAttribute("href", "index.html");
    newDiv4.appendChild(newA);

    //Bouton permettant de faire apparaître le formulaire
    let newButton2 = document.createElement("button");
    newButton2.textContent= "Valider mon panier";
    newButton2.classList.add("btn", "btn-primary", "mx-2", "my-2", "appearForm");
    newButton2.setAttribute("type", "button");
    newDiv4.appendChild(newButton2);

    //Création du formulaire
    let newForm = document.createElement("form");
    newForm.classList.add("p-2", "formulaire");
    newForm.innerHTML = '<div class="form-group mt-3"><h3 class="h4">Veuillez remplir ce formulaire</h3></div><div class="form-group mt-3"><label for="firstName">Prénom :</label><input type="text" maxlength="30" class="form-control" id="firstName" required></div><div class="form-group mt-3"><label for="lastName">Nom :</label><input type="text" class="form-control" maxlength="30" id="lastName" required></div><div class="form-group mt-3"><label for="address">Adresse :</label><input type="text" class="form-control" id="address" required></div><div class="form-group mt-3"><label for="city">Ville :</label><input type="text" class="form-control" id="city" required></div><div class="form-group mt-3"><label for="email">Adresse e-mail :</label><input type="email" class="form-control" id="email" required></div><button type="submit" class="btn btn-primary mx-auto" id="finalValidation">Finaliser ma commande</button>';
    newForm.style = "display:none"; //Le formulaire reste caché tant qu'on ne clique pas sur "Valider mon panier"
    divToFill.appendChild(newForm);

    //Fonction permettant de vider le panier lorsque l'utilisateur clique sur "Vider mon panier"
    document.querySelector(".deleteAll").addEventListener('click', emptyBasket);
    
    //Fonction permettant d'écouter le clic sur "Supprimer" pour n'importe quel élément du panier
    let boutonsSupp = document.getElementsByClassName("deleteCamera");
    for (let i = 0; i < boutonsSupp.length; i++) {
        boutonsSupp[i].addEventListener('click', function() {
            if (boutonsSupp.length==1) {
                emptyBasket(); //S'il n'y a qu'un article dans le panier, on applique la même fonction que si on vide tout le panier
            }
            else {
                basket.splice(i,1); //On supprime l'élément de la liste grâce à la fonction splice
                localStorage.setItem('basket', JSON.stringify(basket)); //On stocke le nouveau panier
                document.location.reload(true); //On recharge la page pour prise en compte du changement
            }
        })
    }

    //Faire apparaître le formulaire en cas de clic sur "Valider mon panier"
    document.querySelector(".appearForm").addEventListener('click', function() {
        document.querySelector(".formulaire").setAttribute("style", "display:block");
        })
    
    //Appel à la fonction validation formulaire en cas de clic sur "Finaliser ma commande"
    document.getElementById("finalValidation").addEventListener('click', validationForm);
}

//S'il n'y a rien dans le panier, on affiche la page "vide"
else {
    emptyBasket();
}