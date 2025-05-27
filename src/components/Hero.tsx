'use client'

import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useState, useRef, useEffect, useMemo } from 'react';

// Background particles
const backgroundParticles = Array.from({ length: 100 }, () => ({
  position: [
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5,
  ] as [number, number, number],
  size: Math.random() * 0.2 + 0.1,
  points: Array.from({ length: 8 }, () => [
    (Math.random() - 0.5) * 0.5,
    (Math.random() - 0.5) * 0.5,
    (Math.random() - 0.5) * 0.5,
  ] as [number, number, number]),
}));

// Firework particle type
type FireworkParticle = {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  color: THREE.Color;
  size: number;
  life: number;
  maxLife: number;
  points: [number, number, number][];
};

function LineStructure({ points, color, opacity }: {
  points: THREE.Vector3[],
  color: THREE.Color,
  opacity: number
}) {
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent={true}
        opacity={opacity}
        linewidth={1}
      />
    </lineSegments>
  );
}

function BackgroundParticles() {
  // Developer-like color palette
  const devColors = [
    new THREE.Color('#1e293b'), // slate-800
    new THREE.Color('#334155'), // slate-700
    new THREE.Color('#0f172a'), // slate-900
    new THREE.Color('#0c4a6e'), // sky-900
    new THREE.Color('#082f49'), // sky-950
    new THREE.Color('#1e3a8a'), // blue-900
    new THREE.Color('#0f766e'), // teal-800 - adding some teal for terminal-like colors
    new THREE.Color('#064e3b'), // emerald-900 - adding some green for terminal-like colors
  ];

  // Create line geometries for each particle
  const particles = useMemo(() => {
    return backgroundParticles.map((particle, i) => {
      // Create a geometry for a line structure
      const linePoints: THREE.Vector3[] = [];

      // Create a geometric shape with lines (like a cube or octahedron)
      const size = particle.size;
      const basePosition = new THREE.Vector3(...particle.position);

      // Different line patterns based on index for variety
      if (i % 3 === 0) {
        // Create a cube-like structure
        const points = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], [-1, -1, 1],
          [1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1], [-1, 1, -1]
        ];

        points.forEach(([x, y, z]) => {
          linePoints.push(new THREE.Vector3(x * size, y * size, z * size).add(basePosition));
        });
      } else if (i % 3 === 1) {
        // Create a star-like structure
        for (let j = 0; j < 8; j++) {
          const angle = (j / 8) * Math.PI * 2;
          const nextAngle = ((j + 1) / 8) * Math.PI * 2;

          linePoints.push(new THREE.Vector3(0, 0, 0).add(basePosition));
          linePoints.push(new THREE.Vector3(
            Math.cos(angle) * size * 1.5,
            Math.sin(angle) * size * 1.5,
            0
          ).add(basePosition));

          linePoints.push(new THREE.Vector3(
            Math.cos(angle) * size * 1.5,
            Math.sin(angle) * size * 1.5,
            0
          ).add(basePosition));
          linePoints.push(new THREE.Vector3(
            Math.cos(nextAngle) * size * 1.5,
            Math.sin(nextAngle) * size * 1.5,
            0
          ).add(basePosition));
        }
      } else {
        // Create a tetrahedron-like structure
        const points = [
          [0, size, 0], [size, -size, size], [-size, -size, size], [0, size, 0],
          [0, -size, -size], [size, -size, size], [0, -size, -size], [-size, -size, size]
        ];

        points.forEach(([x, y, z]) => {
          linePoints.push(new THREE.Vector3(x, y, z).add(basePosition));
        });
      }

      return {
        points: linePoints,
        color: devColors[i % devColors.length],
        opacity: 0.6 + Math.random() * 0.4, // Varying opacity for depth
      };
    });
  }, []);

  return (
    <>
      {particles.map((particle, i) => (
        <LineStructure
          key={i}
          points={particle.points}
          color={particle.color}
          opacity={particle.opacity}
        />
      ))}
    </>
  );
}

function FireworkParticles({ particles }: { particles: FireworkParticle[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    // Update particles
    groupRef.current.children.forEach((child, index) => {
      if (index >= particles.length) return;

      const particle = particles[index];

      // Update position based on velocity
      child.position.x += particle.velocity[0] * 0.01;
      child.position.y += particle.velocity[1] * 0.01;
      child.position.z += particle.velocity[2] * 0.01;

      // Decrease life
      particle.life -= 0.01;

      // Fade out
      const scale = particle.life / particle.maxLife;
      child.children.forEach((subChild) => {
        const mesh = subChild as THREE.Mesh;
        if (mesh.material) {
          const material = mesh.material;
          if (Array.isArray(material)) {
            material.forEach((mat) => {
              mat.opacity = scale;
            });
          } else {
            material.opacity = scale;
          }
        }
      });
      // if (child.children[0] && child.children[0].material instanceof THREE.Material) {
      //   child.children[0].material.opacity = scale;
      // }
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle) => {
        // Create a container for the particle that can be moved
        return (
          <group key={particle.id} position={particle.position}>
            <LineStructure
              points={particle.points.map(([x, y, z]) => new THREE.Vector3(x, y, z))}
              color={particle.color}
              opacity={particle.life / particle.maxLife}
            />
          </group>
        );
      })}
    </group>
  );
}

