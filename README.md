# 3D Data Scope 📊

> Transform your CSV data into stunning 3D visualizations

An interactive web-based platform for visualizing and exploring CSV data in 3D space. Upload your data, map columns to axes, and explore patterns in an immersive 3D environment.

![Version](https://img.shields.io/badge/version-0.4.0-blue)
![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-0.179-black?logo=three.js)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🚀 Core Functionality
- **CSV Upload**: Drag & drop or file selection with up to 50MB support
- **Sample Data Trial**: Instantly try the app with pre-loaded sample data
- **Smart Mapping**: Map any 3 numeric columns to X/Y/Z axes
- **Color Encoding**: Optional 4th column for color-coded visualization
- **3D Visualization**: Real-time rendering using Three.js and React Three Fiber

### 🎮 Interactive Controls
- **Camera Controls**: Rotate, zoom, and pan with intuitive mouse/touch controls
- **Real-time Adjustments**: Live GUI controls for:
  - Point size and opacity
  - Point spacing and labels
  - Grid and axis display
  - Plane intersections (XZ/YZ)
- **Data Preview**: View your data in table format before visualization

### 🎨 User Experience
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **English Interface**: Complete English localization
- **Clean Design**: Modern, intuitive UI with Tailwind CSS
- **Fast Loading**: Optimized for large datasets

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.1.1** with TypeScript
- **Vite** for blazing-fast development
- **React Router DOM** for navigation

### 3D Rendering
- **Three.js 0.179** - WebGL rendering engine
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Leva** - Real-time GUI controls

### State Management & Data
- **Zustand** - Lightweight state management
- **PapaParse** - CSV parsing
- **D3.js** - Color scales and statistics

### Styling
- **Tailwind CSS 4.1** - Utility-first CSS framework

## 📁 Project Structure

This project follows **Feature-Sliced Design (FSD)** architecture:

```
src/
├── app/              # App initialization & routing
├── pages/            # Page-level components
│   ├── UploadPage/   # File upload & sample data
│   ├── MappingPage/  # Axis mapping configuration
│   └── ViewerPage/   # 3D visualization
├── widgets/          # Complex UI blocks
│   ├── FileUploader/
│   ├── AxisMapper/
│   ├── SceneViewer/
│   └── CSVTutorial/
└── shared/           # Reusable modules
    ├── ui/           # Common components
    ├── lib/          # Utilities (CSV parser, validation)
    ├── types/        # TypeScript definitions
    └── zustand/      # Global state stores
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/RyuDongHo/3D_Data_Scope.git
cd 3D_Data_Scope
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## 📊 Usage

### 1. Upload Your Data
- Click "Choose File" or drag & drop a CSV file (max 50MB)
- Or try "Try with Sample Data" for instant demo

### 2. Map Your Axes
- Select 3 numeric columns for X, Y, Z axes
- Optionally choose a 4th column for color encoding
- View data statistics and preview

### 3. Explore in 3D
- Rotate: Left mouse button + drag
- Zoom: Mouse wheel
- Pan: Right mouse button + drag
- Adjust visualization parameters with GUI controls

## 📋 CSV Format Guidelines

### Requirements
- At least **3 numeric columns** (for X, Y, Z axes)
- Maximum file size: **50MB**
- UTF-8 encoding recommended

### Example CSV
```csv
Name,Age,Height,Weight,Grade
John,25,175.5,70.2,A
Jane,30,162.3,55.8,B
Mike,28,180.1,75.5,A
Sarah,26,168.0,60.1,B
```

In this example, Age, Height, and Weight can be used as X/Y/Z axes.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Dependencies

```json
{
  "react": "^19.1.1",
  "three": "^0.179.1",
  "@react-three/fiber": "^9.3.0",
  "@react-three/drei": "^10.7.4",
  "zustand": "^5.0.8",
  "papaparse": "^5.4.1",
  "leva": "^0.10.0",
  "react-router-dom": "^7.8.2"
}
```

## 🗺️ Roadmap

### ✅ Completed (v0.4)
- [x] MVP implementation (Upload → Mapping → Viewer)
- [x] Full English localization
- [x] Sample data trial feature
- [x] Clean UI (removed overlay panels)
- [x] Flexible CSV input (header optional)
- [x] SEO optimization

### 🔄 In Progress
- [ ] Range-based filtering (FilterPanel)
- [ ] Visual customization panel (colors, themes)

### 📅 Planned (v1.0+)
- [ ] Outlier detection (IQR, Z-score)
- [ ] Clustering analysis (K-means, DBSCAN)
- [ ] PNG export
- [ ] Filtered CSV export
- [ ] Point selection and inspection
- [ ] Animation and transitions
- [ ] Multi-dataset support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**RyuDongHo**
- GitHub: [@RyuDongHo](https://github.com/RyuDongHo)

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) for 3D rendering
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for React integration
- [PapaParse](https://www.papaparse.com/) for CSV parsing
- [Zustand](https://docs.pmnd.rs/zustand) for state management

---

**Made with ❤️ for data visualization enthusiasts**
