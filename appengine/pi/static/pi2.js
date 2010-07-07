
DIST_PI_CALC_CALLBACK_URL = "/job?";

function CalcPiTask (id, bigjob, startprime, primecount, misc) {
  var primearray = [], functionname = arguments.callee.name, n = bigjob * 9 + 1, multiarray = [];
  
  if(!window[functionname]){
    return false;
  }
  
  function send(id, data){
    var B=document.createElement("script");
    B.type="text/javascript";
    B.src =  DIST_PI_CALC_CALLBACK_URL+"id="+id+"&dt="+data+"&cb="+functionname;
    document.body.appendChild(B)
  }
  
  
  if(id==null||bigjob==null||startprime==null||primecount==null){return send('init','init')}


  function is_prime(n){
    if((n % 2) == 0){
      return false;
    }
    var r = Math.sqrt(n);
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

  
  for(var a = startprime, c = 1; c++ <= primecount; a = next_prime(a)){
    primearray.push(a)
  } 


    function mul_mod(a, b, m){
      return (a * b) % m;
    }

    function inv_mod(x, y){
      var u = x, 
          v = y, 
          a = 0, 
          c = 1, 
          t, q;
      do {
        q = Math.floor(v / u);
        t = c;
        c = a - q * c;
        a = t;
        t = u;
        u = v - q * u;
        v = t;
      } while(u != 0)
      a = a % y;
      if(a < 0){
        a = y + a
      }
      return a;
    }

    function pow_mod(a, b, m){
      var r = 1, 
          aa = a;
      while(true){
        if((b & 1) != 0){
          r = mul_mod(r, aa, m);
        }
        b = b >> 1;
        if(b == 0){
          break;
        }
        aa = mul_mod(aa, aa, m);
      }
      return r;
    }
    
       var N = Math.floor ((n + 20) * Math.log(10) / Math.log(2)),
       ct = 0,
       bl = primearray.length,
       sum = 0,
       ts = (new Date).getTime();
       
    (function () {
        var a = primearray[ct]

      var vmax = Math.floor (Math.log(2 * N) / Math.log(a)),
      av = 1,
      s = 0,
      num = 1,
      den = 1,
      v = 0,
      kq = 1,
      kq2 = 1,
      t,
      i,
      k
     
      for (i = 0; i < vmax; i++) av = av * a;
      
      for (k = 1; k <= N; k++) {
        t = k;
        if (kq >= a) {
          do {
            t = t / a;
            v--;
          } while ((t % a) == 0);

          kq = 0;
        }
        kq++;
        num = mul_mod(num, t, av);
        t = 2 * k - 1;
        if (kq2 >= a) {
          if (kq2 == a) {
            do {
              t = t / a;
              v++;
            } while ((t % a) == 0);
          }
          kq2 -= a;
        }
        den = mul_mod(den, t, av);
        kq2 += 2;
    
        if (v > 0) {
          t = inv_mod(den, av);
          t = mul_mod(t, num, av);
          t = mul_mod(t, k, av);

          for (i = v; i < vmax; i++) t = mul_mod(t, a, av);
          s += t;
          if (s >= av) s -= av;
        }
      }
      t = pow_mod(10, n - 1, av);
      s = mul_mod(s, t, av);

      sum +=  s /  av

        ct++;
        if (ct > bl) {
            console.log("Finished job with ",primecount," primes in", (new Date).getTime()-ts)
            send(id, sum % 1)
        } else {
            setTimeout(arguments.callee, 0)
        }
    })();
}
