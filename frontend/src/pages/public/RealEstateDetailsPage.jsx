import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";
import { getPostById } from "../../api/postApi";

export default function RealEstateDetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së pronës:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <PublicHeader />
      <main style={{ maxWidth: "1320px", margin: "0 auto", padding: "28px 20px 60px" }}>
        {loading ? (
          <p>Duke u ngarkuar...</p>
        ) : !post ? (
          <p>Nuk u gjet prona.</p>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "24px", padding: "24px" }}>
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                style={{ width: "100%", maxHeight: "420px", objectFit: "cover", borderRadius: "18px", marginBottom: "20px" }}
              />
            )}

            <h1 style={{ marginBottom: "12px", color: "#0f172a" }}>{post.title}</h1>

            {post.price && (
              <div style={{ fontSize: "24px", fontWeight: "800", marginBottom: "16px", color: "#0f172a" }}>
                {post.price} €
              </div>
            )}

            <p style={{ color: "#475569", lineHeight: "1.8", whiteSpace: "pre-line" }}>
              {post.description}
            </p>
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}