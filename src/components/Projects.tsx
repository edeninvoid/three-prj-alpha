'use client'

import { motion } from 'framer-motion';
import { useState } from 'react';

// Sample project data
const projects = [
  {
    id: 1,
    title: 'Interactive Dashboard',
    description: 'A responsive dashboard with real-time data visualization and interactive charts.',
    tags: ['React', 'D3.js', 'Firebase'],
    image: '/project1.jpg',
    imageAlt: 'Dashboard screenshot',
  },
  {
    id: 2,
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with product management, cart, and checkout functionality.',
    tags: ['Next.js', 'Stripe', 'MongoDB'],
    image: '/project2.jpg',
    imageAlt: 'E-commerce website',
  },
  {
    id: 3,
    title: '3D Product Configurator',
    description: 'An interactive 3D product configurator allowing users to customize products in real-time.',
    tags: ['Three.js', 'React', 'WebGL'],
    image: '/project3.jpg',
    imageAlt: '3D configurator',
  },
  {
    id: 4,
    title: 'Mobile Fitness App',
    description: 'A fitness tracking application with workout plans, progress tracking, and social features.',
    tags: ['React Native', 'GraphQL', 'Node.js'],
    image: '/project4.jpg',
    imageAlt: 'Fitness app screens',
  },
];

// Placeholder image component for when actual images aren't available
const PlaceholderImage = ({ index }: { index: number }) => {
  const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
  return (
    <div
      className="w-full h-48 rounded-t-lg flex items-center justify-center"
      style={{ backgroundColor: colors[index % colors.length] }}
    >
      <span className="text-white text-xl font-bold">Project {index + 1}</span>
    </div>
  );
};

export default function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="projects" className="section bg-card-bg">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-12 text-center gradient-text">Featured Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="card overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredId(project.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              {/* Use placeholder instead of actual images for this demo */}
              <PlaceholderImage index={index} />

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary bg-opacity-10 text-white rounded-full text-sm cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <motion.a
                  href="#"
                  className="inline-flex items-center text-primary font-medium"
                  animate={{
                    x: hoveredId === project.id ? 5 : 0
                  }}
                >
                  View Project
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
