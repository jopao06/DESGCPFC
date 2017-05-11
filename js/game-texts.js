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
        '<p>This is the edit panel. This is where we are going to build our code. We can edit the values of some blocks and we can delete all blocks. When we are done, we can click the "Run" button on the upper right of the panel. Also we can click the "Clear" button to delete all blocks from the edit panel.</p>'+
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
        "<p>Arrays</p>" +
      '</h1>'+
      "<p>On this level, we're going to learn about arrays, conditional statements,<br>and loops. First we need to know how to declare and manipulate an array.</p>",
    edit_1:
      '<h3>ARRAY</h3>'+
      '<p>An array is like a collection of variables where we can store multiple data with the same data type. Like declaring a variable, we need to specify its data type and the name of the array. Inside the bracket is the size of the array, in this case, we can store five integers.</p>'+
      '<button id="pop-index" class="ui basic icon button next">'+
        '<i class="right arrow icon"></i>'+
        'Next'+
      '</button>',
    edit_2:
      '<h3>INDEX</h3>'+
      '<p>We can access each data using an index integer starting from 0 to size-1.</p>'+
      '<button id="pop-run" class="ui basic icon button next">'+
        '<i class="right arrow icon"></i>'+
        'Next'+
      '</button>',
    display_1 : 
      '<h3>TADA!</h3>'+
      '<p>Now the values are stored in the array! Each index is represented by a square and the corresponding values you entered earlier.</p>'+
      '<button id="pop-try" class="ui basic icon button next">'+
        '<i class="right arrow icon"></i>'+
        'Next'+
      '</button>',
    edit_3:
      '<p>Now let us try changing the values of the array. Enter an integer in each index and click run.</p>',
    display_2 : 
      '<p>Now the values of the array will change and you can see the values you entered earlier.</p>'+
      '<button id="trigger-dimmer" class="ui basic icon button next">'+
        '<i class="right arrow icon"></i>'+
        'Next'+
      '</button>',
    repeat :
      '<h1 class="ui inverted icon header">' +
        '<i class="massive refresh icon"></i>' +
        "<p>Repeats</p>" +
      '</h1>'+
      "<p>Congrats! Now we know how to use arrays but is there a shorter way to access<br>each index? Yes, there is! We can use loops to access each index and manipulate<br>its data. 'repeat-times' and 'repeatwhile' are the loops we can use here to traverse the array.</p>",
    repeat_types:
      '<h3>REPEAT BLOCKS</h3>'+
      "<p>Repeat blocks are used to build loops which are sequence of instructions that are repeated until a condition is satisfied. Which means, any statement inside the 'repeat-end' clause will be executed several times until the condition is satisfied.</p><p>There are two types of REPEAT blocks: REPEAT-TIMES and REPEATWHILE. REPEAT-TIMES is used to loop statements for a number of times. An integer value is needed between the REPEAT and TIMES block. On the other hand, REPEATWHILE is used to loop statements while the condition is true. A boolean expression is needed on the right side of the block.</p><p>Now let us learn how to traverse the array. First, above the repeat statement, declare an integer variable i with a value 0.</p>"+
      '<button id="close-repeat" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'OK'+
      '</button>',
    done_with_repeat:
      '<h3>Almost Done!</h3>'+
      "<p>Now we will loop five times and use 'i' as an index to access the array. Then we will store 'i' as the value for each array index.</p>"+
      '<button id="finish-repeat" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'OK'+
      '</button>',
    loop_done:
      '<h3>Loop de Loop!</h3>'+
      "<p>We can see that each value in the array increment by one like i increments by one every repeat. This is an example how we manipulate the values in an array using loops. If we want all values in each indices to be zero, we just change 'a[i] = i' to 'a[i] = 0'</p>"+
      '<button id="finish_loop" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'OK'+
      '</button>',
    if :
      '<h1 class="ui inverted icon header">' +
        '<i class="icon fa-cogs"></i>' +
        "<p>Ifs</p>" +
      '</h1>'+
      "<p>Yey! We're done with loops!<br>But what if we want to save the value '0' to even indices and value '1' to odd indices?<br>Or save a certain value to an index given a condition?<br>We can use if statements to do this.</p>",
    if_types:
      '<h3>IF BLOCKS</h3>'+
      '<p>If-statements or conditional statements are used to perform actions depending on a specific condition. Here, the IF clause is composed of the IF block and the END block which are initially required. But you can also have ELSEIF blocks and ELSE block by right clicking on the IF block and selecting the add options.</p><p>When we run the code and there is an if-statement, the interpreter will check its condition if it is satisfied. If yes, then it will execute the code inside of the IF clause. If no, it will then proceeds to check the next ELSEIF where its condition is also checked. This process will continue until the interpreter reches the ELSE block, which always execute the code inside of its clause when all previous conditions were not met. When there is no ELSE block, then the interpreter will just end the execution of the if-statement.</p>'+
      '<button id="close-if" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'OK'+
      '</button>',
    if_done : 
      '<h3>WOOP! WOOP!</h3>'+
      '<p>Now you should see alternating values of 0s and 1s.</p>'+
      '<button id="exit-level" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'OK'+
      '</button>',
    level_exit : 
      '<h1 class="ui inverted icon header">' +
        '<i class="massive rocket layout icon"></i>' +
        "<p>We're Done!</p>" +
      '</h1>'+
      "<p>YEHEY! We now know how to use arrays, repeats, and if statemetns! On the next level, we're going<br>to practice our knowledge we just learned. So always remember what you've learned on this level.<br>You can now proceed to level 3 or you can stay to explore more about the finished tutorial.</p>"
  }
};

