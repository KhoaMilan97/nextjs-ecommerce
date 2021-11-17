import Head from "next/head";
import { useContext, useState } from "react";

import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import { DataContext } from "../store/GlobalState";
import Link from "../src/Link";
import Modal from "../src/components/Modal";
import { deleteData } from "../utils/fetchData";
import { deleteItem } from "../store/Action";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  imgFluid: {
    width: 50,
  },
  text: {
    transform: "tranSlateY(-35%)",
    display: "inline-block",
    color: theme.palette.secondary.main,
  },
}));

const Users = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(DataContext);
  const { users, auth } = state;
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");

  const handleDeleteUser = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    deleteData(`user/${user._id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch(deleteItem(users, user._id, "ADD_USER"));

      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  if (!auth.user) return null;

  return (
    <Container maxWidth="md">
      <Head>
        <title>Users</title>
      </Head>
      <Modal
        title="Delete User"
        open={open}
        setOpen={setOpen}
        handleSubmit={handleDeleteUser}
      />
      <Box my={4}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="left">Avatar</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Admin</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row, index) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">
                    <img
                      className={classes.imgFluid}
                      src={row.avatar}
                      alt={row.name}
                    />
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">
                    {row.role === "admin" ? (
                      row.root ? (
                        <>
                          <CheckCircleIcon color="secondary" />{" "}
                          <span className={classes.text}>Root</span>
                        </>
                      ) : (
                        <CheckCircleIcon color="secondary" />
                      )
                    ) : (
                      <HighlightOffIcon color="error" />
                    )}
                  </TableCell>
                  <TableCell align="left">
                    <IconButton
                      component={Link}
                      href={
                        auth.user.root && auth.user.email !== row.email
                          ? `/edit-user/${row._id}`
                          : `#!`
                      }
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        if (auth.user.root && auth.user.email !== row.email)
                          setOpen(true);
                        setUser(row);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Users;
