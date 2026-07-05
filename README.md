# CapacityLens ![License](https://img.shields.io/badge/license-MIT-blue)

Lightweight capacity monitoring and forecasting SaaS tailored for Indonesian SMB hybrid clouds and regulated financial services.

## Features

* **Hybrid Cloud Integration**: Connect and manage AWS, GCP, Azure, and On-Premises infrastructure.
* **Resource Forecasting**: Linear regression modeling to predict CPU, Memory, and Disk exhaustion.
* **Indonesian Alerting**: Localized notifications triggered via WhatsApp or custom webhooks.
* **CSV Data Import**: Quick-start ingestion of historical metrics via CSV upload.
* **State Portability**: Export and import entire dashboard configurations as JSON.
* **Local-First Storage**: Zero-database architecture persisting state securely in `localStorage`.
* **Regulated Compliance**: Designed to meet local Indonesian data sovereignty requirements.

## Tech Stack

* **Framework**: Next.js 14 (App Router)
* **Styling**: Tailwind CSS
* **Language**: TypeScript
* **Deployment**: Cloudflare Pages / Static Hosting

## Getting Started

### Prerequisites

* Node.js 18+
* npm / pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/capacitylens.git
cd capacitylens

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```text
src/
├── app/
│   ├── dashboard/
│   │   ├── entities/
│   │   │   └── page.tsx      # Integration management UI
│   │   ├── layout.tsx        # Dashboard shell and navigation
│   │   └── page.tsx          # Main forecasting & metrics dashboard
│   └── layout.tsx            # Global layout and providers
└── lib/
    ├── store.tsx             # State management and localStorage sync
    ├── types.ts              # TypeScript interfaces
    └── utils.ts              # Linear regression and CSV helpers
```

## License

This project is licensed under the MIT License.