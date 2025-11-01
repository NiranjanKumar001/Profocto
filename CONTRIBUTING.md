# Contributing to Profocto 🚀

Thank you for your interest in contributing to Profocto! We're excited to have you join our community. This guide will help you get started with contributing to this modern resume builder application.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Making Changes](#-making-changes)
- [Commit Guidelines](#-commit-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Code Style](#-code-style)
- [Testing](#-testing)
- [Project Structure](#-project-structure)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful** and inclusive of different viewpoints and experiences
- **Be collaborative** and help others learn and grow
- **Be constructive** when giving feedback
- **Be patient** with newcomers and those learning
- **Treat everyone** with dignity and respect

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- A **GitHub account**
- A code editor (**VS Code** recommended)

## �️ Development Setup

### 1. Fork and Clone

First, fork the repository on GitHub, then clone your fork:

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Profocto.git

# Navigate to the project directory
cd Profocto

# Add the original repository as upstream
git remote add upstream https://github.com/NiranjanKumar001/Profocto.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional for development)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Convex Database
NEXT_PUBLIC_CONVEX_URL=your-convex-url
CONVEX_DEPLOY_KEY=your-convex-deploy-key
```

**Get your credentials:**
- **NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32`
- **Google OAuth**: [Google Cloud Console](https://console.cloud.google.com/)
- **Convex**: [Convex Dashboard](https://dashboard.convex.dev/)

### 4. Set Up Convex

```bash
# Initialize Convex development environment
npx convex dev
```

This will start Convex in development mode and sync your schema.

### 5. Start Development Server

```bash
npm run dev
```

Open your browser and navigate to **http://localhost:3000** 🎉

### 6. Verify Setup

- ✅ Homepage loads correctly
- ✅ You can navigate to the builder page
- ✅ Form sections are editable
- ✅ Preview updates in real-time
- ✅ No console errors

## � Making Changes

### Branching Strategy

Always create a new branch for your changes:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Development Workflow

1. **Make your changes** in your feature branch
2. **Test thoroughly** on desktop and mobile
3. **Commit frequently** with clear messages
4. **Keep commits focused** - one logical change per commit
5. **Update documentation** if needed
6. **Ensure build passes** before pushing

## 📝 Commit Guidelines

We follow the **Conventional Commits** specification for clear and structured commit messages.

### Format

```
type(scope): short description

[optional body]

[optional footer]
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(preview): add TemplateSix layout` |
| `fix` | Bug fix | `fix(mobile): resolve drag-drop issues` |
| `docs` | Documentation | `docs(readme): update setup instructions` |
| `style` | Code style/formatting | `style(form): improve input spacing` |
| `refactor` | Code refactoring | `refactor(context): simplify state management` |
| `perf` | Performance improvement | `perf(scroll): add lazy loading` |
| `test` | Testing | `test(auth): add OAuth integration tests` |
| `chore` | Maintenance | `chore(deps): update dependencies` |

### Examples

```bash
# Feature
git commit -m "feat(templates): add profile picture support to Template Five"

# Bug fix
git commit -m "fix(dnd): prevent parent drag when dragging nested items"

# Performance
git commit -m "perf(mobile): optimize scroll performance with lazy sections"

# Documentation
git commit -m "docs(contributing): add detailed setup instructions"
```

### Multi-line Commits

For more complex changes, use the body to explain:

```
feat(export): add PDF export with custom margins

- Implement margin controls for desktop and mobile
- Add exclude-print class for UI elements
- Optimize print styles for all templates
- Fix mobile PDF excessive margins

Closes #123
```

## 🎯 Pull Request Process

### Before Submitting

1. **Update from upstream** to avoid conflicts:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Test your changes**:
   ```bash
   npm run build        # Ensure production build works
   npm run lint         # Check for linting errors
   ```

3. **Test on multiple devices**:
   - Desktop (Chrome, Firefox, Safari)
   - Mobile (iOS Safari, Chrome Mobile)
   - Tablet (if applicable)

4. **Review your changes**:
   ```bash
   git diff main
   ```

### Submitting a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub:
   - Go to the original Profocto repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template

3. **Write a clear PR description**:
   ```markdown
   ## Description
   Brief description of what this PR does
   
   ## Changes Made
   - Added feature X
   - Fixed bug Y
   - Improved performance of Z
   
   ## Screenshots (if applicable)
   [Add screenshots for UI changes]
   
   ## Testing
   - [ ] Tested on desktop
   - [ ] Tested on mobile
   - [ ] Build passes
   - [ ] No console errors
   
   ## Related Issues
   Closes #123
   ```

4. **Respond to feedback** promptly and make requested changes

### After Submission

- Monitor your PR for comments and requested changes
- Make updates by pushing new commits to your branch
- Be patient - reviews may take a few days
- Once approved, a maintainer will merge your PR! 🎉

## 🎨 Code Style

### General Guidelines

- **Follow existing patterns** in the codebase
- **Keep it simple** - write clear, maintainable code
- **Comment complex logic** - explain the "why", not the "what"
- **Use TypeScript** - leverage type safety wherever possible
- **Be consistent** - match the style of surrounding code

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `PersonalInformation.jsx` |
| Utilities | camelCase | `dateUtils.js` |
| Types | PascalCase | `resume.ts` |
| Contexts | PascalCase | `ResumeContext.tsx` |
| Pages | lowercase | `page.tsx` |

### Component Structure

```tsx
// 1. Imports
import { useState, useEffect } from "react";
import { ComponentType } from "./types";

// 2. Component definition
export default function MyComponent({ prop1, prop2 }: Props) {
  // 3. Hooks
  const [state, setState] = useState<string>("");
  
  // 4. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 5. Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 6. Render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
}
```

### TypeScript

```typescript
// Use interfaces for props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

// Use types for complex types
type ResumeData = {
  personalInfo: PersonalInfo;
  experience: Experience[];
  // ...
};

// Avoid 'any' - use proper types or 'unknown'
```

### Tailwind CSS

- **Use utility classes** instead of custom CSS when possible
- **Follow mobile-first** approach: `className="text-sm md:text-base lg:text-lg"`
- **Group related classes**: Layout → Spacing → Typography → Colors → Effects
- **Use semantic color names**: `bg-pink-500` not `bg-[#ec4899]`

```tsx
// Good
<div className="flex flex-col gap-4 p-6 bg-gray-800 rounded-lg shadow-lg">
  <h2 className="text-xl font-bold text-white">Title</h2>
</div>

// Avoid
<div style={{ display: 'flex', padding: '24px' }}>
  <h2 style={{ fontSize: '20px' }}>Title</h2>
</div>
```

### React Best Practices

- **Use functional components** and hooks
- **Keep components small** - single responsibility
- **Avoid prop drilling** - use Context for shared state
- **Memoize expensive calculations** with `useMemo`
- **Use custom hooks** for reusable logic
- **Handle loading states** properly

```tsx
// Good - clear, focused component
function EducationItem({ education }) {
  return (
    <div>
      <h3>{education.degree}</h3>
      <p>{education.school}</p>
    </div>
  );
}

// Avoid - doing too much
function MassiveComponent() {
  // 200 lines of logic and JSX...
}
```

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test your changes:

**Desktop Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Mobile Testing:**
- [ ] iOS Safari
- [ ] Chrome Mobile
- [ ] Different screen sizes (phone, tablet)

**Functionality Testing:**
- [ ] All form inputs work correctly
- [ ] Live preview updates in real-time
- [ ] Drag-and-drop works smoothly
- [ ] PDF export generates correctly
- [ ] Authentication flow works
- [ ] Data persists after refresh
- [ ] No console errors or warnings

**Performance Testing:**
- [ ] Page loads quickly
- [ ] Smooth scrolling on mobile
- [ ] No janky animations
- [ ] Lazy loading works correctly

### Build Testing

```bash
# Check for TypeScript errors
npm run build

# Check for linting issues
npm run lint

# Fix auto-fixable linting issues
npm run lint -- --fix
```

## 📚 Documentation

### When to Update Documentation

Update documentation when you:
- Add a new feature
- Change existing functionality
- Modify setup/installation process
- Add new environment variables
- Change project structure

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep formatting consistent
- Update table of contents if needed

## 🐛 Reporting Issues

Found a bug? Help us fix it by providing detailed information.

### Bug Report Template

```markdown
**Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
Add screenshots if applicable.

**Environment**
- OS: [e.g., Windows 11, macOS 14]
- Browser: [e.g., Chrome 120, Safari 17]
- Device: [e.g., iPhone 15, Desktop]
- Version: [e.g., 0.3.0]

**Additional Context**
Any other information about the problem.
```

## � Feature Requests

Have an idea? We'd love to hear it!

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature.

**Problem It Solves**
What problem does this feature address?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've thought about.

**Additional Context**
Mockups, examples, or references.
```

## 🏆 Recognition

We value all contributions! Contributors will be recognized:

- ✨ Listed on the GitHub contributors page
- 📝 Mentioned in release notes for significant contributions
- 🎉 Featured in the README for major features
- 💖 Appreciated by the entire community!

## � Project Structure

Understanding the codebase structure will help you contribute effectively:

```
Profocto/
├── 📁 app/                          # Next.js 15 App Router
│   ├── api/auth/[...nextauth]/     # NextAuth.js authentication
│   ├── builder/[id]/               # Resume builder page
│   ├── templates/                  # Template selection
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Global styles
│
├── 📁 components/
│   ├── auth/                       # AuthModal, LogoutLoader
│   ├── form/                       # Education, Experience, Skills, etc.
│   ├── preview/                    # Preview, TemplateTwo-Five
│   ├── ui/                         # Reusable UI components
│   └── utility/                    # DateRange, WinPrint, etc.
│
├── 📁 contexts/
│   ├── ResumeContext.tsx           # Resume data state
│   └── SectionTitleContext.js      # Section title management
│
├── 📁 convex/
│   ├── schema.ts                   # Database schema
│   ├── resume.ts                   # Resume operations
│   └── auth.ts                     # Auth logic
│
├── 📁 lib/
│   ├── convex-adapter.ts           # NextAuth adapter
│   └── utils.ts                    # Helper functions
│
├── 📁 types/
│   └── resume.ts                   # TypeScript types
│
└── 📁 public/assets/               # Static images
```

### Key Files to Know

- **`app/builder/[id]/page.tsx`** - Main builder page with form and preview
- **`components/preview/Preview.jsx`** - Classic resume template
- **`contexts/ResumeContext.tsx`** - Global state for resume data
- **`convex/schema.ts`** - Database schema definitions
- **`app/globals.css`** - Global styles and utilities

## 🔒 Security

**Found a security vulnerability?** 

Please **do not** open a public issue. Instead:
1. Email the maintainer directly (check package.json for contact)
2. Provide detailed information about the vulnerability
3. Allow time for a fix before public disclosure

We take security seriously and appreciate responsible disclosure.

## 🆘 Getting Help

Stuck? Need guidance? We're here to help!

### Resources

- 📖 **Documentation**: Check the [README](README.md) for setup and usage
- 🐛 **Issues**: Browse [existing issues](https://github.com/NiranjanKumar001/Profocto/issues)
- 💬 **Discussions**: Ask questions in [GitHub Discussions](https://github.com/NiranjanKumar001/Profocto/discussions)
- 📧 **Email**: Contact maintainers for urgent or private matters

### Before Asking

1. Check if your question is answered in the README
2. Search existing issues and discussions
3. Try to solve it yourself first (learning opportunity!)
4. If still stuck, ask with details about what you've tried

## � First-Time Contributors

**New to open source?** Welcome! Here's how to get started:

1. **Find a good first issue**: Look for `good first issue` labels
2. **Read the code**: Understand how the project works
3. **Start small**: Fix typos, improve docs, or tackle simple bugs
4. **Ask questions**: Don't hesitate to ask for help or clarification
5. **Learn and grow**: Every contribution makes you a better developer!

### Helpful Resources

- [First Contributions Guide](https://github.com/firstcontributions/first-contributions)
- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Understanding Git](https://guides.github.com/introduction/git-handbook/)

## 📜 License

By contributing to Profocto, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

<div align="center">

### 💙 Thank You for Contributing!

Your contributions make Profocto better for everyone. Whether it's a bug fix, new feature, or documentation improvement, every contribution matters.

**Questions?** Open an issue or discussion. **Ready to contribute?** Fork the repo and start coding!

**Happy Coding! 🚀**

<sub>Made with ❤️ by the Profocto community</sub>

</div>