import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { icon: "🔬", name: "Ciencia" },
  { icon: "💊", name: "Salud" },
  { icon: "📐", name: "Matemáticas" },
  { icon: "⚖️", name: "Derecho" },
  { icon: "💻", name: "Tecnología" },
  { icon: "🏛️", name: "Historia" },
  { icon: "🎨", name: "Arte" },
  { icon: "📈", name: "Finanzas" },
  { icon: "🌱", name: "Ambiente" },
  { icon: "🍳", name: "Cocina" },
  { icon: "🧘", name: "Psicología" },
  { icon: "🚀", name: "Espacio" },
];

const FEATURES = [
  { icon: "⚡", title: "Respuestas instantáneas", desc: "Sin esperas. MestroWeb procesa tu pregunta en milisegundos y entrega la respuesta más precisa disponible." },
  { icon: "🧠", title: "Inteligencia profunda", desc: "Entrenada con miles de millones de datos, comprende contexto, matices y términos técnicos en cualquier idioma." },
  { icon: "🌍", title: "Multilingüe", desc: "Habla en tu idioma. MestroWeb responde en español, inglés, portugués, francés y más de 40 idiomas." },
  { icon: "🔒", title: "100% privado", desc: "Tus preguntas son tuyas. No almacenamos conversaciones ni compartimos datos con terceros." },
  { icon: "📚", title: "Conocimiento vivo", desc: "Se actualiza constantemente con los últimos datos, noticias y avances científicos." },
  { icon: "💬", title: "Conversación natural", desc: "No es un buscador. Entiende tus preguntas como un humano y responde con claridad." },
];

const STEPS = [
  { n: "01", title: "Escribe tu pregunta", desc: "No importa cómo la formules. MestroWeb entiende lenguaje natural y preguntas complejas." },
  { n: "02", title: "La IA la procesa", desc: "Nuestro motor analiza miles de fuentes y genera la respuesta más precisa para ti." },
  { n: "03", title: "Recibe tu respuesta", desc: "Clara, directa. Si necesitas más detalle, sigue la conversación y profundiza." },
  { n: "04", title: "Aprende más rápido", desc: "Guarda respuestas, crea colecciones de conocimiento y comparte lo que descubres." },
];

function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const stars = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    for (let i = 0; i < 180; i++) {
      stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.2 + 0.3, a: Math.random(), speed: Math.random() * 0.002 + 0.001 });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a += s.speed;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,190,255,${0.3 + Math.abs(Math.sin(s.a)) * 0.5})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5 }} />;
}

function useTypewriter(text, speed = 14) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  return displayed;
}

