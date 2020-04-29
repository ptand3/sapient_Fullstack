const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const cors = require('cors');

//connect to mlab database
mongoose.connect('mongodb+srv://sapient:sapient_123@cluster0-gjqd7.mongodb.net/test?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

mongoose.connection.once('open', ()=>{
  console.log('Mongoose is connected');
});

const app = express();
app.use(cors());


app.use('/graphql', graphqlHTTP({ //middleware
  schema ,
  graphiql :true  //graphql Client
}));

app.listen('5000', ()=>{
   console.log('Listening for graphQl requests on port 5000');
});
