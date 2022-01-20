import React, { Component } from "react";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import moment from "moment";
import { ProgressBar } from "react-bootstrap";
import { mixPanel } from "../../config/mixpanel.config";
import axios from "axios";
import { toast } from "../../components/Toast/Toast";

const s3Url = "https://langappnew.s3.amazonaws.com/uploads/";
// let baseUrl = process.env.NODE_ENV === 'development' ? "http://localhost:8000/api/" : (window.location.hostname === "app.taplingua.com" ? "https://api2.taplingua.com/api/" : "https://apistaging.taplingua.com/api/");
let baseUrl = "http://localhost:8000/api/";

class ManageQuetions extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.cohortId = props.match.params.cohortId;
    this.practiceSetId = props.match.params.practicId;

    this.companyCode = global.companyCode;
    this.newQuestion = {
      practiceSetQuestion: "",
      practiceQuestionText: "",
      referenceAnswer: "",
      video: "",
    };
    this.state = {
      video: null,
      dateLoaded: false,
      uploading: false,
      cohort: null,
      practicSet: null,
      questions: [],
      availablePracticeSets: [],
      showPracticeSetAddModal: false,
      alreadySelectedPracticeSets: [],
      selectedPracticeSets: [],
      newQuestion: this.newQuestion,
      selectedLessonIndex: 0,
      lessons: [],
      counterVisible: false,
      counterCount: 3,
      progress: "",
      downloadLink: null,
      blobsRecorded: [],
      videoObj: "",
      stream: "",
      previousAttempts: [],
      isRecording: false,
      isSavingAttempt: false,
      mediaRecorder: [],
      moduleName: "test",
      isCompleted: false,
      uploadVideo: false,
      recordVideo: false,
    };

    this.state.selectedCompany = global.companyCode;
    this.state.selectedCompanyName = global.companyName;

    this.videoRef = React.createRef();
  }
  notifySuccess = () => toast.success("success");
  notifyError = (val) => toast.error(val);

  componentDidMount() {
    this.loadData();
    this.loadPracticeSetsQuestions();
    this.getAllPracticeSets(this.practiceSetId);
  }

  loadData() {
    this.setState({
      dateLoaded: false,
    });
    global.api
      .getCohortDetail(this.cohortId)
      .then((data) => {
        this.setState({
          dataLoaded: true,
          cohort: data,
        });
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
        });
      });
  }

  addPracticeSetQuestion = () => {
    if(this.state.stream){
      let streamVideo = this.state.stream;
      const tracks = streamVideo.getTracks();
      
      tracks.forEach(function (track) {
        track.stop();
      });
    }

    this.setState({ uploading: true });
    let formData = new FormData();
    const { newQuestion, video } = this.state;
    for (const k of Object.keys(newQuestion)) {
      if (k == "video") {
      } else {
        formData.append([k], newQuestion[k]);
      }
    }

    if (video && video.value) {
      const { value, files } = video;
      formData.append("video", files[0], files[0].name);
      formData.append("video_type", files[0].name);
    } else {
      if (video && video.name) {
        formData.append("video", video, video.name);
        formData.append("video_type", video.name);
      }
    }
    console.log("addPrac--", video);

    if (this.state.newQuestion.practiceQuestionId) {
      global.api
        .updateCompanyPracticeSetQuetion(
          this.practiceSetId,
          formData,
          this.state.newQuestion.practiceQuestionId
        )
        .then((data) => {
          const dt = this.state.questions.map((item) =>
            item.practiceQuestionId == this.state.newQuestion.practiceQuestionId
              ? data.practiceQuestion
              : item
          );
          this.setState({
            addPracticeSetAddModal: false,
            // questions: dt,
            uploading: false,
            newQuestion: this.newQuestion,
            video: null,
            videoObj:null,
             downloadLink: null,
             stream: ""
          });
          this.loadPracticeSetsQuestions();
        })
        .catch((err) => {
          this.notifyError(err.practiceSetQuestion[0]);
          this.setState({
            dateLoaded: true,
            uploading: false,
          });
        });
    } else {
      global.api
        .addCompanyPracticeSetQuetion(this.practiceSetId, formData)
        .then((data) => {
          const dt = this.state.questions;
          dt.push(data.practiceQuestion);
          this.setState({
            addPracticeSetAddModal: false,
            // questions: dt,
            uploading: false,
            newQuestion: this.newQuestion,
            video: null,
            videoObj:null,
            downloadLink: null,
            stream: ""
          });
          this.loadPracticeSetsQuestions();
        })
        .catch((err) => {
          // this.notifyError(err?.practiceSetQuestion[0]);
          this.notifyError("Request is not completed");
          this.setState({
            dateLoaded: true,
            uploading: false,
          });
        });
    }
  };

  onChange = (e) => {
    let { newQuestion } = this.state;
    this.setState({
      newQuestion: {
        ...newQuestion,
        [e.target.name]: e.target.value,
      },
    });
  };
  onChangeEditor = (e) => {
    console.log({ e });
    let { newQuestion } = this.state;
    this.setState({
      newQuestion: {
        ...newQuestion,
        practiceSetQuestion: e,
      },
    });
  };

  Edit = (e, row) => {
    e.preventDefault();
    this.setState({ newQuestion: row, addPracticeSetAddModal: true });
  };
  Remove = (e, row) => {
    e.preventDefault();
    global.api
      .deleteCompanyPracticeSetQuetion(
        this.practiceSetId,
        row.practiceQuestionId
      )
      .then((data) => {
        const dt = this.state.questions.filter(
          (item) => item.practiceQuestionId !== row.practiceQuestionId
        );

        this.setState({
          addPracticeSetAddModal: false,
          questions: dt,
        });
      })
      .catch((err) => {
        this.setState({
          dateLoaded: true,
        });
      });
  };
  Assign = (e, row) => {
    e.preventDefault();
    // this.setState({newQuestion: row})
  };
  onChangeFile = (e) => {
    // console.log('1',e.target.files)
    // console.log('2',e.target.Files)
    // console.log(e.target)
    this.setState({ video: e.target });
    console.log("onChangeFile--", e.target);
  };

  // get cohort practice sets
  loadPracticeSetsQuestions() {
    this.setState({ dataLoaded: false });
    global.api
      .getCohortPracticeSetsQuestions(this.practiceSetId)
      .then((data) => {
        this.setState({
          questions: data ? data.practiceQuestions : [],
          dataLoaded: true,
        });
      });
  }

  // get all the available practice sets, available
  getAllPracticeSets(id) {
    global.api.getAllPracticeSets().then((data) => {
      if (data && data.practiceSets) {
        const find = data.practiceSets.find((e) => e.practiceSetId == id);
        if (find) {
          this.setState({ practicSet: find });
        }
      }
    });
  }

  togglePracticeSetSelection(practiceSetId) {
    // if already there, remove it
    console.log("here", practiceSetId);
    if (this.state.selectedPracticeSets.includes(practiceSetId)) {
      const newState = [...this.state.selectedPracticeSets];
      newState.splice(
        this.state.selectedPracticeSets.indexOf(practiceSetId),
        1
      );
      this.setState({
        selectedPracticeSets: newState,
      });
    } else {
      this.setState({
        selectedPracticeSets: [
          ...this.state.selectedPracticeSets,
          practiceSetId,
        ],
      });
    }
  }
  formatter = (cell, row) => {
    console.log(this);
    return (
      <div className="interview-simulator-dropdown-holder">
        <span className="interview-simulator-dropdown">⋮</span>
        <div className="interview-simulator-dropdown-content">
          <Link
            to="#"
            onClick={(e) => this.Remove(e, row)}
            className="interview-simulator-dropdown-link"
            style={{
              color: "blue",
              cursor: "pointer",
            }}
          >
            Remove Question
          </Link>
          <Link
            to="#"
            onClick={(e) => this.Edit(e, row)}
            className="interview-simulator-dropdown-link"
            style={{
              color: "blue",
              cursor: "pointer",
            }}
          >
            Edit Question
          </Link>
        </div>
      </div>
    );
  };

  selectVideoOption = (val) => {
    if (val == "uploadVideo") {
      this.setState({
        uploadVideo: true,
        recordVideo: false,
      });
    } else {
      this.setState({
        uploadVideo: false,
        recordVideo: true,
      });
    }
  };
  render(props) {
    // const { addToast } = withToastManager();

    const id_token = localStorage.getItem("id_token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    console.log("useruser--", user);
    const saveAttempt = async (e) => {
      const fileName = "UserAttempt.webm";
      const file = new File([downloadLink], fileName);
      console.log({
        file,
      });
      this.setState({
        isCompleted: true,
        isSavingAttempt: true,
      });
      const selectedLesson = "test question";
      // save attempt first
      const response = await fetch(
        baseUrl + "interview/save-attempt-for-signed-url",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + id_token,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName,
            moduleNo: "1",
            routeNo: 2,
            lessonNo: 2,
          }),
        }
      ).then((r) => r.json());

      try {
        const videoResponse = await axios.put(response.uploadURL, file, {
          headers: {
            "Content-Type": "video/webm",
          },
          onUploadProgress: (data) => {
            //Set the progress value to show the progress bar
            this.setState({
              progress: Math.round((100 * data.loaded) / data.total),
            });
          },
        });
        if (videoResponse.status === 200) {
          const videoSaveResponse = await axios.post(
            baseUrl +
              "interview/mark-attempt-video-uploaded/" +
              response.attemptNo,
            {
              reviewFileLocation: response.Key,
              moduleNo: "1",
              routeNo: selectedLesson.routeno,
              lessonNo: selectedLesson.lesson_no,
            },
            {
              headers: {
                Authorization: "Bearer " + user.token,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          if (videoSaveResponse.status === 200) {
            stopCamera();
            this.notifySuccess();
            this.setState({
              progress: undefined,
              isSavingAttempt: false,
            });
            // clear recording
            clearRecording();
            // update the prev attempts
            // loadPreviousAttempts(selectedLessonIndex);
            let moduleName = "test";
            mixPanel.track("InterviewSimulatorUploadVideo", {
              userId: user.email ? user.email : user.userId,
              module,
              moduleName,
              lessonNo: "1",
            });
          } else {
            stopCamera();
            clearRecording();
            this.setState({ isSavingAttempt: true });
            this.notifyError("Could not save attempt");

            // addToast("Could not save attempt", {
            //   appearance: "error",
            //   autoDismiss: true,
            // });
          }
        } else {
          this.setState({ isSavingAttempt: true });
          stopCamera();
          clearRecording();
          this.notifyError("Could not save attempt");

          //   addToast("Could not save attempt", {
          //     appearance: "error",
          //     autoDismiss: true,
          //   });
        }
      } catch (e) {
        this.setState({ isSavingAttempt: true });
        console.log("ERROR", e);
      }
    };

    const clearRecording = () => {
      this.setState({
        blobsRecorded: false,
        isRecording: false,
        downloadLink: null,
        videoObj: null,
      });
    };

    // start recording
    const startRecording = async (e) => {
      // set MIME type of recording as video/mp4
      var mediaRecorder2 = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      const recorded_blobs = [];
      // reset the blobs
      this.setState({
        blobsRecorded: [],
        downloadLink: null,
        videoObj: null,
      });

      // event : new recorded video blob available
      mediaRecorder2.addEventListener("dataavailable", (e) => {
        recorded_blobs.push(e.data);
        // hacking in through to show the recorded time data, due to insufficient time
        const recordedTimeDiv = document.getElementById("recording-time");
        if (recordedTimeDiv) {
          recordedTimeDiv.innerText =
            (Math.floor(recorded_blobs.length / 60) + "").padStart(2, "0") +
            ":" +
            (Math.floor(recorded_blobs.length % 60) + "").padStart(2, "0");
        }

        this.setState({ blobsRecorded: recorded_blobs });
      });
      // start recording with each recorded blob having 1 second video
      mediaRecorder2.start(1000);
      this.setState({
        mediaRecorder: mediaRecorder2,
        isRecording: true,
      });
      // set state to recording

      let moduleName = "testrecording";
      mixPanel.track("InterviewSimulatorRecordVideo", {
        userId: user.email ? user.email : user.userId,
        module,
        moduleName,
        lessonNo: 2,
      });
    };

    const stopRecording = (e) => {
      if (this.state.isRecording) {
        // this.mediaRecorder.stop();
        // this.state.mediaRecorder.stop();

        this.setState({
          mediaRecorder: undefined,
          isRecording: false,
        });
        console.log("here2", {
          isRecording: JSON.stringify(isRecording),
        });

        // save the blob as video
        let video_local = new Blob(this.state.blobsRecorded, {
          type: "video/webm",
        });

        // const myFile = new File([this.state.blobsRecorded], "video.mp4", {
        //   type: "video/mp4",
        // });

        const file = new File([video_local], "question.webm");

        this.setState({
          downloadLink: video_local,
          videoObj: URL.createObjectURL(video_local),
          video: file,
        });
      }
      console.log("here", {
        isRecording: JSON.stringify(isRecording),
      });

      let streamVideo = this.state.stream;
      const tracks = streamVideo.getTracks();
      
      tracks.forEach(function (track) {
        track.stop();
      });

    };

    const stopCamera = (discardFootage = false) => {
      const vid = document.getElementById("video");
      if (vid) {
        vid.pause();
        vid.src = "";
      }
      let streamVideo = this.state.stream;
      const tracks = streamVideo.getTracks();
      
      tracks.forEach(function (track) {
        track.stop();
      });
      // this.state.mediaRecorder.stop();

      this.setState({
        mediaRecorder: undefined,
        isRecording: false,
      });
      if (this.state.stream) {
        this.setState({ stream: null });
      }
    };

    // triggers pre recording
    const preStartRecording = (e) => {
      // start the 3 sec counter
      this.setState({ counterVisible: true });
      setTimeout(() => {
        this.setState({ counterCount: 2 });
      }, 1000);
      setTimeout(() => {
        this.setState({ counterCount: 1 });
      }, 2000);
      setTimeout(() => {
        this.setState({ counterCount: 0 });
        startRecording(null);
        this.setState({ counterVisible: false });
        this.setState({ counterCount: 3 });
      }, 3000);
    };

    // camera related
    const startCamera = async () => {
      this.setState({
        blobsRecorded: [],
        downloadLink: null,
        videoObj: null,
      });
      // setblobsRecorded([])
      // setdownloadLink(null)
      // setvideoObj(null)
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      var video = document.getElementById("video");
      video.srcObject = stream;
      video.volume = 0;
      if (this.videoRef.current) {
        this.videoRef.current.srcObject = stream;
        this.setState({ stream });
        video.srcObject = stream;
        video.volume = 0;
      }
      return;
    };

    const {
      newQuestion,
      cohort,
      practicSet,
      uploading,
      selectedLessonIndex,
      counterVisible,
      counterCount,
      progress,
      downloadLink,
      videoObj,
      stream,
      previousAttempts,
      isRecording,
      isSavingAttempt,
      videoRef,
    } = this.state;
    let videoLink = "";

    const columns = [
      {
        dataField: "video",
        text: "Video",
        formatter: (v, row) => (
          <video width="250" height="230" controls>
            <source
              className="chkVideo"
              src={`https://langappnew.s3.amazonaws.com/interviewprep/${
                row?.practiceSetId
              }/${row?.practiceSetId}_0_${row?.practiceQuestionId}.${
                row?.video_type ? row?.video_type : "mp4"
              }`}
              type={`video/${row?.video_type ? row?.video_type : "mp4"}`}
            />
          </video>
        ),
      },
      {
        dataField: "practiceSetQuestion",
        text: "Question",
      },
      {
        dataField: "practiceQuestionText",
        text: "Hints",
        formatter: (datum) =>
          datum && datum != null && datum != "null" ? datum : "",
      },
      {
        dataField: "referenceAnswer",
        text: "Reference Answer",
        formatter: (datum) =>
          datum && datum != null && datum != "null" ? datum : "",
      },

      {
        dataField: "created_at",
        text: "Date Created",
        formatter: (created_at) =>
          moment(created_at).format("DD/MM/YYYY").toString(),
      },
      {
        dataField: "created_at",
        text: "Action",
        formatter: this.formatter,
      },
    ];
    if (!cohort) {
      return (
        <main className="offset" id="content">
          <section className="section_box">Loading...</section>
        </main>
      );
    }

    const cancelForm  = () => {
      if(this.state.stream){
        let streamVideo = this.state.stream;
        const tracks = streamVideo.getTracks();
        
        tracks.forEach(function (track) {
          track.stop();
        });
      }
  

      if (!uploading) {
        this.setState({
          addPracticeSetAddModal: false,
          newQuestion: this.newQuestion,
          videoObj:null,
          downloadLink: null,
          stream: ""
        });
      }
    }

    return (
      <main className="offset" id="content">
        <section className="section_box">
          <div className="row">
            <div className="col-md-6">
              <h1 className="title1 mb25">Manage Practice Questions</h1>
              <h4 className="title4 mb40">
                Assigned to Practice Set (
                {practicSet ? practicSet.practiceSetName : ""})
              </h4>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            Practice Set Questions:
            <span
              onClick={(e) => {
                this.setState({
                  addPracticeSetAddModal: true,
                  video: null,
                  uploadVideo: false,
                  recordVideo: false,
                });
              }}
              className="link"
              style={{ marginLeft: "1rem", fontSize: "16px" }}
            >
              Add Practice Set Question
            </span>
          </div>
          <div>
            {this.state.questions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No Questions added yet!
                </td>
              </tr>
            ) : (
              <BootstrapTable
                keyField="id"
                data={this.state.questions}
                columns={columns}
              />
            )}
          </div>

          {this.state.addPracticeSetAddModal ? (
            <div className="add-practice-set-modal">
              {uploading && (
                <div className="loader" style={{ zIndex: 999 }}></div>
              )}
              <div
                disabled={true}
                className="add-practice-set-modal-body"
                style={{ width: "90%", height: "auto%", zIndex: 99 }}
              >
                <div>
                  <h2 style={{ padding: "2px 10px" }}>Practice Set Question</h2>
                  <h6 style={{ padding: "2px 10px" }}>
                    Add or Edit Practice Question
                  </h6>
                  <div style={{ margin: "1rem 0", fontSize: "23px" }}>
                    <div className="row" style={{ padding: "2px 10px" }}>
                      <div className="col-md-3">Practice Question</div>
                      <div className="col-md-9">
                        <textarea
                          disabled={uploading}
                          value={newQuestion.practiceSetQuestion}
                          name="practiceSetQuestion"
                          style={{
                            width: "100%",
                            border: "1px solid",
                            padding: 10,
                            borderRadius: 5,
                          }}
                          placeholder="Practice Question"
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row" style={{ padding: "2px 10px" }}>
                      <div className="col-md-3">Hints</div>
                      <div className="col-md-9">
                        <textarea
                          disabled={uploading}
                          value={newQuestion.practiceQuestionText}
                          name="practiceQuestionText"
                          style={{
                            width: "100%",
                            border: "1px solid",
                            padding: 10,
                            borderRadius: 5,
                          }}
                          placeholder="Hints"
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row" style={{ padding: "2px 10px" }}>
                      <div className="col-md-3">Reference Answer</div>
                      <div className="col-md-9">
                        <textarea
                          disabled={uploading}
                          name="referenceAnswer"
                          value={newQuestion.referenceAnswer}
                          style={{
                            width: "100%",
                            border: "1px solid",
                            padding: 10,
                            borderRadius: 5,
                          }}
                          placeholder="Reference Answer"
                          onChange={this.onChange}
                        />
                      </div>
                    </div>

                    <div className="row" style={{ padding: "2px 10px" }}>
                      <div className="col-md-3">Video</div>
                      <div className="col-md-9">
                        <div className="selectOptions">
                          <p
                            onClick={() => {
                              this.selectVideoOption("uploadVideo");
                            }}
                            className="selectVideo"
                          >
                            Upload video
                          </p>
                          <span className="slashBtw">/</span>
                          <p
                            onClick={() => {
                              this.selectVideoOption("recordVideo");
                            }}
                            className="selectVideo"
                          >
                            Record video
                          </p>
                        </div>
                      </div>
                    </div>
                    {this.state.uploadVideo && (
                      <div className="row" style={{ padding: "2px 10px" }}>
                        <div className="col-md-3"></div>
                        <div className="col-md-9">
                          <input
                            disabled={uploading}
                            name="video"
                            type="file"
                            onChange={this.onChangeFile}
                            accept=".mp4"
                          />
                        </div>
                      </div>
                    )}
                    {/* recording and preview section */}

                    {this.state.recordVideo && (
                      <div className="row" style={{ padding: "2px 10px" }}>
                        <div className="col-md-3"></div>
                        <div className="col-md-9">
                          <div className="video-box flex items-left justify-around">
                            {/* preview */}
                            {/* <div className="question-view">
                          <video className={"question-video"} autoPlay={true} src={videoLink} controls></video>
                        </div> */}
                            {/* recorder */}
                            <div className="recorder">
                              {counterVisible ? (
                                <div className="countdown-counter">
                                  {counterCount}
                                </div>
                              ) : (
                                <></>
                              )}
                              {progress && (
                                <div className="progressBar">
                                  <ProgressBar
                                    variant="success"
                                    now={progress}
                                    label={`${progress}%`}
                                  />
                                </div>
                              )}
                              {console.log("videoRef--", this.videoRef)}
                              {!downloadLink ? (
                                !stream ? (
                                  <video
                                    id="video"
                                    style={{ display: "none" }}
                                    className="record-video c1234"
                                    ref={this.videoRef}
                                    autoPlay
                                  ></video>
                                ) : (
                                  <video
                                    id="video"
                                    className="record-video c12345"
                                    ref={this.videoRef}
                                    autoPlay
                                  ></video>
                                )
                              ) : (
                                <video
                                  id="video"
                                  style={{ display: "none" }}
                                  className="record-video c2134567"
                                  ref={this.videoRef}
                                  autoPlay
                                ></video>
                              )}

                              {/* {!downloadLink && stream ? <video id="video" ref={videoRef} width="320" height="240" autoPlay></video> : null} */}
                              {downloadLink ? (
                                <video
                                  className="record-video c212121"
                                  src={videoObj}
                                  autoPlay
                                  controls
                                ></video>
                              ) : null}
                              {!stream ? (
                                <video
                                  src={s3Url + previousAttempts[0]?.filePath}
                                  className="record-video c111111"
                                  style={{ backgroundColor: "black" }}
                                ></video>
                              ) : null}
                              {stream &&
                              !counterVisible &&
                              !isRecording &&
                              !downloadLink ? (
                                <button
                                  id="start-record"
                                  onClick={(e) => preStartRecording(e)}
                                >
                                  Start Recording
                                </button>
                              ) : null}

                              {stream &&
                              !isRecording &&
                              !downloadLink &&
                              !counterVisible ? (
                                <button
                                  id="stop-camera"
                                  onClick={() => stopCamera()}
                                >
                                  <span>&times;</span>
                                </button>
                              ) : null}
                              {previousAttempts.length === 0 && !stream ? (
                                <button
                                  id="start-record"
                                  onClick={() => startCamera()}
                                >
                                  Start Camera
                                </button>
                              ) : null}

                              {!isRecording && downloadLink ? (
                                <button
                                  className="re-record"
                                  onClick={() => startCamera()}
                                >
                                  Re-record
                                </button>
                              ) : null}
                              {previousAttempts.length > 0 && !stream ? (
                                <button
                                  className="re-record2"
                                  onClick={() => startCamera()}
                                >
                                  Re-record
                                </button>
                              ) : null}

                              {/* the recording timer */}
                              {isRecording ? (
                                <button
                                  id="recording-time"
                                  onClick={() => stopCamera()}
                                >
                                  <span></span>
                                </button>
                              ) : null}
                              {isRecording ? (
                                <button
                                  id="stop-record"
                                  onClick={(e) => stopRecording(e)}
                                >
                                  Stop Recording
                                </button>
                              ) : null}
                              {/* {!isRecording && downloadLink ? (
                            <button
                              className="save-answer"
                              onClick={(e) => {
                                if (!isSavingAttempt) saveAttempt(e);
                              }}
                            >
                              Save Answer
                            </button>
                          ) : null} */}
                            </div>
                          </div>
                          {!isRecording && downloadLink ? (
                          <p className="saveMessge">Please click on save button to save video</p>

                          ): null}
                        </div>
                      </div>
                    )}
                    {/* end recording */}
                  </div>

                  {uploading && (
                    <span style={{ color: "green" }}>
                      {" "}
                      The question is being saved to the database.
                    </span>
                  )}
                  <div className="row" style={{ padding: "2px 10px" }}>
                    <div className="col-md-3"></div>
                    <div className="col-md-9">
                      <div className="btnDivs">
                        <div
                          disabled={!this.state.newPracticeName}
                          style={{ backgroundColor: "#4AB93C", color: "#fff" }}
                          className="add-practice-set-modal-button"
                          onClick={this.addPracticeSetQuestion}
                        >
                          Save
                        </div>
                        <div
                          className="add-practice-set-modal-button"
                          disabled={!uploading}
                          onClick={cancelForm}
                        >
                          Cancel
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </section>
      </main>
    );
  }
}

export default ManageQuetions;
