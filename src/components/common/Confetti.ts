import confetti from 'canvas-confetti';

export const triggerHeritageConfetti = () => {
  try {
    // Saffron, terracotta, gold, and ivory palette
    const colors = ['#D97724', '#C85A32', '#E8B058', '#FDFBF7', '#2D4F38'];

    // Left cannon burst
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.8 },
      colors
    });

    // Right cannon burst
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.8 },
      colors
    });

    // Center golden stars
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 80,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#D4AF37', '#E8B058', '#FDFBF7'],
        shapes: ['circle']
      });
    }, 250);
  } catch (err) {
    // Graceful fallback if canvas is restricted
  }
};
