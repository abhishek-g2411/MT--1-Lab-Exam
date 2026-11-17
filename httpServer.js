const http = require("http");
const fs = require("fs");
const path = require("path");

let foods = [
    { id: 1, foodName: "Pizza", category: "Fast Food", price: 250, availability: true },
    { id: 2, foodName: "Burger", category: "Fast Food", price: 120, availability: true },
    { id: 3, foodName: "Cold Coffee", category: "Beverage", price: 90, availability: false }
];

const server = http.createServer((req, res) => {

    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <html>
                <body>
                    <h1>Welcome to Food Corner</h1>
                    <p>Order your favourite food here.</p>
                </body>
            </html>
        `);

    }

    else if (req.method === "GET" && req.url === "/foods") {

        const availableFoods = foods.filter(food => food.availability === true);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(availableFoods));

    }

    else if (req.method === "GET" && req.url === "/about") {

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>About Food Corner</h1><p>We provide fresh and tasty food.</p>");

    }

    else if (req.method === "GET" && req.url === "/menu") {

        const filePath = path.join(__dirname, "public", "menu.html");

        fs.readFile(filePath, "utf8", (err, data) => {

            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Unable to load menu file");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);

        });

    }

    else if (req.method === "POST" && req.url === "/add-food") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            let newFood;

            try {
                newFood = JSON.parse(body);
            }
            catch (err) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid JSON" }));
                return;
            }

            const requiredFields = ["id", "foodName", "category", "price", "availability"];

            const valid = newFood !== null && typeof newFood === "object" && !Array.isArray(newFood) && Number.isInteger(newFood.id) && newFood.id > 0 && requiredFields.every(field =>
                Object.prototype.hasOwnProperty.call(newFood, field)
            );

            if (!valid || typeof newFood.foodName !== "string" ||
                typeof newFood.category !== "string" ||
                typeof newFood.price !== "number" ||
                newFood.price <= 0 ||
                typeof newFood.availability !== "boolean") {

                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Please enter valid food details" }));
                return;
            }

            if (foods.some(food => food.id === newFood.id)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Food ID already exists" }));
                return;
            }

            foods.push(newFood);

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                message: "Food item added successfully",
                food: newFood
            }));

        });

    }

    else {

        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Page Not Found");

    }

});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});
