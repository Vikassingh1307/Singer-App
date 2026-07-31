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
  const [music, setMusic] = useState(starterTracks);
  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState(
    "Your next viral drop starts with one clean upload.",
  );
  const [isLoading, setIsLoading] = useState(false);

  async function loadMusic() {
    try {
      const response = await fetch("/api/music");
      const data = await response.json();
      if (data.music?.length) {
        setMusic([...starterTracks, ...data.music]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadMusic();
  }, []);

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

      setStatus(`Uploaded successfully: ${data.music?.title || title}`);
      setTitle("");
      setAudioFile(null);
      setImageFile(null);
      event.target.reset();
      await loadMusic();
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
          <div>
            <p className="eyebrow">PulseBeat Studio</p>
            <h1>Create, upload, and launch your sound with style.</h1>
            <p className="hero-copy">
              A premium music dashboard with expressive visuals, animated cards,
              and a modern release flow built for creators.
            </p>
            <div className="hero-stats">
              <span>Live uploads</span>
              <span>Animated gallery</span>
              <span>Trending-ready UI</span>
            </div>
          </div>

          <div className="hero-panel">
            <div className="mini-pill">Now trending</div>
            <h3>Fresh drops in motion</h3>
            <p>Every release feels alive with a cinematic, immersive layout.</p>
          </div>
        </div>
      </header>

      <main className="content-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>Share a new release</h2>
            <p>Drop your audio file and cover art into the studio.</p>
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
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Trending library</h2>
            <p>Fresh tracks styled like a modern music feed.</p>
          </div>

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
