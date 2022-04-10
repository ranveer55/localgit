import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';

function ConfirmationDialogRaw(props) {

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="md"
      open={props.open}
    >
      <DialogTitle>Please Confirm </DialogTitle>
      <DialogContent dividers>
        Are you sure to delete user <b>{props.userId}</b> from course <b>{props.course}</b>
        <br/>
        {props.deleting && <LinearProgress />}
      </DialogContent>
      <DialogActions>
        <Button variant="contained"   onClick={props.handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="secondary"  onClick={props.handleOk}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
//   onClose: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
};

export default ConfirmationDialogRaw;
