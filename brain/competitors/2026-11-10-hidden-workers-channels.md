# Faceless "hidden workers" channels: research (2026-11-10)

Source: YouTube Data API (Hammad's key) pulled on 2026-11-10, plus yt-dlp for 10 extra searches. Raw files: C:\Users\hamma\Documents\yt-research (reference.json, candidates.json, shortlist.csv).

How to read the numbers:
- Subs, views, lengths, dates: from the API (checked).
- Avg / median views: long-form videos (over 3 min) among each channel's last 30 uploads.
- Uploads/90d counts everything incl. Shorts; "30" means at least 30 (the sample cap).
- Faceless: guessed from titles and descriptions, not watched (unverified).
- Monetization: my estimate from topic and length (unverified). High = business/finance/industry topics, 10+ min.

## Ranked table (most to least replicable)

| # | Channel | Subs | Avg views (median) | Top video / outlier x | Uploads | Length | Format | Monetization (est.) | Why replicate |
|---|---|---|---|---|---|---|---|---|---|
| REF | [Capital Case](https://www.youtube.com/@capital_case) | 11.7k | 114k (54k) | 379k "Rockefeller Explained in 10 Minutes" / 7x | 4 in 90d, ~every 3 weeks | 11.5 min | Hand-drawn 2D animation + one narrator, money/history | High | Proves an 11-min story-script explainer can hit 4.6x subs per video in under a year. |
| 1 | [Truck Culture](https://www.youtube.com/@truckculture) | 14.1k | 145k (13.5k) | 2.05M "How Truck Drivers Sleep in Their Cab on the Coldest Nights" / 152x | 13 in 90d | 12.7 min | Narrated, faceless (unverified) | High | Exactly your niche (hidden worker life) and a small channel that produced a 2M outlier. |
| 2 | [Rig Insider](https://www.youtube.com/@riginsider) | 5.0k | 12.6k (1.2k) | 306k "Everything Oil Rig Workers Get For Free" / 255x | 12 in 90d | 13.4 min | Narrated, faceless (unverified) | High | Tiny channel, worker-perks angle went 60x its sub count. |
| 3 | [Mido Explained](https://www.youtube.com/@midoexplained) | 15.1k | 44.8k (12.2k) | 318k "How Walmart Keeps 10,000+ Stores Fully Stocked" / 26x | 30+ in 90d (near daily) | 16.1 min | Narrated logistics explainer, faceless (unverified) | High | Logistics process videos with median views near its sub count. |
| 4 | [Bridged](https://www.youtube.com/@bridgedyt) | 8.9k | 93.8k (21.1k) | 525k "Why Ireland Owns (Almost) Every Plane" / 25x | 10 in 90d | 15.2 min | Narrated business/systems explainer, faceless (unverified) | High | Closest to Capital Case style; median views 2.4x subs. |
| 5 | [Trucker Life](https://www.youtube.com/@truckerlife11) | 9.4k | 23.2k (4.6k) | 296k "15 Loads So Unforgiving Even Veteran Truckers Think Twice" / 65x | 30+ in 90d | 27.5 min | Narrated listicle, faceless (unverified) | High (long videos) | Long listicles about a hidden job; easy to script at volume. |
| 6 | [Railway Relics](https://www.youtube.com/@railwayrelics) | 5.0k | 4.0k (1.3k) | 33k "Why Trains NEVER Stop At Night In The Desert" / 26x | 30+ in 90d | 20.8 min | Narrated rail operations, faceless (unverified) | Medium | "What happens at night" rail angle fits your overnight theme. |
| 7 | [Truck Tropia](https://www.youtube.com/@trucktropia) | 160k | 53.0k (17.5k) | 288k "Why the US Mail Truck Was Built Like This" / 16x | 18 in 90d | 11.2 min | Narrated vehicle/logistics explainer, faceless (unverified) | Medium-high | Shows the "why X is built like this" format scales past 100k. |
| 8 | [Food Tech Today](https://www.youtube.com/@foodtechtoday) | 165k | 169k (28.8k) | 2.42M "How Ferrero Rocher Is Actually Made in Factories" / 84x | 11 in 90d | 11.3 min | Factory process, narrated, faceless (unverified) | Medium | Factory "how it's made" gets huge outliers; footage is the hard part. |
| 9 | [Made Vision](https://www.youtube.com/@madevision-tv) | 259k | 690k (280k) | 4.15M "How Reese's Peanut Butter Cups Are Made In Factory" / 15x | 5 in 90d | 12.6 min | Factory process, narrated, faceless (unverified) | Medium-high | Strongest views in the set, but relies on real factory footage. |
| 10 | [MONEY IQ](https://www.youtube.com/@moneyiqtalk) | 7.5k | 3.4k (1.0k) | 31k "How Construction Equipment Rental Actually Makes Money" / 32x | 30+ in 90d | 15.0 min | Narrated business explainer, faceless (unverified) | High | Hidden-business angle with finance-level ad rates. |
| 11 | [Ideon](https://www.youtube.com/@ideon_channel) | 2.6k | 10.2k (372) | 134k "Why Do Trains ALWAYS Have One Empty Car?" / 361x | 30+ in 90d | 5.0 min | Short narrated explainer, faceless (unverified) | Low (under 8 min) | Curiosity-question titles about operations can spike hard. |
| 12 | [Daily Demystify](https://www.youtube.com/@dailydemystify) | 5.3k | 2.0k (120) | 41k "Planes Fly At The Same Height On Purpose" / 340x | 10 in 90d | 9.6 min | Narrated explainer, faceless (unverified) | Medium | Same "hidden rule" hook; mostly low views outside the outlier. |
| 13 | [Planet Wonders](https://www.youtube.com/@planetwonders777) | 8.6k | 2.3k (1.4k) | 7.5k "Why Almost Cargo Planes DON'T Fly During the Day?" / 5x | 26 in 90d | 9.2 min | Narrated explainer, faceless (unverified) | Medium | Overnight cargo topic fits, but weak views; a cautionary example. |
| 14 | [Mexican garbage collector POV](https://www.youtube.com/@povmexican) | 31.4k | 28.1k (23.8k) | 56k "Garbage Truck Picking Up Everything From Couches to Yard Debris" / 2.4x | 30+ in 90d | 13.2 min | Raw POV footage, no narration (unverified) | Low-medium | Proves sanitation demand, but needs real filming, so hard for you to copy. |
| 15 | [History of Simple Things](https://www.youtube.com/@historyofsimplethings) | 1.04M | 17.1k (8.6k) | 149k "Why Engineers Put Washers Under Bolts" / 17x | 30+ in 90d (several a day) | 8.3 min | Narrated explainer, faceless (unverified) | Medium | Big but views are low per video; shows volume alone isn't enough. |

Left out on purpose: Animagraffs (1.9M, heavy 3D, legacy), Howdy Korea, Rohit Handa, Chad Griffiths and Gabriel DeSanti (on-camera hosts), Heroes Next Door (unclear format, low outliers), brand/network channels (Changi Airport, Insider, Discovery, city and utility channels), and Shorts-only channels (Recon Wire, Warehouse Jobs).

## Capital Case: how it's made

- 13 videos since the channel started (2025-12-31), all long-form, 9.5 to 12.3 min. 11.7k subs, 1.48M total views.
- Visuals: custom hand-drawn 2D animation by an in-house team; the description says "(HUMAN-MADE)" and no AI visuals. Not stock or archival footage.
- Narration: one voice, written story script. Cold open with a paradox plus a big number, then a dated scene ("1859, Western Pennsylvania"). Short punchy sentences, one-word beats, dry jokes.
- Titles: "X Explained in 10/11 Minutes", "X Explained Like You're 5", "The Rise (and Fall?) of X", "The Mistake That...".
- Hits: Rockefeller 379k, Great Depression 292k, Strait of Hormuz 249k, WW2 mistake 189k, BYD 151k. Misses (about 5k): BlackRock, FTX, hyperinflation, national debt.
- Thumbnails: not checked (unverified).

## Patterns that repeat across the winners

1. "Why X does Y" or "How X actually works" curiosity titles about a hidden rule (trains at night, empty train car, planes at the same height).
2. Worker-life angles: how drivers sleep, what rig workers get for free, loads truckers refuse.
3. Big-system logistics: how Walmart stays stocked, why Ireland owns every plane.
4. 11 to 16 minute narrated videos with one voice and no host.
5. Outliers are 25x to 360x the channel median, so one strong title matters more than volume.

## Unverified / not checked

- Faceless status for every channel (from titles and descriptions only).
- Monetization (my estimate; real RPM not available).
- Thumbnails (not opened).
- The 10 extra searches used yt-dlp relevance order without a date filter, because the API search quota ran out.
