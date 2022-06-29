const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const user = require("./user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
const app = express();
app.use(express.json());

// postgresql
const { Pool } = require("pg");
const { sendStatus } = require("express/lib/response");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "IS",
  password: "admin",
  port: 5432,
});

const getVeryComplexQuery = (req, res) => {
  let avgTimeExe = 0.0;
  let returnResult = [];
  try {
    // first db
    console.log("am in")
    pool.connect((err, client, release) => {
      if (err) {
        res.sendStatus(500);
        return console.error("Error acquiring client", err.stack);
      }
      //first round
      let i = 0;
      let getAvgBmi = `SELECT ROUND(avgBmi::numeric,0) FROM 
              (SELECT AVG(bmi) as avgBmi FROM health_cares_${i} WHERE sex='Female' AND 
              age_category=(SELECT MIN(age_category) FROM health_cares_${i}) AND 
              sleep_time=(SELECT ROUND(avgSleep::numeric,0) FROM (SELECT AVG(sleep_time) as avgSleep FROM health_cares_${i}) as avgSleepT)) as avgBmiT `;

      let getAvgSleepTime = `SELECT ROUND(avgSleep::numeric,0) as roundAvgSleep FROM (SELECT AVG(sleep_time) as avgSleep FROM health_cares_${i} WHERE sex='Female' AND bmi=
              (SELECT AVG(roundAvgBmi) FROM
              (SELECT race, ROUND(avgBmi::numeric,0) as roundAvgBmi FROM 
              (SELECT race,AVG(bmi) as avgBmi FROM health_cares_${i} GROUP BY race) as avgBmiT) as avgRace)) 
              as roundAvgSleepT`;

      let getAgeCategory = `SELECT MAX(DISTINCT age_category) FROM health_cares_${i} WHERE bmi = (SELECT ROUND(avgBmi,0) FROM (SELECT AVG(bmi) as avgBmi FROM health_cares_${i}) as avgBmiT)`;
      let maxPPSex = `SELECT sex FROM(SELECT COUNT(sex) as numberPP,sex FROM health_cares_${i} GROUP BY sex) as numberPPT WHERE numberPP= (SELECT MAX(totalPP) FROM (SELECT COUNT(sex) as totalPP,sex FROM health_cares_${i} GROUP BY sex) as maxPPT)`;

      var startTime = performance.now();
      let result = client.query(
        `SELECT * FROM health_cares_${i} \
              WHERE \
              heart_disease=true AND \
              bmi = (${getAvgBmi}) AND \
              sleep_time = (${getAvgSleepTime}) AND \ 
              sex=(${maxPPSex}) AND \ 
              age_category = (${getAgeCategory}) AND \
              physical_health = (SELECT ROUND(avgPh::numeric,0) FROM (SELECT AVG(physical_health) as avgPh FROM health_cares_${i}) as roundPH) \ 
              ORDER BY index`,
        (err, result) => {
          // release();
          if (err) {
            res.sendStatus(400);
            return console.error("Error executing query", err.stack);
          }
          var endTime = performance.now();
          console.log("index " + i);
          console.log((endTime - startTime) / 1000);
          console.log(avgTimeExe);
          avgTimeExe = avgTimeExe + (endTime - startTime) / 1000;
          console.log(avgTimeExe);
          returnResult = result.rows;
        }
      );
      //second time
      i = 1;
      getAvgBmi = `SELECT ROUND(avgBmi::numeric,0) FROM 
              (SELECT AVG(bmi) as avgBmi FROM health_cares_${i} WHERE sex='Female' AND 
              age_category=(SELECT MIN(age_category) FROM health_cares_${i}) AND 
              sleep_time=(SELECT ROUND(avgSleep::numeric,0) FROM (SELECT AVG(sleep_time) as avgSleep FROM health_cares_${i}) as avgSleepT)) as avgBmiT `;

      getAvgSleepTime = `SELECT ROUND(avgSleep::numeric,0) as roundAvgSleep FROM (SELECT AVG(sleep_time) as avgSleep FROM health_cares_${i} WHERE sex='Female' AND bmi=
              (SELECT AVG(roundAvgBmi) FROM
              (SELECT race, ROUND(avgBmi::numeric,0) as roundAvgBmi FROM 
              (SELECT race,AVG(bmi) as avgBmi FROM health_cares_${i} GROUP BY race) as avgBmiT) as avgRace)) 
              as roundAvgSleepT`;

      getAgeCategory = `SELECT MAX(DISTINCT age_category) FROM health_cares_${i} WHERE bmi = (SELECT ROUND(avgBmi,0) FROM (SELECT AVG(bmi) as avgBmi FROM health_cares_${i}) as avgBmiT)`;
      maxPPSex = `SELECT sex FROM(SELECT COUNT(sex) as numberPP,sex FROM health_cares_${i} GROUP BY sex) as numberPPT WHERE numberPP= (SELECT MAX(totalPP) FROM (SELECT COUNT(sex) as totalPP,sex FROM health_cares_${i} GROUP BY sex) as maxPPT)`;
      var startTime = performance.now();
      result = client.query(
        `SELECT * FROM health_cares_${i} \
              WHERE \
              heart_disease=true AND \
              bmi = (${getAvgBmi}) AND \
              sleep_time = (${getAvgSleepTime}) AND \ 
              sex=(${maxPPSex}) AND \ 
              age_category = (${getAgeCategory}) AND \
              physical_health = (SELECT ROUND(avgPh::numeric,0) FROM (SELECT AVG(physical_health) as avgPh FROM health_cares_${i}) as roundPH) \ 
              ORDER BY index`,
        (err, result) => {
          // release();
          if (err) {
            res.sendStatus(400);
            return console.error("Error executing query", err.stack);
          }
          var endTime = performance.now();
          console.log("index " + i);
          console.log((endTime - startTime) / 1000);
          console.log(avgTimeExe);
          avgTimeExe = avgTimeExe + (endTime - startTime) / 1000;
          console.log(avgTimeExe);
          returnResult = result.rows;
        }
      );

      //third time
      i = 2;
      getAvgBmi = `SELECT ROUND(avgBmi::numeric,0) FROM 
        (SELECT AVG(bmi) as avgBmi FROM health_cares_${i} WHERE sex='Female' AND 
        age_category=(SELECT MIN(age_category) FROM health_cares_${i}) AND 
        sleep_time=(SELECT ROUND(avgSleep::numeric,0) FROM (SELECT AVG(sleep_time) as avgSleep FROM health_cares_${i}) as avgSleepT)) as avgBmiT `;

      getAvgSleepTime = `SELECT ROUND(avgSleep::numeric,0) as roundAvgSleep FROM (SELECT AVG(sleep_time) as avgSleep FROM health_cares_${i} WHERE sex='Female' AND bmi=
        (SELECT AVG(roundAvgBmi) FROM
        (SELECT race, ROUND(avgBmi::numeric,0) as roundAvgBmi FROM 
        (SELECT race,AVG(bmi) as avgBmi FROM health_cares_${i} GROUP BY race) as avgBmiT) as avgRace)) 
        as roundAvgSleepT`;

      getAgeCategory = `SELECT MAX(DISTINCT age_category) FROM health_cares_${i} WHERE bmi = (SELECT ROUND(avgBmi,0) FROM (SELECT AVG(bmi) as avgBmi FROM health_cares_${i}) as avgBmiT)`;
      maxPPSex = `SELECT sex FROM(SELECT COUNT(sex) as numberPP,sex FROM health_cares_${i} GROUP BY sex) as numberPPT WHERE numberPP= (SELECT MAX(totalPP) FROM (SELECT COUNT(sex) as totalPP,sex FROM health_cares_${i} GROUP BY sex) as maxPPT)`;
      var startTime = performance.now();
      result = client.query(
        `SELECT * FROM health_cares_${i} \
                    WHERE \
                    heart_disease=true AND \
                    bmi = (${getAvgBmi}) AND \
                    sleep_time = (${getAvgSleepTime}) AND \ 
                    sex=(${maxPPSex}) AND \ 
                    age_category = (${getAgeCategory}) AND \
                    physical_health = (SELECT ROUND(avgPh::numeric,0) FROM (SELECT AVG(physical_health) as avgPh FROM health_cares_${i}) as roundPH) \ 
                    ORDER BY index`,
        (err, result) => {
          // release();
          if (err) {
            res.sendStatus(400);
            return console.error("Error executing query", err.stack);
          }
          var endTime = performance.now();
          console.log("index " + i);
          console.log((endTime - startTime) / 1000);
          console.log(avgTimeExe);
          avgTimeExe = avgTimeExe + (endTime - startTime) / 1000;
          console.log(avgTimeExe);
          returnResult = result.rows;
        }
      );

      //fourth time
      i = 3;
      getAvgBmi = `SELECT ROUND(avgBmi::numeric,0) FROM 
        (SELECT AVG(bmi) as avgBmi FROM health_cares_${i} WHERE sex='Female' AND 
        age_category=(SELECT MIN(age_category) FROM health_cares_${i}) AND 
        sleep_time=(SELECT ROUND(avgSleep::numeric,0) FROM (SELECT AVG(sleep_time) as avgSleep FROM health_cares_${i}) as avgSleepT)) as avgBmiT `;

      getAvgSleepTime = `SELECT ROUND(avgSleep::numeric,0) as roundAvgSleep FROM (SELECT AVG(sleep_time) as avgSleep FROM health_cares_${i} WHERE sex='Female' AND bmi=
        (SELECT AVG(roundAvgBmi) FROM
        (SELECT race, ROUND(avgBmi::numeric,0) as roundAvgBmi FROM 
        (SELECT race,AVG(bmi) as avgBmi FROM health_cares_${i} GROUP BY race) as avgBmiT) as avgRace)) 
        as roundAvgSleepT`;

      getAgeCategory = `SELECT MAX(DISTINCT age_category) FROM health_cares_${i} WHERE bmi = (SELECT ROUND(avgBmi,0) FROM (SELECT AVG(bmi) as avgBmi FROM health_cares_${i}) as avgBmiT)`;
      maxPPSex = `SELECT sex FROM(SELECT COUNT(sex) as numberPP,sex FROM health_cares_${i} GROUP BY sex) as numberPPT WHERE numberPP= (SELECT MAX(totalPP) FROM (SELECT COUNT(sex) as totalPP,sex FROM health_cares_${i} GROUP BY sex) as maxPPT)`;
      var startTime = performance.now();
      result = client.query(
        `SELECT * FROM health_cares_${i} \
                          WHERE \
                          heart_disease=true AND \
                          bmi = (${getAvgBmi}) AND \
                          sleep_time = (${getAvgSleepTime}) AND \ 
                          sex=(${maxPPSex}) AND \ 
                          age_category = (${getAgeCategory}) AND \
                          physical_health = (SELECT ROUND(avgPh::numeric,0) FROM (SELECT AVG(physical_health) as avgPh FROM health_cares_${i}) as roundPH) \ 
                          ORDER BY index`,
        (err, result) => {
          // release();
          if (err) {
            res.sendStatus(400);
            return console.error("Error executing query", err.stack);
          }
          var endTime = performance.now();
          console.log("index " + i);
          console.log((endTime - startTime) / 1000);
          console.log(avgTimeExe);
          avgTimeExe = avgTimeExe + (endTime - startTime) / 1000;
          console.log(avgTimeExe);
          returnResult = result.rows;
        }
      );

      //fifth time
      i = 4;
      getAvgBmi = `SELECT ROUND(avgBmi::numeric,0) FROM 
        (SELECT AVG(bmi) as avgBmi FROM health_cares_${i} WHERE sex='Female' AND 
        age_category=(SELECT MIN(age_category) FROM health_cares_${i}) AND 
        sleep_time=(SELECT ROUND(avgSleep::numeric,0) FROM (SELECT AVG(sleep_time) as avgSleep FROM health_cares_${i}) as avgSleepT)) as avgBmiT `;

      getAvgSleepTime = `SELECT ROUND(avgSleep::numeric,0) as roundAvgSleep FROM (SELECT AVG(sleep_time) as avgSleep FROM health_cares_${i} WHERE sex='Female' AND bmi=
        (SELECT AVG(roundAvgBmi) FROM
        (SELECT race, ROUND(avgBmi::numeric,0) as roundAvgBmi FROM 
        (SELECT race,AVG(bmi) as avgBmi FROM health_cares_${i} GROUP BY race) as avgBmiT) as avgRace)) 
        as roundAvgSleepT`;

      getAgeCategory = `SELECT MAX(DISTINCT age_category) FROM health_cares_${i} WHERE bmi = (SELECT ROUND(avgBmi,0) FROM (SELECT AVG(bmi) as avgBmi FROM health_cares_${i}) as avgBmiT)`;
      maxPPSex = `SELECT sex FROM(SELECT COUNT(sex) as numberPP,sex FROM health_cares_${i} GROUP BY sex) as numberPPT WHERE numberPP= (SELECT MAX(totalPP) FROM (SELECT COUNT(sex) as totalPP,sex FROM health_cares_${i} GROUP BY sex) as maxPPT)`;
      var startTime = performance.now();
      result = client.query(
        `SELECT * FROM health_cares_${i} \
                          WHERE \
                          heart_disease=true AND \
                          bmi = (${getAvgBmi}) AND \
                          sleep_time = (${getAvgSleepTime}) AND \ 
                          sex=(${maxPPSex}) AND \ 
                          age_category = (${getAgeCategory}) AND \
                          physical_health = (SELECT ROUND(avgPh::numeric,0) FROM (SELECT AVG(physical_health) as avgPh FROM health_cares_${i}) as roundPH) \ 
                          ORDER BY index`,
        (err, result) => {
          release();
          if (err) {
            res.sendStatus(400);
            return console.error("Error executing query", err.stack);
          }
          var endTime = performance.now();
          console.log((endTime - startTime) / 1000);
          console.log(avgTimeExe);
          avgTimeExe = avgTimeExe + (endTime - startTime) / 1000;
          console.log(avgTimeExe);
          returnResult = result.rows;
          avgTimeExe = avgTimeExe / 5.0;
          res.status(200).json({
            records: returnResult,
            executeTime: avgTimeExe,
          });
        }
      );
    });

    // console.log(returnResult);
    //
  } catch (err) {
    var endTime = performance.now();
    res.sendStatus(400);
  }
};

