  // Get SVG element
  var snapBlock = Snap("#block-panel");
  var snapEdit = Snap("#edit-panel");
  var snapOverlay = Snap("#overlay");

  // Get SVG id
  var blockPanel = $(snapBlock.node);
  var editPanel = $(snapEdit.node);
  var overlayPanel = $(snapOverlay.node);

  var compData = {
    blockPanelTop : blockPanel.offset().top,
    blockPanelLeft : blockPanel.offset().left,
    editPanelTop : editPanel.offset().top,
    editPanelLeft : editPanel.offset().left,
    // editPanelTop : editPanel.position().top,
    // editPanelLeft : editPanel.position().left,

    blockPanelHeight : blockPanel.height(),
    editPanelHeight : editPanel.height(),
    blockPanelWidth : blockPanel.width(),
    editPanelWidth : editPanel.width(),

    head: null,
    end: null
  };

  $( window ).resize(function() {
    compData.blockPanelTop = blockPanel.offset().top;
    compData.blockPanelLeft = blockPanel.offset().left;
    compData.editPanelTop = editPanel.offset().top;
    compData.editPanelLeft = editPanel.offset().left;
  });

  var adjustBlocks;

$(document).ready(function(){
  // Temporary Variables
  var tempElem, finalElem;

  // Block Attributes
  var textXPadding = 15;
  var textYPadding = 30;
  var textSize = 15;
  var blockMargin = 8;
  var blockHeight = 30;
  var blockWidth = 20;
  var defaultX = -25;     // For clone template
  var defaultY =  10;
  var guideMargin = 8;    // Space between end of guide and corner of block
  var dragAllowance = 50; // Space around edit panel that is a acceptable 

  var targetBlock = null;
  var newTarget = null;

/////////////////////////////////////////////////////// DEFAULT BLOCK
  var defaultBlock = snapBlock.rect(defaultX,defaultY,blockWidth,blockHeight,5);
  defaultBlock.attr({
      'fill-opacity': 0,
      stroke: '#FFFFFF',
      strokeWidth: 2
      // class: "block"
  });
  var defaultText = snapBlock.text(defaultX+textXPadding,textYPadding);
  defaultText.attr({
    'font-size': textSize,
    fill: fgWhite
  });
/////////////////////////////////////////////////////// NULL BLOCK
  var nullBlock = snapEdit.rect(10,10,blockWidth/1.25,blockHeight,5);
  nullBlock.attr({
      'fill-opacity': 0,
      stroke: black,
      strokeWidth: 2,
      'stroke-dasharray':'5, 5'
  });

  nullBlock = snapEdit.g(nullBlock);
  nullBlock.attr({
    class: "null block",
    style: "display:none"
  });
  nullBlock.toDefs();
  // nullBlock.remove();
/////////////////////////////////////////////////////// END BLOCKS
  var endText = snapEdit.text(defaultY+textXPadding,defaultY+textYPadding/1.5,'end');
  endText.attr({
    'font-size': textSize,
    fill: fgWhite
  });
  var endRect = snapEdit.rect(defaultY,defaultY,endText.getBBox().width+textXPadding*2,blockHeight,5);
  endRect.attr({
      'fill-opacity': 0,
      stroke: black,
      strokeWidth: 2,
  });

  var endBlock = snapEdit.g(endRect, endText);
  endBlock.attr({
    class: "block end",
    style: "display:none"
  });
  endBlock.toDefs();
  // endBlock.remove();
/////////////////////////////////////////////////////// GUIDES
  var verticalGuide = snapEdit.path("M10 10L50 10");
  verticalGuide.attr({
      'fill-opacity': 0,
      strokeWidth: 5,
      'stroke-linecap':'round'
  });
  verticalGuide.remove();
  var horizontalGuide = snapEdit.path("M10 10L10 50");
  horizontalGuide.attr({
      'fill-opacity': 0,
      stroke: grayActive,
      strokeWidth: 5,
      'stroke-linecap':'round'
  });
  horizontalGuide.remove();

/////////////////////////////////////////////////////////// DRAG FUNCTIONS
/////////////////////////////////////////////////////// MOVE
  var compX, compY;
  var move = function(dx, dy, x, y, e){
    tempElem.attr({
      transform: "t"+[ blockPanel.offset().left+dx, blockPanel.offset().top+dy]
    });
    tempElem.data('shift',{dx:dx,dy:dy});
    tempElem.data('mouse', {x:x,y:y});

    // console.log(tempElem.data('shift').dx);

    // Check if block is dragged within editor
    if( ( x + dragAllowance > compData.editPanelLeft )                        
        &&
        ( y + dragAllowance > compData.editPanelTop )
      ){
        compX = tempElem.data('shift').dx + tempElem.data('origin').ox - editPanel.parent().offset().left;    // EXPLANATION: Parent of edit panel instead of edit panel becausee parent is fixed and cannot be scrolled
        compY = tempElem.data('shift').dy + tempElem.data('origin').oy - compData.editPanelTop + editPanel.parent().scrollTop();

        // console.log("compX: "+ compX + ", compY: "+compY);
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
    }
  };

  function showGuide(cx, cy, target){
    var caseNum = null;
    var clonedGuide;
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
      horizontalGuide.attr({
        d: "M"+target.getBBox().x2+" "+(target.getBBox().y+guideMargin)+"L"+target.getBBox().x2+" "+(target.getBBox().y2-guideMargin),
        stroke: target.select('rect').attr('stroke')
      });
      snapEdit.add(horizontalGuide);
      caseNum = 2;
    }
    // Dragged to LEFT of block
    else if(cx < target.getBBox().x && (target.getBBox().y < cy && cy < target.getBBox().y2)){
      horizontalGuide.attr({
        d: "M"+target.getBBox().x+" "+(target.getBBox().y+guideMargin)+"L"+target.getBBox().x+" "+(target.getBBox().y2-guideMargin),
        stroke: target.select('rect').attr('stroke')
      });
      snapEdit.add(horizontalGuide);
      caseNum = 3;
    }
    // Dragged to ON TOP of block
    else{
      $(target.node).find('rect').css({"stroke-width":4});
      // console.log(cx-target.getBBox().cx);
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
    var target = finalBlock = compData.head;
    var shortest;
    var temp;
    var isFirst; // If block is first block of the line
    var ptr, ptr1;

    if(y < 0 + blockMargin){
      return compData.head;
    }
    else{
      shortest = Number.POSITIVE_INFINITY;
      var i = 0;
      ptr = compData.head;
      while(ptr !== null){
        // console.log(ptr.node);
        temp = Math.sqrt(Math.pow(ptr.getBBox().cx-cx,2) + Math.pow(ptr.getBBox().cy-cy,2));
        // console.log("["+cx+","+cy+"]");
        // console.log("["+ptr.getBBox().cx+","+ptr.getBBox().cy+"]");
        // console.log(temp);
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

      finalBlock = finalBlock!==null && $(finalBlock.node).hasClass("block end") ? null : finalBlock;

      return finalBlock;
    }
    return null;
  }
/////////////////////////////////////////////////////// START
  var start = function(){
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

  // console.log($(snapEdit.node));

  var x, y, gCounter;
  var lastBlock;
  var finalRect;
  
/////////////////////////////////////////////////////// END
  var nullClone, endClone, codeLine;

  var end = function(e){
    $('#overlay').css('visibility', 'hidden');
    var target = tempElem.data('target');
    var caseNum = tempElem.data('caseNum');
    var validDrag = true;
    finalElem = this.clone();

    if($(finalElem.node).hasClass("block if")){
      endClone = endBlock.clone();

      finalElem.node.nextLine = endClone;

      endClone.node.prevLine = finalElem;
      endClone.node.nextLine = null;
      endClone.node.right = null;
      endClone.node.left = null;


      finalElem.node.endBlock = endClone;
      endClone.node.ifBlock = finalElem;
    }

    // DRAG CASES
    switch(caseNum){
      case 0: //////////////////////////////////////// TOP
        x = blockMargin;
        y = target.getBBox().y;

        adjustBlocks(target,true,true, finalElem);

        finalElem.node.right = null;
        finalElem.node.left = null;
        // If dragged to HEAD
        if(target.node.prevLine === null){
          console.log("Drag to HEAD");
          finalElem.node.prevLine = null;
          finalElem.node.nextLine = target;
          target.node.prevLine = finalElem;
          compData.head = finalElem;
        }
        else{
          console.log("Drag to TOP of target");
          finalElem.node.prevLine = target.node.prevLine;
          finalElem.node.nextLine = target;
          target.node.prevLine.node.nextLine = finalElem;
          target.node.prevLine = finalElem;
        }
        break;
      case 1: //////////////////////////////////////// BOTTOM
        console.log("Drag to BOTTOM");
        x = $(target.node).hasClass("block if") ? target.getBBox().x + blockMargin : target.getBBox().x;
        y = target.getBBox().y2 + blockMargin;

        finalElem.node.right = null;
        finalElem.node.left = null;
        // If dragged to END
        if(target.node.nextLine === null){
          finalElem.node.prevLine = target;
          finalElem.node.nextLine = null;
          target.node.nextLine = finalElem;
          compData.tail = finalElem;
        }
        else{
          adjustBlocks(target.node.nextLine,true,true, finalElem);
          finalElem.node.prevLine = target;

          if($(finalElem.node).hasClass("block if")){
            finalElem.node.endBlock.node.nextLine = target.node.nextLine;
            target.node.nextLine.node.prevLine = finalElem.node.endBlock.node.nextLine;
          }else{
            finalElem.node.nextLine = target.node.nextLine;
            target.node.nextLine.node.prevLine = finalElem;
          }
          target.node.nextLine = finalElem;
        }
        break;
      case 2: //////////////////////////////////////// RIGHT
        console.log("Drag to RIGHT");
        if($(finalElem.node).hasClass("block if")){
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
          adjustBlocks(target.node.right,true,false,finalElem);
          finalElem.node.right = target.node.right;
          finalElem.node.left = target;
          target.node.right.node.left = finalElem;
          target.node.right = finalElem;
        }
        break;
      case 3: //////////////////////////////////////// LEFT
        console.log("Drag to LEFT");
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
            console.log("Drag to Left of HEAD");
            compData.head = finalElem;
          }else{
            target.node.prevLine.node.nextLine = finalElem;
          }
          if(target.node.nextLine === null){
            console.log("Drag to Left of END");
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
        console.log(finalElem);
        break;
      case 4: //////////////////////////////////////// ON BLOCK


        break;
      case 5: //////////////////////////////////////// FIRST DRAG
        console.log("First Drag");
        x = blockMargin;
        y = this.getBBox().y;

        // console.log(x+", "+y);

        // Update Link List
        finalElem.node.prevLine = null;
        finalElem.node.right = null;
        finalElem.node.left = null;
        compData.head = finalElem;

        if($(finalElem.node).hasClass("block if")){
          compData.tail = endClone;
        }
        else{
          finalElem.node.nextLine = null;
          compData.tail = finalElem;
        }
        break;
      default:
        validDrag = false;
        console.log("ERROR: Drag unknown");
    }

    if(validDrag){
      finalRect = $(finalElem.node).find("rect");
      finalRect.attr({            // Update the x and y of the rectangle
        x: x,
        y: y
      }).next().attr({              // Update the x and y of the text
        x: x + textXPadding,
        y: (y - $(this.node).find("rect").attr('y')) + textYPadding
      });

////////////////////////////////////////////////////////// IF "IF-BLOCK"
      if($(finalElem.node).hasClass("block if")){

        // endClone = endBlock.clone();
        $(endClone.node).removeAttr("style");
        endClone.select('rect').attr({
          x: x,
          y: y + finalElem.getBBox().height + blockMargin,
          stroke: finalElem.select('rect').attr('stroke')
        });
        endClone.select('text').attr({
          x: x + textXPadding,
          y: y + finalElem.getBBox().height + blockMargin + textYPadding/1.5
        });
        finalElem.node.endBlock = endClone;
        
        var my = y+(finalElem.getBBox().height/2);
        var ly = (endClone.getBBox().y2+endClone.getBBox().y)/2;
        codeLine = snapEdit.line(x,my,x,ly);
        codeLine.attr({
          stroke: finalElem.select('rect').attr('stroke'),
          strokeWidth: 5,
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


    // Add finalBlock block to edit panel

///////////////////////////////////////////////////////// Reset objects and elements
    tempElem.remove();
    verticalGuide.remove();
    horizontalGuide.remove();
    // console.log(targetBlock);
    if(targetBlock !== null) $(targetBlock.node).find('rect').css({"stroke-width":2});
    targetBlock = null;

    if ($('svg#edit-panel').find('g').length > 12) {
      editPanel.attr({
        height: (blockHeight  + blockMargin) * $('svg#edit-panel').find('g').length + 5
      });
    }
  };

  addHover = function(elem){
    if($(elem).hasClass('block if')){
      $(elem).hover(function(){
        $(this).find('rect').css({"stroke-width":4});
        $(this.endBlock.node).find('rect').css({"stroke-width":4});
        $(this.codeLine.node).css({"stroke-width":4});
      }, function(){
        $(this).find('rect').css({"stroke-width":2});
        $(this.endBlock.node).find('rect').css({"stroke-width":2});
        $(this.codeLine.node).css({"stroke-width":5});
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

  adjustBlocks = function (targetBlock, isAdd, isVerticalAdjust, newBlock){
    var ptr = targetBlock;
    var ptr1, ptr2;
    var xOrig, yOrig;
    var xAdj, yAdj;

    if(isAdd){
      if(isVerticalAdjust){
        // console.log("Vertical Adjust");
        while(ptr !== null){
          xAdj = ptr.getBBox().x;
          // console.log($(newBlock.node).hasClass("block if"));
          yAdj = $(newBlock.node).hasClass("block if") ? ptr.getBBox().y + blockHeight + blockMargin : ptr.getBBox().y;
          ptr.select('rect').animate({              // Update the x and y of the rectangle
            x: xAdj ,
            y: yAdj + blockHeight + blockMargin
          }, 230);
          ptr.select('text').animate({                // Update the x and y of the text
            x: xAdj + textXPadding,
            y: yAdj + blockHeight + textYPadding
          }, 230);

          if($(ptr.node).hasClass("block if")){
            console.log("ANIMATE LINE HEAD");
            // var ifBlock = ptr.node.ifBlock;
            // var my = yAdj + (blockHeight/2);
            var x = ptr.getBBox().x;
            // console.log("M"+x+","+my+"L"+x+","+ly);
            ptr.node.codeLine.animate({
              x1: x,
              y1: yAdj + blockHeight + blockMargin + (blockHeight/2),
            },230);
          }

          if($(ptr.node).hasClass("block end")){
            console.log("ANIMATE LINE END");
            var ifBlock = ptr.node.ifBlock;
            // console.log(my);
            // var my = ifBlock.getBBox().y + (blockHeight/2);
            var ly = yAdj + blockHeight + (blockHeight/2);
            var x = ifBlock.getBBox().x;
            // console.log("M"+x+","+my+"L"+x+","+ly);

            // console.log(ifBlock.node.codeLine);
            // ifBlock.node.codeLine.animate({
            //   x1: x,
            //   y1: my
            // },230);
            ifBlock.node.codeLine.animate({
              x2: x,
              y2: ly + blockMargin
            },230);
            console.log(ifBlock.node.codeLine.node);
          }

          ptr1 = ptr.node.right;
          while(ptr1 !== null){                   // Adjust right blocks
            xOrig = ptr1.getBBox().x;
            ptr1.select('rect').animate({              // Update the x and y of the rectangle
              x: xOrig ,
              y: yAdj + blockHeight + blockMargin
            }, 230);
            ptr1.select('text').animate({              // Update the x and y of the text
              x: xOrig + textXPadding,
              y: yAdj + blockHeight + textYPadding
            }, 230);

            ptr1 = ptr1.node.right;
          }

          ptr = ptr.node.nextLine;
        }
      }
      else{
        // console.log("Horizontal Adjust");
        while(ptr!==null){
          xAdj = newBlock.getBBox().width;
          yAdj = ptr.getBBox().y;

          xOrig = ptr.getBBox().x;

          ptr.select('rect').animate({              // Update the x and y of the rectangle
            x: xOrig + xAdj + blockMargin,
            y: yAdj
          }, 230);
          ptr.select('text').animate({                // Update the x and y of the text
            x: xOrig + xAdj + blockMargin + textXPadding,
            y: ptr.select('text').attr('y')
          }, 230);

          ptr = ptr.node.right;
        }
      }
    }
    else{
      if(isVerticalAdjust){
        ptr1 = targetBlock.node.nextLine;
        while(ptr1 !== null){
          ptr1.select('rect').animate({              // Update the x and y of the rectangle
            y: ptr.getBBox().y
          }, 230);
          ptr1.select('text').animate({                // Update the x and y of the text
            y: ptr.select('text').attr('y')
          }, 230);

          ptr2 = ptr1.node.right;
          while(ptr2 !== null){
            ptr2.select('rect').animate({              // Update the x and y of the rectangle
              y: ptr.getBBox().y
            }, 230);
            ptr2.select('text').animate({                // Update the x and y of the text
              y: ptr.select('text').attr('y')
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

/////////////////////////////////////////////////////////// INITIALIZE BLOCK PANEL
  var prevBlock = defaultBlock;
  var tempText;
  var groupedBlock;
  var w;

  // Populate blovks
  for(var i=0; i<blocks.length; i++){
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
      class: blocks[i].class
    });
    groupedBlock.drag(move,start,end);
    prevBlock = tempElem;
  }

  // Update blockpanel dimensions
  blockPanel.attr({
    width: parseInt(prevBlock.attr('x')) + parseInt(prevBlock.attr('width')) + blockMargin,
    height: blockMargin + blockMargin + blockHeight
  });

  // Scroll Button Click functions for Block Panel
  $('#block-go-left').click(function(){
    $('#scrollable-div').animate({scrollLeft:'-=350px'});
  });
  
  $('#block-go-right').click(function(){
    $('#scrollable-div').animate({scrollLeft:'+=350px'});
  });

  // var test = $('.block.type');
  var test = blockPanel.parent();
  
  $('#offset').click(function() {
    var top = test.offset().top;
    var left = test.offset().left;
    var sleft = test.scrollLeft();
    console.log('top: ' + top + ', left: ' + left + ', scrollLeft:' + sleft);
  });

  $('#position').click(function() {
      var top = test.position().top;
      var left = test.position().left;
      console.log('top: ' + top + ', left: ' + left);
  });

});