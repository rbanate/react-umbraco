import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';

import { cleanJson } from '../utils/stringUtils';
import { UMBRACO_URL, NOT_SET } from '../utils/constants';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    marginTop: '20px',
  },

  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

const DocumentsViewer = props => {
  const { classes, title, data } = props;
  console.log(data.length === 0);
  return (
    <div className={classes.root}>
      <GridList cellHeight={180}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">
            {data.length === 0 ? `${title} ${NOT_SET}` : title}
          </ListSubheader>
        </GridListTile>

        {data.map(doc => {
          const cleaned = cleanJson(doc);
          return (
            <GridListTile key={cleaned.src}>
              {cleaned.src.includes('.pdf') ? (
                <a href={`${UMBRACO_URL}${cleaned.src}`} target="_blank" rel="noopener noreferrer">
                  {`${UMBRACO_URL}${cleaned.src}`}
                </a>
              ) : (
                <img src={`${UMBRACO_URL}${cleaned.src}`} alt={cleaned.src} />
              )}
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
