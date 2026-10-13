# CHANNEL-SPECS — CETI.AI animated explainers
Compiled 2026-10-07/08. Every spec is date-stamped to its source fetch. Confidence tags: [V] = stated by platform/standards body or consistent across sources; [S] = single secondary (blog/vendor) source, re-verify before a launch; [P] = practitioner opinion; [U] = unsourced/unverified claim, do not rely on.
Caveat: LinkedIn Help and facebook.com help pages blocked automated fetch (robots.txt), so no first-party LinkedIn/Meta page was read directly. Platform specs below come from secondary guides; re-check in the native uploader before a campaign.

## 1. SPEC TABLE (one page)

| Channel x format | Canvas px / aspect | Safe area | Duration | File limits | Captions | Hook window | CTA position |
|---|---|---|---|---|---|---|---|
| IG Reel | 1080x1920, 9:16 (min 720 w) | Keep key content inside ~950x980 centre: top 14% (~270px) clear, bottom 35% (~670px) clear, right rail ~21% (~230px), sides 6% (~65px). Grid shows 3:4 centre crop (loses 240px top and bottom) so cover text must live in y 240-1680 | 15-60s explainers [P]; up to 3 min in-app, longer uploads allowed [S] | 4 GB, MP4/MOV, H.264 + AAC [S] | Burn in (open) captions; IG auto-captions optional, keep inside safe area | 0-3s | Last 2-3s on-frame in upper-middle (above bottom 35%), plus caption/pinned comment |
| IG feed carousel | 1080x1350, 4:5 (also 1:1 1080x1080; 3:4 1080x1440 now shown in grid) | 60px margin; grid crops to 3:4 so 4:5 loses ~ 5% top/bottom of height in grid | Up to 20 slides; mixed photo + video; video slides up to 60s [S] | 30 MB image, 4 GB video [S] | Alt text per slide in Advanced settings; caption up to 2,200 chars [V-common] | Slide 1 = hook; slide 2 = payoff teaser | Final slide + caption line 1-2 |
| IG Story | 1080x1920, 9:16 | Top ~250px and bottom ~250-340px clear for UI/reply bar [S/P] | Up to 60s per segment (auto-split) [S] | 4 GB | Burn in | 0-2s | Mid-frame; use link sticker above bottom UI |
| LinkedIn document (PDF carousel) | 1080x1350 (4:5 portrait, recommended for mobile) or 1080x1080; avoid 16:9 on mobile | 80px margin; min body text ~ 36px at 1080 wide | 5-12 pages is a common range [P]; hard max 300 pages | 100 MB; PDF (PPTX/DOCX also accepted and converted) [S x3 consistent] | Title field + post text; PDF text is not read by screen readers well, put summary in post | Page 1 = headline + promise; first 2 lines of post text before "see more" | Last page CTA + post text; first comment link [P] |
| LinkedIn native video, vertical | 1080x1920, 9:16 (max 1080x1920) | Keep key content in centre 4:5 area (feed crops) [P] | 30-90s best [S]; 3s-10min allowed | 75 KB-5 GB, MP4/MOV [S] | Upload .SRT on desktop (closed captions) AND burn in for silent autoplay | 0-3s | Final card + post text |
| LinkedIn native video, landscape/square | 1920x1080 16:9 or 1080x1080 1:1 / 1080x1350 4:5 | 5% title-safe margin | 30-120s [P] | as above | as above | 0-3s | as above |
| LinkedIn image post | 1200x627 (1.91:1) link/preview; 1080x1350 or 1080x1080 for native image | 60px margin | n/a | ~5 MB images [S] | Alt text field on upload | Image must read at thumbnail size | Post text |
| LinkedIn article / newsletter cover | Article cover 1200x644 (~1.86:1) [S]; newsletter cover ~1280x720 [U-not confirmed in fetched sources] | Centre 80% | n/a | ~ 5 MB | Alt text | n/a | Subscribe button + end of article |
| LinkedIn link preview (OG) | 1200x627 (1.91:1) | Centre 80% (crop varies) | n/a | ~5 MB | og:image:alt | n/a | n/a |
| Email newsletter (Substack/Beehiiv/generic) | Hero 1200x630 (Beehiiv thumbnail) / Substack post header 1500x1000 (3:2); inline images exported at 1200-1400 px wide, displayed at 600-640 px (2x retina) | 24px side padding in a 600px body; live text for key offer | GIF/loop 3-6s, stop within 5s ideal | GIF: Beehiiv <5 MB, Substack cover GIF <=5 MB [S]; aim <1 MB for mobile [S]; HTML <102 KB to avoid Gmail clip (images not counted) | No captions possible: burn text in frame; live-text summary beside it; alt text on every image | Frame 1 of GIF must stand alone (Outlook desktop may show only frame 1) | Button/link directly under the GIF + again at end |
| Email video | Poster frame (PNG/JPG, 600-640 wide) with play-button overlay, linked to hosted page | n/a | any | n/a | Captions on the landing page player | Poster is the hook | Poster click = CTA |
| Blog / site | OG image 1200x630 (1.91:1, <5 MB typical); inline video 16:9 1920x1080 MP4/WebM H.264, muted autoplay loop with controls | OG: keep text inside centre 1000x500 | Inline 15-90s | OG <=~ 1-5 MB (platform dependent) [S] | WebVTT track, transcript below, `og:image:alt`, `<img alt>`, `prefers-reduced-motion` honoured | Poster frame + H1 | Below video + end of post |

