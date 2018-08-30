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
    saveLesson: (id: string, title: string, background: string, lessonIndex: number) => void,
    deleteLesson: string => void
  };

  onSaveLessonClick = (id: string, title: string, background: string, lessonIndex: number): void => {
    this.props.saveLesson(id, title, background, lessonIndex);
    // window.location.reload();
  };

  onDeleteLessonClick = (id: string): void => {
    this.props.deleteLesson(id);
  };

  onSaveQuestionClick = (question: Question): void => {
    this.props.saveQuestion(question);
  };

  onDeleteQuestionClick = (id: string): void => {
    this.props.deleteQuestion(id);
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
    const lessonsSortedByLessonIndex = this.props.lessons.sort((lessonOne, lessonTwo) => {
      const i1 = Number(lessonOne.lessonIndex);
      const i2 = Number(lessonTwo.lessonIndex);
      if (!i1) return +1;
      if (!i2) return -1;
      return i1 - i2;
    });
    let lessons = lessonsSortedByLessonIndex.map(lesson => {
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
                lessonIndex={lesson.lessonIndex}
                saveLesson={this.onSaveLessonClick}
                deleteLesson={this.onDeleteLessonClick}
                allLessons={this.props.lessons}
                lessonQuestions={lessonQuestions}
                saveQuestion={this.onSaveQuestionClick}
                deleteQuestion={this.onDeleteQuestionClick} />);
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
    saveLesson: (id: string, title: string, background: string, lessonIndex: number) => {
      dispatch(saveLesson(id, title, background, lessonIndex));
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
