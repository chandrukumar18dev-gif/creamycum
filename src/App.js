import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes, Route, Link, Navigate,
  useParams, useNavigate, useLocation,
} from "react-router-dom";
import "./App.css";

// --- All Countries ---
const allCountries = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria",
  "Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)","Costa Rica","Croatia","Cuba","Cyprus","Czechia (Czech Republic)","DR Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini (fmr. ‘Swaziland’)","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Holy See","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar (Burma)","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine State","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

// --- Categories ---
const categories = [
  "Amateur", "Professional", "Couple", "Lesbian", "Solo", "MILF", "Big Ass", "Teen", "Mature", "Gay",
  "Group", "Outdoor", "POV", "Interracial", "Trans", "College", "BBW", "Public", "Threesome", "Cartoon/Hentai"
];

// --- Sample Videos with #porn tag
const defaultVideos = [
  {
    id: 1,
    title: "Sample Video 1",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Amateur",
    region: "India",
    tags: ["#porn", "#desi", "#couple"]
  },
  {
    id: 2,
    title: "Office Seduction",
    url: "https://www.w3schools.com/html/movie.mp4",
    category: "Professional",
    region: "United States",
    tags: ["#porn", "#office", "#usa"]
  },
  {
    id: 3,
    title: "Pink Room Compilation",
    url: "https://www.w3schools.com/html/movie.mp4",
    category: "Lesbian",
    region: "France",
    tags: ["#porn", "#lesbian", "#frenchgirls"]
  },
  {
    id: 4,
    title: "Steamy Shower",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Amateur",
    region: "Brazil",
    tags: ["#porn", "#shower"]
  },
];

// --- Demo Users (ADMIN included) ---
const fakeUserDB = {
  user1: { password: "pass123", verified: true, email: "user1@mail.com" },
  user2: { password: "sexylady", verified: false, email: "user2@mail.com" },
  "admin@creamycum.com": { password: "9092795828", verified: true, email: "admin@creamycum.com", isAdmin: true }
};

