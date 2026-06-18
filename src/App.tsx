import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from './supabase'
import './App.css'

const RESTAURANT = {
  name: "Luigipizza",
  tagline: "Pizza artesanal en San Juan de Aznalfarache",
  description: "Masa de elaboración propia, fermentación cuidada y productos de máxima calidad para ofrecer una auténtica experiencia italiana al mejor precio.",
  phone: "624 80 87 69",
  address: "Calle Concordia, Local 5, 41920 San Juan de Aznalfarache, Sevilla",
  addressShort: "C. Concordia, Local 5",
  city: "San Juan de Aznalfarache, Sevilla",
  hours: "L-D 13:00-16:00 · 20:00-00:00",
  location: "Junto al estanco",
  reviewsTotal: 200,
  reviewScore: 4.6,
  mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.5!2d-6.027!3d37.416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd123%3A0x456!2sCalle%20Concordia%2C%20San%20Juan%20de%20Aznalfarache!5e0!3m2!1ses!2ses!4v1",
}

const CATEGORIES = [
  { id: "clasicas", label: "Pizzas Clásicas" },
  { id: "especiales", label: "Pizzas Especiales" },
  { id: "entrantes", label: "Entrantes" },
  { id: "bebidas", label: "Bebidas" },
]

const MENU_ITEMS: Record<string, { name: string; desc: string; price: string }[]> = {
  clasicas: [
    { name: "Margarita", desc: "Tomate, mozzarella fresca, albahaca", price: "8,50" },
    { name: "Barbacoa", desc: "Carne de ternera, bacon, cheddar, cebolla", price: "10,50" },
    { name: "Cuatro Quesos", desc: "Mozzarella, gorgonzola, parmesano, emmental", price: "10,00" },
    { name: "Prosciutto", desc: "Jamón serrano, rúcula, parmesano en lascas", price: "11,00" },
    { name: "Pepperoni", desc: "Pepperoni, mozzarella, orégano", price: "9,50" },
    { name: "Napolitana", desc: "Anchoas, alcaparras, aceitunas, orégano", price: "9,50" },
  ],
  especiales: [
    { name: "Luigipizza", desc: "Nuestra especialidad de la casa con ingredientes secretos", price: "12,00" },
    { name: "Caprichosa", desc: "Jamón york, champiñones, alcachofa, huevo", price: "10,50" },
    { name: "Diavola", desc: "Salami picante, jalapeños, cebolla roja", price: "11,00" },
    { name: "Trufa y Brie", desc: "Crema de trufa, queso brie, rúcula, nueces", price: "12,50" },
    { name: "Carbonara", desc: "Crema de queso, bacon, yema de huevo, parmesano", price: "11,50" },
  ],
  entrantes: [
    { name: "Bruschetta Clásica", desc: "Pan tostado, tomate, ajo, albahaca, aceite de oliva", price: "5,00" },
    { name: "Aros de Cebolla", desc: "Aros de cebolla empanizados con salsa especial", price: "6,00" },
    { name: "Patatas Bravas", desc: "Patatas crujientes con salsa brava y alioli", price: "5,50" },
    { name: "Tabla de Quesos", desc: "Selección de quesos italianos con frutos secos", price: "9,00" },
    { name: "Ensalada César", desc: "Lechuga, pollo, croutons, parmesano, salsa césar", price: "7,50" },
  ],
  bebidas: [
    { name: "Coca-Cola / Nestea", desc: "Refresco de cola o té con limón", price: "2,00" },
    { name: "Cerveza Caña", desc: "Cerveza nacional bien fría", price: "2,50" },
    { name: "Cerveza Italiana", desc: "Peroni o Moretti importada", price: "3,50" },
    { name: "Agua Mineral", desc: "Agua natural o con gas", price: "1,50" },
    { name: "Vino Tinto (Copa)", desc: "Selección de la casa", price: "3,00" },
    { name: "Tinto de Verano", desc: "Refrescante combinación de vino y limón", price: "2,50" },
  ],
}

