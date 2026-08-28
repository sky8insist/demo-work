---
name: "Dayend V3"
description: "A low-stimulus late-night system where unfinished work finds a place and emotion finds a vessel."
colors:
  night-ink: "#090d0d"
  deep-surface: "#121817"
  raised-surface: "#1a2220"
  paper-cream: "#eef0e9"
  quiet-text: "#9aa7a2"
  hairline: "#2a3532"
  ember: "#efa95a"
  sage: "#94bda8"
  bottle-lilac: "#b9a7df"
  safety-coral: "#ffc2b8"
typography:
  display:
    fontFamily: "Smiley Sans, Microsoft YaHei, sans-serif"
    fontSize: "clamp(46px, 7vw, 92px)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Smiley Sans, Microsoft YaHei, sans-serif"
    fontSize: "clamp(42px, 5vw, 68px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Smiley Sans, Microsoft YaHei, sans-serif"
    fontSize: "25px"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: "Microsoft YaHei, PingFang SC, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.11em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "14px"
  panel: "16px"
  full: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.xl}"
    padding: "16px 22px 16px 25px"
    typography: "{typography.body}"
  button-option:
    backgroundColor: "{colors.deep-surface}"
    textColor: "{colors.paper-cream}"
    rounded: "{rounded.lg}"
    padding: "16px"
  button-emotion:
    backgroundColor: "{colors.bottle-lilac}"
    textColor: "#211c2c"
    rounded: "{rounded.lg}"
    padding: "14px 22px"
  input-paper:
    backgroundColor: "#e7e6dc"
    textColor: "#1d2523"
    rounded: "{rounded.panel}"
    padding: "30px 32px"
  card-map-item:
    backgroundColor: "#151c1a"
    textColor: "#bdc6c2"
    rounded: "9px"
    padding: "10px 12px"
  card-morning-bottle:
    backgroundColor: "#211d2d"
    textColor: "#eeeaf5"
    rounded: "{rounded.panel}"
    padding: "20px"
---

# Design System: Dayend V3

## Overview

**Creative North Star: "The Last-Lit Worktable"**

Dayend feels like a single worktable left under one warm light after the rest of the room has gone dark. The world is quiet, spacious, and materially specific: charcoal air, pale paper, a translucent bottle, a small spinning record, and restrained glints of ember, sage, and lilac. Large human headlines provide reassurance while compact operational labels keep the interface legible without sounding managerial.

Mechanism is the identity. Day Closure is an editorial operational workbench where one open loop is physically transferred into Done, Tomorrow, Waiting, or Release. Emotion Bottle is not a recolored form: the bottle dominates the scene and the sequence is explicitly open, pour, seal, lock, and reveal. Only the ambient record, night field, typography, and foundational palette belong to both paths.

**Key Characteristics:**

- Low-stimulus charcoal night with rare, meaningful color.
- Large soft display type paired with compact operational labels.
- Physical state change communicates progress more than explanatory chrome.
- Closure uses paper, lanes, hairlines, and transfer; Emotion uses glass, liquid, cap, and lock.
- Persistent ambient music behaves like an object in the room, not a media toolbar.

## Colors

The palette is nearly black and mineral-neutral, with each chromatic accent assigned to a specific kind of meaning.

### Primary

- **Ember Light:** The scarce warm signal for primary action, active progress, dates, status, and Tomorrow.

### Secondary

- **Quiet Sage:** Closure, completion, waiting, and successful handoff states.

### Tertiary

- **Bottle Lilac:** Emotion Bottle liquid, labels, locks, and morning reveal; it does not recolor Closure.
- **Safety Coral:** Immediate high-distress guidance only, held against a dark brown-red safety surface.

### Neutral

- **Night Ink:** The uninterrupted page ground and the darkest environmental field.
- **Deep Surface:** Recessed controls and low-contrast option surfaces.
- **Raised Surface:** Selected or slightly elevated dark controls.
- **Paper Cream:** Primary night text and the physical paper reference used by writing surfaces.
- **Quiet Text:** Supporting copy that recedes without becoming illegible.
- **Hairline:** Dividers, lanes, progress tracks, and subtle structure.

### Named Rules

