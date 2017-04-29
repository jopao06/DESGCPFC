/* description: Parses end executes mathematical expression. */

/* lexical grammar */
%lex
%%

\n\s*                     return 'newline';
[^\S\n]+                  /* ignore whitespace other than newlines */
"integer"                 return 'int_type'
"number"                  return 'num_type'
"boolean"                 return 'bool_type'

"repeat"\b                return 'repeat'
"times"\b                 return 'times'
"repeatwhile"\b           return 'repeatwhile'

"if"  return 'if'
"elseif" return 'elseif'
"else"\b return 'else'

"end"\b                   return 'end'
 
"not="                    return 'not='
("true"|"false")\b        return 'boolean'

[0-9]+\.[0-9]+\b          return 'number'
[0-9]+\b                  return 'integer'



"*"                   return '*'
"/"                   return '/'
"%"                 return 'mod'
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

[a-zA-Z][a-zA-Z0-9]*\b    return 'variable'

<<EOF>>               return 'EOF'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/' 'mod'
%left '^'
%left UMINUS
%left '<' '<=' '>' '>=' 
%left 'not=' '='

%start program

%% /* language grammar */

program
  : EOF { return ""}
  | sourceElement EOF {return $1}
;

sourceElement
  : statement { $$ = $1}
  | statement newline sourceElement {$$ = $1 +"\n"+ $3}
  | error
;

statement
  : variableStatement
  | repeatStatement
  | ifStatement
  | end
;

repeatStatement
  : repeat integer times { $$ = $1+" "+$2+" "+$3}
  | repeat variable times { $$ = $1+" "+$2+" "+$3}
  | repeatwhile relational_expr {$$ = $1+" "+$2}
;

ifStatement
  : if relational_expr { $$ = $1+" "+$2}
  | elseif relational_expr { $$ = $1+" "+$2}
  | else
;

variableStatement
 : variableDeclaration {$$ = $1}
 | variableDeclaration initializer {$$= $1 + $2}
 | variable initializer {$$= $1 + $2}
 | arrayDeclaration {$$=$1}
 | arrayVariable initializer {$$=$1+$2}
;

variableDeclaration
 : int_type variable {$$ = $1+$2}
 | num_type variable {$$ = $1+$2}
 | bool_type variable {$$ = $1+$2}
;

arrayVariable
  : variable indexInitializer {$$ = $1 + $2}
;

arrayDeclaration
  : int_type variable indexInitializer {$$ = $1+" "+$2+$3}
  | num_type variable indexInitializer {$$ = $1+" "+$2+$3}
  | bool_type variable indexInitializer {$$ = $1+" "+$2+$3}
;

indexInitializer
  : '[' integer ']' {$$ = "["+$2+"]"}
  | '[' integer ']' indexInitializer {$$ = "["+$2+"]" + $4}
  | '[' variable ']' {$$ = "["+$2+"]"}
  | '[' variable ']' indexInitializer {$$ = "["+$2+"]" + $4}
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
  | '-' expression %prec UMINUS           { $$ = "(" + $2 + ")"; }
  | '(' expression ')'                     { $$ = $2; }

  | integer                               { $$ = ""+parseInt($1)+""; }
  | number                                { $$ = ""+Number($1)+""; }
  | variable
;

relational_expr
  : expression '<'  expression              { $$ = $1+ "<"   +$3; }
  | expression '<=' expression              { $$ = $1+ "<="  +$3; }
  | expression '>'  expression              { $$ = $1+ ">"   +$3; }
  | expression '>=' expression              { $$ = $1+ ">="  +$3; }

  | relational_expr 'not=' relational_expr  { $$ = $1+ "!==" +$3; }
  | relational_expr '=' relational_expr     { $$ = $1+ "===" +$3; }
  | boolean { $$ = "" + yytext==="true" + ""; }
  | expression
;