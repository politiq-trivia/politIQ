import React, { Component } from 'react';

import Comment from './Comment';
import CommentForm from './CommentForm';

class CommentWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
    render() {
        return(
            <div>
                <CommentForm userName={this.props.userName}/>
                { this.state.posts.map((info, i) => {
                    return (
                        <Comment data={info} key={i} />
                    )
                })}
            </div>
        )
    }
}

export default CommentWidget;