# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19 + TypeScript + Vite frontend; GSAP motion; local-first persistence with localStorage and IndexedDB. The demo does not require a database, API key, or live AI service.

## Users

People using a phone in the final half hour before rest who need to close either cognitive open loops or emotional open loops.

## Product Purpose

Last30 is an AI-driven day-end closure system with two paths: Day Closure actively organizes what needs action, while Emotion Bottle quietly receives what needs expression. Both paths reduce stimulation and converge on Wind Down. The next morning, Tomorrow Desk fulfills what was explicitly handed forward.

## Positioning

Unlike a todo app, sleep tracker, journal, or AI therapist, Last30 separates action closure from emotional release. Tonight AI resolves or receives; tomorrow it hands back only what deserves attention.

## Operating Context

Nighttime, low-light, primarily mobile. Core flows:

- Entry → Day Closure → Text/Voice → Done/Open/Waiting/Release → Confidence Choice → Reminder → Commit → Wind Down.
- Entry → Emotion Bottle → Text/Voice → Seal Choice → Wind Down → next-day delayed reflection.
- Next morning → Tomorrow Desk → Morning Handoff and optional Bottle Reflection.

## Capabilities and Constraints

- Dual entry router with no third major mode.
- Text and microphone capture; demo transcription is deterministic and original audio is not retained.
- Day Closure extracts completed, actionable, waiting, released, and uncertain items; it generates one grounded starting action where possible.
- At most two low-confidence questions; uncertain urgency always returns to the user.
- Reminder defaults to 08:00 with quick presets and local timezone.
- Night records persist locally; released emotion content does not return the next day.
- Emotion summaries contain only concise factual themes and events. No diagnosis, scores, advice, or hidden-trait inference.
- Demo mode is fully usable without real APIs, authentication, cloud storage, notifications, or a database.

## Brand Commitments

Name: Last30. Core Chinese line: “Last30 不负责让你睡着，它负责帮你结束今天。” Voice is concise, calm, non-judgmental, private, and never motivational or clinical.

## Evidence on Hand

Requirements are defined by `Last30_V2_Agent_Update_Plan.md`, with V1 context in `Last30_Agent_Execution_Plan.md`. No customer claims, testimonials, analytics, or external brand assets are available.

## Product Principles

- Close what needs action.
- Release what needs expression.
- Carry forward only what deserves tomorrow.
- AI actively resolves Day Closure and stays quiet during Emotion Bottle.
- Trust comes from bounded inference, explicit privacy choices, and safe local-first failure.

## Accessibility & Inclusion

Keyboard operation, visible focus, readable contrast, touch-safe controls, mobile keyboard layouts, recording fallbacks, and `prefers-reduced-motion` support are required.
