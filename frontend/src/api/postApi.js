import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";
const UPLOAD_URL = "http://localhost:5000/api/upload";

/**
 * GET ALL POSTS (me expired nëse duhet)
 */
export const getPosts = async () => {
  const res = await axios.get(`${API_URL}?includeExpired=true`);
  return res.data;
};

/**
 * GET POSTS BY CATEGORY (FIX kryesor këtu)
 */
export const getPostsByCategory = async (category) => {
  if (!category) return [];

  // normalize -> konkurse pune -> konkurse-pune
  const formattedCategory = String(category)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  // encode -> siguri për URL
  const safeCategory = encodeURIComponent(formattedCategory);

  const res = await axios.get(`${API_URL}?category=${safeCategory}`);

  return res.data;
};

/**
 * GET SINGLE POST
 */
export const getPostById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

/**
 * CREATE POST
 */
export const createPost = async (payload) => {
  const res = await axios.post(API_URL, payload);
  return res.data;
};

/**
 * UPDATE POST
 */
export const updatePost = async (id, payload) => {
  const res = await axios.put(`${API_URL}/${id}`, payload);
  return res.data;
};

/**
 * DELETE POST
 */
export const deletePost = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

/**
 * Upload 1 image
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(UPLOAD_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};

/**
 * Upload 1 video
 */
export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append("video", file);

  const res = await axios.post(UPLOAD_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};

/**
 * Upload media (images + video)
 */
export const uploadMedia = async ({ images = [], video = null }) => {
  const formData = new FormData();

  images.forEach((file) => {
    formData.append("images", file);
  });

  if (video) {
    formData.append("video", video);
  }

  const res = await axios.post(`${UPLOAD_URL}/media`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};