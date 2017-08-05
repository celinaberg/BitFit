import React, { Component } from 'react';
import './AdminSidebar.css';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchLessons } from '../../actions';

class AdminSidebar extends Component {
  componentWillMount() {
    this.props.fetchLessons();
  }

  render() {
    let lessons = this.props.lessons.map((lesson) => {
      let url = "/admin/lessons/" + lesson._id;
      return <NavItem key={lesson._id}><NavLink tag={Link} to={url}>{lesson.title}</NavLink></NavItem>
    })
    return (
      <div className="col-sm-3 col-md-2 sidebar">
        <Nav pills vertical>
          <NavItem>
            <NavLink tag={Link} to="/admin/users">Users</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/admin/logger">Logger</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/admin/questions">All Questions</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/admin/lessons/new">New Lesson</NavLink>
          </NavItem>
          <NavItem>
            Lessons
          </NavItem>
          {lessons}
        </Nav>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    lessons: state.lessons.lessons
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchLessons : () => {
      dispatch(fetchLessons())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminSidebar);
