# Inventory Manager V0

A modern, responsive inventory management dashboard built with Next.js 14, React 18, and TypeScript. Features real-time data visualization, AI assistant integration, and a clean, accessible interface.

![Inventory Dashboard](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📊 **Interactive Dashboard**

- Real-time inventory statistics and metrics
- Responsive grid layout with dynamic content
- Light theme by default with dark mode support
- Cross-chart filtering and synchronization

### 📈 **Advanced Data Visualization**

- **Bar Charts**: Category-based inventory levels with interactive filtering
- **Pie Charts**: Stock distribution overview with detailed breakdowns
- **Line Charts**: 30-day inventory trends with trend analysis
- Mouse-following tooltips with comprehensive item information
- Color-coded status indicators (In Stock, In Transit, Out of Stock, Suggested)

### 🤖 **AI Assistant Integration**

- Built-in chatbot for inventory-related queries
- Context-aware responses and suggestions
- Seamless integration with dashboard data

### 🎨 **Modern UI/UX**

- Clean, minimalist design following modern design principles
- Fully responsive design for desktop and mobile devices
- Accessible components built with Radix UI primitives
- Smooth animations and transitions
- Theme switching (Light/Dark/System)

### 🔧 **Developer Experience**

- TypeScript for type safety
- ESLint configuration for code quality
- Hot reload during development
- Optimized build process

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **pnpm** (recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd InventoryManager_V0
   ```

2. **Install dependencies**

   ```bash
   # Using npm
   npm install

   # Using pnpm (recommended)
   pnpm install
   ```

3. **Start the development server**

   ```bash
   # Using npm
   npm run dev

   # Using pnpm
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
InventoryManager_V0/
├── app/                          # Next.js 14 app directory
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with theme provider
│   └── page.tsx                 # Main dashboard page
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card component
│   │   ├── dialog.tsx           # Modal dialog component
│   │   ├── input.tsx            # Input field component
│   │   ├── select.tsx           # Select dropdown component
│   │   └── ...                  # Other UI primitives
│   ├── dashboard.tsx            # Main dashboard component
│   ├── sidebar.tsx              # Navigation sidebar
│   ├── inventory-*.tsx          # Chart components
│   ├── theme-provider.tsx       # Theme management
│   ├── theme-toggle*.tsx        # Theme switching components
│   └── *-modal.tsx              # Modal components
├── data/                        # Sample data files
│   └── inventory-data.json      # Inventory data
├── lib/                         # Utility functions
│   └── utils.ts                 # Common utilities
├── public/                      # Static assets
│   ├── data/                    # Public data files
│   └── placeholder-*.png        # Placeholder images
├── styles/                      # Additional styles
├── components.json              # shadcn/ui configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🛠️ Available Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Build the application for production     |
| `npm run start` | Start the production server              |
| `npm run lint`  | Run ESLint for code quality checks       |

## 🎯 Key Features in Detail

### Dashboard Components

#### **Inventory Bar Chart**

- Displays inventory levels by category
- Interactive filtering on click
- Color-coded status indicators
- Responsive design with tooltips

#### **Inventory Pie Chart**

- Stock distribution overview
- Percentage-based visualization
- Detailed breakdown on hover
- Cross-chart filtering support

#### **Inventory Line Chart**

- 30-day inventory trends
- Trend analysis and forecasting
- Interactive data points
- Smooth animations

### Navigation & UI

#### **Sidebar Navigation**

- Icon-based navigation menu
- Pages: Dashboard, Inventory, Settings, Profile, Learning
- Collapsible design for mobile
- Active state indicators

#### **Theme System**

- Light theme by default
- Dark mode support
- System theme detection
- Persistent theme preferences

#### **Modal Components**

- AI Assistant chatbot
- Help and support modal
- Item detail views
- Settings configuration

## 🎨 Customization

### Color Scheme

The inventory status colors can be customized in the chart components:

```css
/* Default color scheme */
--in-stock: #10b981      /* Green */
--in-transit: #f59e0b    /* Yellow */
--out-of-stock: #ef4444  /* Red */
--suggested: #3b82f6     /* Blue */
```

### Data Integration

Replace the sample data with your actual inventory data:

1. **Update chart data arrays** in:

   - `components/inventory-bar-chart.tsx`
   - `components/inventory-pie-chart.tsx`
   - `components/inventory-line-chart.tsx`

2. **Modify data structure** to match your inventory schema

3. **Connect to your backend API** for real-time data

### Styling

- **Tailwind CSS**: Modify `tailwind.config.js` for custom design tokens
- **CSS Variables**: Update `app/globals.css` for theme customization
- **Component Styling**: Edit individual component files for specific styling

## 🛡️ Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📦 Dependencies

### Core Dependencies

- **Next.js 14.2.16** - React framework with app router
- **React 18** - UI library with concurrent features
- **TypeScript 5** - Type safety and developer experience
- **Tailwind CSS 3.3.0** - Utility-first CSS framework

### UI & Components

- **Radix UI** - Accessible UI primitives
- **Lucide React** - Beautiful, customizable icons
- **Recharts 2.8.0** - Composable charting library
- **class-variance-authority** - Component variant management

### Development Tools

- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

---

**Made with ❤️ for modern inventory management**
