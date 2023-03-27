require('dotenv').config();

const mysql = require('mysql');
const fs = require('fs');

const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

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

function readData(res){
  conn.query('SELECT * FROM db1.birds ORDER BY clock', 
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
    conn.query('INSERT INTO db1.specialRequest (clock, bird_id, special_request) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE clock=VALUES(clock), bird_id=VALUES(bird_id), special_request=VALUES(special_request);', values,
        function (err, results) {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
            for (i = 0; i < results.length; i++) {
                console.log('Row: ' + JSON.stringify(results[i]));
            }
            console.log('Done.');
        })
  };

function readTreatment(req, res){
    conn.query(`SELECT * FROM db1.treatment WHERE bird_id = '${req.body.bird_id}'`,
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

function countTreatment(req, res){
    conn.query(`SELECT COUNT (*) FROM db1.treatment WHERE bird_id = '${req.body.bird_id}'`,
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

function deleteTreatment(req, res){
    conn.query(`DELETE FROM db1.treatment WHERE bird_id = '${req.body.bird_id}' AND treatment_id = '${req.body.treatment_id}'`,
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

function patchTreatment(req, res){
    conn.query(`UPDATE db1.treatment SET remaining_duration = '${req.body.remaining_duration}' WHERE treatment_id = '${req.body.treatment_id}'`,
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







function readUniqueBirdID(res){
    conn.query(
        "SELECT bird_id, clock, weight FROM db1.birds t1 INNER JOIN (SELECT bird_id, MAX(CLOCK) AS latest FROM db1.birds GROUP BY bird_id) t2 ON t1.bird_id = t2.bird_id AND t1.clock = t2.latest;", 
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

app.get('/comments', (req, res) => {
       const bird_id = req.query.bird_id
       console.log(bird_id);
       readComment(bird_id, req, res);
  }
);


app.route("/comments")
	.post(async (req, res) => {
		try {
			console.log(req.body);
            
			const {clock, bird_id, special_request} = req.body;
            writeComment([clock, bird_id, special_request]);

			res.json({received : "true"}); 
		} catch (e) {
			console.log(e.message);
            return res.status(403).json("Something went wrong");
		}
	}
);

app.route("/treatments")
    .get(async (req, res) => {
       readTreatment(req, res);
  }
);

app.route("/treatments_count")
    .get(async (req, res) => {
       countTreatment(req, res);
  }
);

app.route("/treatments")
    .delete(async (req, res) => {
       deleteTreatment(req, res);
  }
);

app.route("/treatments")
	.post(async (req, res) => {
		try {
			console.log(req.body);
            
			const {clock, bird_id, medication, dose, amount, route, duration, remaining_duration} = req.body;
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
       patchTreatment(req, res);
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