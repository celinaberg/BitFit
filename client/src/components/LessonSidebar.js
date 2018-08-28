// @flow

import type { Dispatch } from "../actions/types";
import type { State, LessonState } from "../types";

import React, { Component } from "react";
import { Progress } from "reactstrap";
import { connect } from "react-redux";
import { fetchLessons } from "../actions";
import LessonSidebarItem from "./LessonSidebarItem";

class LessonSidebar extends Component {
  props: {
    lessons: LessonState,
    admin: boolean,
    fetchLessons: () => void
  };

  static defaultProps = {
    admin: false
  };

  UNSAFE_componentWillMount() {
    if (!this.props.lessons.fetched) {
      this.props.fetchLessons();
    }
  }

  render() {
    if (this.props.lessons.fetching) {
      return <Progress animated color="muted" value="100" />;
    } else {
      const lessonsSortedByLessonIndex = this.props.lessons.lessons.sort((lessonOne, lessonTwo) => {
        const i1 = lessonOne.lessonIndex;
        const i2 = lessonTwo.lessonIndex;
        if (i1 === null) return +1;
        if (i2 === null) return -1;
        return i1 - i2;
      });
      let lessons = lessonsSortedByLessonIndex.map(lesson => {
        let lessonSidebarItemTitle = lesson.lessonIndex ?
          `${lesson.lessonIndex}: ${lesson.title}` :
          lesson.title;
        return (
          <LessonSidebarItem
            key={lesson.id}
            id={lesson.id}
            title={lessonSidebarItemTitle}
            admin={this.props.admin}
          />
        );
      });
      return <div>{lessons}</div>;
    }
  }
}

const mapStateToProps = (state: State) => {
  return {
    lessons: state.lessons
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchLessons: () => {
      dispatch(fetchLessons());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LessonSidebar);
