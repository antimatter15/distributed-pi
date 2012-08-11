function int mul_mod(int a, int b, int m) {
	return  (a * b) % m;
	//(int)(((long) a * (long) b) % m);
}

/* return the inverse of x mod y */
function int inv_mod(int x, int y) {
	let int q, u, v, a, c, t;

	u = x;
	v = y;
	c = 1;
	a = 0;

	do {
		q = v / u;

		t = c;
		c = a - q * c;
		a = t;

		t = u;
		u = v - q * u;
		v = t;
	} while (u != 0);

	a = a % y;

	if (a < 0) {
		a = y + a;
	}

	return a;
}

/* return (a^b) mod m */
function int pow_mod(int a, int b, int m) {
	let int r, aa;

	r = 1;
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

let int n = 1;
let int a = 3;
let int N = 69;
let int vmax = 4; 

// output should be 0.6172839506172839
// let int N = (int)((n + 20) * Math.Log(10) / Math.Log(2));
// let int vmax = (int)(Math.Log(2 * N) / Math.Log(a));
let int av, num, den, s, t;
av = 1;

for (let int i = 0; i < vmax; i++) {
    av = av * a;
}

s = 0;
num = 1;
den = 1;
let int v = 0;
let int kq = 1;
let int kq2 = 1;

for (let int k = 1; k <= N; k++) {

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

        for (let int i = v; i < vmax; i++) {
            t = mul_mod(t, a, av);
        }

        s += t;

        if (s >= av) {
            s -= av;
        }
    }

}

t = pow_mod(10, n - 1, av);
s = mul_mod(s, t, av);

// trace(((double) s / (double) av) % 1.0)

