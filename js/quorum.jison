/* description: Parses end executes mathematical expression. */

/* lexical grammar */
%lex
%options flex

%{
 yy.varArray;
 yy.isInitialized;
 yy.terms;
 yy.isVarDec;
 yy.isRepeatTimes;
 yy.tempVar;
 yy.lineCount;
 yy.isOutput;
%}

%%

\n\s*                     return 'newline';
[^\S\n]+                  /* ignore whitespace other than newlines */
"integer"                 return 'int_type'
"number"                  return 'num_type'
"boolean"                 return 'bool_type'

"repeat"                  return 'repeat'
"times"\b                 return 'times'
"repeatwhile"\b           return 'repeatwhile'

"if"                      return 'if'
"elseif"                  return 'elseif'
"else"\b                  return 'else'
"end"\b                   return 'end'

"output"                  return 'output'

"mod"                     return 'mod'
"not="                    return 'not='
"and"                     return 'and'
"or"                      return 'or'
("true"|"false")\b        return 'boolean'
[a-zA-Z][a-zA-Z0-9]*\b    return 'variable'

\"[\S\s]*\"               return 'string'
\'[\S\s]*\'               return 'string'
[0-9]+\.[0-9]+\b          return 'number'
[0-9]+\b                  return 'integer'



"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"("                   return '('
")"                   return ')'
"["                   return '['
"]"                   return ']'

"<"                   return '<'
"<="                  return '<='
">"                   return '>'
">="                  return '>='

"="                   return '='


<<EOF>>               return 'EOF'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/' 'mod'
%left '^'
%left UMINUS
%left '<' '<=' '>' '>=' 
%left 'not=' '=' 'and' 'or'

%start program

%% /* language grammar */

program
  : EOF { return {code: "", message: ""} }
  | sourceElement EOF {{
      return {
        code: $1, 
        variables: yy.varArray,
        terms: yy.terms,
        isVarDec: yy.isVarDec,
        isRepeatTimes: yy.isRepeatTimes,
        isOutput: yy.isOutput
      } 
    }}
;

sourceElement
  : statement { $$ = $1; }
  | statement newline sourceElement {$$ = $1 +"\n"+ $3; }
;

statement
  : variableStatement
  | repeatStatement
  | ifStatement
  | end { $$ = "}";}
  | outputStatement
;

outputStatement
  : output string {$$ = "snapDisplay.text(20,"+ (yy.lineCount*20 + 70) +","+$2+").attr({'font-size': 20, fill: blackActive, class:'display output'});"; yy.isOutput = true;}
  | output relational_expr {$$ = "snapDisplay.text(20,"+ (yy.lineCount*20 + 70) +","+$2+").attr({'font-size': 20, fill: blackActive, class:'display output'});"; yy.isOutput = true}
;


repeatStatement
  : repeat expression times {{
    yy.tempVar = makeid();
    $$ = "for(var "+yy.tempVar+"=0; "+yy.tempVar+" < "+$2+"; "+yy.tempVar+"++){"; yy.isRepeatTimes = true;
  }}
  | repeatwhile relational_expr {$$ = "while( "+$2+"){";}
;

ifStatement
  : if relational_expr { $$ = "if("+ $2 +"){"; }
  | elseif relational_expr { $$ = "}\nelse if("+ $2 +"){"}
  | else { $$="}\nelse{" }
;

variableStatement
 : variableDeclaration {$$ = $1+";"}
 | variableDeclaration initializer {$$ = $1 + $2+";"}
 | variable initializer {{
      yy.isVarDec = false; 
      if(yy.varArray === undefined){ yy.varArray = [] } 
      var varType = yy.data[$1] ? yy.data[$1].type : undefined;
      yy.varArray.push({type: varType, name: $1});

      $$= $1 + $2+";";
    }}
 | arrayDeclaration {$$=$1+";"}
 | arrayVariable initializer { $$=$1+$2+";";}
;

variableDeclaration
 : int_type variable {{ 
      yy.isVarDec = true; 
      if(yy.varArray === undefined){ yy.varArray = [] } 
      yy.varArray.push({type: "integer", name: $2, isArray: false});
      $$ = "var "+$2; 
    }}
 | num_type variable {{ 
      yy.isVarDec = true; 
      if(yy.varArray === undefined){ yy.varArray = [] } 
      yy.varArray.push({type: "number", name: $2, isArray: false});
      $$ = "var "+$2; 
    }}
 | bool_type variable {{ 
      yy.isVarDec = true; 
      if(yy.varArray === undefined){ yy.varArray = [] }
      yy.varArray.push({type: "boolean", name: $2, isArray: false});
      $$ = "var "+$2; 
  }}
;

arrayVariable
  : variable indexInitializer {{
      if(yy.varArray === undefined){ yy.varArray = [] }
      var varType = yy.data[$1] ? yy.data[$1].type : undefined;
      yy.varArray.push({type: varType, name: $1, isArray: true, arraySize: $2.match(/\[.*?\]/g).map(function(match) { return match.slice(1, -1); })});
      $$ = $1 + $2;

      if(yy.terms === undefined){ yy.terms = [] };
      yy.terms.push({value: $1, type: varType, isArray: true, arraySize: $2.match(/\[.*?\]/g).map(function(match) { return match.slice(1, -1); })});
    }}
;

arrayDeclaration
  : int_type variable indexInitializer {{
      yy.isVarDec = true;
      if(yy.varArray === undefined){ yy.varArray = [];} 
      yy.varArray.push({type: "integer", name: $2, isArray: true, arraySize: $3.match(/\[.*?\]/g).map(function(match) { return match.slice(1, -1); })});
      $$ = "var "+$2+$3;
    }}
  | num_type variable indexInitializer {{
      yy.isVarDec = true;
      if(yy.varArray === undefined){ yy.varArray = [] } 
      yy.varArray.push({type: "number", name: $2, isArray: true, arraySize: $3.match(/\[.*?\]/g).map(function(match) { return match.slice(1, -1); })});
      $$ = "var "+$2+$3;
    }}
  | bool_type variable indexInitializer {{
      yy.isVarDec = true;
      if(yy.varArray === undefined){ yy.varArray = [] } 
      yy.varArray.push({type: "boolean", name: $2, isArray: true, arraySize: $3.match(/\[.*?\]/g).map(function(match) { return match.slice(1, -1); })});
      $$ = "var "+$2+$3;
    }}
;

indexInitializer
  : '[' expression ']' indexInitializer { $$ = "["+ $2 +"]" + $4; }
  | '[' expression ']' { $$ = "["+$2+"]";}
;

initializer
 : '=' relational_expr {$$ = "=" + $2}
;

expression
  : expression '+' expression             { $$ = $1+ "+" +$3; }
  | expression '-' expression             { $$ = $1+ "-" +$3; }
  | expression '*' expression             { $$ = $1+ "*" +$3; }
  | expression '/' expression             { $$ = $1+ "/" +$3; }
  | expression 'mod' expression           { $$ = $1+ "%" +$3; }
  | '-' expression %prec UMINUS           { $$ = "-" + $2; }
  | integer {{
      $$ = ""+parseInt($1)+"";
      if(yy.terms === undefined){ yy.terms = [] };
      yy.terms.push({value: $1, type: "integer" });
    }}
  | number {{ 
      $$ = ""+Number($1)+""; 
      if(yy.terms === undefined){ yy.terms = [] };
      yy.terms.push({value: $1, type: "number" });
    }}
  | variable {{
      $$ = $1;
      if(yy.varArray === undefined){ yy.varArray = [] };
      var varType = yy.data[$1] ? yy.data[$1].type : undefined;
      yy.varArray.push({type: varType, name: $1});

      if(yy.terms === undefined){ yy.terms = [] }; 
      yy.terms.push({value: $1, type: varType });
  }}
  | arrayVariable {{
    $$ = $1;
  }}
;

relational_expr
  : expression '<'  expression              { $$ = $1+ "<"   +$3; }
  | expression '<=' expression              { $$ = $1+ "<="  +$3; }
  | expression '>'  expression              { $$ = $1+ ">"   +$3; }
  | expression '>=' expression              { $$ = $1+ ">="  +$3; }

  | relational_expr 'not=' relational_expr  { $$ = $1+ "!==" +$3; }
  | relational_expr '=' relational_expr     { $$ = $1+ "===" +$3; }
  | relational_expr 'and' relational_expr  { $$ = $1+ "&&" +$3; }
  | relational_expr 'or' relational_expr     { $$ = $1+ "||" +$3; }
  | '(' relational_expr ')'                    { $$ = "(" + $2 + ")"; }
  | boolean { $$ = "" + yytext==="true" + ""; }
  | expression
;

%%

function makeid(){
  var text = "";
  var possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var possibleNum = "0123456789";

  for( var i=0; i < 5; i++ ){
    text += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
    text += possibleNum.charAt(Math.floor(Math.random() * possibleNum.length));
  }

  return text;
}