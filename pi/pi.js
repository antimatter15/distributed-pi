
function CalculatePi(digits){
  var result = "3.";
  if(digits > 0){
    for(var i = 0; i < digits; i += 9){
      console.log(i + 1)
      var ds = CalculatePiDigits(i + 1);
      var digitCount = Math.min(digits - i, 9);
      while(ds.length < 9){
        ds = "0" + ds;
      }
      result += ds.substr(0, digitCount);
    }
  }
  return result;
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


function CalculatePiDigits(n){
    var av, //
        vmax, // 
        num, //
        den, //
        s, //
        t, //
        sum = 0,
        N = Math.floor ((n + 20) * Math.log(10) / Math.log(2));

    for (var a = 3; a <= (2 * N); a = next_prime(a)) {

      vmax = Math.floor (Math.log(2 * N) / Math.log(a));
      av = 1;
      for (var i = 0; i < vmax; i++){
        av = av * a;
      }

      s = 0;
      num = 1;
      den = 1;
      var v = 0,
          kq = 1,
          kq2 = 1;

      for (var k = 1; k <= N; k++) {
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

          for (var i = v; i < vmax; i++){
            t = mul_mod(t, a, av);
          }
          s += t;
          if (s >= av){
            s -= av;
          }
        }
      }
      t = pow_mod(10, n - 1, av);
      s = mul_mod(s, t, av);
      sum = (sum +  s /  av) % 1;
    } 

    var Result = Math.floor (sum * 1e9);
    return Result+'';
  }
  


  function CalculatePiDigits2(progressFn, callbackFn, n) {
    // Initialize a few things here...
    var sum = 0;
    var N = Math.floor ((n + 20) * Math.log(10) / Math.log(2));
    var varray = []
    for (var u = 3; u <= (2 * N); u = next_prime(u)) {
      varray.push(u);
    }
    var counter = 0;
        
    (function () {
        // Do a little bit of work here...
        if (counter < varray.length) {
        var a = varray[counter]
        counter++;
        
            // Inform the application of the progress
            progressFn(counter, varray.length);
            // Process next chunk
            
      var vmax = Math.floor (Math.log(2 * N) / Math.log(a));
      var av = 1;
      var s = 0;
      var num = 1;
      var den = 1;
      var v = 0
      var kq = 1
      var kq2 = 1;
      var t;
      
      for (var i = 0; i < vmax; i++){
        av = av * a;
      }

      for (var k = 1; k <= N; k++) {
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

          for (var i = v; i < vmax; i++){
            t = mul_mod(t, a, av);
          }
          s += t;
          if (s >= av){
            s -= av;
          }
        }
      }
      t = pow_mod(10, n - 1, av);
      s = mul_mod(s, t, av);
      sum =  (sum +  s /  av) % 1;
      if(counter % 3){
            setTimeout(arguments.callee, 0);
      }else{
        arguments.callee();
      }
        }else{
          callbackFn(Math.floor (sum * 1e9)+'')
        }
    })();
}