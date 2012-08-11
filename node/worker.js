function mul_mod(a, b, m) {
    return (a * b) % m;
}

function inv_mod(x, y) {
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
    } while (u != 0);
    a = a % y;
    if (a < 0) {
        a = y + a
    }
    return a;
}

function pow_mod(a, b, m) {
    var r = 1,
        aa = a;
    while (true) {
        if ((b & 1) != 0) {
            r = mul_mod(r, aa, m);
        }
        b = b >> 1;
        if (b == 0) {
            break;
        }
        aa = mul_mod(aa, aa, m);
    }
    return r;
}

function process_job(a, n){
	var N = Math.floor ((n + 20) * Math.log(10) / Math.log(2)),
		vmax = Math.floor(Math.log(2 * N) / Math.log(a)),
	    av = 1,
	    s = 0,
	    num = 1,
	    den = 1,
	    v = 0,
	    kq = 1,
	    kq2 = 1,
	    t,
	    i,
	    k;
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
	return s / av;
}


function is_prime(n) {
    if ((n % 2) == 0) {
        return false;
    }
    var r = Math.sqrt(n); //not necessary to floor
    for (var i = 3; i <= r; i += 2) {
        if ((n % i) == 0) {
            return false;
        }
    }
    return true;
}

function next_prime(n) {
    do {
        n++;
    } while (!is_prime(n));
    return n;
}


function report_job(n, sum, legacy, duration){
	query_server([n, sum, legacy])
	if(legacy > 0) enlist(n, legacy, duration);
}

function enlist(n, a, duration){
	var N = Math.floor((n + 20) * Math.log(10) / Math.log(2));
	var sum = 0;
	var compute_max = +new Date + duration; //the amount of time to devote to a job
	while(a <= 2 * N){
		if(+new Date > compute_max){
			return report_job(n, sum % 1, a, duration); //the prime to continue from later
		}
		sum += process_job(a, n);
		a = next_prime(a);
    }
    return report_job(n, sum % 1, 0, duration); //0 means the job was completed
}

function query_server(data){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://localhost:1337/task?data='+encodeURIComponent(JSON.stringify(data)), true);
	xhr.onload = function(){
		var e = JSON.parse(xhr.responseText);
		// postMessage(xhr.responseText);
		if(e.length == 3){
			enlist(e[0], e[1], e[2])	
		}
	}
	xhr.send(null)
}

query_server([])