const express = require('express')
const cors = require('cors')
const Account = require('./routes/Account')
const Book = require('./routes/Book')
const bodyParser = require('body-parser')
const {graphqlHTTP} = require('express-graphql')
const {GraphQLSchema} = require('graphql')
const mutation = require('./GraphQLSchema/Mutation/CreateProduct')
const query = require('./GraphQLSchema/RootQuery')
const path = require('path')

const app = express()

// app.use(cors())
app.use(express.json({limit:'25mb'}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({limit:'25mb', extended: true }));

app.use('/', Book)
app.use('/account', Account)

const port = process.env.PORT || 5000


const schema = new GraphQLSchema({
    query:query,
    mutation:mutation
  })

app.use('/Graphql', graphqlHTTP({
    schema,
    graphiql:port
  }))
  
  app.use(express.static(path.join(__dirname, '../client/build')))
  app.use('/*', (req,res) => res.sendFile(path.join(__dirname, '../client/build/index.html')))
  

  // app.use('/*', (req,res) => res.send(homepage))

app.listen(5000,() => {
    console.log('Connected to backend')
})
