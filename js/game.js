$('#open-console').popup()
  .click(function(event){
    // event.preventDefault();
    $("#console").fadeToggle("slow");
    $(this).css("display","none");
    // $("#console").css("display","block");
  });
$('#close-console').click(function(event){
  // event.preventDefault();
  $(this).parent().fadeToggle("fast");
  $("#open-console").css("display","block");
});