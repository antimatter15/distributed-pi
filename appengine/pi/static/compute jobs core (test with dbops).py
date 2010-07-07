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
  while dbops < 12:
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
  
  
  
  
  
  
  ######THE ONE THAT USED THE THING WHICH DID SOMETHING#################
  def compute_jobs():
  #for dl in Jobs.gql(""):
  #  dl.delete()
  #for dl in GenState.gql(""):
  #  dl.delete()
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
  othercounter = state.counter
  primes = state.primes
  for i in range(0, 9):
    if curprime >= primecap: #at the end, add the remainder
      #create job
      job = Jobs()
      job.start = primes[int(math.floor((counter + i) / tasksize))]
      job.count = (counter + i) % tasksize #works
      #job.sub = int(math.floor((counter + i) / tasksize)) * tasksize #works
      job.big = big #works
      job.put()
      big += 1
      primecap = int(2 * math.floor((big * 9 + 21) * math.log(10) / math.log(2)));
      for z in range(0, (counter + i) / tasksize):
        job = Jobs()
        job.start = primes[z] #start, works
        job.count = tasksize #count, works
        #job.sub = (counter + z) * tasksize #index, works
        job.big = big #big, works
        job.put()
    #if it's length fits in the entire tasksize
    if (counter + i) % tasksize == 0 and (counter + i) != 0:
      #create job
      job = Jobs()
      job.start = primes[int(math.floor((counter + i) / tasksize))-1] #start, works
      job.count = tasksize #count, works
      #job.sub = counter + i - tasksize #index, works
      job.big = big #big, works
      job.put()
    curprime = next_prime(curprime)
    if (counter + i + 1) % (tasksize) == 0 and (counter + i) != 0:
      primes.append(curprime)
    #primes.append(curprime)
    print callback + ".log("+str(i)+","+str(counter)+","+str(counter+i)+","+str(othercounter)+");"
    othercounter += 1
  print callback + ".info("+str(i)+","+str(counter)+","+str(counter+i)+","+str(othercounter)+");"
  state.primecap = primecap
  state.curprime = curprime
  state.big = big
  state.counter = counter + i + 1
  state.primes = primes
  state.put()


