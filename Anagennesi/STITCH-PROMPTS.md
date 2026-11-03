# Anagennisi — Prompts Stitch (atualização visual 2018 → 2026 + expansão)

Prompt em inglês gerado pela skill `/gerar-prompt-stitch`, a partir do protótipo antigo em `projects/xyz/*.png` (app de igreja "Anagennisi", Material Design clássico de 2018: AppBar sólida verde-teal escura, drawer com fundo teal sólido, botões roxo/púrpura, cards de radius pequeno com sombra padrão, tipografia Roboto do sistema) e do estilo claro/moderno extraído de `.claude/estilo-referencia/` (fundo claro, cards arredondados 18-24px com sombra suave, tipografia sans bold, ícones outline finos, uma cor de destaque viva contra neutros).

## O que este documento cobre

1. **Modernização** das telas que já existiam completas no protótipo de 2018 (Login/Cadastro, Home/Drawer, Eventos, Doações, Pedido de Oração, Perfil).
2. **Preenchimento** das telas que já existiam no protótipo mas ficaram vazias (só tinham o header desenhado, sem conteúdo): Group Meetings, Testimonials (lista), Schedule, Registrations, Event Payments, Congregations (multi-campus, hoje chamado "Settings" no protótipo antigo).
3. **Expansão ampla** com funcionalidades novas coerentes com um app de igreja em 2026, que não existiam em 2018: sermões/mensagens em áudio e vídeo, devocional/plano de leitura diário, notificações, check-in em eventos via QR code, grupos pequenos com chat, e um feed comunitário de orações/testemunhos.

Todas as telas compartilham o mesmo sistema visual descrito no Prompt Mestre (seção 0) — os prompts individuais das seções seguintes assumem esse contexto.

---

## 0. Prompt Mestre (contexto e estilo compartilhado)

```
I'm redesigning a church community mobile app called "Anagennisi." This is a full visual modernization of an existing 2018-era Material Design app (dark teal solid app bars, a purple/violet action-button color, small-radius white cards with flat default shadows, a dense list-heavy layout, and default system typography). Keep the app's purpose exactly the same — it's a warm, everyday companion app for a church community — but bring the visual language fully up to a 2026 standard, and I'm also expanding it with new screens beyond what existed in 2018. Every screen should follow this same design system:

**Overall style:** Light, calm, airy UI: soft off-white/warm-gray backgrounds (#FAF9F6, #F5F3EF), never the old dark teal app bar — this app should feel welcoming and unhurried, not corporate or clinical, and never gamified.

**Cards:** generously rounded corners (20–24px radius), a soft low-opacity drop shadow or a subtle 1px warm-gray border instead of the old flat Material shadow — no hard edges, no dense list dividers. Generous whitespace and breathing room between sections; comfortable internal card padding (18–20px).

**Typography:** a clean, warm geometric sans-serif (like Inter, Poppins, or a similar humanist sans) — medium/semibold weight for headings, regular for body text; softer and friendlier than the old app's default system Roboto.

**Accent color:** one warm, welcoming accent used consistently for primary actions and highlights — a soft sage-green (something that nods to the original teal-and-dove identity but feels calm and human, not corporate-cold). A secondary warm terracotta/gold tone is used sparingly for highlights that need to stand apart from the primary action color (e.g. "new"/"live" badges). Replace the old harsh violet/purple buttons entirely.

**Icons:** thin outline style, rounded terminals, consistent stroke width — softer and friendlier than the old filled Material icons.

**Buttons:** fully rounded or large-radius pill-shaped, solid accent-color fill for primary actions, soft outline or text-only style for secondary actions — replacing the old sharp-cornered purple buttons.

**Navigation:** a light, spacious bottom navigation bar for the primary sections (Home, Events, Groups, Give, Profile), with the active tab highlighted by a soft filled pill — replacing the old solid-dark-teal side drawer as the primary navigation, though a drawer/"More" menu can still hold secondary items.

**Tone:** warm, calm, and trustworthy — like a modern wellness or community app. This is a space for reflection and connection, not a dashboard or a game.

I'll send you one prompt per screen from now on, keeping this design system and accent color consistent across all of them.
```

