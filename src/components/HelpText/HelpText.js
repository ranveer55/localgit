import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { Col, Row } from 'react-bootstrap';
import src from '../../assets/lamp.png';
import srcAlt from '../../assets/caution.png';
import './helpText.css'
const TitleBox = ({ title, subtitle = '', alt = false }) => {
    return (
        <div className="helptext-modal">
            <Row>
                <Col className="help-text-title-div">
                    <img src={alt ? srcAlt : src} className="helptext-modal-img" alt={title ? title : ''} />
                    <span className="helptext-modal-title">
                        {title ? title : ''}
                    </span>
                </Col>
            </Row>
            {subtitle && <Row>
                <Col className="help-text-subtitle-div">
                    <span className="helptext-modal-subtitle">
                        {subtitle ? subtitle : ''}
                    </span>
                </Col>
            </Row>}

        </div>
    )
}
const HelpText = ({ title, subtitle = '', children, altIcon = false, ...rest }) => {
    return (
        <>
            {title ?
                <Tooltip title={<TitleBox title={title} alt={altIcon} subtitle={subtitle} />} {...rest} classes={{ tooltip: 'helptext' }}>
                    <div>
                        {children ? children : ''}
                    </div>
                </Tooltip>
                :
                <>
                    {children ? children : ''}
                </>
            }
        </>
    );

}

export default HelpText;
