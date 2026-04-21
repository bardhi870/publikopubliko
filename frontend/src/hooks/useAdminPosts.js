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
    featured: false,
    breaking: false
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
        phone: selectedClient.phone || prev.phone,
        whatsapp: selectedClient.phone || prev.whatsapp,
        category:
          mapServiceTypeToCategory(selectedClient.serviceType) || prev.category
      }));
    }

    if (selectedPostForEdit) {
      setEditingId(selectedPostForEdit.id);

      setFormData((prev) => ({
        ...prev,
        title: selectedPostForEdit.title || "",
        description: selectedPostForEdit.description || "",
        category: selectedPostForEdit.category || "",
        price: selectedPostForEdit.price || "",
        image_url: selectedPostForEdit.image_url || "",
        gallery_images: selectedPostForEdit.gallery_images || [],
        video_url: selectedPostForEdit.video_url || "",
        cover_type: selectedPostForEdit.cover_type || "image",
        cover_url: selectedPostForEdit.cover_url || "",

        propertyType: selectedPostForEdit.property_type || "",
        listingType: selectedPostForEdit.listing_type || "",
        priceType: selectedPostForEdit.price_type || "",
        city: selectedPostForEdit.city || "",
        area: selectedPostForEdit.area || "",
        rooms: selectedPostForEdit.rooms || "",
        bathrooms: selectedPostForEdit.bathrooms || "",

        phone: selectedPostForEdit.phone || "",
        whatsapp: selectedPostForEdit.whatsapp || "",

        job_category: selectedPostForEdit.job_category || "",
        experience: selectedPostForEdit.experience || "",
        work_hours: selectedPostForEdit.work_hours || "",
        languages: selectedPostForEdit.languages || "",

        offerBadge: selectedPostForEdit.offer_badge || "",
        offerFeatures: selectedPostForEdit.offer_features || [
          { text: "", included: true }
        ],

        featured: !!selectedPostForEdit.featured,
        breaking: !!selectedPostForEdit.breaking,

        is_active: selectedPostForEdit.is_active !== false,
        is_unlimited: selectedPostForEdit.is_unlimited || false,
        active_from: selectedPostForEdit.active_from || "",
        active_until: selectedPostForEdit.active_until || "",

        clientId:
          selectedPostForEdit.client_id || selectedClient?.id || null
      }));

      setVideoIsCover(selectedPostForEdit.cover_type === "video");

      localStorage.removeItem("selectedPostForEdit");
    }
  }, []);

  const isRealEstate = useMemo(() => {
    return formData.category === "patundshmeri";
  }, [formData.category]);

  const isVehicle = useMemo(() => {
    return formData.category === "automjete";
  }, [formData.category]);

  const isOffer = useMemo(() => {
    return formData.category === "oferta";
  }, [formData.category]);

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
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  }

  function mapServiceTypeToCategory(serviceType) {
    if (!serviceType) return "";

    if (serviceType === "Konkurs Pune") return "konkurse-pune";
    if (serviceType === "Patundshmëri") return "patundshmeri";
    if (serviceType === "Automjete") return "automjete";

    if (
      serviceType === "Banner" ||
      serviceType === "Postim i sponsorizuar"
    ) {
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

        if (!categoryNeedsPrice) {
          updated.price = "";
        }

        if (fieldValue !== "patundshmeri") {
          updated.propertyType = "";
          updated.listingType = "";
          updated.priceType = "";
          updated.city = "";
          updated.area = "";
          updated.rooms = "";
          updated.bathrooms = "";
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
          updated.job_category = "";
          updated.experience = "";
          updated.work_hours = "";
          updated.languages = "";
        }

        const isNewsCategory = ["vendi", "rajoni", "bota"].includes(fieldValue);

        if (!isNewsCategory) {
          updated.featured = false;
          updated.breaking = false;
        }
      }

      if (name === "is_unlimited" && checked) {
        updated.active_until = "";
      }

      return updated;
    });
  }

  async function compressImageIfNeeded(file) {
    const isImage = file.type.startsWith("image/");
    if (!isImage) return file;

    const options = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      initialQuality: 0.78,
      fileType: "image/webp"
    };

    try {
      const compressed = await imageCompression(file, options);

      console.log(
        "Foto origjinale:",
        file.name,
        Math.round(file.size / 1024),
        "KB"
      );
      console.log(
        "Foto kompresuar:",
        compressed.name,
        Math.round(compressed.size / 1024),
        "KB"
      );

      return compressed;
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

          if (next[newCoverIndex]) {
            next[newCoverIndex].isCover = true;
          } else {
            next[0].isCover = true;
          }
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

  function handleEdit(post) {
    setEditingId(post.id);

    let parsedOfferFeatures = [{ text: "", included: true }];

    if (post.offer_features) {
      try {
        const parsed = Array.isArray(post.offer_features)
          ? post.offer_features
          : JSON.parse(post.offer_features);

        if (Array.isArray(parsed) && parsed.length > 0) {
          parsedOfferFeatures = parsed.map((item) => ({
            text: item.text || "",
            included:
              typeof item.included === "boolean" ? item.included : true
          }));
        }
      } catch (error) {
        console.error("Gabim në leximin e offer_features:", error);
      }
    }

    setFormData({
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
      phone: post.phone || "",
      whatsapp: post.whatsapp || "",
      job_category: post.job_category || "",
      experience: post.experience || "",
      work_hours: post.work_hours || "",
      languages: post.languages || "",
      offerBadge: post.offer_badge || "",
      offerFeatures: parsedOfferFeatures,
      featured: !!post.featured,
      breaking: !!post.breaking,
      is_active: post.is_active !== false,
      is_unlimited: post.is_unlimited || false,
      active_from: post.active_from
        ? String(post.active_from).slice(0, 10)
        : "",
      active_until: post.active_until
        ? String(post.active_until).slice(0, 10)
        : ""
    });

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

      const isNewsCategory = ["vendi", "rajoni", "bota"].includes(
        formData.category
      );

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        clientId: selectedClient?.id || null,
        price:
          showPriceField && formData.price
            ? Number(formData.price)
            : null,

        image_url: imageUrl,
        gallery_images: galleryImages,
        video_url: videoUrl,
        cover_type: coverType,
        cover_url: coverUrl,

        propertyType: isRealEstate ? formData.propertyType : null,
        listingType: isRealEstate ? formData.listingType : null,
        priceType: isRealEstate ? formData.priceType : null,
        city:
          (isRealEstate || formData.category === "konkurse-pune")
            ? formData.city
            : null,
        area: isRealEstate ? formData.area : null,
        rooms: isRealEstate && formData.rooms ? Number(formData.rooms) : null,
        bathrooms:
          isRealEstate && formData.bathrooms
            ? Number(formData.bathrooms)
            : null,

        phone: showContactFields ? formData.phone : null,
        whatsapp: showContactFields ? formData.whatsapp : null,

        job_category:
          formData.category === "konkurse-pune"
            ? formData.job_category
            : null,
        experience:
          formData.category === "konkurse-pune"
            ? formData.experience
            : null,
        work_hours:
          formData.category === "konkurse-pune"
            ? formData.work_hours
            : null,
        languages:
          formData.category === "konkurse-pune"
            ? formData.languages
            : null,

        offerBadge: isOffer ? formData.offerBadge : null,
        offerFeatures: isOffer ? cleanedOfferFeatures : [],

        featured: isNewsCategory ? !!formData.featured : false,
        breaking: isNewsCategory ? !!formData.breaking : false,

        is_active: formData.is_active !== false,
        is_unlimited: formData.is_unlimited || false,
        active_from: formData.active_from || null,
        active_until: formData.is_unlimited
          ? null
          : formData.active_until || null
      };

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

    const nextForm = getInitialFormData();

    setFormData({
      ...nextForm,
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
    resetForm,
    addOfferFeature,
    removeOfferFeature,
    handleOfferFeatureChange
  };
}