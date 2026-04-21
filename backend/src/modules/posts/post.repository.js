const db = require("../../config/db");

async function findAll() {
  const query = `
    SELECT id, title, description, category, price, image_url, created_at
    FROM posts
    ORDER BY id DESC
  `;

  const result = await db.query(query);
  return result.rows;
}

async function findById(id) {
  const query = `
    SELECT id, title, description, category, price, image_url, created_at
    FROM posts
    WHERE id = $1
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] || null;
}

async function create(data) {
  const query = `
    INSERT INTO posts (title, description, category, price, image_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, description, category, price, image_url, created_at
  `;

  const values = [
    data.title,
    data.description,
    data.category,
    data.price,
    data.image_url || null
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}

async function update(id, data) {
  const query = `
    UPDATE posts
    SET title = $1,
        description = $2,
        category = $3,
        price = $4,
        image_url = $5
    WHERE id = $6
    RETURNING id, title, description, category, price, image_url, created_at
  `;

  const values = [
    data.title,
    data.description,
    data.category,
    data.price,
    data.image_url || null,
    id
  ];

  const result = await db.query(query, values);
  return result.rows[0] || null;
}

async function remove(id) {
  const query = `
    DELETE FROM posts
    WHERE id = $1
    RETURNING id
  `;

  const result = await db.query(query, [id]);
  return result.rows[0] || null;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};