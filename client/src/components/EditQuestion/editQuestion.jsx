import React, { Component } from "react";
import "./editor.styles.scss";


// ({ handleClose, showModal, children, item })
class EditQuestionModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            question: '',
            answer: ''
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.item == this.props.item) {
            return
        }
        this.setState({
            question: this.props.item.question,
            answer: this.props.item.answer
        });
    }

    onQuestionChange(event) {
        this.setState({
            question: event.target.value
        });
        console.log(this.state.question);
    }
    onAnswerChange(event) {
        this.setState({
            answer: event.target.value
        });
    }

    render() {
        const showHideClassName = this.props.showModal ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName} >
                <section className="modal-main">
                    <div className="question-answer">
                        <p>Question</p>
                        <textarea rows="8" cols="50" name="question" value={this.state.question}
                            onChange={this.onQuestionChange.bind(this)} />
                        <p>Answer</p>
                        <textarea rows="8" cols="50" name="answer"
                            value={this.state.answer} onChange={this.onAnswerChange.bind(this)}></textarea>
                    </div>

                    <button onClick={this.props.handleClose}>close</button>
                </section>
            </div>
        );
    };
}


export default EditQuestionModal;
