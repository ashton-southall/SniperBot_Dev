var faunadb = require('faunadb'),
  q = faunadb.query
  

var DBclient = new faunadb.Client({ secret: 'fnAD0jCjtVACCPrjyzjq5XryKsfgg638ZgrRRjPp' })
// change secret for security reasons 


// FaunaDB query
DBclient.query(
  // Create query
    q.Create(
      // create new collection called 'test'
      q.Collection('test'),
      // Insert following data in created collection
      { data: { testField: 'testValue' } }
    )
  )
  
  