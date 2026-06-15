import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from './supabase'
import './App.css'

const RESTAURANT = {
  name: "Abacería Brutal",
  tagline: "El sabor auténtico de Andalucía",
  description:
    "Nacimos en Mairena del Aljarafe con una idea clara: recuperar el espíritu de las antiguas abacerías sevillanas, pero con un toque moderno y la mejor materia prima. Aquí todo gira en torno al producto de calidad: jamón ibérico de bellota, chicharrones crujientes, quesos curados, conservas gourmet y cerveza siempre extra fría. Somos tradición, calidad y buen ambiente.",
  quote:
    "El sabor auténtico de Andalucía. Tapas brutales, momentos inolvidables.",
  quoteAuthor: "— Abacería Brutal",
  features: [
    { title: "Jamón Ibérico", desc: "Selección de bellota 100% ibérico, cortado a cuchillo en el momento." },
    { title: "Chicharrones", desc: "Crujientes por fuera, tiernos por dentro. Nuestra especialidad estrella." },
    { title: "Cerveza Extra Fría", desc: "Siempre a la temperatura perfecta. La acompañante ideal de cada tapa." },
    { title: "Producto Local", desc: "Seleccionamos lo mejor de la tierra andaluza para tu mesa." },
  ],
  especialidades: [
    { title: "Jamón Ibérico de Bellota", desc: "Cortado a cuchillo, con la untuosidad y el sabor que solo la dehesa puede dar." },
    { title: "Chicharrones Brutales", desc: "Nuestra receta tradicional, con el punto exacto de fritura. Adictivos." },
    { title: "Tabla de Quesos Curados", desc: "Selección de quesos andaluces con membrillo y frutos secos." },
    { title: "Montaditos Premium", desc: "Sobre pan de cristal, las mejores combinaciones de nuestra tierra." },
    { title: "Conservas Gourmet", desc: "Anchoas, mejillones, berberechos y otras delicatessen en aceite de oliva." },
    { title: "Vinos y Cervezas", desc: "Carta de vinos seleccionados y cerveza siempre tirada a la perfección." },
  ],
  address: "C. Atenea, 18, 41927 Mairena del Aljarafe, Sevilla, España",
  phone: "Pendiente de confirmar",
  phoneLink: "",
  hours: `Lunes: Cerrado
Martes: 19:30 - 00:00
Miércoles: 19:30 - 00:00
Jueves: 19:30 - 00:00
Viernes: 13:00 - 17:00 / 19:30 - 00:00
Sábado: 13:00 - 17:00 / 19:30 - 00:00
Domingo: 13:00 - 17:00`,
  email: "info@abaceriabrutal.com",
  heroImage: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&q=80",
  mapEmbed:
    "https://www.google.com/maps?q=C.+Atenea+18,+41927+Mairena+del+Aljarafe,+Sevilla&output=embed",
}

