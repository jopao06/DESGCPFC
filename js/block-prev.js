$(document).ready(function(){

  // Get SVG element
  var snapBlock = Snap("#block-panel");
  var snapEdit = Snap("#edit-panel");
  var snapOverlay = Snap("#overlay");

  // Get SVG id
  var blockPanel = $(snapBlock.node);
  var editPanel = $(snapEdit.node);
  var overlayPanel = $(snapOverlay.node);

  // Temporary Variables
  var tempElem, finalElem;

  // Drag functions
  var move = function(dx, dy, x, y, e){
    tempElem.attr({
      transform: "t"+[blockPanel.offset().left+dx, blockPanel.offset().top+dy]
    });
    tempElem.data('shift',{dx:dx,dy:dy});
    tempElem.data('mouse', {x:x,y:y});
    // console.log(tempElem.data('shift'));
    // console.log(dx+","+dy);
  };

  var start = function(){
    $('#overlay').css('visibility', 'visible');
    // console.log("t"+[this.getBBox().x + compData.blockPanelLeft, this.getBBox().y + compData.blockPanelTop]);
    tempElem = this.clone();
    tempElem.attr({
      transform: "t"+[compData.blockPanelLeft, compData.blockPanelTop]
    });
    tempElem.data('origin', { ox:tempElem.getBBox().x, oy: tempElem.getBBox().y });
    tempElem.data('shift',{dx:0,dy:0});
    snapOverlay.add(tempElem);
  };

  // console.log($(snapEdit.node));

  var dragAllowance = 50;
  var x, y, gCounter;
  var lastBlock;
  var finalRect;
  var compData = {
        blockPanelTop : blockPanel.offset().top,
        blockPanelLeft : blockPanel.offset().left,
        editPanelTop : editPanel.offset().top,
        editPanelLeft : editPanel.offset().left,

        blockPanelHeight : blockPanel.height(),
        editPanelHeight : editPanel.height(),
        blockPanelWidth : blockPanel.width(),
        editPanelWidth : editPanel.width(),
  };

  $( window ).resize(function() {
    compData.blockPanelTop = blockPanel.offset().top;
    compData.blockPanelLeft = blockPanel.offset().left;
    compData.editPanelTop = editPanel.offset().top;
    compData.editPanelLeft = editPanel.offset().left;
  });

  var end = function(e){
    $('#overlay').css('visibility', 'hidden');
    // compData = {
    //     blockPanelTop : blockPanel.offset().top,
    //     blockPanelLeft : blockPanel.offset().left,
    //     blockPanelHeight : blockPanel.height(),
    //     editPanelTop : compData.editPanelTop,
    //     compData.editPanelLeft : compData.editPanelLeft,
    //     editPanelHeight : editPanel.height(),
    //     x: this.getBBox().x,
    //     y: this.getBBox().y,
    //     dx: tempElem.data('shift').dx,
    //     dy: tempElem.data('shift').dy,
    //     moX: tempElem.data('mouse').x,
    //     moY: tempElem.data('mouse').y,
    //     height: this.getBBox().height,
    //     topDiff: compData.editPanelTop - blockPanel.offset().top,
    //     leftDiff: compData.editPanelLeft - blockPanel.offset().left
    // };
    // console.log(compData);
    // Check if block is dragged within editor
    if( ( tempElem.data('mouse').x + dragAllowance > compData.editPanelLeft )                        
        &&
        ( tempElem.data('mouse').y + dragAllowance > compData.editPanelTop )
      )
        {
          gCounter = editPanel.children('g').length;
          finalElem = this.clone();
          
          if(gCounter === 0){ // CASE 1: First Drag
            x = blockMargin;
            y = this.getBBox().y;

            // Update Link List
            compData.prevLine = finalElem;
            finalElem.node.prevLine = null;
            finalElem.node.nextLine = null;
            finalElem.node.right = null;
            finalElem.node.left = null;
            compData.head = finalElem;
            compData.end = finalElem;
          }
          else{
            var compX = tempElem.data('shift').dx - compData.editPanelLeft + compData.blockPanelLeft + this.getBBox().x;
            var compY = tempElem.data('shift').dy - compData.editPanelTop + compData.blockPanelTop + defaultY;

            var targetBlock = findTarget(compX + (tempElem.getBBox().width / 2), compY + (tempElem.getBBox().height / 2), tempElem);

            console.log("Final");
            console.log(targetBlock.node);

            // CASE 2: Drag to head
            if(compY < 0 + blockMargin || (compY < compData.head.getBBox().cy && (compData.head.getBBox().x <= compX && compX <= compData.head.getBBox().x2))){ 
              console.log("Drag to Head");
              x = blockMargin;
              y = defaultY;

              adjustBlocks(compData.head);

              // Update Link List
              finalElem.node.prevLine = null;
              finalElem.node.nextLine = compData.head;
              compData.head.node.prevLine = finalElem;
              compData.head = finalElem;
            }

            // CASE 3: Drag to end
            else if(compY > compData.end.getBBox().y2){  
              console.log("Drag to End");
              x = blockMargin;
              y = compData.end.getBBox().y + compData.end.getBBox().height + blockMargin;

              // Update Link List
              finalElem.node.prevLine = compData.end;
              finalElem.node.nextLine = null;
              compData.end.node.nextLine = finalElem;
              compData.end = finalElem;
            }

            // CASE 4: Drag to vertical Mid but on target
            else if(compY <= targetBlock.getBBox().cy && (targetBlock.getBBox().x-blockMargin <= compX+(tempElem.getBBox().width/2) && compX+(tempElem.getBBox().width/2) <= targetBlock.getBBox().x2)){
              console.log("Drag to Vertical Mid on target");
              x = targetBlock.getBBox().x;
              y = targetBlock.getBBox().y;

              adjustBlocks(targetBlock);

              // Update Link List
              finalElem.node.prevLine = targetBlock.node.prevLine;
              finalElem.node.nextLine = targetBlock;
              targetBlock.node.prevLine.node.nextLine = finalElem;
              targetBlock.node.prevLine = finalElem;
            }

            // CASE 4: Drag to Vertical Mid
            else if(targetBlock.getBBox().cy <= compY+(tempElem.getBBox().height / 2) && compY+(tempElem.getBBox().height / 2) <= targetBlock.node.nextLine.getBBox().cy){
              console.log("Drag to Vertical Mid");
              //
              x = targetBlock.node.nextLine.getBBox().x;
              y = targetBlock.node.nextLine.getBBox().y;

              adjustBlocks(targetBlock.node.nextLine);

              // Update Link List
              finalElem.node.prevLine = targetBlock;
              finalElem.node.nextLine = targetBlock.node.nextLine;
              targetBlock.node.nextLine.node.prevLine = finalElem;
              targetBlock.node.nextLine = finalElem;
              //*/

              /*/
              x = targetBlock.getBBox().x;
              y = targetBlock.getBBox().y;

              adjustBlocks(targetBlock);

              // Update Link List
              finalElem.node.prevLine = targetBlock;
              finalElem.node.nextLine = targetBlock.node.nextLine;
              targetBlock.node.nextLine.node.prevLine = finalElem;
              targetBlock.node.nextLine = finalElem;
              //*/
            }

            // CASE 5: Drag to right
            else if(compY+(tempElem.getBBox().height / 2) <= targetBlock.getBBox().cy && compX > targetBlock.getBBox().x2){
              console.log("Drag to right");
              x = targetBlock.getBBox().x2 + blockMargin;
              y = targetBlock.getBBox().y;


            }

            else{
              console.log("Woops");
              x = compX;
              y = compY;
            }
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
          // console.log(finalElem.node.mx+","+finalElem.node.my);
        }
    tempElem.remove();

    // console.log(compData.editPanelTop + compData.editPanelHeight);
    // console.log($(compData.end.node).offset().top+", "+ blockHeight);
    if ($('svg#edit-panel').find('g').length > 12) {
      editPanel.attr({
        height: (blockHeight  + blockMargin) * $('svg#edit-panel').find('g').length + 5
      });
    }
  };

  function findTarget(cx, cy, block){
    var target = final = compData.head;
    var shortest;
    var temp;

    if(y < 0 + blockMargin){
      return compData.head;
    }
    else{
      console.log("Find target");
      target = compData.head;
      shortest = Number.POSITIVE_INFINITY;
      var i = 0;
      // while(target !== null){
      //   console.log(target.node);
      //   // i += 1;
      //   target = target.node.nextLine;
      // }

      $.each(snapEdit.selectAll('g'), function(i, target){
        console.log(target.node);
        temp = Math.sqrt(Math.pow(target.getBBox().cx-cx,2) + Math.pow(target.getBBox().cy-cy,2));
        console.log(temp);
        // console.log(shortest);

        final = temp <= shortest ? target : final;
        shortest = temp <= shortest ? temp : shortest;
        // console.log(final.node);
      });

      // console.log(final.node);

      return final;
    }

    return null;
  }

  function adjustBlocks(targetBlock){
    var ptr = targetBlock;
    while(ptr !== null){
      // console.log(ptr);
      yAdj = ptr.getBBox().y;
      ptr.select('rect').animate({            // Update the x and y of the rectangle
        x: x ,
        y: yAdj + blockHeight + blockMargin
      }, 230);
      ptr.select('text').animate({              // Update the x and y of the text
        x: x + textXPadding,
        y: yAdj + blockHeight + textYPadding
      }, 230);

      ptr = ptr.node.nextLine;
    }
  }

  // Block Attributes
  var textXPadding = 15;
  var textYPadding = 30;
  var textSize = 15;
  var blockMargin = 8;
  var blockHeight = 30;
  var blockWidth = 20;
  var defaultX = -25;     // For clone template
  var defaultY =  10;


  var defaultBlock = snapBlock.rect(defaultX,defaultY,blockWidth,blockHeight,5);
  defaultBlock.attr({
      'fill-opacity': 0,
      stroke: '#FFFFFF',
      strokeWidth: 2,
      class: "block"
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

  blockPanel.attr({
    width: parseInt(prevBlock.attr('x')) + parseInt(prevBlock.attr('width')) + blockMargin,
    height: blockMargin + blockMargin + blockHeight
  });

  $('#scrollable-div').find(".less-equal").addClass('active');

  var leftOffset;
  $('#block-go-left').click(function(){
    $('#scrollable-div').animate({scrollLeft:'-=350px'});
  });
  
  $('#block-go-right').click(function(){
    $('#scrollable-div').animate({scrollLeft:'+=350px'});
  });
});