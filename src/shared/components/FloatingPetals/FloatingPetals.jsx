import React, { useEffect, useState } from 'react';
import { Box, keyframes } from '@mui/material';

// Keyframes for falling animation - combined X and Y movement
const fall = keyframes`
  0% {
    transform: translate(0, -100px) rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: translate(-30px, 25vh) rotate(180deg);
  }
  50% {
    transform: translate(30px, 50vh) rotate(360deg);
  }
  75% {
    transform: translate(-20px, 75vh) rotate(540deg);
  }
  100% {
    transform: translate(0, 100vh) rotate(720deg);
    opacity: 0.4;
  }
`;

// Different petal types with emoji
const petalTypes = [
  { emoji: '🌸', color: '#FFB7C5' }, // Cherry blossom
  { emoji: '🌺', color: '#FF69B4' }, // Hibiscus
  { emoji: '🌼', color: '#FFD700' }, // Daisy
  { emoji: '🌷', color: '#FF6B9D' }, // Tulip
  { emoji: '🌹', color: '#FF1744' }, // Rose
  { emoji: '💮', color: '#FFC0CB' }, // White flower
  { emoji: '🏵️', color: '#FF8A80' }, // Rosette
  { emoji: '🌻', color: '#FFA000' }, // Sunflower
  { emoji: '✨', color: '#FFD700' }, // Sparkles
  { emoji: '⭐', color: '#FFC400' }, // Star
  { emoji: '💫', color: '#E1BEE7' }, // Dizzy
  { emoji: '🦋', color: '#9C27B0' }, // Butterfly
];

const FloatingPetals = ({ duration = 8000, count = 50 }) => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Generate petals to fall like rain - dense and continuous
    const generatedPetals = Array.from({ length: count }, (_, i) => {
      const petalType = petalTypes[Math.floor(Math.random() * petalTypes.length)];
      
      return {
        id: i,
        emoji: petalType.emoji,
        color: petalType.color,
        left: Math.random() * 100, // Completely random across full width (0-100%)
        delay: Math.random() * 2, // Start quickly within 2 seconds (rain effect)
        duration: 4 + Math.random() * 3, // Fall duration (4-7s)
        size: 1 + Math.random() * 2, // Varied sizes (1-3em)
      };
    });
    
    setPetals(generatedPetals);

    // Auto cleanup after duration
    const timer = setTimeout(() => {
      setPetals([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, count]);

  if (petals.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {petals.map((petal) => (
        <Box
          key={petal.id}
          sx={{
            position: 'absolute',
            left: `${petal.left}%`,
            top: '-100px', // Start above viewport
            fontSize: `${petal.size}em`,
            animation: `${fall} ${petal.duration}s ease-out ${petal.delay}s forwards`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            willChange: 'transform, opacity',
          }}
        >
          {petal.emoji}
        </Box>
      ))}
    </Box>
  );
};

export default FloatingPetals;
