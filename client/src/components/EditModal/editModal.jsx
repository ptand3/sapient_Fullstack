import React, { Component } from "react";
import "./editor.styles.scss";
import { graphql } from "react-apollo";
import { flowRight as compose } from 'lodash';
import { editQuestionMutation, getQuestionsQueryUsingToken } from "../../queries/queries";


// ({ handleClose, showModal, children, item })
class EditModal extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            selectedQuestion: {} 
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.item === this.props.item) {
            return
        }
        this.setState({
            selectedQuestion: this.props.item
        });
    }

    //To fix
    submitForm(e) {
        console.log("submitted");
        e.preventDefault();
        const token = localStorage.getItem("token");
        const { question, answer, id } = this.state.selectedQuestion;
        this.props.editQuestionMutation({
            variables: { id, question, answer },
            refetchQueries: [{
                query: getQuestionsQueryUsingToken,
                variables: { token }
            }]
        });
    }

    render() {
        const showHideClassName = this.props.showEditModal ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName} >
                <div className="modal-main">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">Edit Question</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.handleClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="ques-answer">
                                <p className="title">Question</p>
                                <textarea rows="4" cols="50" name="question" value={this.state.selectedQuestion.question}
                                    onChange={(e) => this.setState({ selectedQuestion: {...this.state.selectedQuestion, question: e.target.value}})} />
                                <p className="title">Answer</p>
                                <textarea rows="4" cols="50" name="answer"
                                    value={this.state.selectedQuestion.answer} onChange={(e) => this.setState({ selectedQuestion: {...this.state.selectedQuestion, answer: e.target.value }})} />
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
    graphql(editQuestionMutation, { name: "editQuestionMutation" }))(EditModal);