function Scene() {
  const [fireworks, setFireworks] = useState<FireworkParticle[]>([]);
  const { camera, gl } = useThree();
  const nextId = useRef(0);

  // Clean up expired particles
  useEffect(() => {
    const interval = setInterval(() => {
      setFireworks(prev => prev.filter(p => p.life > 0));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Handle click to create firework
  const handleCanvasClick = (event: MouseEvent) => {
    // Get normalized device coordinates
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Create a raycaster
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(x, y);
    raycaster.setFromCamera(pointer, camera);

    // Get point at z=0
    const clickPoint = new THREE.Vector3();
    raycaster.ray.at(5, clickPoint); // 5 is the distance from camera

    // Create new firework particles
    const newParticles: FireworkParticle[] = [];
    const particleCount = 30; // Number of particles per firework

    // Developer-like color palette for fireworks
    const devColors = [
      new THREE.Color('#38bdf8'), // sky-400
      new THREE.Color('#0ea5e9'), // sky-500
      new THREE.Color('#0284c7'), // sky-600
      new THREE.Color('#2563eb'), // blue-600
      new THREE.Color('#3b82f6'), // blue-500
      new THREE.Color('#60a5fa'), // blue-400
    ];

    for (let i = 0; i < particleCount; i++) {
      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.5 + 0.5;
      const elevation = Math.random() * Math.PI - Math.PI / 2;

      // Convert to cartesian coordinates
      const vx = Math.cos(angle) * Math.cos(elevation) * radius;
      const vy = Math.sin(elevation) * radius;
      const vz = Math.sin(angle) * Math.cos(elevation) * radius;

      // Create line points for the particle
      const linePoints: THREE.Vector3[] = [];
      const size = Math.random() * 0.1 + 0.05;

      // Create different line patterns for variety
      if (i % 3 === 0) {
        // Simple cross shape
        linePoints.push(new THREE.Vector3(-size, 0, 0));
        linePoints.push(new THREE.Vector3(size, 0, 0));
        linePoints.push(new THREE.Vector3(0, -size, 0));
        linePoints.push(new THREE.Vector3(0, size, 0));
        linePoints.push(new THREE.Vector3(0, 0, -size));
        linePoints.push(new THREE.Vector3(0, 0, size));
      } else if (i % 3 === 1) {
        // Triangle shape
        const triangleSize = size * 1.5;
        linePoints.push(new THREE.Vector3(0, triangleSize, 0));
        linePoints.push(new THREE.Vector3(-triangleSize, -triangleSize, 0));
        linePoints.push(new THREE.Vector3(triangleSize, -triangleSize, 0));
        linePoints.push(new THREE.Vector3(0, triangleSize, 0));
      } else {
        // Line segments in random directions
        for (let j = 0; j < 3; j++) {
          const randAngle = Math.random() * Math.PI * 2;
          const randElevation = Math.random() * Math.PI - Math.PI / 2;

          const x1 = Math.cos(randAngle) * Math.cos(randElevation) * size;
          const y1 = Math.sin(randElevation) * size;
          const z1 = Math.sin(randAngle) * Math.cos(randElevation) * size;

          linePoints.push(new THREE.Vector3(0, 0, 0));
          linePoints.push(new THREE.Vector3(x1, y1, z1));
        }
      }

      // Create particle
      newParticles.push({
        id: nextId.current++,
        position: [clickPoint.x, clickPoint.y, clickPoint.z] as [number, number, number],
        velocity: [vx, vy, vz] as [number, number, number],
        color: devColors[i % devColors.length],
        size: size,
        life: 1.0,
        maxLife: 1.0,
        points: linePoints.map(p => [p.x, p.y, p.z]) as [number, number, number][]
      });
    }

    setFireworks(prev => [...prev, ...newParticles]);
  };

  // Add click event listener
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [gl]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <BackgroundParticles />
      <FireworkParticles particles={fireworks} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Scene />
        </Canvas>
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Creative Portfolio
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-8 text-muted max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Interactive visual showcase with animations and data visualizations
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href="#skills"
            className="inline-block bg-primary text-white font-medium py-3 px-8 rounded-full hover:bg-opacity-90 transition-all"
          >
            Explore My Work
          </a>
        </motion.div>
      </div>
    </section>
  );
}