Derived rules for the p5 explainer pipeline:
- Master at 1080x1920, 30 fps (60 only if motion warrants). Safe-box overlay for Reels: x 65-1015 (right rail pulls it in to ~x 850 for text near the bottom), y 270-1250. Keep all essential text + CTA inside y 270-1250.
- Derive 4:5 (1080x1350) and 1:1 (1080x1080) reframes as separate layouts in p5, do not letterbox; cover frame for Reels must survive a 3:4 (1080x1440) centre crop AND a 1:1 centre crop (1080x1080 = y 420-1500).
- Always export: MP4 (H.264, AAC, yuv420p, faststart), burned-in captions version, separate .srt, a poster PNG, and a <=1 MB, 600-640 px GIF (or APNG) for email.

## 2. INSTAGRAM (checked 2026-10-07)

- Reels: 9:16, 1080x1920, min 720 px wide, 4 GB max; length up to 3 min in-app, uploads up to 15 min (some accounts 20 min) per Hopper HQ (2026) [S]. Older/other guides say 90s cap on some accounts: treat 90s as the planning ceiling for explainers.
- Safe zones (Meta percentages converted to px on 1080x1920) [S, Meta-derived]: top 14% (~270px), bottom 35% (~670px; 40% if disclaimer), bottom-right 40% (~770px), action rail = right-most 21% (~230px), sides 6% (~65px). Centre safe area about 950x980. Source says Meta ads Reels guidance; organic overlays (username, caption, audio, buttons) are comparable.
- Grid: Instagram switched profile grid thumbnails from squares to 3:4 (1080x1440) in January 2025 [S: Hopper HQ]. A 1080x1920 cover loses 240px top and bottom. Feed posts at 4:5 are cropped to 3:4 in the grid. No separate 2026 grid change found.
- Carousel: up to 20 slides (rolled out from Aug 2024) [S: PostNitro]; photos, videos or a mix; video slides up to 60s [S]; aspect options 1:1, 1.91:1, 4:5 (3:4 supported in newer app per Hopper, not confirmed by PostNitro) — use 4:5 1080x1350 as default; 30 MB/image.
- Ranking (Mosseri, Jan 2025, relayed by PostEverywhere 2026-05-29 [S]): watch time, likes per reach, sends per reach. "Sends 3-5x likes" [U]. "1.7s stay-or-scroll from Meta internal data" [U]. "60%+ retention past 3s is strong" [U]. Reel length "sweet spot 15-90s" [U, internally inconsistent in source].
- Alt text: set in Advanced Settings per image/carousel slide [V-common knowledge; not re-fetched]. Reels: no alt text; accessibility = burned-in captions + caption text.
- Audio: on-platform trending audio is a distribution lever [P]; for B2B explainers, original voiceover/music is safe; keep a captions-first design since many view muted.

