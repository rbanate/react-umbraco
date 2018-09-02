## Dependencies

- The Umbraco API should be running and update `src\utils\constants.js` to indicate the URL to use
  ```
  export const UMBRACO_URL = 'http://umbraco.local';
  const UMBRACO_API = `${UMBRACO_URL}/api/identityapi/`;
  ```

## Running this Project

- run `npm start` - Development mode
- run `npm build` - builds this project for production and creates a folder `build`, once finished
  - run `serve -s build` then follow instructions on the console

## Umbraco User

- username `react@test.com`
- password `reactumbraco`
