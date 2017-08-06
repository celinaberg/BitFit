import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchLessons } from '../../actions';
import LessonSidebarItem from '../lesson-sidebar-item';

class LessonSidebar extends Component {
  componentWillMount() {
    if(!this.props.lessons.fetched) {
      this.props.fetchLessons();
    }
  }

  render() {
    if(this.props.lessons.fetching) {
      return (<Progress animated color="muted" value="100"/>);
    } else {
      let lessons = this.props.lessons.lessons.map((lesson) => {
        return <LessonSidebarItem key={lesson._id} id={lesson._id} title={lesson.title} admin={this.props.admin}/>
      });
      return (<div>{lessons}</div>)
    }
  }
}

LessonSidebar.propTypes = {
  admin: PropTypes.bool
};

LessonSidebar.defaultProps = {
  admin: false
};

const mapStateToProps = state => {
  return {
    lessons: state.lessons
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchLessons : () => {
      dispatch(fetchLessons())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonSidebar);
