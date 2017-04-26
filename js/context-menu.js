var deleteRightBlocks = function(triggerBlock){
  var ptr, ptr1;
  var isIfBlock = $(triggerBlock.node).hasClass("block if");
  var isElseIfBlock = $(triggerBlock.node).hasClass("block elseif");
  var isRepeatBlock = $(triggerBlock.node).hasClass("block repeat");
  var isEndBlock = $(triggerBlock.node).hasClass("block end");
  var isTimesBlock = $(triggerBlock.node).hasClass("block times");

  if(isIfBlock || isElseIfBlock || isRepeatBlock){
    ptr = triggerBlock.node.right;
    triggerBlock.node.right = null;
    while(ptr!==null){
      ptr1 = ptr;
      ptr = ptr.node.right;
      ptr1.remove();
    }
  }
};

var deleteHead = function(triggerBlock){
  console.log("DELETE HEAD");
  var isIfBlock = $(triggerBlock.node).hasClass("block if");
  var isRepeatBlock = $(triggerBlock.node).hasClass("block repeat");
  var isEndBlock = $(triggerBlock.node).hasClass("block end");
  deleteRightBlocks(triggerBlock);

  // CASE 1.1: If has no right node, adjust next line blocks
  if(triggerBlock.node.right === null){
    if(!isIfBlock && !isRepeatBlock && !isEndBlock)
      adjustBlocks(triggerBlock,false,true);

    // if(isIfBlock) triggerBlock.node.nextLine = null;
    if(triggerBlock.node.nextLine !== null){
      triggerBlock.node.nextLine.node.prevLine = null;
    }
    else compData.tail = null;
    compData.head = triggerBlock.node.nextLine;
  }
  // CASE 1.2: If has right nodes, adjust right blocks
  else{
    if(!isIfBlock && !isRepeatBlock && !isEndBlock)
      adjustBlocks(triggerBlock,false,false);
    triggerBlock.node.right.node.nextLine = triggerBlock.node.nextLine;
    if(triggerBlock.node.nextLine !== null) triggerBlock.node.nextLine.node.prevLine = triggerBlock.node.right;
    compData.head = triggerBlock.node.right;
  }
};

var deleteEnd = function(triggerBlock){
  console.log("DELETE TAIL");
  var isIfBlock = $(triggerBlock.node).hasClass("block if");
  var isRepeatBlock = $(triggerBlock.node).hasClass("block repeat");
  var isEndBlock = $(triggerBlock.node).hasClass("block end");
  deleteRightBlocks(triggerBlock);

  // CASE 2.1: If has no right node, adjust next line blocks
  if(triggerBlock.node.right === null){
    if(!isIfBlock && !isRepeatBlock && !isEndBlock)
      adjustBlocks(triggerBlock,false,true);
    if(triggerBlock.node.prevLine !== null) triggerBlock.node.prevLine.node.nextLine = null;
    compData.tail = triggerBlock.node.prevLine;
  }
  // CASE 2.2: If has right nodes, adjust right blocks
  else{
    if(!isIfBlock && !isRepeatBlock && !isEndBlock)
      adjustBlocks(triggerBlock,false,false);
    triggerBlock.node.right.node.prevLine = triggerBlock.node.prevLine;
    if(triggerBlock.node.prevLine !== null) triggerBlock.node.prevLine.node.nextLine = triggerBlock.node.right;
    compData.tail = triggerBlock.node.right;
  }
};

var deleteVerticalMid = function(triggerBlock){
  console.log("DELETE VERTICAL MID");
  var isIfBlock = $(triggerBlock.node).hasClass("block if");
  var isRepeatBlock = $(triggerBlock.node).hasClass("block repeat");
  var isEndBlock = $(triggerBlock.node).hasClass("block end");
  deleteRightBlocks(triggerBlock);

  if($(triggerBlock.node).hasClass("block elseif")){
    var elseIfArray = triggerBlock.node.ifBlock.node.elseIfBlocks;
    elseIfArray.splice(elseIfArray.indexOf(triggerBlock));
  }
  // CASE 3.1: If has no right node, adjust next line blocks
  if(triggerBlock.node.right === null){
    if(!isIfBlock && !isRepeatBlock && !isEndBlock)
      adjustBlocks(triggerBlock,false,true);
    triggerBlock.node.nextLine.node.prevLine = triggerBlock.node.prevLine;
    triggerBlock.node.prevLine.node.nextLine = triggerBlock.node.nextLine;
  }
  // CASE 3.2: If has right nodes, adjust right blocks
  else{
    if(!isIfBlock && !isRepeatBlock && !isEndBlock)
      adjustBlocks(triggerBlock,false,false);
    triggerBlock.node.right.node.nextLine = triggerBlock.node.nextLine;
    triggerBlock.node.right.node.prevLine = triggerBlock.node.prevLine;
    triggerBlock.node.right.node.left = null;
    triggerBlock.node.nextLine.node.prevLine = triggerBlock.node.right;
    triggerBlock.node.prevLine.node.nextLine = triggerBlock.node.right;
  }
};

