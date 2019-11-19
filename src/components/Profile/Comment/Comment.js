import React, { Component } from "react";
import { Link } from "react-router-dom";
import { storage } from "../../../firebase";

import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Close from "@material-ui/icons/Close";

import "./comment.css";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getAvatarURL();
  }

  getAvatarURL = async () => {
    const imgName = this.props.data.uid + ".jpg";
    await storage.imageRef
      .child(imgName)
      .getDownloadURL()
      .then(url => {
        this.setState({
          avatarURL: url
        });
      })
      .catch(() => {
        this.setState({
          avatarURL: ""
        });
      });
  };

  handleDeleteClick = () => {
    this.props.toggleDeleteModal(this.props.data.date);
  };
  render() {
    console.log(this.props.data);
    const { user, text, date, uid } = this.props.data;
    const shortDate = date.slice(0, 10);
    const userInitial = user[0];

    return (
      <Paper
        style={{
          width: "78%",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "left",
          padding: "2vh",
          marginTop: "4vh"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <Link to={uid} style={{ textDecoration: "none" }}>
              {this.state.avatarURL === "" ? (
                <Avatar style={{ display: "inline-flex", marginRight: "2vw" }}>
                  {userInitial}
                </Avatar>
              ) : (
                <Avatar
                  style={{ display: "inline-flex", marginRight: "2vw" }}
                  src={this.state.avatarURL}
                ></Avatar>
              )}
            </Link>
            <Link to={uid} className="profile-link">
              <p style={{ display: "inline", fontWeight: "bold" }}>{user}:</p>
            </Link>
          </div>
          <div>
            {this.props.uid === this.props.data.uid || this.props.isAdmin ? (
              <Close
                onClick={this.handleDeleteClick}
                style={{ float: "right", marginTop: "1vh", marginLeft: "1vh" }}
              />
            ) : null}
            <p style={{ float: "right", fontSize: "12px", width: "auto" }}>
              {shortDate}
            </p>
          </div>
        </div>

        <p>{text}</p>
      </Paper>
    );
  }
}

export default Comment;