const menuCategories = [
  {
    name: "Chacinas",
    items: [
      { name: "Jamón Ibérico de Bellota", description: "Cortado a cuchillo, acompañado de pan con tomate", price: "18,50€" },
      { name: "Lomo Ibérico", description: "Curado artesanalmente, finas lonchas", price: "14,00€" },
      { name: "Chorizo Ibérico", description: "De bellota, con su punto justo de pimentón", price: "12,00€" },
      { name: "Salchichón Ibérico", description: "Receta tradicional con toque de pimienta negra", price: "11,50€" },
    ],
  },
  {
    name: "Tapas",
    items: [
      { name: "Chicharrones Brutales", description: "Tostados crujientes, nuestra especialidad de la casa", price: "9,50€" },
      { name: "Montadito de Pringá", description: "Panza de cerdo deshilachada con salsa BBQ ahumada", price: "4,50€" },
      { name: "Croquetas de Jamón", description: "Beicon y jamón, cremosas por dentro", price: "8,00€" },
      { name: "Tostón de Cabra", description: "Pan tostado con queso de cabra, miel y nueces", price: "7,50€" },
    ],
  },
  {
    name: "Montaditos",
    items: [
      { name: "Montadito de Jamón", description: "Jamón ibérico con aliño de tomate y aceite", price: "5,50€" },
      { name: "Montadito de Chicharrón", description: "Chicharrón crujiente con alioli de ajo negro", price: "4,50€" },
      { name: "Montadito de Queso", description: "Queso curado con membrillo y jamón", price: "5,00€" },
      { name: "Montadito de Anchoas", description: "Anchoas del Cantábrico con tomate y olivas", price: "6,00€" },
    ],
  },
  {
    name: "Bebidas",
    items: [
      { name: "Cerveza Bien Fría", description: "Cerveza de barril tirada a la perfección", price: "3,00€" },
      { name: "Vino de la Tierra", description: "Selección de vinos andaluces, tinto o blanco", price: "3,50€" },
      { name: "Rebujito", description: "Manzanilla con gaseosa y hierbabuena fresca", price: "4,00€" },
      { name: "Tinto de Verano", description: "Vino tinto con limón y hielo, el clásico del sur", price: "3,50€" },
    ],
  },
]

const galleryImages = [
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
  "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80",
  "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
  "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
  "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
]

const reviews = [
  { name: "María G.", text: "Los chicharrones más brutales que he probado. El jamón ibérico espectacular y la cerveza bien fría. Repetiremos seguro.", rating: 5 },
  { name: "Carlos L.", text: "Auténtica cocina andaluza con productos de primera. El montadito de pringá es una auténtica locura.", rating: 5 },
  { name: "Ana P.", text: "Ambiente acogedor, trato excelente y la mejor selección de chacinas de Sevilla. Muy recomendable.", rating: 5 },
  { name: "Diego R.", text: "Un rincón con encanto en Mairena. Las tapas son increíbles y la atención al cliente inmejorable.", rating: 4 },
  { name: "Valentina S.", text: "Si te gusta el buen jamón, este es tu sitio. La tabla de quesos curados es imprescindible.", rating: 5 },
]

const timeSlots: Record<string, string[]> = {
  Comida: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
  Cena: ["19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"],
}

function useIntersection(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])
  return visible
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className={`star ${i < rating ? "filled" : ""}`} viewBox="0 0 24 24" width="18" height="18">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function GoldenCheck() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="golden-check">
      <circle cx="28" cy="28" r="27" stroke="#D4AF37" strokeWidth="2" />
      <path d="M16 28l8 8 16-16" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          {RESTAURANT.name}
        </button>
        <button className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <button onClick={() => scrollTo("historia")}>Historia</button>
          <button onClick={() => scrollTo("especialidades")}>Especialidades</button>
          <button onClick={() => scrollTo("carta")}>Carta</button>
          <button onClick={() => scrollTo("galeria")}>Galería</button>
          <button onClick={() => scrollTo("opiniones")}>Opiniones</button>
          <button onClick={() => scrollTo("reservas")}>Reservas</button>
          <button onClick={() => scrollTo("ubicacion")}>Ubicación</button>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const visible = useIntersection(ref, 0.1)

  return (
    <section className="hero" ref={ref}>
      <div className="hero-bg" style={{ backgroundImage: `url(${RESTAURANT.heroImage})` }} />
      <div className="hero-overlay" />
      <div className={`hero-content ${visible ? "fade-up" : ""}`}>
        <p className="hero-suptitle">Abacería Tradicional Andaluza</p>
        <h1 className="hero-title">{RESTAURANT.name}</h1>
        <p className="hero-tagline">{RESTAURANT.tagline}</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => document.getElementById("reservas")?.scrollIntoView({ behavior: "smooth" })}>
            Reservar mesa
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById("carta")?.scrollIntoView({ behavior: "smooth" })}>
            Ver carta
          </button>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Descubre</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  )
}

