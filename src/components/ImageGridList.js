import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(2),
  },
  gridList: {
    width: "100%",
    height: "auto",
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  icon: {
    color: "white",
  },
}));

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *     cols: 2,
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
export default function ImageGridList({ images, deleteImage }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList cellHeight={100} className={classes.gridList} cols={4}>
        {images.map((image, index) => (
          <GridListTile
            key={index}
            cols={index === 0 ? 4 : 1}
            rows={index === 0 ? 4 : 1}
          >
            <img
              src={image.url ? image.url : URL.createObjectURL(image)}
              alt="list"
            />
            <GridListTileBar
              titlePosition="top"
              actionIcon={
                <IconButton
                  onClick={() => deleteImage(index)}
                  className={classes.icon}
                >
                  <ClearIcon />
                </IconButton>
              }
              actionPosition="right"
              className={classes.titleBar}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
