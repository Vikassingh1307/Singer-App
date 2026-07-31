import { useEffect, useState } from "react";

const starterTracks = [
  {
    id: "trend-1",
    title: "Neon Skyline",
    artist: "Ari Nova",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "trend-2",
    title: "Velvet Nights",
    artist: "Luna Vale",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
  },
];

function App() {
  const [music, setMusic] = useState(() => {
    if (typeof window === "undefined") return starterTracks;
    try {
      const stored = localStorage.getItem("musicLibrary");
      return stored ? JSON.parse(stored) : starterTracks;
    } catch {
      return starterTracks;
    }
  });
  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState(
    "Your next viral drop starts with one clean upload.",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("profileImage") || "";
  });

  async function loadMusic() {
    try {
      const response = await fetch("/api/music");
      const data = await response.json();
      if (data.music?.length) {
        setMusic((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const merged = [
            ...prev,
            ...data.music.filter((item) => !existingIds.has(item.id)),
          ];
          return merged;
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function loadProfilePhoto() {
    try {
      const response = await fetch("/api/profile/photo");
      const data = await response.json();
      if (data.imageUrl) {
        setProfileImage(data.imageUrl);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadMusic();
    loadProfilePhoto();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("musicLibrary", JSON.stringify(music));
    }
  }, [music]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (profileImage) {
        localStorage.setItem("profileImage", profileImage);
      } else {
        localStorage.removeItem("profileImage");
      }
    }
  }, [profileImage]);

  async function handlePhotoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("/api/profile/photo", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile photo upload failed");
      }

      setProfileImage(data.imageUrl || "");
      setStatus(`Profile photo ready: ${file.name}`);
    } catch (error) {
      setStatus(error.message || "Profile photo upload failed.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title || !audioFile) {
      setStatus("Please add a title and an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("music", audioFile);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    setIsLoading(true);
    setStatus("Uploading your track...");

    try {
      const response = await fetch("/api/music/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      const newTrack = {
        id: data.music?.id || Date.now().toString(),
        title: data.music?.title || title,
        artist: data.music?.artist || "You",
        image:
          data.music?.image ||
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
        uri: data.music?.uri || "",
      };

      setMusic((prev) => [newTrack, ...prev]);
      setStatus(`Uploaded successfully: ${data.music?.title || title}`);
      setTitle("");
      setAudioFile(null);
      setImageFile(null);
      event.target.reset();
    } catch (error) {
      setStatus(error.message || "Upload failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-copy-block">
            <p className="eyebrow">FULL STACK DEVELOPER</p>
            <h1>Hi, I&apos;m Vikas Singh.</h1>
            <p className="hero-copy">
              I create modern websites, polished portfolios, and smooth digital
              experiences with strong UI/UX and clean backend architecture.
            </p>
            <div className="hero-stats">
              <span>React & Node.js</span>
              <span>Modern UI</span>
              <span>API & Auth</span>
            </div>
            <div className="contact-card">
              <h3>Contact Me</h3>
              <p>
                Email:{" "}
                <a href="mailto:vikassinghuit@gmail.com">
                  vikassinghuit@gmail.com
                </a>
              </p>
              <p>
                Phone: <a href="tel:+918182860359">+91 81828 60359</a>
              </p>
              <p>Location: India</p>
            </div>
          </div>

          <div className="profile-card">
            <label className="avatar-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <div className="avatar-frame">
                {profileImage ? (
                  <img src={profileImage} alt="Vikas Singh" />
                ) : (
                  <span>Upload your photo</span>
                )}
              </div>
              <span className="upload-text">Add your photo</span>
            </label>
            <div className="profile-info">
              <h3>Let&apos;s build something amazing</h3>
              <p>
                Available for modern web projects, polished portfolio sites, and
                creative digital experiences.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="content-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>What I bring</h2>
            <p>Clean code, great design, and smooth user experiences.</p>
          </div>

          <div className="feature-list">
            <article className="feature-card">
              <h3>Modern Interface</h3>
              <p>Trendy layouts with subtle motion and premium visual depth.</p>
            </article>
            <article className="feature-card">
              <h3>Reliable Backend</h3>
              <p>REST APIs, authentication, and scalable server-side logic.</p>
            </article>
            <article className="feature-card">
              <h3>Creative Delivery</h3>
              <p>
                From portfolio websites to media-driven apps, I focus on impact.
              </p>
            </article>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Upload demo</h2>
            <p>Try the live music upload experience below.</p>
          </div>

          <form onSubmit={handleSubmit} className="upload-form">
            <label>
              Track title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Midnight Echo"
              />
            </label>

            <label>
              Audio file
              <input
                type="file"
                accept="audio/*"
                onChange={(event) =>
                  setAudioFile(event.target.files?.[0] || null)
                }
              />
            </label>

            <label>
              Cover image
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] || null)
                }
              />
            </label>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload track"}
            </button>
          </form>

          <div className="status-box">{status}</div>

          <div className="music-list">
            {music.length === 0 ? (
              <div className="empty-state">
                No tracks yet. Your first upload will appear here.
              </div>
            ) : (
              music.map((item) => (
                <article key={item.id} className="music-card">
                  <img src={item.image} alt={item.title} />
                  <div className="music-meta">
                    <div className="music-topline">
                      <h3>{item.title}</h3>
                      <span className="live-badge">Live</span>
                    </div>
                    <p>{item.artist || "Featured artist"}</p>
                    {item.uri ? <audio controls src={item.uri} /> : null}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
