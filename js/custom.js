$(document).ready(function(){
    $('.ui.accordion')
        .accordion();

    $('#play-btn').on('click',function(e){
        e.preventDefault();

        $('html, body').stop().animate({
            scrollTop: $('.ui.segment#minigames').offset().top
        }, 500);
    });
});
