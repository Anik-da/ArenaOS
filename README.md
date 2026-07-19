# ARES AI: Autonomous Recreation & Event Sports Intelligence

ARES AI is a production-ready, high-performance operating system designed for smart stadium management, real-time tournament operations, crowd intelligence, utility tracking, and interactive fan experiences.

## 🚀 Key Features

* **Mission Control Telemetry**: Real-time monitoring of gates, crowds, parking, and utility operations.
* **Interactive Digital Twin**: Interactive 2D SVG maps showing live sector status, cameras, drone feeds, and emergency dispatch locations.
* **AI Copilot (Hugging Face / Llama 3)**: Natural language operations assistant providing diagnostic feedback based on real-time telemetry logs.
* **NASA-style CommandCenter**: Real-time telemetry log feeds and emergency vehicle routing logs.
* **Performant Analytics**: High-fidelity responsive data visualization (Area, Pie, Bar charts) powered by Recharts.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: Next.js 14 (App Router) & React 18
* **Styling**: Vanilla CSS with Tailwind CSS utilities
* **Animations**: Framer Motion & GSAP (for 60 FPS transitions)
* **Real-time Data**: Socket.IO Client / WebSockets

### Backend
* **Server**: Node.js, Express, TypeScript
* **Database**: Cloud Firestore (Firebase Admin SDK)
* **AI Inference**: Hugging Face Inference API
* **Scaling**: Redis-backed Socket.IO adapter for horizontal event broadcasting

---

## ⚙️ Environment Configuration

Create a `.env.local` file inside the root folder `Axes/` for frontend configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Create a `.env` file inside `Axes/backend/` for backend services configuration:
```env
PORT=3001
FIREBASE_CREDENTIAL_BASE64=your-base64-encoded-service-account-json
HUGGINGFACE_TOKEN=your-huggingface-inference-token
REDIS_URL=redis://localhost:6379
```

---

## 💻 Local Development

### 1. Install Dependencies
Run from the root of the `Axes` directory:
```bash
npm install
cd backend && npm install
```

### 2. Start the Platform
You can run both the frontend and backend concurrently from the root directory:
```bash
npm run dev
```
* Frontend will run on: [http://localhost:3000](http://localhost:3000)
* Backend will run on: [http://localhost:3001](http://localhost:3001)

---

## 🧪 Testing

The platform leverages **Vitest** for quick, isolated unit testing.

To run the unit test suite, execute from the root directory:
```bash
npm run test
```

This runs the backend test cases covering:
* **AI Copilot**: Verifying chat completions, client request timeouts, and fallback responses.
* **Digital Twin**: Verifying parallel Firestore queries and layer/seat telemetry state updates.

---

## 🚢 Production Deployment

### Frontend (Firebase Hosting)
To build and deploy the Next.js static application:
```bash
# Build the optimized production bundle
npm run build

# Deploy to Firebase Hosting
npx firebase-tools deploy --only hosting
```

---

## ⚡ Recent Optimizations (Enterprise Hardening)

* **Performance (Query Parallelization)**: Enforced parallel data retrieval for the digital twin state using `Promise.all` in the backend service, minimizing Firestore sequential I/O blockages.
* **AI Timeout Handling**: Integrated timeout logic in external Hugging Face chatbot calls (2.0s fail-fast threshold) with automated fallback query matching to ensure the interface never hangs.
* **Accessibility (WCAG 2.2 AA Compliance)**:
  * Resolved nested/duplicate `<h1>` titles by allowing the `AnimatedText` component to render as a `span` tag in the Hero section.
  - Configured standard interactive tags (`aria-label`, `aria-expanded`, `aria-pressed`) across all toolbars, mobile navigation switches, dialog closures, and forms.
  - Wrapped Recharts widgets and telemetry SVG animations in parent wrappers with `role="img"` and descriptive label configurations.
