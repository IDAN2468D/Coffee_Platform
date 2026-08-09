# Coffee Platform Architecture State

## Active Modules & Components
- `CoffeeLandingPage`: Liquid Glass 4.0 Pro Coffee Ordering Landing Page (`app/page.tsx`).
- `Next15App`: Next.js 15 & React 19 App Router page.
- `GeminiBaristaModal`: Multimodal voice & vision AI assistant component.
- `V60BrewMaster`: Live interactive V60 brewing timer with Web Audio API spatial sound pacing, Web Haptics phase transitions, and real-time Gold Cup TDS yield simulator.
- `SmartInventoryManager`: AI coffee consumption rate forecaster with bean blend selector and automated WhatsApp replenishment link generator.
- `ThreeDCardPayment`: 3D Credit Card payment simulator component with auto-typing Hebrew RTL digits and mouse parallax/tilt effect.
- `CoffeeCustomizer`: Live interactive coffee & nutrition builder.
- `WhatsAppOrderDispatcher`: Server action formatting and dispatching orders to WhatsApp.

## Database Schemas (Mongoose)
- `CoffeeItem`: `{ name, hebrewName, category, price, roastLevel, origin, flavorNotes, imageUrl }`
- `Order`: `{ orderNumber, fullName, phone, deliveryAddress, items, totalPrice, status }`
- `User`: `{ name, email, passwordHash, phone, role, createdAt }`

