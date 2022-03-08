const axios = require("axios");

const reactiveUrl = "http://localhost:8080/data";
const nonReactiveUrl = "http://localhost:9090/data";

const sendRequest = (numberOfRequests, url) => {
  return new Promise((resolve, reject) => {
    const objects = [];
    Array.from(Array(numberOfRequests).keys()).forEach((x) => {
      let sendingTime = Date.now();
      axios
        .get(url)
        .then((res) => {
          res.data.sendedTime = sendingTime;
          res.data.recivedTime = Date.now();
          objects.push(res.data);
          if (objects.length === numberOfRequests) {
            resolve(objects);
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  });
};
const runReactive = async (number) => {
  let startTime = Date.now();
  let data = await sendRequest(number, reactiveUrl);

  let endTime = Date.now();
  let sumTime = 0;
  await data.forEach(async (oneData) => {
    sumTime = sumTime + (oneData.recivedTime - oneData.sendedTime) / 1000;
    console.log((oneData.recivedTime - oneData.sendedTime) / 1000);
  });

  console.log(`Average time per request: ${sumTime / data.length}`);
  console.log(`Duration for process: ${(endTime - startTime) / 1000}`);
};

const runNonReactive = async (number) => {
  let startTime = Date.now();
  let data = await sendRequest(number, nonReactiveUrl);

  let endTime = Date.now();
  let sumTime = 0;
  await data.forEach(async (oneData) => {
    sumTime = sumTime + (oneData.recivedTime - oneData.sendedTime) / 1000;
    console.log((oneData.recivedTime - oneData.sendedTime) / 1000);
  });

  console.log(`Average time per request: ${sumTime / data.length}`);
  console.log(`Duration for process: ${(endTime - startTime) / 1000}`);
};

const run = async () => {
  //runReactive(1000);
  runNonReactive(10);
};

run();
