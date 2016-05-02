var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

$(document).ready( function () {
  handleSuggestClick();
  handleVoteClick();
});

function handleVoteClick () {
  $('.vote-button').click( function (e) {
    var currentButton = $(e.currentTarget);
    var contentId = e.currentTarget.value;
    var vote = parseInt(e.currentTarget.name);

    var currentScore = parseInt($(`.vote-score.${contentId}`).text());
    var scoreElement = $(`.vote-score.${contentId}`);

    $.post('/vote', {vote: vote, contentId: contentId})
    .done( function () {
      if (currentButton.hasClass('up')) {
        currentButton.toggleClass('up');
        scoreElement.text(--currentScore);
      }
      else if (currentButton.hasClass('down')) {
        currentButton.toggleClass('down');
        scoreElement.text(++currentScore);
      }
      else {
        var otherButton;

        if (currentButton.is('#upvote')) {
          otherButton = scoreElement.parent().find('#downvote');
          currentButton.toggleClass('up');

          if (otherButton.hasClass('down')) {
            otherButton.toggleClass('down');
            scoreElement.text(currentScore + 2);
          }
          else {
            scoreElement.text(++currentScore);
          }
        }
        else if (currentButton.is('#downvote')) {
          otherButton = scoreElement.parent().find('#upvote');
          currentButton.toggleClass('down');

          if (otherButton.hasClass('up')) {
            otherButton.toggleClass('up');
            scoreElement.text(currentScore - 2);
          }
          else {
            scoreElement.text(--currentScore);
          }
        }
      }
    });
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
