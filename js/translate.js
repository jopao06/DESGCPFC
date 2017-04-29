var translate = function(code){
    var variableTable = {errorLog:[]};
    var lineCounter = 0;
    var rVar = "gT7oHN3a4G"; // Reserved Variable
    var lines = code.split('\n');
    

    $.each( lines, function( index, value ){
        if(value){

        if(value.match(/^integer\b|^number\b|^boolean\b/g))
            lines[index] = lines[index].replace(/^integer\b|^number\b|^boolean\b/g, "var") + ";";
        else if(value.match(/^repeatwhile/g))
            lines[index] = lines[index].replace(/^repeatwhile\b/g, "while(") + " ){";
        else if(value.match(/^repeat\b/)){
            lines[index] = lines[index].replace(/^repeat\b/g, "for(var "+rVar+" = 0; "+rVar+" < ") ;
            lines[index] = lines[index].replace(/times/g, ";"+rVar+"++){");
        }
        else if(value.match(/^if/)){
            lines[index] = lines[index].replace(/^if/g, "if(") + " ){";
        }
        else if(value.match(/^elseif/)){
            lines[index] = lines[index].replace(/^elseif/g, "}else if(") + " ){";
        }
        else if(value.match(/^else/)){
            lines[index] = lines[index].replace(/^else/g, "}else(") + " ){";
        }
        else if(value.match(/end/g))
            lines[index] = lines[index].replace(/end/g, "}");
        else{
            lines[index] = value + ";";
        }

        if(value.match(/\bmod\b/g)){
            lines[index] = lines[index].replace(/\bmod\b/g, "%");
        }

        }

        // console.log(value);
    });
    // $.each(lines, function(){
    // });

    return lines.join("\n");
};

/*
mod >> %
not= >> !==
= >> ===
= >> =

integer foo = 12            // Replace integer with var and save attr.type as integer
number foo1 = 12.5 
boolean foo2 = true

repeat [var | value] times  
end
 v
for(var i=0; i<[var|value] ; i++){
}

repeat while [condition]
end
v
while([condition]){
}

if [condition]
elseif [condition]
else
end
v
if([condition]){
}else if ([condition]){
}else{
}
*/