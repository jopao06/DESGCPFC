// Get SVG element
var snapBlock = Snap("#block-panel");
var snapEdit = Snap("#edit-panel");
var snapOverlay = Snap("#overlay");

// Get SVG id
var blockPanel = $('#'+snapBlock.attr().id);
var editPanel = $('#'+snapEdit.attr().id);
var overlayPanel = $('#'+snapOverlay.attr().id);

// Temporary Variables
var tempElem, finalElem;

// var blueRect = snapBlock.rect(10,10,200,50);
// blueRect.attr({
//     fill: 'blue',
//     stroke: '#000',
//     strokeWidth: 2,
//     class: "block"
// });
// var text = snapBlock.text(35,43,"IF [condition]");
// text.attr({
//   'font-size':25
// });

// var ifBlock = snapBlock.g(blueRect,text).attr({class: 'if-block'});

// var redRect = snapBlock.rect(220,10,230,50);
// redRect.attr({
//     fill: 'red',
//     stroke: '#000',
//     strokeWidth: 2,
//     class: "block"
// });
// var redtext = snapBlock.text(232,43,"WHILE [condition]");
// redtext.attr({
//   'font-size':25
// });

// var redBlock = snapBlock.g(redRect,redtext);

var defaultBlock = snapBlock.rect(10,10,40,40,5);
defaultBlock.attr({
    'fill-opacity': 0,
    stroke: '#FFFFFF',
    strokeWidth: 2,
    class: "block"
});



// var blueRect = snapBlock.rect(10,10,200,50);
// blueRect.attr({
//     fill: 'blue',
//     stroke: '#000',
//     strokeWidth: 2,
//     class: "block"
// });
// var text = snapBlock.text(35,43,"IF [condition]");
// text.attr({
//   'font-size':25
// });



// Drag functions

var move = function(dx, dy){
  tempElem.attr({
    transform: "t"+[blockPanel.position().left+dx, blockPanel.position().top+dy]
  });
  tempElem.data('shift',{dx:dx,dy:dy});
  // console.log(dx+","+dy);
};

var start = function(){
  $('#overlay').css('visibility', 'visible');
  // console.log("t"+[this.getBBox().x + blockPanel.position().left, this.getBBox().y + blockPanel.position().top]);
  tempElem = this.use();
  tempElem.attr({
    transform: "t"+[blockPanel.position().left, blockPanel.position().top]
  });
  tempElem.data('origin', { ox:tempElem.getBBox().x, oy: tempElem.getBBox().y });
  tempElem.data('shift',{dx:0,dy:0});
  snapOverlay.add(tempElem);
};

var end = function(e){
  $('#overlay').css('visibility', 'hidden');
  var compData = {
      blockPanelTop : blockPanel.position().top,
      blockPanelHeight : blockPanel.height(),
      editPanelTop : editPanel.position().top,
      editPanelHeight : editPanel.height(),
      x: this.attr('x'),
      y: this.attr('y'),
      dx: tempElem.data('shift').dx,
      dy: tempElem.data('shift').dy,
      height: this.attr('height')
    };
    // console.log(compData);
    // console.log(blockPanel.css('border-width'));

  // snapEdit.add(this.use().attr({
  //   x: tempElem.data('shift').dx
  //   - this.attr('width') 
  //   - (blockPanel.width() - this.attr('width') - this.attr('x'))
  //   - (editPanel.position().left + blockPanel.position().left - blockPanel.width())
  //   + blockPanel.position().left
  //   + blockPanel.position().left, // 4 px border from two panels and 2 stroke width of shape,
  //   //+ 14
  //   y: tempElem.data('shift').dy
  //   - this.attr('height') 
  //   - (blockPanel.height() - this.attr('height') - this.attr('y'))
  //   - (editPanel.position().top + blockPanel.position().top - blockPanel.height())
  //   + blockPanel.position().top
  //   + blockPanel.position().top // 4 px border from two panels and 2 stroke width of shape
  //   // +14
  // }));

  finalElem = this.use();
  finalElem.getBBox().x = 0;
  finalElem.getBBox().y = 0;
  console.log(finalElem.getBBox());
  snapEdit.add(finalElem);
  tempElem.remove();

};


// Initialize Dragging
// ifBlock.drag(move,start,end);
// redBlock.drag(move,start,end);