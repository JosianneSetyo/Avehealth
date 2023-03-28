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
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE,
    port: azurePORT,
    ssl: {ca: fs.readFileSync("certificate/DigiCertGlobalRootCA.crt.pem")}
};


const endpoint = "https://stariotgroup.documents.azure.com:443";
const key = "jaPZrdJ0bo86jDGVXgdW9BSbJcT3benNrBgOSlq3e0KzCgpWm25zLDAXnIR1Em5Ndm4qdzKsLjqKACDbMlQF0Q==";
const client = new CosmosClient({ endpoint, key });
const container = client.database("stariot").container("stariot001");

const conn = new mysql.createConnection(config);

const indexCosmoFunctions = require('./index_cosmo_functions.js');

const { readData, readBirdData } = indexCosmoFunctions;

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

app.route("/entries")
    .get(async (req, res) => {
       readData(res);
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

app.route("/bird_entries")
    .get(async (req, res) => {
       try{
            const bird_id = req.query.bird_id
            readBirdData(bird_id, res);
       } catch(e){
            console.log(e.message);
            return res.status(403).json("Something went wrong");
       }
  }
);

app.listen(httpPORT, () => {
    console.log("Server running on port 5500");
  });