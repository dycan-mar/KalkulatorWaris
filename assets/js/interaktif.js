const navbar = document.getElementById('navbar');

function scrollNav() {
    console.log("scroll");
    if (window.scrollY > 50) {
        navbar.classList.remove("bg-transparent");
        navbar.classList.remove("py-3");
        navbar.classList.add("bg-dark");

    } else {
        navbar.classList.remove("bg-dark");
        navbar.classList.add("bg-transparent");
        navbar.classList.add("py-3");
    }
}
function handleScroll() {
    scrollNav();
}

function resNav(width) {
    if (width > 992) {
        navbar.classList.remove("bg-dark");
        navbar.classList.add("bg-transparent");
        window.addEventListener("scroll", handleScroll);
    }
}

window.addEventListener("resize", function () {
    let width = window.innerWidth
    resNav(width);
})
window.addEventListener("DOMContentLoaded", function () {
    let width = window.innerWidth
    resNav(width);
});
// end navbar