$(document).ready( function () {
  handleSuggestClick();
  handleVoteClick();
});

function handleVoteClick () {
  $('.vote-button').click( function (e) {
    var vote, contentId;

    if (e.currentTarget.name === 'upvote') {
      vote = 1;
    }
    else if (e.currentTarget.name === 'downvote') {
      vote = -1;
    }

    $.post('/vote', {vote: vote, contentId: e.currentTarget.value})
    .done(
      function () {
        var currentScore = $('.vote-score').text();
        $('.vote-score').text(++currentScore);
      }
    );
  });
}

function handleSuggestClick () {
  $('#suggest-button').click( function () {
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
}
