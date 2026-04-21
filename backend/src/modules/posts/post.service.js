const postRepository = require("./post.repository");

async function getAllPosts() {
  return await postRepository.findAll();
}

async function getPostById(id) {
  if (!id || Number.isNaN(id)) {
    throw new Error("Invalid post id");
  }

  return await postRepository.findById(id);
}

async function createPost(data) {
  if (!data.title || !data.title.trim()) {
    throw new Error("Title is required");
  }

  if (!data.category || !data.category.trim()) {
    throw new Error("Category is required");
  }

  return await postRepository.create({
    title: data.title.trim(),
    description: data.description?.trim() || "",
    category: data.category.trim(),
    price: data.price ?? null,
    image_url: data.image_url || null
  });
}

async function updatePost(id, data) {
  if (!id || Number.isNaN(id)) {
    throw new Error("Invalid post id");
  }

  if (!data.title || !data.title.trim()) {
    throw new Error("Title is required");
  }

  if (!data.category || !data.category.trim()) {
    throw new Error("Category is required");
  }

  return await postRepository.update(id, {
    title: data.title.trim(),
    description: data.description?.trim() || "",
    category: data.category.trim(),
    price: data.price ?? null,
    image_url: data.image_url || null
  });
}

async function deletePost(id) {
  if (!id || Number.isNaN(id)) {
    throw new Error("Invalid post id");
  }

  return await postRepository.remove(id);
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};