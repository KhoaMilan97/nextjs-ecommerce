import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";

import Link from "../src/Link";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import valid from "../utils/valid";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(5),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loading: {
    color: "white",
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const initialState = { name: "", email: "", password: "", cf_password: "" };

  const [userData, setUserData] = useState(initialState);
  const { name, email, password, cf_password } = userData;
  const { state, dispatch } = useContext(DataContext);
  const { notify, auth } = state;
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = valid(name, email, password, cf_password);
    if (errMsg) return dispatch({ type: "NOTIFY", payload: { error: errMsg } });

    dispatch({ type: "NOTIFY", payload: { loading: true } });
    const res = await postData("auth/register", userData);

    if (res.err)
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });

    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  useEffect(() => {
    if (Object.keys(auth).length > 0) router.push("/");
  }, [auth]);

  return (
    <>
      <Head>
        <title>Sign up Page</title>
      </Head>
      <Container component="main" maxWidth="xs">
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            value={name}
            onChange={handleInputChange}
            autoComplete="name"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={email}
            onChange={handleInputChange}
            autoComplete="email"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={handleInputChange}
            autoComplete="current-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="cf_password"
            label="Confirm Password"
            type="password"
            id="cf_password"
            value={cf_password}
            onChange={handleInputChange}
            autoComplete="confirm-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            endIcon={
              notify.loading && (
                <CircularProgress className={classes.loading} size="20px" />
              )
            }
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link href="/signin" variant="body2">
                {"Already have an account? Sign in"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
};

export default SignUp;
