var digit_store = "pi.txt";
var job_duration = 10000;

var fs = require('fs');
var saved_size = fs.statSync(digit_store).size;

var population = saved_size + 1; //this is digit number which can be safely saved to disk
var frontier = (population - 1) / 9;
var queue = {};
var digits = {};

var last_write = 0;

function write_digits(){
	if(new Date - last_write < job_duration * 6) return;
	last_write = +new Date;
	var buffer = '';
	while(population in digits){
		buffer += digits[population];
		delete digits[population];
		population += 9;
	}
	if(buffer.length > 0){
		fs.appendFile(digit_store, buffer);
	}
}

function save_job(n, sum, legacy){
	if(n in queue){
		queue[n].time = +new Date;
		queue[n].sum += sum;
		queue[n].legacy = legacy;
		if(legacy == 0){
			digits[n] = (Math.floor((queue[n].sum % 1.0) * 1e9)/1e9).toFixed(9).slice(2)
			delete queue[n];
			console.log('completed digit', n, digits[n], Object.keys(digits).length, "unwritten", Object.keys(queue).length, "queued")
			write_digits();
			return schedule_job()
		}else{
			// console.log('continue', queue)
			// do nothing, it'll continue automagically
		}
	}else{
		return schedule_job()
	}
}

function schedule_job(){
	var candidates = Object.keys(queue).map(function(e){
		return queue[e]
	}).filter(function(e){
		return (e.time < +new Date - job_duration * 3)
	}).sort(function(a, b){
		return a.digit - b.digit
	});
	if(candidates.length == 0){
		var new_job = {
			digit: (frontier * 9 + 1),
			time: +new Date,
			sum: 0,
			legacy: 3 //first prime number
		};
		queue[new_job.digit] = new_job;
		frontier++;
		return [new_job.digit, new_job.legacy, job_duration];
	}else{
		candidates[0].time = +new Date;
		return [candidates[0].digit, candidates[0].legacy, job_duration]
	}
}

var http = require('http');
var url = require('url');
http.createServer(function (req, res) {
	var page = url.parse(req.url, true);
	
	if(page.pathname == "/task"){
		res.writeHead(200, {
			'Content-Type': 'application/json', 
			'Access-Control-Allow-Origin': '*'
		});
		var data = JSON.parse(page.query.data);
		if(data.length == 3){
			var new_job = save_job(data[0], data[1], data[2]);
			if(new_job){
				res.end(JSON.stringify(new_job));
			}else{
				res.end('[]');
			}
		}else if(data.length == 0){
			res.end(JSON.stringify(schedule_job()))
		}
	}else if(page.pathname == "/worker.js"){
		res.writeHead(200, {
			'Content-Type': 'text/javascript', 
			'Access-Control-Allow-Origin': '*'
		});
		fs.readFile('worker.js', 'utf8', function(err, data){
			if(err) throw err;

			res.end(data.replace('__AUTOINSERT_SCHEDULER__', '//' + req.headers.host + '/task'))
		})
	}else if(page.pathname == "/pi"){
		res.writeHead(200, {
			'Content-Type': 'text/plain', 
			'Access-Control-Allow-Origin': '*'
		});
		fs.readFile('pi.txt', 'utf8', function(err, data){
			if(err) throw err;
			res.end("3." + data)
		})
	}else{
		res.writeHead(200, {
			'Content-Type': 'text/html', 
			'Access-Control-Allow-Origin': '*'
		});
		fs.readFile('demo.html', 'utf8', function(err, data){
			if(err) throw err;
			res.end(data);
		})
	}

}).listen(1337);
console.log('Server running');