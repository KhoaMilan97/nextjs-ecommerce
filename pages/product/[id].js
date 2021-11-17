import Head from "next/head";
import { useState, useContext } from "react";
import clsx from "clsx";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { getData } from "../../utils/fetchData";
import { DataContext } from "../../store/GlobalState";
import { addCart } from "../../store/Action";

const useStyles = makeStyles((theme) => ({
  image: {
    display: "block",
    width: "100%",
    height: "350px",
    borderRadius: "5px",
    objectFit: "cover",
  },
  imageList: {
    display: "inline-block",
    maxWidth: "100%",
    height: "80px",
    width: "20%",
    padding: "5px",
    marginTop: "5px",
    lineHeight: "1.42857143",
    backgroundColor: " #fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    //marginLeft: "4px",
    "&:hover": {
      cursor: "pointer",
    },
    "&:first-child": {
      marginLeft: 0,
    },
  },
  active: {
    border: "1px solid #556cd6",
  },
}));

const ProductDetail = (props) => {
  const [product] = useState(props.product);
  const [tab, setTab] = useState(0);
  const classes = useStyles();
  const { state, dispatch } = useContext(DataContext);
  const { cart } = state;

  return (
    <Container maxWidth="md">
      <Head>
        <title>Product Details</title>
      </Head>
      <Box my={4}>
        <Grid container spacing={2}>
          <Grid item sm={7}>
            <img
              src={product.images[tab].url}
              alt={product.title}
              className={classes.image}
            />
            <Grid container>
              {product.images.map((image, index) => (
                <img
                  className={clsx(
                    classes.imageList,
                    index === tab && classes.active
                  )}
                  src={image.url}
                  key={image.public_id}
                  onClick={() => setTab(index)}
                  alt="preivew"
                />
              ))}
            </Grid>
          </Grid>
          <Grid item sm={5}>
            <Typography
              variant="h5"
              component="h2"
              style={{ textTransform: "uppercase" }}
            >
              {product.title}
            </Typography>
            <Typography
              style={{ fontSize: "25px" }}
              color="error"
              variant="button"
            >
              ${product.price}
            </Typography>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="secondary" component="span">
                In stock: {product.inStock}
              </Typography>
              <Typography color="secondary" component="span">
                Sold: {product.sold}
              </Typography>
            </div>
            <Typography component="p" style={{ marginTop: 10 }} varinat="body1">
              {product.description}
            </Typography>
            <Typography component="p" style={{ marginTop: 10 }} varinat="body2">
              {product.content}
            </Typography>
            <Button
              style={{ marginTop: 10 }}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => dispatch(addCart(product, cart))}
              disabled={product.inStock === 0 ? true : false}
            >
              Buy
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  const res = await getData(`product/${id}`);

  return {
    props: {
      product: res.product,
    },
  };
};

export default ProductDetail;
