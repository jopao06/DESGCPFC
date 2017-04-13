  // Get SVG element
  var snapBlock = Snap("#block-panel");
  var snapEdit = Snap("#edit-panel");
  var snapOverlay = Snap("#overlay");

  // Get SVG id
  var blockPanel = $(snapBlock.node);
  var editPanel = $(snapEdit.node);
  var overlayPanel = $(snapOverlay.node);

  var compData = {
    blockPanelTop : blockPanel.position().top,
    blockPanelLeft : blockPanel.position().left,
    editPanelTop : editPanel.position().top,
    editPanelLeft : editPanel.position().left,

    blockPanelHeight : blockPanel.height(),
    editPanelHeight : editPanel.height(),
    blockPanelWidth : blockPanel.width(),
    editPanelWidth : editPanel.width(),

    head: null,
    end: null
  };

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

  

  var verticalGuide = snapEdit.path("M10 10L50 10");
  verticalGuide.attr({
      'fill-opacity': 0,
      stroke: grayActive,
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
      transform: "t"+[blockPanel.offset().left+dx, blockPanel.offset().top+dy]
    });
    tempElem.data('shift',{dx:dx,dy:dy});
    tempElem.data('mouse', {x:x,y:y});

    // console.log(compData.head)

    // Check if block is dragged within editor
    if( ( tempElem.data('mouse').x + dragAllowance > compData.editPanelLeft )                        
        &&
        ( tempElem.data('mouse').y + dragAllowance > compData.editPanelTop )
      ){
        // console.log(editPanel.parent().scrollTop());
        compX = dx - compData.editPanelLeft + compData.blockPanelLeft + this.getBBox().x;
        compY = dy - compData.editPanelTop + compData.blockPanelTop + defaultY + editPanel.parent().scrollTop();

        newTarget = findTarget(compX + (tempElem.getBBox().width / 2), compY + (tempElem.getBBox().height / 2), tempElem);
        
        // Reset CSS
        verticalGuide.remove();
        horizontalGuide.remove();
        if(targetBlock !== null) $(targetBlock.node).find('rect').css({"stroke-width":2});
        
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
      if(target.node.left === null){
        caseNum = 0;
      }
      else{
        caseNum = 3;
      }
    }

    return caseNum;
  };

  function findTarget(cx, cy, block){
    var target = final = compData.head;
    var shortest;
    var temp;
    var isFirst; // If block is first block of the line
    var ptr, ptr1;

    // console.log("-------FIND TARGET-------");

    if(y < 0 + blockMargin){
      return compData.head;
    }
    else{
      // target = compData.head;
      shortest = Number.POSITIVE_INFINITY;
      var i = 0;
      ptr = compData.head;
      while(ptr !== null){
        temp = Math.sqrt(Math.pow(ptr.getBBox().cx-cx,2) + Math.pow(ptr.getBBox().cy-cy,2));
        // console.log(ptr);

        final = temp <= shortest ? ptr : final;
        shortest = temp <= shortest ? temp : shortest;
        ptr1 = ptr.node.right;
        while(ptr1 !== null){
          temp = Math.sqrt(Math.pow(ptr1.getBBox().cx-cx,2) + Math.pow(ptr1.getBBox().cy-cy,2));

          // console.log(ptr1);

          if(!(cy < ptr1.getBBox().y || cy > ptr1.getBBox().y2)){
            final = temp <= shortest ? ptr1 : final;
            shortest = temp <= shortest ? temp : shortest;
          }

          ptr1 = ptr1.node.right;
        }

        ptr = ptr.node.nextLine;
      }

      return final;
    }
    return null;
  };
/////////////////////////////////////////////////////// START
  var start = function(){
    $('#overlay').css('visibility', 'visible');
    tempElem = this.clone();
    tempElem.attr({
      transform: "t"+[compData.blockPanelLeft, compData.blockPanelTop]
    });
    tempElem.data('origin', { ox:tempElem.getBBox().x, oy: tempElem.getBBox().y });
    tempElem.data('shift',{dx:0,dy:0});
    tempElem.data('caseNum', null);
    snapOverlay.add(tempElem);
  };

  // console.log($(snapEdit.node));

  var x, y, gCounter;
  var lastBlock;
  var finalRect;
  

  $( window ).resize(function() {
    compData.blockPanelTop = blockPanel.position().top;
    compData.blockPanelLeft = blockPanel.position().left;
    compData.editPanelTop = editPanel.position().top;
    compData.editPanelLeft = editPanel.position().left;
  });
/////////////////////////////////////////////////////// END
  var end = function(e){
    $('#overlay').css('visibility', 'hidden');
    var target = tempElem.data('target');
    var caseNum = tempElem.data('caseNum');
    finalElem = this.clone();

    // DRAG CASES
    switch(caseNum){
      case 0: // TOP
        x = blockMargin;
        y = target.getBBox().y;

        adjustBlocks(target,true,true);

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
      case 1: // BOTTOM
        console.log("Drag to BOTTOM");
        x = blockMargin;
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
          adjustBlocks(target.node.nextLine,true,true);
          finalElem.node.prevLine = target;
          finalElem.node.nextLine = target.node.nextLine;
          target.node.nextLine.node.prevLine = finalElem;
          target.node.nextLine = finalElem;
        }
        break;
      case 2: // RIGHT
        console.log("Drag to RIGHT");
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
      case 3: // LEFT
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
      case 4: // ON BLOCK


        break;
      case 5: // FIRST DRAG
        console.log("First Drag");
        x = blockMargin;
        y = this.getBBox().y;

        console.log(x+", "+y);

        // Update Link List
        finalElem.node.prevLine = null;
        finalElem.node.nextLine = null;
        finalElem.node.right = null;
        finalElem.node.left = null;
        compData.head = finalElem;
        compData.tail = finalElem;
        break;
      default:
        console.log("ERROR: Drag unknown");
    }

    finalRect = $(finalElem.node).find("rect");
    finalRect.attr({            // Update the x and y of the rectangle
      x: x,
      y: y
    })
    .next().attr({              // Update the x and y of the text
      x: x + textXPadding,
      y: (y - $(this.node).find("rect").attr('y')) + textYPadding
    });

    // console.log(compData);
    // Bind a hover CSS
    $(finalElem.node).hover(function(){
      // console.log($(this));
      $(this).find('rect').css({"stroke-width":4});
    }, function(){
      // console.log("Mouse leave");
      $(this).find('rect').css({"stroke-width":2});
    });

    // Add final block to edit panel
    snapEdit.add(finalElem);

    // Reset objects and elements
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

  adjustBlocks = function (targetBlock, isAdd, isVerticalAdjust, newBlock){
    var ptr = targetBlock;
    var ptr1, ptr2;
    var xOrig, yOrig;
    var xAdj, yAdj;

    if(isAdd){
      if(isVerticalAdjust){
        // console.log("Vertical Adjust");
        while(ptr !== null){
          // console.log(ptr);
          xAdj = ptr.getBBox().x;
          yAdj = ptr.getBBox().y;
          ptr.select('rect').animate({              // Update the x and y of the rectangle
            x: xAdj ,
            y: yAdj + blockHeight + blockMargin
          }, 230);
          ptr.select('text').animate({                // Update the x and y of the text
            x: xAdj + textXPadding,
            y: yAdj + blockHeight + textYPadding
          }, 230);

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
  }

/////////////////////////////////////////////////////////// INITIALIZE BLOCK PANEL
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
      x: parseInt(tempElem.attr('x')) + textXPadding,
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
});