const getComplexQuery = (req, res) => {
  console.log("this")
  avgTimeExe = 0.0;
  try {
    pool.connect((err, client, release) => {
      if (err) {
        res.sendStatus(500);
        return console.error("Error acquiring client", err.stack);
      }
      // first db
      let i = 0;
      console.log(i);
      let getAverageBmi = `SELECT CAST(bmiValue as double precision) FROM (SELECT ROUND(avgBmi::numeric,0) as bmiValue FROM(SELECT AVG(bmi) as avgBmi FROM health_cares_${i}) as bmiTable) as bmiT `;
      let averagePhysicalHealth = `SELECT ROUND(avgPhy::numeric,0) FROM(SELECT AVG(physical_health) as avgPhy FROM health_cares_${i}) as avgPhyT`;
      let averageMentalHealth = `SELECT ROUND(avgMental::numeric,0) FROM(SELECT AVG(mental_health) as avgMental FROM health_cares_${i}) as avgMentalT`;
      let averageSleepingTime = `SELECT ROUND(avgSleep::numeric,0) as avgRoundSleep FROM (SELECT gen_health, AVG(sleep_time) as avgSleep \
      FROM health_cares_${i} GROUP BY gen_health) as T WHERE T.gen_health='Very good'`;

      console.log(`SELECT * FROM health_cares_${i} \
      WHERE 
      bmi = (${getAverageBmi}) AND \
      physical_health = (${averagePhysicalHealth}) AND \ 
      mental_health = (${averageMentalHealth}) AND \
      sleep_time = (${averageSleepingTime}) \
      ORDER BY index`);
      var startTime = performance.now();
      let result = client.query(
        `SELECT * FROM health_cares_${i} \
        WHERE 
        bmi = (${getAverageBmi}) AND \
        physical_health = (${averagePhysicalHealth}) AND \ 
        mental_health = (${averageMentalHealth}) AND \
        sleep_time = (${averageSleepingTime}) \
        ORDER BY index`,
        (err, result) => {
         
          if (err) {
            res.sendStatus(500);
            return console.error("Error executing query", err.stack);
          }
          var endTime = performance.now();
          console.log("index " + i);
          console.log((endTime - startTime) / 1000);
          console.log(avgTimeExe);
          avgTimeExe = avgTimeExe + (endTime - startTime) / 1000;
          console.log(avgTimeExe);
          returnResult = result.rows;
        }
      );

      // second db
      i = 1;
      console.log(i);
      getAverageBmi = `SELECT CAST(bmiValue as double precision) FROM (SELECT ROUND(avgBmi::numeric,0) as bmiValue FROM(SELECT AVG(bmi) as avgBmi FROM health_cares_${i}) as bmiTable) as bmiT `;
      averagePhysicalHealth = `SELECT ROUND(avgPhy::numeric,0) FROM(SELECT AVG(physical_health) as avgPhy FROM health_cares_${i}) as avgPhyT`;
      averageMentalHealth = `SELECT ROUND(avgMental::numeric,0) FROM(SELECT AVG(mental_health) as avgMental FROM health_cares_${i}) as avgMentalT`;
      averageSleepingTime = `SELECT ROUND(avgSleep::numeric,0) as avgRoundSleep FROM (SELECT gen_health, AVG(sleep_time) as avgSleep \
            FROM health_cares_${i} GROUP BY gen_health) as T WHERE T.gen_health='Very good'`;
      var startTime = performance.now();
      result = client.query(
        `SELECT * FROM health_cares_${i} \
        WHERE 
        bmi = (${getAverageBmi}) AND \
        physical_health = (${averagePhysicalHealth}) AND \ 
        mental_health = (${averageMentalHealth}) AND \
        sleep_time = (${averageSleepingTime}) \
        ORDER BY index`,
        (err, result) => {
       
          if (err) {
            res.sendStatus(500);
            return console.error("Error executing query", err.stack);
          }
          var endTime = performance.now();
          console.log("index " + i);
          console.log((endTime - startTime) / 1000);
          console.log(avgTimeExe);
          avgTimeExe = avgTimeExe + (endTime - startTime) / 1000;
          console.log(avgTimeExe);
          returnResult = result.rows;
          // res.status(200).json({
          //   records: result.rows,
          //   executeTime: (endTime - startTime) / 1000,
          // });
        }
      );

      // third db
      i = 2;
      console.log(i);
      getAverageBmi = `SELECT CAST(bmiValue as double precision) FROM (SELECT ROUND(avgBmi::numeric,0) as bmiValue FROM(SELECT AVG(bmi) as avgBmi FROM health_cares_${i}) as bmiTable) as bmiT `;
      averagePhysicalHealth = `SELECT ROUND(avgPhy::numeric,0) FROM(SELECT AVG(physical_health) as avgPhy FROM health_cares_${i}) as avgPhyT`;
      averageMentalHealth = `SELECT ROUND(avgMental::numeric,0) FROM(SELECT AVG(mental_health) as avgMental FROM health_cares_${i}) as avgMentalT`;
      averageSleepingTime = `SELECT ROUND(avgSleep::numeric,0) as avgRoundSleep FROM (SELECT gen_health, AVG(sleep_time) as avgSleep \
                  FROM health_cares_${i} GROUP BY gen_health) as T WHERE T.gen_health='Very good'`;
      var startTime = performance.now();
      result = client.query(
        `SELECT * FROM health_cares_${i} \
              WHERE 
              bmi = (${getAverageBmi}) AND \
              physical_health = (${averagePhysicalHealth}) AND \ 
              mental_health = (${averageMentalHealth}) AND \
              sleep_time = (${averageSleepingTime}) \
              ORDER BY index`,
        (err, result) => {
        
          if (err) {
            res.sendStatus(500);
            return console.error("Error executing query", err.stack);
          }
          var endTime = performance.now();
          console.log("index " + i);
          console.log((endTime - startTime) / 1000);
          console.log(avgTimeExe);
          avgTimeExe = avgTimeExe + (endTime - startTime) / 1000;
          console.log(avgTimeExe);
          returnResult = result.rows;
          // res.status(200).json({
          //   records: result.rows,
          //   executeTime: (endTime - startTime) / 1000,
          // });
        }
      );
      // fourth db
      i = 3;
      console.log(i);
      getAverageBmi = `SELECT CAST(bmiValue as double precision) FROM (SELECT ROUND(avgBmi::numeric,0) as bmiValue FROM(SELECT AVG(bmi) as avgBmi FROM health_cares_${i}) as bmiTable) as bmiT `;
      averagePhysicalHealth = `SELECT ROUND(avgPhy::numeric,0) FROM(SELECT AVG(physical_health) as avgPhy FROM health_cares_${i}) as avgPhyT`;
      averageMentalHealth = `SELECT ROUND(avgMental::numeric,0) FROM(SELECT AVG(mental_health) as avgMental FROM health_cares_${i}) as avgMentalT`;
      averageSleepingTime = `SELECT ROUND(avgSleep::numeric,0) as avgRoundSleep FROM (SELECT gen_health, AVG(sleep_time) as avgSleep \
                  FROM health_cares_${i} GROUP BY gen_health) as T WHERE T.gen_health='Very good'`;
      var startTime = performance.now();
      result = client.query(
        `SELECT * FROM health_cares_${i} \
              WHERE 
              bmi = (${getAverageBmi}) AND \
              physical_health = (${averagePhysicalHealth}) AND \ 
              mental_health = (${averageMentalHealth}) AND \
              sleep_time = (${averageSleepingTime}) \
              ORDER BY index`,
        (err, result) => {
         
          if (err) {
            res.sendStatus(500);
            return console.error("Error executing query", err.stack);
          }
          var endTime = performance.now();
          console.log("index " + i);
          console.log((endTime - startTime) / 1000);
          console.log(avgTimeExe);
          avgTimeExe = avgTimeExe + (endTime - startTime) / 1000;
          console.log(avgTimeExe);
          returnResult = result.rows;
          // res.status(200).json({
          //   records: result.rows,
          //   executeTime: (endTime - startTime) / 1000,
          // });
        }
      );
      // fifth db
      i = 4;
      console.log(i);
      getAverageBmi = `SELECT CAST(bmiValue as double precision) FROM (SELECT ROUND(avgBmi::numeric,0) as bmiValue FROM(SELECT AVG(bmi) as avgBmi FROM health_cares_${i}) as bmiTable) as bmiT `;
      averagePhysicalHealth = `SELECT ROUND(avgPhy::numeric,0) FROM(SELECT AVG(physical_health) as avgPhy FROM health_cares_${i}) as avgPhyT`;
      averageMentalHealth = `SELECT ROUND(avgMental::numeric,0) FROM(SELECT AVG(mental_health) as avgMental FROM health_cares_${i}) as avgMentalT`;
      averageSleepingTime = `SELECT ROUND(avgSleep::numeric,0) as avgRoundSleep FROM (SELECT gen_health, AVG(sleep_time) as avgSleep \
                  FROM health_cares_${i} GROUP BY gen_health) as T WHERE T.gen_health='Very good'`;
      var startTime = performance.now();
      result = client.query(
        `SELECT * FROM health_cares_${i} \
              WHERE 
              bmi = (${getAverageBmi}) AND \
              physical_health = (${averagePhysicalHealth}) AND \ 
              mental_health = (${averageMentalHealth}) AND \
              sleep_time = (${averageSleepingTime}) \
              ORDER BY index`,
        (err, result) => {
          release();
          if (err) {
            res.sendStatus(500);
            return console.error("Error executing query", err.stack);
          }
          var endTime = performance.now();
          console.log("index " + i);
          console.log((endTime - startTime) / 1000);
          console.log(avgTimeExe);
          avgTimeExe = avgTimeExe + (endTime - startTime) / 1000;
          console.log(avgTimeExe);
          returnResult = result.rows;
          avgTimeExe = avgTimeExe / 5.0;
          res.status(200).json({
            records: returnResult,
            executeTime: avgTimeExe,
          });

        }
      );
    });
  } catch (err) {
    var endTime = performance.now();
    res.sendStatus(400);
  }
};

