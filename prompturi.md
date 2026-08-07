Prompt pentru pasul 1
Folosește acest mesaj când atașezi:

01-brand-kit-agent.md

brand-kit.md

text

Read the attached file 01-brand-kit-agent.md and follow it exactly.

Important:
- Use the attached brand-kit.md as the output file to be completed.
- Ask me the required questions first, before creating anything.
- Do not generate images.
- Do not generate videos.
- Do not build the website.
- Do not create subfolders.
- Keep everything aligned with the brand information I provide.
- If something is unclear, ask before assuming.

Start now with the first required question only.
Asta se potrivește cu rolul fișierului 01-brand-kit-agent.md, care este să colecteze informațiile de brand și să producă brand-kit.md, fără imagini, video sau website în acest stadiu.

Prompt pentru pasul 2
Folosește acest mesaj când atașezi:

02-image-prompt-pack-agent.md

03-video-prompt-pack-agent.md

brand-kit.md

image-prompts.md

video-prompts.md

Pentru imagini:

text

Read the attached files 02-image-prompt-pack-agent.md and brand-kit.md.

Important:
- Use brand-kit.md as the single source of truth.
- Complete the attached image-prompts.md file.
- Do not generate any images.
- Only create a structured image prompt pack for external generation.
- Keep all prompts consistent with the brand manual.
- No real logos, no third-party marks, no baked-in text.

Write the content for image-prompts.md now.
Pentru video:

text

Read the attached files 03-video-prompt-pack-agent.md, brand-kit.md, and image-prompts.md.

Important:
- Use brand-kit.md as the single source of truth.
- Complete the attached video-prompts.md file.
- Do not generate any video.
- Only create a structured video prompt pack for external generation.
- Keep the video direction consistent with the image prompt pack and the brand manual.
- The video must be suitable for a scroll-driven website.

Write the content for video-prompts.md now.
Aceste două prompturi urmează exact separarea pe care ai vrut-o: agentul nu generează media, ci doar fișiere de prompt pentru generare externă, folosind brand kit-ul ca bază.

Prompt pentru pasul 3
Folosește acest mesaj când atașezi:

04-website-build-rules.md

05-website-build-agent.md

brand-kit.md

imaginile finale

video-ul final

text

Read and follow the attached files 04-website-build-rules.md and 05-website-build-agent.md exactly.

Also use the attached brand-kit.md and all provided media files as the only source of brand and visual direction.

Important:
- Do not generate new images.
- Do not generate new videos.
- Use the provided media as finalized external assets.
- Follow the brand kit exactly.
- Follow the website build rules exactly.
- Keep the implementation premium, readable, responsive, and structured.
- Keep the file structure as flat as possible unless the framework requires minimal internal organization.
- Include setup and preview instructions.

Build the website now.
Acest prompt reflectă atât etapa finală din workflow-ul original, cât și regulile din BRAND-landing-skill.md, unde website-ul trebuie construit pe baza brand kit-ului, a imaginilor de referință, a video-ului și a unui set strict de reguli de motion, layout și tehnologie.
10k-Website-5-Prompts.md
+1

Varianta simplă
Dacă vrei o formulă scurtă pe care s-o refolosești mereu când atașezi fișiere, folosește structura asta:

text

Read the attached files and use them in this order:
1. [main instruction file]
2. [rules file]
3. [brand or content file]
4. [supporting files]

Task:
[exactly what you want]

Important:
- [what it must do]
- [what it must not do]
- [format/output]
- [consistency rules]
- [ask before assuming]
Modelul „rol / context / sarcină / format / constrângeri” este o structură bună pentru prompturi cu fișiere atașate și te ajută să obții răspunsuri mai controlate și mai utile