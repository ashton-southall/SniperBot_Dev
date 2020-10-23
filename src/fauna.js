var faunadb = require('faunadb'),
  q = faunadb.query
  

var DBclient = new faunadb.Client({ secret: 'fnAD0jCjtVACCPrjyzjq5XryKsfgg638ZgrRRjPp' })
// change secret for security reasons 

DBclient.query(
  q.Get(q.Ref(q.Collection('Twitch'), '280154026548396552')))
  .then((ret) => {const users = ret;console.log(users);});