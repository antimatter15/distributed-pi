  function CalculatePiDigits2(n){
      var sum = 0,
        N = Math.floor ((n + 20) * Math.log(10) / Math.log(2));

    for (var a = 3; a <= (2 * N); a = next_prime(a)) {
      sum = CalculatePiDigitsLooper(a,n,N,sum);
    }
    return Math.floor (sum * 1e9)+'';
  }
    function CalculatePiDigitsLooper(a,n,N,sum){
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
      return (sum +  s /  av) % 1;
  }
  

function doSomething (progressFn, callbackFn, n) {
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
            setTimeout(arguments.callee, 0);
        }else{
          callbackFn(sum)
        }
    })();
}


  function CalculatePiDigitsLooper(n,callback){
    this._n = n;
    this._N = Math.floor ((n + 20) * Math.log(10) / Math.log(2));
    this._a = 3;
    this._callback = callback;
    this._sum = 0;
    this.looper();
  }
  CalculatePiDigitsLooper.prototype.looper = function(){
      
      var vmax = Math.floor (Math.log(2 * N) / Math.log(a));
      var av = 1;
      var s = 0;
      var num = 1;
      var den = 1;
      var v = 0
      var kq = 1
      var kq2 = 1;
      var t;
      
      var a = this._a;
      var n = this._n;
      var N = this._N;
      var sum = this._sum;

      
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
      this._sum = (sum +  s /  av) % 1;
      
      if(a <= (2 * N)){
        this._a = next_prime(a)
        setTimeout(arguments.callee, 100);
      }else{
        this._callback(this._sum);
      }
  }