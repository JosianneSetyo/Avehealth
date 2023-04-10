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

const azurePORT = 3306;

var config =
{
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE,
    port: azurePORT,
    ssl: {ca: fs.readFileSync("certificate/DigiCertGlobalRootCA.crt.pem")}
};

const conn = new mysql.createConnection(config);

conn.connect(
  function (err) { 
  if (err) { 
      console.log("!!! Cannot connect !!! Error:");
      throw err;
  }
  else
  {
     console.log("Connection established.");
  }
});


async function readData(res){
    const querySpec = {
        query: 'SELECT * FROM stariot WHERE NOT IS_NULL(stariot.rfid_tag) ORDER BY stariot.date_time'
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
  console.log(middleIndex)
  if (values.length % 2 === 0) {
    // If there are an even number of values, take the average of the middle two values
    return (values[middleIndex - 1] + values[middleIndex]) / 2;
  } else {
    // If there are an odd number of values, take the middle value
    return values[middleIndex];
  }
}

function returnFiltered(items, deviationFactor) {
  const values = items.map(item => item.result);
  values.sort((a, b) => a - b);
  //Calculate median
  median = 0;
  const middleIndex = Math.floor(values.length / 2);
  console.log(middleIndex)

  //Calculate quartiles
  const q1 = calculateMedian(values.slice(0, middleIndex));
  const q3 = calculateMedian(values.slice(middleIndex + (values.length % 2 === 0 ? 0 : 1)));
  //apply filter
  const iqr = q3 - q1;
  console.log(iqr)

  const lowerBound = q1 - deviationFactor * iqr;
  const upperBound = q3 + deviationFactor * iqr;
  console.log(q3)
  const trimmedValues = items.filter((value) => value.result >= lowerBound && value.result <= upperBound);

  return trimmedValues;
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


  const trimmedValues = returnFiltered(items, deviationFactor);
  
  for (i = 0; i < trimmedValues.length; i++) {
    console.log('Row: ' + JSON.stringify(trimmedValues[i]));
  }
  res.json(trimmedValues);
  console.log('Done.');
};

async function getWeightedAverage(bird_id, param, res){
  const date = new Date();
  const offsetDate = new Date(date);
  offsetDate.setDate(date.getDate() - param); // subtract 'param' days from current date

  // set time of 'offsetDate' to midnight
  offsetDate.setHours(0, 0, 0, 0);
  console.log(offsetDate)
  const querySpec = {
    query: `SELECT *
            FROM stariot 
            WHERE stariot.rfid_tag = '${bird_id}'
            AND DateTimeDiff("dd", stariot.date_time, GetCurrentDateTime()) = ${param}`
  };
  const queryOptions = {
    maxItemCount: -1
  };
  const { resources: items } = await container.items.query(querySpec, queryOptions).fetchAll();

  console.log('Selected ' + items.length + ' row(s).');

  const values = items.map(item => item.result);

  let sum = 0;
  values.forEach(value => {
    sum += value;
  });

  const average = sum / values.length;
  console.log('Average: ' + average);
  
  res.json(average);
  console.log('Done.');
};

function readComment(bird_id, req, res){
  conn.query(`SELECT * FROM db1.specialRequest WHERE bird_id = '${bird_id}'`,
      function (err, results, fields) {
          if (err) throw err;
          else console.log('Selected ' + results.length + ' row(s).');
          for (i = 0; i < results.length; i++) {
              console.log('Row: ' + JSON.stringify(results[i]));
          }
          res.json(results);
          console.log('Done.');
      })
};

function writeComment(values){
  conn.query('INSERT INTO db1.specialRequest (bird_id, special_request) VALUES (?, ?) ON DUPLICATE KEY UPDATE bird_id=VALUES(bird_id), special_request=VALUES(special_request);', values,
      function (err, results) {
          if (err) throw err;
          else console.log('Inserted ' + results.affectedRows + ' row(s).');
          for (i = 0; i < results.length; i++) {
              console.log('Row: ' + JSON.stringify(results[i]));
          }
          console.log('Done.');
      })
};

function readTreatment(bird_id, req, res){
  conn.query(`SELECT * FROM db1.treatment WHERE bird_id = '${bird_id}'`,
      function (err, results, fields) {
          if (err) throw err;
          else console.log('Selected ' + results.length + ' row(s).');
          for (i = 0; i < results.length; i++) {
              console.log('Row: ' + JSON.stringify(results[i]));
          }
          res.json(results);
          console.log('Done.');
      })
};

function countTreatment(bird_id, req, res){
  conn.query(`SELECT COUNT (*) FROM db1.treatment WHERE bird_id = '${bird_id}'`,
      function (err, results, fields) {
          if (err) throw err;
          else console.log('Selected ' + results.length + ' row(s).');
          for (i = 0; i < results.length; i++) {
              console.log('Row: ' + JSON.stringify(results[i]));
          }
          res.json(results);
          console.log('Done.');
      })
};

function deleteTreatment(bird_id, req, res){
  conn.query(`DELETE FROM db1.treatment WHERE bird_id = '${bird_id}'`,
      function (err, results) {
          if (err) throw err;
          else console.log('Inserted ' + results.affectedRows + ' row(s).');
          for (i = 0; i < results.length; i++) {
              console.log('Row: ' + JSON.stringify(results[i]));
          }
          res.json(results);
          console.log('Done.');
      })
};

function addTreatment(values){
  conn.query('INSERT INTO db1.treatment (clock, bird_id, medication, dose, amount, route, duration, remaining_duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?);', values,
      function (err, results) {
          if (err) throw err;
          else console.log('Inserted ' + results.affectedRows + ' row(s).');
          for (i = 0; i < results.length; i++) {
              console.log('Row: ' + JSON.stringify(results[i]));
          }
          console.log('Done.');
      })
};

function patchTreatment(bird_id, remaining_duration, req, res){
  conn.query(`UPDATE db1.treatment SET remaining_duration = '${remaining_duration}' WHERE bird_id = '${bird_id}'`,
      function (err, results) {
          if (err) throw err;
          else console.log('Inserted ' + results.affectedRows + ' row(s).');
          for (i = 0; i < results.length; i++) {
              console.log('Row: ' + JSON.stringify(results[i]));
          }
          res.json(results);
          console.log('Done.');
      })
};











module.exports = { readData, readBirdData, readComment, writeComment, readTreatment, countTreatment, deleteTreatment, addTreatment, patchTreatment, getWeightedAverage };
