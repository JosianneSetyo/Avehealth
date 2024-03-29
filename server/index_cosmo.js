require('dotenv').config();

const mysql = require('mysql');
const fs = require('fs');

const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

const { CosmosClient } = require("@azure/cosmos");

const httpPORT = 5500;

const deviationFactor = 1.5;




const endpoint = "https://stariotgroup.documents.azure.com:443";
const key = "jaPZrdJ0bo86jDGVXgdW9BSbJcT3benNrBgOSlq3e0KzCgpWm25zLDAXnIR1Em5Ndm4qdzKsLjqKACDbMlQF0Q==";
const client = new CosmosClient({ endpoint, key });
const container = client.database("stariot").container("stariot001");



const indexCosmoFunctions = require('./index_cosmo_functions.js');

const { readData, readBirdData, readComment, writeComment, readTreatment, countTreatment, deleteTreatment, addTreatment, patchTreatment, getWeightedAverage } = indexCosmoFunctions;




app.route("/entries")
    .get(async (req, res) => {
       readData(res);
  }
);

app.route("/bird_entries")
    .get(async (req, res) => {
       try{
            const bird_id = req.query.bird_id
            console.log(bird_id);
            readBirdData(bird_id, res, deviationFactor);
       } catch(e){
            console.log(e.message);
            return res.status(403).json("Something went wrong");
       }
  }
);

app.get('/comments', (req, res) => {
    try {
       const bird_id = req.query.bird_id
       console.log(bird_id);
       readComment(bird_id, req, res);
    } catch(e){
        console.log(e.message);
        return res.status(403).json("Something went wrong");
    }
  }
);


app.route("/comments")
	.post(async (req, res) => {
		try {
			console.log(req.body);
            
			const {bird_id, special_request} = req.body;
               writeComment([bird_id, special_request]);

			res.json({received : "true"}); 
		} catch (e) {
			console.log(e.message);
            return res.status(403).json("Something went wrong");
		}
	}
);

app.route("/treatments")
    .get(async (req, res) => {
       try {
       const bird_id = req.query.bird_id
       console.log(bird_id);
       readTreatment(bird_id, req, res);
       } catch(e){
            console.log(e.message);
            return res.status(403).json("Something went wrong");
       }
  }
);

app.route("/treatments_count")
    .get(async (req, res) => {
       try{
            const bird_id = req.query.bird_id
            countTreatment(bird_id, req, res);
       } catch(e){
            console.log(e.message);
            return res.status(403).json("Something went wrong");
       }
  }
);

app.route("/treatments")
    .delete(async (req, res) => {
       try{
            const bird_id = req.query.bird_id
            deleteTreatment(bird_id, req, res);
       } catch(e){
            console.log(e.message);
            return res.status(403).json("Something went wrong");
       }
  }
);

app.route("/treatments")
	.post(async (req, res) => {
		try {
			console.log(req.body);
            const clock = new Date();
			const {bird_id, medication, dose, amount, route, duration, remaining_duration} = req.body;
            addTreatment([clock, bird_id, medication, dose, amount, route, duration, remaining_duration]);

			res.json({received : "true"}); 
		} catch (e) {
			console.log(e.message);
            return res.status(403).json("Something went wrong");
		}
	}
);

app.route("/treatments")
    .patch(async (req, res) => {
       try{
       const bird_id = req.query.bird_id
       const remaining_duration = req.query.remaining_duration - 1;
       
       if (remaining_duration <= 0){
          try{
               deleteTreatment(bird_id, req, res);
          } catch(e){
               console.log(e.message);
               return res.status(403).json("Something went wrong");
          }
       }
       else {
          patchTreatment(bird_id, remaining_duration, req, res);
       }

       } catch(e){
            console.log(e.message);
            return res.status(403).json("Something went wrong");
       }
  }
);

app.route("/weighted_average")
    .get(async (req, res) => {
       try{
            const bird_id = req.query.bird_id
            const param = parseInt(req.query.param) + 1

            getWeightedAverage(bird_id, param, res);
       } catch(e){
            console.log(e.message);
            return res.status(403).json("Something went wrong");
       }
  }
);

app.listen(httpPORT, () => {
    console.log("Server running on port 5500");
  });