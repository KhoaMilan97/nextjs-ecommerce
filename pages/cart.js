import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";

import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import AddShoppingCartOutlinedIcon from "@material-ui/icons/AddShoppingCartOutlined";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";

import { DataContext } from "../store/GlobalState";
import Link from "../src/Link";
import CartItem from "../src/components/cart/CartItem";
import { getData, postData } from "../utils/fetchData";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "80vh",
  },
  list: {
    width: "100%",
    //maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  form: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const Cart = () => {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth, orders } = state;
  const classes = useStyles();
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [callback, setCallback] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price * currentValue.quantity;
      }, 0);
      setTotal(res);
    };
    getTotal();
  }, [cart]);

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem("__NEXT__CART__MILAN__"));
    if (cartLocal && cartLocal.length > 0) {
      let newArr = [];
      const updateCart = async () => {
        for (const item of cartLocal) {
          const res = await getData(`product/${item._id}`);
          const { _id, title, images, inStock, price, sold } = res.product;
          if (inStock > 0) {
            newArr.push({
              _id,
              title,
              images,
              inStock,
              price,
              sold,
              quantity: item.inStock > inStock ? 1 : item.quantity,
            });
          }
        }

        dispatch({ type: "ADD_CART", payload: newArr });
      };
      updateCart();
    }
  }, [dispatch, callback]);

  const handlePayment = async () => {
    if (!address || !mobile)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Please add your address and mobile." },
      });
    const newCart = [];
    for (let item of cart) {
      const res = await getData(`product/${item._id}`);
      if (res.product.inStock - item.quantity >= 0) {
        newCart.push(item);
      }
    }

    if (newCart.length < cart.length) {
      setCallback(!callback);
      return dispatch({
        type: "NOTIFY",
        payload: {
          error: "The product is out of stock or the quantity is insufficient.",
        },
      });
    }
    dispatch({
      type: "NOTIFY",
      payload: { loading: true },
    });

    postData("order", { address, mobile, cart, total }, auth.token).then(
      (res) => {
        if (res.err)
          return dispatch({
            type: "NOTIFY",
            payload: { error: res.err },
          });
        dispatch({ type: "ADD_CART", payload: [] });
        dispatch({
          type: "ADD_ORDER",
          payload: [...orders, res.newOrder],
        });
        dispatch({
          type: "NOTIFY",
          payload: { success: res.msg },
        });
        return router.push(`/order/${res.newOrder._id}`);
      }
    );
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth="md">
        <Head>
          <title>Cart Pages</title>
        </Head>
        <Grid
          container
          className={classes.root}
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <AddShoppingCartOutlinedIcon
              style={{ width: "100%", fontSize: "15rem", fontWeight: "normal" }}
              color="secondary"
            />
            <Typography align="center" variant="body1">
              There is no item in here
            </Typography>
            <Button
              component={Link}
              href="/"
              variant="contained"
              color="primary"
              style={{
                marginTop: "10px",
                marginLeft: "50%",
                transform: "translateX(-50%)",
              }}
            >
              SHOP NOW
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container component={Box} my={4} maxWidth="md">
      <Head>
        <title>Cart Pages</title>
      </Head>

      <Grid container spacing={4}>
        <Grid item sm={8}>
          <Typography variant="h4" component="h2">
            Shopping Cart
          </Typography>
          <List className={classes.list}>
            <Divider component="li" />
            {cart.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </List>
        </Grid>
        <Grid item sm={4}>
          <Typography variant="h4" component="h2">
            Shipping
          </Typography>
          <form className={classes.form} autoComplete="on" noValidate>
            <TextField
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              label="Address"
              variant="outlined"
            />
            <TextField
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              fullWidth
              label="Mobile"
              variant="outlined"
            />
          </form>
          <Typography variant="h5" align="right">
            TOTAL: <span style={{ color: "blueviolet" }}>${total}</span>
          </Typography>

          <Button
            component={Link}
            href={auth.user ? "#!" : "/signin"}
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handlePayment}
          >
            PROCEED WITH PAYMENT
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
