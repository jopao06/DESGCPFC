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
      transform: "t"+[blockPanel.position().left+dx, blockPanel.position().top+dy]
    });
    tempElem.data('shift',{dx:dx,dy:dy});
    tempElem.data('mouse', {x:x,y:y})
    // console.log(tempElem.data('shift'));
    // console.log(dx+","+dy);
  };

  var start = function(){
    $('#overlay').css('visibility', 'visible');
    // console.log("t"+[this.getBBox().x + blockPanel.position().left, this.getBBox().y + blockPanel.position().top]);
    tempElem = this.clone();
    tempElem.attr({
      transform: "t"+[blockPanel.position().left, blockPanel.position().top]
    });
    tempElem.data('origin', { ox:tempElem.getBBox().x, oy: tempElem.getBBox().y });
    tempElem.data('shift',{dx:0,dy:0});
    snapOverlay.add(tempElem);
  };

  // console.log($(snapEdit.node));

  var end = function(e){
    $('#overlay').css('visibility', 'hidden');
    // var compData = {
    //     blockPanelTop : blockPanel.offset().top,
    //     blockPanelLeft : blockPanel.offset().left,
    //     blockPanelHeight : blockPanel.height(),
    //     editPanelTop : editPanel.offset().top,
    //     editPanelLeft : editPanel.offset().left,
    //     editPanelHeight : editPanel.height(),
    //     x: this.getBBox().x,
    //     y: this.getBBox().y,
    //     dx: tempElem.data('shift').dx,
    //     dy: tempElem.data('shift').dy,
    //     height: this.getBBox().height,
    //     topDiff: editPanel.offset().top - blockPanel.offset().top,
    //     leftDiff: editPanel.offset().left - blockPanel.offset().left
    // };
    // console.log(this.node);
    // console.log(compData);
    var dragAllowance = 50;
    var x, y, gCounter;
    var lastGroup;
    if( ( tempElem.data('mouse').x + dragAllowance > editPanel.offset().left )    // Check if block is dragged within editor
        &&
        ( tempElem.data('mouse').y + dragAllowance > editPanel.offset().top )
      )
        {
          // console.log(editPanel.children('g').length);
          gCounter = editPanel.children('g').length;
          if(gCounter == 0){
            x = block_margin;
            y = parseInt($(this.node).find("rect").attr('y'));
          }
          else{
            lastGroup = editPanel.children('g')[gCounter - 1];
            x = block_margin;
            y = lastGroup.getBBox().y + lastGroup.getBBox().height + block_margin;
          }

          finalElem = this.clone();
          var finalRect = $(finalElem.node).find("rect");
          finalRect.attr({
            x: x,
            y: y
          })
          .next().attr({
            x: x + textXPadding,
            y: (y - $(this.node).find("rect").attr('y')) + textYPadding
          });
          snapEdit.add(finalElem);
        }
    tempElem.remove();
  };


  var textXPadding = 15;
  var textYPadding = 35;
  var block_margin = 10;

  // Block to clone
  var defaultX = -41;
  var defaultY =  10;
  var defaultBlock = snapBlock.rect(defaultX,defaultY,40,40,5);
  defaultBlock.attr({
      'fill-opacity': 0,
      stroke: '#FFFFFF',
      strokeWidth: 2,
      class: "block"
  });
  var defaultText = snapBlock.text(defaultX+textXPadding,textYPadding,"Q");
  defaultText.attr({
    'font-size':20,
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
      x: parseInt(prevBlock.attr('x')) + parseInt(prevBlock.attr('width')) + block_margin,
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
    width: parseInt(prevBlock.attr('x')) + parseInt(prevBlock.attr('width')) + 10
  });

  $('#scrollable-div').find(".less-equal").addClass('active');

  var leftOffset;
  $('#block-go-left').click(function(){
    $('#scrollable-div').animate({scrollLeft:'-=350px'});
  });
  
  $('#block-go-right').click(function(){
    $('#scrollable-div').animate({scrollLeft:'+=350px'});
  });

  console.log(snapBlock.select(".repeat").getBBox().x);

});