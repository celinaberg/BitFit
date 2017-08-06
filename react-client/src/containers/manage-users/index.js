import React, { Component } from 'react';
import { Col, ListGroup, ListGroupItem, Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchUsers, deleteUser } from '../../actions';
import { Button } from 'reactstrap';
import FaTrash from 'react-icons/lib/fa/trash';

class ManageUsers extends Component {
  componentWillMount() {
    if(!this.props.users.fetched) {
      this.props.fetchUsers();
    }
  }

  onDeleteClick = (event) => {
    this.props.deleteUser(event.currentTarget.id);
  };

  render() {
    let users;
    if(this.props.users.fetching) {
      users = (<Progress animated color="muted" value="100"/>);
    } else {
      users = this.props.users.users.map((user) => {
        return (
          <ListGroupItem key={user._id}>
            <div><strong>{user.displayName}</strong></div>
            <div>
              <span className="text-muted">{user.firstName} {user.lastName}</span>
              <span>&nbsp;</span>
              <span className="text-muted">CWL: {user.uid}</span>
              <span>&nbsp;</span>
              <span className="text-muted">Student #: {user.studentNumber}</span>
              <span>&nbsp;</span>
              <span className="text-muted">Role: {user.role}</span>
              <span>&nbsp;</span>
              <span className="text-muted">Account ID: {user._id}</span>
              <Button color="danger" id={user._id} onClick={this.onDeleteClick}><FaTrash/></Button>
            </div>
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
    },
    deleteUser : (id) => {
      dispatch(deleteUser(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
