
function computeStandardDev(){
    var arr=[];
    
    for (key, value) in myDict {
        arr.append("\(value)")
    }
    
    //average computation
    var k=0;
    for(var i=0; i<=arr.length-1; i++){
        k=arr[i]+k;
    }
    var lun=arr.length;
    var average=k/lun;
    
    //devsq computation
    var r=0;
    for(var l=0; l<=arr.length-1; l++){
        r=Math.pow((arr[l]-average),2)+r;
    }
    
    //variance computation
    var variance=r/lun;
    
    //max variance computation
    var maxvar= Math.pow((100-average),2);
    
    //max standard deviation computation
    var maxdev=Math.sqrt(maxvar);
    
    //standard deviation compute
    var dev=Math.sqrt(variance);
    
    window.alert(d);
}

