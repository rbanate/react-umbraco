import React from 'react';

import { IdentityContext } from '../ContextProvider';

const Test = () => (
  <div className="green">
    <IdentityContext.Consumer>
      {context => (
        <div>
          <h1>test</h1>
          <p>{context.number}</p>
        </div>
      )}
    </IdentityContext.Consumer>
  </div>
);

export default Test;
