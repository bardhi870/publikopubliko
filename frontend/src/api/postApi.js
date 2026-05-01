import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL = `${BASE_URL}/api/posts`;
const UPLOAD_URL = `${BASE_URL}/api/upload`;

const getAdminAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");

  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};
};

const fixMediaUrl = (url) => {
  if (!url) return url;
  return String(url).replace("http://localhost:5000", BASE_URL);
};

const parseGalleryImages = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value ? [value] : [];
    }
  }

  return [];
};

const normalizePostMedia = (post) => {
  if (!post) return post;

  const galleryImages = parseGalleryImages(post.gallery_images);

  return {
    ...post,
    image_url: fixMediaUrl(post.image_url),
    video_url: fixMediaUrl(post.video_url),
    cover_url: fixMediaUrl(post.cover_url),
    gallery_images: galleryImages.map(fixMediaUrl)
  };
};

const handleUnauthorized = (error) => {
  if (error?.response?.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  }

  throw error;
};

/* PUBLIC GET */
export const getPosts = async () => {
  const res = await axios.get(`${API_URL}?includeExpired=true`, {
    headers: getAdminAuthHeaders()
  });

  return Array.isArray(res.data) ? res.data.map(normalizePostMedia) : [];
};

export const getPostsByCategory = async (category) => {
  if (!category) return [];

  const formattedCategory = String(category)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const safeCategory = encodeURIComponent(formattedCategory);

  const res = await axios.get(`${API_URL}?category=${safeCategory}`);
  return Array.isArray(res.data) ? res.data.map(normalizePostMedia) : [];
};

export const getPostById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return normalizePostMedia(res.data);
};

/* ADMIN WRITE */
export const createPost = async (payload) => {
  try {
    const res = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        ...getAdminAuthHeaders()
      }
    });

    return normalizePostMedia(res.data);
  } catch (error) {
    handleUnauthorized(error);
  }
};

export const updatePost = async (id, payload) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
        ...getAdminAuthHeaders()
      }
    });

    return normalizePostMedia(res.data);
  } catch (error) {
    handleUnauthorized(error);
  }
};

export const deletePost = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: getAdminAuthHeaders()
    });

    return res.data;
  } catch (error) {
    handleUnauthorized(error);
  }
};

/* ADMIN UPLOAD */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(UPLOAD_URL, formData, {
      headers: getAdminAuthHeaders()
    });

    return res.data;
  } catch (error) {
    handleUnauthorized(error);
  }
};

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append("video", file);

  try {
    const res = await axios.post(UPLOAD_URL, formData, {
      headers: getAdminAuthHeaders()
    });

    return res.data;
  } catch (error) {
    handleUnauthorized(error);
  }
};

export const uploadMedia = async ({ images = [], video = null }) => {
  const formData = new FormData();

  images.forEach((file) => {
    formData.append("images", file);
  });

  if (video) {
    formData.append("video", video);
  }

  try {
    const res = await axios.post(`${UPLOAD_URL}/media`, formData, {
      headers: getAdminAuthHeaders()
    });

    return res.data;
  } catch (error) {
    handleUnauthorized(error);
  }
};