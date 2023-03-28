const { CosmosClient } = require("@azure/cosmos");
const fs = require('fs');
const json2csv = require('json2csv').parse;
const csvWriter = require('csv-writer').createObjectCsvStringifier;

const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

const endpoint = "https://stariotgroup.documents.azure.com:443";
const key = "jaPZrdJ0bo86jDGVXgdW9BSbJcT3benNrBgOSlq3e0KzCgpWm25zLDAXnIR1Em5Ndm4qdzKsLjqKACDbMlQF0Q==";
const client = new CosmosClient({ endpoint, key });
const container = client.database("stariot").container("stariot001");

const httpPORT = 5500;

async function listDatabases() {
  const { resources } = await client.databases.readAll().fetchAll();
  return resources;
}


listDatabases().then((databases) => {
  console.log("Here are all the databases");
  console.log(databases);
}).catch((error) => {
  console.error(error);
});


async function download(item) {
  try {
    // Fetch data from database
    const data = item;

    // Convert JSON to CSV
    const csvString = json2csv(data);

    // Set the file path for saving the CSV file
    const filePath = './data.csv';

    // Write the CSV string to a file
    fs.writeFileSync(filePath, csvString, 'utf-8');

    // Send the CSV file as a response to download
    //res.download(filePath);

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};


async function allItems() {
  const { resources } = await container.items
    .query("SELECT * from stariot")
  .    fetchAll();
  for (let i = 0; i < 5; i++) {
    console.log(stariot.id);
  }
}

async function queryAllItems() {
    const querySpec = {
      query: 'SELECT * FROM stariot'
    };
    const queryOptions = {
      maxItemCount: -1
    };
  
    const { resources } = await container.items.query(querySpec, queryOptions).fetchAll();
    return resources;
  }



  // queryAllItems().then((items) => {
  //   console.log(items);
  // }).catch((error) => {
  //   console.error(error);
  // });

  queryAllItems().then((items) => {
    console.log("downloading data");
    download(items);
  })

const queryAllContainers = async () => {
    const querySpec = {
        query: 'SELECT * FROM stariot'
      };
      const queryOptions = {
        maxItemCount: -1
      };
    
    const database = client.database("stariot");
    const {resources} = await database.containers.query(querySpec, queryOptions).fetchAll();
    return resources;
};

queryAllContainers().then((containers) => {
    console.log("Here are all the containers");
    console.log(containers);
  }).catch((error) => {
    console.error(error);
  });

  app.listen(httpPORT, () => {
    console.log("Server running on port 5500");
  });
