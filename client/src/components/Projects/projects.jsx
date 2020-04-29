import React, { Component } from "react";
import { graphql } from "react-apollo";
import { flowRight as compose } from 'lodash';
import { getProjectsQuery, projectStatusMutation } from "../../queries/queries";
import QuestionList from "../QuestionList/questionList";
import { Link } from "react-router-dom";
import "./projects.styles.scss";


class Projects extends Component {

    constructor(props) {
        super(props)
        this.container = React.createRef();
        this.state = {
            name: '',
            status: '',
            open: false,
        }
    }

    showProjectListComponent() {
        const data = this.props.getProjectsQuery;
        if (data.loading) {
            return <div>Loading Projects...</div>
        }
        return data.projects.map(project => {
            return (
                <button className="btn btn-primary btn-block" key={project.id} onClick={(e) => { this.setState({ ...this.state, project }) }} >
                    <Link to={`/projects/${project.id}`}>{project.name}</Link>
                </button>
            )
        })

    }
    handleClick = () => {
        alert("Click to change the status");
        this.setState(state => {
            return {
                open: !state.open,
            };
        });
    };

    handleClickOutside = (event) => {
        if (this.container.current && !this.container.current.contains(event.target)) {
            this.setState({
                open: false,
            });
        }
        if (this.state.project) {
            this.props.projectStatusMutation({
                variables: {
                    id: this.state.project.id,
                    name: this.state.project.name,
                    status: this.state.status
                },
                refetchQueries: [{
                    query: getProjectsQuery,
                }]
            });
        }
    };
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }


    render() {
        return (
            <div className="projects">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <span className="container" ref={this.container}>
                        <button type="button" className="button" onClick={this.handleClick}>☰</button>
                        {this.state.open && (
                            <span className="status dropdown">
                                <select className="dropdown" onChange={(e) => this.setState({ status: e.target.value })} >
                                    <option>Approved</option>
                                    <option>In Review</option>
                                </select>
                            </span>
                        )}
                    </span>
                    <span className="navbar-collapse navbarText">
                        {this.showProjectListComponent()}
                    </span>
                </nav>
                <span className="name-status">
                    {(this.state.project) && (<span className="project-heading">{this.state.project.name}</span>)}
                    {(this.state.project) && (<span className="project-status">Status : {this.state.status}</span>)}
                </span>
                <QuestionList client={this.props.client} />
            </div>
        )
    }

}

export default compose(
    graphql(projectStatusMutation, { name: "projectStatusMutation" }),
    graphql(getProjectsQuery, { name: "getProjectsQuery" })
)(Projects);