function App() {
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [users, setUsers] = useState({ ...fakeUserDB });
  const [videos, setVideos] = useState([...defaultVideos]);
  const [loginError, setLoginError] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  function handleLogout() { setUser(null); setIsVerified(false); }
  function handleRegister({ username, password, email }) {
    if (users[username]) setRegisterMessage("Username already exists");
    else {
      setUsers((u) => ({ ...u, [username]: { password, verified: false, email } }));
      setRegisterMessage("Registration successful! Please login.");
    }
  }
  function handleLogin({ username, password }) {
    setLoginError('');
    if (users[username] && users[username].password === password) {
      setUser(username);
      setIsVerified(!!users[username].verified);
      return true;
    } else { setLoginError("Invalid credentials"); return false; }
  }
  function handleReset(email) {
    for (const username in users) {
      if (users[username].email === email) {
        setResetMessage("Reset email sent! (simulated)"); return;
      }
    }
    setResetMessage("No user with that email.");
  }
  function simulateVerification() {
    setUsers((prev) => ({
      ...prev, [user]: { ...prev[user], verified: true },
    })); setIsVerified(true);
  }
  function handleUploadVideo({ file, category, region, tags, title }) {
    const tagArr = [
      "#porn",
      ...tags
        .split(",")
        .map(t => t.trim().replace(/^#?/,"#").toLowerCase())
        .filter(Boolean)
        .filter((t,i,arr)=> arr.indexOf(t) === i && t !== "#porn")
    ];
    setVideos((vs) => [
      {
        id: Date.now(),
        title: title || file?.name || "User Uploaded",
        url: "https://www.w3schools.com/html/mov_bbb.mp4", // In real deploy: actual uploaded file!
        category,
        region,
        tags: tagArr
      },
      ...vs,
    ]);
  }

  return (
    <Router>
      <NavBar user={user} users={users} onLogout={handleLogout} />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<HomePage user={user} videos={videos} />} />
          <Route path="/video/:id" element={<VideoDetailPage user={user} videos={videos} />} />
          <Route path="/login" element={
            user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} error={loginError} />
          }/>
          <Route path="/register" element={
            user ? <Navigate to="/" /> : <RegisterPage onRegister={handleRegister} message={registerMessage}/>
          } />
          <Route path="/reset" element={
            user ? <Navigate to="/" /> : <ResetPage onReset={handleReset} message={resetMessage} />
          } />
          <Route path="/upload" element={
            user
              ? isVerified
                ? <UploadPage onUpload={handleUploadVideo} />
                : <VerifyPage user={user} simulateVerification={simulateVerification} />
              : <Navigate to="/login" />
          } />
          <Route path="/profile" element={user ? <ProfilePage user={user} users={users} isVerified={isVerified} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

function NavBar({ user, users, onLogout }) {
  return (
    <header className="header">
      <div className="brand"><span role="img" aria-label="18+">🔞</span> CreamyCum</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>
        {user && <Link to="/profile">Profile</Link>}
        {user && users[user]?.isAdmin && (
          <span style={{color:'#ffd900',marginLeft:8,fontWeight:600}} title="Admin!">ADMIN</span>
        )}
        {user
          ? <button onClick={onLogout}>Logout</button>
          : <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
        }
      </nav>
    </header>
  );
}

// --- HomePage with clickable tags, filter, ad banners ---
function HomePage({ user, videos }) {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const initTag = search.get("tag") || "";
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState(initTag);

  const categoriesSet = Array.from(new Set([...videos.map(v => v.category), ...categories])).sort();
  const regionsSet = Array.from(new Set([...videos.map(v => v.region), ...allCountries])).sort();
  const allTags = Array.from(new Set(videos.flatMap(v => v.tags || [])));

  let filteredVideos = videos;
  if (selectedCategory)
    filteredVideos = filteredVideos.filter(v => v.category === selectedCategory);
  if (selectedRegion)
    filteredVideos = filteredVideos.filter(v => v.region === selectedRegion);
  if (searchTerm.trim())
    filteredVideos = filteredVideos.filter(
      v => v.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
           (v.tags && v.tags.some(tag => tag.toLowerCase().includes(searchTerm.trim().toLowerCase())))
    );
  if (selectedTag)
    filteredVideos = filteredVideos.filter(
      v => v.tags && v.tags.map(t => t.replace(/^#/, '')).includes(selectedTag.replace(/^#/, ''))
    );

  const AD_FREQUENCY = 2;
  function renderVideosWithAds() {
    const elements = [];
    filteredVideos.forEach((video, index) => {
      elements.push(
        <div className="video-card" key={video.id}>
          <Link to={`/video/${video.id}`} style={{display:'block'}}>
            <video width="320" controls>
              <source src={video.url} type="video/mp4" />
            </video>
          </Link>
          <div className="video-title"><Link to={`/video/${video.id}`}>{video.title}</Link></div>
          <div style={{display: "flex", gap: "7px", flexWrap: "wrap", justifyContent:"center"}}>
            <span className="category-tag">{video.category}</span>
            <span className="region-tag">{video.region}</span>
          </div>
          <div style={{display: "flex", flexWrap: "wrap", gap: "5px", margin: "7px 0 4px 0"}}>
            {(video.tags || []).map((tag, i) =>
              <span className="video-tag"
                style={{cursor:"pointer"}}
                key={tag + i}
                title={"Show all videos with " + tag}
                onClick={() => setSelectedTag(tag.replace(/^#/, ""))}
              >{tag}</span>
            )}
          </div>
          {user ? (
            <a className="download-btn"
              href={video.url}
              download
              target="_blank"
              rel="noopener noreferrer"
            >Download</a>
          ) : (
            <Link className="download-btn" to="/login">
              Login to Download
            </Link>
          )}
        </div>
      );
      if (
        (index + 1) % AD_FREQUENCY === 0 &&
        index !== filteredVideos.length - 1
      ) {
        elements.push(<AdBanner key={`ad-${index}`}/>);
      }
    });
    return elements;
  }
  function handleClearFilters() {
    setSelectedTag("");
    setSelectedCategory("");
    setSelectedRegion("");
    setSearchTerm("");
  }
  return (
    <div>
      <section>
        <div className="cc-hero">
          <div className="cc-overlay">
            <h1 className="cc-title">CreamyCum</h1>
            <p className="cc-tagline">
              Your world of adult videos.<br />
              <b>Find anything by #tag, region, or category.</b>
            </p>
            <div className="cc-warning">
              Warning: Explicit Content · 18+ only
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="subheading">Watch Videos</h2>
        <div className="search-filter-row">
          <select className="category-dropdown" value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categoriesSet.map(cat => <option value={cat} key={cat}>{cat}</option>)}
          </select>
          <select className="category-dropdown" value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}>
            <option value="">All Regions</option>
            {regionsSet.map(region => <option value={region} key={region}>{region}</option>)}
          </select>
          <input className="search-bar" type="text" placeholder="Search videos or #tag..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <button onClick={handleClearFilters} className="download-btn"
            style={{background:"#382350",fontSize:'0.97em'}}>Clear</button>
        </div>
        <div className="alltags-bar">
          {allTags.length > 0 && allTags.map((tag, i) =>
            <span className="video-tag alltag" key={tag + i} style={{cursor:"pointer"}}
              onClick={() => setSelectedTag(tag.replace(/^#/, ""))}
            >{tag}</span>
          )}
        </div>
        <div className="videos-row">
          {renderVideosWithAds()}
          {filteredVideos.length === 0 && (
            <div style={{
              color: "#e77c92", fontWeight: 600,
              fontSize: "1.1rem", padding: 20
            }}>
              No videos found for your search.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// === LIVE JUICYADS BANNER ===
function AdBanner() {
  return (
    <div className="ad-banner" style={{textAlign: "center"}}>
      <iframe
        src="https://adserver.juicyads.com/adshow.php?adzone=YOUR_ADZONE_ID"
        title="JuicyAd"
        width="320"
        height="100"
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        scrolling="no"
        allowtransparency="true"
        style={{ display: "block", border: "none", margin: "auto" }}
      ></iframe>
    </div>
  );
}

function VideoDetailPage({ user, videos }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const video = videos.find(v => String(v.id) === id);

  if (!video) {
    return <div style={{ color: "#e77c92", padding: 30 }}>Video not found.</div>;
  }
  function handleDownload(e) {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  }
  return (
    <section>
      <div style={{marginBottom:22}}><Link to="/" className="small-link">&larr; Back to Home</Link></div>
      <div className="video-detail-main">
        <div style={{flexBasis:'400px', minWidth:240, width:'100%'}}>
          <video width="100%" controls>
            <source src={video.url} type="video/mp4" />
          </video>
        </div>
        <div className="video-info">
          <h2 style={{marginTop:0, color:'#e77c92'}}>{video.title}</h2>
          <div><b>Category:</b> <span className="category-tag">{video.category}</span></div>
          <div><b>Region:</b> <span className="region-tag">{video.region}</span></div>
          <div style={{marginTop:10, marginBottom:10}}>
            <b>Tags:</b>{" "}
            {video.tags && video.tags.map((tag, i) => (
              <Link key={tag + i}
                className="video-tag"
                to={`/?tag=${encodeURIComponent(tag.replace(/^#/, ""))}`}
                title={"Show all videos with " + tag}
              >{tag}</Link>
            ))}
          </div>
          <div style={{marginTop:18}}>
            {user ? (
              <a
                className="download-btn"
                href={video.url}
                download
                target="_blank"
                rel="noopener noreferrer"
              >Download</a>
            ) : (
              <button className="download-btn" onClick={handleDownload}>
                Login to Download
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function UploadPage({ onUpload }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [tags, setTags] = useState("");
  const [msg, setMsg] = useState("");
  function handleUpload(e) {
    e.preventDefault();
    if (!category || !region) { setMsg("Select category and region!"); return; }
    onUpload({ file, category, region, tags, title });
    setMsg("Upload successful! (Simulated)");
    setFile(null); setCategory(""); setRegion(""); setTags(""); setTitle("");
  }
  return (
    <section>
      <h2 className="subheading">Upload Content</h2>
      <form className="upload-form" onSubmit={handleUpload}>
        <input type="file" accept="video/*" required onChange={e => setFile(e.target.files[0])}/>
        <input type="text" placeholder="Video Title" value={title}
               onChange={e => setTitle(e.target.value)} required/>
        <select required value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Select Category *</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select required value={region} onChange={e => setRegion(e.target.value)}>
          <option value="">Select Region *</option>
          {allCountries.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <input
          type="text"
          placeholder="Enter hashtags separated by commas (e.g. #lesbian,#indiansex)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <button type="submit">Upload Video</button>
        {msg && <div className="success">{msg}</div>}
      </form>
      <div className="hint" style={{marginTop:16}}>
        *All uploads will automatically be tagged <b>#porn</b>.
      </div>
    </section>
  );
}

// --- Verification Page for Uploads ---
function VerifyPage({ user, simulateVerification }) {
  return (
    <section>
      <h2 className="subheading">Account Verification Required</h2>
      <div className="hint">
        Hi <b>{user}</b>! Your account is not verified for uploading content.
        <br />
        This would normally require photo ID or admin approval.<br />
        <button style={{ marginTop: 8 }} onClick={simulateVerification}>
          Simulate Verification (DEMO)
        </button>
      </div>
    </section>
  );
}

function LoginPage({ onLogin, error }) {
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (onLogin({ username, password })) {
      navigate("/");
    }
  }
  return (
    <section>
      <h2 className="subheading">Login</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input name="username" placeholder="Username or Email" autoFocus required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <div style={{display:"flex",justifyContent:"space-between",width:"100%",marginTop:8}}>
          <Link className="small-link" to="/register">Register</Link>
          <Link className="small-link" to="/reset">Forgot Password?</Link>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </section>
  );
}
function RegisterPage({ onRegister, message }) {
  const [submitting, setSubmitting] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const username = e.target.username.value;
    const password = e.target.password.value;
    const email = e.target.email.value;
    onRegister({ username, password, email });
    setSubmitting(false);
  }
  return (
    <section>
      <h2 className="subheading">Register</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" required autoFocus />
        <input name="email" placeholder="Email" type="email" required />
        <input name="password" placeholder="Password" type="password" required />
        <button type="submit" disabled={submitting}>Register</button>
        {message && <p className={message.startsWith("Registration") ? "success" : "error"}>{message}</p>}
      </form>
    </section>
  );
}
function ResetPage({ onReset, message }) {
  function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    onReset(email);
  }
  return (
    <section>
      <h2 className="subheading">Password Reset</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" type="email" required autoFocus />
        <button type="submit">Send Reset Link</button>
        {message && <p className={message.includes("sent") ? "success" : "error"}>{message}</p>}
      </form>
    </section>
  );
}
function ProfilePage({ user, users, isVerified }) {
  return (
    <section>
      <h2 className="subheading">Your Profile</h2>
      <div className="upload-form" style={{ textAlign: 'left', maxWidth: 350, margin: 'auto' }}>
        <div>
          <strong>Username:</strong> {user}
        </div>
        {users[user]?.email && <div>
          <strong>Email:</strong> {users[user].email}
        </div>}
        <div>
          <strong>Account status:</strong>{" "}
          {isVerified ? (
            <span className="success">Verified uploader</span>
          ) : (
            <span className="error">Not verified for upload</span>
          )}
        </div>
        {users[user]?.isAdmin && (
          <div style={{marginTop:8,color:"#ffd900",fontWeight:600}}>
            <strong>ADMIN</strong>: You have admin access.
          </div>
        )}
        <div style={{ marginTop: 16 }}>
          <em>
            (Add more profile settings here as you build your backend.)
          </em>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="footer">
      &copy; {new Date().getFullYear()} CreamyCum &bull; All rights reserved &bull; 18+ only
    </footer>
  );
}

export default App;
