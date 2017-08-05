import React, { Component } from 'react';
import './AdminSidebar.css';
import { Col, Nav, NavItem, NavLink, Progress } from 'reactstrap';
import { NavLink as Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchLessons } from '../../actions';

class AdminSidebar extends Component {
  componentWillMount() {
    if(!this.props.lessons.fetched) {
      this.props.fetchLessons();
    }
  }

  render() {
    let lessons;
    if(this.props.lessons.fetching) {
      lessons = (<Progress animated color="muted" value="100"/>);
    } else {
      lessons = this.props.lessons.lessons.map((lesson) => {
        let url = "/admin/lessons/" + lesson._id;
        return <NavItem key={lesson._id}><NavLink tag={Link} to={url}>{lesson.title}</NavLink></NavItem>
      })
    }
    return (
      <Col sm="3" md="2" className="sidebar">
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
      </Col>
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
    fetchLessons : () => {
      dispatch(fetchLessons())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminSidebar);
