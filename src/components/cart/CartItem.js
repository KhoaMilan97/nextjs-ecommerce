import { useContext, useState } from "react";

import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { IconButton } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Button from "@material-ui/core/Button";

import { DataContext } from "../../../store/GlobalState";
import { increase, decrease, deleteItem } from "../../../store/Action";
import Modal from "../Modal";

const useStyles = makeStyles((theme) => ({
  listImg: {
    marginRight: "10px",
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
  button: {
    minWidth: "50px",
  },
}));

const CartItem = ({ item }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { state, dispatch } = useContext(DataContext);
  const { cart } = state;
  const [open, setOpen] = useState(false);

  const handleDeleteCartItem = () => {
    dispatch(deleteItem(cart, item._id, "ADD_CART"));
  };

  return (
    <>
      <Modal
        title="Delete Cart Item"
        open={open}
        setOpen={setOpen}
        handleSubmit={handleDeleteCartItem}
      />
      <ListItem disableGutters>
        <ListItemAvatar className={classes.listImg}>
          <Avatar
            className={classes.large}
            variant="square"
            alt={item.title}
            src={item.images[0].url}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography style={theme.custom.title}>{item.title}</Typography>
          }
          secondary={
            <>
              <Typography
                component="span"
                variant="body2"
                //className={classes.inline}
                color="error"
              >
                ${item.price}
              </Typography>
              <Typography
                component="span"
                color="secondary"
                style={{ display: "block" }}
              >
                {" In stock: " + item.inStock}
              </Typography>
            </>
          }
        />

        <ListItemSecondaryAction>
          <Button
            onClick={() => dispatch(decrease(cart, item._id))}
            className={classes.button}
            variant="outlined"
            disabled={item.quantity === 1 ? true : false}
          >
            &#8211;
          </Button>
          <Typography
            componet="span"
            style={{ display: "inline", margin: "0 15px" }}
          >
            {item.quantity}
          </Typography>
          <Button
            onClick={() => dispatch(increase(cart, item._id))}
            className={classes.button}
            variant="outlined"
            disabled={item.quantity === item.inStock ? true : false}
          >
            +
          </Button>
          <IconButton
            onClick={() => setOpen(true)}
            style={{ marginLeft: "3rem" }}
          >
            <DeleteForeverIcon color="error" />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider component="li" />
    </>
  );
};

export default CartItem;
