import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AudioWaveform3DProps {
  isPlaying: boolean;
  className?: string;
}

export const AudioWaveform3D: React.FC<AudioWaveform3DProps> = ({ isPlaying, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const playingRef = useRef<boolean>(isPlaying);

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 180;
    const height = container.clientHeight || 40;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // Dynamic Waveform Geometry
    const pointCount = 48;
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);

    const c1 = new THREE.Color(0xD97724); // saffron
    const c2 = new THREE.Color(0xC85A32); // terracotta

    for (let i = 0; i < pointCount; i++) {
      const x = (i / (pointCount - 1) - 0.5) * 4.2;
      positions[i * 3] = x;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      const mix = i / (pointCount - 1);
      const col = c1.clone().lerp(c2, mix);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 2,
      transparent: true,
      opacity: 0.95
    });

    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // Secondary harmonic ghost line
    const ghostMat = new THREE.LineBasicMaterial({
      color: 0xE8B058,
      transparent: true,
      opacity: 0.4
    });
    const ghostLine = new THREE.Line(geometry.clone(), ghostMat);
    ghostLine.position.z = -0.2;
    scene.add(ghostLine);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      const amp = playingRef.current ? 0.75 : 0.08;

      for (let i = 0; i < pointCount; i++) {
        const x = (i / (pointCount - 1) - 0.5) * 4.2;
        // Harmonic acoustic combination
        const y = Math.sin(time * 5.0 + i * 0.28) * Math.cos(time * 3.2 + i * 0.15) * amp;
        posArray[i * 3 + 1] = y;
      }
      posAttr.needsUpdate = true;

      line.rotation.y = Math.sin(time * 0.5) * 0.1;
      ghostLine.rotation.y = -Math.sin(time * 0.5) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      ghostMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`h-9 w-32 sm:w-44 overflow-hidden pointer-events-none ${className}`}
      title={isPlaying ? 'Acoustic Riyaz Harmonic Active' : 'Riyaz Idle'}
    />
  );
};
