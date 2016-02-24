$(document).ready(function() {
    $('a.signup').click(function() {
        //hide loginbox if it has been clicked
        $(".loginbox").hide();

        var placement = $("body").width()/2 - $(".signupbox").width()/2;
        $(".signupbox").css("left", placement);
        //Fade in the Popup
        $(".signupbox").fadeIn(300);

    });
    $('a.login').click(function() {
        //hide loginbox if it has been clicked
        $(".signupbox").hide();

        var placement = $("body").width()/2 - $(".loginbox").width()/2;
        $(".loginbox").css("left", placement);
        //Fade in the Popup
        $(".loginbox").fadeIn(300);
        
    });
});