function Historia() {
  const ref = useRef<HTMLElement>(null)
  const visible = useIntersection(ref)

  return (
    <section id="historia" className="section" ref={ref}>
      <div className={`section-content ${visible ? "fade-up" : ""}`}>
        <h2 className="section-title">Nuestra Historia</h2>
        <div className="about-text">
          <p>{RESTAURANT.description}</p>
        </div>
        <blockquote className="about-quote">
          <p>"{RESTAURANT.quote}"</p>
          <cite>{RESTAURANT.quoteAuthor}</cite>
        </blockquote>
        <div className="features-grid">
          {RESTAURANT.features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon" />
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Especialidades() {
  const ref = useRef<HTMLElement>(null)
  const visible = useIntersection(ref)

  return (
    <section id="especialidades" className="section section-dark" ref={ref}>
      <div className={`section-content ${visible ? "fade-up" : ""}`}>
        <h2 className="section-title">Especialidades</h2>
        <div className="especialidades-grid">
          {RESTAURANT.especialidades.map((esp, i) => (
            <div key={i} className="especialidad-card">
              <div className="especialidad-number">{String(i + 1).padStart(2, "0")}</div>
              <h3>{esp.title}</h3>
              <p>{esp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Carta() {
  const [tab, setTab] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const visible = useIntersection(ref)

  return (
    <section id="carta" className="section" ref={ref}>
      <div className={`section-content ${visible ? "fade-up" : ""}`}>
        <h2 className="section-title">Carta Destacada</h2>
        <p className="section-subtitle">Productos de primera, preparados con respeto y pasión</p>
        <div className="tabs">
          {menuCategories.map((cat, i) => (
            <button key={i} className={`tab ${i === tab ? "active" : ""}`} onClick={() => setTab(i)}>
              {cat.name}
            </button>
          ))}
          <div className="tab-underline" style={{ left: `${tab * (100 / menuCategories.length)}%`, width: `${100 / menuCategories.length}%` }} />
        </div>
        <div className="menu-items">
          {menuCategories[tab].items.map((item, i) => (
            <div key={i} className="menu-item">
              <div className="menu-item-info">
                <div className="menu-item-header">
                  <span className="menu-item-name">{item.name}</span>
                  <span className="menu-item-dots" />
                  <span className="menu-item-price">{item.price}</span>
                </div>
                <p className="menu-item-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Galeria() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const [visibles, setVisibles] = useState<boolean[]>(galleryImages.map(() => false))

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute("data-index"))
          if (!isNaN(idx)) {
            setVisibles((prev) => {
              const next = [...prev]
              next[idx] = entry.isIntersecting
              return next
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    refs.current.forEach((el) => {
      if (el) obs.observe(el)
    })

    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null)
      if (e.key === "ArrowRight") setLightbox((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null))
      if (e.key === "ArrowLeft") setLightbox((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null))
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [lightbox])

  return (
    <section id="galeria" className="section section-dark">
      <div className="section-content">
        <h2 className="section-title">Galería</h2>
      </div>
      <div className="gallery-grid">
        {galleryImages.map((img, i) => (
          <div
            key={i}
            ref={(el) => { refs.current[i] = el }}
            data-index={i}
            className={`gallery-item ${visibles[i] ? "slide-in" : ""}`}
            onClick={() => setLightbox(i)}
          >
            <img src={img} alt={`Galería ${i + 1}`} loading="lazy" />
            <div className="gallery-gradient" />
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + galleryImages.length) % galleryImages.length) }}>‹</button>
          <img src={galleryImages[lightbox]} alt="" className="lightbox-img" onClick={(e) => e.stopPropagation()} />
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % galleryImages.length) }}>›</button>
        </div>
      )}
    </section>
  )
}

function Opiniones() {
  const ref = useRef<HTMLElement>(null)
  const visible = useIntersection(ref)

  return (
    <section id="opiniones" className="section" ref={ref}>
      <div className={`section-content ${visible ? "fade-up" : ""}`}>
        <h2 className="section-title">Opiniones</h2>
        <div className="reviews-grid">
          {reviews.map((r, i) => (
            <div key={i} className="review-card">
              <Stars rating={r.rating} />
              <p className="review-text">"{r.text}"</p>
              <p className="review-name">{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reservas() {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [persons, setPersons] = useState("")
  const [note, setNote] = useState("")
  const [done, setDone] = useState<{ date: string; time: string; name: string; phone: string; persons: string; note: string } | null>(null)
  const [booked, setBooked] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const ref = useRef<HTMLElement>(null)
  const visible = useIntersection(ref)

  const fetchSlots = useCallback(async (d: string) => {
    const { data } = await supabase.from("slots").select("time").eq("date", d)
    if (data) setBooked(data.map((s) => s.time))
  }, [])

  useEffect(() => {
    if (!date) return
    const channel = supabase
      .channel("slots-" + date)
      .on("postgres_changes", { event: "*", schema: "public", table: "slots", filter: `date=eq.${date}` }, () => {
        fetchSlots(date)
      })
      .subscribe()
    fetchSlots(date)
    return () => { channel.unsubscribe() }
  }, [date, fetchSlots])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value
    const today = new Date().toISOString().split("T")[0]
    if (selected < today) return
    setDate(selected)
    setTime("")
  }

  const isPast = (slot: string) => {
    if (!date) return false
    const today = new Date().toISOString().split("T")[0]
    if (date !== today) return false
    const [h, m] = slot.split(":").map(Number)
    const slotDate = new Date()
    slotDate.setHours(h, m, 0, 0)
    return slotDate <= new Date()
  }

  const isDisabled = (slot: string) => booked.includes(slot) || isPast(slot)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time || !name || !phone || !persons) return
    setSending(true)
    setError("")
    const { error: err } = await supabase.from("slots").insert({
      date, time, name, phone, persons,
      note: note || "",
      created_at: new Date().toISOString(),
    })
    if (err) {
      if (err.code === "23505") {
        setError("Este horario ya no está disponible. Por favor elige otro.")
      } else {
        setError("Ocurrió un error al procesar la reserva. Intenta nuevamente.")
      }
      setSending(false)
      return
    }
    setDone({ date, time, name, phone, persons, note })
    setSending(false)
  }

  const allFilled = date && time && name && phone && persons

  if (done) {
    return (
      <section id="reservas" className="section" ref={ref}>
        <div className={`section-content ${visible ? "fade-up" : ""}`}>
          <h2 className="section-title">Reservas</h2>
          <div className="confirmation">
            <GoldenCheck />
            <h3>Reserva confirmada</h3>
            <div className="confirmation-details">
              <div className="conf-row"><span className="conf-label">Fecha</span><span className="conf-value">{done.date}</span></div>
              <div className="conf-row"><span className="conf-label">Hora</span><span className="conf-value">{done.time}</span></div>
              <div className="conf-row"><span className="conf-label">Personas</span><span className="conf-value">{done.persons}</span></div>
              <div className="conf-row"><span className="conf-label">Nombre</span><span className="conf-value">{done.name}</span></div>
              <div className="conf-row"><span className="conf-label">Teléfono</span><span className="conf-value">{done.phone}</span></div>
              {done.note && <div className="conf-row"><span className="conf-label">Comentarios</span><span className="conf-value">{done.note}</span></div>}
            </div>
            {RESTAURANT.phoneLink && <a href={`tel:${RESTAURANT.phoneLink}`} className="btn-primary call-btn">Llamar al restaurante</a>}
          </div>
        </div>
      </section>
    )
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <section id="reservas" className="section" ref={ref}>
      <div className={`section-content ${visible ? "fade-up" : ""}`}>
        <h2 className="section-title">Contacto y Reservas</h2>
        <div className="reservas-intro">
          <p>¿Quieres disfrutar de una experiencia brutal? Reserva tu mesa y te preparamos lo mejor de nuestra casa.</p>
        </div>
        <form className="reservas-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Fecha</label>
              <input id="date" type="date" value={date} onChange={handleDateChange} min={today} required />
            </div>
            <div className="form-group">
              <label htmlFor="time">Hora</label>
              <select id="time" value={time} onChange={(e) => setTime(e.target.value)} required disabled={!date}>
                <option value="">Seleccionar hora</option>
                {Object.entries(timeSlots).map(([turno, slots]) => (
                  <optgroup key={turno} label={turno}>
                    {slots.map((slot) => (
                      <option key={slot} value={slot} disabled={isDisabled(slot)}>
                        {slot}{isDisabled(slot) ? " — reservado" : ""}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Tu nombre" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input id="phone" type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 15))} required placeholder="Ej: 655555555" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="persons">Personas</label>
              <select id="persons" value={persons} onChange={(e) => setPersons(e.target.value)} required>
                <option value="">Seleccionar</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={(i + 1).toString()}>{i + 1} {i === 0 ? "persona" : "personas"}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="note">Comentarios</label>
              <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Alergias, ocasión especial..." rows={1} />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary form-submit" disabled={!allFilled || sending}>
            {!allFilled ? "No disponible" : sending ? "Reservando..." : "Confirmar reserva"}
          </button>
        </form>
      </div>
    </section>
  )
}

function Horarios() {
  const ref = useRef<HTMLElement>(null)
  const visible = useIntersection(ref)
  const days = RESTAURANT.hours.split("\n").map((s) => s.trim()).filter(Boolean)

  return (
    <section id="horarios" className="section section-dark" ref={ref}>
      <div className={`section-content ${visible ? "fade-up" : ""}`}>
        <h2 className="section-title">Horarios</h2>
        <div className="horarios-list">
          {days.map((day, i) => {
            const [name, ...rest] = day.split(": ")
            const hours = rest.join(": ")
            const isClosed = hours.toLowerCase() === "cerrado"
            return (
              <div key={i} className={`horario-row ${isClosed ? "closed" : ""}`}>
                <span className="horario-day">{name}</span>
                <span className="horario-sep" />
                <span className="horario-hours">{hours}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Ubicacion() {
  const ref = useRef<HTMLElement>(null)
  const visible = useIntersection(ref)

  return (
    <section id="ubicacion" className="section" ref={ref}>
      <div className={`section-content ${visible ? "fade-up" : ""}`}>
        <h2 className="section-title">Ubicación</h2>
        <div className="location-info">
          <p className="location-address">{RESTAURANT.address}</p>
          <p className="location-email">{RESTAURANT.email}</p>
          {RESTAURANT.phone !== "Pendiente de confirmar" && <p className="location-phone"><a href={`tel:${RESTAURANT.phoneLink}`}>{RESTAURANT.phone}</a></p>}
        </div>
        <div className="map-container">
          <iframe src={RESTAURANT.mapEmbed} width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación" />
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>{RESTAURANT.name}</h3>
          <p>{RESTAURANT.tagline}</p>
        </div>
        <div className="footer-info">
          <p>{RESTAURANT.address}</p>
          {RESTAURANT.phone !== "Pendiente de confirmar" && <p><a href={`tel:${RESTAURANT.phoneLink}`}>{RESTAURANT.phone}</a></p>}
          <p><a href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</a></p>
        </div>
        <div className="footer-hours">
          {RESTAURANT.hours.split("\n").map((line, i) => (
            <p key={i}>{line.trim()}</p>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {RESTAURANT.name}. Todos los derechos reservados.</p>
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
        <Historia />
        <Especialidades />
        <Carta />
        <Galeria />
        <Opiniones />
        <Reservas />
        <Horarios />
        <Ubicacion />
      </main>
      <Footer />
    </>
  )
}
