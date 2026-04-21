import React, { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
        headers: {
          "Content-Type": "application/json"
        },
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
        headers: {
          "Content-Type": "application/json"
        },
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

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
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

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
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

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
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
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px 16px 60px"
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            ...cardStyle,
            padding: "24px",
            marginBottom: "20px",
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8fafc 55%, #eef2ff 100%)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center"
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  padding: "7px 12px",
                  borderRadius: "999px",
                  background: "rgba(37,99,235,0.08)",
                  color: "#1d4ed8",
                  fontSize: "12px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "12px"
                }}
              >
                Ads Platform
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(28px, 4vw, 42px)",
                  lineHeight: 1.05,
                  color: "#0f172a"
                }}
              >
                Menaxhimi i reklamave
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#475569",
                  fontSize: "15px",
                  maxWidth: "760px",
                  lineHeight: 1.7
                }}
              >
                Këtu menaxhon reklamuesit, fushatat, creatives dhe placement-et
                për krejt portalin.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(120px, 1fr))",
                gap: "12px",
                width: "100%",
                maxWidth: "560px"
              }}
            >
              {[
                { label: "Reklamues", value: advertisers.length },
                { label: "Fushata", value: campaigns.length },
                { label: "Creatives", value: creatives.length },
                { label: "Placements", value: placements.length }
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(15,23,42,0.06)",
                    borderRadius: "18px",
                    padding: "16px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      fontWeight: 700,
                      marginBottom: "8px"
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "26px",
                      fontWeight: 900,
                      color: "#0f172a"
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "#fff",
                border: "1px solid rgba(15,23,42,0.08)",
                color: "#0f172a",
                fontWeight: 700
              }}
            >
              {message}
            </div>
          )}
        </div>

        <div
          className="admin-ads-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: "20px",
            alignItems: "start"
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "20px"
            }}
          >
            <section style={{ ...cardStyle, padding: "22px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                  alignItems: "center",
                  marginBottom: "16px"
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    color: "#0f172a"
                  }}
                >
                  {editingAdvertiserId ? "Edito reklamuesin" : "Shto reklamues"}
                </h2>

                {editingAdvertiserId ? (
                  <button
                    type="button"
                    style={buttonSecondary}
                    onClick={resetAdvertiserForm}
                  >
                    Anulo editimin
                  </button>
                ) : null}
              </div>

              <form
                onSubmit={submitAdvertiser}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "14px"
                }}
              >
                <div>
                  <label style={labelStyle}>Emri</label>
                  <input
                    style={inputStyle}
                    name="name"
                    value={advertiserForm.name}
                    onChange={handleAdvertiserChange}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Kompania</label>
                  <input
                    style={inputStyle}
                    name="company_name"
                    value={advertiserForm.company_name}
                    onChange={handleAdvertiserChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Kontakt person</label>
                  <input
                    style={inputStyle}
                    name="contact_person"
                    value={advertiserForm.contact_person}
                    onChange={handleAdvertiserChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Telefoni</label>
                  <input
                    style={inputStyle}
                    name="phone"
                    value={advertiserForm.phone}
                    onChange={handleAdvertiserChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    style={inputStyle}
                    name="email"
                    value={advertiserForm.email}
                    onChange={handleAdvertiserChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>WhatsApp</label>
                  <input
                    style={inputStyle}
                    name="whatsapp"
                    value={advertiserForm.whatsapp}
                    onChange={handleAdvertiserChange}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Adresa</label>
                  <input
                    style={inputStyle}
                    name="address"
                    value={advertiserForm.address}
                    onChange={handleAdvertiserChange}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Shënime</label>
                  <textarea
                    style={{
                      ...inputStyle,
                      minHeight: "100px",
                      resize: "vertical"
                    }}
                    name="notes"
                    value={advertiserForm.notes}
                    onChange={handleAdvertiserChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Status</label>
                  <select
                    style={inputStyle}
                    name="status"
                    value={advertiserForm.status}
                    onChange={handleAdvertiserChange}
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "end"
                  }}
                >
                  <button
                    type="submit"
                    style={buttonPrimary}
                    disabled={savingAdvertiser}
                  >
                    {savingAdvertiser
                      ? "Duke ruajtur..."
                      : editingAdvertiserId
                        ? "Ruaj ndryshimet"
                        : "Ruaj reklamuesin"}
                  </button>
                </div>
              </form>
            </section>

            <section style={{ ...cardStyle, padding: "22px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                  alignItems: "center",
                  marginBottom: "16px"
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    color: "#0f172a"
                  }}
                >
                  {editingCampaignId ? "Edito fushatë" : "Shto fushatë"}
                </h2>

                {editingCampaignId ? (
                  <button
                    type="button"
                    style={buttonSecondary}
                    onClick={resetCampaignForm}
                  >
                    Anulo editimin
                  </button>
                ) : null}
              </div>

              <form
                onSubmit={submitCampaign}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "14px"
                }}
              >
                <div>
                  <label style={labelStyle}>Reklamuesi</label>
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
                </div>

                <div>
                  <label style={labelStyle}>Titulli</label>
                  <input
                    style={inputStyle}
                    name="title"
                    value={campaignForm.title}
                    onChange={handleCampaignChange}
                    required
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Përshkrimi</label>
                  <textarea
                    style={{
                      ...inputStyle,
                      minHeight: "100px",
                      resize: "vertical"
                    }}
                    name="description"
                    value={campaignForm.description}
                    onChange={handleCampaignChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Campaign type</label>
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
                </div>

                <div>
                  <label style={labelStyle}>Pricing model</label>
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
                </div>

                <div>
                  <label style={labelStyle}>Çmimi</label>
                  <input
                    style={inputStyle}
                    name="price"
                    type="number"
                    value={campaignForm.price}
                    onChange={handleCampaignChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Prioriteti</label>
                  <input
                    style={inputStyle}
                    name="priority"
                    type="number"
                    value={campaignForm.priority}
                    onChange={handleCampaignChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Data fillimit</label>
                  <input
                    style={inputStyle}
                    name="start_date"
                    type="date"
                    value={campaignForm.start_date}
                    onChange={handleCampaignChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Data mbarimit</label>
                  <input
                    style={inputStyle}
                    name="end_date"
                    type="date"
                    value={campaignForm.end_date}
                    onChange={handleCampaignChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Status</label>
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
                </div>

                <div>
                  <label style={labelStyle}>Target URL</label>
                  <input
                    style={inputStyle}
                    name="target_url"
                    value={campaignForm.target_url}
                    onChange={handleCampaignChange}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Shënime</label>
                  <textarea
                    style={{
                      ...inputStyle,
                      minHeight: "90px",
                      resize: "vertical"
                    }}
                    name="notes"
                    value={campaignForm.notes}
                    onChange={handleCampaignChange}
                  />
                </div>

                <div
                  style={{
                    gridColumn: "1 / -1",
                    border: "1px solid rgba(15,23,42,0.08)",
                    borderRadius: "18px",
                    padding: "16px",
                    background: "#f8fafc"
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "#0f172a",
                      marginBottom: "12px"
                    }}
                  >
                    Zgjedh placement-et
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "16px"
                    }}
                  >
                    {Object.keys(placementGroups).map((group) => (
                      <div
                        key={group}
                        style={{
                          background: "#fff",
                          borderRadius: "16px",
                          border: "1px solid rgba(15,23,42,0.06)",
                          padding: "14px"
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 900,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: "#64748b",
                            marginBottom: "10px"
                          }}
                        >
                          {group}
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gap: "10px"
                          }}
                        >
                          {placementGroups[group].map((item) => (
                            <label
                              key={item.id}
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "flex-start",
                                cursor: "pointer"
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={campaignForm.placements.includes(item.id)}
                                onChange={() => togglePlacement(item.id)}
                                style={{ marginTop: "3px" }}
                              />
                              <div>
                                <div
                                  style={{
                                    fontWeight: 700,
                                    color: "#0f172a",
                                    fontSize: "14px"
                                  }}
                                >
                                  {item.name}
                                </div>
                                <div
                                  style={{
                                    color: "#64748b",
                                    fontSize: "12px"
                                  }}
                                >
                                  {item.slug}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontWeight: 700,
                      color: "#334155"
                    }}
                  >
                    <input
                      type="checkbox"
                      name="open_in_new_tab"
                      checked={campaignForm.open_in_new_tab}
                      onChange={handleCampaignChange}
                    />
                    Hapet në tab të ri
                  </label>
                </div>

                <div
                  style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                  }}
                >
                  <button
                    type="submit"
                    style={buttonPrimary}
                    disabled={savingCampaign}
                  >
                    {savingCampaign
                      ? "Duke ruajtur..."
                      : editingCampaignId
                        ? "Ruaj ndryshimet"
                        : "Ruaj fushatën"}
                  </button>
                </div>
              </form>
            </section>

            <section style={{ ...cardStyle, padding: "22px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                  alignItems: "center",
                  marginBottom: "16px"
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    color: "#0f172a"
                  }}
                >
                  {editingCreativeId ? "Edito creative" : "Shto creative"}
                </h2>

                {editingCreativeId ? (
                  <button
                    type="button"
                    style={buttonSecondary}
                    onClick={resetCreativeForm}
                  >
                    Anulo editimin
                  </button>
                ) : null}
              </div>

              <form
                onSubmit={submitCreative}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "14px"
                }}
              >
                <div>
                  <label style={labelStyle}>Campaign</label>
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
                </div>

                <div>
                  <label style={labelStyle}>Creative type</label>
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
                </div>

                <div>
                  <label style={labelStyle}>Titulli</label>
                  <input
                    style={inputStyle}
                    name="title"
                    value={creativeForm.title}
                    onChange={handleCreativeChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Device type</label>
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
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Ngarko Banner</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCreativeFileChange}
                  />

                  {creativeForm.image_file && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "10px 14px",
                        background: "#eef2ff",
                        borderRadius: "12px",
                        fontWeight: 700,
                        color: "#1e293b"
                      }}
                    >
                      Zgjedhur: {creativeForm.image_file.name}
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Image URL (opsionale)</label>
                  <input
                    style={inputStyle}
                    name="image_url"
                    value={creativeForm.image_url}
                    onChange={handleCreativeChange}
                    placeholder="Përdore vetëm nëse s’po ngarkon file"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Video URL</label>
                  <input
                    style={inputStyle}
                    name="video_url"
                    value={creativeForm.video_url}
                    onChange={handleCreativeChange}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>HTML Code</label>
                  <textarea
                    style={{
                      ...inputStyle,
                      minHeight: "100px",
                      resize: "vertical"
                    }}
                    name="html_code"
                    value={creativeForm.html_code}
                    onChange={handleCreativeChange}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Headline</label>
                  <input
                    style={inputStyle}
                    name="headline"
                    value={creativeForm.headline}
                    onChange={handleCreativeChange}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    style={{
                      ...inputStyle,
                      minHeight: "100px",
                      resize: "vertical"
                    }}
                    name="description"
                    value={creativeForm.description}
                    onChange={handleCreativeChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Button text</label>
                  <input
                    style={inputStyle}
                    name="button_text"
                    value={creativeForm.button_text}
                    onChange={handleCreativeChange}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Button link</label>
                  <input
                    style={inputStyle}
                    name="button_link"
                    value={creativeForm.button_link}
                    onChange={handleCreativeChange}
                  />
                </div>

                <div
                  style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontWeight: 700,
                      color: "#334155"
                    }}
                  >
                    <input
                      type="checkbox"
                      name="is_primary"
                      checked={creativeForm.is_primary}
                      onChange={handleCreativeChange}
                    />
                    Primary creative
                  </label>
                </div>

                <div
                  style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                  }}
                >
                  <button
                    type="submit"
                    style={buttonPrimary}
                    disabled={savingCreative}
                  >
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

          <div
            style={{
              display: "grid",
              gap: "20px"
            }}
          >
            <section style={{ ...cardStyle, padding: "22px" }}>
              <h2
                style={{
                  margin: "0 0 16px",
                  fontSize: "22px",
                  color: "#0f172a"
                }}
              >
                Reklamuesit
              </h2>

              {loading ? (
                <div style={{ color: "#64748b" }}>Duke ngarkuar...</div>
              ) : advertisers.length === 0 ? (
                <div style={{ color: "#64748b" }}>Nuk ka reklamues ende.</div>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {advertisers.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        border: "1px solid rgba(15,23,42,0.06)",
                        borderRadius: "18px",
                        padding: "14px"
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          color: "#0f172a",
                          marginBottom: "6px"
                        }}
                      >
                        {item.name}
                      </div>

                      <div style={{ color: "#64748b", fontSize: "13px" }}>
                        {item.company_name || "Pa kompani"}
                      </div>

                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          marginBottom: "12px"
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background: "rgba(15,23,42,0.04)",
                            color: "#475569"
                          }}
                        >
                          {item.status}
                        </span>

                        {item.phone && (
                          <span
                            style={{
                              fontSize: "12px",
                              padding: "6px 10px",
                              borderRadius: "999px",
                              background: "rgba(15,23,42,0.04)",
                              color: "#475569"
                            }}
                          >
                            {item.phone}
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap"
                        }}
                      >
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

            <section style={{ ...cardStyle, padding: "22px" }}>
              <h2
                style={{
                  margin: "0 0 16px",
                  fontSize: "22px",
                  color: "#0f172a"
                }}
              >
                Fushatat
              </h2>

              {loading ? (
                <div style={{ color: "#64748b" }}>Duke ngarkuar...</div>
              ) : campaigns.length === 0 ? (
                <div style={{ color: "#64748b" }}>Nuk ka fushata ende.</div>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {campaigns.map((item) => {
                    const linkedCreatives = creativesByCampaignId[item.id] || [];

                    return (
                      <div
                        key={item.id}
                        style={{
                          border: "1px solid rgba(15,23,42,0.06)",
                          borderRadius: "18px",
                          padding: "14px"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "10px",
                            alignItems: "start",
                            marginBottom: "8px"
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontWeight: 800,
                                color: "#0f172a"
                              }}
                            >
                              {item.title}
                            </div>
                            <div
                              style={{
                                color: "#64748b",
                                fontSize: "13px",
                                marginTop: "4px"
                              }}
                            >
                              {item.advertiser_name || "Pa reklamues"}
                            </div>
                          </div>

                          <span
                            style={{
                              fontSize: "12px",
                              padding: "6px 10px",
                              borderRadius: "999px",
                              background:
                                item.status === "active"
                                  ? "rgba(34,197,94,0.12)"
                                  : "rgba(148,163,184,0.12)",
                              color:
                                item.status === "active"
                                  ? "#15803d"
                                  : "#475569",
                              fontWeight: 800
                            }}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                            marginBottom: "10px"
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              padding: "6px 10px",
                              borderRadius: "999px",
                              background: "rgba(15,23,42,0.04)",
                              color: "#475569"
                            }}
                          >
                            {item.campaign_type}
                          </span>

                          <span
                            style={{
                              fontSize: "12px",
                              padding: "6px 10px",
                              borderRadius: "999px",
                              background: "rgba(15,23,42,0.04)",
                              color: "#475569"
                            }}
                          >
                            € {item.price}
                          </span>

                          <span
                            style={{
                              fontSize: "12px",
                              padding: "6px 10px",
                              borderRadius: "999px",
                              background: "rgba(15,23,42,0.04)",
                              color: "#475569"
                            }}
                          >
                            priority {item.priority}
                          </span>

                          <span
                            style={{
                              fontSize: "12px",
                              padding: "6px 10px",
                              borderRadius: "999px",
                              background: "rgba(15,23,42,0.04)",
                              color: "#475569"
                            }}
                          >
                            creatives {linkedCreatives.length}
                          </span>
                        </div>

                        {Array.isArray(item.placements) &&
                        item.placements.length > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                              marginBottom: "12px"
                            }}
                          >
                            {item.placements.map((placement) => (
                              <span
                                key={`${item.id}-${placement.placement_id}`}
                                style={{
                                  fontSize: "11px",
                                  padding: "6px 9px",
                                  borderRadius: "999px",
                                  background: "rgba(37,99,235,0.08)",
                                  color: "#1d4ed8",
                                  fontWeight: 700
                                }}
                              >
                                {placement.placement_slug}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap"
                          }}
                        >
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

            <section style={{ ...cardStyle, padding: "22px" }}>
              <h2
                style={{
                  margin: "0 0 16px",
                  fontSize: "22px",
                  color: "#0f172a"
                }}
              >
                Creatives
              </h2>

              {loading ? (
                <div style={{ color: "#64748b" }}>Duke ngarkuar...</div>
              ) : creatives.length === 0 ? (
                <div style={{ color: "#64748b" }}>Nuk ka creatives ende.</div>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {creatives.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        border: "1px solid rgba(15,23,42,0.06)",
                        borderRadius: "18px",
                        padding: "14px"
                      }}
                    >
                      {(item.image_url || item.video_url) && (
                        <div
                          style={{
                            marginBottom: "12px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            background: "#f1f5f9",
                            border: "1px solid rgba(15,23,42,0.06)"
                          }}
                        >
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title || item.headline || "creative"}
                              style={{
                                width: "100%",
                                height: "160px",
                                objectFit: "cover",
                                display: "block"
                              }}
                            />
                          ) : (
                            <video
                              src={item.video_url}
                              style={{
                                width: "100%",
                                height: "160px",
                                objectFit: "cover",
                                display: "block"
                              }}
                              muted
                            />
                          )}
                        </div>
                      )}

                      <div
                        style={{
                          fontWeight: 800,
                          color: "#0f172a",
                          marginBottom: "6px"
                        }}
                      >
                        {item.title || item.headline || `Creative #${item.id}`}
                      </div>

                      <div
                        style={{
                          color: "#64748b",
                          fontSize: "13px",
                          marginBottom: "10px"
                        }}
                      >
                        campaign #{item.campaign_id}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          marginBottom: "12px"
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "6px 9px",
                            borderRadius: "999px",
                            background: "rgba(15,23,42,0.04)",
                            color: "#475569"
                          }}
                        >
                          {item.creative_type}
                        </span>

                        <span
                          style={{
                            fontSize: "11px",
                            padding: "6px 9px",
                            borderRadius: "999px",
                            background: "rgba(15,23,42,0.04)",
                            color: "#475569"
                          }}
                        >
                          {item.device_type}
                        </span>

                        {item.is_primary && (
                          <span
                            style={{
                              fontSize: "11px",
                              padding: "6px 9px",
                              borderRadius: "999px",
                              background: "rgba(37,99,235,0.08)",
                              color: "#1d4ed8",
                              fontWeight: 700
                            }}
                          >
                            primary
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap"
                        }}
                      >
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

            <section style={{ ...cardStyle, padding: "22px" }}>
              <h2
                style={{
                  margin: "0 0 16px",
                  fontSize: "22px",
                  color: "#0f172a"
                }}
              >
                Placement-et
              </h2>

              {loading ? (
                <div style={{ color: "#64748b" }}>Duke ngarkuar...</div>
              ) : placements.length === 0 ? (
                <div style={{ color: "#64748b" }}>Nuk ka placements.</div>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {placements.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        border: "1px solid rgba(15,23,42,0.06)",
                        borderRadius: "18px",
                        padding: "14px"
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          color: "#0f172a",
                          marginBottom: "5px"
                        }}
                      >
                        {item.name}
                      </div>

                      <div
                        style={{
                          color: "#64748b",
                          fontSize: "13px",
                          marginBottom: "8px"
                        }}
                      >
                        {item.slug}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap"
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "6px 9px",
                            borderRadius: "999px",
                            background: "rgba(15,23,42,0.04)",
                            color: "#475569"
                          }}
                        >
                          {item.page_type}
                        </span>

                        <span
                          style={{
                            fontSize: "11px",
                            padding: "6px 9px",
                            borderRadius: "999px",
                            background: "rgba(15,23,42,0.04)",
                            color: "#475569"
                          }}
                        >
                          {item.device_type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 1100px) {
            .admin-ads-layout {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 768px) {
            input, select, textarea, button {
              font-size: 16px !important;
            }
          }
        `}
      </style>
    </div>
  );
}