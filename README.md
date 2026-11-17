# Online Food Ordering Web Application
## MT1 Lab Examination - Full Stack Development

This project has two independent Node.js servers. The HTTP server uses the built-in http and fs modules. The Express server provides food management API routes. Food records are stored in memory and reset when the server restarts.

## Project structure

    MT-1 LAB/
    ├── package.json
    ├── httpServer.js
    ├── expressApp.js
    ├── public/
    │   └── menu.html
    └── screenshots/

## Install

Install Node.js and npm, then open this folder in VS Code. In the integrated terminal, check Node and npm and install Express:

    node -v
    npm -v
    npm install

## HTTP server (port 3000)

Run in one terminal:

    npm run http

Open these URLs in a browser:

| Method | URL | Result |
|---|---|---|
| GET | http://localhost:3000/ | Welcome page |
| GET | http://localhost:3000/foods | Available foods only |
| GET | http://localhost:3000/about | Restaurant information |
| GET | http://localhost:3000/menu | Menu loaded from public/menu.html using fs.readFile |
| POST | http://localhost:3000/add-food | Add a food item using JSON |

Example POST body:

    {
      "id": 4,
      "foodName": "Pasta",
      "category": "Main Course",
      "price": 180,
      "availability": true
    }

## Express API (port 4000)

Open a second terminal and run:

    npm run express

Use Postman to try these routes:

| Method | URL | Result |
|---|---|---|
| GET | http://localhost:4000/foods | List all food items |
| GET | http://localhost:4000/foods/1 | Find a food item by id |
| POST | http://localhost:4000/foods | Add a food item |
| PUT | http://localhost:4000/foods/1 | Update a food item |
| DELETE | http://localhost:4000/foods/1 | Delete a food item |

For POST and PUT, select Body > raw > JSON. POST accepts foodName, category, price, availability and an optional unique id. PUT accepts one or more valid food fields. Invalid data returns 400, unknown ids return 404, and successful creation returns 201.

## Screenshots

Save screenshots of both servers running and the Postman requests in screenshots/. This folder is ready, but no screenshots are included.

## GitHub submission

After reviewing and testing, run:

    git init
    git add .
    git commit -m "Complete online food ordering lab"
    git branch -M main

Create a repository named MT1-LABEXAM on GitHub. Then replace the placeholder below with the repository URL GitHub gives you:

    git remote add origin YOUR_GITHUB_REPOSITORY_URL
    git push -u origin main

Do not use the placeholder as the actual URL. No GitHub repository was created and nothing was pushed.

## Import and run the Postman requests

Import MT1-LABEXAM.postman_collection.json into Postman. Start the Express server with npm run express, then send the collection requests in order. The POST request adds the sample Cold Coffee item, PUT updates food ID 1, and DELETE removes food ID 1. Restart the server to restore the original sample data before repeating the collection.
