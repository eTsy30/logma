'use client';

import { motion, useAnimation, Variants } from 'framer-motion';
import { useEffect } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  /** Интервал перерисовки в секундах (0 = постоянная анимация без паузы) */
  redrawInterval?: number;
  /** Режим фото - усиленное свечение для скриншотов */
  photoMode?: boolean;
  /** Внешние контролы анимации (опционально) */
  externalControls?: any;
}

export const Logo = ({
  size = 200,
  className,
  redrawInterval = 0,
  photoMode = false,
  externalControls,
}: LogoProps) => {
  const internalControls = useAnimation();
  const controls = externalControls || internalControls;

  // Цвет из темы или fallback (золотой/оранжевый для свечения)
  const accentColor = 'var(--rating, #f59e0b)';

  const bodyVariants: Variants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      filter: 'drop-shadow(0 0 0px transparent)',
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      filter: `drop-shadow(0 0 ${photoMode ? 30 : 20}px ${accentColor})`,
      transition: {
        pathLength: { duration: 2, ease: 'easeInOut' },
        opacity: { duration: 0.3 },
        filter: { duration: 0.8, delay: 1.2 },
      },
    },
  };

  const detailVariants: Variants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      filter: 'drop-shadow(0 0 0px transparent)',
    },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      filter: `drop-shadow(0 0 ${photoMode ? 20 : 12}px ${accentColor}80)`,
      transition: {
        pathLength: { duration: 0.6, delay: 1.8 + i * 0.08, ease: 'easeOut' },
        opacity: { duration: 0.2, delay: 1.8 + i * 0.08 },
        filter: { duration: 0.5, delay: 2 + i * 0.08 },
      },
    }),
  };

  useEffect(() => {
    const runAnimation = async () => {
      await controls.start('visible');

      if (redrawInterval > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, redrawInterval * 1000),
        );
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      await controls.start('hidden');
      await new Promise((resolve) => setTimeout(resolve, 200));
    };

    const animateLoop = async () => {
      while (true) {
        await runAnimation();
      }
    };

    animateLoop();
  }, [controls, redrawInterval]);

  // Интенсивность свечения
  const glowOpacity = photoMode ? 0.9 : 0.6;
  const glowScale = photoMode ? 1.3 : 1.2;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        // Добавляем контейнеру свечение через box-shadow для дополнительного эффекта
        filter: photoMode
          ? 'drop-shadow(0 0 40px rgba(245, 158, 11, 0.5))'
          : 'none',
      }}
      className={className}
    >
      {/* Inner Glow - яркое ядро */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor} 0%, ${accentColor}80 30%, ${accentColor}40 50%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform, opacity',
        }}
        animate={{
          opacity: [glowOpacity * 0.5, glowOpacity, glowOpacity * 0.5],
          scale: [1, glowScale, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Middle Glow - средний слой */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: size * 0.85,
          height: size * 0.85,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}60 0%, ${accentColor}30 40%, transparent 65%)`,
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform, opacity',
        }}
        animate={{
          opacity: [glowOpacity * 0.4, glowOpacity * 0.8, glowOpacity * 0.4],
          scale: [0.9, glowScale * 1.1, 0.9],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: 0.3,
        }}
      />

      {/* Outer Glow - внешнее свечение */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: size * 1.1,
          height: size * 1.1,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}40 0%, ${accentColor}15 50%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform, opacity',
        }}
        animate={{
          opacity: [glowOpacity * 0.3, glowOpacity * 0.6, glowOpacity * 0.3],
          scale: [0.95, glowScale * 1.2, 0.95],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: 0.6,
        }}
      />

      {/* Дополнительное свечение для фото-режима */}
      {photoMode && (
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: size * 1.4,
            height: size * 1.4,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor}30 0%, transparent 60%)`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* SVG Logo - поверх свечения */}
      <motion.svg
        viewBox="0 0 311.633 311.633"
        style={{
          position: 'relative',
          width: '100%',
          height: '105%',
          fill: 'none',
          stroke: accentColor,
          strokeWidth: photoMode ? 4 : 3,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          zIndex: 1,
          filter: `drop-shadow(0 0 ${photoMode ? 15 : 8}px ${accentColor})`, // Свечение самой линии
        }}
      >
        <motion.path
          d="M157.727,37.75c-50.524,0-91.632,41.1-91.632,91.624c0,33.772,18.332,64.42,48.004,80.5l-1.7,14.024 c0,8.176,4.104,15.4,10.352,19.748c-4.396,2.548-7.416,7.376-7.416,12.972c0,5.756,3.188,10.704,7.796,13.184 c-2.424,2.568-3.94,6.004-3.94,9.804c0,7.896,6.428,14.328,14.328,14.328h0.472c-0.004,0.044-0.024,0.08-0.024,0.124 c0,9.856,11.084,17.576,25.224,17.576c5.54,0,10.784-1.204,15.16-3.472c1.532-0.788,2.128-2.672,1.332-4.204 c-0.792-1.524-2.664-2.136-4.204-1.332c-3.444,1.78-7.808,2.768-12.288,2.768c-10.292,0-18.984-5.192-18.984-11.34 c0-0.044-0.024-0.08-0.028-0.124h41.748c7.896,0,14.328-6.428,14.328-14.328c0-7.008-5.068-12.832-11.724-14.064 c-0.38-0.168-0.796-0.264-1.24-0.264h-1.36h-48.408h-3.86c-4.46,0-8.088-3.884-8.088-8.66c0-4.78,3.628-8.664,8.088-8.664h6.788 h42.54h6.792c4.46,0,8.088,3.884,8.088,8.664c0,2.508,0,2.508-1.748,4.924c-1.008,1.392-0.696,3.344,0.7,4.352 c1.388,1.004,3.34,0.696,4.352-0.7c2.716-3.748,2.936-4.392,2.936-8.58c0-8.216-6.428-14.904-14.328-14.904h-6.792h-42.54 c-9.824,0-17.816-7.996-17.844-17.44l1.936-15.78l-1.672-3.152c-28.708-14.7-46.536-43.808-46.536-75.96 c0-47.084,38.304-85.388,85.392-85.388c47.084,0,85.384,38.304,85.384,85.388c0,32.148-17.832,61.26-46.532,75.972l-1.672,3.156 l1.908,15.396c0,4.784-1.892,9.288-5.328,12.672c-1.228,1.208-1.24,3.184-0.032,4.408c1.208,1.224,3.184,1.24,4.408,0.032 c4.64-4.572,7.196-10.648,7.168-17.492l-1.672-13.648c29.66-16.084,47.992-46.728,47.992-80.5 C249.351,78.854,208.247,37.75,157.727,37.75z M133.523,271.521h48.408c4.46,0,8.088,3.628,8.088,8.088s-3.628,8.088-8.088,8.088 h-48.408c-4.46,0-8.088-3.628-8.088-8.088C125.435,275.15,129.063,271.521,133.523,271.521z"
          variants={bodyVariants}
          initial="hidden"
          animate={controls}
        />

        <g style={{ strokeWidth: 2 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.path
              key={i}
              d={
                [
                  'M195.627,177.769c1.18-0.288,1.904-1.476,1.616-2.66c-0.288-1.18-1.496-1.904-2.656-1.616 c-4.808,1.18-10.2-0.456-14.416-4.352c-0.004-0.008-0.012-0.016-0.02-0.02c3.548-4.672,5.24-10.444,4.664-15.988 c-0.312-2.972-1.32-5.004-3.08-6.212c-1.66-1.136-3.628-1.312-5.54-0.496c-2.82,1.204-5.268,4.56-5.824,7.976 c-0.82,5.024,0.608,10.28,3.864,14.684c-2.536,2.276-5.544,3.64-8.672,3.904c-3.52,0.3-7.184-1.08-10.092-3.66 c2.324-3.8,3.736-7.808,4.588-11.14c1.012-3.944,0.5-6.868-1.512-8.692c-1.448-1.308-3.332-1.736-5.296-1.216 c-2.82,0.752-5.468,3.396-6.44,6.42c-1.6,4.94-0.484,10.388,3.044,15.008c-1.312,1.652-2.856,3.18-4.684,4.464 c-0.248,0.176-0.508,0.344-0.76,0.504c-1.952-5.3-4.5-10.376-7.78-15.156c-3.868-5.624-7.572-6.332-10.004-5.912 c-1.548,0.252-3.036,1.04-4.436,2.328c-2.804,2.596-4.272,6.516-4.012,10.756c0.288,4.788,2.636,9.22,6.276,11.856 c4.78,3.456,11.296,4.172,17.324,2.192c4.944,16.716,4.384,35.608,2.752,54.052c-0.108,1.212,0.788,2.28,2,2.384 c0.064,0.004,0.128,0.008,0.196,0.008c1.124,0,2.084-0.864,2.188-2.008c1.692-19.112,2.244-38.728-3.072-56.232 c0.636-0.36,1.256-0.752,1.86-1.176c2.02-1.416,3.744-3.072,5.212-4.848c3.752,3.172,8.484,4.82,13.02,4.448 c4.1-0.348,7.992-2.1,11.24-5.016c0.004,0.004,0.004,0.004,0.008,0.008C182.479,177.269,189.371,179.285,195.627,177.769z M127.031,174.985c-2.548-1.844-4.26-5.12-4.464-8.556c-0.18-2.956,0.748-5.532,2.612-7.26c0.74-0.684,1.488-1.104,2.16-1.22 c0.144-0.02,0.28-0.032,0.416-0.032c2.1,0,4.16,2.524,5.244,4.1c3.132,4.556,5.552,9.428,7.396,14.532 C135.695,178.07,130.615,177.573,127.031,174.985z M152.463,165.75c-1.928-3.136-2.468-6.588-1.46-9.696 c0.508-1.58,2.028-3.16,3.388-3.52c0.18-0.048,0.336-0.072,0.468-0.072c0.352,0,0.568,0.14,0.732,0.292 c0.688,0.624,0.76,2.168,0.208,4.34C155.131,159.701,154.087,162.773,152.463,165.75z M174.715,155.109 c0.312-1.904,1.784-4.028,3.212-4.64c0.256-0.112,0.472-0.156,0.652-0.156c0.28,0,0.492,0.108,0.672,0.232 c0.612,0.42,1.02,1.472,1.192,3.044c0.42,4.064-0.772,8.456-3.224,12.072C175.055,162.393,174.139,158.654,174.715,155.109z',
                  'M179.407,178.958c-8.268,18.016-10.476,37.244-6.772,56.708c0.528,2.78,4.772,1.604,4.244-1.168 c-3.464-18.196-1.408-36.46,6.328-53.316C184.379,178.621,180.587,176.381,179.407,178.958z',
                  'M194.783,61.734c-2.456-1.416-4.676,2.384-2.22,3.8c21.544,12.404,33.632,35.796,31.484,60.532 c-0.248,2.82,4.156,2.804,4.4,0C230.723,99.838,217.571,74.854,194.783,61.734z',
                  'M225.675,149.149c2.28-4.128,2.964-8.608,2.172-13.24c-0.476-2.784-4.716-1.604-4.244,1.172 c0.588,3.428-0.056,6.816-1.728,9.848C220.503,149.414,224.303,151.633,225.675,149.149z',
                  'M93.779,90.149c-6.652,10.196-10.204,21.604-10.616,33.768c-0.096,2.832,4.304,2.828,4.4,0 c0.388-11.452,3.756-21.948,10.016-31.544C99.127,89.993,95.319,87.786,93.779,90.149z',
                  'M83.503,134.878c-1,5.444-0.056,10.808,2.96,15.476c1.532,2.368,5.344,0.168,3.8-2.22 c-2.356-3.644-3.304-7.796-2.516-12.088C88.255,133.278,84.015,132.089,83.503,134.878z',
                ][i]
              }
              custom={i}
              variants={detailVariants}
              initial="hidden"
              animate={controls}
            />
          ))}
        </g>
      </motion.svg>
    </div>
  );
};
