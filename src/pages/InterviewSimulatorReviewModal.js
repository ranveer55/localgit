
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
// import { useToasts } from 'react-toast-notifications';
// import { Spinner } from '../../../_components';
import ExternalRatingComponent from '../components/ExternalRatingComponent';
import RatingComponent from '../components/RatingComponent';
import HelpText from '../components/HelpText/HelpText';
// import { MainService } from '../../../_services/main.service';
import './modal.css';
// import Mp3 from '../../../_components/Mp3Record';
import Mp3Player from '../components/Mp3Player/Mp3Player';
// import VideoReview from '../../../_components/VideoReview';


// const main = new MainService();
export function InterviewSimulatorReviewModal(props) {
 
    // the props
    const { show,
        user,
        handleCloseReview,
        reviewIsExternal,
        setReviewIsExternal,
        attempt,
        updateSelfReview, mentor,
        handleExternalReview, } = props;


    // the states
    const [selfReviewParameters, setSelfReviewParameters] = useState([]);
    const [externalReviewParameters, setExternalReviewParameters] = useState([]);

    const [selfReviewRatings, setSelfReviewRatings] = useState({}); // for form state, user selects a rating and this one changes
    const [selfHelp, setSelfHelp] = useState({}); // for form state, user selects a rating and this one changes
    const [externalHelp, setExternalHelp] = useState({}); // for form state, user selects a rating and this one changes


    const handleClose = () => {
        handleCloseReview(false);
    }

    // get review parameters at start


    // if (!attempt) return <></>;

    // get the related data
    const { lessonName, lessonNo, self_rating } = attempt;

    return (
        <div className="ReviewModal">

            <Modal className="reviewModalPoup" centered size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton style={{ border: 'none' }} />
                <Modal.Body>
                    <div className="container">
                        <div className="row">

                            <div className="col-md-12 text-center font-bold mb-2">Question {lessonNo}.{lessonName}</div>
                            <div className="col-md-12 d-flex justify-content-center py-5 border">
                                <video controls height="200" width="400" src={'https://langappnew.s3.amazonaws.com/uploads/' + attempt.filePath}></video>
                            </div>
                            {!mentor && (<>
                                {/* <div className="col-md-4 text-center my-3 cursor-pointer"><h5 onClick={() => handleExternalReview(false)} className={reviewIsExternal ? "text-secondary" : "underlined"}>Self Review</h5></div> */}
                                <div className="col-md-4 text-center my-3 cursor-pointer"><h5 className={reviewIsExternal ? "underlined" : "text-secondary"} onClick={() => {
                                    handleExternalReview(true);
                                }}>Mentor Review</h5></div>
                                {/* <div className="col-md-4 text-center my-3 cursor-pointer"><h5 className="cursor-pointer text-secondary" onClick={() => {
                                    window.location.href = "/ai-feedback/" + attempt.uuid;
                                }}>AI Review</h5></div> */}
                            </>)}
                            {mentor ? <ExternalReviewView user={user} externalReviews={attempt.external_rating} externalHelp={externalHelp} /> :
                                <>
                                    {reviewIsExternal ? (
                                        <ExternalReviewView user={user} externalReviews={attempt.external_rating} externalHelp={externalHelp} />
                                    )
                                        : (
                                            <SelfReviewView
                                                selfHelp={selfHelp}
                                                user={user}
                                                attempt={attempt}
                                                selfReview={self_rating}
                                                selfReviewRatings={selfReviewRatings}
                                                setSelfReviewRatings={setSelfReviewRatings}
                                                handleClose={handleClose}
                                                updateSelfReview={updateSelfReview ? updateSelfReview : (e) => { }} />
                                        )}
                                </>
                            }
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}


function ExternalReviewView({ externalReviews, externalHelp, user }) {

    const [selectedIndex, setselectedIndex] = useState(0);
    const [showDetails, setshowDetails] = useState(true);
    const [canGiveRating, setCanGiveRating] = useState(false);
    const [star, setStar] = useState({});
    const [currentReview, setReview] = useState();
    // const { addToast } = useToasts();
    const [comment, setComment] = useState({})
    const [audio, setAudio] = useState(undefined)
    const [video, setVideo] = useState(undefined)
    const [error, setError] = useState('')
    const [loading, setloading] = useState(false)

    const handleShow = (id, review) => {
        if (selectedIndex === id) {

        } else {
            setselectedIndex(id)
            setshowDetails(!showDetails);
            setReview(review);
            setStar(review.reviewJSON)
            setComment(review.comment)
            
            setCanGiveRating(user?.email === review?.reviewerEmail)
        }

    }


    // if (externalReviews.length === 0) {
    //     return (
    //         <div>No review yet!</div>
    //     );
    // }

    return (
        <>
        {console.log('ExternalReviewView--',externalReviews)}
            <Container>
            {loading ? <div className="text-center mt-5">
                {/* <Spinner color="red" larger /> */}
                </div>
                : null}
                
                {
                    externalReviews.map((review, index) => {

                        const { reviewerName, reviewJSON, id,audio,video } = review;

                        return (
                            <div key={id}>
                                
                                <Row>
                                    <Col sm={8} className="font-bold">{reviewerName}</Col>
                                    <Col sm={4}><div onClick={() => handleShow(id, review)} style={{ cursor: 'pointer', color: 'blue' }}>{selectedIndex === id ? "Hide Details" : "Show Details"}</div>
                                    </Col>
                                    {!canGiveRating && selectedIndex === id ? <Col sm={12} md={12}>
                                        <div className="comment-box">{comment}</div>
                                    </Col> : null}
                                    {canGiveRating && selectedIndex === id ? <Col sm={12} md={12}>
                                        <textarea style={{width:'100%'}} className="comment-box" value={comment} onChange={(e)=> setComment(e.target.value)}/>
                                        
                                    </Col> : null}
                                    {selectedIndex === id && (canGiveRating || video ) &&


                                    <video className={"question-video"} autoPlay={false} src={`https://langappnew.s3.amazonaws.com/reviews/video/${id}/${video}`} controls ></video>
                    }
                                    {selectedIndex === id && audio && <Mp3Player url={audio}/>}
                                    {/* {selectedIndex === id && canGiveRating &&  <Mp3  setAudio={setAudio} />} */}
                                    {/* {selectedIndex === id && canGiveRating &&  <Col sm={12} md={12}>
                                            <div>
                                            <button onClick={update} style={{ margin: '10px auto' }} className='btn btn-success btn-xs'>Update Review</button>
                                        </div>
                                        </Col>} */}
                                    
                                    <div className="row" >
                                        {selectedIndex === id ? Object.keys(reviewJSON).map((reviewParameter) => {
                                            return (
                                                <Col md={6} key={`${id}_${reviewParameter}`}>
                                                    <div className="row" key={index}>
                                                        <div className="text-left col-md-8">
                                                            <HelpText placement="top-start" title={externalHelp && externalHelp[reviewParameter] ? externalHelp[reviewParameter] : ''}>
                                                                <span>{reviewParameter}</span>
                                                            </HelpText>
                                                        </div>
                                                        <div className="bd-highlight col-md-4 pr-5 pl-0">
                                                            <ExternalRatingComponent
                                                                id={id}
                                                                readOnly={!canGiveRating}
                                                                name={`${id}__${reviewParameter}`}
                                                                value={selectedIndex === id ? (star ? star[reviewParameter] : null) : reviewJSON[reviewParameter]}
                                                                setRating={(r) => {
                                                                    if (canGiveRating) {
                                                                        setStar({ ...star, [reviewParameter]: r })
                                                                    }

                                                                    // let newRating = { ...selfReviewRatings };
                                                                    // newRating[parameterName] = r;
                                                                    // setSelfReviewRatings(newRating);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                            )
                                        }) : null}
                                    </div>
                                </Row>
                            </div>
                        );
                    })
                }
            </Container>
        </>
    );
}


// function to show self review
function SelfReviewView({ selfHelp, attempt, user, selfReview, selfReviewRatings, setSelfReviewRatings, handleClose, updateSelfReview }) {

    // const { addToast } = useToasts();

    // form related state
    const [showError, setShowError] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [comment, setComment] = useState("");

    // form handlers
    const handleSubmit = (e) => {
        const form = e.currentTarget;
        e.preventDefault()
        if (form.checkValidity() === false) {
            setShowError(true)
            setIsFormValid(false)
            e.preventDefault();
            // e.stopPropagation();
        }
        const payload = {
            review: selfReviewRatings,
            comment
        }

        // if (form.checkValidity() === true) {
        //     if (Object.keys(selfReviewRatings).length < 10) return setShowError(true)
        //     main.saveSelfReview(user.token, attempt.id, payload)
        //         .then(res => {
        //             if (res.message === "Validation Error") {
        //                 // addToast('Validation error', { appearance: 'error', autoDismiss: true })
        //             }
        //             if (res.message === "Review saved!") {
        //                 // addToast('Saved Successfully', { appearance: 'success', autoDismiss: true });
        //                 handleClose()

        //                 // update the prev self review
        //                 updateSelfReview(res.review);
        //             }
        //         })
        // }

        // setValidated(true);
    }

    return (
        <div className="container text-center my-2">
            <div className="row">
                <div className="col">
                    <div className="row">
                        { // Review already available
                            selfReview && Array.isArray(selfReview.reviewJSONArray) && selfReview.reviewJSONArray.length > 0 ? (
                                selfReview.reviewJSONArray.map((parameter, index) => (
                                    <div key={index} className="col-md-6">
                                        <div className="row">

                                            <div className="text-left col-md-8">
                                                {/* <HelpText placement="top-start" title={selfHelp && selfHelp[parameter.parameterName] ? selfHelp[parameter.parameterName] : ''}>
                                                    <span>{parameter.parameterName}</span>
                                                </HelpText> */}
                                            </div>

                                            <div className="bd-highlight col-md-4 pr-5 pl-0">
                                                <RatingComponent
                                                    id={index}
                                                    // name={"rating" + index}
                                                    name={"self-rating" + index}
                                                    reviewParameter={parameter.parameterName}
                                                    value={parameter.parameterValue}
                                                    setRating={(r) => {
                                                        // TODO: set rating
                                                    }} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : ( // we need to take review
                                <>
                                    {
                                        Object.keys(selfReviewRatings).length > 0
                                            ? Object.keys(selfReviewRatings).map((parameterName, index) => (
                                                <div key={index} className="col-md-6">
                                                    <div className="row">
                                                        <div className="text-left col-md-8">
                                                            <HelpText placement="top-start" title={selfHelp && selfHelp[parameterName] ? selfHelp[parameterName] : ''}>

                                                                <span>{parameterName} </span>
                                                            </HelpText>
                                                        </div>
                                                        <div className="bd-highlight col-md-4 pr-5 pl-0">
                                                            <RatingComponent
                                                                // defaultValue={5}
                                                                id={index}
                                                                // name={"rating" + index}
                                                                name={"rating-" + parameterName}
                                                                reviewParameter={parameterName}
                                                                value={selfReviewRatings[parameterName]}
                                                                setRating={(r) => {
                                                                    let newRating = { ...selfReviewRatings };
                                                                    newRating[parameterName] = r;
                                                                    setSelfReviewRatings(newRating);
                                                                }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                            : ("Not added")
                                    }
                                </>
                            )
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}