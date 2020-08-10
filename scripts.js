var request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var Cameras = JSON.parse(this.responseText);
        makeCards(Cameras);
    }
};
request.open("GET", "http://localhost:3000/api/cameras");
request.send();

function createCard(camera) {
    let newDiv2 = document.createElement("div");
    newDiv2.classList.add("col-12", "col-lg-4", "d-flex");
    document.getElementById("Cameras").appendChild(newDiv2);

    let newDiv3 = document.createElement("div");
    newDiv3.classList.add("card", "mb-4", "mb-lg-2", "border-primary", "shadow");
    newDiv2.appendChild(newDiv3);
    
    let newImg = document.createElement("img");
    newImg.classList.add("card-img-top");
    newImg.src = camera.imageUrl;
    newImg.setAttribute("alt", camera.description);
    newDiv3.appendChild(newImg);
    
    let newDiv4 = document.createElement("div");
    newDiv4.classList.add("card-body");
    newDiv3.appendChild(newDiv4);

    let newH2 = document.createElement("h2");
    newH2.classList.add("card-title");
    newH2.textContent = camera.name;
    newDiv4.appendChild(newH2);

    let newA = document.createElement("a");
    newA.classList.add("btn", "btn-primary", "stretched-link");
    var myUrl = 'product.html'+'?id' +camera._id;
    newA.setAttribute("href", myUrl);
    newA.id = "cam";
    newA.textContent = "Plus de détails";
    newDiv4.appendChild(newA);
}

function makeCards(Cameras) {

    let newDiv1 = document.createElement("div");
    newDiv1.id = "Cameras";
    newDiv1.classList.add("row");
    let parent = document.getElementById("cardsContainer");
    parent.appendChild(newDiv1);

    for (let i = 0; i < Cameras.length; i++) {
        createCard(Cameras[i]);

        //Créer un Id par lien
        var link = document.getElementById("cam");
        var linkId = link.id;
        linkId = linkId+i;
        link.id = linkId;
    }
}