// Delete function to other blocks
var removeBlock = function(triggerBlock){
  if($(triggerBlock.node).hasClass("block if") || $(triggerBlock.node).hasClass("block repeat")){
    triggerBlock.node.endBlock.remove();
    triggerBlock.node.codeLine.remove();
  }
  else if($(triggerBlock.node).hasClass("block else")){
    triggerBlock.node.ifBlock.node.elseBlock = null;
  }
  triggerBlock.remove();
};

// Delete function for IF and REPEAT blocks
var removeSpecialBlock = function(triggerBlock){
  $(triggerBlock.node).css({"display":"none"});
  $(triggerBlock.node.endBlock.node).css({"display":"none"});
  $(triggerBlock.node.codeLine.node).css({"display":"none"});

  var isIfBlock = $(triggerBlock.node).hasClass("block if");
  var isRepeatBlock = $(triggerBlock.node).hasClass("block repeat");
  var isElseBlock = $(triggerBlock.node).hasClass("block else");
  var isEndBlock = $(triggerBlock.node).hasClass("block end");
  
  var triggerEnd = isEndBlock ? triggerBlock : triggerBlock.node.endBlock;
  var triggerIf = (isIfBlock || isRepeatBlock)? triggerBlock : triggerBlock.node.ifBlock;

  var ifData = {
    x: triggerIf.getBBox().x,
    y: triggerIf.getBBox().y,
    x2: triggerIf.getBBox().x2,
    y2: triggerIf.getBBox().y2
  };

  var ptr = triggerEnd;
  var firstAdjust = ptr.node.nextLine;
  while(ptr !== triggerIf){
    ptr.attr({ 'code-level' : "-=1"});
    if((ptr !== triggerEnd) && 
      (!isRepeatBlock && (ptr !== triggerIf.node.elseBlock) && 
      (triggerIf.node.elseIfBlocks.indexOf(ptr) === -1) ))
      firstAdjust = ptr;
    ptr = ptr.node.prevLine;
  }

  if(isRepeatBlock || (isEndBlock && $(triggerEnd.node.ifBlock.node).hasClass("block repeat"))){
    firstAdjust = triggerIf.node.nextLine;
  }

  // ptr = triggerIf.node.nextLine;
  if(!isRepeatBlock && !$(triggerEnd.node.ifBlock.node).hasClass("block repeat")){
    // Remove ELSE Block
    if(triggerIf.node.elseBlock!==null){
      deleteVerticalMid(triggerBlock.node.elseBlock);
      removeBlock(triggerBlock.node.elseBlock);
    }
    // Remove ELSEIF Blocks
    if(triggerIf.node.elseIfBlocks.length > 0){
      var delPtr;
      ptr = triggerIf.node.nextIf;
      while(ptr !== triggerIf.node.endBlock){
        delPtr = ptr;
        ptr = ptr.node.nextIf;
        deleteVerticalMid(delPtr);
        removeBlock(delPtr);
      }
    }
  }

  // Remove IF Block
  if(triggerIf === compData.head){
    deleteHead(triggerIf);
  }
  else if(triggerIf === compData.tail){
    deleteEnd(triggerIf);
  }
  else{
    deleteVerticalMid(triggerIf);
  }
  // Remove END Block
  if(compData.head === triggerEnd){
    deleteHead(triggerEnd);
  }
  else if(compData.tail === triggerEnd){
    deleteEnd(triggerEnd);
  }
  else{
    deleteVerticalMid(triggerEnd);
  }
  removeBlock(triggerBlock.node.endBlock);
  removeBlock(triggerBlock);

  var ptr1;
  var yAdj = 0;
  var xAdj = 0;
  var x, y;
  ptr = firstAdjust;
  while(ptr !== null){
    // console.log(ptr.node);
    x = blockMargin * (parseInt(ptr.attr('code-level'))+1);
    y = ifData.y + yAdj;

    ptr.select('rect').animate({              // Update the x and y of the rectangle
      x: x,
      y: y
    }, 230);
    ptr.select('text').animate({                // Update the x and y of the text
      x: x + textXPadding,
      y: y + textYPadding
    }, 230);

    updateCodeLines(ptr, x, y + (blockHeight/2) );

    ptr1 = ptr.node.right;
    xAdj = 0;
    while(ptr1 !== null){
      ptr1.select('rect').animate({              // Update the x and y of the rectangle
        x: x + ptr1.node.left.getBBox().width + blockMargin + xAdj,
        y: y
      }, 230);
      ptr1.select('text').animate({                // Update the x and y of the text
        x: x + ptr1.node.left.getBBox().width + blockMargin + xAdj + textXPadding,
        y: y + textYPadding
      }, 230);

      xAdj += (blockMargin + ptr1.node.left.getBBox().width);
      ptr1 = ptr1.node.right;
    }

    ptr = ptr.node.nextLine;
    yAdj += (blockMargin + blockHeight);
  }
};

