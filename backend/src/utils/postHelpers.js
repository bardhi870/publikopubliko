import { useEffect, useMemo, useState } from "react";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  uploadImage
} from "../api/postApi";
import { CATEGORY_OPTIONS } from "../constants/postCategories";
import { getInitialFormData } from "../utils/postHelpers";

export default function useAdminPosts() {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const selectedClient = JSON.parse(
      localStorage.getItem("selectedClientForPost") || "null"
    );

    if (!selectedClient) return;

    setFormData((prev) => ({
      ...prev,
      phone: selectedClient.phone || prev.phone,
      whatsapp: selectedClient.phone || prev.whatsapp,
      category:
        mapServiceTypeToCategory(selectedClient.serviceType) || prev.category
    }));
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

  const isJobPost = useMemo(() => {
    return formData.category === "konkurse-pune";
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
          updated.area = "";
          updated.rooms = "";
          updated.bathrooms = "";
        }

        if (fieldValue !== "patundshmeri" && fieldValue !== "konkurse-pune") {
          updated.city = "";
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
      }

      if (name === "is_unlimited" && checked) {
        updated.active_until = "";
      }

      return updated;
    });
  }

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
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

      is_active: post.is_active !== false,
      is_unlimited: post.is_unlimited || false,
      active_from: post.active_from
        ? String(post.active_from).slice(0, 10)
        : "",
      active_until: post.active_until
        ? String(post.active_until).slice(0, 10)
        : ""
    });

    setSelectedFile(null);
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
      let imageUrl = formData.image_url;

      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile);
        imageUrl = uploadResult.imageUrl;
      }

      const cleanedOfferFeatures = isOffer
        ? (formData.offerFeatures || [])
            .map((item) => ({
              text: (item.text || "").trim(),
              included: Boolean(item.included)
            }))
            .filter((item) => item.text)
        : [];

      const selectedClient = JSON.parse(
        localStorage.getItem("selectedClientForPost") || "null"
      );

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        clientId: selectedClient?.id || null,
        price: showPriceField && formData.price ? Number(formData.price) : null,
        image_url: imageUrl || null,

        propertyType: isRealEstate ? formData.propertyType : null,
        listingType: isRealEstate ? formData.listingType : null,
        priceType: isRealEstate ? formData.priceType : null,

        city:
          (isRealEstate || isJobPost)
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

        job_category: isJobPost ? formData.job_category : null,
        experience: isJobPost ? formData.experience : null,
        work_hours: isJobPost ? formData.work_hours : null,
        languages: isJobPost ? formData.languages : null,

        offerBadge: isOffer ? formData.offerBadge : null,
        offerFeatures: isOffer ? cleanedOfferFeatures : [],

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

    const nextForm = getInitialFormData();

    setFormData({
      ...nextForm,
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
    isJobPost,
    showPriceField,
    showContactFields,
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