## 3. LINKEDIN (checked 2026-10-07)

- Document posts: 300 pages max, 100 MB max, PDF/PPTX/DOCX accepted; recommended 1080x1080 or 1080x1350, 72-150 DPI (Carouselli, 2026-04-03 [S]; SocialPilot 2026 FAQ confirms 100 MB / 300 pages [S]).
- Video: feed 16:9 or 2.35:1 (long-form); short-form vertical 9:16 up to 1080x1920; 75 KB-5 GB; 3s-10min; 30-90s best for engagement [S: Kapwing]. Ads: 16:9/1:1/9:16, up to 200 MB, 3s-30min, <30s loops [S: Kapwing, SocialPilot]. Mobile ~60% of LinkedIn traffic; ~13% rotate phone for horizontal video [S: Kapwing].
- Captions: auto-captions have limited styling; closed captions via .SRT upload on desktop; open (burned-in) captions give full styling but can't be toggled [S: Kapwing].
- Images/links: article cover 1200x644; link preview 1200x627; single-image ad 1200x627 (5 MB); carousel ad card 1080x1080 (10 MB) [S: SocialPilot 2026]. Newsletter cover size not confirmed in any fetched source: verify in LinkedIn's newsletter creation UI before design [U].
- "See more" cutoff: ~140 characters on mobile, ~210 on desktop (ViralBrain 2026-06-27; author's own statement) [S/P]. Write the hook inside 140 chars.
- What performs: dwell time is described as a ranking signal (Carouselli, 2026-03-20; cites unnamed "engineering blog posts") [S]. Carouselli's numbers (3.2x reach, 4.1% engagement, 18-35s dwell, 6-8 slide optimum, saves/shares weights) have no named source or sample and the vendor sells carousel software: treat as [U]. [P] Practical consensus: 6-10 page documents, one idea per page, big type, hook on page 1, payoff promised on page 2, CTA last page.

## 4. EMAIL / NEWSLETTER (checked 2026-10-07)

- Width: build to 600-640 px body; export images at 2x (1200-1280 px) and set width="600" with `display:block; width:100%; max-width:600px; height:auto; border:0` [S: Warmy]. Beehiiv thumbnail 1200x630, banner 1500x500; Substack post header 1500x1000 (3:2), cover 1080x1080 [S: MergeImages]. Header images <200 KB, banners <500 KB as a guideline [S].
- GIF size: Beehiiv says keep GIFs <5 MB (and short); Substack animated cover up to 5 MB; practical target <1 MB (Litmus tests quoted by Warmy: 1 MB ~1.18 s on 4G, 3.2 MB ~2.87 s, "too heavy for mobile") [S]. Max 256 colours/frame: flat-colour p5 art compresses well; reduce frames/fps (8-12 fps), dither off.
- Gmail clipping: emails clip when HTML exceeds ~102 KB (Beehiiv help, Mailchimp via Warmy); image bytes are not counted, so host GIFs/images externally, keep markup lean [S, consistent across 3 vendors].
- Outlook desktop (Word engine): historically shows animated GIF first frame only; Microsoft says Outlook 2016+ plays animation unless the Windows animation setting is off. Make frame 1 a complete message, or serve a static PNG via `<!--[if mso]>` [S: Warmy].
- Client support: Gmail, Apple Mail, Yahoo, Outlook web/Mac/mobile play GIFs; no JavaScript, no reliable `<video>` autoplay in most clients: use a GIF/APNG or a poster image with play overlay linked to a hosted page [S; also general knowledge].
- Dark mode (Litmus): avoid pure #FFF on #000; full-invert clients include Outlook 2021 Win, Gmail iOS app, Office 365 Win, Windows Mail; partial: Outlook.com, Outlook mobile, Gmail Android; no change: Apple Mail, Gmail desktop, Yahoo. Use transparent PNG with light translucent outline/glow on dark text; or put art on a solid mid-tone background shape; prefers-color-scheme image swap works only in some clients [S: Litmus, undated].
- Alt text: describe what the animation communicates, same wording on static fallback; keep key offer in live HTML text; screen readers read only alt; images are often blocked by default [S: Warmy, Beehiiv].
- Accessibility: WCAG 2.2 SC 2.2.2 (Level A): auto-starting moving content lasting >5 s needs pause/stop/hide; SC 2.3.1: no more than 3 flashes per second [V: W3C Understanding doc, fetched 2026-10-07]. In email, cap loops at ~5 s or provide a static alternative.

## 5. BLOG (checked 2026-10-07)

- OG image 1200x630 (1.91:1) is the de-facto standard (also Beehiiv thumbnail spec); LinkedIn link preview uses 1200x627, so design 1200x630 with a centre-safe region that survives a 1200x627 crop [S].
- Open Graph protocol: if og:image is given, also provide og:image:alt (describe content, not caption); og:image:width/height/type recommended; first og:image wins on conflicts [V: ogp.me, fetched 2026-10-07].
- Inline video/GIF: prefer `<video muted loop playsinline autoplay>` with MP4 (H.264) + WebM fallback and a poster; GIF only for tiny loops (they are 5-10x heavier). Provide WebVTT captions, transcript, `aria-label`, pause control for loops >5 s (WCAG 2.2.2), and honour `prefers-reduced-motion` (swap to poster) [V for WCAG; P for implementation].

## 6. HOOK SCIENCE (short video + carousels)

Evidence (graded):
- Sound-off share: Digiday, 2016-05-17 (Sahil Patel): publishers (LittleThings, Mic) report ~85% of Facebook video views silent; PopSugar 50-80%; MEC clients 85-90% for branded video. Facebook counts a view at 3 s. MEC found brand lift/purchase intent unaffected by sound on/off. [V as reported by publishers; Facebook-only, 2016, news feed, not Reels/LinkedIn; do not generalise to 2026 Reels where sound-on is far more common].
- Captions raise completion ("80% more likely to watch to completion", "37% turn sound on"): cited in Bytecap blog with no study named [U]. Its own caveat: much of this research is self-reported or single-publisher.
- First 3 seconds: Instagram has publicly emphasised watch time as the top signal (Mosseri, Jan 2025, secondhand) [S]. Specific "1.7 s" and "60% past 3 s" thresholds are uncited [U]. The 3 s mark matters as platform view-count threshold on Facebook [V via Digiday].
- LinkedIn dwell time / carousel multipliers: vendor-sourced, unverifiable [U].

Practitioner rules [P] (consistent with the weak evidence above, none rigorously proven):
1. Open on the finished payoff or the surprising claim in frame 1; no logo bumper, no title card longer than 1 s.
2. Pattern interrupt in 0-3 s: a state change (shape morph, camera push, colour inversion) plus on-screen text of <=7 words that states the stakes.
3. Design for silent: every spoken idea also appears as burned-in text; audio is additive.
4. Retention loop: end the video on a frame that flows into frame 1 (loops raise watch time / replays).
5. Length: explainers 20-45 s for Reels and LinkedIn vertical (completion falls with length; 30-90 s LinkedIn range per Kapwing); 45-90 s only if there is a mid-video re-hook every ~8-10 s; email GIF 3-6 s; carousel/doc 6-10 slides.
6. Carousel/doc covers: slide 1 states the outcome in <=8 words with large type and a "swipe" affordance; slide 2 delivers the first concrete payoff (not context) so swiping is rewarded; one idea per slide; progress cue (n/N); last slide single CTA. Keep slide 1 readable at thumbnail size and legible in a 3:4 grid crop.
7. Post text hook: strongest sentence in first 140 chars (LinkedIn mobile cutoff), first 125 chars for IG caption preview [P].
8. CTA: spoken/visual CTA in last 2-3 s inside the safe box; a single action (comment keyword / link in first comment / newsletter link); sends/shares are the IG distribution signal, so craft shareable "send this to your team" end cards.

## 7. TO RE-VERIFY BEFORE PUBLISHING (open items)
- LinkedIn newsletter cover size and any current document-post size guidance (first-party page blocked).
- Meta first-party Reels safe-zone numbers (page blocked); px values above come from Hopper HQ's conversion.
- Instagram 3:4 feed/carousel upload (grid is 3:4 since Jan 2025 per Hopper; PostNitro lists only 1:1, 1.91:1, 4:5).
- Reels max length for the CETI account type.
- Any current-year study on muted viewing for Reels and LinkedIn (only 2016 Facebook data was verified).

## SOURCES (URL | fetched | taken)
1. https://www.hopperhq.com/blog/instagram-reel-size/ | 2026-10-07 | Reels 1080x1920, 4 GB, length, safe-zone %/px, grid 3:4 switch Jan 2025, cover crop 240px.
2. https://postnitro.ai/blog/post/instagram-carousel-limit-20-photos-per-post-guide | 2026-10-07 | 20 slides (Aug 2024), mixed media, 60 s video slides, 30 MB/4 GB.
3. https://posteverywhere.ai/blog/how-the-instagram-algorithm-works | 2026-10-07 (page dated 2026-03-23, upd. 2026-05-29) | Mosseri Jan 2025 signals (secondhand); flagged unverified numbers.
4. https://carouselli.com/blog/linkedin-carousel-pdf | 2026-10-07 (page 2026-04-03) | LinkedIn doc 300 pages, 100 MB, PDF/PPTX/DOCX, 1080x1080 / 1080x1350.
5. https://socialpilot.co/blog/linkedin-post-sizes-guide | 2026-10-07 | article cover 1200x644, link preview 1200x627, ad sizes, doc FAQ limits.
6. https://www.kapwing.com/resources/linkedin-video-size-guide-aspect-ratios-resolution-length-and-best-practices-3/ | 2026-10-07 | LinkedIn video aspect/res/length, SRT upload, open vs closed captions, 60% mobile.
7. https://carouselli.com/blog/linkedin-algorithm-carousels | 2026-10-07 (page 2026-03-20) | dwell-time claim; all numbers flagged unsourced.
8. https://www.viralbrain.ai/blog/ideal-linkedin-post-length | 2026-10-07 (page 2026-06-27) | See-more cutoff 140 mobile / 210 desktop.
9. https://www.warmy.io/blog/email-best-practices/animated-gifs-in-email/ | 2026-10-07 | GIF <1 MB, Litmus timings, Outlook first-frame, 600 px markup, alt text, client table.
10. https://beehiiv.com/support/article/13007659806103-why-do-my-emails-look-different-in-outlook | 2026-10-07 | Beehiiv 1200x630 thumbnail, images <5 MB, GIFs <5 MB, Gmail 102 KB clip.
11. https://mergeimages.net/blog/newsletter-header-image-substack-beehiiv-convertkit | 2026-10-07 | Substack 1500x1000 header, 1080 cover, GIF cover 5 MB; Beehiiv banner 1500x500, GIF 4 MB.
12. https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers/ | 2026-10-07 | dark-mode client behaviour, outline/glow, avoid pure black/white.
13. https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html | 2026-10-07 | SC 2.2.2 >5 s auto-play needs pause; 3-flash threshold.
14. https://ogp.me/ | 2026-10-07 | og:image, og:image:alt, width/height.
15. https://digiday.com/media/silent-world-facebook-video/ | 2026-10-07 (article 2016-05-17) | 85% silent-view claim and caveats.
16. https://www.bytecap.io/blog/science-of-silent-viewing-short-form-video-retention | 2026-10-07 | caption-completion claims (all uncited, flagged).
Blocked (robots.txt): linkedin.com/help/linkedin/answer/a564277, a523451; facebook.com/business/help/1006043836728497.