var deleteBlock = function(key, options){
  var triggerBlock = Snap(options.$trigger[0]);
  var isIfBlock = $(triggerBlock.node).hasClass("block if");
  var isRepeatBlock = $(triggerBlock.node).hasClass("block repeat");
  var isEndBlock = $(triggerBlock.node).hasClass("block end");

  triggerBlock = isEndBlock ? triggerBlock.node.ifBlock : triggerBlock;

  // CASE 1: DELETE HEAD
  if(triggerBlock === compData.head){
    if(isIfBlock || isRepeatBlock || isEndBlock){
      removeSpecialBlock(triggerBlock);
    }else{
      deleteHead(triggerBlock);
      removeBlock(triggerBlock);
    }
  }
  // CASE 2: DELETE TAIL
  else if(triggerBlock === compData.tail){
    console.log("Delete Tail");
    if(isEndBlock){
      removeSpecialBlock(triggerBlock);
    }else{
      deleteEnd(triggerBlock);
      removeBlock(triggerBlock);
    }
  }
  // CASE 3: VERTICAL MID
  else if(triggerBlock.node.left === null){
    console.log("Delete vertical mid");
    if(isIfBlock || isRepeatBlock || isEndBlock){
        removeSpecialBlock(triggerBlock);
    }else{
      deleteVerticalMid(triggerBlock);
      removeBlock(triggerBlock);
    }
  }
  // CASE 4: HORIZONTAL MID
  else if(triggerBlock.node.left !== null){
    console.log("Delete horizontall mid");
    adjustBlocks(triggerBlock,false,false);
    triggerBlock.node.left.node.right = triggerBlock.node.right;
    if(triggerBlock.node.right !== null) triggerBlock.node.right.node.left = triggerBlock.node.left;
    removeBlock(triggerBlock);
  }
  else{
    console.log("ERROR: Deletion unknown");
  }
};

var updateBlock = function(block, newText){
  block.select("text").attr({
    text: newText
  });

  var w = block.select("text").getBBox().width + (textXPadding*2);
  w = w > 40 ? w : 40;
  block.select("rect").attr({
    width: w
  });

  if(block.node.right!==null){
    var ptr = block.node.right;
    var ptr1 = block.getBBox().x2;
     while(ptr!==null){
      xAdj = ptr1 + blockMargin;

      // xOrig = ptr.getBBox().x;

      ptr.select('rect').animate({              // Update the x and y of the rectangle
        x: xAdj,
      }, 230);
      ptr.select('text').animate({                // Update the x and y of the text
        x: xAdj + textXPadding,
      }, 230);

      ptr1 = xAdj + ptr.getBBox().width;
      ptr = ptr.node.right;
    }
  }
};

var updateType = function(key, options){
  var triggerBlock = Snap(options.$trigger[0]);
  updateBlock(triggerBlock, key);
};

