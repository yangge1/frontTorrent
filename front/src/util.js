export default {
    parseUnit:parseUnit
}
function parseUnit(size){
    var units=['B','KB','MB','GB','TB'];
    var value=0;
    var showT='';
    for(var x=units.length-1; x>=0;x--){
        value=size/Math.pow(1024,x);
        if(value>=1){
           return showT=value.toFixed(2)+units[x]
        }
    }
    if(!showT){
       return showT=value+'B';
    }
}
