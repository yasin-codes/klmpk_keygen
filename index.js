import express from "express";
import Keygen from "@themaximalist/keygen.js";
import { parse } from "url";

const app = express();
const port = 3000;

// Configure the keygen with the desired options
const keygen = new Keygen({
  account_id: "47ac6ac3-fb16-4bcc-8df7-222cc9e4fde9",
  length: 16, // 16 characters
  type: "alphanumeric", // Alphanumeric characters
  casing: "incase-sensitive", // Case-insensitive (Uppercase)
});

// Function to calculate the valid date (1 year from the current date)
function getValidUntil() {
  const http = require("http");
  const url = require("url");

  const port = process.argv[2];

  const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true);

    if (pathname === "/api/parsetime" && query.iso) {
      const date = new Date(query.iso);
      const nextYearDate = new Date(date);
      nextYearDate.setFullYear(nextYearDate.getFullYear() + 1); // Add one year

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          hour: date.getHours(),
          minute: date.getMinutes(),
          second: date.getSeconds(),
          nextYear: nextYearDate.toISOString(), // Return the date one year later in ISO format
        })
      );
    } else if (pathname === "/api/unixtime" && query.iso) {
      const date = new Date(query.iso);
      const nextYearDate = new Date(date);
      nextYearDate.setFullYear(nextYearDate.getFullYear() + 1); // Add one year

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          unixtime: date.getTime(),
          nextYearUnixtime: nextYearDate.getTime(), // Return Unix time of the date one year later
        })
      );
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  });
}

// Serve the simple HTML page with a button and email input
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h3>Keygen Generator</h3>
        <form action="/generate-key" method="GET">
          <label for="email">Email:</label><br>
          <input type="email" id="email" name="email_customer" required><br><br>
          <input type="submit" value="Generate Key">
        </form>
      </body>
    </html>
  `);
});

// Function to generate the key
function generateKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";
  for (let i = 0; i < 16; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// Endpoint to generate key
app.get("/generate-key", (req, res) => {
  const emailCustomer = req.query.email_customer;

  if (!emailCustomer) {
    return res.status(400).json({ error: "email_customer query parameter is required" });
  }

  const key = generateKey(); // Call the function to get the key
  const validUntil = getValidUntil();

  // Construct the response object
  const responseData = {
    Data: {
      email: emailCustomer,
      key: key, // Use the generated key here
      valid: validUntil,
    },
  };

  // Send response in JSON format
  res.json(responseData);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
