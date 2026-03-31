# RecyConnect

![RecyConnect Logo](./assets/images/logo.png)

**Turn Waste Into Wealth** - Premium marketplace connecting recyclers globally.

## 🌟 About

RecyConnect is a cutting-edge web application that revolutionizes the recycling industry by creating a seamless marketplace for buying and selling recyclable materials. Built with modern web technologies, it provides a platform where businesses and individuals can connect, trade, and contribute to a more sustainable circular economy.

### Key Features

- 🌍 **Geo-Located Marketplace** - Find materials near you instantly
- 💬 **Secure Chat System** - Encrypted negotiations between buyers and sellers
- 💰 **Smart Pricing** - Transparent pricing and offer management
- 🗺️ **Interactive Map** - Visualize available materials in your area
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🌙 **Dark/Light Themes** - Comfortable viewing in any environment
- 🌐 **Multi-language Support** - English and Arabic interface
- 🤖 **AI Assistant** - RecyBot for instant help and guidance

## 🚀 Demo

**Live Demo:** [https://recyconnect-demo.vercel.app](https://recyconnect-demo.vercel.app)

**GitHub Repository:** [https://github.com/AsmaaMostafaTech/RecyConnect_new](https://github.com/AsmaaMostafaTech/RecyConnect_new)

**Test Credentials:**
- Email: `ahmed@demo.com`
- Password: `demo123`

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Tailwind CSS + Custom CSS
- **Maps:** Leaflet.js
- **Fonts:** Google Fonts (Inter, Space Grotesk)
- **Storage:** LocalStorage (client-side)
- **Icons:** SVG Icons
- **Deployment:** Static hosting (Vercel, Netlify, GitHub Pages)

## 📁 Project Structure

```
RecyConnect/
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── app.js              # Main JavaScript application
├── assets/
│   ├── images/             # Image assets
│   └── icons/             # Icon files
├── index.html             # Main HTML file
├── index-backup.html      # Backup of original file
├── README.md              # This file
├── package.json           # Dependencies and scripts
├── .gitignore            # Git ignore rules
└── LICENSE               # MIT License
```

## 🛠️ Installation & Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AsmaaMostafaTech/RecyConnect_new.git
   cd RecyConnect_new
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   
   Or use any local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have http-server)
   npx http-server
   
   # Using Live Server in VS Code
   # Right-click index.html → "Open with Live Server"
   ```

4. **Open your browser:**
   Navigate to `http://localhost:8000`

## 🎯 Core Features

### Marketplace
- Browse recyclable materials by category
- Search and filter listings
- View detailed information about each listing
- Contact sellers directly

### Interactive Map
- Visual representation of available materials
- Filter by material type
- Click on markers for quick details

### Chat System
- Real-time messaging between users
- Secure communication channel
- Message history

### User Management
- Secure authentication system
- User profiles
- Listing management

### AI Assistant
- RecyBot for instant help
- Material pricing information
- Guidance and support

## 🎨 Design System

### Colors
- **Primary:** #22c55e (Green)
- **Secondary:** #16a34a (Dark Green)
- **Background:** #000000 (Dark) / #f8faf8 (Light)
- **Text:** #ffffff (Dark) / #0a0a0a (Light)

### Typography
- **Primary:** Inter (Clean, modern sans-serif)
- **Display:** Space Grotesk (Bold, impactful)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Configuration

### Environment Variables
The application uses client-side configuration. No environment variables required for basic functionality.

### Customization
You can customize the application by modifying:
- `css/styles.css` - Visual styling and themes
- `js/app.js` - Application logic and features
- `index.html` - Structure and content

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

### Deployment Options

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch

#### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.`

#### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Select source as `main` branch
3. Deploy automatically on push

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request to the main repository

### Development Guidelines
- Write clean, commented code
- Follow existing code style
- Test thoroughly before submitting
- Update documentation as needed

## 📝 API Documentation

### Local Storage API
The application uses localStorage for data persistence:

```javascript
// Get data
const listings = DB.get('listings');

// Set data
DB.set('listings', newListings);
```

### Key Data Structures

#### Listing Object
```javascript
{
  id: 1234567890,
  title: "HDPE Plastic Scrap",
  category: "Plastic",
  quantity: 500,
  price: 250,
  location: "Dubai",
  lat: 25.20,
  lng: 55.27,
  description: "Clean industrial plastic",
  sellerId: "u1",
  sellerName: "Ahmed",
  createdAt: 1234567890123,
  views: 12
}
```

#### User Object
```javascript
{
  id: "u1",
  firstName: "Ahmed",
  email: "ahmed@demo.com",
  password: "demo123"
}
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Create/edit/delete listings
- [ ] Search and filter functionality
- [ ] Map interactions
- [ ] Chat functionality
- [ ] Theme switching
- [ ] Language switching
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Automated Testing (Future)
```bash
npm run test
```

## 🐛 Troubleshooting

### Common Issues

**Map not loading:**
- Check internet connection
- Ensure Leaflet CSS and JS are loading correctly
- Verify no browser extensions blocking the map

**Chat not working:**
- Check localStorage permissions
- Verify JavaScript is enabled
- Clear browser cache and reload

**Mobile layout issues:**
- Ensure viewport meta tag is present
- Test with device simulation in browser dev tools

### Getting Help
- Open an issue on GitHub
- Check existing issues and discussions
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Leaflet.js** - Interactive maps
- **Tailwind CSS** - Utility-first CSS framework
- **Google Fonts** - Typography
- **Font Awesome** - Icons (inspiration)

## 📞 Contact

- **Website:** [https://recyconnect.com](https://recyconnect.com)
- **Email:** info@recyconnect.com
- **GitHub:** [https://github.com/AsmaaMostafaTech/RecyConnect_new](https://github.com/AsmaaMostafaTech/RecyConnect_new)
- **Twitter:** [@RecyConnect](https://twitter.com/RecyConnect)

---

**Made with ❤️ for a sustainable future**
