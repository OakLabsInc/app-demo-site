
/**
 * Utility function to add CSS in multiple passes.
 * @param {string} styleString
 */
function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}

addStyle(`
    @font-face {
    font-family: 'verifone-icomoon';
    src: url("data:application/x-font-ttf;charset=utf-8;base64,AAEAAAALAIAAAwAwT1MvMg8SBecAAAC8AAAAYGNtYXAWmdQBAAABHAAAAFRnYXNwAAAAEAAAAXAAAAAIZ2x5Zgom5+4AAAF4AAAAcGhlYWQYE29zAAAB6AAAADZoaGVhB4IDxgAAAiAAAAAkaG10eAoAAEAAAAJEAAAAFGxvY2EAKABMAAACWAAAAAxtYXhwAAkADgAAAmQAAAAgbmFtZeBI0eIAAAKEAAAB8nBvc3QAAwAAAAAEeAAAACAAAwMAAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADpvQPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAADAAAAAwAAABwAAQADAAAAHAADAAEAAAAcAAQAOAAAAAoACAACAAIAAQAg6b3//f//AAAAAAAg6b3//f//AAH/4xZHAAMAAQAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAADAEAAQAPAAwAAAwAHAAsAABMhFSEVIRUhFSEVIUADgPyAA4D8gAOA/IADAMBAwEDAAAAAAQAAAAEAAMpsD9lfDzz1AAsEAAAAAADampW7AAAAANqalbsAAAAAA8ADAAAAAAgAAgAAAAAAAAABAAADwP/AAAAEAAAAAAADwAABAAAAAAAAAAAAAAAAAAAABQQAAAAAAAAAAAAAAAIAAAAEAABAAAAAAAAKABQAHgA4AAEAAAAFAAwAAwAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAOAK4AAQAAAAAAAQAQAAAAAQAAAAAAAgAHALEAAQAAAAAAAwAQAFEAAQAAAAAABAAQAMYAAQAAAAAABQALADAAAQAAAAAABgAQAIEAAQAAAAAACgAaAPYAAwABBAkAAQAgABAAAwABBAkAAgAOALgAAwABBAkAAwAgAGEAAwABBAkABAAgANYAAwABBAkABQAWADsAAwABBAkABgAgAJEAAwABBAkACgA0ARB2ZXJpZm9uZS1pY29tb29uAHYAZQByAGkAZgBvAG4AZQAtAGkAYwBvAG0AbwBvAG5WZXJzaW9uIDEuMABWAGUAcgBzAGkAbwBuACAAMQAuADB2ZXJpZm9uZS1pY29tb29uAHYAZQByAGkAZgBvAG4AZQAtAGkAYwBvAG0AbwBvAG52ZXJpZm9uZS1pY29tb29uAHYAZQByAGkAZgBvAG4AZQAtAGkAYwBvAG0AbwBvAG5SZWd1bGFyAFIAZQBnAHUAbABhAHJ2ZXJpZm9uZS1pY29tb29uAHYAZQByAGkAZgBvAG4AZQAtAGkAYwBvAG0AbwBvAG5Gb250IGdlbmVyYXRlZCBieSBJY29Nb29uLgBGAG8AbgB0ACAAZwBlAG4AZQByAGEAdABlAGQAIABiAHkAIABJAGMAbwBNAG8AbwBuAC4AAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: block;
    }

    .oakos-icon {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: 'verifone-icomoon' !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;

    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    }

    .oakos-icon-menu:before {
        content: "\\e9bd";
    }

    .hit-zone {
        position: fixed;
        z-index: 100000;
        left: 10px;
        width: 50px;
        height: 50px;
        top: 10px;
        color: rgb(9,188,255);
        display: flex;
        justify-conter: center;
        align-items: center;
        padding: 5px 10px
        margin: 10px;
        cursor: pointer
    
    }
    .oakos-icon {
        font-size: 48px;
    }
`);
  


var body = document.getElementsByTagName("body")[0]

var hitZone = document.createElement("div");

// hitZone.classList.add("oakos-icon")
// hitZone.classList.add("oakos-icon-menu")
hitZone.classList.add("hit-zone")
hitZone.setAttribute("id", "swipe-zone")
body.appendChild(hitZone);

var mouseTimer;
function mouseDown() { 
    mouseUp();
    mouseTimer = window.setTimeout(execMouseDown,2000); //set timeout to fire in 2 seconds when the user presses mouse button down
}

function mouseUp() { 
    if (mouseTimer) window.clearTimeout(mouseTimer);  //cancel timer when mouse button is released
}

function execMouseDown() { 
    var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {};
        xhr.open('GET', 'http://localhost:9000/focus');
        xhr.send()
}

hitZone.addEventListener("mousedown", mouseDown);
hitZone.addEventListener("mouseup", mouseUp);  //listen for mouse up event on body, not just the element you originally clicked on


