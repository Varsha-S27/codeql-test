const express = require("express");
const app = express();

app.get("/search", (req, res) => {
    const userInput = req.query.q;

    // INTENTIONALLY VULNERABLE
    // CodeQL should identify user-controlled input flowing into eval().
    const result = eval(userInput);

    res.send(String(result));
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});