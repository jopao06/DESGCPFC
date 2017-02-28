var snapBlock = Snap("#block-panel");
var snapEdit = Snap("#edit-panel");
var snapOverlay = Snap("#overlay");

var blockPanel = $('#'+snapBlock.attr().id);
var editPanel = $('#'+snapEdit.attr().id);

var tempElem;

var blueRect = snapBlock.rect(10,10,200,125);
blueRect.attr({
    fill: 'blue',
    stroke: '#000',
    strokeWidth: 2
});


// blueRect.node.onclick = function(){
//   console.log("Blue!");
//   // $('#overlay').css('visibility', 'hidden');
// };

var move = function(dx, dy){
  tempElem.attr({
    transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx,dy]
  });
  tempElem.data('shift',{dx:dx,dy:dy});
  console.log(dx+","+dy);
};

var start = function(){
  $('#overlay').css('visibility', 'visible');
  tempElem = this.use(); 
  snapOverlay.add(tempElem);
  this.data('origTransform', this.transform().local);
};

var end = function(e){
  $('#overlay').css('visibility', 'hidden');
  console.log(this.attr('y'));
  snapEdit.add(this.use().attr({
    x: tempElem.data('shift').dx,
    y: tempElem.data('shift').dy 
    - this.attr('height') 
    - ((editPanel.position().top-blockPanel.position().top) - blockPanel.height()) 
    - (editPanel.position().top - (blockPanel.height()+blockPanel.position().top ))
    - 17
  }));
  tempElem.remove(); 
  // console.log("["+(editPanel.position().left - tempElem.data('shift').dx)+","
  //   +(editPanel.position().top - tempElem.data('shift').dy)+"]");

};


// var selectBlock = function(){
//   $('#overlay').css('visibility', 'visible');
//   // console.log(this.clone());
//   tempElem = this.use().attr({x:10,y:20}); 
//   snapOverlay.add(tempElem);
//   // tempElem.node.ondragover = function(){
//   //   tempElem.data('origTransform', tempElem.transform().local);
//   //   // tempElem.move();
//   //   console.log(this.data('origTransform'));
//   // };
//   console.log("selected");
// }

// var moveBlock = function(dx, dy){
//   // tempElem.attr({
//   //   transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx,dy]
//   // });
// }

// var releaseBlock = function(){
//   $('#overlay').css('visibility', 'hidden');
//   console.log("released");
// }

blueRect.drag(move,start,end);
