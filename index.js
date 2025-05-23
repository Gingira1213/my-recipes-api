import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recipeRouter from './routes/recipes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/recipes', recipeRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
