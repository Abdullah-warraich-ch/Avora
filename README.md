# Avora — Luxury Bag Interactive Showcase

Avora is a premium, high-fidelity e-commerce product explorer built with React, Vite, Tailwind CSS v4, and Framer Motion. It delivers a fluid, immersive shopping experience designed to feel elite and organic.

---

## ✨ Features & Micro-Interactions

### 1. Dynamic Split-Screen Layout
- **Left Panel (Hero Detail)**: Displays price, title, descriptions, and dynamic call-to-action buttons.
- **Right Panel (Product Selector)**: Houses user profile data and lists unselected product thumbnails. On selection, the list reorders fluidly, moving the old selection back into the queue.
- **Overlapping Central Product**: A high-resolution central image that acts as the focal anchor, floating between the two halves.

### 2. Framer Motion Shared Element Transitions
- Swapping bags triggers a seamless image "fly-in/fly-out" shared layout animation between the explorer preview thumbnails and the central main display using Framer Motion's `layoutId` layout-projection system.
- Background colors cross-fade smoothly between custom gradient pairs matching each product’s unique palette.

### 3. Dynamic Browser Tab Favicon
- A custom hook updates the browser tab's favicon in real-time to match the thumbnail of the selected product, reinforcing high-end branding.

### 4. Interactive Drawers (Sidebars)
- **Menu Sidebar (Left)**: Slides in with spring-loaded physics, carrying staggered nav link entrances. The background dynamically inherits the active product's gradient color.
- **Shopping Cart Sidebar (Right)**: Slides from the right, featuring interactive count addition/subtraction controllers, clear-item trashcan actions, and real-time subtotal calculation.

### 5. Time-Warp Checkout Easter Egg
- Clicking the **Checkout** button displays a 1-second spinning "Processing..." button loader.
- After processing, it loads a clean, minimalist confirmation page indicating that delivery will occur in the next **2 million years**, accompanied by a live, ticking digital countdown timer down to the second.
- Click "Continue Shopping" to clear the cart and return to the main interface.

---

## 🛠️ Technology Stack

- **Framework**: React (Vite-powered HMR dev server)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion (State-driven layouts, spring physics, layout projection)
- **Fonts**: Google Fonts
  - *Playfair Display* (Header headings)
  - *Plus Jakarta Sans* (Body/UI elements)

---

## 📂 Folder Structure

```
Avora/
├── index.html                   # HTML entry point (fonts & stylesheets injection)
├── package.json                 # Dependency manifests
├── src/
│   ├── App.jsx                  # Main component wrapper
│   ├── index.css                # Global styles & Tailwind configuration
│   ├── main.jsx                 # Client mounting point
│   ├── data/
│   │   └── bagsData.js          # Product attributes (names, descriptions, gradients, image paths)
│   └── components/
│       ├── BagShowcase.jsx      # Root showcase controller, search logic & layout
│       ├── MenuSidebar.jsx      # Dynamic matching-color left menu drawer
│       ├── CartSidebar.jsx      # Shopping cart sidebar & quantity controller
│       └── SuccessPage.jsx      # Time-warp confirmation modal & ticking clock
```

---

## 🚀 Getting Started

### Installation

Clone the repository and install dependencies:
```bash
npm install
```

### Run Locally

Launch the Vite hot-reloading development server:
```bash
npm run dev
```

### Production Build

Compile the production bundle:
```bash
npm run build
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
