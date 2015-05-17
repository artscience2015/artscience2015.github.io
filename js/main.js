

function fadeInInfo(){
    $("#info").fadeIn(500);
}

$(document).ready( function() {
    initClothAnimation();
    animateCloth();
    setTimeout(fadeInInfo, 1);
});



