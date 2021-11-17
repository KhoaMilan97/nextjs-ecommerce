import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "../src/Link";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import { ACTIONS } from "../store/Action";

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

const SignIn = () => {
  const classes = useStyles();
  const initialState = { email: "", password: "" };

  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;
  const { state, dispatch } = useContext(DataContext);
  const { notify, auth } = state;
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const errMsg = valid(email, password);
    // if (errMsg) return dispatch({ type: ACTIONS.NOTIFY, payload: { error: errMsg } });

    dispatch({ type: ACTIONS.NOTIFY, payload: { loading: true } });
    const res = await postData("auth/login", userData);

    if (res.err)
      return dispatch({ type: ACTIONS.NOTIFY, payload: { error: res.err } });
    dispatch({ type: ACTIONS.NOTIFY, payload: { success: res.msg } });

    dispatch({
      type: ACTIONS.AUTH,
      payload: { token: res.access_token, user: res.user },
    });

    Cookies.set("refreshtoken", res.refresh_token, {
      path: "api/auth/accessToken",
      expires: 7,
      sameSite: "none",
      secure: true,
    });

    localStorage.setItem("firstLogin", true);
  };

  useEffect(() => {
    if (Object.keys(auth).length > 0) router.push("/");
  }, [auth]);

  return (
    <>
      <Head>
        <title>Sign in Page</title>
      </Head>

      <Container component="main" maxWidth="xs">
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleInputChange}
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
            autoComplete="current-password"
            value={password}
            onChange={handleInputChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
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
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
};

export default SignIn;
