# Coffee Platform Architecture State

## Active Modules & Components
- `CoffeeLandingPage`: Liquid Glass 4.0 Pro Coffee Ordering Landing Page (`index.html` & `RealEstateLandingPage.jsx`).
- `Next15App`: Next.js 15 & React 19 App Router page (`app/coffee/page.tsx`).
- `GeminiBaristaModal`: Multimodal voice & vision AI assistant component.
- `V60BrewMaster`: Live interactive V60 brewing timer and ratio controller.
- `CoffeeCustomizer`: Live interactive coffee & nutrition builder.
- `WhatsAppOrderDispatcher`: Server action formatting and dispatching orders to WhatsApp.

## Database Schemas (Mongoose)
- `CoffeeItem`: `{ name, hebrewName, category, price, roastLevel, origin, flavorNotes, imageUrl }`
- `Order`: `{ orderNumber, fullName, phone, deliveryAddress, items, totalPrice, status }`
