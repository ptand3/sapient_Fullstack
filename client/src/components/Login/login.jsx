import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { loginUserQuery } from "../../queries/queries";
import { graphql } from "react-apollo";
import "./login.styles.scss";


/*
login ---> username, password ----> server ---> checks in database ---> 
*/

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            toProjects: false,
        }
        this.redirectToProjectPage = this.redirectToProjectPage.bind(this)

    }
    //adding the updated state values to the query variables
    submitForm(e) {
        e.preventDefault();
        const { client } = this.props;
        const data = this.props.data;
        console.log(data);
        client.query({
            query: loginUserQuery,
            variables: {
                username: this.state.username,
                password: this.state.password,
            }
        }).then(({ data }) => {
            return (this.redirectToProjectPage(data))
        });
    }
    redirectToProjectPage(data) {
        const { user } = data
        if (user === null) {
            alert("Unknown user")
            return
        }
        localStorage.setItem("token", user.token);
        this.setState({
            ...this.state, toProjects: true
        })
    }

    render() {
        if (this.state.toProjects) {
            return <Redirect to="/projects" />
        }
        return (
            <div className="form-wrapper">
                <form id="user" onSubmit={this.submitForm.bind(this)}>
                    <h3>Log In</h3>
                    <div className="form-group">
                        <label>User Name</label>
                        <input type="text" className="form-control" onChange={(e) => this.setState({ username: e.target.value })} required placeholder=" Enter Username" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" onChange={(e) => this.setState({ password: e.target.value })} required placeholder="Enter Password" />
                    </div>
                    <button className="btn btn-primary btn-block">Submit</button>
                </form>
            </div>

        )
    }
}

export default graphql(loginUserQuery)(Login);