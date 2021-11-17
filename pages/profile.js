import Head from "next/head";
import { useState, useContext, useEffect } from "react";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import FormControl from "@material-ui/core/FormControl";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import { DataContext } from "../store/GlobalState";
import valid from "../utils/valid";
import { getData, patchData } from "../utils/fetchData";

import { imageUpload } from "../utils/imageUpload";
import Link from "../src/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  avatar: {
    width: "150px",
    height: "150px",
    overflow: "hidden",
    margin: "15px auto",
    border: "1px solid #ddd",
    borderRadius: "50%",

    "& img": {
      width: "100%",
      height: "100%",
      display: "block",
      objectFit: "cover",
    },
  },
}));

const Profile = () => {
  const classes = useStyles();
  const initialState = {
    avatar: "",
    name: "",
    password: "",
    cf_password: "",
  };
  const [data, setData] = useState(initialState);
  const { avatar, name, password, cf_password } = data;
  const { state, dispatch } = useContext(DataContext);
  const { auth, orders } = state;

  useEffect(() => {
    if (auth.user) setData({ ...data, name: auth.user.name });
  }, [auth.user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (password) {
      const errMsg = valid(name, auth.user.email, password, cf_password);
      if (errMsg)
        return dispatch({ type: "NOTIFY", payload: { error: errMsg } });
      updatePassword();
    }

    if (name !== auth.user.name || avatar) {
      updateInfor();
    }
  };

  const updatePassword = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData("user/resetPassword", { password }, auth.token)
      .then((res) => {
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });
        dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      })
      .catch((err) => console.log(err));
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "File doesn't exist." },
      });
    if (file.size > 1024 * 1024)
      // 1mb
      return dispatch({
        type: "NOTIFY",
        payload: { error: "The largest image size is 1mb." },
      });
    if (file.type !== "image/jpeg" && file.type !== "image/png")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Image format is incorrect" },
      });

    setData({ ...data, avatar: file });
  };

  const updateInfor = async () => {
    let media;
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    if (avatar) media = await imageUpload([avatar]);

    const res = await patchData(
      "user",
      { name, avatar: avatar ? media[0].url : auth.user.avatar },
      auth.token
    );
    if (res.err)
      return dispatch({ type: "NOTIFY", payload: { error: err.message } });
    dispatch({
      type: "AUTH",
      payload: { token: auth.token, user: res.user },
    });
    return dispatch({
      type: "NOTIFY",
      payload: { success: res.msg },
    });
  };

  if (!auth.user) return null;

  return (
    <Container maxWidth="md">
      <Head>
        <title>Profile</title>
      </Head>

      <Box my={4}>
        <Grid container spacing={2}>
          <Grid item sm={3}>
            <Typography align="center" variant="h4" component="h2">
              User profile
            </Typography>
            <div className={classes.avatar}>
              <img
                src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
                alt={auth.user.name}
              />
            </div>

            <form
              className={classes.root}
              onSubmit={handleUpdateProfile}
              noValidate
            >
              <FormControl fullWidth>
                <input
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  name="file"
                  type="file"
                  onChange={changeAvatar}
                />
                <label htmlFor="contained-button-file">
                  <Button
                    variant="contained"
                    color="default"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    Upload Avatar
                  </Button>
                </label>
              </FormControl>
              <TextField
                id="name"
                label="Name"
                color="secondary"
                name="name"
                fullWidth
                value={name}
                onChange={handleInputChange}
              />
              <TextField
                id="email"
                label="Email"
                color="secondary"
                name="email"
                fullWidth
                defaultValue={auth.user.email}
                disabled
              />
              <TextField
                id="password"
                type="password"
                label="New Password"
                color="secondary"
                name="password"
                value={password}
                fullWidth
                onChange={handleInputChange}
              />
              <TextField
                id="cf_password"
                type="password"
                label="Confirm New Password"
                color="secondary"
                name="cf_password"
                fullWidth
                value={cf_password}
                onChange={handleInputChange}
              />
              <Button type="submit" variant="contained" color="secondary">
                Update
              </Button>
            </form>
          </Grid>
          <Grid item sm={9}>
            <Typography align="center" variant="h4" component="h2">
              Orders
            </Typography>
            <TableContainer component={Paper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="left">DATE</TableCell>
                    <TableCell align="left">TOTAL</TableCell>
                    <TableCell align="left">DELIVERED</TableCell>
                    <TableCell align="left">PAID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell component="th" scope="row">
                        <Link href={`/order/${order._id}`}>{order._id}</Link>
                      </TableCell>
                      <TableCell align="left">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="left">${order.total}</TableCell>
                      <TableCell align="left">
                        {order.delivered ? (
                          <CheckCircleIcon color="secondary" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {order.paid ? (
                          <CheckCircleIcon color="secondary" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile;
