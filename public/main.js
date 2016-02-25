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
})