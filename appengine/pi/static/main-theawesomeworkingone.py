#!/usr/bin/env python
# -*- coding: utf-8 -*-

import wsgiref.handlers
import random
import datetime
import base64
import urllib
import re
import pickle
import math #ISHMAPRTWNAT
from google.appengine.ext import webapp, db
from google.appengine.api import memcache
from google.appengine.ext.webapp import template

class Jobs(db.Model):
   #id          = db.StringProperty() //not necessary as google does this for us
    big         = db.IntegerProperty() #the big job ID
    sub         = db.IntegerProperty() #the sub job ID
    start       = db.IntegerProperty() #the prime index to start on
    count       = db.IntegerProperty() #the prime index to stop on
    assigned    = db.DateTimeProperty() #the date assigned
    value       = db.FloatProperty() #the end value
    
class Digits(db.Model):
    value       = db.IntegerProperty()
    completed   = db.DateTimeProperty(auto_now_add=True)
    big         = db.IntegerProperty()

class GenState(db.Model):
    primes      = db.ListProperty(int)
    index       = db.IntegerProperty()
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
      

def compute_jobs():
  if len(GenState.gql("").fetch(1)) == 0:
    state = GenState()
    state.primes = [3]
    state.index = 0
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
  for i in range(0, 99):
    if curprime >= primecap:
      #create job
      job = Jobs()
      job.start = primes[int(math.floor(counter + i / 25)) * 25]
      job.count = (counter + i) % 25 #works
      job.sub = int(math.floor(counter + i / 25)) * 25 #works
      job.big = big #works
      job.put()
      big += 1
      primecap = int(2 * math.floor((big * 9 + 21) * math.log(10) / math.log(2)));
      for z in range(0, (counter + i) / 25):
        job = Jobs()
        job.start = primes[z * 25] #start, works
        job.count = 25 #count, works
        job.sub = counter + z #index, works
        job.big = big #big, works
        job.put()
    if (counter + i) % 25 == 0 and (counter + i) != 0:
      #create job
      job = Jobs()
      job.start = primes[counter + i - 25] #start, works
      job.count = 25 #count, works
      job.sub = counter + i - 25 #index, works
      job.big = big #big, works
      job.put()
    curprime = next_prime(curprime)
    primes.append(curprime)
  state.primecap = primecap
  state.curprime = curprime
  state.big = big
  state.counter = counter
  state.primes = primes
  state.put()
    

class CreateJobs(webapp.RequestHandler):
  def get(self):
    compute_jobs()
    
class JobHandler(webapp.RequestHandler):
  def get(self):
    jid = self.request.get("id")
    dat = self.request.get("dt")
    if jid is not None and jid != "init" and dat is not None and dat != "init":
      completed = Jobs.get_by_id(int(jid))
      if completed is not None and completed.value is None:
        completed.value = float(dat)
        completed.put()
        if len(Jobs.gql("WHERE value = :1 AND big = :big", None, big = completed.big).fetch(1)) == 0:
          pisum = 0.0
          for qt in Jobs.gql("WHERE big = :big", big = completed.big):
            if qt.value is not None:
              pisum += qt.value
              qt.delete()
          block = Digits()
          block.value = int(math.floor(pisum%1*1e9))
          block.big = completed.big
          #block.size = completed.size
          block.put()
          if Jobs.gql("").count() < 42:
            compute_jobs()
    result = Jobs.gql("WHERE value = :1 ORDER BY big ASC, assigned ASC, sub ASC", None).fetch(1)
    if len(result) > 0:
      res = result[0]
      result[0].assigned = datetime.datetime.now()
      result[0].put()
      self.response.out.write(self.request.get("cb") + "(" +str(res.key().id()) + "," + str(res.big) + "," + str(res.start) + "," + str(res.count) + ")")
    else:
      compute_jobs()
      self.response.out.write("\n/*Congrats! You are the lucky client to have started the process! This means nothing!*/\n")
      self.response.out.write("setTimeout(" + self.request.get("cb") + ", 1000);")

class SumHandler(webapp.RequestHandler):
  def get(self):
    self.response.out.write(str(Digits.gql("WHERE big = :big", big = int(self.request.get("big"))).fetch(1)[0].value))

def main():
  application = webapp.WSGIApplication([
                                        ('/add', CreateJobs),
                                        ('/job', JobHandler),
                                        ('/sum', SumHandler)
                                        ],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
