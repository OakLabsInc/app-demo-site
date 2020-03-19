
var body = document.getElementsByTagName("body")[0]

var hitZone = document.createElement("div");
// hitZone.innerText = "Swipe Me"
hitZone.setAttribute("id", "swipe-zone")
hitZone.style.position = "absolute"
hitZone.style.left = "0"
hitZone.style.width = "100px"
hitZone.style.height = "100px"
// hitZone.style.right = "80%"
hitZone.style.top = "0"
// hitZone.style.bottom = "90%"
hitZone.zIndex = "10000"

hitZone.style.border = "5px solid yellow"
hitZone.style.color = "#ffffff"
body.appendChild(hitZone);

// var listener = SwipeListener(hitZone)
// hitZone.addEventListener('swipe', function (e) {
    
//     let results = e.detail
//     if(results.directions.right){
//         console.log("Swipe for menu", results.directions.x)
//         var xhr = new XMLHttpRequest();
//         xhr.onreadystatechange = function() {};
//         xhr.open('GET', 'http://localhost:9000/focus');
//         xhr.send()
//     }
// })

hitZone.addEventListener('click', function (e) {

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {};
        xhr.open('GET', 'http://localhost:9000/focus');
        xhr.send()
    
})
