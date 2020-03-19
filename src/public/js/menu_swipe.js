
window.onload = function (evt) {
    document.body.innerHTML = '<strong>boo!</strong>';
};
var body = document.getElementsByTagName("body")[0]

var swipeZone = document.createElement("div");
// swipeZone.innerText = "Swipe Me"
swipeZone.setAttribute("id", "swipe-zone")
swipeZone.style.position = "absolute"
swipeZone.style.left = "0"
swipeZone.style.right = "0"
swipeZone.style.top = "0"
swipeZone.style.bottom = "0"
swipeZone.zIndex = "10000"

// swipeZone.style.border = "5px solid yellow"
swipeZone.style.color = "#ffffff"
body.appendChild(swipeZone);

var listener = SwipeListener(swipeZone)
swipeZone.addEventListener('swipe', function (e) {
    
    let results = e.detail
    if(results.directions.right){
        console.log("Swipe for menu", results.directions.x)
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {};
        xhr.open('GET', 'http://localhost:9000/focus');
        xhr.send()
    }
})


