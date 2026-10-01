
fetch('../nav-bar/nav.html')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.text();
    })
    .then(data => {
        document.getElementById('navbar').innerHTML = data;
    })
    .catch(error => {
        console.error('Error loading navbar:', error);
    });



let boxes = document.querySelectorAll(".boxes > div");
let content = document.querySelectorAll(".content-wrapper > div");


boxes.forEach((box, index) => {

    box.addEventListener("click", function () {

       
        content.forEach(element => {
            element.style.display = "none";
        });


        content[index].style.display = "block";


       
        boxes.forEach(element => {
            element.classList.remove("active");
        });
        box.classList.add("active");

    });

});

let carouselElement = document.querySelector("#carouselExampleControls");

// basically gives us JavaScript access to your Bootstrap carousel.
let carousel = bootstrap.Carousel.getOrCreateInstance(carouselElement);

let previousButton = document.querySelector(".previous");
let nextButton = document.querySelector(".next");

nextButton.addEventListener("click", function () {
    carousel.next();
});

previousButton.addEventListener("click", function () {
    carousel.prev();
});

let slideCount = document.querySelector(".slideCount");
let dots = document.querySelectorAll(".dot");


// slid.bs.carousel It happens after the carousel finishes moving to another slide.

carouselElement.addEventListener("slid.bs.carousel", function (event) {
// event.to gives the index of the slide that the carousel moved to
    let index = event.to;

    slideCount.innerHTML =
        "0" + (index + 1) + " <span>/ 03</span>";


    dots.forEach(dot => {
        dot.classList.remove("activeDot");
    });

    dots[index].classList.add("activeDot");

});

dots.forEach((dot, index) => {

    dot.addEventListener("click", function () {

        carousel.to(index);

    });

});