---

# Parte 1 — Modernização das telas existentes

## 1. Home / Navegação

```
Redesign the Home screen and primary navigation for a church community app, replacing the old solid-dark-teal side drawer (profile photo, plain icon list on flat color background) with a light, modern home screen. Warm card-style profile header at the top: a softly rounded avatar with a subtle ring, the member's name, and a small welcoming greeting line (e.g. "Peace be with you, Stella"). Below it, a "Today" section: a warm highlighted card surfacing the most relevant thing right now (either today's devotional excerpt, or the next upcoming event/service if one is happening soon) with a clear tap-through. Below that, a grid or list of quick-access shortcuts (Prayer Requests, Sermons, Groups, Give, Gallery, Contact Us) — each as a rounded card or chip with a soft icon in a small colored circle. Bottom navigation bar with 5 tabs: Home, Events, Groups, Give, Profile, active tab highlighted with a soft filled pill in the accent color. A "More" overflow icon in the top-right corner opens a simple sheet/drawer for secondary items (About Church, Testimonials, Contact Us, Settings) that don't fit the bottom nav.
```

---

## 2. Lista de Eventos

```
Redesign the Events list screen for a church app, replacing the old flat white rectangular rows (small square thumbnail + title + location + date, tight spacing, hard Material shadow) with a modern card-based list. Each event as a rounded card with a full-width event photo at the top (rounded corners, soft gradient overlay at the bottom of the photo for text legibility), the event name in warm bold type overlaid or just below the photo, a location row with a small pin icon, and a date/time chip in the accent color. A search icon and a filter icon (by campus/congregation, see section 8) in the top app bar. Add a small "Going" indicator or RSVP button on cards for events the member has already confirmed attendance for. Empty state: a soft illustration and a friendly line like "No upcoming events right now — check back soon."
```

---

## 3. Doações

```
Design a real, welcoming Donations screen for a church app — the old screen was just a bare teal header over a blank page. A warm intro card explaining the purpose of giving in a few gentle lines. A set of suggested-amount pill buttons (e.g. small/medium/large presets) plus a custom amount input field. A simple segmented control for "One-time" vs. "Recurring" giving; when Recurring is selected, a frequency picker appears (Weekly/Monthly). A fund/category selector (e.g. "General Offering," "Missions," "Building Fund") as a simple dropdown or chip row. A clear primary "Give" button in the accent color at the bottom. Below the main giving card, a collapsible "My Giving History" section showing past contributions as a simple list (date, amount, fund) with a small receipt/download icon per row. The overall tone should feel like an invitation, not a transaction form.
```

---

## 4. Pedido de Oração

```
Redesign the Prayer Request screen for a church app, replacing the old two-tab layout (harsh teal tab bar, plain white list rows, a small hard-to-notice magenta circular FAB) with a calmer design. A soft segmented control at the top for "My Requests" vs. "Prayer Wall" (viewing requests the community has chosen to share). Each request shown as a warm rounded card with the request title, a relative timestamp ("a few moments ago"), a small subtle icon indicating whether it's private or shared with the community, and — on the Prayer Wall tab only — a gentle "🙏 I'm praying" tap action with a small counter, so members can show support without commenting. A large, clearly visible rounded "+ New Request" button (a full-width button pinned above the bottom nav, not a small circular FAB) opens the request form: a category dropdown ("Choose an area"), a text area for the request, and a toggle for "Share with the Prayer Wall" vs. "Keep private," before the final "Send" button.
```

---

## 5. Perfil

