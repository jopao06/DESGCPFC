 $(function() {
    $.contextMenu({
        selector: '.block', 
        items: {
            // "edit": {name: "Edit", icon: "edit"},
            // "cut": {name: "Cut", icon: "cut"},
            // "copy": {name: "Copy", icon: "copy"},
            // "paste": {name: "Paste", icon: "paste"},
            "delete": {
                name: "Delete", 
                icon: "delete",
                callback: function(key, options){
                    // console.log(key);
                    // console.log(options.$trigger);
                    var triggerBlock = Snap(options.$trigger[0]);

                    // triggerBlock.prev
                    // console.log(Snap(triggerBlock[0]));
                    // console.log(compData.head.node);
                    if(triggerBlock === compData.head){
                        compData.head = triggerBlock.node.nextLine;

                        // console.log("TRUE");
                    }else{
                        // console.log("FALSE");
                    }

                    // console.log(compData.head);

                    triggerBlock.remove();
                    // snapEdit.remove(options.$trigger);


                }
            },
            // "sep1": "---------",
            // "quit": {name: "Quit", icon: function(){
            //     return 'context-menu-icon context-menu-icon-quit';
            // }}
        }
    });
});