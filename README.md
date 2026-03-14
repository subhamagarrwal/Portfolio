# Subham Agarwal - Portfolio Website

A modern, interactive portfolio website showcasing my work as a Full Stack Developer & Machine Learning Enthusiast. Built with React, TypeScript, and featuring a beautiful glassmorphism design with dynamic day/night themes.

## 🌟 Features

### 🎨 Design & UI
- **Glassmorphism Design**: Modern glass-like components with backdrop blur effects
- **Dynamic Themes**: Automatic time-based theme switching (Day/Afternoon/Evening/Night)
- **Responsive Layout**: Optimized for all devices from mobile to desktop
- **Smooth Animations**: Framer Motion-like transitions and interactive elements
- **Glass Dock Navigation**: Apple-inspired floating navigation dock

### 🎯 Interactive Elements
- **Time Control**: Manual time override to preview different themes
- **Cosmic Backgrounds**: Animated starfields and atmospheric effects
- **Hover Effects**: Smooth scale and glow animations
- **Touch-Friendly**: Optimized for mobile touch interactions

### 📱 Mobile Optimization
- **Stable Positioning**: Rock-solid dock positioning across all devices
- **Touch Interactions**: Gesture-friendly navigation
- **Viewport Stability**: No layout jumps or content shifts
- **Progressive Enhancement**: Works great on all screen sizes

## 🛠 Technologies Used

### Frontend Framework
- **React 18.3.1** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and development server

### Styling & UI
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Radix UI** - Unstyled, accessible component primitives
- **CSS Backdrop Filter** - Native glassmorphism effects

### Icons & Assets
- **Lucide React** - Beautiful, customizable SVG icons
- **Custom SVG Graphics** - Hand-crafted illustrations and patterns

### Utilities & Libraries
- **clsx** - Conditional className utility
- **class-variance-authority** - Component variant management
- **tailwind-merge** - Intelligent Tailwind class merging
- **date-fns** - Modern JavaScript date utility library

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **TypeScript Compiler** - Type checking and compilation

## 🏗 Project Structure

```
Portfolio/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── GlassDock.tsx    # Main navigation dock
│   │   ├── HeroSection.tsx  # Landing section
│   │   ├── AboutSection.tsx # About me section
│   │   ├── ProjectsSection.tsx # Projects showcase
│   │   ├── SkillsSection.tsx   # Technical skills
│   │   └── ...             # Theme variants for each section
│   ├── contexts/
│   │   └── TimeThemeContext.tsx # Theme management
│   ├── hooks/
│   │   ├── useTimeTheme.ts  # Custom theme hook
│   │   └── use-mobile.tsx   # Mobile detection
│   ├── data/
│   │   └── portfolio.json   # Portfolio content data
│   └── lib/
│       └── utils.ts         # Utility functions
├── public/                  # Static assets
└── ...                     # Config files
```

## 🎨 Design Philosophy

### Glassmorphism Aesthetic
- **Transparency**: Semi-transparent backgrounds with blur effects
- **Depth**: Layered elements with subtle shadows and borders
- **Interactivity**: Responsive hover states and smooth transitions
- **Accessibility**: High contrast ratios and keyboard navigation

### Time-Based Theming
- **Morning (6-12 AM)**: Light blue, fresh and energetic
- **Afternoon (12-6 PM)**: Warm golden tones, vibrant and bright
- **Evening (6-9 PM)**: Sunset oranges and purples, cozy atmosphere
- **Night (9 PM-6 AM)**: Deep cosmic blues with starfields, calm and focused

## 📋 Getting Started

### Prerequisites
- Node.js 16+ and npm (recommend using [nvm](https://github.com/nvm-sh/nvm))

### Installation

```sh
# Clone the repository
git clone https://github.com/subhamagarrwal/portfolio.git

# Navigate to project directory
cd portfolio/Portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```sh
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## 🎯 Key Components

### ⚙️ Core Mechanics: Time Dialer & Dynamic Background

#### 🕰️ The Interactive Time Dialer
The Time Dialer allows users to override the real-time environment and manually scroll the website through different times of the day.
- **Geometry-based interaction**: The circular dial tracks mouse or touch coordinates relative to the dial's exact center. Using `Math.atan2()`, the application calculates the angle of the pointer, offsets the angle so 12:00 PM is at the very top, and maps the 360-degree rotation precisely to a 24-hour time format.
- **Real-time Sync**: Moving the dial immediately updates local state and dispatches a custom `manualTimeChange` event, which rapidly updates the background's time context at up to 60fps. 

#### 🌄 Dynamic Mountain Environment
The immersive landscape shifts seamlessly based on either the real-world time or the Time Dialer's selected hour.
- **Geolocation & SunCalc**: We use the browser's Geolocation API alongside the `suncalc` library to define realistic phase timelines. Sunrise and sunset times aren't hardcoded; they are physically calculated based on your specific latitude and longitude. 
- **Time Phase Interpolation**: The background gracefully moves through 8 keyframes spanning from *Deep Night* to *High Noon*. As the time changes, CSS Custom Properties directly update to fluidly interpolate the RGB colors of the sky, layered mountains, and ground in real-time.
- **Celestial Physics**: 
  - The **Sun** rises and sets on a sine wave trajectory, increasing its glow (intensity) dynamically as it approaches the peak altitude.
  - The **Moon** mirrors the sun, traversing the sky precisely during the "night" phase calculated by SunCalc.
  - **Atmosphere**: Elements like glowing fireflies, star fields, and global illumination dynamically fade in and out depending on the active phase.

### Glass Dock Navigation
- **Stable Positioning**: Always centered, never jumps
- **Touch Optimized**: Perfect sizing for mobile interaction
- **Visual Feedback**: Hover effects and active states
- **Theme Integration**: Adapts to current time-based theme

### Time Control System
- **Manual Override**: Switch between different times of day
- **Smooth Transitions**: Seamless theme switching
- **Overlay Design**: Non-intrusive time slider interface
- **Auto Mode**: Returns to automatic time-based theming

### Responsive Design
- **Mobile-First**: Optimized for mobile devices primarily
- **Breakpoint System**: Tailored layouts for different screen sizes
- **Touch-Friendly**: Large, accessible touch targets
- **Performance**: Optimized animations and loading

## 🌍 Deployment

This project can be deployed on any static hosting platform:

### Recommended Platforms
- **Vercel** - Automatic deployments from Git
- **Netlify** - Simple drag-and-drop deployment
- **GitHub Pages** - Free hosting for public repositories
- **CloudFlare Pages** - Fast global CDN

### Build Process
```sh
npm run build
# Creates a 'dist' folder ready for deployment
```

## 📧 Contact

- **Email**: subhamag2003@gmail.com
- **LinkedIn**: [Subham Agarwal](https://www.linkedin.com/in/subham-agarwal-99386222a/)
- **GitHub**: [subhamagarrwal](https://github.com/subhamagarrwal)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ by Subham Agarwal*