```
Redesign the Profile screen for a church app, replacing the old flat list-on-white-background layout (thin dividers, right-aligned gray icons) with a warmer profile layout. A soft rounded header card with a larger avatar, name, and email. Below it, grouped settings sections as individual rounded cards with a friendly icon in a small colored chip and a chevron: "Notes," "Registrations," "Personal Information," "My Congregation," "Settings." "Log Out" is styled as a clearly separate, lower-emphasis text action at the very bottom of the screen (not mixed into the same list/visual weight as the other items).
```

---

## 6. Login / Cadastro

```
Redesign the Login and Sign Up screens for a church app, replacing the old top-heavy dark teal header with a dove logo over a hard-edged white sheet, and the old outlined-purple/filled-purple button pair of similar visual weight. Lighter composition: a softly illustrated or minimal top area introducing the app name and a simplified dove mark on a warm neutral background (no longer a solid dark block). Rounded input fields with soft borders and floating labels for Email and Password (not placeholder-only fields). A single full-width rounded primary button in the accent color for "Sign In," a lower-emphasis text link for "Forgot password?," and a clearly secondary "Create Account" action (outline or text style, visually subordinate to Sign In). The Sign Up screen mirrors this style with First Name, Last Name, Email, and Password fields, ending in a primary "Create Account" button and a "Already have an account? Sign In" text link.
```

---

# Parte 2 — Telas que existiam vazias no protótipo de 2018 (agora desenhadas)

## 7. Group Meetings (Pequenos Grupos)

```
Design the "Groups" screen for a church app — this existed only as an empty page with a header in the 2018 prototype and needs a full design now, playing the same warm, card-based visual role as the other list screens. Top section: "My Groups" — a horizontal scrollable row of cards for groups the member already belongs to, each showing the group name, a small member-avatar cluster (overlapping circles), and the next meeting date/time. Below it, a "Discover Groups" section: a vertical list of other groups open to join, each card showing group name, a short description line, meeting day/time, location (or "Online"), and a simple "Request to Join" pill button. A filter row at the top (by topic — e.g. "Young Adults," "Couples," "Bible Study," "Prayer" — and by day of week) as horizontally scrollable chips. Tapping a group card opens a Group Detail view: cover image, description, leader name with avatar, meeting schedule, member list preview, and a "Group Chat" entry point (see section 12) for members already in the group.
```

---

## 8. Testimonials (lista completa)

```
Design the full "Testimonials" list screen for a church app — the 2018 prototype only showed a header with no content list beneath it (a single detail view existed, but never a real list/feed). A vertical feed of testimonial cards, each with the author's avatar and name, a relative timestamp, the testimonial text (truncated with a "Read more" if long), and a small warm "🙏 Amen" or "❤️ Encouraging" tap reaction with a counter — kept minimal, not a full social-media comment system. A prominent "Share Your Testimony" button (pill-shaped, accent color) fixed above the bottom nav, opening a simple composer (a text area with a placeholder like "Share what God has done...") with a "Post" button.
```

---

## 9. Schedule (Agenda / Horários de Culto)

```
Design the "Schedule" screen for a church app — the 2018 prototype only had an empty page with a header. This screen shows the recurring weekly service and activity schedule (distinct from the one-off Events list in section 2). A week-view selector at the top (day chips, Sun–Sat) or a simple grouped list by day. Each schedule item as a compact card: time, service/activity name (e.g. "Sunday Service," "Youth Group," "Prayer Meeting"), location/room, and — for the main services — a small campus indicator icon when the member's church has multiple congregations (see section 11). Tapping an item can optionally reveal more detail (speaker/leader name, description) in an expanded card or a simple detail sheet.
```

---

## 9.1 Bible (Bíblia)

