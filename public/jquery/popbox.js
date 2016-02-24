$(document).ready(function() {
    $('a.signup').click(function() {
        //hide loginbox if it has been clicked
        $(".loginbox").hide();
        //Fade in the Popup
        $(".signupbox").fadeIn(300);
    });
    $('a.login').click(function() {
        //hide loginbox if it has been clicked
        $(".signupbox").hide();
        //Fade in the Popup
        $(".loginbox").fadeIn(300);
    });
});