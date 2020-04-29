import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login/login";
import Projects from "./components/Projects/projects";
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./App.css";



// apollo client setup
const client = new ApolloClient({ //apollo client instance
  uri: 'http://localhost:5000/graphql',
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="main">
            <Switch>
              <Route exact path="/"><Login client={client} /></Route>
              <Route path="/projects"><Projects client={client} /></Route>
            </Switch>
          </div>
        </Router>
      </ApolloProvider>
    )
  }

}
export default App;
