import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";

import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Grid from "@material-ui/core/Grid";

import { DataContext } from "../../store/GlobalState";
import OrderDetail from "../../src/components/order/OrderDetail";

const DetailOrder = () => {
  const { state, dispatch } = useContext(DataContext);
  const { orders, auth } = state;

  const router = useRouter();
  const [detailOrder, setDetailOrder] = useState([]);

  useEffect(() => {
    let newOrder = orders.filter((order) => order._id === router.query.id);
    setDetailOrder(newOrder);
  }, [orders, router.query.id]);

  if (!auth.user) return null;

  return (
    <Container maxWidth="md">
      <Head>
        <title>Detail Order</title>
      </Head>

      <Box my={4}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>

        <Grid
          spacing={3}
          container
          direction="row"
          justify="center"
          style={{ marginTop: "20px" }}
        >
          <OrderDetail
            detailOrder={detailOrder}
            state={state}
            dispatch={dispatch}
          />
        </Grid>
      </Box>
    </Container>
  );
};

export default DetailOrder;
