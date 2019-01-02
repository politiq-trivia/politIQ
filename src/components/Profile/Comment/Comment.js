import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../../../firebase';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Close from '@material-ui/icons/Close';

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

    handleDeleteClick = () => {
        // trigger the delete comment modal
        console.log('delete clicked')
        this.props.toggleDeleteModal(this.props.data.date)
    }

    render() {
        const { user, text, date, uid } = this.props.data
        const shortDate = date.slice(0, 10)
        const userInitial = user[0]

        console.log(this.props.uid, 'authUser uid')
        console.log(this.props.data.uid, 'DATA.UID')
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
                { this.props.uid === this.props.data.uid ? <Close onClick={this.handleDeleteClick} style={{ float: 'right', marginTop: '1vh', marginLeft: '1vh' }}/> : null }
                <p style={{ float: 'right', fontSize: '12px', width: 'auto'}}>{shortDate}</p>
    
                <p>{text}</p>
            </Paper>
        )
    }
}

export default Comment;