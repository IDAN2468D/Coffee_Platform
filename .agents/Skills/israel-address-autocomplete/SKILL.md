---
name: israel-address-autocomplete
description: Official Israel Government Address & Settlement Autocomplete API integration for Next.js e-commerce and shopping carts using data.gov.il datastore endpoints.
license: MIT
allowed-tools: WebFetch
compatibility: Next.js 15, React 19, Tailwind CSS, TypeScript
---

# Israel Address Autocomplete & Dropdown Engine (data.gov.il)

## 1. Overview
The `israel-address-autocomplete` skill provides real-time Hebrew address and settlement searching, validation, and dropdown selection backed by the Israeli Population and Immigration Authority open dataset on `data.gov.il`.

### Dataset Identifiers
- **Settlements & Cities (ישובים בישראל):** Resource ID `5c78e9fa-c2e2-4771-93ff-7f400a12f7ba`
- **Streets Registry (רחובות בישראל):** Resource ID `9ad3862c-8391-4b2f-84a4-2d4c68625f4b`
- **Base Endpoint:** `https://data.gov.il/api/3/action/datastore_search`

---

## 2. Architectural Protocol

### API Route (`app/api/israel-addresses/route.ts`)
1. **Caching Layer:** In-memory 15-minute TTL cache to reduce remote load and avoid rate limits.
2. **Debounce:** Client-side 200–250ms debounce before dispatching search queries.
3. **Resilience & Fallback:** Local curated dictionary of 50+ major Israeli cities and top street names to provide instant responses even during network disruption.

### Client Component (`components/IsraelAddressAutocomplete.tsx`)
- Supports **Unified Smart Search** (free-text city + street parsing).
- Supports **Guided Drilldown** (City -> Street -> House Number, Apartment, Floor, Entrance).
- Displays quick popular city selector chips for top Israeli metropolitan areas.
- Formats structured address payload for delivery processing.
