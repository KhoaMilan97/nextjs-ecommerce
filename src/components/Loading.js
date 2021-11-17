import React, { useEffect, useContext } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import { DataContext } from "../../store/GlobalState";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function Loading() {
  const classes = useStyles();
  const { state, dispatch } = useContext(DataContext);
  const [open, setOpen] = React.useState(false);
  const { notify } = state;

  const handleClose = () => {
    setOpen(false);
    dispatch({ type: "NOTIFY", payload: {} });
  };

  useEffect(() => {
    if (notify?.loading === true) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [notify]);

  return (
    <div>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