const GALLERY_IMAGES = [
  { src: "https://res.cloudinary.com/dmuxgamms/image/upload/v1781783751/unnamed_b0jbej.webp", alt: "Fachada de Luigipizza" },
  { src: "https://res.cloudinary.com/dmuxgamms/image/upload/v1781783787/unnamed_1_mkvhfc.webp", alt: "Horno y preparación" },
  { src: "https://res.cloudinary.com/dmuxgamms/image/upload/v1781783802/unnamed_2_emmq6t.webp", alt: "Pizza artesanal" },
]

const REVIEWS = [
  { name: "María G.", text: "Es una brutalidad las pizzas. Sin duda creo que es de las mejores pizzas caseras que hemos probado.", rating: 5 },
  { name: "Antonio R.", text: "La salsa y el queso están riquísimos, y la masa tiene el equilibrio perfecto entre crujiente y esponjosa.", rating: 5 },
  { name: "Laura M.", text: "Pedimos para llevar y llegó todo caliente y perfecto. Sin duda repetiremos.", rating: 5 },
  { name: "Carlos L.", text: "La mejor pizza de San Juan, masa artesanal de verdad. El trato inmejorable.", rating: 5 },
  { name: "Ana P.", text: "Precio calidad inmejorable. La Luigipizza es espectacular, recomendada 100%.", rating: 5 },
  { name: "Javier S.", text: "Auténtico sabor italiano. Se nota que la masa es artesanal y los ingredientes de calidad.", rating: 4 },
]

const FEATURES = [
  { title: "Masa artesanal propia", desc: "Elaborada diariamente siguiendo procesos de fermentación que potencian el sabor y la textura." },
  { title: "Ingredientes de calidad", desc: "Utilizamos productos seleccionados para garantizar el mejor resultado en cada pizza." },
  { title: "Excelente relación calidad-precio", desc: "Pizzas artesanales a precios accesibles para todos los bolsillos." },
  { title: "Valoraciones destacadas", desc: "Más de 200 reseñas con una valoración media cercana a 4,6/5." },
  { title: "Pedidos para llevar", desc: "Pide por teléfono y recoge tu pizza recién hecha en el momento." },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Menú">
            <span /><span /><span />
          </button>
          <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }}>
            {RESTAURANT.name}
          </a>
          <div className="nav-links">
            <button className="nav-link" onClick={() => scrollTo("carta")}>Carta</button>
            <button className="nav-link" onClick={() => scrollTo("nosotros")}>Nosotros</button>
            <button className="nav-link" onClick={() => scrollTo("reservas")}>Reservas</button>
            <button className="nav-link" onClick={() => scrollTo("contacto")}>Contacto</button>
            <a href={`tel:+34${RESTAURANT.phone.replace(/\s/g,"")}`} className="btn-gold nav-btn-reservar">Reservar</a>
          </div>
        </div>
      </nav>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-header">
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <div className="mobile-body">
          <button className="mobile-cat-title" onClick={() => scrollTo("carta")}>Carta</button>
          <button className="mobile-cat-title" onClick={() => scrollTo("nosotros")}>Nosotros</button>
          <button className="mobile-cat-title" onClick={() => scrollTo("reservas")}>Reservas</button>
          <button className="mobile-cat-title" onClick={() => scrollTo("contacto")}>Contacto</button>
          <a href={`tel:+34${RESTAURANT.phone.replace(/\s/g,"")}`} className="mobile-cat-title mobile-call">Reservar</a>
        </div>
      </div>
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  )
}

