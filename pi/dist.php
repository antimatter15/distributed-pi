<?php
if($_REQUEST['client'] != 'js'){
?>
<script src="pi.js"></script>
<script src="vx.all.js"></script>
<label for="enc">Calculate Pi</label>
<input name="enc" type="checkbox" onchange="enc(this)">
<br>
<div style="height: 10px;width: 500px;background-color:DEDEDE">
<div id="pg" style="background-color:green;height:10px;width:1px"></div></div>
<span id="p" style="color: green"></span>
<br>
<div id="d"></div>
<script>
function enc(c){
  stop = !c.checked;
  newjob();
}

var job = "NONE", data = "NONE";
var stop = false;
var time = "UNKNOWN";
function newjob(){
  if(stop)return;
  _.X("?client=js", function(x){
    job = parseInt(x);
    
    
    var start = (new Date).getTime()
    //data = CalculatePiDigits(job*9+1);
    
    CalculatePiDigits2(function(a,b){
      _.G("pg").style.width = Math.floor(a/b*500)+"px"
      _.G("p").innerHTML = (Math.round(a/b*10000)/100)+"% ("+a+"/"+b+")";
      //console.log(Math.floor(a/b*100),"%")
    },
    function(a){
      data = a;
      
    var end = (new Date).getTime();
      time = end-start
      newjob();
    },job*9+1)
    
    _.G("d").innerHTML = "Data: "+data+"<br>Time: "+time+"<br>Job: "+job+"<br>Digit: "+(job*9+1)
    
  },"job="+job+"&data="+data)
}
</script>
<?php
}else{

if(isset($_REQUEST['job']) && isset($_REQUEST['data']) &&
 $_REQUEST['job'] != "NONE" && $_REQUEST['data'] != "NONE"){
  file_put_contents("data/".$_REQUEST['job'].".txt",$_REQUEST['data']);
}

if(strlen(file_get_contents("tofix.txt")) == 0){

  $fh = fopen("jobs.txt", 'a');
  fwrite($fh, "k");
  fclose($fh);
  echo strlen(file_get_contents("jobs.txt"));

}else{
  echo file_get_contents("tofix.txt");
  file_put_contents("tofix.txt","");
}

}
?>
