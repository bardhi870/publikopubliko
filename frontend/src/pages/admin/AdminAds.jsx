import React, { useEffect, useMemo, useState } from "react";
import AdminTopNav from "../../components/admin/AdminTopNav";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PACKAGES = {
  basic: ["home_in_feed_1"],
  standard: ["home_in_feed_1", "realestate_inline"],
  premium: ["home_header_banner", "sidebar_top", "mobile_sticky_bottom"]
};

const cardStyle = {
  background: "#ffffff",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: "24px",
  boxShadow: "0 14px 40px rgba(15,23,42,0.06)"
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid rgba(15,23,42,0.10)",
  outline: "none",
  fontSize: "14px",
  background: "#fff",
  boxSizing: "border-box"
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 700,
  color: "#334155",
  marginBottom: "8px"
};

const buttonPrimary = {
  border: "none",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  color: "#fff",
  borderRadius: "14px",
  padding: "12px 16px",
  fontWeight: 800,
  cursor: "pointer"
};

const buttonSecondary = {
  border: "1px solid rgba(15,23,42,0.12)",
  background: "#fff",
  color: "#0f172a",
  borderRadius: "12px",
  padding: "10px 14px",
  fontWeight: 800,
  cursor: "pointer"
};

const buttonDanger = {
  border: "1px solid rgba(220,38,38,0.15)",
  background: "#fff5f5",
  color: "#b91c1c",
  borderRadius: "12px",
  padding: "10px 14px",
  fontWeight: 800,
  cursor: "pointer"
};

