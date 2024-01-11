// app.mjs

import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const cursor = req.query.cursor || ''; // Add query parameters if needed
    const filter = req.query.filter || ''; // Add query parameters if needed
    const sortDirection = req.query.sortDirection || ''; // Add query parameters if needed
    const sortField = req.query.sortField || ''; // Add query parameters if needed

    const apiUrl = `https://api.squarespace.com/1.0/profiles/?cursor=${cursor}&filter=${filter}&sortDirection=${sortDirection}&sortField=${sortField}`;

    // Make a GET request to the Squarespace API using fetch
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        // Add any required headers, such as authentication headers
        'Authorization': 'Bearer 16689809-c1ad-4477-be83-56a73046f651',
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Return the API response
      res.json(data);
    } else {
      // Handle non-200 responses
      res.status(response.status).json({ error: 'API request failed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post("/send-email", async (req, res) => {
  
  const {html} = req.body;
  console.log(html);
  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set content of the page to the provided HTML
    // const htmlContent = ""
    await page.setContent(html);

    // // Generate PDF buffer
    const pdfBuffer = await page.pdf({ format: 'A4' });

    // // Close Puppeteer browser
    await browser.close();

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'adesiyantope2014@gmail.com',
        pass: 'klip flbo vqnh xixn'
      }
    });

    // // Setup email options
    const mailOptions = {
      from: 'adesiyantope2014@gmail.com',
      to: 'devjoycefazio@gmail.com',
      subject: 'Converted PDF',
      text: 'PDF file attached',
      attachments: [{
        filename: 'converted.pdf',
        content: pdfBuffer,
        encoding: 'base64'
      }]
    };

    // // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info);
    return res.json({"message": "Email sent"})

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});