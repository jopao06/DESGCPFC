$(document).ready(function(){
    $('.ui.accordion')
        .accordion();

    $('#play-btn').on('click',function(e){
        e.preventDefault();

        $('html, body').stop().animate({
            scrollTop: $('.ui.segment#minigames').offset().top + 80
        }, 500);
    });

    $('#play-game').on('click',function(e){
        
    });
});
