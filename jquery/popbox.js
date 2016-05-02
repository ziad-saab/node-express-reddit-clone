var $ = require('jquery');

$(document).ready(function() {
  //Clicking sign up link
  $('a.signup').click(function() {
    //hide loginbox if it has been clicked
    $(".loginbox").hide();
    //remove error message
    $('.error').text('');
    //remove previous input text
    $('.input-field').val('');

    var placement = $("body").width()/2 - $(".signupbox").width()/2;
    $(".signupbox").css("left", placement);
    //Fade in the Popup
    $(".signupbox").fadeIn(300);

    //apply the mask which will grey out background
    $('body').append('<div id="mask"></div>');
    $('#mask').unbind();
    $('#mask').on("click", fadeOut);
    $('#mask').fadeIn(300);
  });

  //Clicking login link
  $('a.login').click(function() {
    //hide loginbox if it has been clicked
    $(".signupbox").hide();
    //remove error message
    $('.error').text('');
    //remove previous input text
    $('.input-field').val('');

    var placement = $("body").width()/2 - $(".loginbox").width()/2;
    $(".loginbox").css("left", placement);
    //Fade in the Popup
    $(".loginbox").fadeIn(300);

    //apply the mask which will grey out background
    $('body').append('<div id="mask"></div>');
    $('#mask').unbind();
    $('#mask').on("click", fadeOut);
    $('#mask').fadeIn(300);
  });

  //clicking close button
  $('a.close').on("click", fadeOut);

  //clicking signup on form
  $('.submitSignup').click(function() {
    var username = $('.username').val();
    var email = $('.email').val();
    var password = $('.password').val();
    var confirmPassword = $('.confirmPassword').val();
    if(password === confirmPassword){
      if(password.length < 4){
        $('.error').text('Your password must be at least 4 characters');
      }
      else{
        $.ajax({
          type: 'POST',
          url: '/SignUp',
          data: {username: username, email: email, password: password}
        }).success(function(data){
          window.location.reload(true);
        }).fail(function(data){
          $('.error').text(data.responseText);
        });
      }
    }
    else {
      $('.error').text('Your passwords do not match');
    }
  });

  //clicking login on form
  $('.submitLogin').click(function() {
    var username = $('.usernameLogin').val();
    var password = $('.passwordLogin').val();
    $.ajax({
      type: 'POST',
      url: '/Login',
      data: {username: username, password: password}
    }).success(function(data){
      window.location.reload(true);
    }).fail(function(data){
      $('.error').text(data.responseText);
    })
  });

});

function fadeOut() {
  $('#mask , .signupbox, .loginbox').fadeOut(300)
  $('#mask').remove();
}
