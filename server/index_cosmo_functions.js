const { CosmosClient } = require("@azure/cosmos");
const mysql = require('mysql');
const fs = require('fs');

const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

const endpoint = "https://stariotgroup.documents.azure.com:443";
const key = "jaPZrdJ0bo86jDGVXgdW9BSbJcT3benNrBgOSlq3e0KzCgpWm25zLDAXnIR1Em5Ndm4qdzKsLjqKACDbMlQF0Q==";
const client = new CosmosClient({ endpoint, key });
const container = client.database("stariot").container("stariot001");

async function readData(res){
    const querySpec = {
        query: 'SELECT * FROM stariot ORDER BY stariot.date_time'
      };
    const queryOptions = {
        maxItemCount: -1
      };
    const { resources: items } = await container.items.query(querySpec, queryOptions).fetchAll();

    console.log('Selected ' + items.length + ' row(s).');
    for (i = 0; i < items.length; i++) {
      console.log('Row: ' + JSON.stringify(items[i]));
    }
    res.json(items);
    console.log('Done.');
};

function calculateMedian(values) {
  const middleIndex = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    // If there are an even number of values, take the average of the middle two values
    return (values[middleIndex - 1] + values[middleIndex]) / 2;
  } else {
    // If there are an odd number of values, take the middle value
    return values[middleIndex];
  }
}

//This median+interquartile filtering system takes ALL data of each bird for now
async function readBirdData(bird_id, res, deviationFactor){
  const querySpec = {
    query: `SELECT * FROM stariot WHERE stariot.rfid_tag = '${bird_id}' ORDER BY stariot.date_time`
  };
  const queryOptions = {
    maxItemCount: -1
  };
  const { resources: items } = await container.items.query(querySpec, queryOptions).fetchAll();

  console.log('Selected ' + items.length + ' row(s).');

  const values = items.map(item => item.result);

  //Calculate median
  median = 0;
  const middleIndex = Math.floor(values.length / 2);

  //Calculate quartiles
  const q1 = calculateMedian(values.slice(0, middleIndex));
  const q3 = calculateMedian(values.slice(middleIndex + (values.length % 2 === 0 ? 0 : 1)));

  //apply filter
  values.sort((a, b) => a - b);
  const iqr = q3 - q1;

  const lowerBound = q1 - deviationFactor * iqr;
  const upperBound = q3 + deviationFactor * iqr;

  const trimmedValues = items.filter((value) => value.result >= lowerBound && value.result <= upperBound);

  for (i = 0; i < trimmedValues.length; i++) {
    console.log('Row: ' + JSON.stringify(trimmedValues[i]));
  }
  res.json(trimmedValues);
  console.log('Done.');
};

module.exports = { readData, readBirdData };