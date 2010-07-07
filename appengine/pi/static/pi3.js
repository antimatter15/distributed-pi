(function(){
  //here be the defaults
  var defaults = {
    fn: "DistPiCalc",
    url: (location.host.indexOf("localhost")==0)?"/f?":"http://distributed-pi.appspot.com/f?",
    sendtime: 8000,
    captime: 60000,
    addtime: 1500,
    threadcheck: 500,
    jobsize: 2,
    jobadd: 0.3,
    jobcap: 25,
    debug: (location.host.indexOf("localhost")==0)?true:false,
    maxwait: 7000,
    subinterval: 0,
    subintoffset: -20,
    autostart: (location.host.indexOf("localhost")==0)?50:500,
    avgsize: 50,
    sendcb: true,
    nosend: false
  }
  
  //if no config variable, create it
  //if(!window.PICONFIG) window.PICONFIG={};
  var conf = {};
  //populate if not present
  
  for(var setting in defaults){
    if(!window.PICONFIG || PICONFIG[setting] == null)
      conf[setting] = defaults[setting]
    else
      conf[setting] = PICONFIG[setting];
  }
  //check for deleteconfig
  if(window.PICONFIG && PICONFIG.deleteconfig == true) delete window.PICONFIG;
  
  //create function
  var calc = window[conf.fn] = function(){
    //omg start!
    calc.do_stopall = false;
    calc.thread()
    calc.send('i')
  }
  //same as main function
  calc.start = calc;
  //allow outside access to configs
  calc.conf = conf
  //create queue
  calc.queue = [];
  //create thread count
  calc.threadcount = 0;
  //create stop button
  calc.do_stopall = false;
  //create sessiontime
  calc.sessiontime = 0;
  //create store
  calc.store = [];
  //jobwait max
  calc.jobwait = 0;
  //count of jobs done
  calc.jobcount = 0;
  //moving average of subprocess interval
  calc.subint = new Array(30);
  //last log action
  calc.lastlog = "";
  //some debuggin stuff
  calc.log = function(){
    calc.lastlog = Array.prototype.slice.call(arguments).join(" ")
    if(conf.debug && window.console) console.log.apply(this, arguments);
    calc.status()
  }
  //some more debugin
  calc.info = function(){
    if(conf.debug && window.console) console.info.apply(this, arguments);
    calc.status()
  }
  //calc status
  calc.status = function(){
    if(document.getElementById(conf.fn + "StatusEl")){
      var status = "";
      if(calc.threadcount == 0){
        status += "Stopped (No running threads). "
      }else{
        status += "Running with " + calc.threadcount + " threads. "
      }
      if(calc.lastlog){
        for(var i = 0, s = 0; i < calc.subint.length; i++) s += calc.subint[i];
        status += "Processed "+calc.jobcount+" Jobs. Subprocess Interval: " + Math.floor(s/i) + " " + calc.lastlog.substr(0, 50) + (calc.lastlog.length>50?"...":"")
      }else{
        status += "Never did anything."
      }
      document.getElementById(conf.fn + "StatusEl").innerHTML = status
    }
    var control = document.getElementById(conf.fn + "ControlEl");
    var controlhtml = 
        "<button onclick='"+conf.fn+".thread()'>Add Thread</button>"+
        "<button onclick='"+conf.fn+".stop()'>Stop All</button>"
    if(control && control.innerHTML.length < 10) control.innerHTML = controlhtml;
  }
  //stop function
  calc.stop = function(){
    calc.do_stopall = true;
  }
  //the sending function
  calc.send = function(data){
    if(!conf.nosend){ //dont do anything if nosend
      calc.log("Sending Data: ", data);
      var B=document.createElement("script");
      B.type="text/javascript";
      B.src =  conf.url + //base url for communication
        "d=" + data + //the data to be sent
        ((conf.fn!="DistPiCalc"||conf.sendcb)?("&c="+conf.fn):'') //the callback function, server may have default
        +"&n="+((calc.queue.length<3)?Math.floor(conf.jobsize):1)+ //the number to request, low if queue full
        (conf.debug?"&dg=t":''); //the debug options, to get logging data. 
      document.body.appendChild(B)
    }else{
      calc.log("Not sending: ", data)
    }
  }
  //add to queue
  calc.add = function(id, bigjob, startprime, primecount, misc){
    //add to queue
    calc.queue.push([id,bigjob,startprime,primecount,misc])
  }
  //multiple adds
  calc.addbulk = function(bulk){
    if(bulk && bulk.pop){
      for(var i = 0; i < bulk.length; i++){
        if(bulk[i]) calc.add.apply(this, bulk[i]);
      }
    }
  }
  //the computing "thread"
  calc.thread = function(oldproc){
    if(!oldproc){
      calc.threadcount++;
      calc.do_stopall = false;
    }
    //compute stuff
    //if(calc.do_stopall == true){calc.threadcount--;return;} //KILL THE THREADS!
    if(calc.queue.length == 0){
      calc.jobwait += conf.threadcheck;
      if(calc.jobwait > conf.maxwait){calc.jobwait = 0; calc.send('i')};
      return setTimeout(function(){calc.thread(true)}, conf.threadcheck);
    }
    calc.jobwait = 0;
    var job = calc.queue.splice(0,1)[0]
    
      //{{{{{{
        var primearray = [], n = job[1]/*bigjob*/ * 9 + 1;
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
    

  
        for(var a = job[2]/*startprime*/, c = 1; c++ <= job[3]/*primecount*/; a = next_prime(a)) primearray.push(a);
        var N = Math.floor((n + 20) * Math.log(10) / Math.log(2)),
         ct = 0,
         bl = primearray.length,
         sum = 0,
         lasttime = (new Date).getTime(),
         ts = (new Date).getTime();
        (function () {
        if(Math.max(0, (new Date).getTime() - lasttime + conf.subintoffset - conf.subinterval) > 0){
          conf.subinterval = ((new Date).getTime() - lasttime - conf.subinterval) / 2
        }else{
          conf.subinterval = 0;
        }
        calc.subint.splice(0, 0, conf.subinterval)
        calc.subint.splice(conf.avgsize)
        //here is where the computing is looped
          var a = primearray[ct], 
          vmax = Math.floor (Math.log(2 * N) / Math.log(a)),
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
          sum +=  s / av
          ct++;
            
          calc.status() //report status
          
          if(calc.do_stopall == true){calc.threadcount--;calc.log("Killed thread");return;} //KILL THE THREADS!

          if (ct > bl) {
              calc.sessiontime += (new Date).getTime()-ts; //add to session total time
              calc.jobcount++;
              calc.log("Finished job with ", job[3]," primes in", (new Date).getTime()-ts, "ID:", job[0]);
              calc.store.push([job[0], sum % 1])
              if(calc.sessiontime > conf.sendtime || calc.queue.length == 0){
                calc.sessiontime = 0; //reset
                for(var i = 0, data = ""; i < calc.store.length; i++){
                  data += calc.store[i].join(":") + (i+1<calc.store.length?',':""); //
                }
                calc.send(data); //sendthedatas
                calc.store = []; //reset
              }
              if(conf.sendtime < conf.captime) //if it's not too big
                conf.sendtime += conf.addtime; //add time, save server resources
              if(conf.jobsize < conf.jobcap) //if its not too big
                conf.jobsize += conf.jobadd; //that's what she said!
              
              setTimeout(function(){calc.thread(true) /*launched from thread*/}, 100) //recurse!
          } else {
              lasttime = (new Date).getTime()
              setTimeout(arguments.callee, conf.subinterval)
          }
        })();
      //}}}}}}
  }
  
  setInterval(calc.status, 5000);
  
  if(conf.autostart > -1 || conf.autostart === true && conf.autostart !== false){
    setTimeout(calc.start, conf.autostart===true?500:conf.autostart)
  }
})()

