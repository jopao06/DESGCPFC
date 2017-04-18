var deleteBlock = function(key, options){
  // console.log(key);
  // console.log(options.$trigger);
  var triggerBlock = Snap(options.$trigger[0]);

  // CASE 1: DELETE HEAD
  if(triggerBlock === compData.head){
    // CASE 1.1: If has no right node, adjust next line blocks
    if(triggerBlock.node.right === null){
      adjustBlocks(triggerBlock,false,true);
      if(triggerBlock.node.nextLine !== null) triggerBlock.node.nextLine.node.prevLine = null;
      else compData.tail = null;
      compData.head = triggerBlock.node.nextLine;
    }
    // CASE 1.2: If has right nodes, adjust right blocks
    else{
      adjustBlocks(triggerBlock,false,false);
      triggerBlock.node.right.node.nextLine = triggerBlock.node.nextLine;
      if(triggerBlock.node.nextLine !== null) triggerBlock.node.nextLine.node.prevLine = triggerBlock.node.right;
      compData.head = triggerBlock.node.right;
    }
  }
  // CASE 2: DELETE END
  else if(triggerBlock === compData.tail){
    // CASE 2.1: If has no right node, adjust next line blocks
    if(triggerBlock.node.right === null){
      adjustBlocks(triggerBlock,false,true);
      if(triggerBlock.node.prevLine !== null) triggerBlock.node.prevLine.node.nextLine = null;
      compData.tail = triggerBlock.node.prevLine;
    }
    // CASE 2.2: If has right nodes, adjust right blocks
    else{
      adjustBlocks(triggerBlock,false,false);
      triggerBlock.node.right.node.prevLine = triggerBlock.node.prevLine;
      if(triggerBlock.node.prevLine !== null) triggerBlock.node.prevLine.node.nextLine = triggerBlock.node.right;
      compData.tail = triggerBlock.node.right;
    }
  }
  // CASE 3: VERTICAL MID
  else if(triggerBlock.node.left === null){
    // CASE 3.1: If has no right node, adjust next line blocks
    if(triggerBlock.node.right === null){
      adjustBlocks(triggerBlock,false,true);
      triggerBlock.node.nextLine.node.prevLine = triggerBlock.node.prevLine;
      triggerBlock.node.prevLine.node.nextLine = triggerBlock.node.nextLine;
    }
    // CASE 3.2: If has right nodes, adjust right blocks
    else{
      adjustBlocks(triggerBlock,false,false);
      triggerBlock.node.right.node.nextLine = triggerBlock.node.nextLine;
      triggerBlock.node.right.node.prevLine = triggerBlock.node.prevLine;
      triggerBlock.node.right.node.left = null;
      triggerBlock.node.nextLine.node.prevLine = triggerBlock.node.right;
      triggerBlock.node.prevLine.node.nextLine = triggerBlock.node.right;
    }
  }
  // CASE 4: HORIZONTAL MID
  else if(triggerBlock.node.left !== null){
    adjustBlocks(triggerBlock,false,false);
    triggerBlock.node.left.node.right = triggerBlock.node.right;
    if(triggerBlock.node.right !== null) triggerBlock.node.right.node.left = triggerBlock.node.left;
  }
  else{
    console.log("ERROR: Deletion unknown");
  }

  triggerBlock.remove();
}

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
}

var updateType = function(key, options){
  var triggerBlock = Snap(options.$trigger[0]);
  updateBlock(triggerBlock, key);
}


var variableArray = [];
var showVariableInput = function(key, options){
  var triggerBlock = Snap(options.$trigger[0]);
  options.items.input.visible = true;

  $('.input-variable').find('input').keyup(function(e){
    if(e.keyCode == 13){
      variableArray.push($(this).val());
      console.log(variableArray);
      updateBlock(triggerBlock,$(this).val());
      options.$menu.trigger("contextmenu:hide");
    }
  });

  return false;
}

var changeValue = function(e){
  console.log(e);
  var triggerBlock = Snap(e.data.$trigger[0]);
  console.log("chane value!");
  // $('.input-value').find('input').keyup(function(e){
    if(e.keyCode == 13){
      console.log($(e.target).val());
      updateBlock(triggerBlock,$(e.target).val());
      e.data.$menu.trigger("contextmenu:hide");
    }
  // });

}

$(document).ready(function() {
$.contextMenu({
  selector: '.block', 
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
      delete: { name: "Delete", icon: "delete", visible:true, callback: deleteBlock},
  },
  events: {
    show : function(options){
      options.items.select.visible = false;
      options.items.addVar.visible = false;
      options.items.editValue.visible = false;
      options.items.input.visible = false;
      
      if($(this).hasClass("type")){
        options.items.select.visible = true;
      }
      else if($(this).hasClass("variable")){
        options.items.addVar.visible = true;
      }
      else if($(this).hasClass("value")){
        options.items.editValue.visible = true;
      }

      $.contextMenu.setInputValues(options, this.data());
    },
    hide: function(options) {
      $.contextMenu.getInputValues(options, this.data());
    }
  }
});

});