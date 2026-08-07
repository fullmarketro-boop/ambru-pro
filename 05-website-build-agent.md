# 05-website-build-agent.md

Read and follow these files from the current working folder:

1. brand-kit.md
2. 04-website-build-rules.md
3. image-prompts.md if present
4. video-prompts.md if present

Also use these media files if they already exist:

- brand-hero-reference.png
- brand-material-reference.png
- brand-workspace-reference.png
- brand-scroll-background.mp4

Your task is to build the website only.

Important:
- Do not generate images.
- Do not generate videos.
- Do not create branding from scratch if brand-kit.md already exists.
- Do not ignore the website build rules.
- Do not create unnecessary subfolders.
- Keep the structure as flat as possible unless the chosen framework requires minimal internal organization.
- Treat the supplied media files as finalized external assets.

The website must:
- follow the brand kit exactly
- follow the website build rules exactly
- preserve the established identity, tone, visual mood, typography, and color system
- use the provided media assets consistently
- remain premium, polished, responsive, and readable

Build a complete landing page with these sections unless the brand kit defines a stronger custom section flow:

1. Hero
2. Intro / Impact Statement
3. Product or Service Showcase
4. Key Features
5. Design / Materials
6. Audience / Use Cases
7. Specs / Performance or Proof
8. CTA
9. Footer

Technical requirements:
- Use Vite
- Use vanilla JavaScript unless another framework is explicitly requested
- Use GSAP and ScrollTrigger for motion behavior
- Use Lenis where appropriate
- If a video exists, use it as a fixed cinematic background with scroll scrubbing
- If no video exists, create a strong static-image version that still feels premium
- Keep text readable at all times
- Add setup and preview instructions in a README

Output requirement:
Create the website files needed to run locally, using the current working folder as the main workspace.
