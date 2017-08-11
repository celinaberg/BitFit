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

  componentWillMount() {
    if (!this.props.lessons.fetched) {
      this.props.fetchLessons();
    }
  }

  render() {
    if (this.props.lessons.fetching) {
      return <Progress animated color="muted" value="100" />;
    } else {
      let lessons = this.props.lessons.lessons.map(lesson => {
        return (
          <LessonSidebarItem
            key={lesson.id}
            id={lesson.id}
            title={lesson.title}
            admin={this.props.admin}
          />
        );
      });
      return (
        <div>
          {lessons}
        </div>
      );
    }
  }
}

const mapStateToProps = (state:State) => {
  return {
    lessons: state.lessons
  };
};

const mapDispatchToProps = (dispatch:Dispatch) => {
  return {
    fetchLessons: () => {
      dispatch(fetchLessons());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LessonSidebar);
