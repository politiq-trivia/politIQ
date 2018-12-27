import React, { Component } from 'react';

import { db } from '../../../firebase';

import Comment from './Comment';
import CommentForm from './CommentForm';
import AuthUserContext from '../../Auth/AuthUserContext'

class CommentWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateArray: [],
            posts: [{
                text: "Hello World",
                user: "Hanna",
                userAvatar: "",
                dateCreated: '2018-12-26',
                uid: '',
            }, {
                text: "this is my second comment",
                user: "not Hanna",
                userAvatar: "",
                dateCreated: '2018-12-24',
                uid: '',
            }
            ]
        }
    }

    componentDidMount = () => {
        this.getComments(this.props.profileID)
    }

    getComments = (uid) => {
        db.getComments(uid)
            .then(response => {
                const commentsObj = response.val()

                const dateArray = Object.keys(commentsObj)
                this.setState({
                    dateArray,
                    commentsObj,
                })
            })
    }

    render() {
        let comments;
        if (this.state.dateArray !== []) {
            comments = this.state.dateArray.map((date, i) => {
                return (
                    <Comment data={this.state.commentsObj[date]} key={i} />
                )
            })
        } else {
            comments = <p>Loading...</p>
            
        }
        return(
            <AuthUserContext.Consumer>
                {authUser => 
                    <div>
                        <CommentForm userName={this.props.userName} uid={authUser.uid} profileID={this.props.profileID} getComments={this.getComments}/>
                        {comments}
                    </div>
 
                }
            </AuthUserContext.Consumer>
        )
    }
}

export default CommentWidget;