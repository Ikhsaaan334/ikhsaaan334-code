# DESIGN.md

Design direction for the portfolio of Muhammad Ikhsan Nur Rafid. Every visual decision in this repo should trace back to a line here. The `antislop` rulebook is the filter applied on top of it (rules cited as R-XX).

## Reading

Reading this as: a personal portfolio for recruiters and engineers, in a bright, engineered, toy-like visual language, dial ENERGY 3 / RHYTHM 3 / MOTION 3.

## Reference

lusion.co is the only visual reference. It is used for its grammar, not copied:

- an off-white canvas with generous side margins
- very large, light-weight grotesk headlines with asymmetric line offsets
- small mono labels for metadata
- pill buttons, the one generous radius in the system
- dark, large-radius panels acting as stages for 3D and media, marked with corner crosses
- one accent colour used as material (3D objects), not as text colour

## Identity: the marble machine

A request is an orange marble rolling through a machine I built. Each section of the page is a station it passes: the hero holds the 3D machine, a 2D route line carries the marble between sections, and it is delivered at the contact panel.

Reason: it says "backend engineer who routes requests" without a terminal costume, and it belongs to this portfolio alone (R-20, R-22).

### How the machine is built

- The route is made of two kinds of piece: runs, drawn through their points, and turns of a fixed radius. A run starts and ends level, so it meets a turn without a kink, and nothing on the route ever climbs.
- A turn keeps a radius of at least 0.8. Below that the inner wall of the channel folds on itself, because the channel is 0.72 wide.
- Three routes, chosen by the shape of the stage: a tall zigzag on phones, one tall turn on tablets, one flat turn on laptops and desktops. On all of them the marble drops out of a hopper and leaves by a chute bent sixty degrees down.
- Three stations in order: a scanner ring the marble passes through, a switch whose lever flips, and a bolt drawn out of its housing before the marble arrives.
- The camera is placed against every vertex of the machine, not against a bounding box, so nothing is cut off at any point of the run.
- The page's route line takes over at the instant the marble drops out of the stage, at the same point, and waits under the stage until it is carried on.

## Palette

| Token      | Value    | Use                                                   |
| ---------- | -------- | ----------------------------------------------------- |
| canvas     | `#F4F3EF` | page background                                       |
| ink        | `#111318` | text, dark fills                                      |
| ink-soft   | `#4A4F5A` | secondary text                                        |
| line       | `#D6D5CF` | hairlines, the part of the route not travelled yet    |
| stage      | `#17191E` | 3D and contact panels                                 |
| cyan       | `#00ADD8` | machine parts. It is Go's colour, the language I reach for first |
| cyan-ink   | `#0A708C` | cyan when it has to be readable text on canvas        |
| tangerine  | `#FF6A2B` | the marble, nothing else                              |

Cores: cyan and stage charcoal. Accent: tangerine. Everything else is neutral (R-29). Tangerine never carries text on canvas: it does not reach 4.5:1 there (R-25).

## Typography

- Display and body: Bricolage Grotesque (variable). Weight 400 to 500, tight tracking at display sizes. Reason: engineered letterforms with a bit of quirk, which suits a machine that routes requests (R-06).
- Labels: DM Mono, 11 to 13px, uppercase with 0.04em tracking, reserved for metadata (periods, tags, counts). Reason: it marks technical metadata without pretending to be a terminal (R-06).

## Shape and surface

- Radii: panels 28px (20px on phones), covers 20px, tiles 14px, buttons are pills. Nothing else is rounded (R-11).
- No shadows, no blur, no glow, no background patterns (R-07, R-10, R-12, R-13). Depth comes from the lit 3D stage and from hairlines.

## Motion

- Smooth scrolling (Lenis), a pinned hero whose scroll drives the marble through the machine, headline reveals by word, pointer parallax on the stage (MOTION 3).
- Nothing loops forever. An idle scene renders a still frame. `prefers-reduced-motion` turns all of it off and leaves a complete static page (R-19, R-39).

## Theme

Light only. The dark stage panels are surfaces inside the light page, not a dark mode.

## Decisions log (R-31)

- Cyan for machine parts, not for text: `#00ADD8` is too light on canvas, so readable cyan is the darker `#0A708C`.
- Projects are split into six featured builds and a list: the strongest work comes first without scrolling past fourteen equal cards.
- The six featured cards share one size and layout because they are peers of the same rank. They differ in ground (cyan, charcoal, off-white) and in the mark they carry, and the eight smaller projects form a list, which is what gives the section its hierarchy.
- The arrow (`↗`) appears only on links that leave the site. It marks that jump; internal links never carry one.
- There is no photo on the site and no profile card (the owner's decision on 2026-11-25). A dark facts panel beside the text was tried and rejected, and nothing else was wanted in its place (2026-11-26): About's writing and fact list sit in one centered column under the headline, so neither side reads as empty.
- One bar, and it stays: the name, an email pill and a Menu button hold the top of the page from start to end. It replaced a menu button that floated over the text on phones. The route line remains the map of the page, and its station labels are a second way to jump, not a second bar.
- Light pills carry a hairline. Their fill sits too close to the canvas to be seen as a boundary on its own.
- The hero sits on the same left and right edges as the header and every other section. The page supplies the side margins once; a section that adds its own breaks the line.
- The intro beside the name starts exactly one line of the name down. When it is taller than that line, the row grows under it. The two never overlap, whatever the width.
- Every tool in the stack gets the same tile: its logo, its name, a hairline. Nothing in that list is ranked. The lead-in sentence carries the preference instead.
- The site says plainly that Ikhsan is closed to offers, in the hero, in About and on the contact panel. The panel stays, because mail, GitHub, LinkedIn and the CV are useful whatever the status.
- Small labels are monospace and uppercase because they carry metadata (dates, tags, counts). They never set a heading.
- The hero pins only where there is room for the whole machine (1024px wide, 760px tall). Below that it scrolls away and the marble runs on the way out.
