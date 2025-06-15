# Inventory Dashboard

A minimalist inventory management dashboard built with Next.js, React, and Material Design principles.

## Features

- **Interactive Dashboard**: Real-time inventory visualization with charts and graphs
- **Material Design**: Clean, minimalist interface following Material Design patterns
- **Interactive Charts**: Bar charts, pie charts, and line charts with hover effects and filtering
- **AI Assistant**: Built-in chatbot for inventory-related queries
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Color-coded Inventory**: Green (in stock), Yellow (in transit), Red (out of stock), Blue (suggested)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download the project files
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
inventory-dashboard/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main page component
├── components/            # React components
│   ├── ui/               # UI components (buttons, cards, etc.)
│   ├── dashboard.tsx     # Main dashboard component
│   ├── sidebar.tsx       # Navigation sidebar
│   ├── *-chart.tsx       # Chart components
│   └── *-modal.tsx       # Modal components
├── lib/                  # Utility functions
└── package.json          # Dependencies and scripts
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icons

## Features Overview

### Dashboard
- Real-time inventory statistics
- Interactive charts with filtering
- AI assistant integration
- Responsive grid layout

### Charts
- **Bar Chart**: Inventory levels by category
- **Pie Chart**: Stock distribution overview
- **Line Chart**: 30-day inventory trends
- Mouse-following tooltips with detailed information

### Navigation
- Sidebar with icon-based navigation
- Pages: Home, Inventory, Settings, Profile, Learning
- Modal actions: AI Assistant, Help/Support

### Interactive Features
- Click to filter charts by category
- Hover effects with opacity changes
- Cross-chart filtering
- Detailed tooltips with item breakdowns

## Customization

### Colors
The inventory color scheme can be modified in the chart components:
- Green: `#10b981` (In Stock)
- Yellow: `#f59e0b` (In Transit) 
- Red: `#ef4444` (Out of Stock)
- Blue: `#3b82f6` (Suggested)

### Data
Sample data is included in the chart components. Replace with your actual inventory data by modifying the `data` arrays in:
- `components/inventory-bar-chart.tsx`
- `components/inventory-pie-chart.tsx`
- `components/inventory-line-chart.tsx`

## License

This project is open source and available under the MIT License.
