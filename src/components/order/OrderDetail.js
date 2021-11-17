import React from "react";

import Alert from "@material-ui/lab/Alert";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import Link from "../../Link";
import PaypalBtn from "../PaypalBtn";
import { patchData } from "../../../utils/fetchData";
import { updateItem } from "../../../store/Action.js";

const useStyles = makeStyles((theme) => ({
  listItemText: {
    "& span": {
      fontSize: "14px",
      color: theme.palette.grey[600],
    },
  },
}));

const OrderDetail = ({ detailOrder, state, dispatch }) => {
  const classes = useStyles();
  const { auth, orders } = state;

  const handleDelivered = (order) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData(`order/delivered/${order._id}`, null, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch(updateItem(orders, res.newOrder, order._id, "ADD_ORDER"));
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  return (
    <>
      {detailOrder.map((order) => (
        <React.Fragment key={order._id}>
          <Grid item sm={8}>
            <List key={order._id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography color="textPrimary" variant="h5">
                      {order._id}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography
                      color="textSecondary"
                      variant="h5"
                      style={{ marginTop: "10px" }}
                    >
                      SHIPPING
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className={classes.listItemText}
                  primary={`NAME: ${order.user.name}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className={classes.listItemText}
                  primary={`EMAIL: ${order.user.email}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className={classes.listItemText}
                  primary={`ADDRESS: ${order.address}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className={classes.listItemText}
                  primary={`MOBILE: ${order.mobile}`}
                />
              </ListItem>
              <ListItem>
                {order.delivered ? (
                  <Alert
                    style={{ marginTop: "5px", width: "100%" }}
                    severity="success"
                  >
                    Delivered on {order.updatedAt}
                  </Alert>
                ) : (
                  <Alert
                    style={{ marginTop: "5px", width: "100%" }}
                    severity="error"
                    action={
                      auth.user.role === "admin" &&
                      !order.delivered && (
                        <Button
                          onClick={() => handleDelivered(order)}
                          color="inherit"
                          size="small"
                        >
                          Mark as delivered
                        </Button>
                      )
                    }
                  >
                    Not Delivered!
                  </Alert>
                )}
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={
                    <Typography
                      color="textSecondary"
                      variant="h5"
                      style={{ marginTop: "10px" }}
                    >
                      PAYMENT
                    </Typography>
                  }
                />
              </ListItem>
              {order.method && (
                <ListItem>
                  <ListItemText
                    className={classes.listItemText}
                    primary={`METHOD: ${order.method}`}
                  />
                </ListItem>
              )}
              {order.paymentId && (
                <ListItem>
                  <ListItemText
                    className={classes.listItemText}
                    primary={`PaymentId: ${order.paymentId}`}
                  />
                </ListItem>
              )}

              <ListItem>
                {order.paid ? (
                  <Alert
                    style={{ marginTop: "5px", width: "100%" }}
                    severity="success"
                  >
                    Paid on {order.dateOfPayment}
                  </Alert>
                ) : (
                  <Alert
                    style={{ marginTop: "5px", width: "100%" }}
                    severity="error"
                  >
                    Not Paid!
                  </Alert>
                )}
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography
                      color="textSecondary"
                      variant="h5"
                      style={{ marginTop: "10px" }}
                    >
                      ORDER ITEM
                    </Typography>
                  }
                />
              </ListItem>

              {order.cart.map((item) => (
                <React.Fragment key={item._id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar
                        variant="square"
                        alt={item.title}
                        src={item.images[0].url}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Link
                          style={{
                            textTransform: "uppercase",
                            color: "#0000008a",
                            fontWeight: "500",
                          }}
                          href={`/product/${item._id}`}
                        >
                          {item.title}
                        </Link>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Typography color="primary">
                        {item.quantity} x ${item.price} = $
                        {item.quantity * item.price}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="middle" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Grid>
          {!order.paid && auth?.user?.role !== "admin" && (
            <Grid item sm={4}>
              <List>
                <ListItem>
                  <ListItemText
                    style={{ textAlign: "center" }}
                    primary={
                      <Typography variant="h5" color="error">
                        TOTAL: ${order.total}
                      </Typography>
                    }
                  />
                </ListItem>
                <PaypalBtn order={order} />
              </List>
            </Grid>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default OrderDetail;
