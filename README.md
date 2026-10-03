# SOWON Café

A Korean-inspired café and creative space concept in Rajagiriya, Sri Lanka, built with React 19, Vite, JavaScript, and custom CSS.

## Run locally

```sh
npm install
npm run dev
```

## Checks

```sh
npm run lint
npm run build
npm run preview
```

## Features

- Six responsive pages: Home, Menu, Workshops, Gifts, About, and Contact.
- Hash-based navigation supports refresh, direct links, and browser back/forward without requiring server rewrites or an additional routing dependency.
- Menu and gift category filters.
- Separate weekday and weekend workshop schedules, details, and a reservation preview.
- Gift personalization with color, name, message, packaging, gift notes, add-ons, plushie styles, and a live estimate.
- Contact form with native validation, Supabase submission, loading feedback, and retry support.
- Native modal dialogs with keyboard containment, Escape dismissal, and focus restoration; visible focus styles, a skip link, and reduced-motion support.

## Structure

- `src/components/`: shared navigation, footer, image fallback, headings, filters, and dialogs.
- `src/data/catalog.js`: editable sample menu, workshops, gift data, and image URLs.
- `src/pages/`: page components and their feature interactions.
- `src/styles/site.css`: design tokens, layout, and responsive styles.

## Concept details

SOWON is a fictional portfolio brand. Contact information, workshop availability, product descriptions, and Sri Lankan Rupee (LKR) prices are illustrative. The contact form stores messages in Supabase. Workshop and gift flows remain previews and do not reserve, purchase, or process payments. Personalization state is held in memory and resets when its dialog closes.

Photography uses remote Unsplash placeholders; font styles use Google Fonts (DM Sans and Playfair Display). These require internet access. Images have styled fallbacks and fonts fall back to local serif/sans-serif families. Product photography is illustrative and should be replaced with owned product images before a real launch.

## Deployment

Publish the `dist/` directory after running `npm run build`. For hosting under a subdirectory, configure Vite's `base` to that path before building. Contact submissions require the existing Supabase table and `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` at build time. Use only the publishable key in the frontend; no service-role key is needed.

## Refinement and validation

The editorial design uses espresso typography, warm ivory surfaces, olive accents, and a consistent content width. Home introduces the café, creative workshops, and custom gifts as three distinct experiences.

Gift customization offers category-specific styles and personalization, included packaging or a priced upgrade, optional extras, and an itemized live summary. Workshop reservation previews preserve details when returning to the description and calculate totals by guest count. Both flows clearly remain previews.

Responsive browser checks cover every page at 320, 390, 768, 1024, and 1440 pixels. Validated interactions include category filtering, unchanged workshop types when schedules switch, reservation totals, gift totals, the previous contact preview flow, Escape dismissal, and mobile navigation focus restoration. Native dialogs provide keyboard focus containment. Remote photography remains illustrative.

The responsive finishing pass added visible gift color selections, itemized reservation summaries, clearer active navigation, and consistent image sizing through tablet breakpoints. The contact preview has since been connected to Supabase; workshop and gift flows remain frontend-only. Browser checks use temporary files and an isolated browser profile outside the project.

## Sri Lankan localization

A Korean-inspired café and creative space in Rajagiriya, Sri Lanka.

Location: Rajagiriya, Sri Lanka. Demo phone: +94 11 000 0000. Fictional email: hello@sowoncafe.example.

Monday – Friday: 9 am – 9 pm; Saturday – Sunday: 9 am – 10 pm. Workshop times use Sri Lanka time (UTC+5:30).

Prices are original illustrative LKR amounts, not an exchange-rate conversion or a claim about current market pricing. All prices use the shared `money` formatter; gift packaging and add-on calculations use `src/data/cafe.js`.

### Menu

| Item | Demo price |
| --- | --- |
| Cloud Cream Latte | Rs. 950 |
| Strawberry Matcha | Rs. 1,250 |
| Strawberry Cream Cake | Rs. 1,100 |
| Brown Sugar Latte | Rs. 1,050 |
| Yuja Honey Tea | Rs. 850 |
| Black Sesame Milk | Rs. 1,000 |
| Garden Toast | Rs. 1,650 |
| Basque Cheesecake | Rs. 1,250 |

### Workshops (per person)

| Item | Demo price |
| --- | --- |
| A Little Clay Therapy | Rs. 6,500 |
| Paint Your Own Moment | Rs. 4,500 |
| Scents & Slow Living | Rs. 5,500 |
| Pages for Yourself | Rs. 3,500 |
| Flowers for the Everyday | Rs. 6,000 |
| Sunday Kind of Sound | Rs. 2,500 |

### Gifts (starting prices)

| Item | Demo price |
| --- | --- |
| The Slow Morning Set | Rs. 4,800 |
| Your Everyday Mug | Rs. 2,800 |
| A Box of Little Joys | Rs. 6,500 |
| Words from the Heart | Rs. 650 |
| Pocketful of Wishes | Rs. 1,500 |
| Your Cuddle Companion | Rs. 4,500 |
| Everlasting Little Blooms | Rs. 3,800 |
| Something Sweet | Rs. 2,400 |

Signature kraft packaging is included. Ribbon keepsake packaging: Rs. 750.

- Message card: Rs. 350
- Mini candle: Rs. 900
- Coffee sachets: Rs. 750
- Chocolate bites: Rs. 650
