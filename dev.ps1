# PowerShell script to run Next.js with optimized settings
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev:normal -- --turbo
