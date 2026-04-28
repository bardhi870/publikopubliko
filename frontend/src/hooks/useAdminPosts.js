import { useEffect, useMemo, useState } from "react";
import imageCompression from "browser-image-compression";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  uploadMedia
} from "../api/postApi";
import { CATEGORY_OPTIONS } from "../constants/postCategories";
import { getInitialFormData } from "../utils/postHelpers";

const MAX_IMAGES = 10;
const MAX_VIDEOS = 1;

const VEHICLE_FIELDS = {
  mileage: "",
  power: "",
  transmission: "",
  drive_type: "",
  fuel_type: "",
  vehicle_year: "",
  body_type: "",
  series: "",
  doors: "",
  seats: "",
  exterior_color: "",
  interior_color: "",
  weight: "",
  engine_capacity: "",
  vehicle_condition: "",
  location: ""
};

const normalizeExternalLink = (link = "") => {
  const clean = String(link || "").trim();
  if (!clean) return "";
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  return `https://${clean}`;
};

const normalizePositionsCount = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

export default function useAdminPosts() {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoIsCover, setVideoIsCover] = useState(false);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  const [formData, setFormData] = useState({
    ...getInitialFormData(),
    ...VEHICLE_FIELDS,

    company_name: "",
    job_category: "",
    job_location: "",
    positions_count: "",

    externalLink: "",
    externalLinkLabel: "",
    featured: false,
    breaking: false,
    is_active: true,
    is_unlimited: false,
    active_from: "",
    active_until: ""
  });

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const selectedClient = JSON.parse(
      localStorage.getItem("selectedClientForPost") || "null"
    );

    const selectedPostForEdit = JSON.parse(
      localStorage.getItem("selectedPostForEdit") || "null"
    );

    if (selectedClient) {
      setFormData((prev) => ({
        ...prev,
        company_name: selectedClient.name || prev.company_name,
        phone: selectedClient.phone || prev.phone,
        whatsapp: selectedClient.phone || prev.whatsapp,
        category:
          mapServiceTypeToCategory(selectedClient.serviceType) || prev.category
      }));
    }

    if (selectedPostForEdit) {
      setEditingId(selectedPostForEdit.id);
      setFormData(buildFormDataFromPost(selectedPostForEdit));

      setVideoIsCover(selectedPostForEdit.cover_type === "video");
      localStorage.removeItem("selectedPostForEdit");
    }
  }, []);

  const isRealEstate = useMemo(
    () => formData.category === "patundshmeri",
    [formData.category]
  );

  const isVehicle = useMemo(
    () => formData.category === "automjete",
    [formData.category]
  );

  const isOffer = useMemo(
    () => formData.category === "oferta",
    [formData.category]
  );

  const showPriceField = useMemo(() => {
    return (
      formData.category === "patundshmeri" ||
      formData.category === "automjete" ||
      formData.category === "oferta"
    );
  }, [formData.category]);

  const showContactFields = useMemo(() => {
    return (
      formData.category === "patundshmeri" ||
      formData.category === "automjete" ||
      formData.category === "oferta" ||
      formData.category === "konkurse-pune"
    );
  }, [formData.category]);

  const filteredPosts = useMemo(() => {
    if (selectedCategoryFilter === "all") return posts;
    return posts.filter((post) => post.category === selectedCategoryFilter);
  }, [posts, selectedCategoryFilter]);

  const selectedCategoryCount = useMemo(() => {
    if (selectedCategoryFilter === "all") return posts.length;
    return posts.filter((post) => post.category === selectedCategoryFilter)
      .length;
  }, [posts, selectedCategoryFilter]);

  const postsByCategory = useMemo(() => {
    return CATEGORY_OPTIONS.map((category) => ({
      ...category,
      count: posts.filter((post) => post.category === category.value).length
    }));
  }, [posts]);

  async function loadPosts() {
    try {
      const data = await getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  function mapServiceTypeToCategory(serviceType) {
    if (!serviceType) return "";
    if (serviceType === "Konkurs Pune") return "konkurse-pune";
    if (serviceType === "Patundshmëri") return "patundshmeri";
    if (serviceType === "Automjete") return "automjete";
    if (serviceType === "Banner" || serviceType === "Postim i sponsorizuar") {
      return "oferta";
    }
    return "";
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: fieldValue
      };

      if (name === "category") {
        const categoryNeedsPrice =
          fieldValue === "patundshmeri" ||
          fieldValue === "automjete" ||
          fieldValue === "oferta";

        if (!categoryNeedsPrice) updated.price = "";

        if (fieldValue !== "patundshmeri") {
          updated.propertyType = "";
          updated.listingType = "";
          updated.priceType = "";
          updated.city = "";
          updated.area = "";
          updated.rooms = "";
          updated.bathrooms = "";
        }

        if (fieldValue !== "automjete") {
          Object.keys(VEHICLE_FIELDS).forEach((key) => {
            updated[key] = "";
          });
        }

        if (
          fieldValue !== "patundshmeri" &&
          fieldValue !== "automjete" &&
          fieldValue !== "oferta" &&
          fieldValue !== "konkurse-pune"
        ) {
          updated.phone = "";
          updated.whatsapp = "";
        }

        if (fieldValue !== "oferta") {
          updated.offerBadge = "";
          updated.offerFeatures = [{ text: "", included: true }];
        }

        if (fieldValue !== "konkurse-pune") {
          updated.company_name = "";
          updated.job_category = "";
          updated.job_location = "";
          updated.positions_count = "";
          updated.experience = "";
          updated.work_hours = "";
          updated.languages = "";
        }

        const isNewsCategory = ["vendi", "rajoni", "bota", "lajme"].includes(
          fieldValue
        );

        if (!isNewsCategory) updated.breaking = false;
      }

      if (name === "is_unlimited" && checked) {
        updated.active_until = "";
      }

      return updated;
    });
  }

  async function compressImageIfNeeded(file) {
    if (!file.type.startsWith("image/")) return file;

    const options = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      initialQuality: 0.78,
      fileType: "image/webp"
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Gabim gjatë kompresimit të fotos:", error);
      return file;
    }
  }

  async function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));

    if (imageFiles.length > MAX_IMAGES) {
      alert(`Mund të zgjedhësh maksimum ${MAX_IMAGES} foto.`);
      return;
    }

    if (videoFiles.length > MAX_VIDEOS) {
      alert(`Mund të zgjedhësh maksimum ${MAX_VIDEOS} video.`);
      return;
    }

    try {
      const compressedImages = await Promise.all(
        imageFiles.map(async (file, index) => {
          const compressedFile = await compressImageIfNeeded(file);

          return {
            file: compressedFile,
            preview: URL.createObjectURL(compressedFile),
            sortOrder: index + 1,
            isCover: index === 0,
            type: "image"
          };
        })
      );

      const firstVideo = videoFiles[0] || null;

      setSelectedImages(compressedImages);
      setSelectedVideo(
        firstVideo
          ? {
              file: firstVideo,
              preview: URL.createObjectURL(firstVideo),
              type: "video"
            }
          : null
      );

      setVideoIsCover(false);
      setSelectedFile(compressedImages[0]?.file || null);
    } catch (error) {
      console.error("Gabim gjatë përpunimit të mediave:", error);
      alert("Gabim gjatë përpunimit të fotove/videos.");
    }
  }

  function setCoverImage(index) {
    setVideoIsCover(false);

    setSelectedImages((prev) =>
      prev.map((item, i) => ({
        ...item,
        isCover: i === index
      }))
    );

    setSelectedFile(selectedImages[index]?.file || null);
  }

  function setVideoAsCover() {
    if (!selectedVideo) return;

    setVideoIsCover(true);

    setSelectedImages((prev) =>
      prev.map((item) => ({
        ...item,
        isCover: false
      }))
    );

    setSelectedFile(null);
  }

  function moveSelectedImageLeft(index) {
    if (index === 0) return;

    setSelectedImages((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];

      return next.map((item, i) => ({
        ...item,
        sortOrder: i + 1
      }));
    });
  }

  function moveSelectedImageRight(index) {
    setSelectedImages((prev) => {
      if (index === prev.length - 1) return prev;

      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];

      return next.map((item, i) => ({
        ...item,
        sortOrder: i + 1
      }));
    });
  }

  function removeSelectedImage(index) {
    setSelectedImages((prev) => {
      const removedWasCover = prev[index]?.isCover;

      const next = prev
        .filter((_, i) => i !== index)
        .map((item, i) => ({
          ...item,
          sortOrder: i + 1,
          isCover: false
        }));

      if (next.length > 0 && !videoIsCover) {
        if (removedWasCover) {
          next[0].isCover = true;
        } else {
          const oldCoverIndex = prev.findIndex((item) => item.isCover);
          const newCoverIndex =
            oldCoverIndex > index ? oldCoverIndex - 1 : oldCoverIndex;

          if (next[newCoverIndex]) next[newCoverIndex].isCover = true;
          else next[0].isCover = true;
        }
      }

      setSelectedFile(next.find((item) => item.isCover)?.file || null);
      return next;
    });
  }

  function removeSelectedVideo() {
    setSelectedVideo(null);

    if (videoIsCover) {
      setVideoIsCover(false);

      setSelectedImages((prev) => {
        if (prev.length === 0) return prev;

        return prev.map((item, index) => ({
          ...item,
          isCover: index === 0
        }));
      });

      setSelectedFile(selectedImages[0]?.file || null);
    }
  }

  function addOfferFeature() {
    setFormData((prev) => ({
      ...prev,
      offerFeatures: [
        ...(prev.offerFeatures || []),
        { text: "", included: true }
      ]
    }));
  }

  function removeOfferFeature(index) {
    setFormData((prev) => {
      const features = [...(prev.offerFeatures || [])];

      if (features.length <= 1) {
        return {
          ...prev,
          offerFeatures: [{ text: "", included: true }]
        };
      }

      features.splice(index, 1);

      return {
        ...prev,
        offerFeatures: features
      };
    });
  }

  function handleOfferFeatureChange(index, field, value) {
    setFormData((prev) => {
      const features = [...(prev.offerFeatures || [])];

      features[index] = {
        ...features[index],
        [field]: value
      };

      return {
        ...prev,
        offerFeatures: features
      };
    });
  }

  function parseOfferFeatures(value) {
    if (!value) return [{ text: "", included: true }];

    try {
      const parsed = Array.isArray(value) ? value : JSON.parse(value);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => ({
          text: item.text || "",
          included: typeof item.included === "boolean" ? item.included : true
        }));
      }
    } catch (error) {
      console.error("Gabim në leximin e offer_features:", error);
    }

    return [{ text: "", included: true }];
  }

  function buildFormDataFromPost(post) {
    return {
      ...getInitialFormData(),

      title: post.title || "",
      description: post.description || "",
      category: post.category || "",
      price: post.price || "",

      image_url: post.image_url || "",
      gallery_images: post.gallery_images || [],
      video_url: post.video_url || "",
      cover_type: post.cover_type || "image",
      cover_url: post.cover_url || "",

      propertyType: post.property_type || "",
      listingType: post.listing_type || "",
      priceType: post.price_type || "",
      city: post.city || "",
      area: post.area || "",
      rooms: post.rooms || "",
      bathrooms: post.bathrooms || "",

      mileage: post.mileage || "",
      power: post.power || "",
      transmission: post.transmission || "",
      drive_type: post.drive_type || "",
      fuel_type: post.fuel_type || "",
      vehicle_year: post.vehicle_year || "",
      body_type: post.body_type || "",
      series: post.series || "",
      doors: post.doors || "",
      seats: post.seats || "",
      exterior_color: post.exterior_color || "",
      interior_color: post.interior_color || "",
      weight: post.weight || "",
      engine_capacity: post.engine_capacity || "",
      vehicle_condition: post.vehicle_condition || "",
      location: post.location || "",

      phone: post.phone || "",
      whatsapp: post.whatsapp || "",

      company_name: post.company_name || post.client_name || "",
      job_category: post.job_category || "",
      job_location: post.job_location || post.city || "",
      positions_count: post.positions_count || "",

      experience: post.experience || "",
      work_hours: post.work_hours || "",
      languages: post.languages || "",

      offerBadge: post.offer_badge || "",
      offerFeatures: parseOfferFeatures(post.offer_features),

      externalLink: post.external_link || post.externalLink || "",
      externalLinkLabel: post.external_link_label || post.externalLinkLabel || "",

      featured: !!post.featured,
      breaking: !!post.breaking,

      is_active: post.is_active !== false,
      is_unlimited: post.is_unlimited || false,
      active_from: post.active_from ? String(post.active_from).slice(0, 10) : "",
      active_until: post.active_until ? String(post.active_until).slice(0, 10) : "",

      clientId: post.client_id || null
    };
  }

  function handleEdit(post) {
    setEditingId(post.id);
    setFormData(buildFormDataFromPost(post));

    setVideoIsCover(post.cover_type === "video");
    setSelectedFile(null);
    setSelectedImages([]);
    setSelectedVideo(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "A je i sigurt që don me fshi këtë postim?"
    );
    if (!confirmDelete) return;

    try {
      await deletePost(id);
      await loadPosts();
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë fshirjes");
    }
  }

  function buildPostPayload(source, options = {}) {
    const category = source.category;
    const isJobPost = category === "konkurse-pune";
    const isVehiclePost = category === "automjete";
    const isNewsCategory = ["vendi", "rajoni", "bota"].includes(category);

    return {
      title: source.title,
      description: source.description,
      category,
      clientId: source.clientId || source.client_id || null,

      price:
        category === "patundshmeri" ||
        category === "automjete" ||
        category === "oferta"
          ? source.price
            ? Number(source.price)
            : null
          : null,

      image_url: options.imageUrl ?? source.image_url ?? null,
      gallery_images: options.galleryImages ?? source.gallery_images ?? [],
      video_url: options.videoUrl ?? source.video_url ?? null,
      cover_type: options.coverType ?? source.cover_type ?? "image",
      cover_url: options.coverUrl ?? source.cover_url ?? source.image_url ?? null,

      propertyType:
        category === "patundshmeri"
          ? source.propertyType || source.property_type || null
          : null,
      listingType:
        category === "patundshmeri"
          ? source.listingType || source.listing_type || null
          : null,
      priceType:
        category === "patundshmeri"
          ? source.priceType || source.price_type || null
          : null,

      city:
        category === "patundshmeri" || isJobPost
          ? source.city || source.job_location || null
          : null,

      area: category === "patundshmeri" ? source.area || null : null,
      rooms:
        category === "patundshmeri" && source.rooms ? Number(source.rooms) : null,
      bathrooms:
        category === "patundshmeri" && source.bathrooms
          ? Number(source.bathrooms)
          : null,

      mileage: isVehiclePost ? source.mileage || null : null,
      power: isVehiclePost ? source.power || null : null,
      transmission: isVehiclePost ? source.transmission || null : null,
      drive_type: isVehiclePost ? source.drive_type || null : null,
      fuel_type: isVehiclePost ? source.fuel_type || null : null,
      vehicle_year: isVehiclePost ? source.vehicle_year || null : null,
      body_type: isVehiclePost ? source.body_type || null : null,
      series: isVehiclePost ? source.series || null : null,
      doors: isVehiclePost ? source.doors || null : null,
      seats: isVehiclePost ? source.seats || null : null,
      exterior_color: isVehiclePost ? source.exterior_color || null : null,
      interior_color: isVehiclePost ? source.interior_color || null : null,
      weight: isVehiclePost ? source.weight || null : null,
      engine_capacity: isVehiclePost ? source.engine_capacity || null : null,
      vehicle_condition: isVehiclePost ? source.vehicle_condition || null : null,
      location: isVehiclePost ? source.location || null : null,

      phone:
        category === "patundshmeri" ||
        category === "automjete" ||
        category === "oferta" ||
        isJobPost
          ? source.phone || null
          : null,
      whatsapp:
        category === "patundshmeri" ||
        category === "automjete" ||
        category === "oferta" ||
        isJobPost
          ? source.whatsapp || null
          : null,

      company_name: isJobPost
        ? source.company_name || source.client_name || null
        : null,
      job_category: isJobPost ? source.job_category || null : null,
      job_location: isJobPost ? source.job_location || source.city || null : null,
      positions_count: isJobPost
        ? normalizePositionsCount(source.positions_count)
        : null,

      experience: isJobPost ? source.experience || null : null,
      work_hours: isJobPost ? source.work_hours || null : null,
      languages: isJobPost ? source.languages || null : null,

      offerBadge:
        category === "oferta"
          ? source.offerBadge || source.offer_badge || null
          : null,
      offerFeatures:
        category === "oferta"
          ? source.offerFeatures || source.offer_features || []
          : [],

      externalLink: normalizeExternalLink(
        source.externalLink || source.external_link || ""
      ),
      externalLinkLabel:
        source.externalLinkLabel || source.external_link_label || null,

      featured: options.featured ?? !!source.featured,
      breaking: isNewsCategory ? options.breaking ?? !!source.breaking : false,

      is_active: source.is_active !== false,
      is_unlimited: source.is_unlimited || false,
      active_from: source.active_from || null,
      active_until: source.is_unlimited ? null : source.active_until || null
    };
  }

  async function toggleFeatured(post) {
    try {
      const payload = buildPostPayload(post, {
        featured: !post.featured,
        breaking: !!post.breaking
      });

      const updated = await updatePost(post.id, payload);

      setPosts((prev) =>
        prev.map((item) => (item.id === post.id ? updated : item))
      );
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë ndryshimit të featured.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const selectedClient = JSON.parse(
        localStorage.getItem("selectedClientForPost") || "null"
      );

      let imageUrl = formData.image_url || null;
      let galleryImages = Array.isArray(formData.gallery_images)
        ? formData.gallery_images
        : [];
      let videoUrl = formData.video_url || null;
      let coverType = videoIsCover ? "video" : "image";
      let coverUrl = formData.cover_url || null;

      if (selectedImages.length > 0 || selectedVideo) {
        const mediaUpload = await uploadMedia({
          images: selectedImages.map((x) => x.file),
          video: selectedVideo?.file || null
        });

        galleryImages = mediaUpload.galleryImages || [];
        videoUrl = mediaUpload.videoUrl || null;

        if (videoIsCover && mediaUpload.videoUrl) {
          imageUrl = mediaUpload.videoUrl;
          coverType = "video";
          coverUrl = mediaUpload.videoUrl;
        } else {
          const coverIndex = selectedImages.findIndex((img) => img.isCover);

          imageUrl =
            coverIndex >= 0
              ? galleryImages[coverIndex] || galleryImages[0] || null
              : mediaUpload.coverImage || galleryImages[0] || null;

          coverType = "image";
          coverUrl = imageUrl;
        }
      }

      const cleanedOfferFeatures = isOffer
        ? (formData.offerFeatures || [])
            .map((item) => ({
              text: (item.text || "").trim(),
              included: Boolean(item.included)
            }))
            .filter((item) => item.text)
        : [];

      const payload = buildPostPayload(
        {
          ...formData,
          clientId: selectedClient?.id || formData.clientId || null,
          offerFeatures: cleanedOfferFeatures
        },
        {
          imageUrl,
          galleryImages,
          videoUrl,
          coverType,
          coverUrl
        }
      );

      if (editingId) {
        await updatePost(editingId, payload);
      } else {
        await createPost(payload);
      }

      resetForm();
      await loadPosts();
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë ruajtjes");
    }
  }

  function resetForm() {
    localStorage.removeItem("selectedClientForPost");
    setEditingId(null);
    setSelectedFile(null);
    setSelectedImages([]);
    setSelectedVideo(null);
    setVideoIsCover(false);

    setFormData({
      ...getInitialFormData(),
      ...VEHICLE_FIELDS,

      company_name: "",
      job_category: "",
      job_location: "",
      positions_count: "",

      externalLink: "",
      externalLinkLabel: "",
      featured: false,
      breaking: false,
      is_active: true,
      is_unlimited: false,
      active_from: "",
      active_until: ""
    });
  }

  return {
    posts,
    editingId,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    formData,
    filteredPosts,
    selectedCategoryCount,
    postsByCategory,
    isRealEstate,
    isVehicle,
    isOffer,
    showPriceField,
    showContactFields,
    selectedImages,
    selectedVideo,
    videoIsCover,
    setCoverImage,
    setVideoAsCover,
    moveSelectedImageLeft,
    moveSelectedImageRight,
    removeSelectedImage,
    removeSelectedVideo,
    handleChange,
    handleFileChange,
    handleEdit,
    handleDelete,
    handleSubmit,
    toggleFeatured,
    resetForm,
    addOfferFeature,
    removeOfferFeature,
    handleOfferFeatureChange
  };
}