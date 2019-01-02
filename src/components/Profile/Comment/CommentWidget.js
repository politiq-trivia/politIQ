import React, { Component } from 'react';

import { db } from '../../../firebase';

import Comment from './Comment';
import CommentForm from './CommentForm';
import AuthUserContext from '../../Auth/AuthUserContext'
import DeleteCommentModal from './DeleteCommentModal'; 

class CommentWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateArray: [],
            showDeleteModal: false,
        }
    }

    componentDidMount = () => {
        this.getComments(this.props.profileID)
    }

    componentWillReceiveProps(nextProps) {
        this.getComments(this.props.profileID)
    }

    getComments = (uid) => {
        db.getComments(uid)
            .then(response => {
                if (response.val() === null) {
                    this.setState({
                        dateArray: [],
                        commentsObj: {},
                    })
                    return;
                } else {
                    const commentsObj = response.val()
                    const dateArray = Object.keys(commentsObj)
                    this.setState({
                        dateArray,
                        commentsObj,
                    })
                }
            })
    }

    deleteComment = async (profileUID, date) => {
        await db.deleteComment(profileUID, date)
        this.getComments(profileUID)
    }

    toggleDeleteModal = (date) => {
        if (date) {
            this.setState({
                showDeleteModal: !this.state.showDeleteModal,
                selectedCommentDate: date,
            })
        } else {
            this.setState({
                showDeleteModal: !this.state.showDeleteModal,
                selectedCommentDate: ""
            })
        }
    }

    render() {
        let comments;
        if (this.state.dateArray !== []) {
            comments = this.state.dateArray.map((date, i) => {
                return (
                    <AuthUserContext.Consumer key={i}>
                        {authUser => 
                            <Comment data={this.state.commentsObj[date]}  uid={authUser.uid} toggleDeleteModal={this.toggleDeleteModal} isAdmin={this.props.isAdmin}/>
                        }
                    </AuthUserContext.Consumer>
                )
            })
        } else {
            comments = <p>Loading...</p>
            
        }
        return(
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        { this.state.showDeleteModal 
                            ? <DeleteCommentModal toggleDeleteModal={this.toggleDeleteModal} uid={this.props.profileID} date={this.state.selectedCommentDate} deleteComment={this.deleteComment} getComments={this.getComments}/>
                            : null
                        }
                        <CommentForm userName={this.props.userName} uid={authUser.uid} profileID={this.props.profileID} getComments={this.getComments} authUserName={this.props.authUserName}/>
                        {comments}
                    </div>
                    )
                }
            </AuthUserContext.Consumer>
        )
    }
}

export default CommentWidget;