function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <section className="hero">
      <div className="hero-bg">
        <img src="https://res.cloudinary.com/dmuxgamms/image/upload/v1781792861/unnamed_3_l6wkaf.webp" alt="Pizza artesanal" />
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        {visible && (
          <>
            <p className="fade-up hero-eyebrow">{RESTAURANT.city}</p>
            <h1 className="fade-up hero-title">{RESTAURANT.name} <em>Pizza</em></h1>
            <p className="fade-up hero-subtitle">{RESTAURANT.tagline}</p>
            <div className="fade-up hero-actions">
              <a href={`tel:+34${RESTAURANT.phone.replace(/\s/g,"")}`} className="btn-primary">Reservar mesa</a>
              <button className="btn-outline" onClick={() => document.getElementById("carta")?.scrollIntoView({ behavior: "smooth" })}>Ver carta</button>
            </div>
            <div className="fade-up hero-links">
              <a href={`tel:+34${RESTAURANT.phone.replace(/\s/g,"")}`} className="hero-link">Llamar</a>
              <span className="hero-link-sep">·</span>
              <a href="https://maps.google.com/?q=Luigipizza+San+Juan+de+Aznalfarache" target="_blank" rel="noopener noreferrer" className="hero-link">Cómo llegar</a>
            </div>
          </>
        )}
      </div>
      <button className="hero-scroll" onClick={() => document.getElementById("nosotros")?.scrollIntoView({ behavior: "smooth" })}>
        <span>Descubrir</span>
        <div className="scroll-arrow" />
      </button>
    </section>
  )
}

function About() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="nosotros" className="section section-card" ref={ref}>
      <div className={`container ${visible ? "fade-in" : ""}`}>
        <p className="eyebrow">Nuestra filosofía</p>
        <h2 className="section-title">Pasión por la pizza artesanal</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>En Luigipizza elaboramos cada pizza con masa artesanal de producción propia y fermentación controlada para conseguir una textura crujiente por fuera y esponjosa por dentro.</p>
            <p>Seleccionamos ingredientes de calidad para que cada pizza conserve el auténtico sabor que nos ha convertido en una de las pizzerías mejor valoradas de la zona.</p>
            <blockquote>"Masa fresca cada día, ingredientes seleccionados y mucho cariño. Esa es nuestra receta."</blockquote>
          </div>
          <div className="about-features">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <h4 className="feature-card-title">{f.title}</h4>
                <p className="feature-card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Menu() {
  const [category, setCategory] = useState("clasicas")
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const items = MENU_ITEMS[category] || []

  return (
    <section id="carta" className="section" ref={ref}>
      <div className={`container ${visible ? "fade-in" : ""}`}>
        <p className="eyebrow">Nuestra carta</p>
        <h2 className="section-title">Descubre nuestras pizzas</h2>
        <div className="menu-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`menu-tab ${category === cat.id ? "active" : ""}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="menu-list" key={category}>
          {items.map((item, i) => (
            <div className="menu-item" style={{ animationDelay: `${i * 0.1}s` }} key={item.name}>
              <div className="menu-item-header">
                <span className="menu-item-name">{item.name}</span>
                <span className="menu-item-dots"></span>
                <span className="menu-item-price">{item.price}€</span>
              </div>
              <p className="menu-item-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const refs = useRef<(HTMLDivElement | null)[]>([])

  const setRef = useCallback((el: HTMLDivElement | null, i: number) => {
    refs.current[i] = el
  }, [])

  useEffect(() => {
    const current = refs.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("visible", entry.isIntersecting)
        })
      },
      { threshold: 0.1 }
    )
    current.forEach((el) => { if (el) observer.observe(el) })
    return () => {
      current.forEach((el) => { if (el) observer.unobserve(el) })
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null)
      if (e.key === "ArrowLeft") setLightbox((prev) => prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : null)
      if (e.key === "ArrowRight") setLightbox((prev) => prev !== null ? (prev + 1) % GALLERY_IMAGES.length : null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox])

  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Galería</p>
        <h2 className="section-title">Momentos Luigipizza</h2>
        <div className="gallery-grid">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`gallery-card ${i % 2 === 0 ? "slide-left" : "slide-right"}`}
              ref={(el) => setRef(el, i)}
              onClick={() => setLightbox(i)}
            >
              <img src={img.src} alt={img.alt} className="gallery-img" loading="lazy" />
              <div className="gallery-overlay">
                <span>Ampliar</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <button className="lightbox-arrow lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length) }}>‹</button>
          <img src={GALLERY_IMAGES[lightbox].src} alt={GALLERY_IMAGES[lightbox].alt} className="lightbox-img" onClick={(e) => e.stopPropagation()} />
          <button className="lightbox-arrow lightbox-next" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % GALLERY_IMAGES.length) }}>›</button>
        </div>
      )}
    </section>
  )
}

