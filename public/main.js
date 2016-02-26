$(document).ready(function(){
    var selector = window.location.pathname.substring(1)
       $('#'+ selector).toggleClass("selectedTab")
       


function makeAjaxCallAndGetTitle(url, cb) {
    $.get('/userReq?url=' + url).then(
        function(item){
            var title = item;
            cb(title);
        }
        );
}

$('#sugg').on('click', function(){
        var url = $('#theUrl').val();
        
        makeAjaxCallAndGetTitle(url, function(item){
            $('#theTitle').val(item)
        })
      }
   )
$('.votes').on('click', function(){
    
})

$('.hide').on('click', function(e){
    $(this).parents('.container').fadeToggle();
    return false;
    
    //.animate({opacity: '0px', height: '0px'},1500, function(){$(this).parents('.container').css('display','none')})
        
        
    
})


////RECEIVE AJAX CALL FOR VOTES /////
$('.voteForm').on('submit', function(e){
    e.preventDefault();
    var $this = $(this);
    $this.find("button").css('color', 'green')
    var data = {
        contentId: $this.find("input[name=contentId]").val(),
        upVote: $this.find("input[name=upVote]").val()
    };
    
     $.post('/voteContent', data).done(
         function(x){
            $this.parent().find('p').text(x.newVoteScore)
         })
})
})
