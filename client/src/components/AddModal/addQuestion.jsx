import React, { Component } from "react";
import { graphql } from "react-apollo";
import { flowRight as compose } from 'lodash';
import { addQuestionMutation, getQuestionsQueryUsingToken } from "../../queries/queries";
import "./addQuestion.styles.scss";


// ({ handleClose, showModal, children, item })
class AddQuestionModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            question: '',
            answer: '',
            priority: '',
            category: '',
        }
    }

    //adding the updated state values to the query variables
    submitForm(e) {
        console.log("submitted");
        e.preventDefault();
        const token = localStorage.getItem("token")
        this.props.addQuestionMutation({
            variables: {
                question: this.state.question,
                answer: this.state.answer,
                priority: this.state.priority,
                category: this.state.category
            },
            refetchQueries: [{
                query: getQuestionsQueryUsingToken,
                // We need to send token here as well since this is triggered after the mutation
                variables: { token }
            }]
        });
    }

    render() {
        const showHideclassName = this.props.showAddModal ? "modal display-block" : " modal display-none";
        return (
            <div className={showHideclassName} >
                <div className="modal-main">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">Add Question</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="ques-answer">
                                <p className="title">Question</p>
                                <textarea rows="4" cols="50" name="question" value={this.state.question}
                                    onChange={(e) => this.setState({ question: e.target.value })} />
                                <p className="title">Answer</p>
                                <textarea rows="4" cols="50" name="answer" onChange={(e) => this.setState({ answer: e.target.value })} />
                            </div>
                            <div className="priority">
                                <label> Priority </label>
                                <select className="dropdown" onChange={(e) => this.setState({ priority: e.target.value })}>
                                    <option>Optional</option>
                                    <option>Mandatory</option>
                                </select>
                            </div>
                            <div className="category">
                                <label> Category </label>
                                <select className="dropdown" onChange={(e) => this.setState({ category: e.target.value })}>
                                    <option>Development</option>
                                    <option>Functional</option>
                                    <option>Acessability</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.submitForm.bind(this)}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}



export default compose(
    graphql(addQuestionMutation, { name: "addQuestionMutation" })
)(AddQuestionModal);
