<?php
header("content-type: text/plain");
$v = strlen(file_get_contents("jobs.txt"));
echo ($v*9+1)." Digits of Pi with $v chunks\n\n";

echo "3.\n";
$tofix = array();

for($i = 0; $i < $v; $i++){

  if(file_exists("data/".$i.".txt")){
  $x = file_get_contents("data/".$i.".txt");
  printf("%09s",$x);
  }else{
  array_push($tofix, $i);
  echo "000000000";
  }
    echo " ";
}

if(count($tofix) > 0){
echo "\n\n\n";
echo implode(",",$tofix);
  file_put_contents("tofix.txt",$tofix[0]);
}

?>