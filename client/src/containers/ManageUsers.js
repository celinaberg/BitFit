// @flow

import type { Dispatch } from "../actions/types";
import type { UserState, State } from "../types";

import React, { Component } from "react";
import {
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Progress,
  Button
} from "reactstrap";
import { connect } from "react-redux";
import { fetchUsers, deleteUser } from "../actions";
import FaTrash from "react-icons/lib/fa/trash";

class ManageUsers extends Component {
  props: {
    users: UserState,
    fetchUsers: () => void,
    deleteUser: (id: string) => void
  };

  componentWillMount() {
    if (!this.props.users.fetched) {
      this.props.fetchUsers();
    }
  }

  onDeleteClick = event => {
    this.props.deleteUser(event.currentTarget.id);
    this.props.fetchUsers();
  };

  render() {
    let users;
    if (this.props.users.fetching) {
      users = <Progress animated color="muted" value="100" />;
    } else {
      users = this.props.users.users.map(user => {
        return (
          <ListGroupItem key={user.id}>
            <ListGroupItemHeading>
              {user.displayName}
              <Button color="danger" id={user.id} onClick={this.onDeleteClick}>
                <FaTrash />
              </Button>
            </ListGroupItemHeading>
            <ListGroupItemText>
              <span className="text-muted">
                {user.firstName} {user.lastName}
              </span>
              <span>&nbsp;</span>
              <span className="text-muted">
                CWL: {user.uid}
              </span>
              <span>&nbsp;</span>
              <span className="text-muted">
                Student #: {user.studentNumber}
              </span>
              <span>&nbsp;</span>
              <span className="text-muted">
                Role: {user.role}
              </span>
              <span>&nbsp;</span>
              <span className="text-muted">
                Account ID: {user.id}
              </span>
            </ListGroupItemText>
          </ListGroupItem>
        );
      });
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

const mapStateToProps = (state:State) => {
  return {
    users: state.users
  };
};

const mapDispatchToProps = (dispatch:Dispatch) => {
  return {
    fetchUsers: () => {
      dispatch(fetchUsers());
    },
    deleteUser: (id:string) => {
      dispatch(deleteUser(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
