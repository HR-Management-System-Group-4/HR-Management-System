
const navbarContainer = document.getElementById("navbar-layout");

const scriptPath = document.currentScript.src;
const navbarFolder = new URL(".", scriptPath);

fetch(new URL("nav.html", navbarFolder))
    .then(response => response.text())
    .then(data => {
        navbarContainer.innerHTML = data;
    })
    .catch(error => {
        console.error("Navbar could not be loaded:", error);
    });