export default function MestroWeb() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const displayed = useTypewriter(answer);

  const ask = async (q) => {
    const question = q || query.trim();
    if (!question) return;
    setAnswer("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Eres MestroWeb, una IA amigable, inteligente y precisa que responde millones de preguntas a personas de todo el mundo. Responde siempre en español de forma clara, concisa y útil. Máximo 3 párrafos cortos.",
          messages: [{ role: "user", content: question }],
        }),
      });
      const data = await res.json();
      setAnswer(data.content?.[0]?.text || "No obtuve respuesta. Intenta de nuevo.");
    } catch {
      setAnswer("Error de conexión. Por favor intenta de nuevo.");
    }
    setLoading(false);
  };

  const handleCat = (cat) => {
    const q = `Dame información interesante sobre ${cat.name}`;
    setQuery(q);
    ask(q);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #05050a;
      --surface: #0e0e1a;
      --accent: #7c5cfc;
      --accent2: #00e5c3;
      --text: #f0eeff;
      --muted: #7a788f;
      --border: rgba(124,92,252,0.18);
    }
    body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
    .orb { position: fixed; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0; }
    .orb1 { width: 600px; height: 600px; background: rgba(124,92,252,0.15); top: -150px; left: -200px; }
    .orb2 { width: 500px; height: 500px; background: rgba(0,229,195,0.10); bottom: 0; right: -150px; }
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.2rem 2.5rem;
      background: rgba(5,5,10,0.75); backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
    }
    .logo { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 900; }
    .logo span { color: var(--accent); }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.88rem; cursor: pointer; transition: color .2s; }
    .nav-links a:hover { color: var(--text); }
    .nav-cta {
      background: var(--accent); color: #fff; border: none;
      padding: .55rem 1.3rem; border-radius: 30px;
      font-family: 'DM Sans', sans-serif; font-size: .88rem; cursor: pointer;
      transition: opacity .2s, transform .2s;
    }
    .nav-cta:hover { opacity: .85; transform: translateY(-1px); }
    .hero {
      min-height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center; text-align: center;
      padding: 7rem 1.5rem 4rem; position: relative; z-index: 1;
    }
    .badge {
      display: inline-flex; align-items: center; gap: .5rem;
      background: rgba(124,92,252,0.12); border: 1px solid var(--border);
      border-radius: 30px; padding: .3rem 1rem;
      font-size: .78rem; color: var(--accent2); margin-bottom: 2rem;
      animation: fadeUp .8s ease both;
    }
    .badge-dot { width: 7px; height: 7px; background: var(--accent2); border-radius: 50%; animation: pulse 1.5s infinite; }
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.8rem, 7vw, 6rem);
      font-weight: 900; line-height: 1.05; letter-spacing: -.03em;
      max-width: 860px; animation: fadeUp .8s .1s ease both;
    }
    h1 em { font-style: italic; color: var(--accent); }
    .hero-sub {
      font-size: clamp(.95rem, 2vw, 1.15rem); color: var(--muted);
      max-width: 540px; margin: 1.5rem auto 0; line-height: 1.75;
      animation: fadeUp .8s .2s ease both;
    }
    .search-wrap {
      margin-top: 2.5rem; width: 100%; max-width: 660px;
      position: relative; animation: fadeUp .8s .3s ease both;
    }
    .search-wrap input {
      width: 100%; padding: 1.1rem 1.6rem; padding-right: 120px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 50px; color: var(--text);
      font-family: 'DM Sans', sans-serif; font-size: .97rem;
      outline: none; transition: border-color .3s, box-shadow .3s;
    }
    .search-wrap input::placeholder { color: var(--muted); }
    .search-wrap input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(124,92,252,.12); }
    .search-btn {
      position: absolute; right: 7px; top: 50%; transform: translateY(-50%);
      background: linear-gradient(135deg, var(--accent), #5b3fd8);
      border: none; border-radius: 40px; padding: .75rem 1.4rem;
      color: #fff; font-family: 'DM Sans', sans-serif; font-size: .88rem;
      font-weight: 500; cursor: pointer; transition: opacity .2s;
      display: flex; align-items: center; gap: .4rem; min-width: 105px; justify-content: center;
    }
    .search-btn:hover { opacity: .88; }
    .answer-box {
      margin-top: 1.4rem; background: var(--surface);
      border: 1px solid var(--border); border-radius: 18px;
      padding: 1.4rem 1.8rem; text-align: left;
      max-width: 660px; width: 100%; animation: fadeUp .4s ease both;
    }
    .answer-label { font-size: .73rem; color: var(--accent2); text-transform: uppercase; letter-spacing: .1em; margin-bottom: .5rem; }
    .answer-text { color: var(--text); line-height: 1.8; font-size: .95rem; white-space: pre-wrap; }
    .cursor::after { content: '|'; animation: blink .8s infinite; color: var(--accent); }
    .stats { display: flex; gap: 3rem; justify-content: center; margin-top: 3.5rem; flex-wrap: wrap; animation: fadeUp .8s .4s ease both; }
    .stat { text-align: center; }
    .stat-num { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 900; color: var(--accent); }
    .stat-label { font-size: .78rem; color: var(--muted); margin-top: .2rem; }
    section.inner { padding: 5rem 1.5rem; position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }
    .section-tag { display: inline-block; font-size: .73rem; text-transform: uppercase; letter-spacing: .15em; color: var(--accent2); margin-bottom: .8rem; }
    .section-title { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; line-height: 1.1; letter-spacing: -.02em; max-width: 700px; }
    .section-title em { font-style: italic; color: var(--accent); }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1.3rem; margin-top: 3rem; }
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 18px; padding: 1.8rem;
      transition: border-color .3s, transform .3s, box-shadow .3s;
    }
    .card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(124,92,252,.12); }
    .card-icon { font-size: 1.9rem; margin-bottom: 1rem; }
    .card h3 { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; margin-bottom: .5rem; }
    .card p { font-size: .87rem; color: var(--muted); line-height: 1.65; }
    .cats-wrap { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 5rem 1.5rem; }
    .cats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: .9rem; margin-top: 2.5rem; max-width: 1100px; margin-left: auto; margin-right: auto; }
    .cat-item {
      background: var(--bg); border: 1px solid var(--border);
      border-radius: 14px; padding: 1.2rem; text-align: center;
      cursor: pointer; transition: border-color .2s, transform .2s;
    }
    .cat-item:hover { border-color: var(--accent2); transform: scale(1.04); }
    .cat-icon { font-size: 1.7rem; margin-bottom: .4rem; }
    .cat-name { font-size: .82rem; color: var(--muted); }
    .steps { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 2rem; margin-top: 3rem; }
    .step-num { font-family: 'Playfair Display', serif; font-size: 3.5rem; font-weight: 900; color: rgba(124,92,252,.15); line-height: 1; margin-bottom: .4rem; }
    .step h3 { font-size: .97rem; font-weight: 500; margin-bottom: .35rem; }
    .step p { font-size: .84rem; color: var(--muted); line-height: 1.6; }
    .cta-section {
      text-align: center; padding: 5rem 1.5rem;
      background: radial-gradient(ellipse at center, rgba(124,92,252,.12) 0%, transparent 70%);
      border-top: 1px solid var(--border); position: relative; z-index: 1;
    }
    .cta-section h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 900; letter-spacing: -.02em; margin-bottom: 1.2rem; }
    .cta-section h2 em { font-style: italic; color: var(--accent); }
    .cta-section p { color: var(--muted); font-size: .97rem; margin-bottom: 2rem; }
    .btn-primary { background: linear-gradient(135deg, var(--accent), #5b3fd8); color: #fff; border: none; padding: .9rem 2.2rem; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: .97rem; font-weight: 500; cursor: pointer; margin-right: .8rem; transition: opacity .2s, transform .2s; }
    .btn-primary:hover { opacity: .88; transform: translateY(-2px); }
    .btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border); padding: .9rem 2.2rem; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: .97rem; cursor: pointer; transition: border-color .2s, transform .2s; }
    .btn-outline:hover { border-color: var(--accent); transform: translateY(-2px); }
    footer { padding: 2rem 2.5rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); position: relative; z-index: 1; flex-wrap: wrap; gap: .8rem; }
    footer .logo { font-size: 1rem; }
    footer p { font-size: .78rem; color: var(--muted); }
    .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;

  return (
    <>
      <style>{css}</style>
      <StarField />
      <div className="orb orb1" />
      <div className="orb orb2" />

      <nav>
        <div className="logo">Mestro<span>Web</span></div>
        <ul className="nav-links">
          <li><a>Funciones</a></li>
          <li><a>Categorías</a></li>
          <li><a>Cómo funciona</a></li>
        </ul>
        <button className="nav-cta">Comenzar gratis</button>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="badge"><span className="badge-dot" /> IA de nueva generación · 24/7</div>
        <h1>Millones de respuestas.<br />Una sola <em>IA.</em></h1>
        <p className="hero-sub">MestroWeb responde cualquier pregunta, sin importar la hora ni el tema. Desde ciencia hasta filosofía, en segundos.</p>

        <div className="search-wrap">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && ask()}
            placeholder="¿Cuál es tu pregunta hoy?"
          />
          <button className="search-btn" onClick={() => ask()}>
            {loading ? <span className="spinner" /> : "Preguntar →"}
          </button>
        </div>

        {(loading || answer) && (
          <div className="answer-box">
            <div className="answer-label">🤖 MestroWeb responde</div>
            <p className={`answer-text${loading && !answer ? " cursor" : ""}`}>
              {loading && !answer ? "Pensando..." : displayed}
              {!loading && displayed && displayed.length < answer.length ? "" : ""}
            </p>
          </div>
        )}

        <div className="stats">
          <div className="stat"><div className="stat-num">10M+</div><div className="stat-label">Preguntas respondidas</div></div>
          <div className="stat"><div className="stat-num">500+</div><div className="stat-label">Temas cubiertos</div></div>
          <div className="stat"><div className="stat-num">99.8%</div><div className="stat-label">Precisión promedio</div></div>
          <div className="stat"><div className="stat-num">0.3s</div><div className="stat-label">Tiempo de respuesta</div></div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="inner">
        <span className="section-tag">¿Por qué MestroWeb?</span>
        <h2 className="section-title">Una IA para <em>todo</em> lo que necesitas saber</h2>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div className="card" key={f.title}>
              <div className="card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <div className="cats-wrap">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span className="section-tag">Explora por tema</span>
          <h2 className="section-title">Pregunta sobre <em>cualquier</em> tema</h2>
        </div>
        <div className="cats-grid">
          {CATEGORIES.map(c => (
            <div className="cat-item" key={c.name} onClick={() => handleCat(c)}>
              <div className="cat-icon">{c.icon}</div>
              <div className="cat-name">{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="inner">
        <span className="section-tag">Cómo funciona</span>
        <h2 className="section-title">Tres pasos para tu <em>respuesta</em></h2>
        <div className="steps">
          {STEPS.map(s => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <h2>¿Listo para saberlo <em>todo?</em></h2>
        <p>Únete a millones de personas que ya usan MestroWeb cada día.</p>
        <button className="btn-primary">Empezar ahora — es gratis</button>
        <button className="btn-outline">Ver demo</button>
      </div>

      <footer>
        <div className="logo">Mestro<span>Web</span></div>
        <p>© 2026 MestroWeb. Todos los derechos reservados.</p>
        <p>Privacidad · Términos · Contacto</p>
      </footer>
    </>
  );
}
