/* jshint ignore:start */
$.ajax({
  beforeSend: function() {
    console.log("Page loading");
    // $(body).hide(); 
    $(".ui.dimmer .content").hide(); 
    $("#block-panel-desc").hide();
    $(".ui.dimmer .ui.loader").show();
  },
  complete: function(){
    console.log("Page done loading");
     $(".ui.dimmer .ui.loader").hide();
    $(".ui.dimmer .content").show(); 
  },
  success: function() {}
});

$(document).ready(function(){
  $('#open-console').popup()
    .click(function(event){
      $("#console").fadeToggle("slow");
      $(this).css("display","none");
    });

  $('#close-console').click(function(event){
    $(this).parent().fadeToggle("fast");
    $("#open-console").css("display","block");
  });

  $('.launch.fixed.button').click(function(){
    $('.ui.labeled.icon.sidebar').sidebar({
      dimPage: false,
    }).sidebar('toggle');
  });

  // Click function to clear all blocks in the edit panel
  $('#clear-code').click(function(event){
    $('svg#edit-panel').empty();
    compData.head = null;
    compData.tail = null;
  });

  // Click function to run code. Get strings from edit panel then interpret then evalueate
  $('#run-code').click(function(event){
    var parser = quorum;
    console.log("RUN CODE!");
    var ptr = compData.head;
    var ptr1;
    var code = "";
    // while(ptr !== null){
    //   code += $(ptr.node).is(".block.value") ? "'"+ptr.select("text").attr("text")+"'": ptr.select("text").attr("text");

    //   ptr1 = ptr.node.right;
    //   while(ptr1!==null){
    //     code += " " + ptr1.select("text").attr("text");
    //     ptr1 = ptr1.node.right;
    //   }

    //   code += "\n";
    //   ptr = ptr.node.nextLine;
    // }
    $("#console-body").empty();
    $(".display.output").remove();
    console.log(code);
    var varArray = [];
    var code = 
      "integer i = 5\n"+
      "integer k = i + i\n"+
      "integer j[i][k]\n"+
      "j[0][i] = 52";
    var lines = code.split('\n');
    var isError = false;
    var outputCode = "";
    var lineCount = 0;
    // console.log(code);
    $.each( lines, function(index, line){
      try{
        parser.yy.data = varArray;
        parser.yy.lineCount = lineCount;
        var output = parser.parse(line);
        var outputVarArray = output.variables;
        outputCode += (output.isVarDec && outputVarArray[outputVarArray.length-1].isArray) ? 
              ("var "+ outputVarArray[outputVarArray.length-1].name + " = "+getArraySize(outputVarArray[outputVarArray.length-1].arraySize)+";") :
              output.code;
        if(output.isOutput) lineCount+=1;
        console.log(outputVarArray);

        // If VARIABLE DECLARAION: Save to array of variables and check if it exists 
        if(output.isVarDec){
          var varName = outputVarArray[outputVarArray.length-1].isArray ? outputVarArray[outputVarArray.length-1].name : outputVarArray[0].name;
          if(!(varName in varArray)){
            varArray[varName] = {
              type: outputVarArray[0].type,
              value: null
            };
            if(outputVarArray[outputVarArray.length-1].isArray){
              varArray[varName].arraySize = outputVarArray[outputVarArray.length-1].arraySize;
            }
            varArray[varName].isArray = outputVarArray[outputVarArray.length-1].isArray;
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

    if(isError && $('#open-console').css('display') === "block"){
      $('#open-console').click();
      EventManager.publish("unsuccessfulRun");
    }
    else{
      console.log(outputCode);
      eval(outputCode);
      EventManager.publish("successfulRun");
    }
    console.log(outputCode);
  });
  
  // Get the array dimension of the declared variable
  var getArraySize = function(arrSize){
    output = "";
    for(var i=0; i < arrSize.length; i++){
      if(arrSize[i] !== "["){
        output += "";
      }else{
        output = "[" + output + "]";
      }
    }
    return output;
  }
  
  // Default list of blocks
  var blocksNeeded = ["type","variable","equal","value","output",
                      "addition","subtraction","multiplication", "division", "modulo", "open_par","close_par",
                      "less", "greater", "less_equal","greater_equal", "equal_equal","not_equal",
                      "if","repeat"];
  switch(level){
    case "1_1":
      // Initialize Sidebar
      $("a#side-prev").remove();
      $("a#side-next").attr({href:'game.html?level=1_2'});
      // Initialize Popups
      $("#dimmer-message .content .center").append(gameTexts['1_1'].tutorial.start_tutorial);
      $("#block-div .custom.popup").append(gameTexts['1_1'].tutorial.block);
      $("#edit-div .custom.popup").append(gameTexts['1_1'].tutorial.edit);
      $("#display-div #display-panel-pop.custom.popup").append(gameTexts['1_1'].tutorial.display);
      $("#display-div #console-pop.custom.popup").append(gameTexts['1_1'].tutorial.console);

      // Initialize Display SVG
      snapDisplay.rect(10,10,$(snapDisplay.node).width()/1.04,$(snapDisplay.node).height()/2,9).attr({'fill-opacity': 0, stroke: black, strokeWidth: 2,});
      snapDisplay.line(20,45,($(snapDisplay.node).width()/1.04)-4,45).attr({stroke: black, strokeWidth: 2,});
      snapDisplay.text(20,35,'Output >>').attr({'font-size': 15, fill: black});
      // snapDisplay.text(20,70,'HELLO WORLD!').attr({'font-size': 20, fill: blackActive});
      // snapDisplay.text(20,90,'HELLO WORLD!').attr({'font-size': 20, fill: blackActive});
      // snapDisplay.text(20,110,'HELLO WORLD!').attr({'font-size': 20, fill: blackActive});
      $('#open-console').click();
      // Show welcome message
      $('div#dimmer-message').dimmer({
        onShow: function(){
          $('div#block-panel-pop').hide();
        },
        onHide: function(){
          $('#block-container')
            .popup({
              position: "bottom left",
              hoverable : false,
              closable: false,
              exclusive: true,
              on: 'manual',
              popup : $('#block-panel-pop'),
              variation: "very wide"
            }).popup('toggle');
        }
      }).dimmer('show');
      // Trigger Edit popup
      $('button#open-edit').click(function(){
        $('#block-container').popup('toggle').popup({
            hoverable : false,
            closable: false,
            exclusive:false,
            on: 'manual',
            onHide: function(){
              $('button#open-edit').hide();
            }
          });

        $('#edit-div').popup({
          position: "bottom center",
          hoverable : false,
          closable: false,
          exclusive: true,
          on: 'manual',
          boundary: 'html',
          popup : $('#edit-panel-pop'),
          variation: "very wide"
        }).popup('show');
      });
      // Trigger Display popup
      $('button#open-display').click(function(){
        $('#edit-div').popup('toggle').popup({
          hoverable : true,
          closable: true,
          exclusive:false,
          onHide: function(){
            $('button#open-display').hide();
          }
        });

        $('#display-svg svg').popup({
          position: "top center",
          hoverable : false,
          closable: false,
          exclusive: true,
          on: 'manual',
          popup : $('#display-panel-pop'),
          variation: "very wide"
        }).popup('show');
      });
      // Trigger Console popup
      $('button#pop-console').click(function(){
        $('#display-svg svg').popup('toggle').popup({
          hoverable : true,
          closable: true,
          exclusive:false,
          onHide: function(){
            $('button#pop-console').hide();
          }
        });

        $('#console-title').popup({
          position: "top center",
          hoverable : false,
          closable: false,
          exclusive: true,
          on: 'click',
          popup : $('#console-pop'),
          variation: "very wide",
          offset: 20
        }).popup('show');
      });
      // Trigger Finish dimmer
      $('button#finish-tutorial').click(function(){
        $('#console-title').popup('toggle').popup({
          hoverable : true,
          closable: true,
          exclusive:false,
          onHide: function(){
            $('button#finish-tutorial').hide();
          }
        });
        // Destroy popup events
        $('#block-container').popup('destroy');
        $('#edit-div').popup('destroy');
        $('#display-svg svg').popup('destroy');
        $('#console-title').popup('destroy');
        // Remove custom popup contents
        $('#block-panel-pop').remove();
        $('#edit-panel-pop').remove();
        $('#display-panel-pop').remove();
        $('#console-pop').remove();

        $('div#dimmer-message .content .center')
          .empty()
          .append(gameTexts['1_1'].tutorial.end_tutorial);
        $('#close-console').click();
        $('div#dimmer-message')
          .dimmer('destroy')
          .dimmer({
            onHide: function(){
              $('#block-container')
                .popup({
                  position : 'bottom left',
                  offset : $("#block-container .block.output").offset().left - $("#block-container").offset().left,
                  content  : 'First, drag the "output" block to the edit panel then the "value" block at right side of the "output"',
                  onHide : function(){
                    $('#block-container').popup('destroy');
                  }
                }).popup('show');
            }
          })
          .dimmer('toggle');

        var outputValueListener = EventManager;
        var isOutputDragged = false;
        var isValueDragged = false;
        outputValueListener.subscribe('blockDragged', function(e, param){
          var block = param.block;
          if($(block.node).is(".block.output")){
            isOutputDragged = true;
            // if()
          }else if($(block.node).is(".block.value")){
            isValueDragged = true;
            $("#edit-div")
              .popup({
                position : 'top left',
                offset : -(compData.editPanelHeight / 2) + $(block.node).offset().top -2,
                content  : 'Now right click the "value" block and type "Hello World" (quotes included). If done, hit enter or click anywhere outside the menu.',
                on: 'click',
              }).popup('show');
          }
        });
        outputValueListener.subscribe('valueChanged', function(e, param){
          $("#edit-div").popup('destroy');
          $("#run-code")
            .popup({
              position : 'bottom center',
              content  : 'Click "Run" to execute your code',
              on: 'manual',
            }).popup('show');
        });
        outputValueListener.subscribe('successfulRun', function(e, param){
          $("#run-code").popup('hide').popup('destroy');
          $("#console-title").popup('hide').popup('destroy');
          $("#display-svg svg")
            .popup({
              position : 'top left',
              content  : 'See your output message here',
              on: 'click',
              onHide: function(){
                $("#dimmer-message .content .center")
                  .empty()
                  .append(gameTexts['1_1'].tutorial.experiment);
                $("#dimmer-message")
                  .dimmer('destroy')
                  .dimmer('show');

                $("#display-svg svg").popup('destroy');
                outputValueListener.unsubscribe('valueChanged');
                outputValueListener.unsubscribe('blockDragged');
                outputValueListener.unsubscribe('successfulRun');
                outputValueListener.unsubscribe('unsuccessfulRun');
              }
            }).popup('show');
        });
        outputValueListener.subscribe('unsuccessfulRun', function(e, param){
          $("#edit-div").popup('destroy');
          $("#console-title")
            .popup({
              position : 'top center',
              content  : 'Whenever there is an error, the console will be toggled and will list all errors. Use these error messages to debug your code.',
              on: 'click',
            }).popup('show');
        });
      });
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

/* jshint ignore:end */