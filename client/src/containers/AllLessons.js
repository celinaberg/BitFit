// @flow

import type { Question, QuestionState, Lesson, State } from "../types";
import type { Dispatch } from "../actions/types";

import React, { Component } from "react";
import { Col, Button } from "reactstrap";
import { connect } from "react-redux";
import { fetchQuestions, saveQuestion, deleteQuestion, saveLesson, deleteLesson } from "../actions";
import EditLessonComponent from "../components/EditLessonComponent";

class AllLessons extends Component {
  props: {
    questions: QuestionState,
    lessons: Array<Lesson>,
    fetchQuestions: () => void,
    saveQuestion: Question => void,
    deleteQuestion: string => void,
    saveLesson: Question => void,
    deleteLesson: string => void
  };

  onSaveLessonClick = (lesson: Lesson): void => {
    this.props.saveLesson(lesson);
  };

  onDeleteLessonClick = (id: string): void => {
    this.props.deleteLesson(id);
    window.location.reload();
  };

  onSaveQuestionClick = (question: Question): void => {
    this.props.saveQuestion(question);
  };

  onDeleteQuestionClick = (id: string): void => {
    this.props.deleteQuestion(id);
    window.location.reload();
  };

  onExportAllLessonsAsJSONClick = (): void => {
    let tempElement = document.createElement("a");
    let lessons = this.props.lessons;
    let lessonsBlobFile = new Blob([JSON.stringify(lessons)], {type: 'text/plain'});
    tempElement.href = URL.createObjectURL(lessonsBlobFile);
    tempElement.download = `AllLessonsJSON.txt`;
    tempElement.click();
  };

  UNSAFE_componentWillMount() {
    if (!this.props.questions.fetched) {
      this.props.fetchQuestions();
    }
  }

  render() {
    let lessons = this.props.lessons.map(lesson => {
      let lessonQuestions;
      if (!this.props.questions.fetched) {
        lessonQuestions = [];
      } else {
        lessonQuestions = this.props.questions.questions.filter(
          question => question.lesson === lesson.id
        );
      }
      return (<EditLessonComponent
                key={lesson.id}
                id={lesson.id}
                title={lesson.title}
                background={lesson.background}
                saveLesson={this.onSaveLessonClick}
                deleteLesson={this.onDeleteLessonClick}
                allLessons={this.props.lessons}
                lessonQuestions={lessonQuestions} />);
    });
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">All Lessons</h2>
        <Button style={{marginBottom: "10px"}}
                onClick={this.onExportAllLessonsAsJSONClick}>
          Export all Lessons as JSON
        </Button>
        {lessons}
      </Col>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    questions: state.questions,
    lessons: state.lessons.lessons
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchQuestions: () => {
      dispatch(fetchQuestions());
    },
    saveQuestion: (question: Question) => {
      dispatch(saveQuestion(question));
    },
    deleteQuestion: (id: string) => {
      dispatch(deleteQuestion(id));
    },
    saveLesson: (lesson: Lesson) => {
      dispatch(saveLesson(lesson));
    },
    deleteLesson: (id: string) => {
      dispatch(deleteLesson(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllLessons);
