function pi(digit){
var p=parseInt,a=10000,c=p(digit*3.5),b=d=e=g=0,f=[],s=r=""
for(;b-c;)f[b++]=p(a/5)
for(;d=0,g=c*2;c-=14,s=("0000").concat(p(e)+p(d/a)),r+=s.substr(s.length-4),e=d%a)
for(b=c;d+=(f[b]?f[b]:0)*a,f[b]=d%--g,d= p(d/g--),--b;d*=b);
return r
}