```
Design a "Bible" reading screen for a church app — this existed only as a menu entry in the 2018 prototype's side drawer and was never actually designed. Top bar with a book/version selector (e.g. "NIV ▾") on one side and a search icon on the other. Below it, a compact reference selector row: three tappable fields for Book, Chapter, and Verse (e.g. "John · 3 · 16"), styled as small rounded chips rather than full dropdowns, so switching passages feels quick and light. Main content: the passage text in a warm, comfortable reading typography — larger line height and a slightly serif-leaning or elegant type treatment for the verse text itself (distinct from the app's regular UI body font, similar in spirit to the devotional's scripture styling in section 13), with verse numbers as small superscript-style markers, not large distracting numerals. A slim floating toolbar (or a bottom sheet on long-press of a verse) offers per-verse actions: Highlight (a small color-swatch picker in warm tones), Bookmark, Share, and "Add to Notes" (linking to the Notes item already present in Profile, section 5). A "Reading Plans" entry point near the top (icon + label) leads to a simple plan-browser screen: a list of plan cards (title, duration in days, a short description, and a progress bar for plans already in progress) with a "Start Plan" button on ones not yet joined.
```

---

## 10. Registrations (Inscrições)

```
Design the "Registrations" screen for a church app — the 2018 prototype only had an empty page with a header. This is where a member sees and manages their sign-ups for events, courses, or group activities that require registration. A segmented control at the top: "Upcoming" vs. "Past." Each registration shown as a card with the event/course name, date, a status chip ("Confirmed," "Waitlisted," "Pending Payment" — reusing the accent, amber, and muted-red tones respectively), and a secondary action appropriate to its state (e.g. "View Ticket / QR Code" for confirmed paid registrations, linking to the check-in QR from section 13; "Cancel Registration" as a lower-emphasis text action). Empty state: a friendly illustration and a line like "You haven't registered for anything yet — check out upcoming events."
```

---

## 11. Event Payments (Pagamento de Eventos) & Congregations (Multi-Campus)

```
Design two related screens for a church app, both of which existed only as blank/near-blank pages in the 2018 prototype:

(1) "Event Payment" — shown when registering for a paid event (e.g. a retreat or conference). An order summary card at the top (event name, date, ticket type, price). A simple payment method selector (credit card, PIX/bank transfer, or "Pay at church" as an offline option) as radio-style cards. If card is selected, standard rounded card-number/expiry/CVV fields. A clear total due amount and a full-width primary "Confirm Payment" button. A small reassuring security note below the button (e.g. "Payments are securely processed").

(2) "Congregations" (multi-campus selector) — replacing the old bare "Settings" screen that only listed two church locations with no other content. A list of the organization's congregations/campuses as warm cards, each with a small photo or icon, the congregation name, address, and a "Set as My Congregation" action (radio-style selection, with the currently selected one clearly highlighted with a filled border or check icon in the accent color). This is what personalizes the Schedule (section 9) and Events (section 2) to show that campus's specific times/location by default.
```

---

# Parte 3 — Expansão ampla: novas funcionalidades para 2026

## 12. Sermões / Mensagens (áudio e vídeo)

```
Design a "Sermons" section for a church app — a new feature that didn't exist in the 2018 version, letting members watch or listen to past and live messages. A "Live Now" banner card at the top when a service is currently streaming (soft pulsing "LIVE" badge in the secondary warm accent, a "Watch Now" button), hidden when nothing is live. Below it, a horizontally scrollable "Recent" row of sermon cards (thumbnail with a play icon overlay, title, speaker name, date, and duration). Below that, a filterable vertical list of the full sermon archive, with filter chips by series/topic and a search icon in the app bar. Tapping a sermon opens a Player screen: a video player (or, for audio-only messages, a warm minimal audio player with a large play/pause button, a scrub bar, and 15s skip controls), the sermon title, speaker, series name, a short description, and a "Notes" area where the member can jot down their own thoughts while watching/listening, saved automatically.
```

---

## 13. Devocional Diário

