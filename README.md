
# Visual Portfolio

An interactive visual portfolio built with Next.js, featuring animations, data visualizations, and 3D effects.

## Features

- **Interactive 3D Hero Section**: A captivating hero section with animated 3D particles using Three.js
- **Skills Visualization**: A radar chart and animated progress bars to showcase skills
- **Project Showcase**: An animated grid of projects with hover effects
- **Contact Form**: A functional contact form with animations and validation
- **Responsive Design**: Fully responsive layout that works on all devices

## Technologies Used

- **Next.js 15**: For server-side rendering and routing
- **React 19**: For building the user interface
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **Framer Motion**: For animations
- **Chart.js**: For data visualization
- **Three.js**: For 3D effects

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

- `src/app`: Main application files
- `src/components`: Reusable components
  - `Hero.tsx`: 3D animated hero section
  - `Skills.tsx`: Skills visualization with radar chart
  - `Projects.tsx`: Project showcase with animations
  - `Contact.tsx`: Contact form with validation
  - `Footer.tsx`: Footer component
- `public`: Static assets

## Customization

You can customize the portfolio by:

1. Updating the skills data in `Skills.tsx`
2. Changing the projects in `Projects.tsx`
3. Modifying the contact information in `Contact.tsx`
4. Adjusting the colors in `globals.css`
