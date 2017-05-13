/* jshint ignore:start */
$.ajax({
  beforeSend: function() {
    console.log("Page loading");
    // $(body).hide(); 
    $("#dimmer-message .content").hide();
    $("#dimmer-message").dimmer('show'); 
    // $("#block-panel-desc").hide();
  },
  complete: function(){
    console.log("Page done loading");
    $("#dimmer-message #loading").remove(); 
    $("#dimmer-message .content").show();
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

/////////////////////////////////////////////////////////// RUN CODE
  // Click function to run code. Get strings from edit panel then interpret then evalueate
  $('#run-code').click(function(event){
    var parser = quorum;
    // console.log("RUN CODE!");
    var ptr = compData.head;
    var ptr1;
    var code = "";
/////////////////////////////////////////////////////// TRANSLATE CODE TO JS
    while(ptr !== null){
      code += $(ptr.node).is(".block.value") ? "'"+ptr.select("text").attr("text")+"'": ptr.select("text").attr("text");

      ptr1 = ptr.node.right;
      while(ptr1!==null){
        if($(ptr1.node).is(".block.value")){
          var valueText = ptr1.select("text").attr("text")
          if(/\"[\S\s]*\"/.test(valueText) || /\'[\S\s]*\'/.test(valueText) || /[0-9]+\.[0-9]+/.test(valueText) || /[0-9]+/.test(valueText)){
            code += " " + valueText;
          }else{
            code += " '" + valueText + "'";
          }
        }else{
          code += " " + ptr1.select("text").attr("text");
        }
        ptr1 = ptr1.node.right;
      }

      code += "\n";
      ptr = ptr.node.nextLine;
    }
    $("#console-body").empty();
    $(".display.output").remove();
    console.log(code);
    var varArray = [];
    // var code = 
    //   "integer flag[5][7]\n"+
    //   "integer row = 0\n"+
    //   "integer col = 0\n"+
    //   "repeat 5 times\n"+
    //   "col = 0\n"+
    //   "repeat 7 times\n"+
    //   "if col = 0\n"+
    //   "flag[row][col] = 1\n"+
    //   "elseif row = 0\n"+
    //   "flag[row][col] = 1\n"+
    //   "elseif col = 6\n"+
    //   "flag[row][col] = 1\n"+
    //   "elseif row = 4\n"+
    //   "flag[row][col] = 1\n"+
    //   "else\n"+
    //   "flag[row][col] = 0\n"+
    //   "end\n"+
    //   "col = col + 1\n"+
    //   "end\n"+
    //   "row = row + 1\n"+
    //   "end";
    var lines = code.split('\n');
    var isError = false;
    var outputCode = "";
    var lineCount = 0;
/////////////////////////////////////////////////////// ERROR CHECKING
    $.each(lines, function(index, line){
      try{
        parser.yy.data = varArray;
        parser.yy.lineCount = lineCount;
        var output = parser.parse(line);
        var outputVarArray = output.variables;
        var outVarLastIndex = outputVarArray ? outputVarArray.length-1 : 0;
        var outputTerms = output.terms;
        outputCode += (output.isVarDec && outputVarArray[0].isArray) ? 
              ("var "+ outputVarArray[outputVarArray.length-1].name + " = "+getArraySize(outputVarArray[outputVarArray.length-1].arraySize)+";") :
              output.code;
        if(output.isOutput) lineCount+=1;
        // console.log(outputVarArray);
        // console.log(outputTerms);

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

        // Check array indices
        if(outputVarArray && outputVarArray[outVarLastIndex].isArray){
          var varName = outputVarArray[outVarLastIndex].name;
          var indices = outputVarArray[outVarLastIndex].arraySize;

          $.each(indices, function(i, ind){
            $.each(outputTerms, function(j, term){
              if(term.value === ind && term.type !== "integer"){
                isError = true;
                $("#console-body").append("<p>Error at line "+ (index+1) +": '" + term.value + "' is a '" + term.type + "'. Expecting an 'integer' as index of array '"+ varName +"'</p>");
              }
            });
          });
        }

        // Check if correct data type in arithmetic expressions
        $.each(outputTerms, function(i, term){
          var type = (outputVarArray && outputVarArray[0].type) ? outputVarArray[0].type : outputTerms[0].type;
          // console.log((outputVarArray[0].arraySize.indexOf(term.value)));
          if(type === "integer" && type !== term.type){
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
          });
        }
        
      }catch(e){
        isError = true;
        $("#console-body").append("<p>Error at line "+ (index+1) +": <br>"+e.message.split('\n').splice(1).join('<br>')+"</p>");
        // console.log("Error at line "+ (index+1) +": \n"+e.message.split('\n').splice(1).join('\n'));
        console.log(e);
      }
    });

    // console.log(isError);

    if(isError){
      if($('#open-console').css('display') === "block") $('#open-console').click();
      EventManager.publish("unsuccessfulRun");
    }
    else{
      // console.log(outputCode);
      try{
        if(level === "2_1"){
          outputCode = outputCode.replace(/var\sflag\s\=\s\[\[\]\]\;/g,"var flag = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];")
        }
        limitEval(outputCode.replace(/snapDisplay[^;]*;/g,""), function(success, returnValue) {
          if (success) {
            eval(outputCode);
            if(level === "1_2")
              EventManager.publish("successfulRun",{array: array});
            else if(level === "1_3")
              EventManager.publish("successfulRun",{result: result, value1: parseInt($(".block.value.value1").find('text').html()), value2: parseInt($(".block.value.value2").find('text').html())});
            else if(level === "1_4")
              EventManager.publish("successfulRun",{fibo: fibo});
            else if(level === "2_1")
              EventManager.publish("successfulRun",{flag: flag});
            else
              EventManager.publish("successfulRun");
          }
          else {
            if($('#open-console').css('display') === "block") $('#open-console').click();
            $("#console-body").append("<p>Error: There can be an infinite loop or array index out of bound</p>");
            EventManager.publish("unsuccessfulRun");
          }
        }, 5000);
      }catch(e){
        console.log(e.message);
        var errorMessage = e.message.split("\n")[0];
        if($('#open-console').css('display') === "block") $('#open-console').click();
        $("#console-body").append("<p>"+errorMessage+"</p>");
        EventManager.publish("unsuccessfulRun");
      }
    }
    console.log(outputCode);
  });
  
/////////////////////////////////////////////////////////// INITIALIZE FUNCTION
  var initializeBlockPanel = function(blocksNeeded){
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
  }

  // Get the array dimension of the declared variable
  var getArraySize = function(arrSize){
    output = "";
    for(var i=0; i < arrSize.length; i++){
      output = "[" + output + "]";
    }
    return output;
  }

  var appendToTail = function(block){
    var x = blockMargin;
    var y = 0;
    if(compData.head === null){
      x = blockMargin;
      y = blockMargin;
      compData.head = block;
    }else{
      x = blockMargin;
      y = compData.tail.getBBox().y2 + blockMargin;
      compData.tail.node.nextLine = block;
      block.node.prevLine = compData.head;
    }
    block.select('rect').attr({
      x: x,
      y: y
    });
    block.select('text').attr({
      x: x + textXPadding,
      y: y + textYPadding
    });
    addHover(block.node);
    compData.tail = block;
    snapEdit.add(block);
  }

  var appendToRight = function(target,block){
    var x = target.getBBox().x2 + blockMargin;
    var y = target.getBBox().y;
    block.select('rect').attr({
      x: x,
      y: y
    });
    block.select('text').attr({
      x: x + textXPadding,
      y: y + textYPadding
    });
    addHover(block.node);

    target.node.right = block;
    block.node.left = target;
    snapEdit.add(block);
  }

  var nullifyBlock = function(block){
    block.node.left = null;
    block.node.right = null;
    block.node.nextLine = null;
    block.node.prevLine = null;
  }

  var createBlock = function(type, text, panel=snapBlock){
    var block = panel.select(type).clone();
    if(text) block.select('text').attr({ text: text });

    nullifyBlock(block);
    updateRect(block);
    return block;
  }

  var initializeEditPanel = function(level){
    switch(level){
      case "1_1":
        // Do something
        break;
      case "1_2":
        var type = createBlock('g.block.type','integer');
        $(type.node).addClass('immovable uneditable undeletable');
        appendToTail(type);

        var array = createBlock('g.block.variable',"array[5]");
        $(array.node).addClass('immovable uneditable undeletable');
        appendToRight(type,array);

        var arr = [];
        var temp;
        var eq, val;
        for(var i=0; i<5; i++){ 
          arr.push(createBlock('g.block.variable','array['+i+']'));
          $(arr[i].node).addClass('immovable uneditable undeletable');
          temp = arr[i];
          appendToTail(temp);

          eq = createBlock('g.block.equal');
          $(eq.node).addClass('immovable undeletable');
          appendToRight(arr[i],eq);

          val = createBlock('g.block.value',""+i+"");
          $(val.node).addClass('immovable undeletable');
          appendToRight(eq,val);
        }
        break;
      case "1_3":
        // VALUE 1
        var typeValue1 = createBlock('g.block.type','integer');
        $(typeValue1.node).addClass('immovable uneditable undeletable');
        appendToTail(typeValue1);

        var var1 = createBlock('g.block.variable',"value1");
        $(var1.node).addClass('var1 immovable uneditable undeletable');
        appendToRight(typeValue1,var1);

        var equal1 = createBlock('g.block.equal',"=");
        $(equal1.node).addClass('immovable uneditable undeletable');
        appendToRight(var1,equal1);

        var val1 = createBlock('g.block.value',"5");
        $(val1.node).addClass('value1 immovable undeletable');
        appendToRight(equal1,val1);

        // VALUE 2 
        var typeValue2 = createBlock('g.block.type','integer');
        $(typeValue2.node).addClass('immovable uneditable undeletable');
        appendToTail(typeValue2);

        var var2 = createBlock('g.block.variable',"value2");
        $(var2.node).addClass('var2 immovable uneditable undeletable');
        appendToRight(typeValue2,var2);

        var equal2 = createBlock('g.block.equal',"=");
        $(equal2.node).addClass('immovable uneditable undeletable');
        appendToRight(var2,equal2);

        var val2 = createBlock('g.block.value',"2");
        $(val2.node).addClass('value2 immovable undeletable');
        appendToRight(equal2,val2);

        // RESULT
        var typeResult = createBlock('g.block.type','integer');
        $(typeResult.node).addClass('immovable uneditable undeletable');
        appendToTail(typeResult);

        var result = createBlock('g.block.variable',"result");
        $(result.node).addClass('result immovable uneditable undeletable');
        appendToRight(typeResult,result);

        var equal3 = createBlock('g.block.equal',"=");
        $(equal3.node).addClass('immovable uneditable undeletable');
        appendToRight(result,equal3);

        var val3 = createBlock('g.block.value',"0");
        $(val3.node).addClass('value2 immovable uneditable undeletable');
        appendToRight(equal3,val3);

        break;
      case "1_4":
        var type = createBlock('g.block.type','integer');
        $(type.node).addClass('immovable uneditable undeletable');
        appendToTail(type);

        var array = createBlock('g.block.variable',"fibo[5]");
        $(array.node).addClass('fibo immovable uneditable undeletable');
        appendToRight(type,array);
        break;
      case "2_1":
        var type = createBlock('g.block.type','integer');
        $(type.node).addClass('immovable uneditable undeletable');
        appendToTail(type);

        var array = createBlock('g.block.variable',"flag[5][7]");
        $(array.node).addClass('flag immovable uneditable undeletable');
        appendToRight(type,array);

        // Row
        var typeValue1 = createBlock('g.block.type','integer');
        $(typeValue1.node).addClass('immovable uneditable undeletable');
        appendToTail(typeValue1);

        var var1 = createBlock('g.block.variable',"row");
        $(var1.node).addClass('varRow immovable uneditable undeletable');
        appendToRight(typeValue1,var1);

        var equal1 = createBlock('g.block.equal',"=");
        $(equal1.node).addClass('immovable uneditable undeletable');
        appendToRight(var1,equal1);

        var val1 = createBlock('g.block.value',"0");
        $(val1.node).addClass('valRow immovable uneditable undeletable');
        appendToRight(equal1,val1);

        // Column
        var typeValue2 = createBlock('g.block.type','integer');
        $(typeValue2.node).addClass('immovable uneditable undeletable');
        appendToTail(typeValue2);

        var var2 = createBlock('g.block.variable',"col");
        $(var2.node).addClass('varCol immovable uneditable undeletable');
        appendToRight(typeValue2,var2);

        var equal2 = createBlock('g.block.equal',"=");
        $(equal2.node).addClass('immovable uneditable undeletable');
        appendToRight(var2,equal2);

        var val2 = createBlock('g.block.value',"0");
        $(val2.node).addClass('valCol immovable uneditable undeletable');
        appendToRight(equal2,val2);
      default:
        // Do something
    }
  }

  var initializeDisplayPanel = function(level){
    switch(level){
      case "1_1":
        snapDisplay.rect(10,10,$(snapDisplay.node).width()/1.04,$(snapDisplay.node).height()/2,9).attr({'fill-opacity': 0, stroke: black, strokeWidth: 2,});
        snapDisplay.line(20,45,($(snapDisplay.node).width()/1.04)-4,45).attr({stroke: black, strokeWidth: 2,});
        snapDisplay.text(20,35,'Output >>').attr({'font-size': 15, fill: black});
        break;
      case "1_2":
        var rectSize = 50;
        var x = $(snapDisplay.node).width()/3.5;
        var y = $(snapDisplay.node).height()*1.5/5;
        var xAdjust, yAdjust;
        var arrMargin = 10;

        snapDisplay.text(x-80,y+35,'array').attr({'font-size': 30, fill: black});
        for(var i=0; i<5 ; i++){
          xAdjust = x + i*(rectSize+10 + arrMargin);
          var arrayRect = snapDisplay.rect(xAdjust,y,rectSize+10,rectSize,9).attr({'fill-opacity': 0, stroke: black, strokeWidth: 2,});
          var arrayText = snapDisplay.text(xAdjust,y+35,"").attr({'font-size': 25, fill: black});
              arrayText.attr({x: xAdjust+(arrayRect.getBBox().width/2)-(arrayText.getBBox().width/2)});
          var arrayIndex = snapDisplay.text(xAdjust,y+rectSize+arrMargin*2,""+i+"").attr({'font-size': 16, fill: black});
              arrayIndex.attr({x: xAdjust+(arrayRect.getBBox().width/2)-(arrayIndex.getBBox().width/2)});
          var array = snapDisplay.g(arrayRect, arrayText).attr({class: "array-"+i});
        }
        
        var arrayGetter = EventManager;
        var testFlag = 0;
        var moduloCondition = false; // For IF TEST
        arrayGetter.subscribe('successfulRun', function(e, param){
          var output = param.array;
          var arrayBox, newText;

          for(var i=0; i<output.length; i++){
            xAdjust = x + i*(rectSize+10 + arrMargin);
            arrayBox = snapDisplay.select('g.array-'+i);
            newText = arrayBox.select('text').attr({ text: ""+output[i]+"" });
            newText.attr({x: xAdjust+(arrayBox.getBBox().width/2)-(newText.getBBox().width/2)});
          }

          switch(testFlag){
            case 0: // ARRAY TEST 1
              displayPopContent.empty().append(gameTexts["1_2"].display_1);
              displayPop.popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  exclusive: true,
                  on: 'manual',
                  popup : displayPopContent,
                  variation: "very wide",
                  onShow: function(){
                    $("#run-code").popup('hide').popup('destroy');
                    editPopContent.empty().append(gameTexts[level].edit_3);
                    $("button#pop-try").click(function(){
                      displayPop.popup('hide');
                      editPop
                        .popup('destroy')
                        .popup({
                          position : 'top left',
                          offset : -(compData.editPanelHeight / 2) + $("#edit-div .block.variable.uneditable").offset().top +5,
                          hoverable : false,
                          closable: false,
                          exclusive: true,
                          on: 'manual',
                          popup : editPopContent,
                          variation: "very wide",
                          onShow: function(){
                            testFlag = 1;
                          },
                          onHide: function(){
                            editPopContent.empty();
                          }
                        }).popup('show');
                    });
                  }
              }).popup('show');
              break;
            case 1: // ARRAY TEST 2 and REPEAT TEST
              editPop.popup('hide').popup('destroy');
              displayPopContent
                .empty()
                .append(gameTexts[level].display_2);
              displayPop
                .popup('destroy')
                .popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  exclusive: true,
                  on: 'manual',
                  popup : displayPopContent,
                }).popup('show');
              // Transition to repeat tutorial
              $('button#trigger-dimmer').click(function(){
                displayPop.popup('hide').popup('destroy');
                dimmerMessage.popup('hide').popup('destroy');
                dimmerMessageContent
                  .empty()
                  .append(gameTexts[level].repeat);
                dimmerMessage
                  .dimmer({
                    onHide: function(){
                      dimmerMessage.dimmer("destroy")
                      $('#scrollable-div').animate({scrollLeft:'+=700px'});
                      blockPop
                        .popup({
                          position : 'bottom center',
                          offset : $("#block-container .block.close-parenthesis").offset().left - $("#block-container").width()/2,
                          content  : 'Drag the repeat block to the edit panel.',
                          on: "hover",
                          onHidden : function(){
                            blockPop.popup('destroy');
                          }
                        }).popup('show');
                    }
                  }).dimmer("show");
              });
              // Check if REPEAT block was dragged
              var repeatChecker = EventManager;
              var isTypeInteger = false;
              var isVariable_i = false;
              var isEqualDragged = false;
              var isValueEqualsZero = false;
              var varDeclarationDone = false;
              var isValueEqualsFive = false;
              var repeatDone = false;

              var iCounter = 0;
              var isVariDeclared = false;
              var isEqualDragged1 = false;
              var isVariAdded = false;
              var isPlusDragged = false;
              var isValue1 = false;
              var iIncrement = false;

              var arrayiDeclared = false;
              var isEqualDragged2 = false;
              var isVariAdded1 = false;
              var isArriAssigned = false;

              repeatChecker.subscribe("blockDeleted", function(e, param){
                var target = $(param.target.node);
                var targetValue = param.target.select('text').attr('text');

                if(!varDeclarationDone){
                  if(target.is('.block.type') && targetValue === "integer"){
                    isTypeInteger = false;
                  }
                  else if(target.is('.block.variable') && targetValue === "i"){
                    isVariable_i = false;
                  }
                  else if(target.is('.block.equal')){
                    isEqualDragged = false;
                  }
                  else if(target.is('.block.value') && targetValue === "0"){
                    isValueEqualsZero = false;
                  }
                }
                else{
                  if(!repeatDone){
                    if(target.is('.block.repeat')){
                      repeatDone = false;
                    }else if(target.is('.block.value') && targetValue === "5"){
                      repeatDone = false;
                    }
                  }
                  else{
                    if(!iIncrement){
                      if(target.is('.block.variable') && targetValue === "i"){
                        if(!isEqualDragged1 || iCounter===0){
                          isVariDeclared = false;
                        }
                        else{
                          isVariAdded = false;
                        }
                        iCounter -= 1;
                      }else if(target.is('.block.equal')){
                        isEqualDragged1 = false;
                      // }else if(repeatDone && target.is('.block.variable') && targetValue === "i"){
                      //   repeatDone = false;
                      }else if(target.is('.block.addition')){
                        isPlusDragged = false;
                      }else if(target.is('.block.value') && targetValue === "0"){
                        isValue1 = false;
                      }
                    }else{
                      if(target.is(".block.variable")){
                          if(targetValue === "array[i]"){
                              arrayiDeclared = false;
                          }else if(targetValue === "i"){
                              isVariAdded1 = false;
                          }
                      }
                      else if(target.is(".block.equal")){
                        isEqualDragged2 = true;
                      }
                    }
                  }
                }
              });

              repeatChecker.subscribe('blockDragged', function(e, param){
                var draggedBlock = $(param.block.node);

                if(!varDeclarationDone){
                  if(draggedBlock.is('.block.repeat')){
                    editPopContent.empty().append(gameTexts[level].repeat_types);
                    editPop
                      .popup('destroy')
                      .popup({
                        position : 'top left',
                        offset : -(compData.editPanelHeight / 2) + $(param.block.node).offset().top,
                        hoverable : false,
                        closable: false,
                        exclusive: true,
                        on: 'click',
                        popup : editPopContent,
                        variation: "very wide",
                      }).popup('show');
                    $("button#close-repeat").click(function(){
                      editPop.popup('hide');
                    });
                  }
                  else if(draggedBlock.is('.block.type')){
                    repeatChecker.subscribe('updateType', function(e, param){
                      if(param.type === "integer"){
                        isTypeInteger = true;
                        varDeclarationDone = checkIfDoneWithInstruction("varDeclaration", {isTypeInteger: isTypeInteger, isVariable_i: isVariable_i, isEqualDragged: isEqualDragged, isValueEqualsZero: isValueEqualsZero}, repeatChecker);
                      }else{
                        editPop
                          .popup('destroy')
                          .popup({
                            position : 'top left',
                            offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.type")[1]).offset().top - 65,
                            content  : "Don't forget your variable should be an integer",
                            on: "hover",
                            onHidden : function(){
                              editPop.popup('destroy');
                            }
                          }).popup('show');
                      }
                    });
                  }
                  else if(draggedBlock.is('.block.variable')){
                    repeatChecker.subscribe('variableChanged', function(e, param){
                      if(param.newName === "i"){
                        isVariable_i = true;
                        varDeclarationDone = checkIfDoneWithInstruction("varDeclaration", {isTypeInteger: isTypeInteger, isVariable_i: isVariable_i, isEqualDragged: isEqualDragged, isValueEqualsZero: isValueEqualsZero}, repeatChecker);
                      }else{
                        editPop
                          .popup('destroy')
                          .popup({
                            position : 'top left',
                            offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.variable")[6]).offset().top - 65,
                            content  : "The variable name should be 'i'!",
                            on: "hover",
                            onHidden : function(){
                              editPop.popup('destroy');
                            }
                          }).popup('show');
                      }
                    });
                  }
                  else if(draggedBlock.is('.block.equal')){
                    isEqualDragged = true;
                    varDeclarationDone = checkIfDoneWithInstruction("varDeclaration", {isTypeInteger: isTypeInteger, isVariable_i: isVariable_i, isEqualDragged: isEqualDragged, isValueEqualsZero: isValueEqualsZero}, repeatChecker);
                  }
                  else if(draggedBlock.is('.block.value')){
                    repeatChecker.subscribe('valueChanged', function(e, param){
                      if(param.newText === "0"){
                        isValueEqualsZero = true;
                        varDeclarationDone = checkIfDoneWithInstruction("varDeclaration", {isTypeInteger: isTypeInteger, isVariable_i: isVariable_i, isEqualDragged: isEqualDragged, isValueEqualsZero: isValueEqualsZero}, repeatChecker);
                      }else{
                        editPop
                          .popup('destroy')
                          .popup({
                            position : 'top left',
                            offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.type")[1]).offset().top - 65,
                            content  : "The value should be zero!",
                            on: "hover",
                            onHidden : function(){
                              editPop.popup('destroy');
                            }
                          }).popup('show');
                      }
                    });
                  }
                }
                else{
                  if(!repeatDone){
                    repeatChecker.unsubscribe('variableChanged');
                    repeatChecker.unsubscribe('valueChanged');
                    repeatChecker.subscribe('valueChanged', function(e, param){
                      if(param.newText === "5"){
                        repeatDone = true;
                        editPopContent.empty().append(gameTexts[level].done_with_repeat);
                        editPop
                          .popup('destroy')
                          .popup({
                            position : 'top left',
                            offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.repeat")[0]).offset().top - 65,
                            hoverable : false,
                            closable: false,
                            exclusive: true,
                            on: 'manual',
                            popup : editPopContent,
                            variation: "very wide"
                          }).popup('show');
                        $("button#finish-repeat").click(function(){
                          editPop.popup('hide').popup('destroy');
                          editPop
                            .popup('destroy')
                            .popup({
                              position : 'top left',
                              offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.repeat")[0]).offset().top - 65,
                              content  : "Let us first increment i. Inside the loop, just add i with 1 and store it to i. (i = i + 1)",
                              on: "hover",
                              onHidden : function(){
                                editPop.popup('destroy');
                                repeatChecker.unsubscribe('valueChanged');
                                repeatChecker.unsubscribe('variableChanged');
                                repeatChecker.unsubscribe('updateType');
                              }
                            }).popup('show');
                        });
                      }else if(param.newText !== "5"){
                        editPop
                          .popup('destroy')
                          .popup({
                            position : 'top left',
                            offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.repeat")[0]).offset().top - 65,
                            content  : "The value should be five because we are going to loop five times which is the size of the array!",
                            on: "hover",
                    
                            onHidden : function(){
                              editPop.popup('destroy');
                            }
                          }).popup('show');
                      }
                    });
                  }
                  else{
                    repeatChecker.subscribe('variableChanged',function(e, param){
                      if(varDeclarationDone){
                        if(repeatDone){
                          if(!iIncrement){
                              if(param.newName === "i"){
                                if(iCounter===0){
                                  isVariDeclared = true;
                                  iCounter = 1;
                                  iIncrement = checkIfDoneWithInstruction("iIncrement", {isVariDeclared: isVariDeclared, isVariAdded: isVariAdded, isEqualDragged1: isEqualDragged1, isPlusDragged: isPlusDragged, isValue1: isValue1});
                                }else if(iCounter === 1){
                                  isVariAdded = true;
                                  iIncrement = checkIfDoneWithInstruction("iIncrement", {isVariDeclared: isVariDeclared, isVariAdded: isVariAdded, isEqualDragged1: isEqualDragged1, isPlusDragged: isPlusDragged, isValue1: isValue1});
                                }
                              }else{
                                editPop
                                  .popup('destroy')
                                  .popup({
                                    position : 'top left',
                                    offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.variable")[7]).offset().top - 65,
                                    content  : "Varible name should be i",
                                    on: "hover",
                                    onHidden : function(){
                                      editPop.popup('destroy');
                                    }
                                  }).popup('show');
                              }
                          }
                          else{
                            if(param.newName === "array[i]"){
                                arrayiDeclared = true;
                                isArriAssigned = checkIfDoneWithInstruction("arrayiAssign", {arrayiDeclared: arrayiDeclared, isEqualDragged2: isEqualDragged2, isVariAdded1: isVariAdded1}, repeatChecker);
                            }else if(param.newName === "i"){
                                isVariAdded1 = true;
                                isArriAssigned = checkIfDoneWithInstruction("arrayiAssign", {arrayiDeclared: arrayiDeclared, isEqualDragged2: isEqualDragged2, isVariAdded1: isVariAdded1}, repeatChecker);
                            }else{
                              editPop
                                .popup('destroy')
                                .popup({
                                  position : 'top left',
                                  offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.variable")[7]).offset().top - 65,
                                  content  : "The expression should be 'array[i] = i'.",
                                  on: "hover",
                                  onHidden : function(){
                                    editPop.popup('destroy');
                                  }
                                }).popup('show');
                            }
                          }
                        }
                      }
                    });

                    if(!iIncrement){
                      if(draggedBlock.is(".block.variable")){
                        
                      }
                      else if(draggedBlock.is(".block.equal")){
                        isEqualDragged1 = true;
                        iIncrement = checkIfDoneWithInstruction("iIncrement", {isVariDeclared: isVariDeclared, isVariAdded: isVariAdded, isEqualDragged1: isEqualDragged1, isPlusDragged: isPlusDragged, isValue1: isValue1});
                      }
                      else if(draggedBlock.is(".block.add")){
                        isPlusDragged = true;
                        iIncrement = checkIfDoneWithInstruction("iIncrement", {isVariDeclared: isVariDeclared, isVariAdded: isVariAdded, isEqualDragged1: isEqualDragged1, isPlusDragged: isPlusDragged, isValue1: isValue1});
                      }
                      else if(draggedBlock.is(".block.value")){
                        repeatChecker.subscribe('valueChanged', function(e, param){
                          if(param.newText === "1"){
                            isValue1 = true;
                            iIncrement = checkIfDoneWithInstruction("iIncrement", {isVariDeclared: isVariDeclared, isVariAdded: isVariAdded, isEqualDragged1: isEqualDragged1, isPlusDragged: isPlusDragged, isValue1: isValue1});
                          }else{
                            editPop
                              .popup('destroy')
                              .popup({
                                position : 'top left',
                                offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.variable")[7]).offset().top - 65,
                                content  : "Value should be 1 because we will increment i by 1 every loop.",
                                on: "hover",
                                onHidden : function(){
                                  editPop.popup('destroy');
                                }
                              }).popup('show');
                          }
                        });
                      }

                      if(iIncrement){
                        repeatChecker.unsubscribe("variableChanged");
                        repeatChecker.unsubscribe("valueChanged");
                        repeatChecker.unsubscribe("updateType");
                        editPop.popup('destroy');
                      }
                    }else{
                      if(draggedBlock.is(".block.variable")){
                        // repeatChecker.subscribe('variableChanged',function(e, param){
                          
                        // });
                      }
                      else if(draggedBlock.is(".block.equal")){
                        isEqualDragged2 = true;
                        isArriAssigned = checkIfDoneWithInstruction("arrayiAssign", {arrayiDeclared: arrayiDeclared, isEqualDragged2: isEqualDragged2, isVariAdded1: isVariAdded1}, repeatChecker);
                      }
                    }
                  }
                }
              });

              var checkIfDoneWithInstruction = function(instruction, condition, eventManager){
                var isDone = false;
                switch(instruction){
                  case "varDeclaration" : 
                    if(condition.isTypeInteger && condition.isVariable_i && condition.isEqualDragged && condition.isValueEqualsZero){
                      eventManager.unsubscribe("variableChanged");
                      eventManager.unsubscribe("valueChanged");
                      eventManager.unsubscribe("updateType");
                      editPop
                        .popup('destroy')
                        .popup({
                          position : 'top left',
                          offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.repeat")[0]).offset().top - 65,
                          content  : "Now let's loop five times. Drag a vluae block and change it to 5",
                          on: "click",
                          onHidden : function(){
                            editPop.popup('destroy');
                          }
                        }).popup('show');
                      isDone = true;
                    }
                    break;
                  case "iIncrement":
                    if(condition.isVariDeclared && condition.isVariAdded && condition.isEqualDragged1 && condition.isPlusDragged && condition.isValue1 ){
                      editPop
                        .popup('destroy')
                        .popup({
                          position : 'top left',
                          offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.repeat")[0]).offset().top - 65,
                          content  : "Now we can use i as an index number to access the array by simply typing 'array[i]' in a variable block. With this, we can manipulate the values of the array. Try building this code 'array[i] = i' above the 'i = i + 1' and then hit run.",
                          on: "click",
                          onHidden : function(){
                            editPop.popup('destroy');
                          }
                        }).popup('show');
                      isDone = true;
                    }
                    break;
                  case "arrayiAssign" :
                    if(condition.arrayiDeclared && condition.isEqualDragged2 && condition.isVariAdded1){
                      eventManager.unsubscribe("variableChanged");
                      eventManager.unsubscribe("valueChanged");
                      eventManager.unsubscribe("updateType");
                      eventManager.unsubscribe("blockDragged");
                      testFlag = 2;
                      editPop
                        .popup('destroy')
                        .popup({
                          position : 'top left',
                          offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.repeat")[0]).offset().top - 65,
                          content  : "Now hit run to test our code.",
                          on: "click",
                          onHidden : function(){
                            editPop.popup('destroy');
                          }
                        }).popup('show');
                      isDone = true;
                    }
                    break;
                  default:
                    // DO SOMETHING
                }
                return isDone;
              }
              break;
            case 2: // IF TEST
              // $("#run-code").addClass('disabled');
              displayPopContent.empty().append(gameTexts[level].loop_done);
              displayPop
                .popup('destroy')
                .popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  exclusive: true,
                  on: 'manual',
                  popup : displayPopContent,
                }).popup('show');
              // Transition to repeat tutorial
              $('button#finish_loop').click(function(){
                displayPop.popup('hide').popup('destroy');
                dimmerMessage.popup('hide').popup('destroy');
                dimmerMessageContent
                  .empty()
                  .append(gameTexts[level].if);
                dimmerMessage
                  .dimmer({
                    onHide: function(){
                      $('#scrollable-div').animate({scrollLeft:'+=700px'});
                      blockPop
                        .popup({
                          position : 'bottom center',
                          offset : $("#block-container").width() * (3/10),
                          content  : 'Drag the if block inside the repeat loop, just below the repeat block. Also, delete all the blocks inside the repeat loop except the "i = i + 1"',
                          on: "hover",
                          onHidden : function(){
                            blockPop.popup('destroy');
                          }
                        }).popup('show');
                      dimmerMessage.dimmer("destroy");
                    }
                  }).dimmer("show");
              });
              var eventChecker = EventManager;
              var checkForModExp = false;
              var isVariAdded = false;
              var isModAdded = false;
              var isValue2 = false;
              var isEqualEqualAdded = false;
              var isValue0 = false;

              eventChecker.subscribe('blockDragged', function(e, param){
                var target = $(param.block.node);
                var targetValue = param.block.select('text').attr('text');

                if(!checkForModExp){
                  if(target.is(".block.if")){
                    editPopContent.empty().append(gameTexts[level].if_types);
                      editPop
                        .popup('destroy')
                        .popup({
                          position : 'left center',
                          // offset : -(compData.editPanelHeight / 2) + $(param.block.node).offset().top,
                          hoverable : false,
                          closable: false,
                          exclusive: true,
                          on: 'click',
                          popup : editPopContent,
                          variation: "very wide",
                        }).popup('show');
                      $("button#close-if").click(function(){
                        editPop.popup('hide');
                        editPop
                            .popup('destroy')
                            .popup({
                              position : 'top left',
                              offset : -(compData.editPanelHeight / 2) + $(param.block.node).offset().top - 65,
                              content  : "Now let's try adding an ELSE block. Right click on the IF block and select 'Add else'.",
                              on: "click",
                              onHidden : function(){
                                editPop.popup('destroy');
                              }
                            }).popup('show');
                      });
                  }
                }
                else{
                  if(target.is(".block.variable")){}
                  else if(target.is(".block.mod")){
                    isModAdded = true;
                  }
                  else if(target.is(".block.value")){}
                  else if(target.is(".block.equal-equal")){
                    isEqualEqualAdded = true;
                  }
                  else if(target.is(".block.equal")){
                    editPop
                      .popup('destroy')
                      .popup({
                        position : 'top left',
                        offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.if")[0]).offset().top - 65,
                        content  : "Please take note that the white '=' is used to assign a value to a variable and the green '=' is a boolean operator to check equality of two values.",
                        on: "hover",
                        onHidden : function(){
                          editPop.popup('destroy');
                        }
                      }).popup('show');
                  }
                  moduloCondition = checkIfDoneWithInstruction("createModuloCondition", {isVariAdded: isVariAdded, isModAdded: isModAdded, isValue2: isValue2, isValue0: isValue0, isEqualEqualAdded: isEqualEqualAdded});
                }
              });

              eventChecker.subscribe('variableChanged', function(e, param){
                if(checkForModExp){
                  if(param.newName === "i"){
                    isVariAdded = true;
                  }
                  moduloCondition = checkIfDoneWithInstruction("createModuloCondition", {isVariAdded: isVariAdded, isModAdded: isModAdded, isValue2: isValue2, isValue0: isValue0, isEqualEqualAdded: isEqualEqualAdded});
                }
              });

              eventChecker.subscribe('valueChanged', function(e, param){
                if(checkForModExp){
                  if(param.newText === "2"){
                    isValue2 = true;
                  }
                  else if(param.newText === "0"){
                    isValue0 = true;
                  }

                  moduloCondition = checkIfDoneWithInstruction("createModuloCondition", {isVariAdded: isVariAdded, isModAdded: isModAdded, isValue2: isValue2, isValue0: isValue0, isEqualEqualAdded: isEqualEqualAdded});
                }
              });

              eventChecker.subscribe('elseInserted', function(e, param){
                editPop
                  .popup('destroy')
                  .popup({
                    position : 'top left',
                    offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.if")[0]).offset().top - 65,
                    content  : "Next, we need to add a condition on the right side of the IF block to know when the index(variable i) is even. [HINT: the MOD block or the modulo operator is needed]",
                    on: "click",
                    onHidden : function(){
                      checkForModExp = true;
                      editPop.popup('destroy');
                    }
                  }).popup('show');
              });

              var checkIfDoneWithInstruction = function(instruction, condition, eventManager){
                var isDone = false;
                switch(instruction){
                  case "createModuloCondition":
                    if(condition.isVariAdded && condition.isModAdded && condition.isValue2 && condition.isValue0 && condition.isEqualEqualAdded){
                      editPop
                        .popup('destroy')
                        .popup({
                          position : 'top left',
                          offset : -(compData.editPanelHeight / 2) + $($("#edit-div .block.if")[0]).offset().top - 65,
                          title: "Good Job!",
                          content  : "Finally let us store zero to 'array[i]' when 'i' is even, else store 1. Just build the code 'array[i]=0' below the IF block and 'array[i]=1' below the ELSE block",
                          on: "hover",
                          onHidden : function(){
                            eventChecker.unsubscribe('blockDragged');
                            eventChecker.unsubscribe('variableChanged');
                            eventChecker.unsubscribe('valueChanged');
                            eventChecker.unsubscribe('elseInserted');
                            editPop.popup('destroy');
                          }
                        }).popup('show');
                      // $("#run-code").removeClass('disabled');
                      isDone = true;
                    }
                    break;
                  default:
                    // DO SOMETHING
                }

                return isDone;
              }

              if(moduloCondition){
                var expected = [0,1,0,1,0];
                var is_same = (output.length == expected.length) && expected.every(function(element, index) {
                    return element === parseInt(output[index]); 
                });

                if(is_same){
                  displayPopContent.empty().append(gameTexts[level].if_done);
                  displayPop.popup({
                      position: "top center",
                      hoverable : false,
                      closable: false,
                      exclusive: true,
                      on: 'manual',
                      popup : displayPopContent
                  }).popup('show');
                  $("button#exit-level").click(function(){
                    displayPop.popup('hide').popup('destroy');
                    editPop.popup('destroy');
                    blockPop.popup('destroy');

                    dimmerMessage.popup('hide').popup('destroy');
                    dimmerMessageContent
                      .empty()
                      .append(gameTexts[level].level_exit);
                    dimmerMessage.dimmer("show");
                  });
                }else{
                  displayPop
                    .popup('destroy')
                    .popup({
                      position : 'top center',
                      title: "Not Quite",
                      content  : "Check if your condition is correct and check if you correctly store 0 to even indices and 1 to odd indices.",
                      on: "hover",
                      onHidden : function(){
                        editPop.popup('destroy');
                      }
                    }).popup('show');
                }
              }

              break;
            default:
              console.log("SOBRA NA RUN");
              break;
          }
        });        
        break;
      case "1_3":
        snapDisplay.rect(10,10,$(snapDisplay.node).width()/1.04,$(snapDisplay.node).height()/2,9).attr({'fill-opacity': 0, stroke: black, strokeWidth: 2,});
        snapDisplay.line(20,45,($(snapDisplay.node).width()/1.04)-4,45).attr({stroke: black, strokeWidth: 2,});
        snapDisplay.text(20,35,'Output >>').attr({'font-size': 15, fill: black});
        break;
      case "1_4":
        var rectSize = 50;
        var x = $(snapDisplay.node).width()/3.5;
        var y = $(snapDisplay.node).height()*1.5/5;
        var xAdjust, yAdjust;
        var arrMargin = 10;

        snapDisplay.text(x-65,y+35,'fibo').attr({'font-size': 30, fill: black});
        for(var i=0; i<5 ; i++){
          xAdjust = x + i*(rectSize+10 + arrMargin);
          var arrayRect = snapDisplay.rect(xAdjust,y,rectSize+10,rectSize,9).attr({'fill-opacity': 0, stroke: black, strokeWidth: 2,});
          var arrayText = snapDisplay.text(xAdjust,y+35,"").attr({'font-size': 25, fill: black});
              arrayText.attr({x: xAdjust+(arrayRect.getBBox().width/2)-(arrayText.getBBox().width/2)});
          var arrayIndex = snapDisplay.text(xAdjust,y+rectSize+arrMargin*2,""+i+"").attr({'font-size': 16, fill: black});
              arrayIndex.attr({x: xAdjust+(arrayRect.getBBox().width/2)-(arrayIndex.getBBox().width/2)});
          var array = snapDisplay.g(arrayRect, arrayText).attr({class: "array-"+i});
        }
      case "2_1":
        var rectSize = 50;
        var x = $(snapDisplay.node).width()/4;
        var y = $(snapDisplay.node).height()/8;
        var xAdjust, yAdjust;
        var arrMargin = 5;

        snapDisplay.text(x-rectSize,y-arrMargin,'flag').attr({'font-size': 25, fill: black});
        for(var i=0; i<5 ; i++){
          yAdjust = y + i*(rectSize + arrMargin);
          for(var j=0; j<7; j++){
            xAdjust = x + j*(rectSize + arrMargin);
            var arrayRect = snapDisplay.rect(xAdjust,yAdjust,rectSize,rectSize,9).attr({'fill-opacity': 0, stroke: black, strokeWidth: 2,});
            $(arrayRect.node).addClass("rect_"+i+"_"+j);
            if(i===0){
              var arrayIndex = snapDisplay.text(xAdjust,y-arrMargin,""+j+"").attr({'font-size': 20, fill: black});
              arrayIndex.attr({x: xAdjust+(arrayRect.getBBox().width/2)-(arrayIndex.getBBox().width/2)});
            }
          }
          var arrayIndex = snapDisplay.text(x-arrMargin-rectSize/4,y,""+i+"").attr({'font-size': 20, fill: black});
          arrayIndex.attr({y: yAdjust+(arrayRect.getBBox().width/2)+(arrayIndex.getBBox().height/4)});
        }
        break;
      default:
        // Do something
    }
  }