export default function AdminAds() {
  const [advertisers, setAdvertisers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [creatives, setCreatives] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingAdvertiser, setSavingAdvertiser] = useState(false);
  const [savingCampaign, setSavingCampaign] = useState(false);
  const [savingCreative, setSavingCreative] = useState(false);

  const [editingAdvertiserId, setEditingAdvertiserId] = useState(null);
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [editingCreativeId, setEditingCreativeId] = useState(null);

  const [searchAdvertiser, setSearchAdvertiser] = useState("");
  const [searchCampaign, setSearchCampaign] = useState("");
  const [searchCreative, setSearchCreative] = useState("");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState("all");
  const [campaignSort, setCampaignSort] = useState("priority_desc");

  const [message, setMessage] = useState("");

  const [advertiserForm, setAdvertiserForm] = useState({
    name: "",
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    whatsapp: "",
    address: "",
    notes: "",
    status: "active"
  });

  const [campaignForm, setCampaignForm] = useState({
    advertiser_id: "",
    title: "",
    description: "",
    campaign_type: "banner",
    pricing_model: "flat_fee",
    price: "",
    start_date: "",
    end_date: "",
    status: "active",
    priority: 0,
    target_url: "",
    open_in_new_tab: true,
    notes: "",
    placements: []
  });

  const [creativeForm, setCreativeForm] = useState({
    campaign_id: "",
    creative_type: "image",
    title: "",
    image_url: "",
    image_file: null,
    video_url: "",
    html_code: "",
    headline: "",
    description: "",
    button_text: "",
    button_link: "",
    device_type: "desktop",
    is_primary: true
  });

  const resetAdvertiserForm = () => {
    setAdvertiserForm({
      name: "",
      company_name: "",
      contact_person: "",
      phone: "",
      email: "",
      whatsapp: "",
      address: "",
      notes: "",
      status: "active"
    });
    setEditingAdvertiserId(null);
  };

  const resetCampaignForm = () => {
    setCampaignForm({
      advertiser_id: "",
      title: "",
      description: "",
      campaign_type: "banner",
      pricing_model: "flat_fee",
      price: "",
      start_date: "",
      end_date: "",
      status: "active",
      priority: 0,
      target_url: "",
      open_in_new_tab: true,
      notes: "",
      placements: []
    });
    setEditingCampaignId(null);
  };

  const resetCreativeForm = () => {
    setCreativeForm({
      campaign_id: "",
      creative_type: "image",
      title: "",
      image_url: "",
      image_file: null,
      video_url: "",
      html_code: "",
      headline: "",
      description: "",
      button_text: "",
      button_link: "",
      device_type: "desktop",
      is_primary: true
    });
    setEditingCreativeId(null);
  };

  const filteredAdvertisers = useMemo(() => {
    const q = searchAdvertiser.toLowerCase().trim();

    return advertisers.filter((a) => {
      const haystack = [
        a.name,
        a.company_name,
        a.contact_person,
        a.phone,
        a.email,
        a.whatsapp,
        a.status
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [advertisers, searchAdvertiser]);

  const filteredCampaigns = useMemo(() => {
    const q = searchCampaign.toLowerCase().trim();

    let list = campaigns.filter((c) => {
      const haystack = [
        c.title,
        c.advertiser_name,
        c.campaign_type,
        c.pricing_model,
        c.status,
        c.price,
        c.priority
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = haystack.includes(q);
      const matchesStatus =
        campaignStatusFilter === "all" || c.status === campaignStatusFilter;

      return matchesSearch && matchesStatus;
    });

    if (campaignSort === "priority_desc") {
      list = [...list].sort(
        (a, b) => Number(b.priority || 0) - Number(a.priority || 0)
      );
    }

    if (campaignSort === "priority_asc") {
      list = [...list].sort(
        (a, b) => Number(a.priority || 0) - Number(b.priority || 0)
      );
    }

    if (campaignSort === "price_desc") {
      list = [...list].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    if (campaignSort === "price_asc") {
      list = [...list].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    return list;
  }, [campaigns, searchCampaign, campaignStatusFilter, campaignSort]);

  const filteredCreatives = useMemo(() => {
    const q = searchCreative.toLowerCase().trim();

    return creatives.filter((c) => {
      const haystack = [
        c.title,
        c.headline,
        c.description,
        c.creative_type,
        c.device_type,
        c.campaign_id
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [creatives, searchCreative]);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [advertisersRes, campaignsRes, placementsRes, creativesRes] =
        await Promise.all([
          fetch(`${API_URL}/api/advertisers`),
          fetch(`${API_URL}/api/campaigns`),
          fetch(`${API_URL}/api/ad-placements`),
          fetch(`${API_URL}/api/ad-creatives`)
        ]);

      const [advertisersData, campaignsData, placementsData, creativesData] =
        await Promise.all([
          advertisersRes.json(),
          campaignsRes.json(),
          placementsRes.json(),
          creativesRes.json()
        ]);

      setAdvertisers(Array.isArray(advertisersData) ? advertisersData : []);
      setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
      setPlacements(Array.isArray(placementsData) ? placementsData : []);
      setCreatives(Array.isArray(creativesData) ? creativesData : []);
    } catch (err) {
      console.error("Gabim gjatë marrjes së ads data:", err);
      setMessage("Gabim gjatë marrjes së të dhënave të reklamave.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const placementGroups = useMemo(() => {
    return placements.reduce((acc, item) => {
      const key = item.page_type || "other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [placements]);

  const creativesByCampaignId = useMemo(() => {
    const map = {};
    creatives.forEach((item) => {
      if (!map[item.campaign_id]) map[item.campaign_id] = [];
      map[item.campaign_id].push(item);
    });
    return map;
  }, [creatives]);

  const campaignOptions = useMemo(() => {
    return campaigns.map((campaign) => ({
      value: campaign.id,
      label: `${campaign.title} (#${campaign.id})`
    }));
  }, [campaigns]);

  const handleAdvertiserChange = (e) => {
    const { name, value } = e.target;
    setAdvertiserForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCampaignChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCampaignForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCreativeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCreativeForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "image_url" && value ? { image_file: null } : {})
    }));
  };

  const handleCreativeFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCreativeForm((prev) => ({
      ...prev,
      image_file: file,
      image_url: ""
    }));
  };

  const togglePlacement = (placementId) => {
    setCampaignForm((prev) => {
      const exists = prev.placements.includes(placementId);
      return {
        ...prev,
        placements: exists
          ? prev.placements.filter((id) => id !== placementId)
          : [...prev.placements, placementId]
      };
    });
  };

  const handlePackageSelect = (packageName) => {
    const selectedSlugs = PACKAGES[packageName];
    if (!selectedSlugs) return;

    const selectedIds = placements
      .filter((placement) => selectedSlugs.includes(placement.slug))
      .map((placement) => placement.id);

    setCampaignForm((prev) => ({
      ...prev,
      placements: selectedIds,
      priority:
        packageName === "premium"
          ? 10
          : packageName === "standard"
            ? 5
            : prev.priority
    }));
  };

  const submitAdvertiser = async (e) => {
    e.preventDefault();

    try {
      setSavingAdvertiser(true);
      setMessage("");

      const url = editingAdvertiserId
        ? `${API_URL}/api/advertisers/${editingAdvertiserId}`
        : `${API_URL}/api/advertisers`;

      const method = editingAdvertiserId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(advertiserForm)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Gabim në ruajtjen e reklamuesit.");
      }

      setMessage(
        editingAdvertiserId
          ? "Reklamuesi u përditësua me sukses."
          : "Reklamuesi u krijua me sukses."
      );

      resetAdvertiserForm();
      await fetchAll();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Gabim në ruajtjen e reklamuesit.");
    } finally {
      setSavingAdvertiser(false);
    }
  };

  const submitCampaign = async (e) => {
    e.preventDefault();

    try {
      setSavingCampaign(true);
      setMessage("");

      const payload = {
        ...campaignForm,
        advertiser_id: Number(campaignForm.advertiser_id),
        price: campaignForm.price === "" ? 0 : Number(campaignForm.price),
        priority:
          campaignForm.priority === "" ? 0 : Number(campaignForm.priority),
        placements: campaignForm.placements
      };

      const url = editingCampaignId
        ? `${API_URL}/api/campaigns/${editingCampaignId}`
        : `${API_URL}/api/campaigns`;

      const method = editingCampaignId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Gabim në ruajtjen e fushatës.");
      }

      setMessage(
        editingCampaignId
          ? "Fushata u përditësua me sukses."
          : "Fushata u krijua me sukses."
      );

      resetCampaignForm();
      await fetchAll();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Gabim në ruajtjen e fushatës.");
    } finally {
      setSavingCampaign(false);
    }
  };

  const submitCreative = async (e) => {
    e.preventDefault();

    try {
      setSavingCreative(true);
      setMessage("");

      if (!creativeForm.campaign_id) {
        setMessage("Zgjedh fushatën para ruajtjes së creative.");
        setSavingCreative(false);
        return;
      }

      const formData = new FormData();
      formData.append("campaign_id", creativeForm.campaign_id);
      formData.append("creative_type", creativeForm.creative_type);
      formData.append("title", creativeForm.title);
      formData.append("video_url", creativeForm.video_url);
      formData.append("html_code", creativeForm.html_code);
      formData.append("headline", creativeForm.headline);
      formData.append("description", creativeForm.description);
      formData.append("button_text", creativeForm.button_text);
      formData.append("button_link", creativeForm.button_link);
      formData.append("device_type", creativeForm.device_type);
      formData.append("is_primary", creativeForm.is_primary ? "true" : "false");

      if (creativeForm.image_url) {
        formData.append("image_url", creativeForm.image_url);
      }

      if (creativeForm.image_file) {
        formData.append("image", creativeForm.image_file);
      }

      const url = editingCreativeId
        ? `${API_URL}/api/ad-creatives/${editingCreativeId}`
        : `${API_URL}/api/ad-creatives`;

      const method = editingCreativeId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Gabim në ruajtjen e creative.");
      }

      setMessage(
        editingCreativeId
          ? "Creative u përditësua me sukses."
          : "Creative u krijua me sukses."
      );

      resetCreativeForm();
      await fetchAll();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Gabim në ruajtjen e creative.");
    } finally {
      setSavingCreative(false);
    }
  };

  const handleEditAdvertiser = (advertiser) => {
    setEditingAdvertiserId(advertiser.id);

    setAdvertiserForm({
      name: advertiser.name || "",
      company_name: advertiser.company_name || "",
      contact_person: advertiser.contact_person || "",
      phone: advertiser.phone || "",
      email: advertiser.email || "",
      whatsapp: advertiser.whatsapp || "",
      address: advertiser.address || "",
      notes: advertiser.notes || "",
      status: advertiser.status || "active"
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteAdvertiser = async (id) => {
    const confirmed = window.confirm(
      "A je i sigurt që don me fshi këtë reklamues?"
    );
    if (!confirmed) return;

    try {
      setMessage("");

      const res = await fetch(`${API_URL}/api/advertisers/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Gabim në fshirjen e reklamuesit.");
      }

      if (editingAdvertiserId === id) {
        resetAdvertiserForm();
      }

      setMessage("Reklamuesi u fshi me sukses.");
      await fetchAll();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Gabim në fshirjen e reklamuesit.");
    }
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaignId(campaign.id);

    setCampaignForm({
      advertiser_id: String(campaign.advertiser_id || ""),
      title: campaign.title || "",
      description: campaign.description || "",
      campaign_type: campaign.campaign_type || "banner",
      pricing_model: campaign.pricing_model || "flat_fee",
      price: campaign.price ?? "",
      start_date: campaign.start_date
        ? String(campaign.start_date).slice(0, 10)
        : "",
      end_date: campaign.end_date ? String(campaign.end_date).slice(0, 10) : "",
      status: campaign.status || "active",
      priority: campaign.priority ?? 0,
      target_url: campaign.target_url || "",
      open_in_new_tab:
        campaign.open_in_new_tab === undefined ? true : campaign.open_in_new_tab,
      notes: campaign.notes || "",
      placements: Array.isArray(campaign.placements)
        ? campaign.placements.map((p) => p.placement_id)
        : []
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCampaign = async (id) => {
    const confirmed = window.confirm(
      "A je i sigurt që don me fshi këtë fushatë?"
    );
    if (!confirmed) return;

    try {
      setMessage("");

      const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Gabim në fshirjen e fushatës.");
      }

      if (editingCampaignId === id) {
        resetCampaignForm();
      }

      setMessage("Fushata u fshi me sukses.");
      await fetchAll();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Gabim në fshirjen e fushatës.");
    }
  };

  const handleEditCreative = (creative) => {
    setEditingCreativeId(creative.id);

    setCreativeForm({
      campaign_id: String(creative.campaign_id || ""),
      creative_type: creative.creative_type || "image",
      title: creative.title || "",
      image_url: creative.image_url || "",
      image_file: null,
      video_url: creative.video_url || "",
      html_code: creative.html_code || "",
      headline: creative.headline || "",
      description: creative.description || "",
      button_text: creative.button_text || "",
      button_link: creative.button_link || "",
      device_type: creative.device_type || "desktop",
      is_primary: !!creative.is_primary
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCreative = async (id) => {
    const confirmed = window.confirm(
      "A je i sigurt që don me fshi këtë creative?"
    );
    if (!confirmed) return;

    try {
      setMessage("");

      const res = await fetch(`${API_URL}/api/ad-creatives/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Gabim në fshirjen e creative.");
      }

      if (editingCreativeId === id) {
        resetCreativeForm();
      }

      setMessage("Creative u fshi me sukses.");
      await fetchAll();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Gabim në fshirjen e creative.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.heroCard}>
          <div style={styles.heroGlow} />

          <div style={styles.heroTop} className="admin-ads-hero-top">
            <div style={styles.heroLeft}>
              <div style={styles.heroBadge}>Ads Platform</div>

              <h1 style={styles.heroTitle}>Menaxhimi i reklamave</h1>

              <p style={styles.heroSubtitle}>
                Këtu menaxhon reklamuesit, fushatat, creatives dhe placement-et
                për krejt portalin.
              </p>

              <div style={styles.heroNavWrap}>
                <AdminTopNav />
              </div>
            </div>

            <div style={styles.heroStatsWrap} className="admin-ads-hero-stats">
              <StatCard label="Reklamues" value={advertisers.length} dark />
              <StatCard label="Fushata" value={campaigns.length} dark />
              <StatCard label="Creatives" value={creatives.length} dark />
              <StatCard label="Placements" value={placements.length} dark />
            </div>
          </div>

          {message ? <div style={styles.messageBox}>{message}</div> : null}
        </section>

        <div className="admin-ads-layout" style={styles.mainLayout}>
          <div style={styles.leftColumn}>
            <section style={styles.sectionCard}>
              <SectionHeader
                title={editingAdvertiserId ? "Edito reklamuesin" : "Shto reklamues"}
                actionLabel={editingAdvertiserId ? "Anulo editimin" : null}
                onAction={editingAdvertiserId ? resetAdvertiserForm : null}
              />

              <form onSubmit={submitAdvertiser} style={styles.twoColForm}>
                <Field label="Emri">
                  <input
                    style={inputStyle}
                    name="name"
                    value={advertiserForm.name}
                    onChange={handleAdvertiserChange}
                    required
                  />
                </Field>

                <Field label="Kompania">
                  <input
                    style={inputStyle}
                    name="company_name"
                    value={advertiserForm.company_name}
                    onChange={handleAdvertiserChange}
                  />
                </Field>

                <Field label="Kontakt person">
                  <input
                    style={inputStyle}
                    name="contact_person"
                    value={advertiserForm.contact_person}
                    onChange={handleAdvertiserChange}
                  />
                </Field>

                <Field label="Telefoni">
                  <input
                    style={inputStyle}
                    name="phone"
                    value={advertiserForm.phone}
                    onChange={handleAdvertiserChange}
                  />
                </Field>

                <Field label="Email">
                  <input
                    style={inputStyle}
                    name="email"
                    value={advertiserForm.email}
                    onChange={handleAdvertiserChange}
                  />
                </Field>

                <Field label="WhatsApp">
                  <input
                    style={inputStyle}
                    name="whatsapp"
                    value={advertiserForm.whatsapp}
                    onChange={handleAdvertiserChange}
                  />
                </Field>

                <Field label="Adresa" full>
                  <input
                    style={inputStyle}
                    name="address"
                    value={advertiserForm.address}
                    onChange={handleAdvertiserChange}
                  />
                </Field>

                <Field label="Shënime" full>
                  <textarea
                    style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                    name="notes"
                    value={advertiserForm.notes}
                    onChange={handleAdvertiserChange}
                  />
                </Field>

                <Field label="Status">
                  <select
                    style={inputStyle}
                    name="status"
                    value={advertiserForm.status}
                    onChange={handleAdvertiserChange}
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </Field>

                <div style={styles.formActionWrap}>
                  <button type="submit" style={buttonPrimary} disabled={savingAdvertiser}>
                    {savingAdvertiser
                      ? "Duke ruajtur..."
                      : editingAdvertiserId
                        ? "Ruaj ndryshimet"
                        : "Ruaj reklamuesin"}
                  </button>
                </div>
              </form>
            </section>

            <section style={styles.sectionCard}>
              <SectionHeader
                title={editingCampaignId ? "Edito fushatë" : "Shto fushatë"}
                actionLabel={editingCampaignId ? "Anulo editimin" : null}
                onAction={editingCampaignId ? resetCampaignForm : null}
              />

              <form onSubmit={submitCampaign} style={styles.twoColForm}>
                <Field label="Reklamuesi">
                  <select
                    style={inputStyle}
                    name="advertiser_id"
                    value={campaignForm.advertiser_id}
                    onChange={handleCampaignChange}
                    required
                  >
                    <option value="">Zgjedh reklamuesin</option>
                    {advertisers.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Titulli">
                  <input
                    style={inputStyle}
                    name="title"
                    value={campaignForm.title}
                    onChange={handleCampaignChange}
                    required
                  />
                </Field>

                <Field label="Përshkrimi" full>
                  <textarea
                    style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                    name="description"
                    value={campaignForm.description}
                    onChange={handleCampaignChange}
                  />
                </Field>

                <Field label="Campaign type">
                  <select
                    style={inputStyle}
                    name="campaign_type"
                    value={campaignForm.campaign_type}
                    onChange={handleCampaignChange}
                  >
                    <option value="banner">banner</option>
                    <option value="sponsored">sponsored</option>
                    <option value="native">native</option>
                    <option value="sidebar">sidebar</option>
                    <option value="sticky">sticky</option>
                    <option value="hero">hero</option>
                  </select>
                </Field>

                <Field label="Pricing model">
                  <select
                    style={inputStyle}
                    name="pricing_model"
                    value={campaignForm.pricing_model}
                    onChange={handleCampaignChange}
                  >
                    <option value="flat_fee">flat_fee</option>
                    <option value="cpm">cpm</option>
                    <option value="cpc">cpc</option>
                  </select>
                </Field>

                <Field label="Çmimi">
                  <input
                    style={inputStyle}
                    name="price"
                    type="number"
                    value={campaignForm.price}
                    onChange={handleCampaignChange}
                    placeholder="Vendose çmimin vetë"
                  />
                </Field>

                <Field label="Prioriteti">
                  <input
                    style={inputStyle}
                    name="priority"
                    type="number"
                    value={campaignForm.priority}
                    onChange={handleCampaignChange}
                  />
                </Field>

                <Field label="Data fillimit">
                  <input
                    style={inputStyle}
                    name="start_date"
                    type="date"
                    value={campaignForm.start_date}
                    onChange={handleCampaignChange}
                  />
                </Field>

                <Field label="Data mbarimit">
                  <input
                    style={inputStyle}
                    name="end_date"
                    type="date"
                    value={campaignForm.end_date}
                    onChange={handleCampaignChange}
                  />
                </Field>

                <Field label="Status">
                  <select
                    style={inputStyle}
                    name="status"
                    value={campaignForm.status}
                    onChange={handleCampaignChange}
                  >
                    <option value="draft">draft</option>
                    <option value="active">active</option>
                    <option value="paused">paused</option>
                    <option value="expired">expired</option>
                  </select>
                </Field>

                <Field label="Target URL">
                  <input
                    style={inputStyle}
                    name="target_url"
                    value={campaignForm.target_url}
                    onChange={handleCampaignChange}
                  />
                </Field>

                <Field label="Shënime" full>
                  <textarea
                    style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                    name="notes"
                    value={campaignForm.notes}
                    onChange={handleCampaignChange}
                  />
                </Field>

                <div style={styles.packageBox}>
                  <div style={styles.packageTitle}>Zgjedh paketën</div>
                  <div style={styles.packageSubtitle}>
                    Paketa zgjedh placement-et automatikisht. Çmimin e vendos admini vetë.
                  </div>

                  <div style={styles.packageGrid}>
                    <button
                      type="button"
                      style={styles.packageButton}
                      onClick={() => handlePackageSelect("basic")}
                    >
                      <span style={styles.packageEmoji}>🟢</span>
                      <strong>Basic</strong>
                      <small>Home mid</small>
                    </button>

                    <button
                      type="button"
                      style={styles.packageButton}
                      onClick={() => handlePackageSelect("standard")}
                    >
                      <span style={styles.packageEmoji}>🟡</span>
                      <strong>Standard</strong>
                      <small>Home mid + kategori</small>
                    </button>

                    <button
                      type="button"
                      style={{
                        ...styles.packageButton,
                        background: "linear-gradient(135deg, #0f172a, #1e293b)",
                        color: "#fff"
                      }}
                      onClick={() => handlePackageSelect("premium")}
                    >
                      <span style={styles.packageEmoji}>🔴</span>
                      <strong>Premium</strong>
                      <small style={{ color: "rgba(255,255,255,.78)" }}>
                        Header + Sidebar + Mobile
                      </small>
                    </button>
                  </div>
                </div>

                <div style={styles.placementBox}>
                  <div style={styles.placementTitle}>Zgjedh placement-et</div>

                  <div style={styles.placementGroupsGrid}>
                    {Object.keys(placementGroups).map((group) => (
                      <div key={group} style={styles.placementGroupCard}>
                        <div style={styles.placementGroupLabel}>{group}</div>

                        <div style={styles.placementChecks}>
                          {placementGroups[group].map((item) => (
                            <label key={item.id} style={styles.placementCheckLabel}>
                              <input
                                type="checkbox"
                                checked={campaignForm.placements.includes(item.id)}
                                onChange={() => togglePlacement(item.id)}
                                style={{ marginTop: "3px" }}
                              />
                              <div>
                                <div style={styles.placementName}>{item.name}</div>
                                <div style={styles.placementSlug}>{item.slug}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.fullWidthRow}>
                  <label style={styles.inlineCheckLabel}>
                    <input
                      type="checkbox"
                      name="open_in_new_tab"
                      checked={campaignForm.open_in_new_tab}
                      onChange={handleCampaignChange}
                    />
                    Hapet në tab të ri
                  </label>
                </div>

                <div style={styles.fullWidthRow}>
                  <button type="submit" style={buttonPrimary} disabled={savingCampaign}>
                    {savingCampaign
                      ? "Duke ruajtur..."
                      : editingCampaignId
                        ? "Ruaj ndryshimet"
                        : "Ruaj fushatën"}
                  </button>
                </div>
              </form>
            </section>

            <section style={styles.sectionCard}>
              <SectionHeader
                title={editingCreativeId ? "Edito creative" : "Shto creative"}
                actionLabel={editingCreativeId ? "Anulo editimin" : null}
                onAction={editingCreativeId ? resetCreativeForm : null}
              />

              <form onSubmit={submitCreative} style={styles.twoColForm}>
                <Field label="Campaign">
                  <select
                    style={inputStyle}
                    name="campaign_id"
                    value={creativeForm.campaign_id}
                    onChange={handleCreativeChange}
                    required
                  >
                    <option value="">Zgjedh fushatën</option>
                    {campaignOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Creative type">
                  <select
                    style={inputStyle}
                    name="creative_type"
                    value={creativeForm.creative_type}
                    onChange={handleCreativeChange}
                  >
                    <option value="image">image</option>
                    <option value="video">video</option>
                    <option value="html">html</option>
                    <option value="text">text</option>
                  </select>
                </Field>

                <Field label="Titulli">
                  <input
                    style={inputStyle}
                    name="title"
                    value={creativeForm.title}
                    onChange={handleCreativeChange}
                  />
                </Field>

                <Field label="Device type">
                  <select
                    style={inputStyle}
                    name="device_type"
                    value={creativeForm.device_type}
                    onChange={handleCreativeChange}
                  >
                    <option value="all">all</option>
                    <option value="desktop">desktop</option>
                    <option value="mobile">mobile</option>
                  </select>
                </Field>

                <Field label="Ngarko Banner" full>
                  <input type="file" accept="image/*" onChange={handleCreativeFileChange} />
                  {creativeForm.image_file ? (
                    <div style={styles.selectedFileBox}>
                      Zgjedhur: {creativeForm.image_file.name}
                    </div>
                  ) : null}
                </Field>

                <Field label="Image URL (opsionale)" full>
                  <input
                    style={inputStyle}
                    name="image_url"
                    value={creativeForm.image_url}
                    onChange={handleCreativeChange}
                    placeholder="Përdore vetëm nëse s’po ngarkon file"
                  />
                </Field>

                <Field label="Video URL" full>
                  <input
                    style={inputStyle}
                    name="video_url"
                    value={creativeForm.video_url}
                    onChange={handleCreativeChange}
                  />
                </Field>

                <Field label="HTML Code" full>
                  <textarea
                    style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                    name="html_code"
                    value={creativeForm.html_code}
                    onChange={handleCreativeChange}
                  />
                </Field>

                <Field label="Headline" full>
                  <input
                    style={inputStyle}
                    name="headline"
                    value={creativeForm.headline}
                    onChange={handleCreativeChange}
                  />
                </Field>

                <Field label="Description" full>
                  <textarea
                    style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                    name="description"
                    value={creativeForm.description}
                    onChange={handleCreativeChange}
                  />
                </Field>

                <Field label="Button text">
                  <input
                    style={inputStyle}
                    name="button_text"
                    value={creativeForm.button_text}
                    onChange={handleCreativeChange}
                  />
                </Field>

                <Field label="Button link">
                  <input
                    style={inputStyle}
                    name="button_link"
                    value={creativeForm.button_link}
                    onChange={handleCreativeChange}
                  />
                </Field>

                <div style={styles.fullWidthRow}>
                  <label style={styles.inlineCheckLabel}>
                    <input
                      type="checkbox"
                      name="is_primary"
                      checked={creativeForm.is_primary}
                      onChange={handleCreativeChange}
                    />
                    Primary creative
                  </label>
                </div>

                <div style={styles.fullWidthRow}>
                  <button type="submit" style={buttonPrimary} disabled={savingCreative}>
                    {savingCreative
                      ? "Duke ruajtur..."
                      : editingCreativeId
                        ? "Ruaj ndryshimet"
                        : "Ruaj creative"}
                  </button>
                </div>
              </form>
            </section>
          </div>

          <div style={styles.rightColumn}>
            <section style={styles.sectionCard}>
              <h2 style={styles.sideTitle}>Reklamuesit</h2>

              <input
                style={{ ...inputStyle, marginBottom: "12px" }}
                placeholder="Kërko reklamues..."
                value={searchAdvertiser}
                onChange={(e) => setSearchAdvertiser(e.target.value)}
              />

              {loading ? (
                <div style={styles.sideEmpty}>Duke ngarkuar...</div>
              ) : advertisers.length === 0 ? (
                <div style={styles.sideEmpty}>Nuk ka reklamues ende.</div>
              ) : filteredAdvertisers.length === 0 ? (
                <div style={styles.sideEmpty}>Nuk u gjet asnjë reklamues.</div>
              ) : (
                <div style={styles.sideList}>
                  {filteredAdvertisers.map((item) => (
                    <div key={item.id} style={styles.sideItemCard}>
                      <div style={styles.sideItemTitle}>{item.name}</div>
                      <div style={styles.sideItemSub}>
                        {item.company_name || "Pa kompani"}
                      </div>

                      <div style={styles.tagRow}>
                        <span style={styles.defaultTag}>{item.status}</span>
                        {item.phone ? <span style={styles.defaultTag}>{item.phone}</span> : null}
                      </div>

                      <div style={styles.actionsRow}>
                        <button
                          type="button"
                          style={buttonSecondary}
                          onClick={() => handleEditAdvertiser(item)}
                        >
                          Edito
                        </button>

                        <button
                          type="button"
                          style={buttonDanger}
                          onClick={() => handleDeleteAdvertiser(item.id)}
                        >
                          Fshij
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section style={styles.sectionCard}>
              <h2 style={styles.sideTitle}>Fushatat</h2>

              <div style={styles.filterGrid}>
                <input
                  style={inputStyle}
                  placeholder="Kërko fushatë..."
                  value={searchCampaign}
                  onChange={(e) => setSearchCampaign(e.target.value)}
                />

                <select
                  style={inputStyle}
                  value={campaignStatusFilter}
                  onChange={(e) => setCampaignStatusFilter(e.target.value)}
                >
                  <option value="all">Të gjitha statuset</option>
                  <option value="active">active</option>
                  <option value="paused">paused</option>
                  <option value="draft">draft</option>
                  <option value="expired">expired</option>
                </select>

                <select
                  style={inputStyle}
                  value={campaignSort}
                  onChange={(e) => setCampaignSort(e.target.value)}
                >
                  <option value="priority_desc">Priority: më i larti</option>
                  <option value="priority_asc">Priority: më i ulëti</option>
                  <option value="price_desc">Çmimi: më i larti</option>
                  <option value="price_asc">Çmimi: më i ulëti</option>
                </select>
              </div>

              <div style={styles.countText}>
                Shfaqen {filteredCampaigns.length} nga {campaigns.length} fushata
              </div>

              {loading ? (
                <div style={styles.sideEmpty}>Duke ngarkuar...</div>
              ) : campaigns.length === 0 ? (
                <div style={styles.sideEmpty}>Nuk ka fushata ende.</div>
              ) : filteredCampaigns.length === 0 ? (
                <div style={styles.sideEmpty}>Nuk u gjet asnjë fushatë.</div>
              ) : (
                <div style={styles.sideList}>
                  {filteredCampaigns.map((item) => {
                    const linkedCreatives = creativesByCampaignId[item.id] || [];

                    return (
                      <div key={item.id} style={styles.sideItemCard}>
                        <div style={styles.campaignTopRow}>
                          <div>
                            <div style={styles.sideItemTitle}>{item.title}</div>
                            <div style={styles.sideItemSub}>
                              {item.advertiser_name || "Pa reklamues"}
                            </div>
                          </div>

                          <span
                            style={{
                              ...styles.defaultTag,
                              background:
                                item.status === "active"
                                  ? "rgba(34,197,94,0.12)"
                                  : item.status === "paused"
                                    ? "rgba(245,158,11,0.14)"
                                    : "rgba(148,163,184,0.12)",
                              color:
                                item.status === "active"
                                  ? "#15803d"
                                  : item.status === "paused"
                                    ? "#b45309"
                                    : "#475569"
                            }}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div style={styles.tagRow}>
                          <span style={styles.defaultTag}>{item.campaign_type}</span>
                          <span style={styles.defaultTag}>€ {item.price}</span>
                          <span style={styles.defaultTag}>priority {item.priority}</span>
                          <span style={styles.defaultTag}>
                            creatives {linkedCreatives.length}
                          </span>
                        </div>

                        {Array.isArray(item.placements) && item.placements.length > 0 ? (
                          <div style={styles.tagRow}>
                            {item.placements.map((placement) => (
                              <span
                                key={`${item.id}-${placement.placement_id}`}
                                style={styles.blueTag}
                              >
                                {placement.placement_slug}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <div style={styles.actionsRow}>
                          <button
                            type="button"
                            style={buttonSecondary}
                            onClick={() => handleEditCampaign(item)}
                          >
                            Edito
                          </button>

                          <button
                            type="button"
                            style={buttonDanger}
                            onClick={() => handleDeleteCampaign(item.id)}
                          >
                            Fshij
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section style={styles.sectionCard}>
              <h2 style={styles.sideTitle}>Creatives</h2>

              <input
                style={{ ...inputStyle, marginBottom: "12px" }}
                placeholder="Kërko creative..."
                value={searchCreative}
                onChange={(e) => setSearchCreative(e.target.value)}
              />

              {loading ? (
                <div style={styles.sideEmpty}>Duke ngarkuar...</div>
              ) : creatives.length === 0 ? (
                <div style={styles.sideEmpty}>Nuk ka creatives ende.</div>
              ) : filteredCreatives.length === 0 ? (
                <div style={styles.sideEmpty}>Nuk u gjet asnjë creative.</div>
              ) : (
                <div style={styles.sideList}>
                  {filteredCreatives.map((item) => (
                    <div key={item.id} style={styles.sideItemCard}>
                      {item.image_url || item.video_url ? (
                        <div style={styles.previewWrap}>
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title || item.headline || "creative"}
                              style={styles.previewMedia}
                            />
                          ) : (
                            <video src={item.video_url} style={styles.previewMedia} muted />
                          )}
                        </div>
                      ) : null}

                      <div style={styles.sideItemTitle}>
                        {item.title || item.headline || `Creative #${item.id}`}
                      </div>

                      <div style={styles.sideItemSub}>campaign #{item.campaign_id}</div>

                      <div style={styles.tagRow}>
                        <span style={styles.defaultTag}>{item.creative_type}</span>
                        <span style={styles.defaultTag}>{item.device_type}</span>
                        {item.is_primary ? <span style={styles.blueTag}>primary</span> : null}
                      </div>

                      <div style={styles.actionsRow}>
                        <button
                          type="button"
                          style={buttonSecondary}
                          onClick={() => handleEditCreative(item)}
                        >
                          Edito
                        </button>

                        <button
                          type="button"
                          style={buttonDanger}
                          onClick={() => handleDeleteCreative(item.id)}
                        >
                          Fshij
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section style={styles.sectionCard}>
              <h2 style={styles.sideTitle}>Placement-et</h2>

              {loading ? (
                <div style={styles.sideEmpty}>Duke ngarkuar...</div>
              ) : placements.length === 0 ? (
                <div style={styles.sideEmpty}>Nuk ka placements.</div>
              ) : (
                <div style={styles.sideList}>
                  {placements.map((item) => (
                    <div key={item.id} style={styles.sideItemCard}>
                      <div style={styles.sideItemTitle}>{item.name}</div>
                      <div style={styles.sideItemSub}>{item.slug}</div>

                      <div style={styles.tagRow}>
                        <span style={styles.defaultTag}>{item.page_type}</span>
                        <span style={styles.defaultTag}>{item.device_type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1180px) {
          .admin-ads-layout {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 1100px) {
          .admin-ads-hero-top {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .admin-ads-hero-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          input, select, textarea, button {
            font-size: 16px !important;
          }
        }

        @media (max-width: 520px) {
          .admin-ads-hero-stats {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, full = false }) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : undefined}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <div style={styles.sectionHeader}>
      <h2 style={styles.sectionTitle}>{title}</h2>

      {actionLabel ? (
        <button type="button" style={buttonSecondary} onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, dark = false }) {
  return (
    <div
      style={{
        background: dark ? "rgba(255,255,255,0.10)" : "#fff",
        borderRadius: "20px",
        padding: "18px",
        border: dark ? "1px solid rgba(255,255,255,0.16)" : "1px solid #e2e8f0",
        boxShadow: dark
          ? "inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 10px 30px rgba(15,23,42,0.06)",
        backdropFilter: dark ? "blur(10px)" : "none"
      }}
    >
      <div
        style={{
          color: dark ? "rgba(255,255,255,0.80)" : "#64748b",
          fontSize: "13px",
          marginBottom: "8px",
          fontWeight: "700"
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "30px",
          fontWeight: "900",
          color: dark ? "#ffffff" : "#0f172a",
          lineHeight: 1
        }}
      >
        {value}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef4ff 45%, #f8fafc 100%)",
    padding: "8px 14px 48px"
  },

  container: {
    maxWidth: "1620px",
    margin: "0 auto"
  },

  heroCard: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0f1f4d 0%, #1d3d9f 58%, #2563eb 100%)",
    borderRadius: "30px",
    padding: "26px",
    marginBottom: "22px",
    boxShadow: "0 22px 60px rgba(37,99,235,0.22)"
  },

  heroGlow: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(circle at top right, rgba(255,255,255,0.16), transparent 24%), radial-gradient(circle at bottom left, rgba(255,255,255,0.08), transparent 20%)"
  },

  heroTop: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.95fr)",
    gap: "22px",
    alignItems: "start"
  },

  heroLeft: {
    minWidth: 0
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "9px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "14px"
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(32px, 4vw, 52px)",
    lineHeight: 1.02,
    fontWeight: "900",
    letterSpacing: "-0.04em"
  },

  heroSubtitle: {
    margin: "14px 0 0",
    color: "rgba(255,255,255,0.92)",
    fontSize: "15px",
    lineHeight: 1.8,
    maxWidth: "760px",
    fontWeight: "500"
  },

  heroNavWrap: {
    marginTop: "22px"
  },

  heroStatsWrap: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    alignSelf: "start"
  },

  messageBox: {
    position: "relative",
    zIndex: 2,
    marginTop: "18px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "#fff",
    border: "1px solid rgba(15,23,42,0.08)",
    color: "#0f172a",
    fontWeight: "700"
  },

  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1.05fr 1fr",
    gap: "20px",
    alignItems: "start"
  },

  leftColumn: {
    display: "grid",
    gap: "20px"
  },

  rightColumn: {
    display: "grid",
    gap: "20px"
  },

  sectionCard: {
    ...cardStyle,
    padding: "22px"
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "16px"
  },

  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#0f172a"
  },

  twoColForm: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px"
  },

  formActionWrap: {
    display: "flex",
    alignItems: "end"
  },

  filterGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 150px 170px",
    gap: "10px",
    marginBottom: "10px"
  },

  countText: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: 700,
    marginBottom: "12px"
  },

  packageBox: {
    gridColumn: "1 / -1",
    border: "1px solid rgba(37,99,235,0.14)",
    borderRadius: "20px",
    padding: "16px",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)"
  },

  packageTitle: {
    fontSize: "15px",
    fontWeight: 900,
    color: "#0f172a",
    marginBottom: "4px"
  },

  packageSubtitle: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: 600,
    marginBottom: "14px"
  },

  packageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px"
  },

  packageButton: {
    border: "1px solid rgba(15,23,42,0.08)",
    background: "#fff",
    borderRadius: "18px",
    padding: "14px",
    cursor: "pointer",
    display: "grid",
    gap: "6px",
    textAlign: "left",
    color: "#0f172a",
    boxShadow: "0 10px 24px rgba(15,23,42,0.05)"
  },

  packageEmoji: {
    fontSize: "20px"
  },

  placementBox: {
    gridColumn: "1 / -1",
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: "18px",
    padding: "16px",
    background: "#f8fafc"
  },

  placementTitle: {
    fontSize: "14px",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "12px"
  },

  placementGroupsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px"
  },

  placementGroupCard: {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid rgba(15,23,42,0.06)",
    padding: "14px"
  },

  placementGroupLabel: {
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "#64748b",
    marginBottom: "10px"
  },

  placementChecks: {
    display: "grid",
    gap: "10px"
  },

  placementCheckLabel: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    cursor: "pointer"
  },

  placementName: {
    fontWeight: 700,
    color: "#0f172a",
    fontSize: "14px"
  },

  placementSlug: {
    color: "#64748b",
    fontSize: "12px"
  },

  fullWidthRow: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  inlineCheckLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: 700,
    color: "#334155"
  },

  selectedFileBox: {
    marginTop: "10px",
    padding: "10px 14px",
    background: "#eef2ff",
    borderRadius: "12px",
    fontWeight: 700,
    color: "#1e293b"
  },

  sideTitle: {
    margin: "0 0 16px",
    fontSize: "22px",
    color: "#0f172a"
  },

  sideEmpty: {
    color: "#64748b"
  },

  sideList: {
    display: "grid",
    gap: "12px"
  },

  sideItemCard: {
    border: "1px solid rgba(15,23,42,0.06)",
    borderRadius: "18px",
    padding: "14px"
  },

  sideItemTitle: {
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "6px"
  },

  sideItemSub: {
    color: "#64748b",
    fontSize: "13px"
  },

  tagRow: {
    marginTop: "10px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "12px"
  },

  defaultTag: {
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(15,23,42,0.04)",
    color: "#475569"
  },

  blueTag: {
    fontSize: "11px",
    padding: "6px 9px",
    borderRadius: "999px",
    background: "rgba(37,99,235,0.08)",
    color: "#1d4ed8",
    fontWeight: 700
  },

  actionsRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  campaignTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "start",
    marginBottom: "8px"
  },

  previewWrap: {
    marginBottom: "12px",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#f1f5f9",
    border: "1px solid rgba(15,23,42,0.06)"
  },

  previewMedia: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    display: "block"
  }
};