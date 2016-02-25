$(document).ready(function() {
    $('a.signup').click(function() {
        //hide loginbox if it has been clicked
        $(".loginbox").hide();

        var placement = $("body").width()/2 - $(".signupbox").width()/2;
        $(".signupbox").css("left", placement);
        //Fade in the Popup
        $(".signupbox").fadeIn(300);

        //apply the mask which will grey out background
        $('body').append('<div id="mask"></div>');
        $('#mask').fadeIn(300);

    });
    $('a.login').click(function() {
        //hide loginbox if it has been clicked
        $(".signupbox").hide();

        var placement = $("body").width()/2 - $(".loginbox").width()/2;
        $(".loginbox").css("left", placement);
        //Fade in the Popup
        $(".loginbox").fadeIn(300);

        //apply the mask which will grey out background
        $('body').append('<div id="mask"></div>');
        $('#mask').fadeIn(300);
    });

    $('a.close, #mask').live('click', function() {
        $('#mask , .signupbox, .loginbox').fadeOut(300 , function() {
          $('#mask').remove();
        });
    });
});
