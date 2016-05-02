'use strict';

var $ = require('jquery');

function dv() {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h1',
            null,
            'test'
        ),
        React.createElement(
            'p',
            null,
            'Lorem ipsum dolor sit amet, nostrum definiebas mea te, soluta aeterno eleifend quo ad, suas decore delectus et nec. Dictas accusam recteque no nam, sed nullam graece in, an eam option appellantur. Molestie convenire no nec. Doming electram mei cu. Nam ei mucius singulis. Eam periculis deterruisset ne, ad posse simul nostro his. Ut nec illud legimus phaedrum. Odio minim referrentur ad est. Lobortis sententiae qui ei. Te populo numquam albucius usu, sed percipit vulputate no. Ut erant iracundia sea, ad soluta argumentum scribentur per. Et mel habemus incorrupte, alienum periculis no usu. In deleniti intellegebat mel. Has cu possit tritani mediocritatem, ex clita equidem sit. Est et noster dolorem menandri, et his lorem assum assueverit. Nec tempor regione ad, ius nisl mutat mazim cu, consul debitis sed no.'
        )
    );
};

$(document).ready(function () {
    var selector = window.location.pathname.substring(1);
    $('#' + selector).toggleClass("selectedTab");

    function makeAjaxCallAndGetTitle(url, cb) {
        $.get('/userReq?url=' + url).then(function (item) {
            var title = item;
            cb(title);
        });
    }

    $('#sugg').on('click', function () {
        var url = $('#theUrl').val();

        makeAjaxCallAndGetTitle(url, function (item) {
            $('#theTitle').val(item);
        });
    });
    $('.votes').on('click', function () {});

    $('.hide').on('click', function (e) {
        $(this).parents('.container').fadeToggle();
        return false;

        //.animate({opacity: '0px', height: '0px'},1500, function(){$(this).parents('.container').css('display','none')})
    });

    ////RECEIVE AJAX CALL FOR VOTES /////
    $('.voteForm').on('submit', function (e) {
        e.preventDefault();
        var $this = $(this);
        var data = {
            contentId: $this.find("input[name=contentId]").val(),
            upVote: $this.find("input[name=upVote]").val()
        };

        $.post('/voteContent', data).done(function (x) {
            $this.parent().find('p').text(x.newVoteScore);
        });
    });
});

