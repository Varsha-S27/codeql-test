const express = require("express");

const app = express();

app.get("/search", (req, res) => {
    const query = req.query.q;

    // Intentionally vulnerable:
    // User-controlled input is passed directly to eval().
    const result = eval(query);

    res.send(String(result));
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});