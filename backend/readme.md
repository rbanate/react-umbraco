## Dependencies

- An instance of SQL Server (express is enough)
- Restore database
  - restore `db\react-umbraco` into your SQL Server database
- update `web.config` to use the correct connectionstring

  ```
    <connectionStrings>
    <remove name="umbracoDbDSN" />
    <add name="umbracoDbDSN" connectionString="Server=RICARDOBANA3546\SQLEXPRESS;Database=react-umbraco;user=umbraco;password=umbraco" providerName="System.Data.SqlClient" />

    <!-- Important: If you're upgrading Umbraco, do not clear the connection string / provider name during your web.config merge. -->
  </connectionStrings>
  ```

  then save

## Running this Project

- Visual Studio - Open the solution in Visual Studio, run the solution
- Alternatives - you may configure IIS to point to folder where this project is stored. Please make sure to update the connection string as necessary
