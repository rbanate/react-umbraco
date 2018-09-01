import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import { cleanJson } from '../utils/stringUtils';
import { UMBRACO_URL } from '../utils/constants';
// import tileData from './tileData';

// const tileData = [
//   {
//     img: 'http://umbraco.local/media/1001/3401688_vendor_pic.jpg',
//     title: 'test',
//     author: 'test',
//   },
//   {
//     img: 'http://umbraco.local/media/1001/3401688_vendor_pic.jpg',
//     title: 'test',
//     author: 'test',
//   },
//   {
//     img: 'http://umbraco.local/media/1001/3401688_vendor_pic.jpg',
//     title: 'test',
//     author: 'test',
//   },
// ];

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

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
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
const DocumentsViewer = props => {
  const { classes, title, data } = props;

  /* eslint no-eval: "off" */
  /* eslint-env browser */
  /* TODO: Should not use eval */

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">{title}</ListSubheader>
        </GridListTile>
        {data.map(doc => {
          const cleaned = cleanJson(doc);
          return (
            <GridListTile key={cleaned.src}>
              <img src={`${UMBRACO_URL}${cleaned.src}`} alt={cleaned.src} />
              {/* <GridListTileBar
              title={doc.Filename}

            /> */}
            </GridListTile>
          );
        })}
      </GridList>
    </div>
  );
};

DocumentsViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default withStyles(styles)(DocumentsViewer);
