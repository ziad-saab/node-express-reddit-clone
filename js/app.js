$(document).ready(
                function(){
                    $('#suggestTitle').click(function(e){
                        var url = encodeURIComponent($('#url').val());
                        $.get('/titleRequest/' + url).then(
                            function(response) {
                                var title = response;
                                $('#postTitle').val(title);
                            }
                        );
                    })
                }
            )