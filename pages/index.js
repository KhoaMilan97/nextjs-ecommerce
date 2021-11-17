import React, { useState, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";

import { deleteData, getData } from "../utils/fetchData";
import ProductItem from "../src/components/product/ProductItem";
import { DataContext } from "../store/GlobalState";
import Modal from "../src/components/Modal";

export default function Index(props) {
  const [products, setProducts] = useState(props.products);
  const [isCheck, setIsCheck] = useState(false);
  const { state, dispatch } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const { auth } = state;
  const router = useRouter();

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });

    setProducts([...products]);
  };

  const handleCheckAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });

    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const handleDeleteAllProduct = () => {
    let productDelete = [];
    products.forEach((product) => {
      if (product.checked) {
        productDelete.push(product);
      }
    });

    if (productDelete.length > 0) {
      dispatch({ type: "NOTIFY", payload: { loading: true } });
      for (let product of productDelete) {
        deleteData(`product/${product._id}`, auth.token).then((res) => {
          if (res.err)
            return dispatch({ type: "NOTIFY", payload: { error: res.err } });
          dispatch({ type: "NOTIFY", payload: { success: res.msg } });
        });
      }

      return router.push("/");
    }
  };

  return (
    <Container maxWidth="md">
      <Head>
        <title>Home Page</title>
      </Head>
      <Modal
        title="Delete All Product?"
        open={open}
        setOpen={setOpen}
        handleSubmit={handleDeleteAllProduct}
      />
      <Box my={4}>
        {auth.user && auth.user.role === "admin" && (
          <FormGroup row style={{ marginBottom: "20px" }}>
            <Checkbox checked={isCheck} onChange={handleCheckAll} />
            <Button
              onClick={() => {
                if (isCheck) {
                  setOpen(true);
                }
              }}
              variant="contained"
              color="secondary"
            >
              Delete All
            </Button>
          </FormGroup>
        )}
        {products.length === 0 ? (
          <Typography component="h2" variant="h2">
            No Products
          </Typography>
        ) : (
          <Grid container justify="space-between" spacing={2}>
            {products.map((product) => (
              <ProductItem
                key={product._id}
                product={product}
                handleCheck={handleCheck}
              />
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export async function getServerSideProps() {
  const page = query.page || 1;
  const category = query.category || "all";
  const sort = query.sort || "";
  const search = query.search || "all";

  const res = await getData("product");

  return {
    props: {
      products: res.products,
      result: res.result,
    }, // will be passed to the page component as props
  };
}

// 20:10min
