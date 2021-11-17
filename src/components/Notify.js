import { useContext, useEffect, useState } from "react";

import { DataContext } from "../../store/GlobalState";
import Toast from "./Toast";

const Notify = () => {
  const { state, dispatch } = useContext(DataContext);
  const [open, setOpen] = useState(false);

  const { notify } = state;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    dispatch({ type: "NOTIFY", payload: {} });
  };

  useEffect(() => {
    if (notify?.error || notify?.success) {
      setOpen(true);
    }
  }, [notify]);

  return (
    <>
      {notify.error && (
        <Toast
          open={open}
          type="error"
          msg={notify.error}
          handleClose={handleClose}
        />
      )}
      {notify.success && (
        <Toast
          open={open}
          type="success"
          msg={notify.success}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

export default Notify;
