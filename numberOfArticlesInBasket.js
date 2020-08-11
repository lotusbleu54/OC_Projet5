
var numberOfArticlesInBasket = function(basket) {
    let totalNumberOfArticles = 0;
        for  (let i = 0; i < basket.length; i++) {
            totalNumberOfArticles += basket[i].quantity;
        }
        if (totalNumberOfArticles==0) {
            document.getElementById("basketNumber").textContent = "";
        }
        else if (totalNumberOfArticles<100) {
            document.getElementById("basketNumber").textContent = "("+totalNumberOfArticles+")";
        }
        else {document.getElementById("basketNumber").textContent = "(99+)";}
    }

var basket = JSON.parse(localStorage.getItem('basket'));

if (basket) {
    numberOfArticlesInBasket(basket);
}
