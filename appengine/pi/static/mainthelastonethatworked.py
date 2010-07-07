#!/usr/bin/env python
# -*- coding: utf-8 -*-

import wsgiref.handlers
import random
import datetime
import base64
import urllib
import re
import pickle
import logging
import math #ISHMAPRTWNAT
from google.appengine.ext import webapp, db
from google.appengine.api import memcache
from google.appengine.ext.webapp import template
from google.appengine.api import quota 

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
  primes = state.primes
  for i in range(0, 100):
    if curprime >= primecap:
      #create job
      job = Jobs()
      job.start = primes[int(math.floor((counter + i) / tasksize))]
      job.count = (counter + i) % tasksize #works
      job.sub = int(math.floor((counter + i) / tasksize)) * tasksize #works
      job.big = big #works
      job.put()
      big += 1
      primecap = int(2 * math.floor((big * 9 + 21) * math.log(10) / math.log(2)));
      for z in range(0, (counter + i) / tasksize):
        job = Jobs()
        job.start = primes[z] #start, works
        job.count = tasksize #count, works
        job.sub = (counter + z) * tasksize #index, works
        job.big = big #big, works
        job.put()
    if (counter + i) % tasksize == 0 and (counter + i) != 0:
      #create job
      job = Jobs()
      job.start = primes[int(math.floor((counter + i) / tasksize))-1] #start, works
      job.count = tasksize #count, works
      job.sub = counter + i - tasksize #index, works
      job.big = big #big, works
      job.put()
    curprime = next_prime(curprime)
    if (counter + i + 1) % (tasksize) == 0 and (counter + i) != 0:
      primes.append(curprime)
    #primes.append(curprime)
  state.primecap = primecap
  state.curprime = curprime
  state.big = big
  state.counter = counter + i + 1
  state.primes = primes
  state.put()

class CreateJobs(webapp.RequestHandler):
  def get(self):
    compute_jobs()
    
class JobHandler2(webapp.RequestHandler):
  def get(self):
    start = datetime.datetime.now()
    if self.request.get("d") not in ["i","init", None, ""]:
      for datapart in self.request.get("d").split(","):
        if datapart is not "":
          datasplit = datapart.split(":")
          if len(datasplit) == 2:
            jobid = datasplit[0]
            data = datasplit[1]
            completed = Jobs.get_by_id(int(jobid))
            if completed is not None and completed.value is None:
              completed.value = float(data)
              completed.put()

    if self.request.get("n") not in ["", None, "0"]:
      num = int(self.request.get("n"))
    else:
      num = 3
    #now for the job assigning
    jobs = Jobs.gql("WHERE value = :1 ORDER BY big ASC, assigned ASC, start ASC", None).fetch(num)
    for result in jobs:
      result.assigned = datetime.datetime.now()
      self.response.out.write(self.request.get("c") + ".add(" +str(result.key().id()) + "," + str(result.big) + "," + str(result.start) + "," + str(result.count) + ");")
    if len(jobs) == 0:
      for completed in Jobs.gql("WHERE start = :start", start = 3):
        pisum = 0.0
        for qt in Jobs.gql("WHERE big = :big", big = completed.big):
          if qt.value is not None:
            pisum += qt.value
            qt.delete()
        block = Digits()
        block.value = int(math.floor(pisum%1*1e9))
        block.big = completed.big
        block.put()
      compute_jobs()
      self.response.out.write("setTimeout(" + self.request.get("c") + ".send, 500);")
    
    
    

class SumHandler(webapp.RequestHandler):
  def get(self):
    self.response.out.write(str(Digits.gql("WHERE big = :big", big = int(self.request.get("big"))).fetch(1)[0].value))

class PiHandler(webapp.RequestHandler):
  def get(self):
    for digit in Digits.gql("ORDER BY big ASC"):
      self.response.out.write((9-len(str(digit.value))) * "0" + str(digit.value))

class Clean(webapp.RequestHandler):
  def get(self):
    for dl in Jobs.gql(""):
      dl.delete()
    for dl in GenState.gql(""):
      dl.delete()
    for dl in Digits.gql(""):
      dl.delete()

def main():
  application = webapp.WSGIApplication([
                                        ('/oldadd', CreateJobs),
                                        ('/oldjb', JobHandler2),
                                        ('/oldsum', SumHandler),
                                        ('/oldpi', PiHandler),
                                        ('/oldempty', Clean)
                                        ],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
