#!/usr/bin/env python
# -*- coding: utf-8 -*-

import wsgiref.handlers
import random
import datetime
import base64
import urllib
import re
import pickle
import math
from google.appengine.ext import webapp, db
from google.appengine.api import memcache
from google.appengine.ext.webapp import template

class Jobs(db.Model):
   #id          = db.StringProperty() //not necessary as google does this for us
    big         = db.IntegerProperty() #the big job ID
    sub         = db.IntegerProperty() #the sub job ID
    size        = db.IntegerProperty() #the size of the whole job
    start       = db.IntegerProperty() #the prime index to start on
    count       = db.IntegerProperty() #the prime index to stop on
    assigned    = db.DateTimeProperty() #the date assigned
    value       = db.FloatProperty() #the end value
    
class Digits(db.Model):
    value       = db.IntegerProperty()
    completed   = db.DateTimeProperty(auto_now_add=True)
    big         = db.IntegerProperty()
    size        = db.IntegerProperty()

    
    
    
def is_prime(n):
  if n % 2 == 0:
    return False
  for i in range(3, sqrt(n) + 1):
    if n % i == 0:
      return False
  return True
  
def next_prime(n):
  while True:
    n += 1
    if is_prime(n) == True:
      break

    
class CreateJobs(webapp.RequestHandler):
  def post(self):
    bulk = self.request.get("bulk").split("*")
    s = bulk[0].split(",")
    if len(Jobs.gql("WHERE big = :big AND sub = :sub AND start = :start AND count = :count", big = int(s[4]), sub = int(s[2]), start = int(s[0]), count = int(s[1])).fetch(1)) == 0:
      for i in bulk:
        s = i.split(",")
        job = Jobs()
        job.big = int(s[4])
        job.sub = int(s[2])
        job.size = int(s[3])
        job.start = int(s[0])
        job.count = int(s[1])
        job.put()
        self.response.out.write(i+"<br>")
    else:
      self.response.out.write("Fail!")
    self.response.out.write("Done!")
    
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
          block.size = completed.size
          block.put()
          #do stuff
          #sum things up
    result = Jobs.gql("WHERE value = :1 ORDER BY big ASC, assigned ASC, sub ASC", None).fetch(1)
    if len(result) > 0:
      res = result[0]
      result[0].assigned = datetime.datetime.now()
      result[0].put()
      self.response.out.write(self.request.get("cb") + "(" +str(res.key().id()) + "," + str(res.big) + "," + str(res.start) + "," + str(res.count) + ")")
    else:
      self.response.out.write("/*sumethin bwoke*/")

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
