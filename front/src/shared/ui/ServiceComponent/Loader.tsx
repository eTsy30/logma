'use client';
import { motion } from 'framer-motion';
import { Logo } from '../Logo/Logo';
import styles from '../Logo/Logo.module.scss';

interface LoaderProps {
  text?: string;
  showText?: boolean;
}

export const Loader = ({ text = 'Loading', showText = true }: LoaderProps) => {
  return (
    <div className={styles.container}>
      <Logo size={200} />
      {showText && (
        <motion.div
          className={styles.loadingText}
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.5, 1],
          }}
        >
          {text}
        </motion.div>
      )}
    </div>
  );
};

export default Loader;
