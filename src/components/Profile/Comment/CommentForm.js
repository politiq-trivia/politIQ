import React, { Component } from "react";
import { db } from "../../../firebase";
import moment from "moment";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ""
    };
  }

  handleInput = event => {
    const val = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: val
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const date = moment().format("YYYY-MM-DD hh:mm");
    const commentObj = {
      text: this.state.comment,
      user: this.props.authUserName,
      uid: this.props.uid,
      date: date
    };
    const profileID = this.props.profileID;
    db.addComment(profileID, commentObj);
    this.setState({
      comment: ""
    });
    this.props.getComments(profileID);
  };

  render() {
    return (
      <div
        style={{
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
          overflow: "auto"
        }}
      >
        <TextField
          id="outlined-multiline-flexible"
          multiline
          rows="3"
          placeholder={`Leave a Comment for ${this.props.userName}`}
          margin="normal"
          variant="outlined"
          fullWidth
          name="comment"
          onChange={this.handleInput}
          value={this.state.comment}
        ></TextField>
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleSubmit}
          style={{ float: "left" }}
        >
          Post
        </Button>
      </div>
    );
  }
}

export default CommentForm;
