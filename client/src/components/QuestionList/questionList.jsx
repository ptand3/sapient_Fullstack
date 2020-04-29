
import React, { Component } from "react";
import {getQuestionsQueryUsingToken } from "../../queries/queries";
import { graphql } from "react-apollo";
import EditModal from "../EditModal/editModal"
import AddQuestionModal from "../AddModal/addQuestion";
import './questionlist.styles.scss';

class QuestionList extends Component {
    constructor() {
        super()
        this.state = {
            showEditModal: false,
            showAddModal: false
        }
    }

    displayQuestions() {
        const data = this.props.data;
        if (data.loading) {
            return <div>Loading Questions...</div>
        }
        return data.questions.map(item => {
            return (
                <div key={item.id} className="question-item">
                    <p className="question">Question :{item.question}</p>
                    <p className="answer"><strong>Answer :</strong>{item.answer}</p>
                    <p className="category"><strong>Category :</strong>{item.category}</p>
                    <p className="priority"><strong>{item.priority}</strong></p>
                    <button type="button" disabled={item.editingAllowed !== "true"} className="btn btn-primary btn-block" onClick={() => this.showEditModal(item)}>Edit Question</button>
                </div>
            )
        })
    }

    showEditModal = (question) => {
        console.log("open");
        this.setState({ showEditModal: true, question });
    }
    showAddModal = () => {
        console.log("open add modal");
        this.setState({ showAddModal: true });
    }

    hideModal = () => {
        console.log("closed")
        this.setState({ showAddModal: false, showEditModal: false });
    }
    render() {
        return (
            <div className="question-answer">
                {this.displayQuestions()}
                <EditModal item={this.state.question} showEditModal={this.state.showEditModal} handleClose={this.hideModal} />
                <hr />
                <button type="button" className="btn btn-primary btn-block add-button" onClick={this.showAddModal}>Add Question</button>
                <AddQuestionModal showAddModal={this.state.showAddModal} handleClose={this.hideModal} />
            </div>

        )
    }
}

export default graphql(getQuestionsQueryUsingToken, {
    options: (props) => {
        const token = localStorage.getItem('token');
        return {
            variables: { token },
        }
    }
})(QuestionList);
