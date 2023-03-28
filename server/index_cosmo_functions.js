const mysql = require('mysql');
const fs = require('fs');

const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());


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

//This median+interquartile filtering system takes ALL data of each bird for now
async function readBirdData(bird_id, res, deviationFactor){
  const querySpec = {
    query: `SELECT * FROM stariot ORDER BY stariot.date_time WHERE bird_id = '${bird_id}'`
  };
  const queryOptions = {
    maxItemCount: -1
  };
  const { resources: items } = await container.items.query(querySpec, queryOptions).fetchAll();

  console.log('Selected ' + items.length + ' row(s).');

  const values = items.map(item => item.value);

  //Calculate median
  const median = 0;
  const middleIndex = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    // If there are an even number of values, take the average of the middle two values
    median = (values[middleIndex - 1] + values[middleIndex]) / 2;
  } else {
    // If there are an odd number of values, take the middle value
    median = values[middleIndex];
  }
  //Calculate quartiles
  const q1 = calculateMedian(values.slice(0, middleIndex));
  const q3 = calculateMedian(values.slice(middleIndex + (values.length % 2 === 0 ? 0 : 1)));
  //apply filter
  values.sort((a, b) => a - b);
  const iqr = q3 - q1;

  const lowerBound = q1 - deviationFactor * iqr;
  const upperBound = q3 + deviationFactor * iqr;

  const trimmedValues = items.filter((value) => value >= lowerBound && value <= upperBound);

  for (i = 0; i < items.length; i++) {
    console.log('Row: ' + JSON.stringify(items[i]));
  }
  res.json(items);
  console.log('Done.');
};

module.exports = { readData, readBirdData };