// user
const createUser = (req, res) => {
  var startTime = performance.now();
  try {
    pool.connect((err, client, release) => {
      if (err) {
        res.sendStatus(500);
        return console.error("Error acquiring client", err.stack);
      }

      const body = req.body;
      bcrypt.hash(body.password, saltRounds, function (err, hash) {
        if (err) {
          res.status(500);
        }
        if (hash) {
          const text = `INSERT INTO users (username,firstname,lastname,password) VALUES ($1,$2,$3,$4)`;
          const values = [body.username, body.firstname, body.lastname, hash];
          client.query(text, values, (err, response) => {
            release();
            if (err) {
              res.sendStatus(500);
              return console.error("Error executing query", err.stack);
            }
            var endTime = performance.now();
            if (response) {
              res
                .status(200)
                .json({ executeTime: (endTime - startTime) / 1000 });
            }
          });
        }
      });
    });
  } catch (err) {
    var endTime = performance.now();
    res.sendStatus(400);
  }
};

const getUser = (req, res) => {
  var startTime = performance.now();
  try {
    pool.connect((err, client, release) => {
      if (err) {
        res.sendStatus(500);
        return console.error("Error acquiring client", err.stack);
      }
      client.query(`SELECT * FROM users`, (err, tempRes) => {
        release();
        if (err) {
          res.sendStatus(500);
          return console.error("Error executing query", err.stack);
        }
        var endTime = performance.now();
        res.status(200).json({
          records: tempRes.rows,
          executeTime: (endTime - startTime) / 1000,
        });
      });
    });
  } catch (err) {
    var endTime = performance.now();
    res.sendStatus(400);
  }
};

