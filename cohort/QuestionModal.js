import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
// import UploadFileIcon from '@material-ui/icons/UploadFile';
// import VideoCameraFrontIcon from '@material-ui/icons/VideoCameraFront';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});


class QuestionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      uploadVideo: false,
      recordVideo: false,
      practiceSetQuestion: "",
      practiceQuestionText: "",
      referenceAnswer: "",
      video: "",
      type: 0
    };
    this.videoRef = React.createRef();
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
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
      this.startCamera()
    }
  };

  onChangeFile = (e) => {
    this.setState({ video: e.target });
  };
  clearRecording = () => {
    this.setState({
      blobsRecorded: false,
      isRecording: false,
      downloadLink: null,
      videoObj: null,
    });
  };

  // start recording
  startRecording = async (e) => {
    var mediaRecorder2 = new MediaRecorder(this.state.stream, {
      mimeType: "video/webm",
    });
    const recorded_blobs = [];
    this.setState({
      blobsRecorded: [],
      downloadLink: null,
      videoObj: null,
    });
    mediaRecorder2.addEventListener("dataavailable", (e) => {
      recorded_blobs.push(e.data);
      this.setState({ blobsRecorded: recorded_blobs });
    });
    mediaRecorder2.start(1000);
    this.setState({
      mediaRecorder: mediaRecorder2,
      isRecording: true,
    });
  };

  stopRecording = (e) => {
    if (this.state.isRecording) {
      this.setState({
        mediaRecorder: undefined,
        isRecording: false,
      });
      let video_local = new Blob(this.state.blobsRecorded, {
        type: "video/webm",
      });
      const file = new File([video_local], "question.webm");
      this.setState({
        downloadLink: video_local,
        videoObj: URL.createObjectURL(video_local),
        video: file,
      });
    }
    let streamVideo = this.state.stream;
    const tracks = streamVideo.getTracks();
    tracks.forEach(function (track) {
      track.stop();
    });

  };

  stopCamera = (discardFootage = false) => {
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

    this.setState({
      mediaRecorder: undefined,
      isRecording: false,
    });
    if (this.state.stream) {
      this.setState({ stream: null });
    }
  };
  preStartRecording = (e) => {
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
      this.startRecording(null);
      this.setState({ counterVisible: false });
      this.setState({ counterCount: 3 });
    }, 3000);
  };

  // camera related
  startCamera = async () => {
    this.setState({
      blobsRecorded: [],
      downloadLink: null,
      videoObj: null,
    });
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

  render() {
    const { classes } = this.props;
    const {
      newQuestion,
      uploading,
      counterVisible,
      counterCount,
      downloadLink,
      videoObj,
      stream,
      isRecording,
      practiceSetQuestion,
      practiceQuestionText,
      referenceAnswer,
      video,
      type
    } = this.state;
    let videoLink = "";
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Open form dialog
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">  Add or Edit Practice Question</DialogTitle>
          <DialogContent>
            <div>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel
                  ref={ref => {
                    this.InputLabelRef = ref;
                  }}
                  htmlFor="outlined-age-simple"
                >
                  Practice Type
                </InputLabel>
                <Select
                  style={{ width: '300px' }}
                  fullWidth
                  value={this.state.type}
                  onChange={(e)=>{this.setState({type:e.target.value})}}
                  input={
                    <OutlinedInput
                      labelWidth={this.state.labelWidth}
                      name="age"
                      id="outlined-age-simple"
                    />
                  }
                >

                  <MenuItem value={1}>Video</MenuItem>
                  <MenuItem value={0}>Text</MenuItem>
                </Select>
              </FormControl>
            </div>
            <TextField
              id="outlined-name"
              label="Practice Question"
              value={practiceSetQuestion ?? ''}
              onChange={e => this.setState({ practiceSetQuestion: e.target.value })}
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <TextField
              id="outlined-name"
              label="Hints"
              value={practiceQuestionText ?? ''}
              onChange={e => this.setState({ practiceQuestionText: e.target.value })}
              margin="normal"
              variant="outlined"
              fullWidth
              type="select"
            />
            {!type ? <TextField
              id="outlined-name"
              label="Reference Answer"
              rows={2}
              maxRows={5}
              value={referenceAnswer ?? ''}
              onChange={e => this.setState({ referenceAnswer: e.target.value })}
              margin="normal"
              variant="outlined"
              fullWidth
            />: null}


            {this.state.type ? 
            <div>
              <FormControl variant="outlined" className={classes.formControl}>
                <div>
                  <Button variant="contained" color="secondary"
                    onClick={() => {
                      this.selectVideoOption("uploadVideo");
                    }}
                    title="Delete Question" style={{ marginBottom: 10 }}>
                    Upload Video
                  </Button>
                  {this.state.uploadVideo && (<input
                    disabled={uploading}
                    name="video"
                    type="file"
                    onChange={this.onChangeFile}
                    accept=".mp4"
                  />)}
                </div>
                <div>
                  <Button variant="contained" color="primary"
                    onClick={() => {
                      this.selectVideoOption("recordVideo");
                    }}
                    title="Edit Question" >
                    Record Video
                  </Button>
                </div>
              </FormControl>


              {this.state.recordVideo && (
                <div className="recorder">
                  {!!counterVisible && <div className="countdown-counter">{counterCount}</div>}

                  {stream && !counterVisible && !isRecording && !downloadLink ? (
                    <button
                      id="start-record"
                      onClick={(e) => this.preStartRecording(e)}
                    >
                      Start Recording
                    </button>
                  ) : null}


                  {isRecording ? (
                    <button
                      id="stop-record"
                      onClick={(e) => this.stopRecording(e)}
                    >
                      Stop Recording
                    </button>
                  ) : null}

                </div>
              )}

            </div>: null}
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="" onClick={this.handleClose} >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={this.handleClose}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(QuestionModal);
