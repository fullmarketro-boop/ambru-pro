import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const mobileQuery = window.matchMedia('(max-width: 767px)')
const pointerQuery = window.matchMedia('(pointer: fine)')

const header = document.querySelector('.site-header')
const year = document.getElementById('year')
const navToggle = document.querySelector('.nav-toggle')
const mobileNav = document.getElementById('mobile-nav')
const form = document.getElementById('contact-form')
const formSuccess = document.getElementById('form-success')
const cursorGlow = document.querySelector('.cursor-glow')
const poster = document.querySelector('.media-poster')

if (year) year.textContent = String(new Date().getFullYear())

function closeMobileNav() {
  if (!mobileNav || !navToggle) return
  mobileNav.hidden = true
  navToggle.setAttribute('aria-expanded', 'false')
  navToggle.setAttribute('aria-label', 'Open menu')
}

navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true'
  navToggle.setAttribute('aria-expanded', String(!open))
  navToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu')
  mobileNav.hidden = open
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileNav()
})

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMobileNav)
})

/* ---------- Lenis ---------- */
let lenis = null

function initLenis() {
  if (reducedMotion) return

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

/* ---------- Cursor glow ---------- */
function initCursorGlow() {
  if (!cursorGlow || reducedMotion || !pointerQuery.matches) return

  document.body.classList.add('has-pointer')

  let x = window.innerWidth / 2
  let y = window.innerHeight / 2
  let cx = x
  let cy = y

  window.addEventListener(
    'pointermove',
    (event) => {
      x = event.clientX
      y = event.clientY
    },
    { passive: true },
  )

  gsap.ticker.add(() => {
    cx += (x - cx) * 0.08
    cy += (y - cy) * 0.08
    cursorGlow.style.left = `${cx}px`
    cursorGlow.style.top = `${cy}px`
  })
}

/* ---------- Header ---------- */
function initHeader() {
  ScrollTrigger.create({
    start: 20,
    onUpdate: (self) => {
      header?.classList.toggle('is-scrolled', self.scroll() > 20)
    },
  })
}

/* ---------- Hero intro ---------- */
function initHeroIntro() {
  if (reducedMotion) return

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from('.hero-eyebrow', { y: 24, opacity: 0, duration: 0.8 })
    .from('.brand-hero-title .line', { y: 80, opacity: 0, duration: 1.1 }, '-=0.45')
    .from('.slogan', { y: 28, opacity: 0, duration: 0.8 }, '-=0.65')
    .from('.hero-lead', { y: 24, opacity: 0, duration: 0.75 }, '-=0.55')
    .from('.cta-row', { y: 20, opacity: 0, duration: 0.7 }, '-=0.45')
    .from('.hero-aside > *', { y: 18, opacity: 0, stagger: 0.08, duration: 0.65 }, '-=0.55')
    .from('.scroll-hint', { opacity: 0, duration: 0.6 }, '-=0.3')
}

/* ---------- Reveals ---------- */
function initReveals() {
  if (reducedMotion) {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => el.classList.add('is-in'))
    return
  }

  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      onStart: () => el.classList.add('is-in'),
    })
  })

  gsap.utils.toArray('.reveal-stagger').forEach((group) => {
    gsap.to(group.children, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.09,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: group,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      onStart: () => group.classList.add('is-in'),
    })
  })
}

/* ---------- Parallax images ---------- */
function initParallax() {
  if (reducedMotion || mobileQuery.matches) return

  gsap.utils.toArray('.parallax-img').forEach((img) => {
    // Portrait crop is tight on the face — parallax would clip the head
    if (img.closest('.portrait-frame')) return

    gsap.fromTo(
      img,
      { yPercent: -4, scale: 1.04 },
      {
        yPercent: 4,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('figure, .material-stack, .audience-media') || img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  })
}

/* ---------- Hero portrait background (scroll-linked) ---------- */
function initHeroBackground() {
  if (!poster || reducedMotion) return

  const apply = (scrollY) => {
    const y = Math.min(Math.max(Number(scrollY) || 0, 0), 1400)
    const shiftY = y * 0.03
    const scale = 1.05 + Math.min(y, 900) * 0.00003
    poster.style.transform = `translate3d(0, ${shiftY}px, 0) scale(${scale})`
  }

  const readScroll = () => {
    if (lenis && typeof lenis.scroll === 'number') return lenis.scroll
    return window.scrollY || document.documentElement.scrollTop || 0
  }

  apply(readScroll())

  if (lenis) {
    lenis.on('scroll', ({ scroll }) => apply(scroll))
  }

  window.addEventListener('scroll', () => apply(readScroll()), { passive: true })
}

/* ---------- Scroll-linked marquee ---------- */
function initMarqueeScroll() {
  const track = document.querySelector('.marquee-track')
  if (!track) return

  let loop = 1

  const measure = () => {
    // Two identical groups → loop length is half the track
    loop = Math.max(track.scrollWidth / 2, 1)
  }

  const applyX = (scrollY) => {
    measure()
    // Scroll down → move right; scroll up → move left
    let x = Number(scrollY) * -0.7
    x = ((x % loop) + loop) % loop
    track.style.transform = `translate3d(${x}px, 0, 0)`
  }

  const readScroll = () => {
    if (lenis && typeof lenis.scroll === 'number') return lenis.scroll
    return window.scrollY || document.documentElement.scrollTop || 0
  }

  // Wait one frame so layout/fonts resolve scrollWidth
  requestAnimationFrame(() => {
    measure()
    applyX(readScroll())
  })

  if (lenis) {
    lenis.on('scroll', ({ scroll }) => {
      applyX(scroll)
    })
  }

  window.addEventListener(
    'scroll',
    () => {
      applyX(readScroll())
    },
    { passive: true },
  )

  window.addEventListener(
    'resize',
    () => {
      measure()
      applyX(readScroll())
    },
    { passive: true },
  )
}

/* ---------- Contact ---------- */
form?.addEventListener('submit', (event) => {
  event.preventDefault()

  const nameInput = form.elements.namedItem('name')
  const emailInput = form.elements.namedItem('email')
  const interestInput = form.elements.namedItem('interest')
  const messageInput = form.elements.namedItem('message')

  const name = String(nameInput?.value || '').trim()
  const email = String(emailInput?.value || '').trim()
  const interest = String(interestInput?.value || '').trim()
  const message = String(messageInput?.value || '').trim()

  if (!name || !email || !interest || !message) {
    formSuccess.hidden = false
    formSuccess.textContent = 'Please complete all fields before sending.'
    return
  }

  const subject = encodeURIComponent(`Ambru.pro — ${interest || 'Inquiry'}`)
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\n${message}`,
  )

  window.location.href = `mailto:contact@ambru.pro?subject=${subject}&body=${body}`
  formSuccess.hidden = false
  formSuccess.textContent =
    'Thank you. Open your email client to finish sending — or reach me on your preferred channel.'
})

/* ---------- Boot ---------- */
function boot() {
  initLenis()
  initCursorGlow()
  initHeader()
  initHeroIntro()
  initReveals()
  initParallax()
  initMarqueeScroll()
  initHeroBackground()
}

boot()
