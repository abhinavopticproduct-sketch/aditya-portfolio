import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleDot,
  Compass,
  Globe2,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Plane,
  Send,
  Sparkles,
  Ticket,
  X,
} from 'lucide-react';
import './styles.css';

const navItems = [
  ['home', 'Home'],
  ['about', 'About'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['skills', 'Skills'],
  ['contact', 'Contact'],
];

const skills = [
  { name: 'Trekking Guide', category: 'Travel & Tourism', description: 'A people-first approach to discovering places and making journeys memorable.', icon: Compass },
  { name: 'Flight Booking', category: 'Travel & Tourism', description: 'Understanding of basic flight booking and reservation processes.', icon: Plane },
  { name: 'Basic Ticketing', category: 'Travel & Tourism', description: 'Developing practical knowledge of fares, tickets and airline workflows.', icon: Ticket },
  { name: 'PNR Creation', category: 'Travel & Tourism', description: 'Learning the building blocks of passenger reservation records.', icon: CircleDot },
  { name: 'Sabre Knowledge', category: 'Travel Technology', description: 'Training in the Sabre Global Distribution System and its command language.', icon: Globe2 },
  { name: 'Passenger Reservation', category: 'Travel Technology', description: 'Connecting customer needs with clear, accurate reservation processes.', icon: MapPin },
  { name: 'GDS', category: 'Travel Technology', description: 'An introduction to the global distribution systems used across travel operations.', icon: Globe2 },
  { name: 'Fare Structures', category: 'Travel Technology', description: 'Developing familiarity with the fare information behind airline ticketing.', icon: Ticket },
  { name: 'Communication Skills', category: 'Communication & Marketing', description: 'Clear, thoughtful communication across people, ideas and experiences.', icon: Sparkles },
  { name: 'Marketing Skills', category: 'Communication & Marketing', description: 'Growing an interest in how stories help places and experiences connect.', icon: ArrowUpRight },
  { name: 'Content Creation', category: 'Communication & Marketing', description: 'Creating useful, engaging content with a curious editorial eye.', icon: Send },
  { name: 'Social Media', category: 'Communication & Marketing', description: 'Exploring digital channels as a way to share travel meaningfully.', icon: Instagram },
  { name: 'Web Content', category: 'Communication & Marketing', description: 'A developing instinct for clear, purposeful web experiences.', icon: Globe2 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Reveal({ children, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionIntro({ number, eyebrow, title }) {
  return (
    <div className="section-intro">
      <span className="eyebrow"><span>{number}</span> — {eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [formState, setFormState] = useState('idle');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && setActiveSection(entry.target.id)),
      { rootMargin: '-35% 0px -55% 0px' },
    );
    navItems.forEach(([id]) => document.getElementById(id) && observer.observe(document.getElementById(id)));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);

  const submitContact = async event => {
    event.preventDefault();
    setFormState('sending');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) });
      if (!response.ok) throw new Error('Request failed');
      setFormState('success');
      event.currentTarget.reset();
    } catch {
      setFormState('error');
    }
  };

  return (
    <div className="site-shell">
      <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <a className="brand" href="#home" aria-label="Aditya Adhikari home">AA<span>.</span></a>
        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Primary navigation">
          {navItems.map(([id, label]) => <a key={id} className={activeSection === id ? 'active' : ''} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <a className="connect-link" href="#contact">Let's connect <ArrowUpRight size={15} /></a>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-grid" />
          <div className="hero-copy">
            <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}><span>00</span> — Personal portfolio</motion.p>
            <motion.h1 id="hero-title" initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25 }}>
              Aditya<br /><em>Adhikari</em>
            </motion.h1>
            <motion.div className="hero-role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
              <span className="rule" />
              <p>Travel &amp; Tourism<br />Management student</p>
            </motion.div>
            <motion.p className="hero-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>Passionate about travel, tourism, people and experiences — building my professional journey through communication, marketing and travel technology.</motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <a className="button button-primary" href="#about">Explore my journey <ArrowDownRight size={17} /></a>
              <a className="button button-quiet" href="#contact">Request CV <ArrowUpRight size={16} /></a>
            </motion.div>
          </div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.35 }}>
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="portrait-frame"><img src="/images/Aditya.png" alt="Aditya Adhikari" /></div>
            <div className="portrait-tag tag-top"><span>27° 42' N</span><small>KATHMANDU, NEPAL</small></div>
            <div className="portrait-tag tag-bottom"><span>01 / 03</span><small>THE JOURNEY BEGINS</small></div>
            <div className="floating-card card-nathm"><b>NATHM</b><span>Travel &amp; Tourism</span></div>
            <div className="floating-card card-sabre"><b>SABRE</b><span>GDS training</span></div>
          </motion.div>
          <div className="hero-scroll"><span>Scroll to explore</span><div /></div>
        </section>

        <section className="manifesto section-pad" id="about">
          <div className="content-wrap">
            <SectionIntro number="01" eyebrow="About" title={<>A curious mind.<br /><i>A passion for travel.</i></>} />
            <div className="about-grid">
              <Reveal className="about-statement"><span>Field note / 001</span><p>Travel is not only<br />about destinations.<br /><em>It’s about people,<br />experiences and<br />connections.</em></p></Reveal>
              <Reveal className="about-copy" delay={0.15}><p className="lead">I’m Aditya, a motivated and detail-oriented Travel &amp; Tourism Management student interested in the moving parts that make a journey feel effortless.</p><p>With a growing foundation in communication, customer service, marketing and travel technology, I’m building practical knowledge one experience at a time. I’m eager to learn, contribute and grow within the travel industry.</p><div className="signature">Aditya Adhikari <span>— in motion</span></div></Reveal>
            </div>
            <div className="stats-row">
              {[['01', 'Travel &', 'Tourism'], ['01', 'Sabre', 'Training'], ['03', 'Languages', 'In connection'], ['∞', 'Learning', 'Mindset']].map(([number, title, sub], index) => <Reveal key={title} delay={index * 0.08}><div className="stat"><strong>{number}</strong><span>{title}<br />{sub}</span></div></Reveal>)}
            </div>
          </div>
        </section>

        <section className="dark-section section-pad" id="experience">
          <div className="content-wrap"><SectionIntro number="02" eyebrow="Experience" title={<>Learning the<br /><i>language of travel.</i></>} />
            <Reveal className="experience-card"><div className="experience-meta"><span>13 — 20 / 02 / 2026</span><span>Training experience</span></div><div className="route-line"><div className="route-dot" /><div className="route-track" /><Plane className="route-plane" size={22} /></div><div className="experience-body"><div><p className="card-kicker">Sabre Nepal</p><h3>Basic ticketing<br /><i>training</i></h3></div><div className="experience-details"><p>Hands-on introduction to the systems and thinking behind modern passenger travel.</p><div className="detail-tags"><span>Sabre GDS</span><span>Passenger reservation</span><span>Fare structures</span><span>GDS command language</span></div></div></div></Reveal>
          </div>
        </section>

        <section className="education section-pad" id="education"><div className="content-wrap"><SectionIntro number="03" eyebrow="Education" title={<>A foundation for<br /><i>the long way around.</i></>} /><div className="education-list">{[['01', 'Bachelor in Travel and Tourism Management', 'NATHM', '2nd Semester'], ['02', '+2 Management', 'Xavier International College', 'GPA 3.38'], ['03', 'SEE', 'Valley Public High School', 'GPA 3.70']].map(([number, degree, school, result], index) => <Reveal key={degree} delay={index * 0.1}><div className="education-item"><span className="item-number">{number}</span><div><h3>{degree}</h3><p>{school}</p></div><span className="item-result">{result}</span></div></Reveal>)}</div></div></section>

        <section className="skills-section section-pad" id="skills"><div className="content-wrap"><SectionIntro number="04" eyebrow="Skills" title={<>Useful skills for<br /><i>real journeys.</i></>} /><p className="section-note">A growing toolkit shaped by curiosity, practice and an interest in the details that connect people to places.</p><div className="skills-grid">{skills.map((skill, index) => { const Icon = skill.icon; return <Reveal key={skill.name} delay={(index % 3) * 0.05}><article className="skill-card"><div className="skill-icon"><Icon size={19} /></div><span className="skill-category">{skill.category}</span><h3>{skill.name}</h3><p>{skill.description}</p><ChevronRight className="skill-arrow" size={18} /></article></Reveal>; })}</div></div></section>

        <section className="dna-section section-pad"><div className="content-wrap"><SectionIntro number="05" eyebrow="Travel DNA" title={<>Built for<br /><i>the journey.</i></>} /><div className="dna-field"><div className="dna-globe"><div className="globe-ring ring-a" /><div className="globe-ring ring-b" /><div className="globe-core"><Globe2 size={48} strokeWidth={0.7} /></div></div>{['Trekking', 'Aviation', 'Tourism', 'Marketing', 'Hospitality', 'Adventure', 'Discovery', 'Communication', 'Experience'].map((word, index) => <span key={word} className={`dna-word word-${index + 1}`}>{word}</span>)}<svg className="route-svg" viewBox="0 0 900 420" aria-hidden="true"><path d="M90 280 C250 30 410 400 580 150 S760 80 850 230" /></svg></div></div></section>

        <section className="workflow section-pad"><div className="content-wrap"><div className="workflow-head"><SectionIntro number="06" eyebrow="Travel technology" title={<>From search<br /><i>to boarding.</i></>} /><p>Understanding how a traveler’s intent becomes a confirmed itinerary — one considered step at a time.</p></div><div className="workflow-steps">{['Search', 'PNR', 'Book', 'Fare', 'Ticket', 'Flight'].map((step, index) => <Reveal key={step} delay={index * 0.05}><div className="workflow-step"><span>0{index + 1}</span><div className="workflow-icon">{index === 0 ? <Globe2 /> : index === 5 ? <Plane /> : <Ticket />}</div><b>{step}</b>{index < 5 && <div className="step-connector" />}</div></Reveal>)}</div><div className="workflow-tags"><span>Sabre GDS</span><span>PNR creation</span><span>Flight booking</span><span>Basic ticketing</span></div></div></section>

        <section className="languages section-pad"><div className="content-wrap"><SectionIntro number="07" eyebrow="Languages" title={<>Many ways to<br /><i>make a connection.</i></>} /><div className="language-list">{[['01', 'English', 'Communication'], ['02', 'नेपाली', 'Connection'], ['03', 'हिन्दी', 'Conversation']].map(([number, language, meaning]) => <Reveal key={language}><div className="language-row"><span>{number}</span><h3>{language}</h3><em>{meaning}</em><ArrowUpRight size={21} /></div></Reveal>)}</div></div></section>

        <section className="contact-section section-pad" id="contact"><div className="content-wrap"><div className="contact-grid"><div><SectionIntro number="08" eyebrow="Contact" title={<>Let’s<br /><i>connect.</i></>} /><p className="contact-intro">Interested in travel, tourism, collaboration or new opportunities? Let’s start a conversation.</p><a className="email-link" href="#contact">Open the contact form <ArrowDownRight size={17} /></a></div><form className="contact-form" onSubmit={submitContact}>{[['name', 'Name', 'Your full name'], ['email', 'Email', 'you@example.com'], ['subject', 'Subject', 'What would you like to discuss?']].map(([name, label, placeholder]) => <label key={name}>{label}<input required name={name} type={name === 'email' ? 'email' : 'text'} placeholder={placeholder} /></label>)}<label>Message<textarea required name="message" minLength="10" placeholder="Tell me a little about it..." /></label><button className="button button-primary" type="submit" disabled={formState === 'sending'}>{formState === 'sending' ? 'Sending...' : formState === 'success' ? <>Message sent <Check size={17} /></> : <>Send message <Send size={16} /></>}</button><AnimatePresence>{formState === 'error' && <motion.p className="form-status error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Something went wrong. Please try again.</motion.p>}</AnimatePresence></form></div></div></section>
      </main>
      <footer className="footer"><div className="content-wrap footer-inner"><div><a className="brand" href="#top">AA<span>.</span></a><p>Travel &amp; Tourism Management</p></div><div className="footer-nav">{navItems.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</div><button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}>Back to top <ArrowUpRight size={15} /></button><small>© 2026 Aditya Adhikari</small></div></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
