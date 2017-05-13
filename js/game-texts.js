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
  },
  "1_3" : {
    mult_repeated_add: 
      '<h1 class="ui inverted icon header">' +
        '<i class="massive plus icon"></i>' +
        "<p>Multiplication using Repeated Addition</p>" +
      '</h1>'+
      "<p>When we are doing multiplication, for example 5x2, we are<br>adding 5 twice or adding 2 five times. On this level, we are going to build<br>a code that can do multiplication using repeated additon.<br>To do that we are going to use loops.</p>",
    mult_var:
      '<p>So here we already declared two integer variables. You can change the values to test different cases. For the sake of this level, we will only be doing multiplication of two positive integers.</p>'+
      '<button id="next-to-result" class="ui basic icon button next">'+
        '<i class="right arrow icon"></i>'+
        'Next'+
      '</button>',
    mult_result:
      '<p>Save the result to this variable, then print the result using the OUTPUT block. </p>'+
      '<button id="next-to-start" class="ui basic icon button next">'+
        '<i class="right arrow icon"></i>'+
        'Next'+
      '</button>',
    mult_start:
      "<p>Now let's start coding! We are going to use the REPEAT-TIMES block so we are going to apply our knowledge on loops. Build the code and when you're done, click run to test your code.</p>"+
      '<button id="start-mult" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'Done'+
      '</button>',
    mult_display_success:
      "<h1>Good Job!</h1>" +
      "<p>Yay! You got it! Now let's do division this time</p>"+
      '<button id="exit-mult-success" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'Ok'+
      '</button>',
    div_repeated_sub: 
      '<h1 class="ui inverted icon header">' +
        '<i class="massive minus icon"></i>' +
        "<p>Division using Repeated Subtraction</p>" +
      '</h1>'+
      "<p>Like in multiplication, we can perform division using repeated subtraction.<br>We count the number of times we subtract value2 to value1. So here,<br>we can use variable 'result' to count the number of times we subtract.</p>",
    div_display_success:
      "<h1>Great!</h1>" +
      "<p>Piece of cake! Now, we are more familiar with loops.</p>"+
      '<button id="exit-div-success" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'Yay'+
      '</button>',
    level_exit:
      '<h1 class="ui inverted icon header">' +
        '<i class="massive rocket icon"></i>' +
        "<p>Well Done!</p>" +
      '</h1>'+
      "<p>Now we know how to do multiplication using repeated addition and<br>division using repeated subtraction. We can now proceed<br>to the next level or you can stay here and further explore your code.</p>",
  },
  "1_4" : {
    fibo_intro: 
      '<h1 class="ui inverted icon header">' +
        '<i class="massive hashtag icon"></i>' +
        "<p>The Fibonacci Sequence</p>" +
      '</h1>'+
      "<p>Fibonacci is an Italian mathematician that created the Fibonacci sequence as a result of one<br>his mathematical problem about rabbit breeding. The problem was this:</p><p>Beginning with a single pair of rabbits (one male and one female), how many pairs of rabbits<br>will be born in a year, assuming that every month each male and female rabbit<br>gives birth to a new pair of rabbits, and the new pair of rabbits itself starts<br>giving birth to additional pairs of rabbits after the first month of their birth?</p><p>Doing the sequence, it would be like this<br>1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144<br> where each number represent total pairs each month.</p>",
    fibo_array:
      '<h1>Fibo</h1>'+
      '<p>On this level, we are going to make a Fibonacci sequence up to the fifth number. Here, we have already declared array "fibo" and its size. All we have to do now is to build the loop where we are going to save each term to array "fibo". Always remember that the first two numbers should be 1 then the succeeding values would be "n-2" plus "n-1" where "n" is the index number</p>'+
      '<button id="exit-fibo-array" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'OK'+
      '</button>',
    fibo_success:
      '<h1>Fibonacci will be so proud!</h1>'+
      '<p>Excellent! With loops and if-statements, we can effectively manipulate the values of the array</p>'+
      '<button id="exit-fibo-success" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'Done'+
      '</button>',
    level_exit:
      '<h1 class="ui inverted icon header">' +
        '<i class="massive rocket icon"></i>' +
        "<p>Very Fine!</p>" +
      '</h1>'+
      "<p>Now we know how to do multiplication using repeated addition and<br>division using repeated subtraction. We can now proceed<br>to the next level or you can stay here and further explore your code.</p>",
  },
  "2_1" : {
    outline_intro: 
      '<h1 class="ui inverted icon header">' +
        '<i class="massive square outline icon"></i>' +
        "<p>The Philippine Flag</p>" +
      '</h1>'+
      "<p>Now we are familiar with loops and if-statements, we can take our knowledge<br>to the next level. On the succeeding levels, we are going to build the Philippine flag<br>step by step. Here, we are going to build the outline of the flag.</p>",
    array_2D: 
      '<h1>2D Arrays</h1>'+
      "<p>Arrays can be two dimensional. Here, we already declared an array named 'flag' that is 5 by 7 which means it has 5 rows and 7 columns. To access each index, we need two loops. The loops will be nested which means one loop is inside another loop. Now let's do that.</p>"+
      '<button id="exit-array-2D" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'OK'+
      '</button>',
    array_indices: 
      '<h1>Indices</h1>'+
      "<p>Good! Now we have our loops, we can start traversing the flag. Here we have already declared two variables which we will use as indices for the array.</p>"+
      '<button id="exit-array-indices" class="ui basic icon button next">'+
        '<i class="right arrow icon"></i>'+
        'Next'+
      '</button>',
    index_increment: 
      '<h1>Variable Increment</h1>'+
      "<p>Every loop, the 'row' and 'column' variables should increment by one but before we traverse the column, we should reset it back to zero so we are back again to column 0. Now let's do that.</p>"+
      '<button id="exit-index-increment" class="ui basic icon button next">'+
        '<i class="right arrow icon"></i>'+
        'OK'+
      '</button>',
    if_statement: 
      '<h1>Add an If-statement</h1>'+
      "<p>Now let's start adding an if-statement. Let us say, when 'row' is equal to 0, 'flag[row][col]=1', else 'flag[row][col]=0'. Let's build this code inside the nested loop. When you are done, hit run to see what happens.</p>"+
      '<button id="exit-if-statement" class="ui basic icon button next">'+
        '<i class="right arrow icon"></i>'+
        'OK'+
      '</button>',
    first_run: 
      '<h1>Fantastic!</h1>'+
      "<p>You should see the first column colored gray. Any index that has a value of 1 is displayed as a solid square here. Now we need to color the other borders of this rectangle.</p>"+
      '<button id="exit-first-run" class="ui basic icon button next">'+
        '<i class="right arrow icon"></i>'+
        'OK'+
      '</button>',
    level_success: 
      '<h1>Hoorah!</h1>'+
      "<p>Now you should see that border should be colored. Remember what you've learned here because we are doing more of this on the next level.</p>"+
      '<button id="exit-level" class="ui basic icon button next">'+
        '<i class="right arrow icon"></i>'+
        'OK'+
      '</button>',
    level_exit:
      '<h1 class="ui inverted icon header">' +
        '<i class="massive square outline icon"></i>' +
        "<p>The Shape</p>" +
      '</h1>'+
      "<p>Now we have the shape of the flag next we will do some of its basic shapes.<br>Did you know that the earlier design of the current flag was first conceptualized<br>by Emilio Aguinaldo during his exile in Hong Kong?</p>",
  },
  "2_2" : {
    x_intro: 
      '<h1 class="ui inverted icon header">' +
        '<i class="massive remove outline icon"></i>' +
        "<p>X makes Four Traingles</p>" +
      '</h1>'+
      "<p>The white triangle on the Philippine flag is a masonic symbol signifying<br>liberty, equality and fraternity. On this level, we are going to create this triangle<br>but let us start with an easier pattern, the 'X'.</p>",
    same_as_before: 
      '<h1>Same as Before</h1>'+
      "<p>Like we did on the previous level, we are going to use nested loops and if-statement, we need to increment the variable 'row' and 'col' every loop, we need to re-initialize 'col' as zero before we traverse the column, and we should save the value 1 to our target indices. Try building the code on your own and click run when you are done.</p>"+
      '<button id="exit-same" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'OK'+
      '</button>',
    diff_if: 
      '<h1>Different Condition</h1>'+
      "<p>Since we are going to do a different pattern from before, we need to think of how to achieve the 'X' pattern. To make things easier, we can access only the first five columns to make a perfect 5x5 square. Then we think of a condition how we can achieve the '\\' and '/' patterns. When you are done just hit run and check the result</p>"+
      '<button id="exit-diff-if" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'OK'+
      '</button>',
    level_success:
      '<h1>Well Done!</h1>'+
      "<p>We created the pattern 'X'!</p>"+
      '<button id="exit-level-x" class="ui basic icon button next">'+
        '<i class="right checkmark icon"></i>'+
        'Done'+
      '</button>',
    level_exit: 
      '<h1 class="ui inverted icon header">' +
        '<i class="massive remove outline icon"></i>' +
        "<p>X Pattern</p>" +
      '</h1>'+
      "<p>Now we are done, we can proceed to the next level or you can stay<br>and try to remove half of the 'X' pattern to get the left triangle.</p>",
  }
};