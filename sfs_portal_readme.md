# 🏠 SFS Pricing Portal

> **Victory Foods & Customer Pricing Portal - Complete Supply Chain Analysis**

A comprehensive web application for managing and analyzing SFS (Specialty Food Service) pricing data, with advanced database connectivity, real-time search, and detailed analytics dashboards.

![SFS Portal Preview](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Database](https://img.shields.io/badge/Database-Supabase-green)

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [File Structure](#-file-structure)
- [Usage Guide](#-usage-guide)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Database Connectivity** - Connects to Supabase MPC database with automatic fallback
- **Advanced Search & Filtering** - Real-time search across SKU, description, brand, customer, and category
- **Comprehensive Pricing Analysis** - Complete supply chain cost breakdown (EXW → FOB → DDP → Net)
- **Interactive Data Tables** - Sortable, paginated tables with responsive design
- **Custom Analytics Dashboard** - Detailed charts and insights for specific SKUs

### 📊 Data Management
- **Multiple Data Loading Strategies** - Comprehensive joins, basic joins, individual tables, fallback modes
- **Sample Data Mode** - Built-in demo data when database is unavailable
- **Error Handling & Recovery** - Graceful degradation with user-friendly error messages
- **Debug System** - Comprehensive logging and debugging tools

### 🎨 User Interface
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Professional Modals** - Detailed item views with custom SKU-specific layouts
- **Interactive Charts** - Visual cost breakdowns and analytics
- **Modern UI/UX** - Clean, intuitive interface with smooth animations

### 🔧 Technical Features
- **Modular Architecture** - Professional code organization with separation of concerns
- **Performance Optimized** - Efficient data loading and rendering
- **Browser Compatible** - Works across all modern browsers
- **Offline Capabilities** - Functions with sample data when offline

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (local or remote)
- Supabase account (optional, has demo mode)

### 30-Second Setup
1. **Download the project files**
2. **Open in web server** (see installation options below)
3. **Access the application** - Navigate to `index.html`
4. **View demo data** - Click "📊 Load Sample Data" to see the interface

That's it! The portal will work with sample data immediately.

## 💻 Installation

### Option 1: Local Development Server (Recommended)

**Using Python:**
```bash
cd SFS-Pricing-Portal
python -m http.server 8000
# Open: http://localhost:8000
```

**Using Node.js:**
```bash
npm install -g http-server
cd SFS-Pricing-Portal
http-server -p 8000
# Open: http://localhost:8000
```

**Using PHP:**
```bash
cd SFS-Pricing-Portal
php -S localhost:8000
# Open: http://localhost:8000
```

### Option 2: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

### Option 3: Static Hosting (Production)

**Netlify (Free):**
1. Drag & drop project folder to [netlify.com](https://netlify.com)
2. Get instant HTTPS URL

**Vercel (Free):**
1. Connect GitHub repository to [vercel.com](https://vercel.com)
2. Automatic deployments

**GitHub Pages:**
1. Push to GitHub repository
2. Enable Pages in repository settings

## ⚙️ Configuration

### Database Setup

1. **Update Database Credentials** in `js/config.js`:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key-here';
```

2. **Configure Application Settings** in `js/config.js`:
```javascript
const CONFIG = {
    DEBUG_MODE: false,  // Set to false for production
    DEFAULT_ITEMS_PER_PAGE: 50,
    SEARCH_DEBOUNCE_DELAY: 300,
    // ... other settings
};
```

### Environment Variables (Production)
For production deployments, use environment variables:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
DEBUG_MODE=false
```

## 📁 File Structure

```
SFS-Pricing-Portal/
├── 📄 index.html              # Main HTML structure
├── 📄 README.md               # This documentation
├── 📁 css/                    # Stylesheets
│   ├── 🎨 styles.css          # Main application styles
│   ├── 🎨 components.css      # Component-specific styles
│   └── 🎨 modals.css          # Modal and overlay styles
└── 📁 js/                     # JavaScript modules
    ├── ⚙️ config.js           # Configuration & constants
    ├── 🛠️ utils.js            # Utility functions & helpers
    ├── 🗃️ database.js         # Database connection & queries
    ├── 🔄 data-processing.js  # Data transformation & processing
    ├── 📊 table-renderer.js   # Table rendering & interactions
    ├── 🪟 modals.js           # Modal creation & management
    └── 🚀 app.js              # Main application logic
```

### Module Responsibilities

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| **config.js** | Application configuration | Database credentials, settings, constants |
| **utils.js** | Utility functions | Logging, formatting, status updates |
| **database.js** | Database operations | Connection testing, data fetching, queries |
| **data-processing.js** | Data transformation | Processing, mapping, sample data creation |
| **table-renderer.js** | UI rendering | Table display, row creation, interactions |
| **modals.js** | Modal management | Detail views, custom modals, analytics |
| **app.js** | Application coordination | Initialization, event handling, routing |

## 📖 Usage Guide

### Basic Operations

#### 🔍 **Searching Data**
- Type in the search box to filter items in real-time
- Search works across: SKU, Description, Brand, Customer, Category
- Clear search to show all items

#### 📊 **Viewing Item Details**
- Click any table row to open detailed modal
- **Special SKU 440173** shows enhanced analytics view
- Modal includes complete cost breakdown and supply chain info

#### 📈 **Analytics Dashboard**
- Click the "📈" button on any item for price history
- View comprehensive cost analysis and market positioning
- Compare against competitor pricing

#### 🏭 **Vendor Information**
- Click the "🏭" button for vendor/factory details
- Shows contact information, lead times, and pricing

### Advanced Features

#### 🔍 **Database Analysis**
- Click "🔍 Analyze Database" to inspect available tables
- View real-time connection status and data availability
- Debug database connectivity issues

#### 🐛 **Debug Mode**
- Click "🐛 Show Debug Info" to view detailed logs
- Monitor database queries and response times
- Troubleshoot connectivity issues

#### 📊 **Demo Mode**
- Click "📊 Load Sample Data" to use demo data
- Perfect for testing and demonstrations
- Includes realistic Victory Foods pricing data

## 🗃️ Database Schema

### Required Tables

The application expects these Supabase tables:

#### **Core Tables**
- `items` - Product catalog and specifications
- `customers` - Customer information and contacts  
- `vendors` - Supplier/factory information
- `pricing_breakdown` - Main pricing data with cost components

#### **Supplementary Tables**
- `customer_price_history` - Historical pricing by customer
- `vendor_price_history` - Historical vendor pricing
- `price_quarters` - Quarterly pricing periods
- `container_logistics` - Shipping and logistics data
- `info_sheet_processing_log` - File processing history

### Key Relationships
```sql
pricing_breakdown
├── item_id → items.id
├── customer_id → customers.id
└── quarter_id → price_quarters.id

vendor_price_history
├── vendor_id → vendors.id
└── item_id → items.id
```

## 🔌 API Reference

### Database Functions

#### `fetchFromDatabase(endpoint, options)`
```javascript
// Fetch items with basic info
const items = await fetchFromDatabase('items?select=*&limit=100');

// Complex join query
const pricing = await fetchFromDatabase(
    'pricing_breakdown?select=*,items(*),customers(*)'
);
```

#### `analyzeDatabaseStructure()`
```javascript
// Analyze available tables and structure
const analysis = await analyzeDatabaseStructure();
console.log(analysis.items.available); // true/false
```

### Utility Functions

#### `formatCurrency(amount)`
```javascript
formatCurrency(23.89); // Returns: "$23.89"
```

#### `getMarginClass(margin)`
```javascript
getMarginClass(18.5); // Returns: "margin-good"
getMarginClass(12.0); // Returns: "margin-danger"
```

## 🌐 Deployment

### Production Checklist

- [ ] Update database credentials in `config.js`
- [ ] Set `DEBUG_MODE: false` in configuration
- [ ] Test all functionality with real data
- [ ] Verify responsive design on mobile devices
- [ ] Configure HTTPS for production domain
- [ ] Set up error monitoring (optional)
- [ ] Configure backup and recovery procedures

### Performance Optimization

#### **Frontend Optimizations**
- CSS and JS files are already minified-ready
- Images and assets are optimized
- Lazy loading implemented for large datasets

#### **Database Optimizations**
- Efficient query strategies with multiple fallback options
- Connection pooling supported
- Caching implemented for repeated queries

### Security Considerations

#### **Database Security**
- Uses Supabase Row Level Security (RLS)
- API keys have limited permissions (anon key)
- No sensitive data exposed in frontend code

#### **Application Security**
- Input validation on all user inputs
- XSS protection through proper escaping
- CSRF protection via SameSite cookies

## 🔧 Troubleshooting

### Common Issues

#### **Database Connection Failed**
```
❌ Symptom: "Database connection failed" error
✅ Solution: 
1. Check SUPABASE_URL and SUPABASE_KEY in config.js
2. Verify network connectivity
3. Test with "📊 Load Sample Data" to confirm app works
4. Check browser console for specific error messages
```

#### **No Data Displayed**
```
❌ Symptom: Empty table or "No items found"
✅ Solution:
1. Click "🔍 Analyze Database" to check table availability
2. Verify database has data in required tables
3. Check browser console for query errors
4. Use sample data to test UI functionality
```

#### **Search Not Working**
```
❌ Symptom: Search box doesn't filter results
✅ Solution:
1. Ensure JavaScript is enabled in browser
2. Check browser console for JavaScript errors
3. Verify search input has correct ID "searchInput"
4. Test with sample data first
```

#### **Modals Not Opening**
```
❌ Symptom: Clicking rows doesn't open detail modal
✅ Solution:
1. Check browser console for JavaScript errors
2. Verify modal HTML structure is intact
3. Test with different browsers
4. Ensure CSS files are loading properly
```

### Debug Tools

#### **Browser Developer Tools**
1. **Console Tab** - View JavaScript errors and debug logs
2. **Network Tab** - Monitor database API calls
3. **Elements Tab** - Inspect HTML structure and CSS

#### **Application Debug Features**
- **Debug Toggle** - Shows detailed application logs
- **Database Analysis** - Reveals table structure and availability
- **Connection Status** - Real-time database connectivity status

### Performance Issues

#### **Slow Loading**
- Check network connectivity to Supabase
- Monitor browser console for slow queries
- Consider implementing pagination for large datasets

#### **High Memory Usage**
- Limit query results with appropriate LIMIT clauses
- Clear debug logs periodically
- Avoid keeping large datasets in memory

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** and test thoroughly
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Create Pull Request**

### Coding Standards

- **JavaScript**: ES6+ syntax, consistent naming conventions
- **CSS**: BEM methodology, mobile-first responsive design
- **HTML**: Semantic markup, accessibility considerations
- **Comments**: Comprehensive documentation for all functions

### Testing Guidelines

- Test all functionality with both real and sample data
- Verify responsive design on multiple screen sizes
- Check browser compatibility (Chrome, Firefox, Safari, Edge)
- Validate database queries and error handling

## 📞 Support

### Getting Help

- **Documentation Issues**: Check this README and inline code comments
- **Database Problems**: Verify Supabase configuration and table structure
- **Feature Requests**: Use the application's debug mode to understand current capabilities
- **Bug Reports**: Include browser console output and steps to reproduce

### Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [JavaScript MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS Grid & Flexbox Guide](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎉 Acknowledgments

- **Victory Foods** - Primary use case and data structure inspiration
- **Supabase** - Database platform and real-time capabilities
- **Modern Web Standards** - ES6+, CSS Grid, Fetch API

---

**Made with ❤️ for efficient supply chain management**

*For additional support or custom implementations, refer to the troubleshooting section or review the comprehensive code documentation.*