**The One Warm Light Rule.** Ember marks the next meaningful action or active state; it must remain scarce enough to feel like the only lamp in the room.

**The Mechanism Color Rule.** Sage belongs to operational closure and lilac belongs to emotional containment. Do not flatten the two paths into one generic accent system.

## Typography

**Display Font:** Smiley Sans (with Microsoft YaHei and sans-serif fallbacks)
**Body Font:** Microsoft YaHei (with PingFang SC and sans-serif fallbacks)
**Label/Mono Font:** Arial (with sans-serif fallback)

**Character:** Smiley Sans gives the oversized Chinese headlines a gentle, handwritten editorial slant without becoming decorative. The system sans stack keeps input and explanation calm; Arial labels introduce precise ledger-like rhythm for counts, status, and the wordmark.

### Hierarchy

- **Display** (400, fluid 46–92px, 0.98): stage-defining questions, receipts, and completion statements; entry and countdown displays may scale beyond this base role.
- **Headline** (400, fluid 42–68px, 1.04): the current open loop and other focused mechanism prompts.
- **Title** (400, 25px, 1.35): branch questions, compact editorial statements, and bottle messages.
- **Body** (400, 17px, 1.8): explanatory copy and writing content; favor narrow measures and generous leading.
- **Label** (600, 11px, 0.11em tracking): counters, status, dates, and operational metadata, often in uppercase or compact numerals.

### Named Rules

**The Whisper and Ledger Rule.** Headlines may be large and soft; labels stay small, tracked, and exact. Avoid adding medium-weight dashboard headings between them.

## Layout

The app centers each stage inside a full-viewport night field with fixed brand and ambient controls. Main content is capped at 1180px and padded by 108px/82px vertically with a fluid 24px horizontal inset. Entry, Closure workbench, and Emotion Bottle use asymmetric two-column compositions with generous fluid gaps; the primary mechanism receives the larger visual share.

At 850px, the major two-column structures become single-column. The Closure Map moves below the interview and becomes a four-lane grid, while the bottle moves beneath its copy and capture controls. At 600px, page insets reduce to 18px, option grids collapse, the Closure Map becomes two columns, receipt totals become a 2×2 ledger, and the bottle scales to 72% without losing its silhouette. The system supports a 320px minimum viewport.

**The One Mechanism Per Field Rule.** Every stage gives one operative object—the open loop, paper sheet, map, bottle, or clock—the dominant area and leaves the rest as quiet context.

## Elevation & Depth

The system is flat by default and uses hairlines or tonal shifts for most structure. Shadows are reserved for physical objects that plausibly sit above the night field: the paper sheet, primary action, vinyl record, popover, moving loop ghost, bottle cap, and bottle glass. Ambient radial light and translucent glass create atmosphere without turning every container into a card.

### Shadow Vocabulary

- **Action Lift** (`0 15px 38px rgba(0,0,0,.28)`): primary ember action only.
- **Paper Lift** (`0 25px 80px rgba(0,0,0,.36)`): the Closure capture sheet.
- **Object Lift** (`0 30px 70px rgba(0,0,0,.34)`): the Emotion Bottle body, combined with inset glass shading.
- **Popover Lift** (`0 18px 54px rgba(0,0,0,.46)`): the ambient track selector.
- **Transfer Lift** (`0 24px 70px rgba(0,0,0,.52)`): the temporary open-loop transfer ghost.

**The Physical Shadow Rule.** A shadow indicates an object that can be lifted, opened, moved, or placed; ordinary information surfaces remain tonal and flat.

## Shapes

Dark operational controls use gently curved 8–14px corners; larger panels use 16px. Closure paper is subtly irregular through a 16px top and 10px bottom radius, while ledger structures rely on straight hairlines instead of boxed cards. The Emotion Bottle deliberately breaks the general radius scale with an asymmetric glass silhouette, rounded shoulders, a narrower neck, and a cap that reads as graspable. Circular geometry is reserved for the record, status light, and completion seal.

**The Silhouette Before Decoration Rule.** Signature objects must remain recognizable from shape and state alone; gradients, glints, and color only reinforce the silhouette.

## Components

### Buttons

