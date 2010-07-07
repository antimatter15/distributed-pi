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
    #sub         = db.IntegerProperty() #the sub job ID
    start       = db.IntegerProperty() #the prime index to start on
    count       = db.IntegerProperty() #the prime index to stop on
    assigned    = db.DateTimeProperty() #the date assigned
    value       = db.FloatProperty() #the end value
    
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

class PiHandler(webapp.RequestHandler):
  def get(self):
    self.response.out.write("3.")
    data = memcache.get("latest_pi")
    if data is None:
      data = {'start': -1, 'value': ''}
    for group in DigitGroup.gql("WHERE start > :start ORDER BY start ASC", start = data['start']):
      data['value'] += group.value
      data['start'] = group.start
    memcache.set("latest_pi", data)
    self.response.out.write(data['value'])

class Clean(webapp.RequestHandler):
  def get(self):
    for dl in Jobs.gql(""):
      dl.delete()
    for dl in GenState.gql(""):
      dl.delete()
    for dl in DigitGroup.gql(""):
      dl.delete()
    memcache.flush_all()

class FlushMemcache(webapp.RequestHandler):
  def get(self):
    memcache.flush_all()
    
def main():
  application = webapp.WSGIApplication([
                                        ('/pi', PiHandler),
                                        ('/empty', Clean),
                                        ('/memflush', FlushMemcache)
                                        ],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