```
Design a "Daily Devotional" feature for a church app — a new feature that didn't exist in the 2018 version. A Home screen card (referenced in section 1) leads here. The main Devotional screen: today's date at the top, a short scripture verse in a larger, warm serif-adjacent or elegant type treatment (visually distinct from the rest of the app's body text, like a quoted passage), followed by a brief reflection written by church leadership, and a simple prompt for personal reflection or a short prayer to close. A "Mark as Read" action that also reveals a small streak indicator (e.g. "5-day streak 🔥" using the secondary warm accent, understated, not game-like). A calendar/history view accessible from the top of the screen shows past devotionals as a simple list or calendar grid, with a small dot marking days already completed.
```

---

## 14. Notificações

```
Design a "Notifications" screen and a notification settings panel for a church app — a new feature that didn't exist in the 2018 version. The Notifications list: a chronological feed of cards grouped by "New" and "Earlier," each with a small icon indicating type (event reminder, new sermon posted, someone prayed for your request, group meeting reminder, donation receipt), a short message line, a relative timestamp, and unread items marked with a subtle colored dot or left accent bar. Tapping a notification navigates to the relevant screen (event, sermon, prayer request, etc.). A settings icon in the top-right opens a simple Notification Preferences panel: a list of notification categories (Event Reminders, New Sermons, Prayer Wall Activity, Group Updates, Giving Receipts) each with its own toggle switch in the accent color.
```

---

## 15. Check-in em Eventos via QR Code

```
Design a QR-code check-in flow for a church app — a new feature that didn't exist in the 2018 version, used for confirming attendance at paid or capacity-limited events (linked from the Registrations screen, section 10). Screen (1) "My Ticket": a large, clearly displayed QR code centered on a warm rounded card, with the event name, date, and the attendee's name below it, plus a small note ("Show this at the entrance"). Screen (2) "Scan to Check In" (for event volunteers/staff, a distinct simpler utility-style screen): a full-screen camera viewfinder with a rounded square scan-target overlay in the accent color, a short instruction line at the top ("Point the camera at the attendee's QR code"), and, on a successful scan, a brief full-screen success state (a soft green checkmark animation placeholder, the attendee's name and photo, and an automatic return to scanning after a couple seconds).
```

---

## 16. Grupos Pequenos com Chat

```
Design a simple Group Chat screen for a church app — a new feature that didn't exist in the 2018 version, entered from a small group's detail view (section 7), scoped to that one group only (not a general-purpose messenger). Standard chat layout: the group name and a small member-count in the app bar, a scrollable message list with rounded message bubbles (the current member's own messages right-aligned in the accent color with light text, others left-aligned in a neutral warm-gray bubble with the sender's small avatar and name above the bubble), timestamps shown subtly between message clusters, and a simple composer bar at the bottom (text input, an attachment/image icon, and a send button). A pinned banner below the app bar can surface the group's next meeting date/time as a persistent reminder, dismissible per session.
```

---

## 17. Feed Comunitário (Orações e Testemunhos)

```
Design a unified "Community" feed screen for a church app — a new feature that didn't exist in the 2018 version, combining the previously separate Prayer Wall (section 4) and Testimonials (section 8) into a single browsable feed people can scroll through, while each item still deep-links into its own detail view. A top segmented filter: "All," "Prayer Requests," "Testimonies." Each feed item as a warm rounded card: author avatar and name, a small type-indicator icon/tag (prayer hands or a small "testimony" ribbon icon) distinguishing the two content types at a glance, relative timestamp, the content text (truncated with "Read more" if long), and a single soft reaction control appropriate to the type ("🙏 Praying" with a counter for prayer requests, "❤️ Amen" with a counter for testimonies) — kept minimal and warm, deliberately avoiding a heavy social-media comment/like/share toolbar so the tone stays reflective rather than performative.
```

---

### Nota técnica
O Stitch só gera a aparência (HTML/Tailwind estático). A lógica real de streaming de vídeo/áudio ao vivo (seção 12), o scanner de QR code e a geração de códigos únicos por inscrição (seção 15), o chat em tempo real dos grupos (seção 16), o processamento de pagamentos (seção 11) e as notificações push (seção 14) precisam ser implementados depois, fora do Stitch.
