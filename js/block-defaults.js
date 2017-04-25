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

// Block Attributes
var defaultX = -21;     // For clone template
var defaultY =  10;
var textXPadding = 18;
var textYPadding = 20;
var textSize = 15;
var blockMargin = 8;
var blockHeight = 30;
var blockWidth = 20;
var guideMargin = 8;    // Space between end of guide and corner of block
var dragAllowance = 50; // Space around edit panel that is a acceptable 

// Block Functions
var adjustBlocks;
var addHover;

/////////////////////////////////////////////////////// DEFAULT BLOCK
var defaultBlock = snapBlock.rect(defaultX,defaultY,blockWidth,blockHeight,5);
defaultBlock.attr({
    'fill-opacity': 0,
    stroke: '#FFFFFF',
    strokeWidth: 2
    // class: "block"
});
var defaultText = snapBlock.text(defaultX+textXPadding,defaultY+textYPadding);
defaultText.attr({
  'font-size': textSize,
  fill: fgWhite
});
/////////////////////////////////////////////////////// END BLOCKS
var endText = snapEdit.text(defaultY+textXPadding,defaultY+textYPadding,'end');
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
  style: "display:none",
  'code-level': 0
});
endBlock.toDefs();
/////////////////////////////////////////////////////// TIMES BLOCK
var timesText = snapEdit.text(defaultY+textXPadding,defaultY+textYPadding,'times');
timesText.attr({
  'font-size': textSize,
  fill: fgWhite
});
var timesRect = snapEdit.rect(defaultY,defaultY,timesText.getBBox().width+textXPadding*2,blockHeight,5);
timesRect.attr({
    'fill-opacity': 0,
    stroke: purple,
    strokeWidth: 2,
});

var timesBlock = snapEdit.g(timesRect, timesText);
timesBlock.attr({
  class: "block times",
  'code-level': 0
});
timesBlock.toDefs();
/////////////////////////////////////////////////////// ELSEIF BLOCK
var elseIfText = snapEdit.text(defaultY+textXPadding,defaultY+textYPadding,'elseif');
elseIfText.attr({
  'font-size': textSize,
  fill: fgWhite
});
var elseIfRect = snapEdit.rect(defaultY,defaultY,elseIfText.getBBox().width+textXPadding*2,blockHeight,5);
elseIfRect.attr({
    'fill-opacity': 0,
    stroke: aqua,
    strokeWidth: 2,
});

var elseIfBlock = snapEdit.g(elseIfRect, elseIfText);
elseIfBlock.attr({
  class: "block elseif",
  'code-level': 0
});
elseIfBlock.toDefs();
/////////////////////////////////////////////////////// ELSE BLOCK
var elseText = snapEdit.text(defaultY+textXPadding,defaultY+textYPadding,'else');
elseText.attr({
  'font-size': textSize,
  fill: fgWhite
});
var elseRect = snapEdit.rect(defaultY,defaultY,elseText.getBBox().width+textXPadding*2,blockHeight,5);
elseRect.attr({
    'fill-opacity': 0,
    stroke: aqua,
    strokeWidth: 2,
});

var elseBlock = snapEdit.g(elseRect, elseText);
elseBlock.attr({
  class: "block else",
  'code-level': 0
});
elseBlock.toDefs();
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