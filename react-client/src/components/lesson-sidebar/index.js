import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavItem, NavLink, Progress } from 'reactstrap';
import { NavLink as Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchLessons } from '../../actions';

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
      console.log("bool", this.props.admin);
      let lessons = this.props.lessons.lessons.map((lesson) => {
        let url = "/lessons/" + lesson._id;
        if (this.props.admin) {
          url = "/admin/lessons/" + lesson._id;
        }

        return <NavItem key={lesson._id}><NavLink tag={Link} to={url}>{lesson.title}</NavLink></NavItem>
      });
      return (<div>{lessons}</div>)
    }
  }
}

LessonSidebar.propTypes = {
  admin: PropTypes.bool
}

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
