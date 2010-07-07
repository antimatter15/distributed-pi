#experimental faster system with no wsgi dependencies.

import os

#import logging
from google.appengine.ext import db
#from google.appengine.api import memcache

print 'Content-Type: text/javascript'
print ''
#http://atomized.org/2008/06/parsing-url-query-parameters-in-python/
params = dict([part.split('=') for part in str(os.environ['QUERY_STRING']).split('&')])

class Jobs(db.Model):
   #id          = db.StringProperty() //not necessary as google does this for us
    big         = db.IntegerProperty() #the big job ID
    #sub         = db.IntegerProperty() #the sub job ID
    start       = db.IntegerProperty() #the prime index to start on
    count       = db.IntegerProperty() #the prime index to stop on
    assigned    = db.DateTimeProperty() #the date assigned
    value       = db.FloatProperty() #the end value

if 'c' not in params:
  callback = 'DistPiCalc'
else:
  callback = params['c']


def clientlog(text):
  if 'dg' in params and params['dg'] == "t":
    from google.appengine.api import quota 
    print callback + ".info(" + text + ", " + str(quota.get_request_cpu_usage()) + ");"

clientlog("'start request'")

if params["d"] not in ["i","init", None, ""]:
  for datapart in params["d"].split(","):
    if datapart is not "":
      datasplit = datapart.split(":")
      if len(datasplit) == 2:
        jobid = datasplit[0]
        data = datasplit[1]
        completed = Jobs.get_by_id(int(jobid))
        if completed is not None and completed.value is None:
          completed.value = float(data)
          completed.put()
  clientlog("'after adding completed'")
if params["n"] not in ["", None, "0"]:
  num = int(params["n"])
else:
  num = 3
#now for the job assigning
jobs = Jobs.gql("WHERE value = :1 ORDER BY assigned ASC", None).fetch(num)
jobout = []
import datetime
now = datetime.datetime.now()
for result in jobs:
  result.assigned = now
  result.put()
  jobout.append("[" +str(result.key().id()) + "," + str(result.big) + "," + str(result.start) + "," + str(result.count) + "]")


if len(jobs) > 0:
  print (callback + ".addbulk([" + ",".join(jobout) + "]);")
  clientlog("'assigned jobs'")
else:
  #this happens when it is all done
  execfile("compute.py")
  sum_jobs()
  clientlog("'did housekeeping'")
  compute_jobs()
  print ("setTimeout(function(){" + callback + ".send('i')}, 500);")
  clientlog("'computed new jobs'")

  
