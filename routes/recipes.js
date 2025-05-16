import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await db.execute(
    `SELECT id, title, making_time, serves, ingredients, CAST(cost AS CHAR) AS cost FROM recipes`
  );
  res.status(200).json({ recipes: rows });
});

router.get('/:id', async (req, res) => {
  const [rows] = await db.execute(
    `SELECT id, title, making_time, serves, ingredients, CAST(cost AS CHAR) AS cost FROM recipes WHERE id = ?`,
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Not Found" });
  }

  res.status(200).json({ message: "Recipe details by id", recipe: rows });
});

router.post('/', async (req, res) => {
  const { title, making_time, serves, ingredients, cost } = req.body;

  if (!title || !making_time || !serves || !ingredients || !cost) {
    return res.status(200).json({
      message: "Recipe creation failed!",
      required: "title, making_time, serves, ingredients, cost"
    });
  }

  const [result] = await db.execute(
    `INSERT INTO recipes (title, making_time, serves, ingredients, cost) VALUES (?, ?, ?, ?, ?)`,
    [title, making_time, serves, ingredients, cost]
  );

  const [recipe] = await db.execute(
    `SELECT id, title, making_time, serves, ingredients, CAST(cost AS CHAR) AS cost, created_at, updated_at FROM recipes WHERE id = ?`,
    [result.insertId]
  );

  res.status(200).json({ message: "Recipe successfully created!", recipe });
});

router.patch('/:id', async (req, res) => {
  const { title, making_time, serves, ingredients, cost } = req.body;

  const [exist] = await db.execute(`SELECT id FROM recipes WHERE id = ?`, [req.params.id]);
  if (exist.length === 0) {
    return res.status(404).json({ message: "No Recipe found" });
  }

  await db.execute(
    `UPDATE recipes SET title=?, making_time=?, serves=?, ingredients=?, cost=?, updated_at=NOW() WHERE id=?`,
    [title, making_time, serves, ingredients, cost, req.params.id]
  );

  res.status(200).json({
    message: "Recipe successfully updated!",
    recipe: [
      { title, making_time, serves, ingredients, cost: String(cost) }
    ]
  });
});

router.delete('/:id', async (req, res) => {
  const [exist] = await db.execute(`SELECT id FROM recipes WHERE id = ?`, [req.params.id]);
  if (exist.length === 0) {
    return res.status(200).json({ message: "No Recipe found" });
  }

  await db.execute(`DELETE FROM recipes WHERE id = ?`, [req.params.id]);
  res.status(200).json({ message: "Recipe successfully removed!" });
});

export default router;
