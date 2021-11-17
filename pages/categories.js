import Head from "next/head";
import { useContext, useState, Fragment, useEffect } from "react";
import { useRouter } from "next/router";

import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import { DataContext } from "../store/GlobalState";
import { postData, putData, deleteData } from "../utils/fetchData";
import { updateItem, deleteItem } from "../store/Action";
import Modal from "../src/components/Modal";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
    display: "flex",
    alignItems: "center",
  },
  input: {
    margin: theme.spacing(1),
    height: 40,
  },
  submit: {
    margin: theme.spacing(1),
    height: 40,
    marginTop: 15,
  },
  // loading: {
  //   color: "white",
  // },
}));

const Categories = () => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const { state, dispatch } = useContext(DataContext);
  const { auth, categories } = state;
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.user.role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Authentication is not valid" },
      });

    if (!name)
      dispatch({
        type: "NOTIFY",
        payload: { error: "Name can't be left blank." },
      });

    dispatch({
      type: "NOTIFY",
      payload: { loading: true },
    });

    let res;

    if (id) {
      res = await putData(`categories/${id}`, { name }, auth.token);
      if (res.err)
        return dispatch({
          type: "NOTIFY",
          payload: { error: res.err },
        });
      dispatch(updateItem(categories, res.category, id, "ADD_CATEGORIES"));
    } else {
      res = await postData("categories", { name }, auth.token);
      if (res.err)
        return dispatch({
          type: "NOTIFY",
          payload: { error: res.err },
        });
      dispatch({
        type: "ADD_CATEGORIES",
        payload: [...categories, res.newCategory],
      });
    }

    setName("");
    setId("");
    return dispatch({
      type: "NOTIFY",
      payload: { success: res.msg },
    });
  };

  const handleUpdateCategory = (category) => {
    setId(category._id);
    setName(category.name);
  };

  const handleDeleteCategory = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    deleteData(`categories/${category}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch(deleteItem(categories, category, "ADD_CATEGORIES"));

      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  useEffect(() => {
    if (auth.token) {
      if (auth?.user?.role !== "admin") {
        router.push("/");
      }
    } else {
      router.push("/signin");
    }
  }, [auth?.user?.role]);

  return (
    <Container maxWidth="md">
      <Head>
        <title>Categories</title>
      </Head>
      <Box my={4}>
        <Modal
          title="Delete Categories"
          open={open}
          setOpen={setOpen}
          handleSubmit={handleDeleteCategory}
        />
        <Grid container direction="column" alignItems="center">
          <Grid item container xs={6}>
            <form className={classes.form} onSubmit={handleSubmit} noValidate>
              <TextField
                size="medium"
                label="Create new categories"
                variant="outlined"
                margin="normal"
                autoFocus={true}
                value={name}
                style={{ flex: 1 }}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  className: classes.input,
                }}
              />

              <Button
                type="submit"
                variant="outlined"
                color="primary"
                className={classes.submit}
                disabled={!name}
              >
                {id ? "Update" : " Create"}
              </Button>
            </form>
          </Grid>
          <Grid item container xs={6}>
            <List style={{ width: "100%" }}>
              <Divider variant="middle" />
              {categories.map((category) => (
                <Fragment key={category._id}>
                  <ListItem>
                    <ListItemText primary={category.name} />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => handleUpdateCategory(category)}
                      >
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setOpen(true);
                          setCategory(category._id);
                        }}
                        edge="end"
                        aria-label="delete"
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="middle" />
                </Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Categories;
