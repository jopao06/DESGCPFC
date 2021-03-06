/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var quorum = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8],$V1=[1,12],$V2=[1,13],$V3=[1,14],$V4=[1,15],$V5=[1,16],$V6=[1,17],$V7=[1,18],$V8=[1,19],$V9=[1,20],$Va=[4,7],$Vb=[1,24],$Vc=[1,26],$Vd=[1,27],$Ve=[1,28],$Vf=[1,29],$Vg=[1,30],$Vh=[1,31],$Vi=[1,32],$Vj=[1,33],$Vk=[1,34],$Vl=[1,35],$Vm=[1,36],$Vn=[1,37],$Vo=[1,38],$Vp=[1,39],$Vq=[1,40],$Vr=[1,41],$Vs=[1,42],$Vt=[1,43],$Vu=[1,44],$Vv=[1,50],$Vw=[4,7,16,20,21,22,23,25,28,29,30,31,32],$Vx=[4,7,16,25],$Vy=[1,58],$Vz=[1,59],$VA=[1,69],$VB=[1,70],$VC=[1,87],$VD=[1,88],$VE=[4,7,16,20,21,25,28,29,30,31,32],$VF=[4,7,16];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"program":3,"EOF":4,"sourceElement":5,"statement":6,"whitespace":7,"variableStatement":8,"expressions":9,"variableDeclaration":10,"initializer":11,"variable":12,"int_type":13,"num_type":14,"bool_type":15,"=":16,"int_ae":17,"num_ae":18,"be":19,"+":20,"-":21,"*":22,"/":23,"(":24,")":25,"integer":26,"number":27,"<":28,"<=":29,">":30,">=":31,"!=":32,"!":33,"boolean":34,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"whitespace",12:"variable",13:"int_type",14:"num_type",15:"bool_type",16:"=",20:"+",21:"-",22:"*",23:"/",24:"(",25:")",26:"integer",27:"number",28:"<",29:"<=",30:">",31:">=",32:"!=",33:"!",34:"boolean"},
productions_: [0,[3,1],[3,2],[5,1],[5,3],[6,1],[6,1],[8,1],[8,2],[8,2],[10,3],[10,3],[10,3],[11,2],[9,1],[9,1],[9,1],[17,3],[17,3],[17,3],[17,3],[17,2],[17,3],[17,1],[18,3],[18,3],[18,3],[18,3],[18,2],[18,3],[18,1],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,1],[19,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return ""
break;
case 2:
return $$[$0-1]
break;
case 3:
 this.$ = $$[$0]
break;
case 4:
this.$ = $$[$0-2] +"\n"+ $$[$0]
break;
case 5: case 6: case 7:
this.$ = $$[$0]
break;
case 8: case 9:
this.$= $$[$0-1] + $$[$0]
break;
case 10: case 11: case 12:
this.$ = $$[$0-2]+ " " +$$[$0]
break;
case 13:
this.$ = "=" + $$[$0]
break;
case 14: case 15: case 16:
this.$ = $$[$0];
break;
case 17: case 24:
 this.$ = $$[$0-2]+ "+" +$$[$0]; 
break;
case 18: case 25:
 this.$ = $$[$0-2]+ "-" +$$[$0]; 
break;
case 19: case 26:
 this.$ = $$[$0-2]+ "*" +$$[$0]; 
break;
case 20: case 27:
 this.$ = $$[$0-2]+ "/" +$$[$0]; 
break;
case 21:
 this.$ = "(" + $$[$0] + ")"; 
break;
case 22:
 this.$ = $$[$0-1]; 
break;
case 23:
 this.$ = ""+parseInt(yytext)+""; 
break;
case 28:
 this.$ = "-" + $$[$0]; 
break;
case 29: case 44:
 this.$ = "(" + $$[$0-1] + ")"; 
break;
case 30:
 this.$ = ""+Number(yytext)+""; 
break;
case 31: case 36:
 this.$ = $$[$0-2]+ "<"   +$$[$0]; 
break;
case 32: case 37:
 this.$ = $$[$0-2]+ "<="  +$$[$0]; 
break;
case 33: case 38:
 this.$ = $$[$0-2]+ ">"   +$$[$0]; 
break;
case 34: case 39:
 this.$ = $$[$0-2]+ ">="  +$$[$0]; 
break;
case 35: case 40:
 this.$ = $$[$0-2]+ "!==" +$$[$0]; 
break;
case 41:
 this.$ = $$[$0-2]+ "===" +$$[$0]; 
break;
case 42:
 this.$ = "!" + $$[$0-1]; 
break;
case 43:
 this.$ = $$[$0]; 
break;
}
},
table: [{3:1,4:[1,2],5:3,6:4,8:5,9:6,10:7,12:$V0,13:$V1,14:$V2,15:$V3,17:9,18:10,19:11,21:$V4,24:$V5,26:$V6,27:$V7,33:$V8,34:$V9},{1:[3]},{1:[2,1]},{4:[1,21]},{4:[2,3],7:[1,22]},o($Va,[2,5]),o($Va,[2,6]),o($Va,[2,7],{11:23,16:$Vb}),{11:25,16:$Vb},o($Va,[2,14],{20:$Vc,21:$Vd,22:$Ve,23:$Vf,28:$Vg,29:$Vh,30:$Vi,31:$Vj,32:$Vk}),o($Va,[2,15],{20:$Vl,21:$Vm,22:$Vn,23:$Vo,28:$Vp,29:$Vq,30:$Vr,31:$Vs,32:$Vt}),o($Va,[2,16],{16:$Vu}),{7:[1,45]},{7:[1,46]},{7:[1,47]},{17:48,18:49,21:$V4,24:$Vv,26:$V6,27:$V7},{17:51,18:52,19:53,21:$V4,24:$V5,26:$V6,27:$V7,33:$V8,34:$V9},o($Vw,[2,23]),o($Vw,[2,30]),{7:[1,54]},o($Vx,[2,43]),{1:[2,2]},{5:55,6:4,8:5,9:6,10:7,12:$V0,13:$V1,14:$V2,15:$V3,17:9,18:10,19:11,21:$V4,24:$V5,26:$V6,27:$V7,33:$V8,34:$V9},o($Va,[2,8]),{9:56,17:9,18:10,19:11,21:$V4,24:$V5,26:$V6,27:$V7,33:$V8,34:$V9},o($Va,[2,9]),{17:57,21:$Vy,24:$Vz,26:$V6},{17:60,21:$Vy,24:$Vz,26:$V6},{17:61,21:$Vy,24:$Vz,26:$V6},{17:62,21:$Vy,24:$Vz,26:$V6},{17:63,21:$Vy,24:$Vz,26:$V6},{17:64,21:$Vy,24:$Vz,26:$V6},{17:65,21:$Vy,24:$Vz,26:$V6},{17:66,21:$Vy,24:$Vz,26:$V6},{17:67,21:$Vy,24:$Vz,26:$V6},{18:68,21:$VA,24:$VB,27:$V7},{18:71,21:$VA,24:$VB,27:$V7},{18:72,21:$VA,24:$VB,27:$V7},{18:73,21:$VA,24:$VB,27:$V7},{18:74,21:$VA,24:$VB,27:$V7},{18:75,21:$VA,24:$VB,27:$V7},{18:76,21:$VA,24:$VB,27:$V7},{18:77,21:$VA,24:$VB,27:$V7},{18:78,21:$VA,24:$VB,27:$V7},{17:80,18:81,19:79,21:$V4,24:$V5,26:$V6,27:$V7,33:$V8,34:$V9},{12:[1,82]},{12:[1,83]},{12:[1,84]},o($Vw,[2,21]),o($Vw,[2,28]),{17:85,18:86,21:$V4,24:$Vv,26:$V6,27:$V7},{20:$Vc,21:$Vd,22:$Ve,23:$Vf,25:$VC,28:$Vg,29:$Vh,30:$Vi,31:$Vj,32:$Vk},{20:$Vl,21:$Vm,22:$Vn,23:$Vo,25:$VD,28:$Vp,29:$Vq,30:$Vr,31:$Vs,32:$Vt},{16:$Vu,25:[1,89]},{17:80,18:81,19:90,21:$V4,24:$V5,26:$V6,27:$V7,33:$V8,34:$V9},{4:[2,4]},o($Va,[2,13]),o($VE,[2,17],{22:$Ve,23:$Vf}),{17:48,21:$Vy,24:$Vz,26:$V6},{17:85,21:$Vy,24:$Vz,26:$V6},o($VE,[2,18],{22:$Ve,23:$Vf}),o($Vw,[2,19]),o($Vw,[2,20]),o($Vx,[2,31],{20:$Vc,21:$Vd,22:$Ve,23:$Vf}),o($Vx,[2,32],{20:$Vc,21:$Vd,22:$Ve,23:$Vf}),o($Vx,[2,33],{20:$Vc,21:$Vd,22:$Ve,23:$Vf}),o($Vx,[2,34],{20:$Vc,21:$Vd,22:$Ve,23:$Vf}),o($Vx,[2,35],{20:$Vc,21:$Vd,22:$Ve,23:$Vf}),o($VE,[2,24],{22:$Vn,23:$Vo}),{18:49,21:$VA,24:$VB,27:$V7},{18:86,21:$VA,24:$VB,27:$V7},o($VE,[2,25],{22:$Vn,23:$Vo}),o($Vw,[2,26]),o($Vw,[2,27]),o($Vx,[2,36],{20:$Vl,21:$Vm,22:$Vn,23:$Vo}),o($Vx,[2,37],{20:$Vl,21:$Vm,22:$Vn,23:$Vo}),o($Vx,[2,38],{20:$Vl,21:$Vm,22:$Vn,23:$Vo}),o($Vx,[2,39],{20:$Vl,21:$Vm,22:$Vn,23:$Vo}),o($Vx,[2,40],{20:$Vl,21:$Vm,22:$Vn,23:$Vo}),o($Vx,[2,41]),{20:$Vc,21:$Vd,22:$Ve,23:$Vf,28:$Vg,29:$Vh,30:$Vi,31:$Vj,32:$Vk},{20:$Vl,21:$Vm,22:$Vn,23:$Vo,28:$Vp,29:$Vq,30:$Vr,31:$Vs,32:$Vt},o($VF,[2,10]),o($VF,[2,11]),o($VF,[2,12]),{20:$Vc,21:$Vd,22:$Ve,23:$Vf,25:$VC},{20:$Vl,21:$Vm,22:$Vn,23:$Vo,25:$VD},o($Vw,[2,22]),o($Vw,[2,29]),o($Vx,[2,44]),o($Vx,[2,42])],
defaultActions: {2:[2,1],21:[2,2],55:[2,4]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return 7
break;
case 1:return 13
break;
case 2:return 14
break;
case 3:return 15
break;
case 4:return 12
break;
case 5:return 27
break;
case 6:return 26
break;
case 7:return 34
break;
case 8:return 22
break;
case 9:return 23
break;
case 10:return 21
break;
case 11:return 20
break;
case 12:return 24
break;
case 13:return 25
break;
case 14:return 28
break;
case 15:return 29
break;
case 16:return 30
break;
case 17:return 31
break;
case 18:return 33
break;
case 19:return 32
break;
case 20:return 16
break;
case 21:return 4
break;
}
},
rules: [/^(?:[\s]+)/,/^(?:integer\b)/,/^(?:number\b)/,/^(?:boolean\b)/,/^(?:[a-zA-Z][a-zA-Z0-9]*\b)/,/^(?:[0-9]+\.[0-9]+\b)/,/^(?:[0-9]+\b)/,/^(?:(true|false)\b)/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\()/,/^(?:\))/,/^(?:<)/,/^(?:<=)/,/^(?:>)/,/^(?:>=)/,/^(?:not\b)/,/^(?:not=)/,/^(?:=)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = quorum;
exports.Parser = quorum.Parser;
exports.parse = function () { return quorum.parse.apply(quorum, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}