function Reviews() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scoreStr = RESTAURANT.reviewScore.toFixed(1).replace(".", ",")

  return (
    <section className="section section-card" ref={ref}>
      <div className={`container ${visible ? "fade-in" : ""}`}>
        <p className="eyebrow">Opiniones</p>
        <div className="reviews-badge">{scoreStr} · Más de {RESTAURANT.reviewsTotal} reseñas</div>
        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-stars">
                {Array.from({ length: 5 }, (_, j) => (
                  <span key={j} className={`star ${j < r.rating ? "filled" : ""}`}>★</span>
                ))}
              </div>
              <p className="review-text">"{r.text}"</p>
              <p className="review-name">{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reservations() {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [persons, setPersons] = useState("")
  const [note, setNote] = useState("")
  const [done, setDone] = useState<{date:string;time:string;name:string;phone:string;persons:string;note:string}|null>(null)
  const [booked, setBooked] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const today = new Date().toISOString().slice(0, 10)
  const now = new Date()
  const isPast = (t: string) => date === today && t < `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
  const isBooked = (t: string) => booked.includes(t) || isPast(t)

  useEffect(() => {
    if (!date) { setBooked([]); return }
    const channel = supabase.channel("slots-"+date)
      .on("postgres_changes", {event:"*", schema:"public", table:"slots", filter:`date=eq.${date}`}, () => {
        supabase.from("slots").select("time").eq("date",date).then(({data}) => setBooked((data||[]).map(r=>r.time)))
      }).subscribe()
    supabase.from("slots").select("time").eq("date",date).then(({data}) => setBooked((data||[]).map(r=>r.time)))
    return () => { channel.unsubscribe() }
  }, [date])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")
    const {error: insertErr} = await supabase.from("slots").insert([
      {date, time, name, phone, persons, note, created_at: new Date().toISOString()}
    ])
    if (insertErr) {
      setSending(false)
      if (insertErr.code === "23505") setError("Este horario acaba de ser reservado por otra persona.")
      else setError(insertErr.message)
      return
    }
    setSending(false)
    setDone({date, time, name, phone, persons, note})
  }

  const timeSlots = [
    { label: "Tarde", slots: ["20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"] },
    { label: "Noche", slots: ["00:00","00:30","01:00","01:30"] },
  ]

  if (done) {
    return (
      <section id="reservas" className="section section-card">
        <div className="container-narrow">
          <div className="confirm-icon">✓</div>
          <h2 className="section-title">Reserva confirmada</h2>
          <div className="confirm-box">
            <div className="confirm-row"><span className="confirm-label">Fecha</span><span className="confirm-value">{done.date}</span></div>
            <div className="confirm-row"><span className="confirm-label">Hora</span><span className="confirm-value">{done.time}</span></div>
            <div className="confirm-row"><span className="confirm-label">Personas</span><span className="confirm-value">{done.persons}</span></div>
            <div className="confirm-row"><span className="confirm-label">Nombre</span><span className="confirm-value">{done.name}</span></div>
            <div className="confirm-row"><span className="confirm-label">Teléfono</span><span className="confirm-value">{done.phone}</span></div>
            {done.note && <div className="confirm-row"><span className="confirm-label">Comentarios</span><span className="confirm-value">{done.note}</span></div>}
          </div>
          <a href={`tel:+34${RESTAURANT.phone.replace(/\s/g,"")}`} className="btn-gold confirm-call">Llamar · {RESTAURANT.phone}</a>
        </div>
      </section>
    )
  }

  const allDisabled = !date || !time || !name || !phone || !persons || isBooked(time) || sending

  return (
    <section id="reservas" className="section section-card">
      <div className="container-narrow">
        <p className="eyebrow">Reservas</p>
        <h2 className="section-title">Reserva tu mesa</h2>
        <form className="reservas-form" onSubmit={handleSubmit}>
          <input
            type="date"
            value={date}
            required
            onChange={(e) => {
              const v = e.target.value
              if (v < today) return
              setDate(v)
              setTime("")
            }}
          />
          <select value={time} onChange={(e) => setTime(e.target.value)} required>
            <option value="">Seleccionar</option>
            {timeSlots.map((group) => (
              <optgroup label={group.label} key={group.label}>
                {group.slots.map((t) => (
                  <option key={t} value={t} disabled={isBooked(t)}>
                    {t}{isBooked(t) ? " — reservado" : ""}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <select value={persons} onChange={(e) => setPersons(e.target.value)} required>
            <option value="">N.º</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Su nombre"
            required
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g,"").slice(0,15))}
            placeholder="600000000"
            inputMode="numeric"
            required
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Comentarios (opcional)"
            rows={3}
          />
          {error && <p className="reservas-error">{error}</p>}
          <button type="submit" className="btn-gold btn-submit" disabled={allDisabled}>
            {sending ? "Reservando..." : (time && isBooked(time) ? "No disponible" : "Confirmar reserva")}
          </button>
        </form>
      </div>
    </section>
  )
}

function Location() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="contacto" className="section section-card" ref={ref}>
      <div className={`container ${visible ? "fade-in" : ""}`}>
        <p className="eyebrow">Ubicación</p>
        <h2 className="section-title">Encuéntranos</h2>
        <div className="location-grid">
          <div className="location-info">
            <p className="location-label">Dirección</p>
            <p className="location-value">{RESTAURANT.location}</p>
            <p className="location-value">{RESTAURANT.addressShort}</p>
            <p className="location-value">{RESTAURANT.city}</p>
            <div className="location-buttons">
              <a href="https://maps.google.com/?q=Luigipizza+San+Juan+de+Aznalfarache" target="_blank" rel="noopener noreferrer" className="btn-gold">Abrir en Maps</a>
              <a href={`tel:+34${RESTAURANT.phone.replace(/\s/g,"")}`} className="btn-outline">Llamar</a>
            </div>
            <div className="location-hours">
              <p className="location-label">Horario</p>
              <p className="location-value">{RESTAURANT.hours}</p>
            </div>
          </div>
          <div className="location-map">
            <iframe
              src={RESTAURANT.mapSrc}
              width="100%"
              height="100%"
              style={{border:0, minHeight:"300px"}}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Luigipizza"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-logo">{RESTAURANT.name}</h3>
            <p className="footer-tagline">{RESTAURANT.tagline}</p>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Dirección</h4>
            <p>{RESTAURANT.address}</p>
            <p className="footer-phone" onClick={() => window.open(`tel:+34${RESTAURANT.phone.replace(/\s/g,"")}`)}>{RESTAURANT.phone}</p>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Contacto</h4>
            <p className="footer-phone" onClick={() => window.open(`tel:+34${RESTAURANT.phone.replace(/\s/g,"")}`)}>{RESTAURANT.phone}</p>
            <div className="footer-social">
              <a href="https://instagram.com/luigipizza" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://tiktok.com/@luigipizza" target="_blank" rel="noopener noreferrer">TikTok</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {RESTAURANT.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Menu />
        <Gallery />
        <Reviews />
        <Reservations />
        <Location />
      </main>
      <Footer />
    </>
  )
}
