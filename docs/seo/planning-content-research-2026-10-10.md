# Equipment planning content research — 10 October 2026

## Evidence and limits

Serpstat `get_keywords_info`, Pakistan Google database `g_pk`, returned the following monthly search estimates on 10 October:

| Keyword | Estimated searches | Difficulty |
| --- | ---: | --- |
| mop trolley | 90 | Not returned |
| cleaning trolley | 40 | Not returned |
| floor scrubber | 90 | Not returned |
| floor scrubber machine | 40 | Not returned |
| floor cleaning machine | 590 | Not returned |

The requested “janitorial trolley” term was not in the returned table. Missing results do not prove zero demand. These are tool estimates, not observed traffic or a ranking forecast.

HYPD Search Console page-query breakdown for the existing single-disc category, finalized web data 10 July–7 October 2026, returned one exposed query: “single disc machine”, 1 impression, 0 clicks, position 9. Google withholds anonymized queries, so this does not represent all category searches and does not validate demand for the new pages.

Semrush `phrase_this`, database `pk`, keyword “mop trolley”, failed with `ERROR 122 :: WRONG FORMAT OR EMPTY KEY`. No usable Semrush metric was used. This is a connector/API access failure, not evidence that the keyword has no demand.

## Original content and primary references

Added two distinct guides, approximately 1,182 words across introductions, main sections and FAQs:

- Mop and cleaning trolley buying guide: task configuration, included equipment, loaded route, compatibility and comparable quotations. Existing janitorial category receives a contextual link.
- Scrubber capacity calculator guide: explicit units, transparent route assumptions, additional time and trial validation. Existing ride-on comparison and warehouse checklist link to it.

Primary sources were opened and reviewed:

- [Kärcher warehouse planning guidance](https://www.kaercher.com/au/professional/know-how-for-professionals/warehouse-cleaning.html): distinguishes straight-line area performance from practical performance affected by route interruptions. The calculator's default 65% is labelled an editable hypothetical assumption, not a measured rate or a universal standard.
- [Vileda Professional Comodino](https://export.vileda-professional.com/Trolleys/Cleaning-Trolley/Comodino/Comodino/p/Comodino): illustrates model-specific trolley configuration and dimensions. The article explicitly does not claim Moral Clean supplies this model.

The articles use original facility planning and quotation advice; no manufacturer content was copied. No invented price, stock, testimonials, staff credentials or model performance is presented.

## Tool calculation

Straight-line capacity (m²/h) = brush width (mm) × cleaning speed (km/h), after cancelling their conversion factors. Assumed route capacity = straight-line capacity × user allowance / 100. Total minutes = accessible area / assumed route capacity × 60 + separately identified additional time.

Default hypothetical example: 3,000 m², 500 mm, 3 km/h, 65%, 20 minutes. Capacity 1,500 m²/h; assumed route capacity 975 m²/h; time 204.615 minutes, displayed rounded to 205. The tool checks finite positive area, width and speed; allowance above zero through 100%; and finite non-negative additional time. It does not recommend a machine or establish battery, tank, access or cleaning-quality suitability.

Only the calculator is a client component. The article text, starting results, metadata, image and Article schema remain server rendered. UI follows the existing navy/cyan theme, with labelled controls, linked hints, live results, visible focus and a reset button.

No database writes or production release are included. Preview remains protected and noindex.
