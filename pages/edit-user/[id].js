import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";

import { DataContext } from "../../store/GlobalState";
import { patchData } from "../../utils/fetchData";
import { updateItem } from "../../store/Action";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(5),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  // loading: {
  //   color: "white",
  // },
}));

const EditUser = () => {
  const { state, dispatch } = useContext(DataContext);
  const router = useRouter();
  const { id } = router.query;
  const { auth, users } = state;
  const classes = useStyles();

  const [editUser, setEditUser] = useState({ name: "", email: "" });
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [num, setNum] = useState(0);

  useEffect(() => {
    users.forEach((item) => {
      if (item._id === id) {
        setEditUser(item);
        setCheckAdmin(item.role === "admin" ? true : false);
      }
    });
  }, [users]);

  const handleCheck = () => {
    setCheckAdmin(!checkAdmin);
    setNum(num + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = checkAdmin === true ? "admin" : "user";
    if (num % 2 !== 0) {
      dispatch({ type: "NOTIFY", payload: { loading: true } });
      patchData(`user/${editUser._id}`, { role }, auth.token).then((res) => {
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });
        dispatch(
          updateItem(users, { ...editUser, role }, editUser._id, "ADD_USER")
        );
        return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Head>
        <title>Edit Users</title>
      </Head>
      <Box my={4}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
        <Grid container justify="center">
          <Grid item xs={6}>
            <form className={classes.form} onSubmit={handleSubmit} noValidate>
              <Typography
                style={{ textTransform: "uppercase" }}
                variant="h4"
                align="center"
                color="secondary"
              >
                Edit User
              </Typography>
              <TextField
                size="medium"
                fullWidth
                label="Name"
                variant="outlined"
                margin="normal"
                value={editUser.name}
                disabled
              />

              <TextField
                size="medium"
                fullWidth
                label="Email"
                margin="normal"
                variant="outlined"
                value={editUser.email}
                disabled
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkAdmin}
                    value="remember"
                    color="primary"
                    onChange={handleCheck}
                    value={checkAdmin}
                  />
                }
                label="isAdmin"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                // endIcon={
                //   notify.loading && (
                //     <CircularProgress className={classes.loading} size="20px" />
                //   )
                // }
              >
                Update
              </Button>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EditUser;
