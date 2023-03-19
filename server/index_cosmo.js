const mysql = require('mysql');
const fs = require('fs');

const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

const { CosmosClient } = require("@azure/cosmos");

const azurePORT = 3306;
const httpPORT = 5500;

var config =
{
    host: 'prophet.mysql.database.azure.com',
    user: 'josianne',
    password: 'Azure@19',
    database: 'db1',
    port: azurePORT,
    ssl: {ca: fs.readFileSync("certificate/DigiCertGlobalRootCA.crt.pem")}
};


const endpoint = "https://stariotgroup.documents.azure.com:443";
const key = "jaPZrdJ0bo86jDGVXgdW9BSbJcT3benNrBgOSlq3e0KzCgpWm25zLDAXnIR1Em5Ndm4qdzKsLjqKACDbMlQF0Q==";
const client = new CosmosClient({ endpoint, key });
const container = client.database("stariot").container("stariot001");

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


// async function readUniqueBirdID(res){
//     const querySpec = {
//         query: 'SELECT stariot.id, stariot.date_time, stariot.result FROM stariot t1 INNER JOIN (SELECT bird_id, MAX(CLOCK) AS latest FROM db1.birds GROUP BY bird_id) t2 ON t1.bird_id = t2.bird_id AND t1.clock = t2.latest;'
//       };
//     const queryOptions = {
//         maxItemCount: -1
//       };

//     const { resources: items } = await container.items.query(querySpec, queryOptions).fetchAll();

//     console.log('Selected ' + items.length + ' row(s).');
//     for (i = 0; i < items.length; i++) {
//       console.log('Row: ' + JSON.stringify(items[i]));
//     }
//     res.json(items);
//     console.log('Done.');
//   };



function readBirdData(req, res){
    console.log(req.body.bird_id);
    let birdID = req.body;
    
    conn.query(`SELECT * FROM db1.birds WHERE bird_id = '${req.body.bird_id}'`, 
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

function readLatestBirdData(req, res){
    console.log(req.body.bird_id);
    let birdID = req.body;
    
    conn.query(`SELECT * FROM db1.birds WHERE bird_id = '${req.body.bird_id}' AND clock = (
        SELECT MAX(clock)
        FROM db1.birds
        WHERE bird_id = '${req.body.bird_id}')`, 
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

function writeData(values){
    conn.query('INSERT INTO db1.birds (clock, bird_id, weight) VALUES (?, ?, ?);', values,
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
            for (i = 0; i < results.length; i++) {
                console.log('Row: ' + JSON.stringify(results[i]));
            }
            console.log('Done.');
        })
  };

app.route("/entries")
    .get(async (req, res) => {
       readData(res);
  }
);

app.route("/uniqueBirds")
    .get(async (req, res) => {
        readUniqueBirdID(res);
  }
);

app.route("/birdData")
    .get(async (req, res) => {
        readBirdData(req, res);
  }
);

app.route("/readLatestBirdData")
    .get(async (req, res) => {
        readLatestBirdData(req, res);
  }
);

app.route("/entries")
	.post(async (req, res) => {
		try {
			console.log(req.body);
            
			const {clock, bird_id, weight} = req.body;
            writeData([clock, bird_id, weight]);

			res.json({received : "true"}); 
		} catch (e) {
			console.log(e.message);
            return res.status(403).json("Something went wrong");
		}
	}
);

app.listen(httpPORT, () => {
    console.log("Server running on port 5500");
  });