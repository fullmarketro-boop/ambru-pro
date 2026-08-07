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

/* ---------- Cursor spotlight on segments ---------- */
function initSpotlights() {
  if (reducedMotion || !pointerQuery.matches) return

  const spots = document.querySelectorAll('[data-spotlight]')
  if (!spots.length) return

  spots.forEach((el) => {
    if (!el.querySelector(':scope > .spot-glow')) {
      const glow = document.createElement('span')
      glow.className = 'spot-glow'
      glow.setAttribute('aria-hidden', 'true')
      el.prepend(glow)
    }

    const onMove = (event) => {
      const rect = el.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      el.style.setProperty('--spot-x', `${x}%`)
      el.style.setProperty('--spot-y', `${y}%`)
      el.classList.add('is-spot-on')
    }

    const onLeave = () => {
      el.classList.remove('is-spot-on')
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerenter', onMove)
    el.addEventListener('pointerleave', onLeave)
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
    if (progress) gsap.set(progress, { scaleY: 1 })
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

  if (progress) {
    gsap.set(progress, { scaleY: 0, transformOrigin: 'top center' })
    gsap.to(progress, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: timeline,
        start: 'top 72%',
        end: 'bottom 38%',
        scrub: 0.45,
        onUpdate: (self) => {
          const idx = Math.min(
            items.length - 1,
            Math.floor(self.progress * items.length + 0.001),
          )
          activate(idx)
        },
        onLeave: () => activate(items.length - 1),
        onLeaveBack: () => activate(-1),
      },
    })
  } else {
    items.forEach((item, index) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 72%',
        onEnter: () => activate(index),
        onEnterBack: () => activate(index),
      })
    })
  }

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
  const section = document.getElementById('process')
  const board = document.querySelector('[data-process]')
  const progress = document.querySelector('[data-process-progress]')
  const steps = gsap.utils.toArray('[data-process-step]')
  const ghost = document.querySelector('[data-process-ghost]')

  if (!board || !steps.length) return

  initProcessProof()

  if (reducedMotion) {
    steps.forEach((step) => step.classList.add('is-active'))
    if (progress) gsap.set(progress, { scaleX: 1, scaleY: 1 })
    return
  }

  const activate = (index) => {
    steps.forEach((step, i) => {
      step.classList.toggle('is-active', i <= index)
    })
  }

  const desktop = window.matchMedia('(min-width: 900px)')
  let progressTween

  const applyProgress = () => {
    progressTween?.scrollTrigger?.kill()
    progressTween?.kill()
    if (!progress) return

    const prop = desktop.matches ? 'scaleX' : 'scaleY'
    const origin = desktop.matches ? 'left center' : 'top center'
    const other = desktop.matches ? 'scaleY' : 'scaleX'

    gsap.set(progress, {
      [prop]: 0,
      [other]: 1,
      transformOrigin: origin,
    })

    progressTween = gsap.to(progress, {
      [prop]: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section || board,
        start: 'top 68%',
        end: 'bottom 42%',
        scrub: 0.45,
        onUpdate: (self) => {
          const idx = Math.min(
            steps.length - 1,
            Math.floor(self.progress * steps.length + 0.001),
          )
          activate(idx)
        },
        onLeave: () => activate(steps.length - 1),
        onLeaveBack: () => activate(-1),
      },
    })
  }

  applyProgress()
  desktop.addEventListener('change', () => {
    applyProgress()
    ScrollTrigger.refresh()
  })

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

/* ---------- Spectacular operating principle ---------- */
function initProcessProof() {
  const proof = document.querySelector('[data-process-proof]')
  if (!proof) return

  const media = proof.querySelector('[data-proof-media]')
  const img = proof.querySelector('[data-proof-img]')
  const scan = proof.querySelector('[data-proof-scan]')
  const ring = proof.querySelector('[data-proof-ring]')
  const fill = proof.querySelector('[data-proof-fill]')
  const verbs = gsap.utils.toArray('[data-proof-verb]', proof)
  const chips = gsap.utils.toArray('[data-proof-chip]', proof)
  const huds = gsap.utils.toArray('[data-proof-hud]', proof)
  const nodes = gsap.utils.toArray('.proof-transfer-node', proof)

  if (reducedMotion) {
    proof.classList.add('is-lit')
    verbs.forEach((el) => el.classList.add('is-on'))
    chips.forEach((el) => el.classList.add('is-on'))
    huds.forEach((el) => el.classList.add('is-on'))
    nodes.forEach((el) => el.classList.add('is-on'))
    if (fill) gsap.set(fill, { scaleX: 1 })
    return
  }

  const setStage = (stage) => {
    verbs.forEach((el, i) => el.classList.toggle('is-on', i <= stage))
    chips.forEach((el, i) => el.classList.toggle('is-on', i <= stage))
    huds.forEach((el, i) => el.classList.toggle('is-on', i <= stage))
    nodes.forEach((el, i) => el.classList.toggle('is-on', i <= stage + 1))
  }

  ScrollTrigger.create({
    trigger: proof,
    start: 'top 82%',
    onEnter: () => proof.classList.add('is-lit'),
    onLeaveBack: () => {
      proof.classList.remove('is-lit')
      setStage(-1)
    },
  })

  if (fill) {
    gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' })
    gsap.to(fill, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: proof,
        start: 'top 78%',
        end: 'center 42%',
        scrub: 0.45,
        onUpdate: (self) => {
          const stage = Math.min(2, Math.floor(self.progress * 3 + 0.001))
          setStage(stage)
        },
        onLeave: () => setStage(2),
        onLeaveBack: () => setStage(-1),
      },
    })
  } else {
    ;[0, 1, 2].forEach((stage) => {
      ScrollTrigger.create({
        trigger: proof,
        start: `top ${72 - stage * 10}%`,
        onEnter: () => setStage(stage),
        onEnterBack: () => setStage(stage),
      })
    })
  }

  if (img) {
    gsap.fromTo(
      img,
      { scale: 1.14, yPercent: -4 },
      {
        scale: 1.02,
        yPercent: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: proof,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  }

  if (scan) {
    gsap.fromTo(
      scan,
      { x: '-30%', opacity: 0 },
      {
        x: '320%',
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: proof,
          start: 'top 80%',
          end: 'center 35%',
          scrub: 0.4,
        },
      },
    )
  }

  if (ring) {
    gsap.fromTo(
      ring,
      { opacity: 0, scale: 0.7, rotate: -20 },
      {
        opacity: 0.9,
        scale: 1,
        rotate: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: media || proof,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      },
    )

    gsap.to(ring, {
      rotate: 120,
      ease: 'none',
      scrollTrigger: {
        trigger: proof,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }

  gsap.from(proof.querySelector('[data-proof-copy]'), {
    opacity: 0,
    y: 36,
    duration: 0.95,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: proof,
      start: 'top 84%',
      toggleActions: 'play none none reverse',
    },
  })
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
  initSpotlights()
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

boot()
