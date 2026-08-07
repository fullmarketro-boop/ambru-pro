import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const mobileQuery = window.matchMedia('(max-width: 767px)')
const pointerQuery = window.matchMedia('(pointer: fine)')

const video = document.getElementById('scroll-video')
const portrait = document.querySelector('.media-portrait')
const header = document.querySelector('.site-header')
const year = document.getElementById('year')
const navToggle = document.querySelector('.nav-toggle')
const mobileNav = document.getElementById('mobile-nav')
const form = document.getElementById('contact-form')
const formSuccess = document.getElementById('form-success')
const cursorGlow = document.querySelector('.cursor-glow')

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

function readScroll() {
  if (lenis && typeof lenis.scroll === 'number') return lenis.scroll
  return window.scrollY || document.documentElement.scrollTop || 0
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

/* ---------- Video scrub + portrait layer ---------- */
async function prepareVideo() {
  if (!video) return false

  video.pause()
  video.muted = true
  video.playsInline = true

  try {
    if (video.readyState < 1) {
      await new Promise((resolve, reject) => {
        const onLoaded = () => {
          cleanup()
          resolve()
        }
        const onError = () => {
          cleanup()
          reject(new Error('video failed'))
        }
        const cleanup = () => {
          video.removeEventListener('loadedmetadata', onLoaded)
          video.removeEventListener('error', onError)
        }
        video.addEventListener('loadedmetadata', onLoaded)
        video.addEventListener('error', onError)
        video.load()
      })
    }
  } catch {
    return false
  }

  try {
    video.currentTime = 0.01
  } catch {
    /* ignore */
  }

  return Boolean(video.duration)
}

function initMediaLayers() {
  // Portrait stays visible in hero, soft-fades as you scroll so video remains the living background
  const syncPortrait = (scrollY) => {
    if (!portrait) return
    const fadeRange = Math.max(window.innerHeight * 0.95, 500)
    const progress = Math.min(Math.max(scrollY / fadeRange, 0), 1)
    const opacity = 1 - progress * 0.92
    const shiftY = scrollY * 0.035
    const scale = 1.06 + progress * 0.03
    portrait.style.opacity = String(opacity)
    portrait.style.transform = `translate3d(0, ${shiftY}px, 0) scale(${scale})`
  }

  syncPortrait(readScroll())

  if (lenis) {
    lenis.on('scroll', ({ scroll }) => syncPortrait(scroll))
  }
  window.addEventListener('scroll', () => syncPortrait(readScroll()), { passive: true })

  // Video scrub on desktop; on mobile keep poster frame of video paused
  const enableScrub = Boolean(video) && !reducedMotion && !mobileQuery.matches

  prepareVideo().then((ok) => {
    if (!ok || !video) return

    if (!enableScrub) {
      try {
        video.currentTime = 0
      } catch {
        /* ignore */
      }
      return
    }

    const duration = video.duration

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.7,
      onUpdate: (self) => {
        const t = self.progress * duration
        if (Number.isFinite(t)) {
          video.currentTime = Math.min(duration - 0.05, Math.max(0, t))
        }
      },
    })
  })
}

/* ---------- Scroll-linked marquee ---------- */
function initMarqueeScroll() {
  const track = document.querySelector('.marquee-track')
  if (!track) return

  let loop = 1

  const measure = () => {
    loop = Math.max(track.scrollWidth / 2, 1)
  }

  const applyX = (scrollY) => {
    measure()
    // Scroll down → left; scroll up → right
    let x = Number(scrollY) * -0.7
    x = ((x % loop) + loop) % loop
    track.style.transform = `translate3d(${x}px, 0, 0)`
  }

  requestAnimationFrame(() => {
    measure()
    applyX(readScroll())
  })

  if (lenis) {
    lenis.on('scroll', ({ scroll }) => applyX(scroll))
  }

  window.addEventListener('scroll', () => applyX(readScroll()), { passive: true })
  window.addEventListener(
    'resize',
    () => {
      measure()
      applyX(readScroll())
    },
    { passive: true },
  )
}

