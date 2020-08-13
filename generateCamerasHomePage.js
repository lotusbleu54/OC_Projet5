//Requête faite au serveur pour obtenir les données des appareils photos
var request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var Cameras = JSON.parse(this.responseText);
        //Appel à la fonction qui crée les différents blocs
        makeBlocs(Cameras);
    }
};
request.open("GET", "http://localhost:3000/api/cameras");
request.send();

//Fonction qui crée un seul bloc appareil photo en utilisant la structure bootstrap des "cards"
function makeBloc(camera) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("col-12", "col-lg-4");
    document.getElementById("Cameras").appendChild(newDiv);

    let newDiv2 = document.createElement("div");
    newDiv2.classList.add("card", "mb-4", "border-primary", "shadow");
    newDiv.appendChild(newDiv2);
    
    let newDiv3 = document.createElement("div");
    newDiv3.classList.add("embed-responsive", "embed-responsive-16by9");
    newDiv2.appendChild(newDiv3);

    let newImg = document.createElement("img");
    newImg.classList.add("card-img-top", "embed-responsive-item");
    newImg.src = camera.imageUrl;
    newImg.setAttribute("alt", camera.description);
    newDiv3.appendChild(newImg);
    
    let newDiv4 = document.createElement("div");
    newDiv4.classList.add("card-body");
    newDiv2.appendChild(newDiv4);

    let newH2 = document.createElement("h2");
    newH2.classList.add("card-title", "h3");
    newH2.textContent = camera.name;
    newDiv4.appendChild(newH2);

    let newA = document.createElement("a");
    //Le clic sur ce lien ouvrira une page dont l'URL dépendra de l'id de l'appareil photo
    let myUrl = 'product.html'+'?id' + camera._id;
    newA.setAttribute("href", myUrl);
    newA.classList.add("btn", "btn-primary", "stretched-link");
    newA.textContent = "Plus de détails";
    newDiv4.appendChild(newA);
}

//Fonction qui crée l'ensemble des blocs appareil photo
function makeBlocs(Cameras) {

    //Création du bloc global comprenant tous les blocs
    let newDiv = document.createElement("div");
    newDiv.id = "Cameras";
    newDiv.classList.add("row", "d-flex", "justify-content-center");
    let parent = document.getElementById("cardsContainer");
    parent.appendChild(newDiv);

    //Création des blocs appareils photos en fonction du nombre d'appareils dans la base de donnée
    for (let i = 0; i < Cameras.length; i++) {
        makeBloc(Cameras[i]);
    }
}