
## Getting Started

### 1. Fork the repo

  Sign in to your GitHub account and fork the following repo:

  ```
  https://github.com/rroyson/instruments-api-mock-exam
  ```

### 2. Clone your fork

  Clone your fork to your local machine and install the project's dependencies.

  ```
  $ git clone <url>
  $ cd instruments-api-mock-exam
  $ yarn
  ```

### 3. Establishing Environment Variables

  Look at the `.env-sample` file for a guide.

  | Value          | Description           
  | -------------  |:-------------:
  | COUCHDB_URL    | This link is composed of your api `key`, `password`, and `base-url`.  
  | COUCHDB_NAME   | This will be the name of your api  
  | PORT           | This describes the port in which your api will run. The api will start on port 4000 by default.  

  Once correctly set up `yarn start` will start your api.

### 4. Load data

  - To load current data via `bulkDocs` in your command line type: `yarn load`.  

  - To add and customize your own data navigate to `load-data.js` and put your data in the `bulkDocs` function.  

  - After loading `yarn load` to update your database with the new documents

### 5. Load indexes

  To load indexes, navigate to your command line and type: `yarn loadIndex`
  This will load all indexes for the project.

### 6. Start the API

    Run `yarn start` in your terminal to start the api.  The api will start on port 4000 by default.  
