function startPi(){pisenddata("NONE","NONE")}function pisenddata(D,A){var C=document.createElement("script");C.type="text/javascript";C.src="http://distpi.appjet.net/?o=u&callback=CalculatePiSect&id="+D+"&data="+A;document.body.appendChild(C)}function CalculatePiSect(C,B,A){CalculatePiDigits4(function(E,D,G,F){return 250},function(F,D,E){pisenddata(D[0],F.join(","))},C,A,B)}function CalculatePiDigits4(D,G,B,I,A){var F=Math.floor((B+20)*Math.log(10)/Math.log(2)),E=0,C=I.length,H=0;(function(){var R=(new Date).getTime(),T=I[E];function Q(e,d,c){return(e*d)%c}function L(b,j){var f=b,e=j,d=0,i=1,g,h;do{h=Math.floor(e/f);g=i;i=d-h*i;d=g;g=f;f=e-h*f;e=g}while(f!=0);d=d%j;if(d<0){d=j+d}return d}function N(e,d,c){var f=1,g=e;while(true){if((d&1)!=0){f=Q(f,g,c)}d=d>>1;if(d==0){break}g=Q(g,g,c)}return f}var Y=Math.floor(Math.log(2*F)/Math.log(T)),J=1,Z=0,P=1,U=1,W=0,V=1,S=1,X,O,M;for(O=0;O<Y;O++){J=J*T}for(M=1;M<=F;M++){X=M;if(V>=T){do{X=X/T;W--}while((X%T)==0);V=0}V++;P=Q(P,X,J);X=2*M-1;if(S>=T){if(S==T){do{X=X/T;W++}while((X%T)==0)}S-=T}U=Q(U,X,J);S+=2;if(W>0){X=L(U,J);X=Q(X,P,J);X=Q(X,M,J);for(O=W;O<Y;O++){X=Q(X,T,J)}Z+=X;if(Z>=J){Z-=J}}}X=N(10,B-1,J);Z=Q(Z,X,J);I[E]=Z/J;H+=((new Date).getTime()-R);E++;if(E>C){G(I,A,H/C)}else{var K=D(E,C,A,((new Date).getTime()-R));setTimeout(arguments.callee,K?K:250)}})()};setTimeout(startPi,1000);