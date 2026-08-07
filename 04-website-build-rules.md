# 04-website-build-rules.md

# Product landing website rules

Before doing anything, read:

1. brand-kit.md
2. image-prompts.md if present
3. video-prompts.md if present

Also check whether these files exist in the current working folder:

- brand-hero-reference.png
- brand-material-reference.png
- brand-workspace-reference.png
- brand-scroll-background.mp4

Use the brand kit as the single source of truth for:
- brand name
- product or service name
- slogan
- brand positioning
- target audience
- website goal
- visual mood
- color palette
- typography direction
- content direction

The site must follow the brand kit exactly.
If the brand kit defines a dark, cinematic, minimal, premium direction, follow it.
If it defines another direction, follow that instead.

## Stack

Use:
- Vite
- Vanilla JavaScript ES modules, unless explicitly requested otherwise
- GSAP + ScrollTrigger
- Lenis for smooth scroll
- CSS variables for brand tokens

## Build philosophy

- Build a motion-driven landing page, not a generic static page.
- Preserve readability at all times.
- Use motion as a support layer, not as decoration without purpose.
- Start from structure and content, then add motion and polish.
- Keep the implementation elegant and maintainable.

## Media usage

If brand-scroll-background.mp4 exists:
- use it as the main full-screen fixed background layer
- make the content scroll over it
- scrub the video based on scroll position
- add tint, overlays, or gradients where needed for readability

If brand-scroll-background.mp4 does not exist:
- build the site so it still works beautifully with static imagery
- use the available reference images as visual support

If the raw video needs web optimization:
- prepare a website-ready scroll-friendly version
- prioritize smooth seeking and stable playback
- preserve the established visual direction

## Reference images

Use:
- brand-hero-reference.png as the main hero composition and visual identity reference
- brand-material-reference.png as the materials, finishes, and surface detail reference
- brand-workspace-reference.png as the audience environment and mood reference

## Suggested sections

Use the brand kit section list first.
If the brand kit does not define a custom structure, build:

1. Hero
2. Intro / Impact Statement
3. Product or Service Showcase
4. Key Features
5. Design / Materials
6. Audience / Use Cases
7. Specs / Performance or Proof
8. CTA / Pre-order / Contact
9. Footer

## Design rules

- Derive all color tokens from the brand kit
- Derive typography from the brand kit
- Keep layouts spacious, premium, and readable
- Use glass panels or cards only where they improve readability and hierarchy
- Avoid clutter
- Avoid unnecessary UI noise
- Keep the accent color controlled and intentional
- Make the site responsive
- Maintain strong contrast over media backgrounds

## Motion rules

- Motion must feel elegant, slow, and controlled
- Scroll-scrubbed video must not feel aggressive or chaotic
- Use pinned sections sparingly
- Add subtle text reveals, card transitions, and parallax only where they improve the story
- Do not over-animate
- Keep the experience premium and deliberate

## Layer logic

Maintain this general relationship:
- background media layer
- readability overlay layer
- optional subtle motion accent layer
- content layer
- optional cursor layer

The content must always remain visually dominant over decorative motion layers.

## Mobile behavior

- Provide a mobile fallback if full video scrubbing is too heavy
- Reduce or remove pinned sections on smaller screens when necessary
- Convert complex galleries to simpler stacked layouts on mobile
- Prioritize performance, readability, and touch usability
- If needed, replace background video with a poster image on mobile

## Content rules

- All website copy must come from the brand kit
- Do not invent random messaging unrelated to the established identity
- Do not bake text into images or video
- Text must be rendered in HTML/CSS
- CTA strategy must match the website goal from the brand kit

## Deliverables

Create everything needed to run the site locally.
Include a README with setup and preview instructions.
Verify that the project runs correctly.
Do not generate new media.
Use the provided brand kit and supplied media assets only.
