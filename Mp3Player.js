import React from 'react';
const Player = ({ url,name }) => {
    if (!url) {
        return null;
    }
    return (
                <div className="plyr" style={{margin:'10px 0 20px 0'}}>
                    <span  style={{padding:'10px 0', fontWeight:'normal'}}>Audio Feedback By {name}</span>
                    <audio src={`https://langappnew.s3.amazonaws.com/reviews/${url}`} controls="controls" />

                </div>
    )
}
export default Player;