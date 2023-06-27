// drop-down menu
responsive = document.querySelector(".responsive");
responsive.onclick = function() {
    anchor = document.querySelector(".navigation");
    anchor.classList.toggle("active");
}