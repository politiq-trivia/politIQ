import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    render() {
        return (
            <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', overflow: 'auto' }}>
                <TextField 
                    id="outlined-multiline-flexible"
                    multiline
                    rows="3"
                    placeholder={`Leave a Comment for ${this.props.userName}`}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                ></TextField>
                <Button color="primary" variant="contained" type="submit" style={{ float: 'left' }}>Post</Button>
            </div>
        )
    }
}

export default CommentForm;