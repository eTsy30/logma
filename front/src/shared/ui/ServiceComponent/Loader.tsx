// 'use client';

// import { useEffect } from 'react';
// import { motion, useAnimation } from 'framer-motion';
// import { Logo } from '../Logo/Logo';

// const Loader = () => {
//   const controls = useAnimation();

//   // Варианты для бесшовного цикла

//   useEffect(() => {
//     const animateLoop = async () => {
//       while (true) {
//         // Фаза 1: Рисование
//         await controls.start('visible');

//         // Фаза 2: Пауза на "горение" (лампочка полностью нарисована)
//         await new Promise((resolve) => setTimeout(resolve, 1500));

//         // Фаза 3: Плавное стирание (в обратном порядке)
//         await controls.start('hidden');

//         // Минимальная пауза перед следующим циклом
//         await new Promise((resolve) => setTimeout(resolve, 200));
//       }
//     };

//     animateLoop();
//   }, [controls]);

//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #0e232e 0%, #1a1a2e 100%)',
//         gap: '30px',
//       }}
//     >
//       <Logo controls={controls} />

//       {/* Loading text с синхронизированной анимацией */}
//       <motion.div
//         animate={{
//           opacity: [0.3, 1, 0.3],
//         }}
//         transition={{
//           duration: 2.5,
//           repeat: Infinity,
//           ease: 'easeInOut',
//           times: [0, 0.5, 1],
//         }}
//         style={{
//           color: '#FFD700',
//           fontFamily: 'Nunito Sans, sans-serif',
//           fontWeight: 800,
//           fontSize: '1.5em',
//           letterSpacing: '4px',
//           textTransform: 'uppercase',
//           textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
//         }}
//       >
//         Loading
//       </motion.div>
//     </div>
//   );
// };

// export default Loader;
// components/Loader/Loader.tsx
// 'use client';

// import { useEffect } from 'react';
// import { motion, useAnimation } from 'framer-motion';
// import { Logo } from '../Logo/Logo';

// interface LoaderProps {
//   text?: string;
//   showText?: boolean;
// }

// export const Loader = ({ text = 'Loading', showText = true }: LoaderProps) => {
//   const controls = useAnimation();

//   useEffect(() => {
//     const animateLoop = async () => {
//       while (true) {
//         await controls.start('visible');
//         await new Promise((resolve) => setTimeout(resolve, 1500));
//         await controls.start('hidden');
//         await new Promise((resolve) => setTimeout(resolve, 200));
//       }
//     };

//     animateLoop();
//   }, [controls]);

//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #0e232e 0%, #1a1a2e 100%)',
//         gap: '30px',
//       }}
//     >
//       <Logo controls={controls} size={200} />

//       {showText && (
//         <motion.div
//           animate={{
//             opacity: [0.3, 1, 0.3],
//           }}
//           transition={{
//             duration: 2.5,
//             repeat: Infinity,
//             ease: 'easeInOut',
//             times: [0, 0.5, 1],
//           }}
//           style={{
//             color: '#FFD700',
//             fontFamily: 'Nunito Sans, sans-serif',
//             fontWeight: 800,
//             fontSize: '1.5em',
//             letterSpacing: '4px',
//             textTransform: 'uppercase',
//             textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
//           }}
//         >
//           {text}
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default Loader;
'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
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
