import Head from "next/head";
import { useState, useContext, useRef, useEffect } from "react";
import { useRouter } from "next/router";

import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import ImageGridList from "../../src/components/ImageGridList";
import { DataContext } from "../../store/GlobalState";
import { getData, postData, putData } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";

const initialState = {
  title: "",
  price: 0,
  inStock: 0,
  description: "",
  content: "",
  category: "",
};

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
  input: {
    display: "none",
  },
  root: {
    marginTop: theme.spacing(2),
    width: "100%",
    // "& > *": {
    //   margin: theme.spacing(1),
    // },
  },
}));

const ProductsManager = () => {
  const { state, dispatch } = useContext(DataContext);
  const { auth, categories } = state;
  const [data, setData] = useState(initialState);
  const { title, price, inStock, description, content, category } = data;
  const classes = useStyles();
  const [images, setImages] = useState([]);
  const imgRef = useRef();
  const router = useRouter();
  const { id } = router.query;
  const [onEdit, setOnEdit] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    if (id) {
      setOnEdit(true);
      getData(`product/${id}`).then((res) => {
        setData(res.product);
        setImages(res.product.images);
      });
    } else {
      setOnEdit(false);
      setData(initialState);
      setImages([]);
    }
  }, [id]);

  const handleUploadInput = (e) => {
    let newImages = [];
    let num = 0;
    let err = "";
    const files = [...e.target.files];
    if (files.length <= 0)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "File does not exists." },
      });
    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return (err = "The largest image size is 1mb.");
      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return (err = "Sorry, only JPEG & PNG files are allowed.");

      num += 1;
      if (num <= 5) newImages.push(file);
      return newImages;
    });

    if (err)
      return dispatch({
        type: "NOTIFY",
        payload: { error: err },
      });
    const imgCount = images.length;
    if (imgCount + newImages.length > 5)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Select up to 5 images" },
      });

    setImages([...images, ...newImages]);
  };

  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    imgRef.current.value = "";
    setImages(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth?.user?.role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Authentication is not valid" },
      });

    if (
      !title ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      !category ||
      images.length === 0
    )
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Please add all of fields" },
      });

    dispatch({
      type: "NOTIFY",
      payload: { loading: true },
    });
    let media = [];
    const newUrlImg = images.filter((img) => !img.url);
    const oldUrlImg = images.filter((img) => img.url);

    if (newUrlImg.length > 0) media = await imageUpload(newUrlImg);

    let res;
    if (onEdit) {
      res = await putData(
        `product/${id}`,
        { ...data, images: [...oldUrlImg, ...media] },
        auth?.token
      );
      if (res.err)
        return dispatch({
          type: "NOTIFY",
          payload: { error: res.err },
        });
    } else {
      res = await postData(
        `product`,
        { ...data, images: [...oldUrlImg, ...media] },
        auth?.token
      );
      if (res.err)
        return dispatch({
          type: "NOTIFY",
          payload: { error: res.err },
        });
    }

    dispatch({
      type: "NOTIFY",
      payload: { success: res.msg },
    });
  };

  return (
    <Container maxWidth="md">
      <Head>
        <title>Products Manager </title>
      </Head>
      <Box my={4}>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Grid container spacing={4}>
            <Grid item container sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="title"
                label="Title"
                name="title"
                autoComplete="title"
                value={title}
                onChange={handleInputChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                id="price"
                label="Price"
                name="price"
                autoComplete="price"
                style={{ width: "49%" }}
                value={price}
                onChange={handleInputChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                id="inStock"
                label="InStock"
                name="inStock"
                autoComplete="inStock"
                style={{ width: "49%", marginLeft: "auto" }}
                value={inStock}
                onChange={handleInputChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                name="description"
                autoComplete="description"
                multiline
                rows={4}
                value={description}
                onChange={handleInputChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="content"
                label="Content"
                name="content"
                autoComplete="content"
                multiline
                rows={6}
                value={content}
                onChange={handleInputChange}
              />
              <TextField
                select
                fullWidth
                margin="normal"
                label="Select"
                value={category}
                name="category"
                onChange={handleInputChange}
                helperText="Please select category"
                variant="outlined"
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item container sm={6}>
              <div className={classes.root}>
                <input
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={handleUploadInput}
                  ref={imgRef}
                />
                <label htmlFor="contained-button-file">
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Product Images
                  </Button>
                </label>
              </div>
              <ImageGridList images={images} deleteImage={deleteImage} />
            </Grid>
          </Grid>
          <Button type="submit" color="secondary" variant="contained">
            {onEdit ? "Update" : "Create"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ProductsManager;
