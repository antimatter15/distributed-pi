#!/usr/bin/python

import math #ISHMAPRTWNAT


class DigitGroup(db.Model):
    value       = db.TextProperty()
    completed   = db.DateTimeProperty(auto_now_add=True)
    start       = db.IntegerProperty()
    end         = db.IntegerProperty()


class GenState(db.Model):
    primes      = db.ListProperty(int)
    primecap    = db.IntegerProperty()
    curprime    = db.IntegerProperty()
    counter     = db.IntegerProperty()
    big         = db.IntegerProperty()
    

def is_prime(n):
  if n % 2 == 0:
    return False
  for i in range(3, int(math.sqrt(n) + 1)):
    if n % i == 0:
      return False
  return True
  
def next_prime(n):
  while True:
    n += 1
    if is_prime(n) == True:
      return n
      

def sum_jobs():
  digitblock = ""
  jobs = Jobs.gql("WHERE start = :start ORDER BY big ASC", start = 3)
  count = jobs.count()
  if count > 1:
    i = 0
    for completed in jobs:
      pisum = 0.0
      i += 1
      if i != count:
        big = completed.big
        first = big if i == 1 else first
        for qt in Jobs.gql("WHERE big = :1", big):
          pisum += qt.value
          qt.delete()
        strpi = str(int(math.floor(pisum%1*1e9)))
        digitblock += str((9-len(strpi)) * "0") + strpi
    block = DigitGroup()
    block.value = digitblock
    block.start = first
    block.end = big #the latesterst
    block.put()



def compute_jobs():
  tasksize = 250
  if len(GenState.gql("").fetch(1)) == 0:
    state = GenState()
    state.primes = [3]
    state.primecap = 138
    state.curprime = 3
    state.counter = 0
    state.big = 0
  else:
    state = GenState.gql("")[0]
  primecap = state.primecap
  curprime = state.curprime
  big = state.big
  counter = state.counter
  primes = state.primes
  dbops = 0
  while dbops < 60:
  #for i in range(0, 5):
    if curprime >= primecap: #at the end, add the remainder
      #create job
      job = Jobs()
      job.start = primes[int(math.floor(counter / tasksize))]
      job.count = counter % tasksize #works
      #job.sub = int(math.floor(counter / tasksize)) * tasksize #works
      job.big = big #works
      job.put()
      dbops += 1
      big += 1
      primecap = int(2 * math.floor((big * 9 + 21) * math.log(10) / math.log(2)));
      for z in range(0, state.counter / tasksize):
        job = Jobs()
        job.start = primes[z] #start, works
        job.count = tasksize #count, works
        #job.sub = (counter + z) * tasksize #index, works
        job.big = big #big, works
        job.put()
        dbops += 1
    #if it's length fits in the entire tasksize
    if counter % tasksize == 0 and counter != 0:
      #create job
      job = Jobs()
      job.start = primes[int(math.floor(counter / tasksize))-1] #start, works
      job.count = tasksize #count, works
      #job.sub = counter - tasksize #index, works
      job.big = big #big, works
      job.put()
      dbops += 1
    curprime = next_prime(curprime)
    if (counter + 1) % (tasksize) == 0 and counter != 0:
      primes.append(curprime)
    #primes.append(curprime)
    counter += 1
  state.primecap = primecap
  state.curprime = curprime
  state.big = big
  state.counter = counter
  state.primes = primes
  state.put()
  
