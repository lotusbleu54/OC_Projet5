let divToFill = document.getElementById("basketContainer");
let totalPrice;
let totalNumberOfArticles;

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

/*Fonction de mise à jour du récapitulatif commande en bas de page*/
updateTotal = function() {
    totalNumberOfArticles = 0;
    totalPrice = 0;
    for  (let i = 0; i < basket.length; i++) { //Parcours du panier pour faire la multiplication des quantités et des prix unitaires
        totalNumberOfArticles += basket[i].quantity;
        totalPrice += basket[i].quantity*basket[i].price;
    }
    document.getElementById("articleNumber").innerHTML = totalNumberOfArticles;
    document.getElementById("totalPrice").innerHTML = totalPrice;
}

/*Fonction de vidage du panier et de remplissage de la page lorsque le panier est vide*/
emptyBasket = function() {
    localStorage.clear();
    numberOfArticlesInBasket([]);
    divToFill.innerHTML = '<div class="row"><div class="col"><div class="jumbotron text-center"><h1 class="h4">Votre panier est tristement vide :(-</h2><a href="index.html" class="btn btn-primary">Trouver de l\'inspiration</a></div></div></div>';
}

/*S'il y a au moins un produit dans le panier, on remplit la page avec la liste des produits commandés*/
if (basket) {

    //Création d'une table
    let newTable = document.createElement("Table");
    newTable.classList.add("table", "table-striped");
    divToFill.appendChild(newTable);
    
    //En-tête de la table
    let newThead = document.createElement("thead");
    newTable.appendChild(newThead);
    let newTr = document.createElement("tr");
    newThead.appendChild(newTr);
    let newTh = document.createElement("th");
    newTh.setAttribute("colspan",5);
    newTh.textContent="Votre panier";
    newTr.appendChild(newTh);

    //Création du corps de la table
    let newTbody = document.createElement("tbody");
    newTable.appendChild(newTbody);

    //Création d'une ligne par type d'articles commandés
    for (let i = 0; i < basket.length; i++) {
        let newTr = document.createElement("tr");
        newTbody.appendChild(newTr);

        //Photo de l'appareil redimensionnée
        let newTd = document.createElement("td");
        newTr.appendChild(newTd);
        let newImg = document.createElement("img");
        newImg.src = basket[i].imageUrl;
        newImg.setAttribute("alt", basket[i].description);
        newImg.setAttribute("width", "130px");
        newImg.setAttribute("height", "90px");
        newTd.appendChild(newImg);
    
        //Nom de l'appareil
        let newTd2 = document.createElement("td");
        newTd2.textContent = basket[i].name;
        newTd2.classList.add("align-middle");
        newTr.appendChild(newTd2);
        
        //Quantité sélectionnée
        let newTd3 = document.createElement("td");
        newTd3.classList.add("align-middle");
        newTr.appendChild(newTd3);
        let newSpan = document.createElement("span");
        newSpan.innerHTML = '<label class="mb-0" for="qty-select">Quantité :  &nbsp;</label><select class="qty-select"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select>'; 
        let options=newSpan.getElementsByTagName("option");
        options[(basket[i].quantity)-1].setAttribute("selected",true);
        newTd3.appendChild(newSpan);
        
        //Prix unitaire
        let newTd4 = document.createElement("td");
        newTd4.textContent = "Prix unitaire: "+basket[i].price+" €";
        newTd4.classList.add("align-middle");
        newTr.appendChild(newTd4);
        
        //Bouton supprimer
        let newTd5 = document.createElement("td");
        newTd5.classList.add("align-middle");
        newTr.appendChild(newTd5);
        let newButton = document.createElement("button");
        newButton.textContent= "Supprimer";
        newButton.classList.add("btn", "btn-light", "py-0", "deleteCamera");
        newButton.setAttribute("type", "button");
        newTd5.appendChild(newButton);
    }

    //Ajout récap avec nombre d'articles prix total (en pied de tableau)
    let newTfoot = document.createElement("tfoot");
    newTable.appendChild(newTfoot);
    let newTr3 = document.createElement("tr");
    newTfoot.appendChild(newTr3);
    let newTh2 = document.createElement("th");
    newTh2.setAttribute("colspan",5);
    newTh2.innerHTML='Total (<span id="articleNumber"></span> articles): <span id="totalPrice"></span> €';
    newTr3.appendChild(newTh2);
    updateTotal();


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
    newForm.innerHTML = '<div class="form-group mt-3"><h3 class="h4">Veuillez remplir ce formulaire</h3><p>Les champs avec <span class="asterisque">*</span> sont obligatoires</p></div><div class="form-group mt-3"><label for="firstName"><span class="asterisque">*</span> Prénom :</label><input type="text" maxlength="30" class="form-control" id="firstName" required></div><div class="form-group mt-3"><label for="lastName"><span class="asterisque">*</span> Nom :</label><input type="text" class="form-control" maxlength="30" id="lastName" required></div><div class="form-group mt-3"><label for="address"><span class="asterisque">*</span> Adresse :</label><input type="text" class="form-control" id="address" required></div><div class="form-group mt-3"><label for="city"><span class="asterisque">*</span> Ville :</label><input type="text" class="form-control" id="city" required></div><div class="form-group mt-3"><label for="email"><span class="asterisque">*</span> Adresse e-mail :</label><input type="email" class="form-control" id="email" required></div><button type="submit" class="btn btn-primary mx-auto" id="finalValidation">Finaliser ma commande</button>';
    newForm.style = "display:none"; //Le formulaire reste caché tant qu'on ne clique pas sur "Valider mon panier"
    divToFill.appendChild(newForm);
    document.getElementById("firstName").setAttribute("pattern","^[A-Za-zÀ-ÿ '-]+$"); //Regex qui prend les accents ou les lettres comme ç mais pas les caractères spéciaux ni les chiffres
    document.getElementById("firstName").setAttribute("title","Pas de caractères spéciaux ni de chiffres");
    document.getElementById("lastName").setAttribute("pattern","^[A-Za-zÀ-ÿ '-]+$");
    document.getElementById("lastName").setAttribute("title","Pas de caractères spéciaux ni de chiffres");
    
    //Ajout d'une fonction de mise à jour du panier en cas de changement de quantité
    let qtys = document.getElementsByClassName('qty-select');
    for (let i = 0; i < qtys.length; i++) {
        qtys[i].addEventListener('input', function() {
            let qtyElmt = parseInt(qtys[i].value);
            basket[i].quantity=qtyElmt; //Remplacement de la quantité en mémoire par la nouvelle quantité
            localStorage.setItem('basket', JSON.stringify(basket)); //On stocke le nouveau panier
            updateTotal(); //Mise à jour total bas de page
            numberOfArticlesInBasket(JSON.parse(localStorage.getItem('basket'))); //Mise à jour chiffre indiquant le nombre d'articles dans le panier
        })
    }

    //Fonction permettant d'écouter le clic sur "Supprimer" pour n'importe quel élément du panier
    let boutonsSupp = document.getElementsByClassName("deleteCamera");
    for (let i = 0; i < boutonsSupp.length; i++) {
        boutonsSupp[i].addEventListener('click', function() {
            let conf = confirm("Confirmez-vous la suppression de cet article ?");
            if (conf) {
                if (boutonsSupp.length==1) {
                    emptyBasket(); //S'il n'y a qu'un article dans le panier, on applique la même fonction que si on vide tout le panier
                }
                else {
                    basket.splice(i,1); //On supprime l'élément de la liste grâce à la fonction splice
                    localStorage.setItem('basket', JSON.stringify(basket)); //On stocke le nouveau panier
                    document.location.reload(true); //On recharge la page pour prise en compte du changement
                }
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