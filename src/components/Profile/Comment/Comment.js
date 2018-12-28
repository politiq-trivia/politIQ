import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../../../firebase';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount(){
        this.getAvatarURL()
    }

    getAvatarURL = async () => {
        const imgName = this.props.data.uid + '.jpg';
        await storage.imageRef.child(imgName).getDownloadURL()
            .then(url => {
                this.setState({
                    avatarURL: url,
                }) 
            })
            .catch(() => {
                this.setState({
                    avatarURL: ""
                })
            })        
    }

    render() {
        const { user, text, userAvatar, date, uid } = this.props.data
        const shortDate = date.slice(0, 10)
        const userInitial = user[0]

        return (
            <Paper style={{ width: '78%', marginLeft: 'auto', marginRight: 'auto', textAlign: 'left', padding: '2vh', marginTop: '4vh' }}>
                <Link to={uid} style={{ textDecoration: 'none' }}>
                    {this.state.avatarURL === ""
                        ? <Avatar style={{ display: 'inline-flex', marginRight: '2vw' }}>{userInitial}</Avatar> 
                        : <Avatar style={{ display: 'inline-flex', marginRight: '2vw' }} src={this.state.avatarURL}></Avatar>
                    }
                </Link>
                <Link to={uid} style={{ textDecoration: 'none'}}>
                    <p style={{ display: 'inline', fontWeight: 'bold'}}>{user}:</p>
                </Link>
                <p style={{ float: 'right', fontSize: '12px', width: 'auto'}}>{shortDate}</p>
    
                <p>{text}</p>
            </Paper>
        )
    }
}

export default Comment;