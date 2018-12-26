import React from 'react';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';

const Comment = (props) => {
    const { user, text, userAvatar, dateCreated } = props.data

    const userInitial = user[0]
    return (
        <Paper style={{ width: '78%', marginLeft: 'auto', marginRight: 'auto', textAlign: 'left', padding: '2vh', marginTop: '4vh' }}>
            <Avatar style={{ display: 'inline-flex', marginRight: '2vw' }}>{userInitial}</Avatar>
            <p style={{ display: 'inline', fontWeight: 'bold'}}>{user}:</p>
            <p style={{ float: 'right', fontSize: '12px', width: 'auto'}}>{dateCreated}</p>

            <p>{text}</p>
        </Paper>
    )
}

export default Comment;