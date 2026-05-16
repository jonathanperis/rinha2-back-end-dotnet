---
name: rinha2-back-end-dotnet
description: Dark .NET performance showcase and documentation system for a constrained backend benchmark implementation.
colors:
  deep-navy: "#0a1628"
  metal-navy: "#0d2137"
  structural-navy: "#1a365d"
  dotnet-blue: "#1e90ff"
  telemetry-cyan: "#00d4ff"
  native-aot-purple: "#512BD4"
  text-primary: "#e0f0ff"
  text-body: "#b8d4f8"
  text-muted: "#8ab4f8"
  text-dim: "#4a6fa8"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 8vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  mono:
    fontFamily: "JetBrains Mono, Fira Code, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.dotnet-blue}"
    textColor: "{colors.deep-navy}"
    rounded: "{rounded.lg}"
    padding: "16px 40px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.dotnet-blue}"
    rounded: "{rounded.lg}"
    padding: "16px 40px"
  chip:
    backgroundColor: "{colors.metal-navy}"
    textColor: "{colors.telemetry-cyan}"
    rounded: "{rounded.md}"
    padding: "6px 14px"
  card:
    backgroundColor: "{colors.metal-navy}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "32px"
---

# Design System: rinha2-back-end-dotnet

## 1. Overview

**Creative North Star: "The Constrained Systems Console"**

The interface should feel like a serious benchmark control room: dark navy, bright telemetry accents, dense proof where density helps, and sharp whitespace where the visitor needs orientation. The brand is not generic dark mode. It is a public engineering console for a .NET implementation that survived tight CPU and memory limits.

The system keeps the current aesthetic: grid field, cyan readouts, purple .NET signal, crisp borders, and uppercase technical labels. The overhaul should make the same language more intentional by giving each content type a different job: hero as claim, architecture as topology, metrics as proof, reports as evidence log, docs as field manual.

It explicitly rejects generic AI dark landing pages, terminal cosplay, corporate .NET brochure design, and benchmark dashboards that show numbers without provenance.

**Key Characteristics:**

- Dark, high-confidence, system-native atmosphere.
- Proof-first hierarchy, especially for throughput, latency, success rate, resource limits, CI runs, and archived reports.
- Console motifs used as information structure, not decoration.
- Stronger distinction between cinematic homepage sections and long-form readable docs.
- Motion exists only to clarify state or introduce hierarchy, never to distract from benchmark evidence.

## 2. Colors

The palette is a committed dark .NET/system palette: deep navy as the field, blue and cyan as telemetry, purple as the Native AOT/.NET signature, and pale blue text for readability.

### Primary

- **Dotnet Blue** (`dotnet-blue`): Primary CTAs, active navigation, focus rings, key links, and decisive readouts.
- **Telemetry Cyan** (`telemetry-cyan`): Metric values, live-status accents, hover highlights, and proof markers.

### Secondary

- **Native AOT Purple** (`native-aot-purple`): Use sparingly for .NET identity, hero emphasis, signature status lights, and diagram nodes. It should not become a blanket gradient.

### Neutral

- **Deep Navy** (`deep-navy`): Page background and grid field.
- **Metal Navy** (`metal-navy`): Cards, panels, code blocks, and sidebar surfaces.
- **Structural Navy** (`structural-navy`): Borders, table dividers, inactive controls, and low-emphasis rules.
- **Text Primary** (`text-primary`): Headings and important values.
- **Text Body** (`text-body`): Long-form documentation copy.
- **Text Muted** (`text-muted`): Secondary metadata and supporting labels.
- **Text Dim** (`text-dim`): Least important metadata only.

### Named Rules

**The Proof Accent Rule.** Blue and cyan are reserved for proof, actions, focus, and navigation state. If everything glows, nothing is evidence.

**The No Pure Black Rule.** Pure black is prohibited for backgrounds and inputs. Use tinted navy surfaces so the system feels engineered rather than harsh.

**The Purple Signature Rule.** Purple is a signature mark, not a paint bucket. Use it for .NET identity and rare emphasis only.

## 3. Typography

**Display Font:** Inter or a future technical sans replacement, with system sans fallbacks.
**Body Font:** Inter or a future readable sans replacement, with system sans fallbacks.
**Label/Mono Font:** JetBrains Mono and Fira Code, with system monospace fallbacks.

**Character:** The type system is technical and compressed, but not unreadable. Sans carries hierarchy and long reading. Mono carries labels, code, timestamps, config rows, and system metadata.

### Hierarchy

- **Display** (700, `clamp(2.5rem, 8vw, 5.5rem)`, 0.95): Hero headline and one-off campaign statements only.
- **Headline** (700, `clamp(2rem, 5vw, 3.5rem)`, 1.05): Section-defining claims such as benchmark proof or architecture overview.
- **Title** (600 to 700, `1.25rem` to `1.75rem`, 1.2): Cards, docs page titles, and major panel headers.
- **Body** (400, `1rem`, 1.65 to 1.75): Explanatory copy and documentation. Keep long-form text near 65 to 75 characters per line.
- **Label** (500 to 700, `0.75rem` to `0.875rem`, uppercase only for short labels): Tech pills, status chips, table metadata, report timestamps, and navigation categories.

