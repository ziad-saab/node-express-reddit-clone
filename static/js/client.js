$(document).ready( function () {
  
  $('#suggest-button').click( function (e) {
    var url = $('#url-field').val();
    
    $.get('/suggest?url=' + url)
    .done(
      function (response) {
        if (!response) {
          $('#url-field').val('No title found!');
        }
        else {
          $('#title-field').val(response.trim());
        }
      }
    )
    .fail( function (err) {  
      console.log('Fetch Error!!', err);  
    });
  });
  
});