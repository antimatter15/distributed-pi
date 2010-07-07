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


function amabo(){
  var a = 3;
  var ns = 0;
  var jbi = 0;
  var jbc = [3]
  var jba = []
  for(var ctr = 0; ctr < 999; ctr++){
    if(a >= ns){
      jba.push([(jbi-1)*9+1,  jbc.slice(0,ctr)])
      ns =  2 * Math.floor (((jbi++) * 9 + 1 + 20) * Math.log(10) / Math.log(2)); //logarithms FTW
    }
    a = next_prime(a)
    jbc.push(a)
  }    
  return jba
}

function amasplit2(dat){
  var dl = dat.length
  for(var i = 0, jobs=[]; i < dl; i+= 25){
    jobs.push([dat[i],Math.min(dl-i, 25)])
  }
  return jobs
}