const editUser = (req, res) => {
  var startTime = performance.now();

  try {
    pool.connect((err, client, release) => {
      if (err) {
        res.sendStatus(500);
        return console.error("Error acquiring client", err.stack);
      }
      const body = req.body;
      client.query(
        `SELECT * FROM users WHERE username='${body.username}'`,
        (err, existRecord) => {
          if (err) {
            res.sendStatus(500);
            return console.error("Error executing query", err.stack);
          }
          if (existRecord) {
            client.query(
              `UPDATE users SET firstname=$1,lastname=$2 WHERE username=$3`,
              [body.firstname, body.lastname, body.username],
              (err, response) => {
                release();
                if (err) {
                  res.sendStatus(500);
                  return console.error("Error executing query", err.stack);
                }
                var endTime = performance.now();
                res
                  .status(200)
                  .json({ executeTime: (endTime - startTime) / 1000 });
              }
            );
          } else {
            release();
            res.sendStatus(400);
          }
        }
      );
    });
  } catch (err) {
    var endTime = performance.now();
    console.log(err);
    res.sendStatus(400);
  }
};

const deleteUser = (req, res) => {
  var startTime = performance.now();
  try {
    pool.connect((err, client, release) => {
      if (err) {
        res.sendStatus(500);
        return console.error("Error executing query", err.stack);
      }
      const { username } = req.params;
      client.query(
        `SELECT * FROM users WHERE username='${username}'`,
        (err, existRecord) => {
          if (err) {
            res.sendStatus(500);
            return console.error("Error executing query", err.stack);
          }
          if (existRecord) {
            client.query(
              `DELETE FROM users WHERE username=$1`,
              [username],
              (err, response) => {
                release();
                if (err) {
                  res.sendStatus(500);
                  return console.error("Error executing query", err.stack);
                }
                var endTime = performance.now();
                res
                  .status(200)
                  .json({ executeTime: (endTime - startTime) / 1000 });
              }
            );
          } else {
            release();
            res.sendStatus(400);
          }
        }
      );
    });
  } catch (err) {
    var endTime = performance.now();
    console.log(err);
    res.sendStatus(400);
  }
};

module.exports = {
  getVeryComplexQuery: getVeryComplexQuery,
  getComplexQuery: getComplexQuery,
  createUser: createUser,
  getUser: getUser,
  editUser: editUser,
  deleteUser: deleteUser,
};
