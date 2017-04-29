$(document).ready(function(){
  $('#open-console').popup()
    .click(function(event){
      // event.preventDefault();
      $("#console").fadeToggle("slow");
      $(this).css("display","none");
      // $("#console").css("display","block");
    });

  $('#close-console').click(function(event){
    $(this).parent().fadeToggle("fast");
    $("#open-console").css("display","block");
  });

  $('#run-code').click(function(event){
    console.log("RUN CODE!");
    var ptr = compData.head;
    var ptr1;
    while(ptr!=null){
      code += ptr.select("text").attr("text");

      ptr1 = ptr.node.right;
      while(ptr1!==null){
        code += " " + ptr1.select("text").attr("text");
        ptr1 = ptr1.node.right;
      }

      code += "\n";
      ptr = ptr.node.nextLine;
    }

    console.log(code);
  });
  var code = 
    "integer i = 0\n"+
    "number n = 1.5\n"+
    "boolean b = true\n"+
    "i = i + 1\n"+
    "repeat many times\n"+
    "end\n"+
    "repeatwhile i not=6\n"+
    "end\n"+
    "if i>0\n"+
    "i = 3 * 3 mod 2\n"+
    "elseif i>0\n"+
    "i = 3*3 / 2\n"+
    "else\n"+
    "modify = m > 31\n"+
    "end\n"+
    "i = i + 2";

  var parser = quorum;
  try{
    var output = parser.parse(code);
    console.log(output);
  }catch(e){
    console.log(e.message);
  }
  
});