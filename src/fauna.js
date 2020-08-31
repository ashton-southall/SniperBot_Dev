var faunadb = require('faunadb'),
  q = faunadb.query
  

var DBclient = new faunadb.Client({ secret: 'fnAD0jCjtVACCPrjyzjq5XryKsfgg638ZgrRRjPp' })



DBclient.query(
    q.Create(
      q.Collection('test'),
      { data: { testField: 'testValue' } }
    )
  )
  
  