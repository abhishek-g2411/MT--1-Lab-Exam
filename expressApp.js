const express = require("express");

const app = express();
const PORT = 4000;

app.use(express.json());

let foods = [
  { id: 1, foodName: "Pizza", category: "Fast Food", price: 250, availability: true },
  { id: 2, foodName: "Burger", category: "Fast Food", price: 120, availability: true },
  { id: 3, foodName: "Cold Coffee", category: "Beverage", price: 90, availability: false }
];

function isValidFood(food) {
  return food !== null &&
    typeof food === "object" &&
    !Array.isArray(food) &&
    typeof food.foodName === "string" &&
    food.foodName.trim() !== "" &&
    typeof food.category === "string" &&
    food.category.trim() !== "" &&
    typeof food.price === "number" &&
    Number.isFinite(food.price) &&
    food.price > 0 &&
    typeof food.availability === "boolean";
}

app.get("/foods", (req, res) => {
  res.status(200).json(foods);
});

app.get("/foods/:id", (req, res) => {
  const food = foods.find((item) => item.id === Number(req.params.id));
  if (!food) return res.status(404).json({ message: "Food item not found." });
  res.status(200).json(food);
});

app.post("/foods", (req, res) => {
  const input = req.body;
  if (!isValidFood(input)) {
    return res.status(400).json({ message: "Enter a name, category, positive price, and availability." });
  }

  const id = input.id === undefined
    ? Math.max(0, ...foods.map((food) => food.id)) + 1
    : Number(input.id);
  if (!Number.isInteger(id) || id < 1 || foods.some((food) => food.id === id)) {
    return res.status(400).json({ message: "Food id must be a unique positive integer." });
  }

  const food = {
    id,
    foodName: input.foodName.trim(),
    category: input.category.trim(),
    price: input.price,
    availability: input.availability
  };
  foods.push(food);
  res.status(201).json({ message: "Food item added successfully.", food });
});

app.put("/foods/:id", (req, res) => {
  const food = foods.find((item) => item.id === Number(req.params.id));
  if (!food) return res.status(404).json({ message: "Food item not found." });

  const updates = req.body;
  const allowedFields = ["foodName", "category", "price", "availability"];
  if (!updates || typeof updates !== "object" || Array.isArray(updates) ||
      Object.keys(updates).length === 0 ||
      Object.keys(updates).some((field) => !allowedFields.includes(field))) {
    return res.status(400).json({ message: "Provide valid food fields to update." });
  }

  const updatedFood = { ...food, ...updates };
  if (!isValidFood(updatedFood)) {
    return res.status(400).json({ message: "Updated food fields are invalid." });
  }

  Object.assign(food, {
    foodName: updatedFood.foodName.trim(),
    category: updatedFood.category.trim(),
    price: updatedFood.price,
    availability: updatedFood.availability
  });
  res.status(200).json({ message: "Food item updated successfully.", food });
});

app.delete("/foods/:id", (req, res) => {
  const index = foods.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Food item not found." });
  const deletedFood = foods.splice(index, 1)[0];
  res.status(200).json({ message: "Food item deleted successfully.", food: deletedFood });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body must contain valid JSON." });
  }
  next(error);
});

app.listen(PORT, "127.0.0.1", () => {
  console.log("Express Server running at http://localhost:" + PORT);
});