var updateRepeat = function(key, options){
  var triggerBlock = Snap(options.$trigger[0]);
  deleteRightBlocks(triggerBlock);
  if(key === "repeatTimes"){
    updateBlock(triggerBlock, "repeat");

    var timesClone = timesBlock.clone();
    var x = triggerBlock.getBBox().x2 + blockMargin;
    var y = triggerBlock.getBBox().y;
    timesClone.select('rect').attr({
      x: x,
      y: y,
      stroke: triggerBlock.select('rect').attr('stroke')
    });
    timesClone.select('text').attr({
      x: x + textXPadding,
      y: y + textYPadding
    });

    addHover(timesClone.node);

    timesClone.node.headBlock = triggerBlock;
    timesClone.node.left = triggerBlock;
    timesClone.node.right = null;
    timesClone.node.prevLine = null;
    timesClone.node.nextLine = null;
    triggerBlock.node.timesBlock = timesClone;
    triggerBlock.node.right = timesClone;
    snapEdit.add(timesClone);
  }else if(key === "repeatWhile"){
    // $(triggerBlock.node.timesBlock).css("display","none");
    triggerBlock.node.timesBlock.remove();
    triggerBlock.node.right = null;
    updateBlock(triggerBlock, "repeat while");
  }
};

var insertElse = function(key, options){
  var triggerBlock = Snap(options.$trigger[0]);
  var triggerEnd = triggerBlock.node.endBlock;
  var elseClone = elseBlock.clone();

  var x = triggerBlock.getBBox().x;
  var y = triggerEnd.node.prevLine.getBBox().y2 + blockMargin;
  elseClone.select('rect').attr({
    x: x,
    y: y
  });
  elseClone.select('text').attr({
    x: x + textXPadding,
    y: y + textYPadding
  });
  elseClone.attr({ 'code-level' : + triggerBlock.attr('code-level')});

  adjustBlocks(triggerEnd, true, true, elseClone);

  elseClone.node.right = null;
  elseClone.node.left = null;
  elseClone.node.prevLine = triggerEnd.node.prevLine;
  elseClone.node.nextLine = triggerEnd;
  elseClone.node.ifBlock = triggerBlock;
  elseClone.node.endBlock = triggerBlock.node.endBlock;

  triggerEnd.node.prevLine.node.nextLine = elseClone;
  triggerEnd.node.prevLine = elseClone;
  if($(triggerBlock.node).hasClass("block elseif"))
    triggerBlock.node.ifBlock.node.elseBlock =  elseClone;
  else
    triggerBlock.node.elseBlock =  elseClone;
  // Update IFs-link list
  elseClone.node.prevIf = triggerBlock.node.endBlock.node.prevIf;
  elseClone.node.nextIf = triggerBlock.node.endBlock;
  triggerBlock.node.endBlock.node.prevIf.node.nextIf = elseClone;
  triggerBlock.node.endBlock.node.prevIf = elseClone;

  snapEdit.add(elseClone);
  addHover(elseClone.node);
};

var insertElseIf = function(key, options){
  var triggerBlock = Snap(options.$trigger[0]);
  
  var isIfBlock = $(triggerBlock.node).hasClass("block if");
  var isElseIfBlock = $(triggerBlock.node).hasClass("block elseif");
  var isElseBlock = $(triggerBlock.node).hasClass("block else");
  
  // var triggerEnd = isEndBlock ? triggerBlock : triggerBlock.node.endBlock;
  var triggerIf = isIfBlock ? triggerBlock : triggerBlock.node.ifBlock;

  var elseIfClone = elseIfBlock.clone();

  if(!isIfBlock)
    console.log(triggerBlock.node.prevIf.node);
  var x = triggerBlock.getBBox().x;
  var y = isElseBlock ? 
            triggerBlock.node.prevIf.getBBox().y2 + blockMargin : 
            triggerBlock.node.nextIf.node.prevLine.getBBox().y2 + blockMargin;
  elseIfClone.select('rect').attr({
    x: x,
    y: y
  });
  elseIfClone.select('text').attr({
    x: x + textXPadding,
    y: y + textYPadding
  });
  elseIfClone.attr({ 'code-level' : + triggerBlock.attr('code-level')});

  adjustBlocks(isElseBlock ? triggerBlock : triggerBlock.node.nextIf, true, true, elseIfClone);

  elseIfClone.node.right = null;
  elseIfClone.node.left = null;
  if(isElseBlock){
    elseIfClone.node.prevLine = triggerBlock.node.prevIf;
    elseIfClone.node.nextLine = triggerBlock;

    elseIfClone.node.ifBlock = triggerBlock.node.ifBlock;
    elseIfClone.node.endBlock = triggerBlock.node.endBlock;
    elseIfClone.node.nextIf = triggerBlock;
    elseIfClone.node.prevIf = triggerBlock.node.prevIf;
    
    triggerBlock.node.prevLine.node.nextLine = elseIfClone;
    triggerBlock.node.prevLine = elseIfClone;
    triggerBlock.node.prevIf.node.nextIf = elseIfClone;
    triggerBlock.node.prevIf = elseIfClone;
  }else{
    elseIfClone.node.prevLine = triggerBlock.node.nextIf.node.prevLine;
    elseIfClone.node.nextLine = triggerBlock.node.nextIf;

    elseIfClone.node.ifBlock = isIfBlock ? triggerBlock : triggerBlock.node.ifBlock;
    elseIfClone.node.endBlock = triggerBlock.node.endBlock;
    elseIfClone.node.nextIf = triggerBlock.node.nextIf;
    elseIfClone.node.prevIf = triggerBlock;
    
    triggerBlock.node.nextIf.node.prevLine.node.nextLine = elseIfClone;
    triggerBlock.node.nextIf.node.prevLine = elseIfClone;
    triggerBlock.node.nextIf.node.prevIf = elseIfClone;
    triggerBlock.node.nextIf = elseIfClone;
  }

  snapEdit.add(elseIfClone);
  addHover(elseIfClone.node);
  triggerIf.node.elseIfBlocks.push(elseIfClone);
};