### Named Rules

**The Mono Has a Job Rule.** Monospace is for code, labels, timestamps, config rows, and system metadata. It is not the default voice for every paragraph.

**The No Gradient Text Rule.** Text uses solid colors. Emphasis comes from scale, weight, position, and proof density, not clipped gradients.

## 4. Elevation

Depth is mostly tonal, not shadow-based. Surfaces become lighter or more saturated as they become more important. Shadows appear only as interaction feedback on CTAs and high-value metric elements. Static panels should not float like SaaS cards.

### Shadow Vocabulary

- **CTA Glow** (`0 8px 30px rgba(0, 212, 255, 0.25)`): Primary button hover and active proof links.
- **Proof Lift** (`0 10px 30px rgba(0, 0, 0, 0.3)`): Hover state for key metric or report cards only.
- **Ambient Field** (`radial-gradient(...)`): Background atmosphere behind hero and major proof sections, never inside every card.

### Named Rules

**The Flat Until Proven Rule.** A surface stays flat until it is clickable, active, or carrying a top-tier proof point.

## 5. Components

### Buttons

- **Shape:** Confident rounded rectangle, large enough for touch (`12px` radius, minimum 44px target height).
- **Primary:** Dotnet Blue fill with dark navy or tinted light text depending on contrast, uppercase or short imperative labels only.
- **Hover / Focus:** Transform and glow are allowed, but focus must use a visible outline or ring. Hover treatment must have a matching `:focus-visible` treatment.
- **Secondary:** Transparent or low-tint surface with blue border and blue text. It must be visually quieter than the primary CTA.

### Chips

- **Style:** Compact technical badges with metal navy fill, structural border, cyan text, and mono labels.
- **State:** Hover may brighten border or text. Chips are decorative unless wired to filtering or navigation.

### Cards / Containers

- **Corner Style:** Use `8px` for compact technical rows, `12px` for controls, `20px` for large showcase sections.
- **Background:** Metal Navy for standard panels, Deep Navy for code fields, and low-alpha blue only for active or selected states.
- **Shadow Strategy:** Flat at rest. Use Proof Lift only for interactive cards.
- **Border:** Full borders or subtle top rules. Thick side-tab borders are prohibited.
- **Internal Padding:** Use the 4pt scale. Standard cards use `24px` to `32px`. Large hero/proof sections use `48px` to `64px` on desktop.

### Inputs / Fields

- **Style:** Dark tinted navy field, structural border, mono or readable sans depending on context.
- **Focus:** Blue or cyan focus ring plus border shift. Never remove the outline without replacing it.
- **Search:** Search should feel like a command palette entry point with icon, keyboard shortcut hint, and visible results state.

### Navigation

- **Homepage navigation:** Sparse, status-like, sticky, and proof-oriented. Keep GitHub and Docs obvious.
- **Docs navigation:** Fixed or sticky sidebar with independent scroll, clear categories, active scrollspy state, and mobile drawer behavior that supports Escape and focus management.
- **Report navigation:** Treat reports as an evidence log, not a generic card grid.

### Signature Components

- **Benchmark Strip:** A compact proof row for `46k+ req/s`, `<50ms p95`, `99.9% success`, and resource limits. This can live near the hero or immediately below it.
- **Architecture Rail:** A system diagram showing `k6/load -> nginx -> api-1/api-2 -> postgres` with resource badges. It should read like infrastructure, not an illustration pasted into a hero.
- **Report Log:** Historical reports should be compact log rows with timestamp, status, and key metric snippets when available.

## 6. Do's and Don'ts

### Do:

- **Do** keep the current dark .NET/system aesthetic: navy grid, cyan telemetry, restrained purple, and technical labels.
- **Do** use proof-first hierarchy. Bring benchmark outcomes, resource limits, CI evidence, and archived reports closer to the top.
- **Do** differentiate content types: config block for constraints, topology diagram for architecture, large readouts for proof, log rows for reports, calm prose for docs.
- **Do** add visible `:focus-visible` styles to every interactive pattern.
- **Do** respect `prefers-reduced-motion` for particles, ambient drift, entrance animations, smooth scrolling, and hover transitions.
- **Do** keep docs body text readable with stronger contrast, controlled line length, copyable code blocks, and scan-friendly headings.

### Don't:

- **Don't** use gradient text. The current hero gradient should become a solid, intentional color treatment.
- **Don't** use thick `border-left` or `border-right` accent stripes on cards, callouts, or blockquotes.
- **Don't** use pure black (`#000`) or pure white (`#fff`) as surface or text defaults.
- **Don't** turn the site into terminal cosplay. Fake shell output and green-on-black hacker styling are prohibited.
- **Don't** repeat identical dark cards for every section. Repetition makes the site feel generated.
- **Don't** hide primary navigation or contact with novelty interactions.
- **Don't** let documentation behave like one long undifferentiated wiki dump. It needs search, section state, anchors, and clear navigation.