# Profocto

<div align="center">
  <img src="public/assets/logo.png" alt="Profocto Logo" width="100" height="100">
  
  **Profile Élegante - An elegant and modern resume builder application built with Next.js**
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://profocto.tech)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/NiranjanKumar001/Profocto)
  [![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
</div>

---

## � Screenshots

<div align="center">
  <img src="https://ik.imagekit.io/profocto/Screenshot%202025-09-29%20122924.png?updatedAt=1759129229692" alt="Profocto Website Preview" width="800">
  <p><em>Modern, elegant interface for creating professional resumes</em></p>
</div>

<div align="center">
  <img src="public/assets/resume.jpg" alt="Resume Template Preview" width="600">
  <p><em>Professional resume templates with real-time editing</em></p>
</div>

## �🚀 Live Demo

**🌐 Try it now:** [https://profocto.tech](https://profocto.tech)

Create professional resumes in minutes with our intuitive, modern interface.

## ✨ Key Features

### 🎨 **Design & Templates**
- **Multiple Professional Templates** - Choose from carefully crafted resume layouts
- **Modern UI/UX** - Clean, elegant design with smooth animations
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices
- **Dark/Light Theme Support** - Comfortable viewing in any environment

### 🔐 **Authentication & Data**
- **Secure Google OAuth** - Quick and safe sign-in process
- **Real-time Database** - Powered by Convex for instant updates
- **Auto-save** - Never lose your progress
- **Cloud Sync** - Access your resumes from anywhere

### ⚡ **User Experience**
- **Drag & Drop Interface** - Intuitive content organization
- **Live Preview** - See changes in real-time
- **Editable Sections** - All form fields are customizable
- **Export Options** - Download as PDF or share online
- **Creative Logout Animation** - Delightful user interactions

### 🛠️ **Advanced Features**
- **Dynamic Skill Management** - Add/remove skills with categories
- **Social Media Integration** - Link your professional profiles
- **Custom Loading States** - Smooth transitions and feedback
- **SEO Optimized** - Better discoverability

## 🛠️ Tech Stack

### **Core Technologies**

| **Category** | **Technology** | **Version** | **Purpose** |
|--------------|----------------|-------------|-------------|
| **Framework** | Next.js | 15.x | React framework with App Router, server-side rendering |
| **Frontend** | React | 18.x | Component-based UI library |
| **Language** | TypeScript | 5.x | Type-safe JavaScript development |
| **Database** | Convex | Latest | Real-time database with automatic sync |
| **Authentication** | NextAuth.js | 4.x | Secure authentication with OAuth providers |

### **Styling & UI**

| **Technology** | **Purpose** |
|----------------|-------------|
| **Tailwind CSS** | Utility-first CSS framework for rapid styling |
| **Framer Motion** | Animation library for smooth transitions and interactions |
| **React Icons** | Comprehensive icon library |
| **Custom Components** | Reusable UI components built from scratch |

### **Development & Build Tools**

| **Tool** | **Purpose** |
|----------|-------------|
| **ESLint** | Code linting and formatting |
| **PostCSS** | CSS processing and optimization |
| **Autoprefixer** | Automatic CSS vendor prefixing |
| **TypeScript Compiler** | Type checking and compilation |

### **Deployment & Hosting**

| **Service** | **Purpose** |
|-------------|-------------|
| **Vercel** | Frontend hosting and deployment |
| **Convex Cloud** | Database hosting and real-time sync |
| **Google OAuth** | Authentication service |

### **Key Dependencies**

```json
{
  "name": "profocto",
  "version": "0.3.0",
  "next": "^15.5.2",
  "react": "^18.3.1",
  "typescript": "^5.6.3",
  "convex": "^1.17.6",
  "next-auth": "^4.24.11",
  "framer-motion": "^12.4.3",
  "tailwindcss": "^3.4.14",
  "@dnd-kit/core": "^6.1.0",
  "react-icons": "^5.3.0"
}
```

### **Architecture Highlights**

- **App Router**: Modern Next.js routing with server components
- **Real-time Database**: Convex provides instant data synchronization
- **Type Safety**: Full TypeScript implementation across the stack
- **Component Architecture**: Modular, reusable React components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Next.js optimizations for fast loading

## 🎯 Quick Start

### 👤 **For Users**
1. 🌐 **Visit**: [Profile Élegante](https://profocto.tech)
2. 🔐 **Sign In**: Use your Google account for secure authentication
3. � **Choose Template**: Select from professional resume layouts
4. ✏️ **Fill Information**: Add your personal details, experience, skills
5. �️ **Live Preview**: See changes in real-time as you edit
6. 📥 **Export**: Download your resume as PDF or share online

### 💻 **For Developers**

#### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git
- Google OAuth credentials (for auth)
- Convex account (for database)

#### **Local Development Setup**

```bash
# 1. Clone the repository
git clone https://github.com/NiranjanKumar001/Profocto.git
cd Profocto

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env.local file and add the following:
# NEXTAUTH_SECRET=your-secret-key
# NEXTAUTH_URL=http://localhost:3000
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# NEXT_PUBLIC_CONVEX_URL=https://wooden-corgi-542.convex.cloud
# CONVEX_DEPLOY_KEY=your-convex-deploy-key

# 4. Set up Convex database
npx convex dev

# 5. Start development server
npm run dev
```

#### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

#### **Development Workflow**
1. Make your changes
2. Test locally with `npm run dev`
3. Run `npm run build` to ensure production build works
4. Commit and push your changes

Want to contribute? Check out our [Contributing Guide](CONTRIBUTING.md)

## � Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Authentication (Required)
NEXTAUTH_SECRET=your-secret-key-here
# For local development:
NEXTAUTH_URL=http://localhost:3000
# For production:
# NEXTAUTH_URL=https://profocto.tech

# Google OAuth (Required)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret  

# Convex Database (Required)
NEXT_PUBLIC_CONVEX_URL=https://wooden-corgi-542.convex.cloud
CONVEX_DEPLOY_KEY=your-convex-deploy-key
```

### **How to Get These Values:**

#### **Google OAuth Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs: 
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://profocto.tech/api/auth/callback/google` (for production)

#### **Convex Database Setup**
1. Sign up at [Convex](https://convex.dev/)
2. Create a new project  
3. Copy the deployment URL and deploy key from dashboard
4. Run `npx convex dev` to sync your schema
5. **Note**: The current deployment uses `wooden-corgi-542.convex.cloud` - you'll need your own Convex deployment

#### **NextAuth Secret**
```bash
# Generate a secure secret
openssl rand -base64 32
```

## 🏗️ Project Structure

```
Profocto/
├── 📁 app/                 # Next.js app directory (App Router)
├── 📁 components/          # Reusable React components
│   ├── 🔐 auth/           # Authentication components
│   ├── 📝 form/           # Form input components
│   ├── 👀 preview/        # Resume preview components
│   └── 🎨 ui/             # UI utility components
├── 📁 contexts/           # React Context providers
├── 📁 lib/                # Utility functions and configurations
├── 📁 public/             # Static assets
├── 📁 types/              # TypeScript type definitions
└── 📁 convex/             # Database schema and functions
```

## 🚀 Deployment

This project is optimized for deployment on **Vercel**:

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project
4. Add your environment variables
5. Deploy!

### Vercel notes

- If your repository contains multiple package-lock.json files or a nested app folder, set the **Root Directory** in Vercel to the inner `Profocto` folder (where `package.json` and `next.config.mjs` live).
- Add the environment variables listed in `.env.example` to the Vercel Project → Settings → Environment Variables (do not commit secrets).
- If Vercel fails due to peer dependency resolution, set the Install Command in Vercel to `npm ci --legacy-peer-deps` (this project used that locally during prototyping).

After making these changes, trigger a redeploy from the Vercel dashboard.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute:
- 🐛 Report bugs
- 💡 Suggest new features  
- 🎨 Improve UI/UX
- 📚 Improve documentation
- 🧪 Add tests
- 🔧 Fix issues

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Convex** for the real-time database
- **Vercel** for seamless deployment
- **Tailwind CSS** for the utility-first styling
- **Framer Motion** for smooth animations

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/NiranjanKumar001/Profocto?style=social)
![GitHub forks](https://img.shields.io/github/forks/NiranjanKumar001/Profocto?style=social)
![GitHub issues](https://img.shields.io/github/issues/NiranjanKumar001/Profocto)
![GitHub last commit](https://img.shields.io/github/last-commit/NiranjanKumar001/Profocto)

---

<div align="center">
  <p><strong>Built with ❤️ by <a href="https://github.com/NiranjanKumar001">NiranjanKumar001</a></strong></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>