<?php
if($_REQUEST['client'] != 'js'){
?>
<script src="pi.js"></script>
<script src="vx.all.js"></script>
<label for="enc">Calculate Pi</label>
<input name="enc" type="checkbox" onchange="enc(this)">
<br>
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
function newjob(){
  if(stop)return;
  _.X("?client=js", function(x){
    job = parseInt(x);
    _.G("p").innerHTML = job*9+1;
    var start = (new Date).getTime()
    data = CalculatePiDigits(job*9+1);
    var end = (new Date).getTime();
    _.G("d").innerHTML += (end-start)+"<br>"
    setTimeout(newjob, 100);
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