/////////////////////////////////////////////////////////// HTML INITIALIZATION
  // Default list of blocks
  var blocksNeeded = ["type","variable","equal","value","output",
                      "addition","subtraction","multiplication", "division", "modulo", "open_par","close_par",
                      "less", "greater", "less_equal","greater_equal", "equal_equal","not_equal", "and", "or",
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

      initializeBlockPanel(blocksNeeded);
      initializeDisplayPanel(level);
      // Initialize Display SVG
      
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
      blocksNeeded = ["type","variable","equal","value",
                      "addition","subtraction","multiplication", "division", "modulo", "open_par","close_par",
                      "less", "greater", "less_equal","greater_equal", "equal_equal","not_equal", "and", "or",
                      "if","repeat"];
            // Initialize Sidebar
      $("a#side-prev").attr({href:'game.html?level=1_1'});
      $("a#side-next").attr({href:'game.html?level=1_3'});

      initializeBlockPanel(blocksNeeded);
      initializeEditPanel(level);
      initializeDisplayPanel(level);
      // Initialize Popups
      dimmerMessageContent.append(gameTexts['1_2'].arrays);

      $("#run-code").addClass('disabled');
      $("#clear-code").addClass('disabled');
      dimmerMessage.dimmer({
        onShow: function(){
          // $('div#block-panel-pop').hide();
        },
        onHide: function(){
          dimmerMessage.dimmer('destroy');
          editPopContent.append(gameTexts[level].edit_1);
          $("#pop-index").click(function(){
            editPop.popup('hide');
          });
          editPop
            .popup({
              position : 'top center',
              offset : -(editPop.height()/2) + $($("#edit-div .block.type.uneditable")[0]).offset().top -10,
              hoverable : false,
              closable: false,
              exclusive: true,
              on: 'manual',
              popup : editPopContent,
              variation: "wide",
              onHidden: function(){
                editPopContent.empty().append(gameTexts[level].edit_2);
                $("#pop-run").click(function(){
                  editPop.popup('hide');
                });
                editPop
                  .popup('destroy')
                  .popup({
                    position : 'top left',
                    offset : -(editPop.height()/2) + $($("#edit-div .block.variable.uneditable")[2]).offset().top - 13,
                    hoverable : false,
                    closable: false,
                    exclusive: true,
                    on: 'manual',
                    popup : editPopContent,
                    variation: "very wide",
                    onHide: function(){
                      editPop.popup('destroy');
                      $("#run-code").removeClass('disabled');
                      $("#run-code")
                        .popup({
                          position : 'bottom center',
                          content  : "Now let's try to run this code and see what happens on the display panel.",
                          on: 'manual',
                          onHide: function(){
                            editPop.popup('destroy');
                            editPopContent.empty();
                          }
                        }).popup('show');
                    }
                  }).popup('show');
              }
            }).popup('show');
        }
      }).dimmer('show');

      break;
    case "1_3":
      blocksNeeded = ["type","variable","equal","value","output",
                      "addition","subtraction", "open_par","close_par",
                      "less", "greater", "less_equal","greater_equal", "equal_equal","not_equal", "and", "or",
                      "if","repeat"];
      $("a#side-prev").attr({href:'game.html?level=1_2'});
      $("a#side-next").attr({href:'game.html?level=1_4'});

      initializeBlockPanel(blocksNeeded);
      initializeEditPanel(level);
      initializeDisplayPanel(level);
      // Initialize Popups
      dimmerMessageContent.append(gameTexts[level].mult_repeated_add);
      dimmerMessage.dimmer({
        onHide: function(){
          editPopContent.empty().append(gameTexts[level].mult_var);
          editPop
            .popup('destroy')
            .popup({
              position : 'top left',
              offset : -(compData.editPanelHeight / 2) + $(".block.variable.var1").offset().top - 65,
              hoverable : false,
              closable: false,
              exclusive: true,
              on: 'manual',
              popup : editPopContent,
              variation: "wide",
            }).popup('show');
          $("#next-to-result").click(function(){
            editPopContent.empty().append(gameTexts[level].mult_result);
            editPop
              .popup('destroy')
              .popup({
                position : 'top left',
                offset : -(compData.editPanelHeight / 2) + $(".block.variable.result").offset().top - 65,
                hoverable : false,
                closable: false,
                exclusive: true,
                on: 'manual',
                popup : editPopContent,
                variation: "wide",
              }).popup('show');
            $("#next-to-start").click(function(){
              // editPop.popup('hide').popup('destroy');
              editPopContent.empty().append(gameTexts[level].mult_start);
              editPop
                .popup('destroy')
                .popup({
                  position : 'top left',
                  offset : -(compData.editPanelHeight / 2) + $(".block.variable.result").offset().top + blockHeight + blockMargin - 65,
                  hoverable : false,
                  closable: false,
                  exclusive: true,
                  on: 'manual',
                  popup : editPopContent,
                  variation: "wide",
                }).popup('show');
              $("#start-mult").click(function(){
                editPop.popup('hide').popup('destroy');
              });
            });
          });
        }
      });

      var failCounter = 0;
      var outputChecker = EventManager;
      var isMultDone = false;
      var isDivDone = false;

      var isOutputDragged = false;
      var isRepeatDragged = false;

      outputChecker.subscribe('successfulRun', function(e, param){
        var output = param.result;
        var value1 = parseInt(param.value1);
        var value2 = parseInt(param.value2);

        if(!isMultDone){
          if(isRepeatDragged && isOutputDragged && value1*value2 === output){
            displayPopContent.empty().append(gameTexts[level].mult_display_success);
            displayPop
              .popup('destroy')
              .popup({
                position: "top center",
                hoverable : false,
                closable: false,
                exclusive: true,
                on: 'manual',
                popup : displayPopContent,
                variation: "wide"
            }).popup('show');
            $("#exit-mult-success").click(function(){
              isMultDone = true;
              failCounter = 0;
              displayPop.popup('hide').popup('destroy');
              dimmerMessageContent.empty().append(gameTexts[level].div_repeated_sub);
              dimmerMessage
                .dimmer('destroy')
                .dimmer({
                  onHide: function(){
                    editPop
                      .popup('destroy')
                      .popup({
                        position: "top left",
                        offset : -(compData.editPanelHeight / 2) + $($("svg#edit-panel .block.repeat")[0]).offset().top - 65,
                        hoverable : false,
                        closable: false,
                        content: "Here, we are going to use REPEATWHILE so right click on the REPEAT block and choose 'repeat while'",
                        on: 'hover',
                        variation: "wide",
                        onHidden: function(){
                          editPop.popup('destroy');
                        }
                    }).popup('show');
                  }
                }).dimmer('show');
            });
          }else{
            failCounter +=1;
            if(!isRepeatDragged){
              displayPop
                .popup('destroy')
                .popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  title: 'You forgot something..',
                  content: "We need to use the REPEAT block on this level.",
                  on: 'click',
                  variation: "wide",
                  onHide: function(){
                    displayPop.popup('destroy');
                  }
              }).popup('show');
            }
            else if(!isOutputDragged){
              displayPop
                .popup('destroy')
                .popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  title: 'You forgot something..',
                  content: "Don't forget to output your result.",
                  on: 'click',
                  variation: "wide",
                  onHidden: function(){
                    displayPop.popup('destroy');
                  }
              }).popup('show');
            }else{
              displayPop
                .popup('destroy')
                .popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  title: 'Not Quite',
                  content: "Oops! It seems your result does not match. Check if you correctly add your values and store it to variable 'result'. Don't forget to initialize the result as 0.",
                  on: 'click',
                  variation: "wide",
                  onHidden: function(){
                    displayPop.popup('destroy');
                  }
              }).popup('show');

              if(failCounter > 6){
                editPop
                .popup('destroy')
                .popup({
                  position: "top left",
                  offset : -(compData.editPanelHeight / 2) + $($("svg#edit-panel .block.repeat")[0]).offset().top - 65,
                  hoverable : false,
                  closable: false,
                  title: "Hint",
                  content: "5x2 means add 2 to result 5 times.",
                  on: 'click',
                  variation: "wide",
                  onHidden: function(){
                    editPop.popup('destroy');
                  }
                }).popup('show');
              }
            }

          }
        }
        else{
          if(isRepeatDragged && isOutputDragged && parseInt(value1/value2) === output){
            displayPopContent.empty().append(gameTexts[level].div_display_success);
            displayPop
              .popup('destroy')
              .popup({
                position: "top center",
                hoverable : false,
                closable: false,
                exclusive: true,
                on: 'manual',
                popup : displayPopContent,
                variation: "wide"
            }).popup('show');
            $("#exit-div-success").click(function(){
              failCounter = 0;
              displayPop.popup('hide').popup('destroy');
              dimmerMessageContent.empty().append(gameTexts[level].level_exit);
              dimmerMessage
                .dimmer('destroy')
                .dimmer({
                  onHide: function(){
                    displayPop.popup('destroy');
                    editPop.popup('destroy');
                    outputChecker.unsubscribe('blockDragged');
                    outputChecker.unsubscribe('successfulRun');
                    outputChecker.unsubscribe('unsuccessfulRun');
                    outputChecker.unsubscribe('blockDeleted');
                    outputChecker.unsubscribe('repeatUpdated');
                  }
                }).dimmer('show');
            });
          }else{
            failCounter += 1;
            if(!isRepeatDragged){
              displayPop
                .popup('destroy')
                .popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  title: 'You forgot something..',
                  content: "We need to use the REPEAT block on this level.",
                  on: 'hover',
                  variation: "wide",
                  onHide: function(){
                    displayPop.popup('destroy');
                  }
              }).popup('show');
            }
            else if(!isOutputDragged){
              displayPop
                .popup('destroy')
                .popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  title: 'You forgot something..',
                  content: "Don't forget to output your result.",
                  on: 'hover',
                  variation: "wide",
                  onHide: function(){
                    displayPop.popup('destroy');
                  }
              }).popup('show');
            }else{
              displayPop
                .popup('destroy')
                .popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  title: 'Not Quite',
                  content: "Oops! It seems your result does not match. Check if you correctly add your values and store it to variable 'result'. Don't forget to initialize the result as 0.",
                  on: 'click',
                  variation: "wide",
                  onHide: function(){
                    displayPop.popup('destroy');
                  }
              }).popup('show');
              if(failCounter > 6){
                editPop
                .popup('destroy')
                .popup({
                  position: "top left",
                  offset : -(compData.editPanelHeight / 2) + $($("svg#edit-panel .block.repeat")[0]).offset().top - 65,
                  hoverable : false,
                  closable: false,
                  title: "Hint",
                  content: "We can use the variable 'result' to count the the number of times we subtracted 'value2' to 'value1' until we cannot subtract 'value2' to 'value1'",
                  on: 'click',
                  variation: "wide",
                  onHide: function(){
                    editPop.popup('destroy');
                  }
                }).popup('show');
              }
            }
          }
        }
      });

      outputChecker.subscribe('unsuccessfulRun', function(e, param){
        failCounter += 1;
      });
      outputChecker.subscribe('blockDragged', function(e, param){
        var block = param.block;
        if($(block.node).is(".block.output")){
          isOutputDragged = true;
        }
        else if($(block.node).is(".block.repeat")){
          isRepeatDragged = true;
        }
      });

      outputChecker.subscribe('blockDeleted', function(e, param){
        var block = param.target;
        if($(block.node).is(".block.output")){
          isOutputDragged = false;
        }
        else if($(block.node).is(".block.repeat")){
          isRepeatDragged = false;
        }
      });

      outputChecker.subscribe('repeatUpdated', function(e, param){
        if(isMultDone){
          editPop
            .popup('destroy')
            .popup({
              position: "top left",
              offset : -(compData.editPanelHeight / 2) + $($("svg#edit-panel .block.repeat")[0]).offset().top - 65,
              hoverable : false,
              closable: false,
              content: "Now, think of a condition when to stop the loop to get the desired result.",
              on: 'click',
              variation: "wide",
              onHide: function(){
                editPop.popup('destroy');
              }
          }).popup('show');
        }
      });
      break;
    case "1_4":
      blocksNeeded = ["type","variable","equal","value",
                      "addition","subtraction","multiplication", "division", "modulo", "open_par","close_par",
                      "less", "greater", "less_equal","greater_equal", "equal_equal","not_equal", "and", "or",
                      "if","repeat"];
      $("a#side-prev").attr({href:'game.html?level=1_3'});
      $("a#side-next").attr({href:'game.html?level=2_1'});

      initializeBlockPanel(blocksNeeded);
      initializeEditPanel(level);
      initializeDisplayPanel(level);
      // Initialize Popups
      dimmerMessageContent.append(gameTexts[level].fibo_intro);
      dimmerMessage.dimmer({
        onHide: function(){
          editPopContent.empty().append(gameTexts[level].fibo_array);
          editPop
            .popup('destroy')
            .popup({
              position : 'top left',
              offset : -(compData.editPanelHeight / 2) + $($(".block.variable.fibo")[0]).offset().top - 65,
              hoverable : false,
              closable: false,
              exclusive: true,
              on: 'manual',
              popup : editPopContent,
              variation: "very wide",
            }).popup('show');
          $("button#exit-fibo-array").click(function(){
            editPop.popup('hide').popup('destroy');
          });
        }
      });

      // Display Array Defaults
      var rectSize = 50;
      var x = $(snapDisplay.node).width()/3.5;
      var y = $(snapDisplay.node).height()*1.5/5;
      var xAdjust, yAdjust;
      var arrMargin = 10;

      var outputChecker = EventManager;
      var isFiboCorrect = false;
      var isRepeatDragged = false;
      var isIfDragged = false;
      var failCounter = 0;
      outputChecker.subscribe('successfulRun', function(e, param){
        var fibo = param.fibo;
        var expected = [1,1,2,3,5];
        var arrayBox, newText;


        for(var i=0; i<fibo.length; i++){
          arrayBox = snapDisplay.select('g.array-'+i);
          xAdjust = x + i*(rectSize+10 + arrMargin);
          newText = fibo[i] ? arrayBox.select('text').attr({ text: ""+fibo[i]+"" }) : arrayBox.select('text').attr({ text: "" });
          newText.attr({x: xAdjust+(arrayBox.getBBox().width/2)-(newText.getBBox().width/2)});
        }

        if(isRepeatDragged && isIfDragged && checkFibo(fibo, expected)){
          displayPopContent.empty().append(gameTexts[level].fibo_success);
          displayPop
            .popup('destroy')
            .popup({
              position: "top center",
              hoverable : false,
              closable: false,
              exclusive: true,
              on: 'manual',
              popup : displayPopContent,
              variation: "wide"
          }).popup('show');
          $("button#exit-fibo-success").click(function(){
            displayPop.popup('hide').popup('destroy');
            editPop.popup('destroy');
            dimmerMessageContent.empty().append(gameTexts[level].level_exit);
            dimmerMessage.dimmer({
              onHide: function(){
                outputChecker.unsubscribe('successfulRun');
                outputChecker.unsubscribe('unsuccessfulRun');
                outputChecker.unsubscribe('blockDragged');
                outputChecker.unsubscribe('blockDeleted');
              }
            }).dimmer('show');
          });
        }else{
          failCounter += 1;
          if(!isRepeatDragged){
            editPop
            .popup('destroy')
            .popup({
              position: "left center",
              hoverable : false,
              closable: false,
              offset : -(compData.editPanelHeight / 2) + $($(".block.variable.fibo")[0]).offset().top + blockHeight + blockMargin - 65,
              content: "You forgot to use the REPEAT bock. We need to loop 5 times to access each index.",
              on: 'click',
              variation: "wide",
              onHidden: function(){
                editPop.popup('destroy');
              }
            }).popup('show');
          }else if(!isIfDragged){
            editPop
            .popup('destroy')
            .popup({
              position: "left center",
              hoverable : false,
              closable: false,
              offset : -(compData.editPanelHeight / 2) + $($(".block.variable.fibo")[0]).offset().top + blockHeight + blockMargin - 65,
              content: "Remember, first two numbers should be equal to 1 and the succeeding numbers equal to 'n-2' plus 'n-1' where 'n' is the index number. So we're going to use IF statements with these conditions.",
              on: 'click',
              variation: "wide",
              onHidden: function(){
                editPop.popup('destroy');
              }
            }).popup('show');
          }
          else{
            displayPop
              .popup('destroy')
              .popup({
                position: "top center",
                hoverable : false,
                closable: false,
                exclusive: true,
                on: 'click',
                content: "Oops! The array is not the expected output. Try again.",
                variation: "wide",
                onHidden: function(){
                   displayPop.popup('destroy');
                }
            }).popup('show');
          }

          if(failCounter > 10){
            editPop
            .popup('destroy')
            .popup({
              position: "top left",
              offset : -(compData.editPanelHeight / 2) + $($(".block.variable.fibo")[0]).offset().top + blockHeight + blockMargin - 65,
              hoverable : false,
              closable: false,
              title: "Hint",
              content: "We need to repeat 5 times and if n is 1 or 0, fibo[n] should be 1, else fibo[n] is fibo[n-2] plus fibo[n-1]",
              on: 'click',
              variation: "wide",
              onHidden: function(){
                editPop.popup('destroy');
              }
            }).popup('show');
          }
        }
      });

      outputChecker.subscribe('unsuccessfulRun', function(e, param){
        failCounter += 1;
      });

      outputChecker.subscribe('blockDragged', function(e, param){
        var block = $(param.block.node);

        if(block.is(".block.repeat")){
          isRepeatDragged = true;
        }
        else if(block.is(".block.if")){
          isIfDragged = true;
        }
      });

      outputChecker.subscribe('blockDeleted', function(e, param){
        var block = $(param.target.node);

        if(block.is(".block.repeat")){
          isRepeatDragged = false;
        }
      });

      var checkFibo = function(output, expected){
        return (output.length == expected.length) && output.every(function(element, index) {
            return parseInt(element) === expected[index]; 
        })
      }
      break;
    case "2_1":
      blocksNeeded = ["type","variable","equal","value",
                      "addition","subtraction","multiplication", "division", "modulo", "open_par","close_par",
                      "less", "greater", "less_equal","greater_equal", "equal_equal","not_equal", "and", "or",
                      "if","repeat"];
      $("a#side-prev").attr({href:'game.html?level=1_4'});
      $("a#side-next").attr({href:'game.html?level=2_2'});

      initializeBlockPanel(blocksNeeded);
      initializeEditPanel(level);
      initializeDisplayPanel(level);
      // Initialize Popups
      dimmerMessageContent.append(gameTexts[level].outline_intro);
      dimmerMessage.dimmer({
        onHide: function(){
          editPopContent.empty().append(gameTexts[level].array_2D);
          editPop
            .popup('destroy')
            .popup({
              position : 'top left',
              offset : -(compData.editPanelHeight / 2) + $($(".block.variable.flag")[0]).offset().top - 65,
              hoverable : false,
              closable: false,
              exclusive: true,
              on: 'manual',
              popup : editPopContent,
              variation: "very wide",
            }).popup('show');
          $("button#exit-array-2D").click(function(){
            editPop.popup('hide').popup('destroy');
            $('#scrollable-div').animate({scrollLeft:'+=700px'});
            blockPop
              .popup({
                position : 'bottom center',
                offset : $("#block-container .block.close-parenthesis").offset().left - $("#block-container").width()/2,
                content  : 'In the edit panel, drag a repeat block inside of another.',
                on: "hover",
                onHidden : function(){
                  blockPop.popup('destroy');
                }
              }).popup('show');
          });
        }
      });

      var outputChecker = EventManager;
      var repeatCounter = 0;
      var timesChecker = 0;
      var repeatDone = false;

      var isRowDragged = false;
      var isRowAdded = false;
      var isEqualDragged = false;
      var isPlusDragged = false;
      var isValue1 = false;
      var rowIncDone = false;

      var isColDragged = false;
      var isColAdded = false;
      var isEqualDragged1 = false;
      var isPlusDragged1 = false;
      var isValue11 = false;
      var colIncDone = false;

      var isColDragged1 = false;
      var isEqualDragged2 = false;
      var isValue0 = false;
      var colResetDone = false;

      outputChecker.subscribe('blockDeleted', function(e, param){
        var block = $(param.target.node);
        if(!repeatDone){
          if(block.is(".block.repeat")){
            repeatCounter -= 1;
          }
        }else{
          if(!rowIncDone){
            if(block.is(".block.variable")){
              if(isRowDragged){
                isRowDragged = false;
              }else{
                isRowAdded = false;
              }
            }else if(block.is(".block.equal")){
              isEqualDragged = false;
            }else if(block.is(".block.add")){
              isPlusDragged = false;
            }else if(block.is(".block.value")){
              isValue1 = false;
            }
          }else{
            if(!colIncDone){
              if(block.is(".block.variable")){
                if(isColDragged){
                  isColDragged = false;
                }else{
                  isColAdded = false;
                }
              }else if(block.is(".block.equal")){
                isEqualDragged1 = false;
              }else if(block.is(".block.add")){
                isPlusDragged1 = false;
              }else if(block.is(".block.value")){
                isValue11 = false;
              }
            }else{
              if(!colResetDone){
                if(block.is(".block.variable")){
                  isColDragged1 = false;
                }else if(block.is(".block.equal")){
                  isEqualDragged2 = false;
                }else if(block.is(".block.value")){
                  isValue12 = false;
                }
              }
            }
          }
        }
      });

      outputChecker.subscribe('blockDragged', function(e, param){
        var block = $(param.block.node);

        if(!repeatDone){
          if(block.is(".block.repeat")){
            repeatCounter += 1;
            if(repeatCounter === 2){
              editPop
              .popup('destroy')
              .popup({
                position : 'top left',
                offset : -(compData.editPanelHeight / 2) + $($(".block.variable.flag")[0]).offset().top + (blockMargin + blockHeight)*3 - 65,
                hoverable : false,
                closable: false,
                exclusive: true,
                on: 'click',
                title: "Nested Loops",
                content: "The outer REPEAT will be used to access each row while the inner REPEAT will be used to access each column. Now we need to add the number of times we need to loop the rows and columns.",
                variation: "wide",
                onHidden: function(){
                  editPop.popup('destroy');
                }
              }).popup('show');
            }
          }
        }else{
          if(!rowIncDone){
            if(block.is(".block.equal")){
              isEqualDragged = true;
              rowIncDone = checkIfDoneWithInstruction("rowIncrement", {isRowDragged: isRowDragged, isEqualDragged: isEqualDragged, isRowAdded: isRowAdded, isPlusDragged: isPlusDragged, isValue1: isValue1});
            }else if(block.is(".block.add")){
              isPlusDragged = true;
              rowIncDone = checkIfDoneWithInstruction("rowIncrement", {isRowDragged: isRowDragged, isEqualDragged: isEqualDragged, isRowAdded: isRowAdded, isPlusDragged: isPlusDragged, isValue1: isValue1});
            }
          }else{
            if(!colIncDone){
              if(block.is(".block.equal")){
                isEqualDragged1 = true;
                colIncDone = checkIfDoneWithInstruction("colIncrement", {isColDragged: isColDragged, isEqualDragged: isEqualDragged1, isColAdded: isColAdded, isPlusDragged: isPlusDragged1, isValue1: isValue11});
              }else if(block.is(".block.add")){
                isPlusDragged1 = true;
                colIncDone = checkIfDoneWithInstruction("colIncrement", {isColDragged: isColDragged, isEqualDragged: isEqualDragged1, isColAdded: isColAdded, isPlusDragged: isPlusDragged1, isValue1: isValue11});
              }
            }else{
              if(!colResetDone){
                if(block.is(".block.equal")){
                  isEqualDragged2 = true;
                  colResetDone = checkIfDoneWithInstruction("colReset", {isColDragged: isColDragged1, isEqualDragged: isEqualDragged2, isValue0: isValue0});
                }
              }
            }
          }
        }
      });

      outputChecker.subscribe('valueChanged', function(e, param){
        var newValue = param.newText;
        var block = param.block;
        if(!repeatDone && timesChecker !== 2){
          if(newValue === "5"){
            if($(block.node.left.node.prevLine.node).is(".block.repeat")){
              editPop
                .popup({
                  position : 'top left',
                  offset : -(compData.editPanelHeight / 2) + $(block.node).offset().top - 65,
                  hoverable : false,
                  closable: false,
                  content: "The inner loop should traverse the columns. So the value should be the number of columns",
                  on: 'click',
                  variation: "wide",
                  onHidden: function(){
                    editPop.popup('destroy');
                  }
                }).popup('show');
            }else{
              timesChecker += 1;
            }
          }
          else if(newValue === "7"){
            if(!$(block.node.left.node.prevLine.node).is(".block.repeat")){
              editPop
                .popup('destroy')
                .popup({
                  position : 'top left',
                  offset : -(compData.editPanelHeight / 2) + $(block.node).offset().top - 65,
                  hoverable : false,
                  closable: false,
                  content: "The outer loop should traverse the rows. So the value should be the number of rows",
                  on: 'click',
                  variation: "wide",
                  onHidden: function(){
                    editPop.popup('destroy');
                  }
                }).popup('show');
            }else{
              timesChecker += 1;
            }
          }
        }else{
          if(!rowIncDone){
            if(newValue === "1"){
              isValue1 = true;
              rowIncDone = checkIfDoneWithInstruction("rowIncrement", {isRowDragged: isRowDragged, isEqualDragged: isEqualDragged, isRowAdded: isRowAdded, isPlusDragged: isPlusDragged, isValue1: isValue1});
            }else{
              editPop
                .popup('destroy')
                .popup({
                  position : 'top left',
                  offset : -(compData.editPanelHeight / 2) + $($(".block.end")[1]).offset().top - 65,
                  hoverable : false,
                  closable: false,
                  content: "Variable 'row' should increment by 1.",
                  on: 'click',
                  variation: "wide",
                  onHidden: function(){
                    editPop.popup('destroy');
                  }
                }).popup('show');
            }
          }
          else{
            if(!colIncDone){
              if(newValue === "1"){
                isValue11 = true;
                colIncDone = checkIfDoneWithInstruction("colIncrement", {isColDragged: isColDragged, isEqualDragged: isEqualDragged1, isColAdded: isColAdded, isPlusDragged: isPlusDragged1, isValue1: isValue11});
              }else{
                editPop
                  .popup('destroy')
                  .popup({
                    position : 'top left',
                    offset : -(compData.editPanelHeight / 2) + $($(".block.end")[2]).offset().top - 65,
                    hoverable : false,
                    closable: false,
                    content: "Variable 'col' should increment by 1.",
                    on: 'click',
                    variation: "wide",
                    onHidden: function(){
                      editPop.popup('destroy');
                    }
                  }).popup('show');
              }
            }else{
              if(!colResetDone){
                if(newValue === "0"){
                  isValue0 = true;
                  colResetDone = checkIfDoneWithInstruction("colReset", {isColDragged: isColDragged1, isEqualDragged: isEqualDragged2, isValue0: isValue0});
                }else{
                  editPop
                .popup('destroy')
                .popup({
                  position : 'top left',
                  offset : -(compData.editPanelHeight / 2) + $($(".block.repeat")[2]).offset().top - 65,
                  hoverable : false,
                  closable: false,
                  content: "Variable 'col' should be re-initialized as 0.",
                  on: 'click',
                  variation: "wide",
                  onHidden: function(){
                    editPop.popup('destroy');
                  }
                }).popup('show');
                }
              }
            }
          }
        }

        if(!repeatDone && timesChecker === 2){
          editPopContent.empty().append(gameTexts[level].array_indices);
          editPop
            .popup('destroy')
            .popup({
              position : 'top left',
              offset : -(compData.editPanelHeight / 2) + $($(".block.varRow")[0]).offset().top - 65,
              hoverable : false,
              closable: false,
              content: "",
              on: 'click',
              variation: "wide",
              popup: editPopContent
            }).popup('show');
            $("button#exit-array-indices").click(function(){
              editPop.popup('hide');
              editPopContent.empty().append(gameTexts[level].index_increment);
              editPop
                .popup('destroy')
                .popup({
                  position : 'top left',
                  offset : -(compData.editPanelHeight / 2) + $($(".block.variable.flag")[0]).offset().top + (blockMargin + blockHeight)*3 - 65,
                  hoverable : false,
                  closable: false,
                  content: "",
                  on: 'click',
                  variation: "wide",
                  popup: editPopContent
                }).popup('show');
              $("button#exit-index-increment").click(function(){
                editPop.popup('hide').popup('destroy');
                repeatDone = true;
                editPop
                  .popup('destroy')
                  .popup({
                    position : 'top left',
                    offset : -(compData.editPanelHeight / 2) + $($(".block.end")[1]).offset().top - 65,
                    hoverable : false,
                    closable: false,
                    content: "Every loop, variable 'row' should increment by one. Build 'row = row + 1' above this END block.",
                    on: 'click',
                    variation: "wide",
                    onHidden: function(){
                      editPop.popup('destroy');
                    }
                  }).popup('show');
              });
            });
        }
      });

      outputChecker.subscribe('variableChanged', function(e, param){
        var newName = param.newName;
        if(repeatDone){
          if(!rowIncDone){
            if(newName === "row"){
              if(!isRowDragged){
                isRowDragged = true;
              }else{
                isRowAdded = true;
              }
              rowIncDone = checkIfDoneWithInstruction("rowIncrement", {isRowDragged: isRowDragged, isEqualDragged: isEqualDragged, isRowAdded: isRowAdded, isPlusDragged: isPlusDragged, isValue1: isValue1});
            }
          }else{
            if(!colIncDone){
              if(newName === "col"){
                if(!isColDragged){
                  isColDragged = true;
                }else{
                  isColAdded = true;
                }
                colIncDone = checkIfDoneWithInstruction("colIncrement", {isColDragged: isColDragged, isEqualDragged: isEqualDragged1, isColAdded: isColAdded, isPlusDragged: isPlusDragged1, isValue1: isValue11});
              }
            }else{
              if(!colResetDone){
                if(newName === "col"){
                  isColDragged1 = true;
                  colResetDone = checkIfDoneWithInstruction("colReset", {isColDragged: isColDragged1, isEqualDragged: isEqualDragged2, isValue0: isValue0});
                }
              }
            }
          }
        }
      });

      var runCounter = 0;
      outputChecker.subscribe('successfulRun', function(e, param){
        var flag = param.flag;
        colorFlag(flag);
        switch(runCounter){
          case 0:
            if(checkFlag(runCounter, flag)){
              displayPopContent.empty().append(gameTexts[level].first_run);
              displayPop
                .popup('destroy')
                .popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  exclusive: true,
                  on: 'manual',
                  popup : displayPopContent,
                  variation: "wide"
              }).popup('show');
              $("button#exit-first-run").click(function(){
                displayPop.popup('hide').popup('destroy');
                editPop
                  .popup('destroy')
                  .popup({
                    position : 'top left',
                    offset : -(compData.editPanelHeight / 2) + $($(".block.if")[1]).offset().top - 65,
                    hoverable : false,
                    closable: false,
                    content: "You can always add ELSEIF blocks to add different conditions. When you are done, just click run and see what happens.",
                    on: 'click',
                    variation: "wide",
                    onHidden: function(){
                      editPop.popup('destroy');
                    }
                  }).popup('show');
              });
              runCounter = 1;
            }else{
              displayPop
                .popup('destroy')
                .popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  exclusive: true,
                  on: 'click',
                  title: "WOOPS!",
                  content: "It seems the result does not match with the expected output. Check your conditions and check if you save the correct values to each index.",
                  variation: "wide",
                  onHidden: function(){
                    displayPop.popup('destroy');
                  }
              }).popup('show');
            }
            break;
          case 1:
            if(checkFlag(runCounter, flag)){
              displayPopContent.empty().append(gameTexts[level].level_success);
              displayPop
                .popup('destroy')
                .popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  exclusive: true,
                  on: 'manual',
                  popup : displayPopContent,
                  variation: "wide"
              }).popup('show');
              $("button#exit-level").click(function(){
                displayPop.popup('hide').popup('destroy');
                dimmerMessageContent.empty().append(gameTexts[level].level_exit);
                dimmerMessage.dimmer({
                  onHide: function(){
                    displayPop.popup('destroy');
                    editPop.popup('destroy');
                    blockPop.popup('destroy');
                    outputChecker.unsubscribe('valueChanged');
                    outputChecker.unsubscribe('variableChanged');
                    outputChecker.unsubscribe('unsuccessfulRun');
                    outputChecker.unsubscribe('blockDragged');
                    outputChecker.unsubscribe('blockDeleted');
                  }
                }).dimmer('show');
              });
              runCounter = 2;
            }else{
              displayPop
                .popup('destroy')
                .popup({
                  position: "top center",
                  hoverable : false,
                  closable: false,
                  exclusive: true,
                  on: 'click',
                  title: "OH-OH!",
                  content: "It seems the result does not match with the expected output. Check your conditions and check if you save the correct values to each index.",
                  variation: "wide",
                  onHidden: function(){
                    displayPop.popup('destroy');
                  }
              }).popup('show');
            }
            break;
          default:
            break;
        }
      });

      var checkIfDoneWithInstruction = function(instruction, condition){
        var isDone = false;
        console.log(condition);
        switch(instruction){
          case "rowIncrement":
            if(condition.isRowDragged && condition.isEqualDragged && condition.isRowAdded && condition.isPlusDragged && condition.isValue1){
              isDone = true;
              editPop
                .popup('destroy')
                .popup({
                  position : 'top left',
                  offset : -(compData.editPanelHeight / 2) + $($(".block.end")[2]).offset().top - 65,
                  hoverable : false,
                  closable: false,
                  content: "Now on this loop, variable 'column' should increment by 1. Build 'col = col + 1' above this END block.",
                  on: 'click',
                  variation: "wide",
                  onHidden: function(){
                    editPop.popup('destroy');
                  }
                }).popup('show');
            }
            break;
          case "colIncrement":
            if(condition.isColDragged && condition.isEqualDragged && condition.isColAdded && condition.isPlusDragged && condition.isValue1){
              isDone = true;
              editPop
                .popup('destroy')
                .popup({
                  position : 'top left',
                  offset : -(compData.editPanelHeight / 2) + $($(".block.repeat")[2]).offset().top - 65,
                  hoverable : false,
                  closable: false,
                  content: "Before we traverse the column, our 'column' variable should reset to zero. Above this repeat, build 'col = 0'",
                  on: 'click',
                  variation: "wide",
                  onHidden: function(){
                    editPop.popup('destroy');
                  }
                }).popup('show');
            }
            break;
          case "colReset":
            if(condition.isColDragged && condition.isEqualDragged && condition.isValue0){
              isDone = true;
              editPopContent.empty().append(gameTexts[level].if_statement);
              editPop
                .popup('destroy')
                .popup({
                  position : 'top left',
                  offset : -(compData.editPanelHeight / 2) + $($(".block.repeat")[2]).offset().top - 65,
                  hoverable : false,
                  closable: false,
                  popup: editPopContent,
                  on: 'click',
                  variation: "wide",
                }).popup('show');
              $("button#exit-if-statement").click(function(){
                editPop.popup('hide').popup('destroy');
              });
            }
            break;
          default:
            // Do something
        }

        return isDone;
      }

      var colorFlag = function(flag){
        for(var i=0; i<5; i++){
          for(var j=0; j<7; j++){
            if(flag[i][j] === 1)
              Snap($("rect.rect_"+i+"_"+j)[0]).attr({'fill-opacity': 1, fill: black});
          }
        }
      }

      var checkFlag = function(counter, flag){
        var isCorrect = false;
        switch(counter){
          case 0:
            var expected = [[1,0,0,0,0,0,0],[1,0,0,0,0,0,0],[1,0,0,0,0,0,0],[1,0,0,0,0,0,0],[1,0,0,0,0,0,0]];
            for(var i=0; i<5; i++){
              for (var j=0; j < 7; j++) {
                if(parseInt(flag[i][j]) !== expected[i][j]){
                  return false;
                }
              }
            }
            isCorrect = true;
            break;
          case 1:
            var expected = [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]];
            
            for(var i=0; i<5; i++){
              for (var j=0; j < 7; j++) {
                if(parseInt(flag[i][j]) !== expected[i][j]){
                  return false;
                }
              }
            }
            isCorrect = true;
            break;
          default:
        }

        return isCorrect;
      }

      break;
    case "2_2":
      break;
    default:
      // Do something
  }

  // Scroll Button Click functions for Block Panel
  $('#block-go-left').click(function(){
    $('#scrollable-div').animate({scrollLeft:'-=350px'});
  });
  
  $('#block-go-right').click(function(){
    $('#scrollable-div').animate({scrollLeft:'+=350px'});
  });

  var editPanelWatcher = EventManager;

  var findRightMost = function(block){
    var rightmost = block;
    var ptr = block;

    while(ptr !== null){
      rightmost = ptr;
      ptr = ptr.node.right;
    }
    return rightmost;
  }

  editPanelWatcher.subscribe('blockDragged', function(e, param){
    var block = param.block;
    var editSVG = $("svg#edit-panel");
    var lastBlock = compData.tail;
    var rightMostBlock = findRightMost(block);

    compData.rightmost = (compData.rightmost && compData.rightmost.getBBox().x2 > rightMostBlock.getBBox().x2) ? compData.rightmost : rightMostBlock;

    // console.log(compData);
    if((lastBlock.getBBox().y2 + blockHeight * 2) > snapEdit.getBBox().y2){
      editPanel.attr({
        height: snapEdit.getBBox().height + (blockHeight + blockMargin)*5
      });
    }

    if((compData.rightmost.getBBox().x2 + block.getBBox().width + blockMargin) > snapEdit.getBBox().x2){
      editPanel.attr({
        width: snapEdit.getBBox().width + (block.getBBox().width + blockMargin) * 2
      });
    }
  });
});

/* jshint ignore:end */