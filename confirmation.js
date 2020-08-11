function confirmation() {
    let contact = JSON.parse(localStorage.getItem('contact'));    // Récupère le nom et prénom de l'utilisateur
    let orderId = JSON.parse(localStorage.getItem('orderId'));    //orderId à afficher pour la validation du panier
    let amount = localStorage.getItem('amount');

    document.getElementById("prenom").textContent = contact.firstName;
    document.getElementById("nom").textContent = contact.lastName;
    document.getElementById("amount").textContent = amount;
    document.getElementById("orderId").textContent = orderId;
};

confirmation();
