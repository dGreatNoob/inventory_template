# Inventory Management System

A comprehensive inventory management solution built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### ✅ Implemented
- **Dashboard** - Overview with KPIs, recent activity, and metrics
- **Inventory Management** - Product tracking, stock levels, batch management
- **Sales Orders** - Customer order management and processing
- **Purchase Orders** - Supplier order management and procurement
- **Stock In** - Inventory receiving workflow with QR code scanning
- **Shipping** - Shipping plans and delivery tracking
- **Finance** - Accounts receivable, payables, and expense tracking
- **Request Slips** - Internal request management and approvals
- **Activity Log** - Complete system activity tracking
- **User Management** - User profiles and role-based access
- **Notifications** - Real-time notification center
- **Theme Support** - Dark/light mode with system preference detection

### 🎨 UI Components
- Modern, responsive design with Tailwind CSS
- shadcn/ui component library
- Mobile-friendly navigation
- Professional dashboard layout
- Interactive data tables and forms

### 🔧 Technical Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd inventory_template
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Dashboard page
│   ├── inventory/         # Inventory management
│   ├── sales/            # Sales orders
│   ├── purchase-orders/  # Purchase orders
│   ├── stock-in/         # Stock receiving
│   ├── shipping/         # Shipping management
│   ├── finance/          # Financial management
│   ├── requests/         # Request slips
│   └── activity/         # Activity log
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── main-layout.tsx  # Main application layout
│   ├── dashboard.tsx    # Dashboard component
│   ├── inventory.tsx    # Inventory management
│   └── ...              # Other feature components
├── lib/                 # Utility functions
└── public/              # Static assets
```

## Available Pages

- **Dashboard** (`/`) - Main overview and KPIs
- **Inventory** (`/inventory`) - Product and stock management
- **Sales Orders** (`/sales`) - Customer order processing
- **Purchase Orders** (`/purchase-orders`) - Supplier order management
- **Stock In** (`/stock-in`) - Inventory receiving workflow
- **Shipping** (`/shipping`) - Shipping and delivery tracking
- **Finance** (`/finance`) - Financial management
- **Request Slips** (`/requests`) - Internal request system
- **Activity Log** (`/activity`) - System activity tracking

## Next Steps

### 🚀 To Make Production Ready

1. **Backend Integration**
   - Add API routes for CRUD operations
   - Implement database (PostgreSQL, MongoDB, etc.)
   - Add authentication system (NextAuth.js, Auth0, etc.)

2. **Data Management**
   - Add state management (Zustand, Redux Toolkit)
   - Implement data validation (Zod, Yup)
   - Add error handling and loading states

3. **Advanced Features**
   - Real-time updates with WebSockets
   - File upload for product images
   - Export functionality (PDF, Excel)
   - Advanced reporting and analytics

4. **Deployment**
   - Environment configuration
   - Database setup
   - CI/CD pipeline
   - Monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
