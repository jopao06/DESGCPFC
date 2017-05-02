$(document).ready(function(){
  var url = document.location.toString();
  var level = url.slice(url.indexOf("=") - url.length + 1);

  $('#introduction #level1').click(function(event){
    // console.log("Hello");
    // whatlevel = "level1";
  });

  // Open and close of console click functions
  $('#open-console').popup()
    .click(function(event){
      $("#console").fadeToggle("slow");
      $(this).css("display","none");
    });

  $('#close-console').click(function(event){
    $(this).parent().fadeToggle("fast");
    $("#open-console").css("display","block");
  });

  $('#run-code').click(function(event){
    console.log("RUN CODE!");
    var ptr = compData.head;
    var ptr1;
    var code = "";
    while(ptr!=null){
      code += $(ptr.node).is(".block.value") ? "'"+ptr.select("text").attr("text")+"'": ptr.select("text").attr("text");

      ptr1 = ptr.node.right;
      while(ptr1!==null){
        code += " " + ptr1.select("text").attr("text");
        ptr1 = ptr1.node.right;
      }

      code += "\n";
      ptr = ptr.node.nextLine;
    }
    $("#console-body").empty();
    console.log(code);
    var varArray = [];
    // var code = 
    //   "integer i = 0=true\n"+
    //   "number j = 1.5 + i\n"+
    //   "boolean b = true\n"+
    //   "integer ar[2.5][3]\n"+
    //   "ar[1][j] = i + 1\n"+
    //   "i = 2.5 mod 10\n"+
    //   "repeat j+1 times\n"+
    //   "end\n"+
    //   "repeatwhile i not= 6\n"+
    //   "end\n"+
    //   "if i>0\n"+
    //   "i = 3 * 10 mod 2\n"+
    //   "elseif i>10\n"+
    //   "i = 3*3 / 2\n"+
    //   "else\n"+
    //   "boolean m = 10 > i\n"+
    //   "end\n"+
    //   "i = i + 2";
    var lines = code.split('\n');
    var parser = quorum;
    var isError = false;
    var outputCode = "";
    // console.log(code);
    $.each( lines, function( index, line){
      try{
        parser.yy = {data:varArray};
        var output = parser.parse(line);
        var outputVarArray = output.variables;
        outputCode += output.code;
        // If VARIABLE DECLARAION: Save to array of variables and check if it exists 
        if(output.isVarDec){
          var varName = outputVarArray[0].name;
          if(!(varName in varArray)){
            varArray[varName] = {
              type: outputVarArray[0].type,
              value: null
            };
            if(outputVarArray[0].isArray){
              varArray[varName].arraySize = outputVarArray[0].arraySize;
            }
            varArray[varName].isArray = outputVarArray[0].isArray;
          }
          else{
            isError = true;
            $("#console-body").append("<p>Error at line "+ (index+1) +": Variable '"+ varName + "' has already been defined</p>");
            // console.log("Error at line "+ (index+1) +": Variable '"+ varName + "' has already been defined.")
          }
        }

        // Check if correct data type in arithmetic expressions
        var outputTerms = output.terms;
        $.each(outputTerms, function(i, term){
          var type = (outputVarArray && outputVarArray[0].type) ? outputVarArray[0].type : outputTerms[0].type;
          if(type === "integer" && type !== term.type && !outputVarArray[0].isArray){
            isError = true;
            $("#console-body").append("<p>Error at line "+ (index+1) +": '" + term.value + ((term.type === "integer" || term.type === "undefined") ? "' is an '" : "' is a '") + term.type + "'. Expecting "+ ((type === "integer" || type === "undefined") ? "an '" : "a '") +type+"'</p>");
            // console.log("Error at line "+ (index+1) +": '" + term.value + ((term.type === "integer" || "undefined") ? "' is an '" : "' is a '") + term.type + "'. Expecting "+ (type === "integer" ? "an '" : "a '") +type+"'");
          }

          // Check if expression returns integer in repeat times
          if(output.isRepeatTimes && term.type !== "integer"){
            isError = true;
            $("#console-body").append("<p>Error at line "+ (index+1) +": '" + term.value + ((term.type === "integer" || term.type === "undefined") ? "' is an '" : "' is a '") + term.type + "'. Expecting to return 'integer' in 'repeat times'</p>");
          }
        });

        // Iterate all variables and check if it exists
        if(outputVarArray){
          $.each(outputVarArray, function(i, variable){
            var varName = variable.name;
            if(!(varName in varArray)){
              isError = true;
              $("#console-body").append("<p>Error at line "+ (index+1) +": Variable '"+ varName + "' does not exist</p>");
              // console.log("Error at line "+ (index+1) +": Variable '"+ varName + "' does not exist.");
            }

            // Check if Array indices are integer
            if(variable.isArray){
              var arraySize = variable.arraySize;
              $.each(outputTerms, function(i, term){
                if(term.type !== "integer" && ~arraySize.indexOf(""+term.value+"")){
                  $("#console-body").append("<p>Error at line "+ (index+1) +": '" + term.value + "' is a '" + term.type + "'. Expecting an 'integer' as index of array '"+ variable.name +"'</p>");
                }
              });
            }
          });
        }
        
      }catch(e){
        isError = true;
        $("#console-body").append("<p>Error at line "+ (index+1) +": <br>"+e.message.split('\n').splice(1).join('<br>')+"</p>");
        // console.log("Error at line "+ (index+1) +": \n"+e.message.split('\n').splice(1).join('\n'));
        console.log(e);
      }
    });

    if(isError && $('#open-console').css('display') === "block") $('#open-console').click();
    else{
      console.log(outputCode);
      eval(outputCode);
    }
    // console.log(outputCode);
  });
  
  var blocksNeeded = ["type","variable","equal","value","output",
                      "addition","subtraction","multiplication", "division", "modulo", "open_par","close_par",
                      "less", "greater", "less_equal","greater_equal", "equal_equal","not_equal",
                      "if","repeat"];
  switch(level){
    case "1_1":
      blocksNeeded = ["type","variable","equal","value","output",
                      "addition","subtraction","multiplication", "division", "modulo", "open_par","close_par",
                      "less", "greater", "less_equal","greater_equal", "equal_equal","not_equal",
                      "if","repeat"];
      break;
    case "1_2":
      blocksNeeded = ["type","variable","equal","value","output",
                      "addition","subtraction","multiplication", "division", "modulo", "open_par","close_par",
                      "less", "greater", "less_equal","greater_equal", "equal_equal","not_equal",
                      "if","repeat"];
      break;
    case "1_3":
      blocksNeeded = ["type","variable","equal","value","output",
                      "addition","subtraction","multiplication", "division", "modulo", "open_par","close_par",
                      "less", "greater", "less_equal","greater_equal", "equal_equal","not_equal",
                      "if","repeat"];
      break;
    case "1_4":
      blocksNeeded = ["type","variable","equal","value","output",
                      "addition","subtraction","multiplication", "division", "modulo", "open_par","close_par",
                      "less", "greater", "less_equal","greater_equal", "equal_equal","not_equal",
                      "if","repeat"];
      break;
    default:
      console.log("Internal error had occured!");
  }
/////////////////////////////////////////////////////////// INITIALIZE BLOCK PANEL
  var prevBlock = defaultBlock;
  var tempText;
  var groupedBlock;
  var w;

  // Populate blocks
  $.each(blocksNeeded, function(x, i){
    // Clone rectangle block
    tempElem = prevBlock.clone();
    tempElem.attr({
      x: parseInt(prevBlock.attr('x')) + parseInt(prevBlock.attr('width')) + blockMargin,
      stroke: blocks[i].color
    });

    // Clone text
    tempText = defaultText.clone();
    tempText.attr({
      x: tempElem.getBBox().x + textXPadding,
      text: blocks[i].text
    });

    // Compute padding of rectangle relative to text width
    w = tempText.getBBox().width + (textXPadding*2);
    w = w > 40 ? w : 40;
    tempElem.attr({
      width: w
    });

    // Group and add drag
    groupedBlock = snapBlock.g(tempElem, tempText);
    groupedBlock.attr({
      class: blocks[i].class,
      "code-level": 0
    });
    groupedBlock.drag(move,start,end);
    prevBlock = tempElem;
  });

  // Update blockpanel dimensions
  if(blocksNeeded){
    blockPanel.attr({
      width: parseInt(prevBlock.attr('x')) + parseInt(prevBlock.attr('width')) + blockMargin,
      height: blockMargin + blockMargin + blockHeight
    });
  }

  // Scroll Button Click functions for Block Panel
  $('#block-go-left').click(function(){
    $('#scrollable-div').animate({scrollLeft:'-=350px'});
  });
  
  $('#block-go-right').click(function(){
    $('#scrollable-div').animate({scrollLeft:'+=350px'});
  });
});