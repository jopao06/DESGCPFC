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
};

$(function() {
$.contextMenu({
    selector: '.block', 
    items: {
        // "edit": {name: "Edit", icon: "edit"},
        // "cut": {name: "Cut", icon: "cut"},
        // "copy": {name: "Copy", icon: "copy"},
        // "paste": {name: "Paste", icon: "paste"},
        "delete": { name: "Delete", icon: "delete", callback: deleteBlock },
        // "sep1": "---------",
        // "quit": {name: "Quit", icon: function(){
        //     return 'context-menu-icon context-menu-icon-quit';
        // }}
    }
});
});