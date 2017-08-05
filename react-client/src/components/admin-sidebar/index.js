import React, { Component } from 'react';
import './AdminSidebar.css';
import { NavLink as Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { toggleNavBar } from '../../actions';

class AdminSidebar extends Component {
  render() {
    let lessons = this.props.lessons.map((lesson) => (
      <li><Link to="/admin/editContent/{lesson._id}">{lesson.title}</Link></li>
    ))
    return (
      <div className="col-sm-3 col-md-2 sidebar">
        <ul className="nav nav-sidebar">
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/logger">Logger</Link></li>
          <li><Link to="/admin/allQuestions">All Questions</Link></li>
          <li><Link to="/admin">New Lesson</Link></li>
          <li><span className="topics-to-edit">Lessons</span></li>
          {lessons}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    lessons: state.lessons
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onToggleClick: () => {
      dispatch(toggleNavBar())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminSidebar);
