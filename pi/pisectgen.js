function is_prime(n){
  if((n % 2) == 0){
    return false;
  }
  var r = Math.sqrt(n); //not necessary to floor
  for(var i = 3; i <= r; i+=2){
    if((n % i) == 0){
      return false;
    }
  }
  return true;
}

function next_prime(n){
  do {
    n++;
  } while(!is_prime(n));
  return n;
}

function hire(n){
   var N = Math.floor ((n + 20) * Math.log(10) / Math.log(2));
   var jobs = [];
    for (var a = 3; a <= (2 * N); a = next_prime(a)) {
      jobs.push(a);
   }
   return jobs;
}

function splitjob(j,start,length){
  return j.slice(start,start+length);
}