/* ---------- Premium service cards ---------- */
function initServiceCards() {
  const cards = document.querySelectorAll('[data-service]')
  if (!cards.length) return

  // Entrance
  if (!reducedMotion) {
    gsap.from(cards, {
      opacity: 0,
      y: 42,
      duration: 0.95,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.service-stage',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })
  }

  if (reducedMotion || !pointerQuery.matches || mobileQuery.matches) return

  cards.forEach((card) => {
    const onMove = (event) => {
      const rect = card.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5
      gsap.to(card, {
        rotateY: px * 6,
        rotateX: -py * 6,
        y: -6,
        transformPerspective: 800,
        transformOrigin: 'center',
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const onLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    card.addEventListener('pointermove', onMove)
    card.addEventListener('pointerleave', onLeave)
  })
}

/* ---------- Premium scroll timeline ---------- */
function initTimeline() {
  const section = document.getElementById('expertise')
  const timeline = document.querySelector('[data-timeline]')
  const progress = document.querySelector('[data-timeline-progress]')
  const items = gsap.utils.toArray('[data-timeline-item]')
  const ghost = document.querySelector('[data-year-ghost]')

  if (!section || !timeline || !items.length) return

  if (reducedMotion) {
    items.forEach((item) => item.classList.add('is-active'))
    if (progress) progress.style.height = '100%'
    return
  }

  const activate = (index) => {
    items.forEach((item, i) => {
      item.classList.toggle('is-active', i <= index)
    })
    const year = items[Math.max(index, 0)]?.dataset.year || '2006'
    if (ghost) {
      ghost.textContent = year
      gsap.fromTo(
        ghost,
        { opacity: 0.02, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' },
      )
    }
  }

  items.forEach((item, index) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 72%',
      end: 'bottom 45%',
      onEnter: () => activate(index),
      onEnterBack: () => activate(index),
    })
  })

  if (progress) {
    gsap.fromTo(
      progress,
      { height: '0%' },
      {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 70%',
          end: 'bottom 35%',
          scrub: 0.55,
        },
      },
    )
  }

  // Soft parallax on the ghost year
  if (ghost) {
    gsap.to(ghost, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }
}

/* ---------- Premium process loop ---------- */
function initProcess() {
  const board = document.querySelector('[data-process]')
  const progress = document.querySelector('[data-process-progress]')
  const steps = gsap.utils.toArray('[data-process-step]')
  const ghost = document.querySelector('[data-process-ghost]')

  if (!board || !steps.length) return

  if (reducedMotion) {
    steps.forEach((step) => step.classList.add('is-active'))
    if (progress) {
      progress.style.width = '100%'
      progress.style.height = '100%'
    }
    return
  }

  const activate = (index) => {
    steps.forEach((step, i) => {
      step.classList.toggle('is-active', i <= index)
    })
  }

  steps.forEach((step, index) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 78%',
      end: 'bottom 40%',
      onEnter: () => activate(index),
      onEnterBack: () => activate(index),
    })
  })

  if (progress) {
    const desktop = window.matchMedia('(min-width: 900px)')
    let progressTween

    const applyProgress = () => {
      progressTween?.scrollTrigger?.kill()
      progressTween?.kill()

      if (desktop.matches) {
        gsap.set(progress, { height: '100%', width: '0%' })
        progressTween = gsap.to(progress, {
          width: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: board,
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: 0.55,
          },
        })
      } else {
        gsap.set(progress, { width: '100%', height: '0%' })
        progressTween = gsap.to(progress, {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: board,
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: 0.55,
          },
        })
      }
    }

    applyProgress()
    desktop.addEventListener('change', applyProgress)
  }

  if (ghost) {
    gsap.to(ghost, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '#process',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }
}

/* ---------- Premium benefits bento ---------- */
function initBenefits() {
  const cards = gsap.utils.toArray('[data-benefit]')
  if (!cards.length) return

  const meterTargets = [92, 78, 84, 90, 76, 88, 74, 86]

  if (reducedMotion) {
    cards.forEach((card, index) => {
      const meter = card.querySelector('.benefit-meter span')
      if (meter) meter.style.width = `${meterTargets[index] || 80}%`
    })
    return
  }

  cards.forEach((card, index) => {
    const meter = card.querySelector('.benefit-meter span')

    gsap.from(card, {
      opacity: 0,
      y: 28,
      duration: 0.85,
      delay: (index % 4) * 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none',
        onEnter: () => {
          card.classList.add('is-lit')
          if (meter) {
            gsap.to(meter, {
              width: `${meterTargets[index] || 80}%`,
              duration: 1.05,
              ease: 'power3.out',
              overwrite: 'auto',
            })
          }
          window.setTimeout(() => card.classList.remove('is-lit'), 1000)
        },
      },
    })
  })

  if (!pointerQuery.matches || mobileQuery.matches) return

  cards.forEach((card) => {
    const onMove = (event) => {
      const rect = card.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5
      gsap.to(card, {
        rotateY: px * 5,
        rotateX: -py * 5,
        y: -5,
        transformPerspective: 900,
        transformOrigin: 'center',
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const onLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    card.addEventListener('pointermove', onMove)
    card.addEventListener('pointerleave', onLeave)
  })
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
  initMediaLayers()
  initServiceCards()
  initTimeline()
  initProcess()
  initBenefits()
}

boot()
