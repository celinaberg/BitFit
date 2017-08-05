import React, { Component } from 'react';
import { Col, ListGroup, ListGroupItem, Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchUsers } from '../../actions';

class ManageUsers extends Component {
  componentWillMount() {
    if(!this.props.users.fetched) {
      this.props.fetchUsers();
    }
  }


  render() {
    let users;
    if(this.props.users.fetching) {
      users = (<Progress animated color="muted" value="100"/>);
    } else {
      users = this.props.users.users.map((user) => {
        return (
          <ListGroupItem key={user._id}>
            <strong>{user.displayName}</strong><br/>
            <span class="text-muted">{user.firstName} {user.lastName}</span>
            <span>&nbsp;</span>
            <span class="text-muted">CWL: {user.uid}</span>
            <span>&nbsp;</span>
            <span class="text-muted">Student #: {user.studentNumber}</span>
            <span>&nbsp;</span>
            <span>&nbsp;</span>
            <span class="text-muted">Role: {user.role}</span>
            <span>&nbsp;</span>
            <span class="text-muted">Account ID: {user._id}</span>
            <a class="trash"><span class="fa fa-trash pull-right"></span></a>
          </ListGroupItem>
        )
      })
    }
    return (
      <Col sm="9" md="10">
        <h2 className="page-header">Users</h2>

        <ListGroup>
          {users}
        </ListGroup>
      </Col>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.users
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUsers : () => {
      dispatch(fetchUsers())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
