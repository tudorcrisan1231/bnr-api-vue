const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");

app.get("/api/nbrfxrates", async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    axios(
        `https://www.bnr.ro/nbrfxrates.xml`
    ).then((res) => {
        response.send(res.data);
    });
});

app.listen(port, () => {
    console.log(`BNR api: http://localhost:${port}`);
});