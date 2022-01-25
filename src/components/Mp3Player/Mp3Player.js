import React from 'react';
import { Col } from 'react-bootstrap'
const Player = ({ url }) => {
    if (!url) {
        return null;
    }
    return (
        <Col sm={12} md={12}>
            <div className="plyr" style={{
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid #0007',
                boxShadow: '0px 0px 24px 0px #0003'
            }}>
                Audio Feedback
                <audio src={`https://langappnew.s3.amazonaws.com/reviews/${url}`} controls="controls" />

            </div>
        </Col>
    )
}
export default Player;