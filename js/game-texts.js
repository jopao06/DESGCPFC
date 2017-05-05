var gameTexts = {
  "1_1" : {
    tutorial : {
      "start_tutorial" : 
        '<h1 class="ui inverted icon header">' +
          '<i class="massive talk icon"></i>' +
          '<p>Welcome to Q-Block</p>' +
        '</h1>'+
        '<p> An interactive game that aims to teach you<br>some simple programming concepts. But before we go crazy<br>with coding, we need to be familiar with the interface.</p>',
      "end_tutorial" :
        '<h1 class="ui inverted icon header">' +
          '<i class="massive checkmark icon"></i>' +
          "<p>Done!</p>" +
        '</h1>'+
        "<p>Now that we're done with the tour, let's start coding!<br>First we need to print our first 'Hello World!'</p>",
      experiment : 
        '<h1 class="ui inverted icon header">' +
          '<i class="massive rocket icon"></i>' +
          '<p>Congratulations!</p>' +
        '</h1>'+
        "<p>You've done your first code! Eventhough it's just a simple "+ 
        '"Hello", '+
        "<br> it will be the start of your big journey. Now you can experiment on your own.<br>Print your name, do some simple arithmetic computation or make an intentional error.<br>Do whatever you want! Just remember if you want to delete some blocks,just right click<br>on the block and select [<i class='trash icon'></i>delete ]  or simply delete all blocks with the [<i class='trash outline icon'></i>Clear ] button.<br>When you are done playing, you may now proceed to the next level.</p>",
      block : 
        '<h3>BLOCKS FOR DAYS</h3>' +
        '<p>This is the block panel. It holds all the code blocks you can drag to the edit panel.The blocks are color coded to distinguish types, variables, values, arithmetic operations( +, -, *, /, mod), relational operations( <, >, <=, >=, =, not=), conditional statements(if, elseif, else) and loops(repeat-times, repeatwhile)</p>' +
        '<button id="open-edit" class="ui basic icon button next">' +
          '<i class="right arrow icon"></i>' +
          'Next' +
        '</button>',
      edit :
        '<h3>GET INTERACTIVE</h3>'+
        '<p>This is the edit panel. This where we are going to build our code. We can edit the values of some blocks and we can delete all blocks. When we are done, we can click the "Run" button on the upper right of the panel. Also we can click the "Clear" button to delete all blocks from the edit panel.</p>'+
        '<button id="open-display" class="ui basic icon button next">'+
          '<i class="right arrow icon"></i>'+
          'Next'+
        '</button>',
      display : 
        '<h3>YOUR MASTERPIECE</h3>'+
        '<p>Your code will be executed after clicking the "Run" button and the output will be displayed here in the display panel. </p>'+
        '<button id="pop-console" class="ui basic icon button next">'+
          '<i class="right arrow icon"></i>'+
          'Next'+
        '</button>',
      console :
        '<h3>OOPS!</h3>'+
        '<p>Whenever the program encounters an error, the console will list all identifible errors and it will point which line has that error. This is useful for debugging our code.</p>'+
        '<button id="finish-tutorial" class="ui basic icon button next">'+
          '<i class="right arrow icon"></i>'+
          'Next'+
        '</button>'
    }
  
  },
  "1_2" : {
    arrays: 
      '<h1 class="ui inverted icon header">' +
        '<i class="massive block layout icon"></i>' +
        "<p>Arrays, Ifs, and Repeats</p>" +
      '</h1>'+
      "<p>On this level, we're going to learn about arrays, conditional statements,<br>and loops. First we need to know how to declare and manipulate an array.</p>"
  }
};