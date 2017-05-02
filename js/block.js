$(document).ready(function(){
  // Temporary Variables
  var tempElem, finalElem;


  var targetBlock = null;
  var newTarget = null;

/////////////////////////////////////////////////////////// DRAG FUNCTIONS
/////////////////////////////////////////////////////// MOVE
  var compX, compY;
  move = function(dx, dy, x, y, e){
    tempElem.attr({
      transform: "t"+[ blockPanel.offset().left+dx, blockPanel.offset().top+dy]
    });
    tempElem.data('shift',{dx:dx,dy:dy});
    tempElem.data('mouse', {x:x,y:y});

    // Check if block is dragged within editor
    if( ( x + dragAllowance > compData.editPanelLeft )                        
        &&
        ( y + dragAllowance > compData.editPanelTop )
      ){
        compX = tempElem.data('shift').dx + tempElem.data('origin').ox - editPanel.parent().offset().left;    // EXPLANATION: Parent of edit panel instead of edit panel becausee parent is fixed and cannot be scrolled
        compY = tempElem.data('shift').dy + tempElem.data('origin').oy - compData.editPanelTop + editPanel.parent().scrollTop();

        newTarget = findTarget(compX + (tempElem.getBBox().width / 2), compY + (tempElem.getBBox().height / 2), tempElem);

        // Reset CSS
        verticalGuide.remove();
        horizontalGuide.remove();
        if(targetBlock !== null){
          $(targetBlock.node).find('rect').css({"stroke-width":2});
        }
        
        // Update target block on drag
        if(targetBlock !== newTarget){
          targetBlock = newTarget;
        }

        // Show guide and save the case number for end of drag
        if(newTarget !== null){
          tempElem.data('caseNum',showGuide(compX + (tempElem.getBBox().width / 2), compY + (tempElem.getBBox().height / 2), newTarget));
          tempElem.data('target', newTarget);
        }else{
          tempElem.data('caseNum', 5);
          tempElem.data('target', null);
        }
    }
    else{
      verticalGuide.remove();
      horizontalGuide.remove();

      tempElem.data('caseNum', -1);
      tempElem.data('target', null);
    }
  };

  function showGuide(cx, cy, target){
    var caseNum = null;
    var clonedGuide;
    var isIfBlock = $(target.node).hasClass("block if");
    var isElseIfBlock = $(target.node).hasClass("block elseif");
    var isElseBlock = $(target.node).hasClass("block else");
    var isEndBlock = $(target.node).hasClass("block end");
    var isRepeatBlock = $(target.node).hasClass("block repeat");
    var isTimesBlock = $(target.node).hasClass("block times");
    // Draged to TOP of block
    if(cy < target.getBBox().y){
      verticalGuide.attr({
        d: "M"+(target.getBBox().x+guideMargin)+" "+target.getBBox().y+"L"+(target.getBBox().x2-guideMargin)+" "+target.getBBox().y,
        stroke: target.select('rect').attr('stroke')
      });
      snapEdit.add(verticalGuide);

      if(target.node.prevLine !== null){
        clonedGuide = verticalGuide;
      }
      caseNum = 0;
    }
    // Dragged to BOTTOM of block
    else if(cy > target.getBBox().y2){
      verticalGuide.attr({
        d: "M"+(target.getBBox().x+guideMargin)+" "+target.getBBox().y2+"L"+(target.getBBox().x2-guideMargin)+" "+target.getBBox().y2,
        stroke: target.select('rect').attr('stroke')
      });
      snapEdit.add(verticalGuide);
      caseNum = 1;
    }
    // Dragged to RIGHT of block
    else if(cx > target.getBBox().x2 && (target.getBBox().y < cy && cy < target.getBBox().y2)){
      if(!isEndBlock && !isTimesBlock && !isElseBlock){
        horizontalGuide.attr({
          d: "M"+target.getBBox().x2+" "+(target.getBBox().y+guideMargin)+"L"+target.getBBox().x2+" "+(target.getBBox().y2-guideMargin),
          stroke: target.select('rect').attr('stroke')
        });
        snapEdit.add(horizontalGuide);
        caseNum = 2;
      }else{
        caseNum = -1;
      }
    }
    // Dragged to LEFT of block
    else if(cx < target.getBBox().x && (target.getBBox().y < cy && cy < target.getBBox().y2)){
      console.log("DRAGGING TO LEFT");
      if(!isEndBlock && !(isIfBlock || isRepeatBlock || isElseIfBlock || isElseBlock)){
        horizontalGuide.attr({
          d: "M"+target.getBBox().x+" "+(target.getBBox().y+guideMargin)+"L"+target.getBBox().x+" "+(target.getBBox().y2-guideMargin),
          stroke: target.select('rect').attr('stroke')
        });
        snapEdit.add(horizontalGuide);
        caseNum = 3;
      }else{
        caseNum = -1;
      }
    }
    // Dragged to ON TOP of block
    else{
      $(target.node).find('rect').css({"stroke-width":4});
      if(target.node.left === null){
        caseNum = 0;
      }
      else{
        caseNum = 3;
      }
    }

    return caseNum;
  }

  function findTarget(cx, cy, block){
    var target = compData.head;
    var finalBlock = compData.head;
    var shortest;
    var temp;
    var isFirst; // If block is first block of the line
    var ptr, ptr1;

    if(cy < 0 + blockMargin){
      return compData.head;
    }
    else{
      shortest = Number.POSITIVE_INFINITY;
      var i = 0;
      ptr = compData.head;
      while(ptr !== null){
        temp = Math.sqrt(Math.pow(ptr.getBBox().cx-cx,2) + Math.pow(ptr.getBBox().cy-cy,2));
        finalBlock = temp <= shortest ? ptr : finalBlock;
        shortest = temp <= shortest ? temp : shortest;
        ptr1 = ptr.node.right;
        while(ptr1 !== null){
          temp = Math.sqrt(Math.pow(ptr1.getBBox().cx-cx,2) + Math.pow(ptr1.getBBox().cy-cy,2));

          if(!(cy < ptr1.getBBox().y || cy > ptr1.getBBox().y2)){
            finalBlock = temp <= shortest ? ptr1 : finalBlock;
            shortest = temp <= shortest ? temp : shortest;
          }

          ptr1 = ptr1.node.right;
        }

        ptr = ptr.node.nextLine;
      }
      return finalBlock;
    }
    return null;
  }
/////////////////////////////////////////////////////// START
  start = function(){
    var endClone;

    $('#overlay').css('visibility', 'visible');
    tempElem = this.clone();

    tempElem.attr({
      transform: "t"+[blockPanel.offset().left, blockPanel.offset().top]
    });
    tempElem.data('origin', { ox:$(this.node).offset().left, oy: $(this.node).offset().top });
    tempElem.data('shift',{dx:0,dy:0});
    tempElem.data('caseNum', null);
    snapOverlay.add(tempElem);
  };

  var lastBlock;
  var finalRect;
  
/////////////////////////////////////////////////////// END
  var nullClone, endClone, codeLine, timesClone;
  end = function(e){
    var x, y;
    $('#overlay').css('visibility', 'hidden');
    var target = tempElem.data('target');
    var caseNum = tempElem.data('caseNum');
    var validDrag = true;
    finalElem = this.clone();

    var isIfBlock = $(finalElem.node).hasClass("block if");
    var isRepeatBlock = $(finalElem.node).hasClass("block repeat");
    var isEndBlock = $(finalElem.node).hasClass("block end");
    var isTimesBlock = $(finalElem.node).hasClass("block times");

    var isTargetIfBlock = target ? $(target.node).hasClass("block if") : false;
    var isTargetElseIfBlock = target ? $(target.node).hasClass("block elseif") : false;
    var isTargetElseBlock = target ? $(target.node).hasClass("block else") : false;
    var isTargetRepeatBlock = target ? $(target.node).hasClass("block repeat") : false;
    var isTargetEndBlock = target ? $(target.node).hasClass("block end") : false;

    console.log(caseNum + " " + target);
    if(~caseNum && (isIfBlock || isRepeatBlock)){
      endClone = endBlock.clone();

      finalElem.node.nextLine = endClone;

      endClone.node.prevLine = finalElem;
      endClone.node.nextLine = null;
      endClone.node.right = null;
      endClone.node.left = null;

      finalElem.node.endBlock = endClone;
      endClone.node.ifBlock = finalElem;

      if(isRepeatBlock){
        timesClone = timesBlock.clone();

        finalElem.node.left = null;
        finalElem.node.right = timesClone;
        timesClone.node.left = finalElem;
        timesClone.node.right = null;
        timesClone.node.prevLine = null;
        timesClone.node.nextLine = null;

        finalElem.node.timesBlock = timesClone;
        timesClone.node.headBlock = finalElem;
      }else if(isIfBlock){
        finalElem.node.elseBlock = null;
        finalElem.node.elseIfBlocks = [];
      }
    }

    // DRAG CASES
    switch(caseNum){
      case 0: //////////////////////////////////////// TOP
        x = (isTargetEndBlock || isTargetElseIfBlock || isTargetElseBlock) ? target.getBBox().x + blockMargin : target.getBBox().x;
        y = target.getBBox().y;

        if(isTargetEndBlock || isTargetElseIfBlock || isTargetElseBlock){
          finalElem.attr({ 'code-level' : + target.attr('code-level') + 1 });
        }else{
          finalElem.attr({ 'code-level' : + target.attr('code-level')});
        }

        adjustBlocks(target,true,true, finalElem);

        if(!isRepeatBlock){
          finalElem.node.right = null;
          finalElem.node.left = null;
        }
        // If dragged to HEAD
        if(target.node.prevLine === null){
          // console.log("Drag to HEAD");
          finalElem.node.prevLine = null;
          compData.head = finalElem;

          if(isIfBlock || isRepeatBlock){
            finalElem.node.endBlock.node.nextLine = target;
            target.node.prevLine = finalElem.node.endBlock;
          }
          else{
            finalElem.node.nextLine = target;
            target.node.prevLine = finalElem;
          }
        }
        else{
          // console.log("Drag to TOP of target");
          finalElem.node.prevLine = target.node.prevLine;
          target.node.prevLine.node.nextLine = finalElem;

          if(isIfBlock || isRepeatBlock){
            finalElem.node.endBlock.node.nextLine = target;
            target.node.prevLine = finalElem.node.endBlock;
          }
          else{
            finalElem.node.nextLine = target;
            target.node.prevLine = finalElem;
          }
        }
        break;
      case 1: //////////////////////////////////////// BOTTOM
        // console.log("Drag to BOTTOM");
        x = (isTargetIfBlock || isTargetRepeatBlock || isTargetElseIfBlock || isTargetElseBlock) ? 
              target.getBBox().x + blockMargin : target.getBBox().x;
        y = target.getBBox().y2 + blockMargin;

        if(isTargetIfBlock || isTargetRepeatBlock || isTargetElseIfBlock || isTargetElseBlock){
          finalElem.attr({ 'code-level' : + target.attr('code-level') + 1 });
        }else{
          finalElem.attr({ 'code-level' : + target.attr('code-level')});
        }

        if(!isRepeatBlock){
          finalElem.node.right = null;
          finalElem.node.left = null;
        }

        // If dragged to END
        if(target.node.nextLine === null){
          finalElem.node.prevLine = target;
          target.node.nextLine = finalElem;

          if(isIfBlock || isRepeatBlock){
            compData.tail =  finalElem.node.endBlock;
          }else{
            compData.tail = finalElem;
            finalElem.node.nextLine = null;
          }
        }
        else{
          adjustBlocks(target.node.nextLine,true,true, finalElem);
          finalElem.node.prevLine = target;

          if(isIfBlock || isRepeatBlock){
            finalElem.node.endBlock.node.nextLine = target.node.nextLine;
            target.node.nextLine.node.prevLine = finalElem.node.endBlock;
          }else{
            finalElem.node.nextLine = target.node.nextLine;
            target.node.nextLine.node.prevLine = finalElem;
          }
          target.node.nextLine = finalElem;
        }
        break;
      case 2: //////////////////////////////////////// RIGHT
        // console.log("Drag to RIGHT");
        if(isIfBlock || isRepeatBlock){
          validDrag = false;
          break;
        }

        x = target.getBBox().x2 + blockMargin;
        y = target.getBBox().y;

        finalElem.node.prevLine = null;
        finalElem.node.nextLine = null;

        // If dragged to FAR RIGHT
        if(target.node.right === null){
          finalElem.node.right = null;
          finalElem.node.left = target;
          target.node.right = finalElem;
        }
        else{
          // console.log("DRAGGED in between");
          adjustBlocks(target.node.right,true,false,finalElem);
          finalElem.node.right = target.node.right;
          finalElem.node.left = target;
          target.node.right.node.left = finalElem;
          target.node.right = finalElem;
        }
        break;
      case 3: //////////////////////////////////////// LEFT
        // console.log("Drag to LEFT");
        x = target.getBBox().x;
        y = target.getBBox().y;

        adjustBlocks(target,true,false,finalElem);

        // If dragged to FAR LEFT
        if(target.node.left === null){
          finalElem.node.right = target;
          finalElem.node.left = null;
          finalElem.node.prevLine = target.node.prevLine;
          finalElem.node.nextLine = target.node.nextLine;
          if(target.node.prevLine === null){
            // console.log("Drag to Left of HEAD");
            compData.head = finalElem;
          }else{
            target.node.prevLine.node.nextLine = finalElem;
          }
          if(target.node.nextLine === null){
            // console.log("Drag to Left of END");
            compData.tail = finalElem;
          }else{
            target.node.nextLine.node.prevLine = finalElem;
          }
          target.node.nextLine = null;
          target.node.prevLine = null;
          target.node.left = finalElem;
        }
        else{
          finalElem.node.prevLine = null;
          finalElem.node.nextLine = null;
          finalElem.node.left = target.node.left;
          finalElem.node.right = target;
          target.node.left.node.right = finalElem;
          target.node.left = finalElem;
        }
        break;
      case 4: //////////////////////////////////////// ON BLOCK


        break;
      case 5: //////////////////////////////////////// FIRST DRAG
        // console.log("First Drag");
        x = blockMargin;
        y = this.getBBox().y;

        compData.head = finalElem;
        finalElem.node.prevLine = null;

        // Update Link List
        if(!isRepeatBlock){
          finalElem.node.right = null;
          finalElem.node.left = null;
        }

        if(isIfBlock || isRepeatBlock){
          compData.tail = endClone;
        }
        else{
          finalElem.node.nextLine = null;
          compData.tail = finalElem;
        }
        break;
      default:
        validDrag = false;
        // console.log("ERROR: Drag unknown");
    }

    if(validDrag){
      finalRect = $(finalElem.node).find("rect");
      finalRect.attr({            // Update the x and y of the rectangle
        x: x,
        y: y
      }).next().attr({              // Update the x and y of the text
        x: x + textXPadding,
        // y: (y - $(this.node).find("rect").attr('y')) + textYPadding
        y: y + textYPadding
      });

////////////////////////////////////////////////////////// IF "IF-BLOCK"
      if(isIfBlock || isRepeatBlock){
        $(endClone.node).removeAttr("style");
        var endCloneY =y + finalElem.getBBox().height + blockMargin
        endClone.attr({
          'code-level': + finalElem.attr('code-level')
        });
        endClone.select('rect').attr({
          x: x,
          y: endCloneY,
          stroke: finalElem.select('rect').attr('stroke')
        });
        endClone.select('text').attr({
          x: x + textXPadding,
          y: endCloneY + textYPadding
        });
        finalElem.node.endBlock = endClone;
        
        var my = y+(blockHeight/2);
        // var ly = (endClone.getBBox().y2+endClone.getBBox().y)/2;
        var ly = endCloneY + (blockHeight/2); // Updated for Mozill compatibility
        codeLine = snapEdit.line(x,my,x,ly);
        codeLine.attr({
          stroke: finalElem.select('rect').attr('stroke'),
          strokeWidth: 2,
          'stroke-linejoin': 'round'
        });
        finalElem.node.codeLine = codeLine;
        codeLine.node.ifBlock = finalElem;

        $(finalElem.node).hover(function(){
          $(this).find('rect').css({"stroke-width":4});
        }, function(){
          $(this).find('rect').css({"stroke-width":2});
        });

        addHover(finalElem.node);
        addHover(endClone.node);


        if(isRepeatBlock){
          // var timesClone = timesBlock.clone();
          $(timesClone.node).removeAttr("style");
          // $(timesClone.node).css('display','block');
          timesClone.attr({
            'code-level': + finalElem.attr('code-level')
          });

          x = finalElem.getBBox().x2 + blockMargin;
          y = finalElem.getBBox().y;

          timesClone.select('rect').attr({
            x: x,
            y: y,
            stroke: finalElem.select('rect').attr('stroke')
          });
          timesClone.select('text').attr({
            x: x + textXPadding,
            y: y + textYPadding
          });

          addHover(timesClone.node);
          snapEdit.add(timesClone);
        }else if(isIfBlock){
          endClone.node.prevIf = finalElem;
          finalElem.node.nextIf = endClone;
        }
        
        snapEdit.add(finalElem);
        snapEdit.add(endClone);
        snapEdit.add(codeLine);
      }else{
        // Bind a hover CSS
        addHover(finalElem.node);
        snapEdit.add(finalElem);
      }
    }else{
      finalElem.remove();
      endBlock.remove();
      // codeLine.remove();
    }

///////////////////////////////////////////////////////// Reset objects and elements
    tempElem.remove();
    verticalGuide.remove();
    horizontalGuide.remove();
    if(targetBlock !== null) $(targetBlock.node).find('rect').css({"stroke-width":2});
    targetBlock = null;

    if ($('svg#edit-panel').find('g').length > 12) {
      editPanel.attr({
        height: (blockHeight  + blockMargin) * $('svg#edit-panel').find('g').length + 5
      });
    }
  };

  addHover = function(elem){
    if($(elem).hasClass('block if') || $(elem).hasClass('block repeat')){
      $(elem).hover(function(){
        $(this).find('rect').css({"stroke-width":4});
        $(this.endBlock.node).find('rect').css({"stroke-width":4});
        $(this.codeLine.node).css({"stroke-width":4});
        if($(this).hasClass('block repeat'))
          $(this.timesBlock.node).find('rect').css({"stroke-width":4});
        if(!$(elem).hasClass('block repeat') && this.elseBlock !== null)
          $(this.elseBlock.node).find('rect').css({"stroke-width":4});
      }, function(){
        $(this).find('rect').css({"stroke-width":2});
        $(this.endBlock.node).find('rect').css({"stroke-width":2});
        $(this.codeLine.node).css({"stroke-width":2});
        if($(this).hasClass('block repeat'))
          $(this.timesBlock.node).find('rect').css({"stroke-width":2});
        if(!$(elem).hasClass('block repeat') && this.elseBlock !== null)
          $(this.elseBlock.node).find('rect').css({"stroke-width":2});
      });
    }
    else{
      $(elem).hover(function(){
        $(this).find('rect').css({"stroke-width":4});
      }, function(){
        $(this).find('rect').css({"stroke-width":2});
      });
    }
  };

  adjustBlocks = function(targetBlock, isAdd, isVerticalAdjust, newBlock){
    var ptr = targetBlock;
    var ptr1, ptr2;
    var xOrig, yOrig;
    var xAdj, yAdj;
    var isIfBlock = newBlock !== undefined ? $(newBlock.node).hasClass("block if") : false;
    var isRepeatBlock = newBlock !== undefined ? $(newBlock.node).hasClass("block repeat") : false;
    var isTargetIfBlock = $(targetBlock.node).hasClass("block if");
    var isTargetElseIfBlock = $(targetBlock.node).hasClass("block elseif");
    var isTargetElseBlock = $(targetBlock.node).hasClass("block else");
    var isTargetRepeatBlock = $(targetBlock.node).hasClass("block repeat");
    var isTargetEndBlock = $(targetBlock.node).hasClass("block end");

    if(isAdd){
      if(isVerticalAdjust){
        while(ptr !== null){
          xAdj = ptr.getBBox().x;
          yAdj = (isIfBlock || isRepeatBlock) ? ptr.getBBox().y + blockHeight + blockMargin : ptr.getBBox().y;
          ptr.select('rect').animate({              // Update the x and y of the rectangle
            x: xAdj ,
            y: yAdj + blockHeight + blockMargin
          }, 230);
          ptr.select('text').animate({                // Update the x and y of the text
            x: xAdj + textXPadding,
            y: yAdj + blockHeight + blockMargin + textYPadding
          }, 230);

          updateCodeLines(ptr, xAdj, yAdj + blockHeight + blockMargin + (blockHeight/2));

          ptr1 = ptr.node.right;
          while(ptr1 !== null){                   // Adjust right blocks
            xOrig = ptr1.getBBox().x;
            ptr1.select('rect').animate({              // Update the x and y of the rectangle
              // x: xOrig ,
              y: yAdj + blockHeight + blockMargin
            }, 230);
            ptr1.select('text').animate({              // Update the x and y of the text
              // x: xOrig + textXPadding,
              y: yAdj + blockHeight + blockMargin + textYPadding
            }, 230);

            ptr1 = ptr1.node.right;
          }

          ptr = ptr.node.nextLine;
        }
      }
      else{
        while(ptr!==null){
          xAdj = ptr.node.left===null ? newBlock.getBBox().width + (blockMargin*2) : ptr.node.left.getBBox().x2 + newBlock.getBBox().width + (blockMargin*2);
          yAdj = ptr.node.left===null ? ptr.getBBox().y : ptr.node.left.getBBox().y;

          xOrig = ptr.getBBox().x;

          ptr.select('rect').animate({              // Update the x and y of the rectangle
            // x: xOrig + xAdj + blockMargin,
            x: xAdj,
            y: yAdj
          }, 230);
          ptr.select('text').animate({                // Update the x and y of the text
            // x: xOrig + xAdj + blockMargin + textXPadding,
            x: xAdj + textXPadding,
            y: yAdj + textYPadding
          }, 230);

          ptr = ptr.node.right;
        }
      }
    }
    else{
      if(isVerticalAdjust){
        // console.log("Others are being moved");
        ptr1 = targetBlock.node.nextLine;
        xOrig = targetBlock.getBBox().x;
        var foundEnd = false;

        while(ptr1 !== null){
          if($(ptr1.node).hasClass("block end") && ptr1 === targetBlock.node.endBlock)
            foundEnd = true;

          if(!foundEnd && (isTargetIfBlock || isTargetRepeatBlock)){
            ptr1.attr({ 'code-level' : "-=1"});
          }

          xAdj = blockMargin * (parseInt(ptr1.attr('code-level'))+1);
          yAdj = ptr.getBBox().y;

          var duration = (isTargetElseBlock || isTargetElseIfBlock) ? 0 : 230;
          ptr1.select('rect').animate({              // Update the x and y of the rectangle
            x: xAdj,
            y: yAdj
          }, duration);
          ptr1.select('text').animate({                // Update the x and y of the text
            x: xAdj + textXPadding,
            y: yAdj + textYPadding
          }, duration);

          updateCodeLines(ptr1, xAdj, yAdj + (blockHeight/2) );

          ptr2 = ptr1.node.right;
          while(ptr2 !== null){
            ptr2.select('rect').animate({              // Update the x and y of the rectangle
              y: yAdj
            }, 230);
            ptr2.select('text').animate({                // Update the x and y of the text
              y: yAdj + textYPadding
            }, 230);

            ptr2 = ptr2.node.right;
          }
          ptr = ptr1;
          ptr1 = ptr1.node.nextLine;
        }
      }
      else{
        ptr1 = targetBlock.node.right;
        xAdj = ptr.getBBox().x;
        while(ptr1 !== null){
          // xOrig = ptr1.getBBox().x;
          ptr1.select('rect').animate({              // Update the x and y of the rectangle
            x: xAdj
          }, 230);
          ptr1.select('text').animate({                // Update the x and y of the text
            x: xAdj + textXPadding
          }, 230);

          xAdj = xAdj + ptr1.getBBox().width+ blockMargin;
          ptr = ptr1;
          ptr1 = ptr1.node.right;
        }
      }
    }
  };

  updateCodeLines = function(ptr, xAdj, yAdj){
    var ifBlock = ptr.node.ifBlock;
    if($(ptr.node).hasClass("block if") || $(ptr.node).hasClass("block repeat")){
      ptr.node.codeLine.animate({
        x1: xAdj,
        y1: yAdj
      },230);
    }

    if($(ptr.node).hasClass("block end")){
      ifBlock.node.codeLine.animate({
        x2: xAdj,
        y2: yAdj
      },230);
    }
  };

  // var test = $('.block.type');
  // var test = blockPanel.parent();
  
  // $('#offset').click(function() {
  //   var top = test.offset().top;
  //   var left = test.offset().left;
  //   var sleft = test.scrollLeft();
  //   console.log('top: ' + top + ', left: ' + left + ', scrollLeft:' + sleft);
  // });

  // $('#position').click(function() {
  //     var top = test.position().top;
  //     var left = test.position().left;
  //     console.log('top: ' + top + ', left: ' + left);
  // });

});