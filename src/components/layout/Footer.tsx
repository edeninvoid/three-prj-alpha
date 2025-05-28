'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-card-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 md:mb-0"
          >
            <p className="text-muted text-sm">
              © {currentYear} Visual Portfolio. All rights reserved.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex space-x-6"
          >
            <a href="#" className="text-muted hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted hover:text-foreground transition-colors">
              Sitemap
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
