//Page to navigate when clicking on the SIDEBAR LINKS
//Page: from HTML CLICK  Example: /page: 02_Styling/index.html
function loadPage(page) {

    //Get Reference for thr HTML ELEMENT BY ITS ID
    //contentFrame is iframe element type
    let iframElement = document.getElementById("contentFrame");

    //Give the iframe the HTML ADDRESS
    iframElement.src = page;

    // Close sidebar on mobile
    document.getElementById("sidebar").classList.remove("show");
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}