var variableArray = [];
var showVariableInput = function(key, options){
  var triggerBlock = Snap(options.$trigger[0]);
  options.items.input.visible = true;

  $('.input-variable').find('input').keyup(function(e){
    if(e.keyCode == 13){
      variableArray.push($(this).val());
      updateBlock(triggerBlock,$(this).val());
      options.$menu.trigger("contextmenu:hide");
    }
  });

  return false;
};

var changeValue = function(e){
  var triggerBlock = Snap(e.data.$trigger[0]);
    if(e.keyCode == 13){
      updateBlock(triggerBlock,$(e.target).val());
      e.data.$menu.trigger("contextmenu:hide");
    }
};

$(document).ready(function() {
$.contextMenu({
  selector: '#edit-panel .block', 
  items: {
      // Item for selecting a data type
      select: { 
        name: "Select Type", 
        icon: "edit", 
        visible: false,
        items: {
          integer : {
            name: "integer",
            callback: updateType
          },
          number : {
            name: "number",
            callback: updateType
          },
          boolean : {
            name: "boolean",
            callback: updateType
          }
        }
      },
      addVar: {
        name: "Enter Variable",
        icon: "fa-plus",
        visible: false,
        callback: showVariableInput
      },
      input: {
        type: "text",
        className: "input-variable",
        visible: false,
      },
      editValue: {
        name: "Edit Value",
        type: "text",
        className: "input-value",
        visible: false,
        events: {
          keyup: changeValue
        },
      },
      addElseIf: {
        name: "Add elseif",
        callback: insertElseIf,
        visible: false
      },
      addElse:{
        name: "Add else",
        callback: insertElse,
        visible: false
      },
      repeatTimes: {
        name: "repeat times",
        callback: updateRepeat,
        visible: false,
      },
      repeatWhile: {
        name: "repeat while",
        callback: updateRepeat,
        visible: false,
      },
      delete: { name: "Delete", icon: "delete", visible:true, callback: deleteBlock},
  },
  events: {
    show : function(options){
      var triggerBlock = Snap(options.$trigger[0]);
      options.items.select.visible = false;
      options.items.addVar.visible = false;
      options.items.editValue.visible = false;
      options.items.input.visible = false;
      options.items.repeatTimes.visible = false;
      options.items.repeatWhile.visible = false;
      options.items.addElseIf.visible = false;
      options.items.addElse.visible = false;
      
      if($(this).hasClass("type")){
        options.items.select.visible = true;
      }
      else if($(this).hasClass("variable")){
        options.items.addVar.visible = true;
      }
      else if($(this).hasClass("value")){
        options.items.editValue.visible = true;
      }
      else if($(this).hasClass("if")){
        options.items.addElseIf.visible = true;
        if(triggerBlock.node.elseBlock === null)
          options.items.addElse.visible = true;
      }
      else if($(this).hasClass("elseif")){
        options.items.addElseIf.visible = true;
        if(triggerBlock.node.ifBlock.node.elseBlock === null)
          options.items.addElse.visible = true;
      }
      else if($(this).hasClass("else")){
        options.items.addElseIf.visible = true;
      }
      else if($(this).hasClass("repeat")){
        options.items.repeatTimes.visible = true;
        options.items.repeatWhile.visible = true;
      }

      $.contextMenu.setInputValues(options, this.data());
    },
    hide: function(options) {
      $.contextMenu.getInputValues(options, this.data());
    }
  }
});

});