- **Shape:** Primary and mechanism actions are gently rounded (12–14px); quiet back, skip, reset, and morning actions are borderless text controls.
- **Primary:** Ember fill, dark ink text, bold label, asymmetric 16px/22px/25px padding, and an arrow separated by an 18px gap.
- **Hover / Focus:** Hover lifts 2px and slightly brightens; all keyboard focus uses a 2px white outline with a 4px offset. Disabled actions drop to 25–30% opacity and do not lift.
- **Option:** Deep charcoal tiles reveal a slightly lighter surface and 2px lift on hover; label and hint stay visually distinct.
- **Emotion:** Lilac fill and plum-black text are reserved for completing expression.

### Chips

- **Style:** Capture-mode toggles are transparent, compact 9px-radius controls with 9px/12px padding.
- **State:** The active mode uses a raised charcoal fill and paper text; the inactive mode remains quiet gray without an outline.

### Cards / Containers

- **Corner Style:** Map items use 9px; morning bottle and music popover use 16px.
- **Background:** Closure containers stay green-charcoal or paper cream; Emotion reveal containers use deep plum.
- **Shadow Strategy:** Structural cards remain flat; only physical or floating objects receive elevation.
- **Border:** One-pixel hairlines divide editorial ledgers and lanes.
- **Internal Padding:** Compact map items use 10px/12px; prominent cards use 18–24px.

### Inputs / Fields

- **Style:** Long-form capture appears as a pale physical sheet with dark ink, no visible inner border, and 1.8 line-height. The morning command uses a compact dark field joined to a sage action.
- **Focus:** Paper textareas receive an inset 3px ember outline; standard fields use the global visible white focus ring.
- **Error / Disabled:** Safety content appears immediately in a dedicated dark red-brown panel with coral text. Disabled submit controls reduce opacity without changing geometry.

### Navigation

The fixed header contains a white `Dayend` wordmark with `end` in ember and a small live status. Hover or keyboard focus reveals a compact brand note beneath it. Back actions are subdued inline controls. On narrow screens the status disappears, but the wordmark and ambient record remain available.

### Closure Workbench

One large open-loop card sits beside a persistent four-lane Closure Map. Selection routes the loop through a focused branch, then the card visibly shrinks and travels into Done, Tomorrow, Waiting, or Release. Coverage is a two-pixel ember progress line; the map is a ledger, not a kanban board.

### Emotion Bottle

The bottle is a 310×560px tactile object with a removable cap, narrow neck, translucent 262×390px glass body, lilac liquid, glint, and physical label. Opening lifts and rotates the cap; pouring animates liquid or voice bars; sealing replaces the cap and compresses the body; locking and morning reveal complete the sequence. Reduced motion preserves every state change without continuous animation.

### Ambient Record

A movable 54px vinyl record persists across core flows. Its dedicated grip supports pointer, touch, and keyboard-arrow positioning; placement is constrained to the viewport and restored from local storage. Playing rotates the record and releases three sparse notes; hover or keyboard focus reveals play state. A 24px secondary trigger opens the 214px track and volume popover, which flips away from nearby viewport edges. It is the only shared expressive object across Closure and Emotion.

## Do's and Don'ts

### Do:

- **Do** keep the charcoal night field continuous across stages and preserve generous empty space.
- **Do** let Closure communicate through paper, lanes, coverage, and physical transfer into Done, Tomorrow, Waiting, or Release.
- **Do** let Emotion communicate through the dominant bottle and its open, pour, seal, lock, and reveal states.
- **Do** reserve ember, sage, lilac, and safety coral for their implemented semantic roles.
- **Do** preserve visible keyboard focus, 320px support, and reduced-motion state equivalence.
- **Do** keep the ambient record persistent and visually subordinate to the current mechanism.

### Don't:

- **Don't** turn the interface into a dense productivity dashboard, generic form flow, or collection of equal-weight cards.
- **Don't** convert every open loop into a Tomorrow task; Closure must visibly support Done, Waiting, and Release.
- **Don't** merge Closure and Emotion into the same input-and-analysis template or share their signature visual materials.
- **Don't** add mood scores, diagnostic visualization, or continuous analysis while the user is expressing emotion.
- **Don't** use bright gradients, large saturated color fields, ornamental glow, or gratuitous motion in this low-stimulus night environment.
