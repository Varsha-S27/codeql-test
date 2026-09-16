const express = require("express");
const fs = require("fs");
const childProcess = require("child_process");
const http = require("http");
const crypto = require("crypto");

const app = express();

app.use(express.json());

// 1. Command Injection
app.get("/ping", (req, res) => {
    const host = req.query.host;

    childProcess.exec("ping -c 1 " + host, (error, stdout) => {
        res.send(stdout);
    });
});

// 2. SQL Injection
app.get("/user", (req, res) => {
    const username = req.query.username;

    const query =
        "SELECT * FROM users WHERE username = '" +
        username +
        "'";

    console.log(query);
    res.send(query);
});

// 3. Path Traversal
app.get("/file", (req, res) => {
    const filename = req.query.filename;

    const filePath = "/tmp/uploads/" + filename;

    res.sendFile(filePath);
});

// 4. Server-Side Request Forgery (SSRF)
app.get("/fetch", (req, res) => {
    const url = req.query.url;

    http.get(url, response => {
        let data = "";

        response.on("data", chunk => {
            data += chunk;
        });

        response.on("end", () => {
            res.send(data);
        });
    });
});

// 5. XSS
app.get("/hello", (req, res) => {
    const name = req.query.name;

    res.send("<html><body>Hello " + name + "</body></html>");
});

// 6. Code Injection / eval
app.get("/calculate", (req, res) => {
    const expression = req.query.expression;

    const result = eval(expression);

    res.send(String(result));
});

// 7. Hardcoded Secret
const AWS_ACCESS_KEY = "AKIA123456789EXAMPLE";
const AWS_SECRET_KEY = "very-secret-password-123456";

// 8. Weak MD5 Hash
function hashPassword(password) {
    return crypto
        .createHash("md5")
        .update(password)
        .digest("hex");
}

// 9. Weak SHA1 Hash
function sha1Hash(data) {
    return crypto
        .createHash("sha1")
        .update(data)
        .digest("hex");
}

// 10. Insecure Randomness
function generateToken() {
    return Math.random().toString(36).substring(2);
}

// 11. HTTP request with user-controlled URL
app.get("/proxy", (req, res) => {
    const target = req.query.target;

    http.get(target, response => {
        response.pipe(res);
    });
});

// 12. Unsafe child process execution
app.get("/execute", (req, res) => {
    const command = req.query.command;

    childProcess.exec(command, (error, stdout) => {
        res.send(stdout);
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});