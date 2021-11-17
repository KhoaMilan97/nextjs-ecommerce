import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
// import CardHeader from "@material-ui/core/CardHeader";
// import MoreVertIcon from "@material-ui/icons/MoreVert";
// import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";

import Link from "../../Link";
import { DataContext } from "../../../store/GlobalState";
import { addCart } from "../../../store/Action";
import Modal from "../Modal";
import { deleteData } from "../../../utils/fetchData";

const useStyles = makeStyles({
  root: {
    maxWidth: "100%",
  },
  media: {
    height: 240,
  },
  group: {
    display: "flex",
    justifyContent: "space-between",
    margin: "10px 0",
  },
  checkBox: {
    position: "absolute",
    borderRadius: 0,
    width: 20,
    height: 20,
    padding: 0,
    // backgroundColor: "white",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    borderRadius: 3,
    width: 20,
    height: 20,
    boxShadow:
      "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#f5f8fa",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#137cbd",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 20,
      height: 20,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  },
});

export default function ProductItem({ product, handleCheck }) {
  const classes = useStyles();
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;
  const [open, setOpen] = useState(false);

  const [id, setId] = useState(false);
  const router = useRouter();

  const handleDeleteProduct = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    deleteData(`product/${id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      return router.push("/");
    });
  };

  const userLink = () => (
    <>
      <Button
        component={Link}
        href={`/product/${product._id}`}
        size="medium"
        color="primary"
        variant="contained"
        fullWidth
      >
        View
      </Button>
      <Button
        onClick={() => dispatch(addCart(product, cart))}
        size="medium"
        color="secondary"
        disabled={product.inStock === 0 ? true : false}
        variant="contained"
        fullWidth
      >
        Buy
      </Button>
    </>
  );

  const adminLink = (id) => (
    <>
      <Button
        component={Link}
        href={`/create/${product._id}`}
        size="medium"
        color="primary"
        variant="contained"
        fullWidth
      >
        Edit
      </Button>
      <Button
        onClick={() => {
          setOpen(true);
          setId(id);
        }}
        size="medium"
        color="default"
        disabled={product.inStock === 0 ? true : false}
        variant="contained"
        fullWidth
        style={{ backgroundColor: "#ff1744", color: "white" }}
      >
        Delete
      </Button>
    </>
  );

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Modal
        title="Delete product?"
        open={open}
        setOpen={setOpen}
        handleSubmit={handleDeleteProduct}
      />
      <Card className={classes.root}>
        {auth.user && auth.user.role === "admin" && (
          <Checkbox
            checked={product.checked}
            onChange={() => handleCheck(product._id)}
            checkedIcon={
              <span className={clsx(classes.icon, classes.checkedIcon)} />
            }
            icon={<span className={classes.icon} />}
            disableRipple
            className={classes.checkBox}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        )}
        <CardMedia
          className={classes.media}
          image={product.images[0].url}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography
            style={{ textTransform: "capitalize" }}
            gutterBottom
            variant="h5"
            component="h2"
          >
            {product.title}
          </Typography>
          <div className={classes.group}>
            <Typography color="error" component="span">
              ${product.price}
            </Typography>
            <Typography color="error" component="span">
              {product.inStock === 0
                ? "Out Of Stock"
                : `Instock: ${product.inStock}`}
            </Typography>
          </div>
          <Typography variant="body2" color="textSecondary" component="p">
            {product.description.length > 102
              ? product.description.substr(0, 102) + "..."
              : product.description}
          </Typography>
        </CardContent>

        <CardActions style={{ justifyContent: "space-around" }}>
          {auth?.user?.role === "admin" ? adminLink(product._id) : userLink()}
        </CardActions>
      </Card>
    </Grid>
  );
}
