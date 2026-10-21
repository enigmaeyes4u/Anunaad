import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAudio } from '../../context/AudioContext';
import { Sparkles, Compass, Volume2, RotateCw, Layers, ZoomIn, ZoomOut, RefreshCw, Hand } from 'lucide-react';

interface HeroResonanceSceneProps {
  onExploreClick?: () => void;
  onEnterBaithakClick?: () => void;
}

export const HeroResonanceScene: React.FC<HeroResonanceSceneProps> = ({
  onExploreClick,
  onEnterBaithakClick
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { currentTrack, isPlaying } = useAudio();

  const [activeMode, setActiveMode] = useState<'brahma' | 'lotus' | 'constellation' | 'yantra'>('brahma');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(7.5);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // Dynamic parameters passed to the Three.js loop
  const sceneState = useRef({
    isPlaying: false,
    activeMode: 'brahma' as 'brahma' | 'lotus' | 'constellation' | 'yantra',
    wireframe: false,
    isAutoRotating: true,
    zoomLevel: 7.5,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    drag: { isDragging: false, startX: 0, startY: 0, rotX: 0.15, rotY: 0.4, velX: 0, velY: 0 },
    ripples: [] as { radius: number; maxRadius: number; opacity: number; mesh: THREE.LineLoop }[]
  });

  useEffect(() => {
    sceneState.current.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    sceneState.current.activeMode = activeMode;
  }, [activeMode]);

  useEffect(() => {
    sceneState.current.wireframe = wireframe;
  }, [wireframe]);

  useEffect(() => {
    sceneState.current.isAutoRotating = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    sceneState.current.zoomLevel = zoomLevel;
  }, [zoomLevel]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Setup Scene, Camera, Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 700;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x141311, 0.032);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, sceneState.current.zoomLevel);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.replaceChildren(renderer.domElement);

    // 2. Majestic Lighting Architecture (Saffron Sunrise, Temple Gold, Terracotta Dusk)
    const ambientLight = new THREE.AmbientLight(0xFDFBF7, 0.75);
    scene.add(ambientLight);

    const saffronLight = new THREE.PointLight(0xD97724, 3.5, 25);
    saffronLight.position.set(5, 4, 6);
    scene.add(saffronLight);

    const terracottaLight = new THREE.PointLight(0xC85A32, 2.8, 25);
    terracottaLight.position.set(-6, -3, 4);
    scene.add(terracottaLight);

    const goldRimLight = new THREE.DirectionalLight(0xE6B94D, 1.8);
    goldRimLight.position.set(0, 8, -4);
    scene.add(goldRimLight);

    // 3. Central Sacred Structure
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // A. Sacred Anahata Inner Core (Gold & Terracotta Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x1C1B19,
      emissive: 0xC85A32,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.9,
      clearcoat: 0.95,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // B. Celestial Torus Ribbon (Harmonic Sound Wave Loop)
    const ribbonGeo = new THREE.TorusKnotGeometry(2.15, 0.12, 180, 32, 2, 3);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xD97724,
      metalness: 0.92,
      roughness: 0.18,
      wireframe: false
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    rootGroup.add(ribbonMesh);

    // C. Secondary Counter-Orbiting Filigree Ribbon
    const subRibbonGeo = new THREE.TorusKnotGeometry(2.35, 0.05, 140, 24, 3, 5);
    const subRibbonMat = new THREE.MeshStandardMaterial({
      color: 0xE6B94D,
      metalness: 0.96,
      roughness: 0.15,
      wireframe: true
    });
    const subRibbonMesh = new THREE.Mesh(subRibbonGeo, subRibbonMat);
    rootGroup.add(subRibbonMesh);

    // D. Mandalic Sound Lotus Petals (12 curved harmonic leaves)
    const lotusGroup = new THREE.Group();
    rootGroup.add(lotusGroup);
    const petalCount = 12;
    const petalMeshes: THREE.Mesh[] = [];

    for (let p = 0; p < petalCount; p++) {
      const angle = (p / petalCount) * Math.PI * 2;
      const petalShape = new THREE.Shape();
      petalShape.moveTo(0, 0);
      petalShape.quadraticCurveTo(0.4, 1.2, 0, 2.2);
      petalShape.quadraticCurveTo(-0.4, 1.2, 0, 0);

      const petalGeo = new THREE.ShapeGeometry(petalShape, 16);
      const petalMat = new THREE.MeshStandardMaterial({
        color: p % 2 === 0 ? 0xD97724 : 0xC85A32,
        roughness: 0.35,
        metalness: 0.65,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const petalMesh = new THREE.Mesh(petalGeo, petalMat);
      petalMesh.rotation.z = angle;
      petalMesh.rotation.x = Math.PI / 4.5;
      petalMesh.position.z = -0.2;
      lotusGroup.add(petalMesh);
      petalMeshes.push(petalMesh);
    }

    // E. Concentric Yantra Frequency Rings (Laser-engraved Mandalas)
    const yantraGroup = new THREE.Group();
    rootGroup.add(yantraGroup);

    const ringRadii = [2.6, 3.2, 3.8];
    const ringLoops: THREE.LineLoop[] = [];

    ringRadii.forEach((r, idx) => {
      const segs = 128;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < segs; i++) {
        const theta = (i / segs) * Math.PI * 2;
        // add wave oscillation
        const wave = Math.sin(theta * (8 + idx * 4)) * 0.04;
        pts.push(new THREE.Vector3(Math.cos(theta) * (r + wave), Math.sin(theta) * (r + wave), 0));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const ringMat = new THREE.LineBasicMaterial({
        color: idx === 1 ? 0xE6B94D : 0xD97724,
        transparent: true,
        opacity: 0.65 - idx * 0.15
      });
      const ringMesh = new THREE.LineLoop(ringGeo, ringMat);
      yantraGroup.add(ringMesh);
      ringLoops.push(ringMesh);
    });

    // F. Golden Ratio Constellation Particles (750 Starlight Tradition Nodes)
    const particleCount = 750;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cGold = new THREE.Color(0xE6B94D);
    const cTerra = new THREE.Color(0xC85A32);
    const cIvory = new THREE.Color(0xFDFBF7);

    for (let i = 0; i < particleCount; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      const distance = THREE.MathUtils.randFloat(3.2, 6.4);

      particlePositions[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = distance * Math.cos(phi);

      const mix = Math.random();
      const col = mix < 0.5 ? cGold.clone().lerp(cTerra, mix * 2) : cTerra.clone().lerp(cIvory, (mix - 0.5) * 2);

      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Procedural Glowing Disc Texture
    const discCanvas = document.createElement('canvas');
    discCanvas.width = 64;
    discCanvas.height = 64;
    const discCtx = discCanvas.getContext('2d')!;
    const grad = discCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(230,185,77,0.85)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    discCtx.fillStyle = grad;
    discCtx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(discCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    rootGroup.add(particles);

    // Ripple group for click shockwaves
    const rippleGroup = new THREE.Group();
    scene.add(rippleGroup);

    // 4. Interactive Mouse Drag Orbit and Sonic Ripple Handlers
    const handleMouseDown = (e: MouseEvent) => {
      sceneState.current.drag.isDragging = true;
      sceneState.current.drag.startX = e.clientX;
      sceneState.current.drag.startY = e.clientY;
      setIsInteracting(true);

      // Create interactive sonic wave ripple at click
      const rippleGeo = new THREE.BufferGeometry();
      const segs = 64;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < segs; i++) {
        const th = (i / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(th), Math.sin(th), 0));
      }
      rippleGeo.setFromPoints(pts);
      const rippleMat = new THREE.LineBasicMaterial({
        color: 0xE6B94D,
        transparent: true,
        opacity: 0.95
      });
      const rippleMesh = new THREE.LineLoop(rippleGeo, rippleMat);
      rippleMesh.rotation.x = Math.PI / 3;
      rippleGroup.add(rippleMesh);

      sceneState.current.ripples.push({
        radius: 0.5,
        maxRadius: 5.5,
        opacity: 1.0,
        mesh: rippleMesh
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      sceneState.current.mouse.targetX = normX;
      sceneState.current.mouse.targetY = normY;

      if (sceneState.current.drag.isDragging) {
        const deltaX = e.clientX - sceneState.current.drag.startX;
        const deltaY = e.clientY - sceneState.current.drag.startY;
        sceneState.current.drag.velY = deltaX * 0.005;
        sceneState.current.drag.velX = deltaY * 0.005;
        sceneState.current.drag.rotY += sceneState.current.drag.velY;
        sceneState.current.drag.rotX += sceneState.current.drag.velX;
        sceneState.current.drag.startX = e.clientX;
        sceneState.current.drag.startY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      sceneState.current.drag.isDragging = false;
      setTimeout(() => setIsInteracting(false), 500);
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Wheel zoom
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.003;
      const nextZoom = THREE.MathUtils.clamp(camera.position.z + delta, 4.5, 11.0);
      camera.position.z = nextZoom;
      setZoomLevel(nextZoom);
    };
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 5. Responsive Resize
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

    // 6. Main 60FPS Render & Kinetic Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const { isPlaying, activeMode, wireframe, isAutoRotating } = sceneState.current;

      // Smooth inertia rotation
      if (!sceneState.current.drag.isDragging) {
        sceneState.current.drag.rotY += sceneState.current.drag.velY;
        sceneState.current.drag.rotX += sceneState.current.drag.velX;
        sceneState.current.drag.velY *= 0.94;
        sceneState.current.drag.velX *= 0.94;

        if (isAutoRotating) {
          sceneState.current.drag.rotY += 0.004;
        }
      }

      rootGroup.rotation.y = sceneState.current.drag.rotY;
      rootGroup.rotation.x = sceneState.current.drag.rotX;

      // Parallax mouse follow
      sceneState.current.mouse.x += (sceneState.current.mouse.targetX - sceneState.current.mouse.x) * 0.05;
      sceneState.current.mouse.y += (sceneState.current.mouse.targetY - sceneState.current.mouse.y) * 0.05;
      camera.position.x = sceneState.current.mouse.x * 0.7;
      camera.position.y = sceneState.current.mouse.y * 0.5;
      camera.lookAt(0, 0, 0);

      // Audio-reactive pulse
      const audioPulse = isPlaying ? Math.sin(elapsed * 7) * 0.12 + Math.cos(elapsed * 11) * 0.05 : 0;
      const baseScale = 1.0 + audioPulse;

      // Mode-specific animations
      if (activeMode === 'lotus') {
        lotusGroup.visible = true;
        ribbonMesh.visible = false;
        subRibbonMesh.visible = false;
        yantraGroup.visible = true;

        petalMeshes.forEach((mesh, idx) => {
          const breath = Math.sin(elapsed * 2 + idx * 0.5) * 0.15;
          mesh.scale.set(1 + breath + audioPulse, 1 + breath * 1.2 + audioPulse, 1);
        });
        lotusGroup.rotation.z += 0.002;
      } else if (activeMode === 'constellation') {
        lotusGroup.visible = false;
        ribbonMesh.visible = true;
        subRibbonMesh.visible = true;
        yantraGroup.visible = false;
        particles.rotation.y += 0.006;
      } else if (activeMode === 'yantra') {
        lotusGroup.visible = false;
        ribbonMesh.visible = false;
        subRibbonMesh.visible = true;
        yantraGroup.visible = true;

        ringLoops.forEach((r, idx) => {
          r.rotation.z += (idx % 2 === 0 ? 0.004 : -0.005);
          const pulse = 1 + Math.sin(elapsed * 3 + idx) * 0.05 + audioPulse;
          r.scale.set(pulse, pulse, pulse);
        });
      } else {
        // Brahma Default: Everything resonates in harmony
        lotusGroup.visible = true;
        ribbonMesh.visible = true;
        subRibbonMesh.visible = true;
        yantraGroup.visible = true;

        ribbonMesh.rotation.x = elapsed * 0.35;
        ribbonMesh.rotation.y = elapsed * 0.45;
        subRibbonMesh.rotation.x = -elapsed * 0.4;
        subRibbonMesh.rotation.z = elapsed * 0.3;
      }

      // Wireframe toggles
      coreMat.wireframe = wireframe;
      ribbonMat.wireframe = wireframe;

      // Core breathing
      coreMesh.scale.set(baseScale, baseScale, baseScale);
      coreMat.emissiveIntensity = 0.25 + (isPlaying ? (Math.sin(elapsed * 8) * 0.3 + 0.3) : 0);

      // Process click ripple shockwaves
      for (let i = sceneState.current.ripples.length - 1; i >= 0; i--) {
        const rip = sceneState.current.ripples[i];
        rip.radius += delta * 4.5;
        rip.opacity -= delta * 0.7;
        rip.mesh.scale.set(rip.radius, rip.radius, rip.radius);
        (rip.mesh.material as THREE.LineBasicMaterial).opacity = Math.max(0, rip.opacity);

        if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
          rippleGroup.remove(rip.mesh);
          rip.mesh.geometry.dispose();
          (rip.mesh.material as THREE.Material).dispose();
          sceneState.current.ripples.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup & Free Memory
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      resizeObserver.disconnect();

      coreGeo.dispose();
      coreMat.dispose();
      ribbonGeo.dispose();
      ribbonMat.dispose();
      subRibbonGeo.dispose();
      subRibbonMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      petalMeshes.forEach(p => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });
      ringLoops.forEach(r => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      const next = THREE.MathUtils.clamp(prev + (direction === 'in' ? -0.8 : 0.8), 4.5, 11.0);
      return next;
    });
  };

  const handleReset = () => {
    sceneState.current.drag.rotX = 0.15;
    sceneState.current.drag.rotY = 0.4;
    sceneState.current.drag.velX = 0;
    sceneState.current.drag.velY = 0;
    setZoomLevel(7.5);
  };

  return (
    <div className="relative w-full h-[620px] sm:h-[700px] lg:h-[760px] overflow-hidden rounded-3xl bg-gradient-to-b from-[#141311] via-[#1E1C19] to-[#141311] text-[#FDFBF7] shadow-2xl border border-[#3A3630]">
      
      {/* 3D WebGL Canvas Target Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
        title="Click and drag to rotate the 3D Celestial Core in 360°. Click to create sound waves."
      />

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#141311]/30 to-[#141311] pointer-events-none z-1" />

      {/* Interactive Drag Hint Pill */}
      <div className="absolute bottom-6 right-6 z-10 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-[#D8D1C2] pointer-events-none">
        <Hand className="w-3.5 h-3.5 text-[#E6B94D]" />
        <span>Click & drag to rotate 3D • Click to emit sonic shockwaves</span>
      </div>

      {/* Top Controls Toolbar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 pointer-events-none">
        
        {/* Live Status Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D97724]/40 shadow-lg pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97724] animate-ping" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#FDFBF7] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E6B94D]" />
            Live 3D Celestial Resonance
          </span>
          {isPlaying && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-[#C85A32] text-white text-[9px] font-mono tracking-wider animate-pulse flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Audio Reactive
            </span>
          )}
        </div>

        {/* 3D Viewport Controls */}
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-[#4A453C] pointer-events-auto">
          <button
            type="button"
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-1.5 rounded-xl text-[#A8A296] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-1.5 rounded-xl text-[#A8A296] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Reset 3D Orientation"
            className="p-1.5 rounded-xl text-[#A8A296] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-[#4A453C] mx-0.5" />

          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            title="Toggle Structural Wireframe Geometry"
            className={`px-2.5 py-1 rounded-xl text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
              wireframe ? 'bg-[#C85A32] text-white font-bold' : 'text-[#A8A296] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wireframe</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            title="Toggle Continuous Rotation"
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              isAutoRotating ? 'text-[#E6B94D] bg-white/10' : 'text-[#8E877B] hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>
        </div>
      </div>

      {/* Main Foreground Editorial Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-12 lg:p-16 max-w-4xl space-y-6 pointer-events-none">
        
        {/* Sanskrit Devanagari Inscription */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-devanagari text-base sm:text-lg text-[#E6B94D] tracking-wide font-normal">
              अनुनाद • नाद ब्रह्माण्ड
            </span>
            <div className="h-px w-20 bg-gradient-to-r from-[#D97724] to-transparent" />
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-md">
            Every tradition deserves to <span className="italic text-[#E89254]">resonate</span>.
          </h1>
        </div>

        <p className="text-sm sm:text-base lg:text-lg text-[#D8D1C2] font-light max-w-2xl leading-relaxed drop-shadow-sm">
          Bridging the living masters of India's rare oral, visual, and rhythmic heritage directly with curious learners, patrons, and collectors worldwide.
        </p>

        {/* Interactive Sacred Geometry Harmonic Modes */}
        <div className="flex flex-wrap items-center gap-2 pt-2 pointer-events-auto">
          <span className="text-[11px] font-mono text-[#A8A296] uppercase tracking-wider mr-1 hidden sm:inline">
            Acoustic Field:
          </span>
          {[
            { id: 'brahma', label: 'Naad Brahma' },
            { id: 'lotus', label: 'Mandalic Lotus' },
            { id: 'yantra', label: 'Sacred Yantra' },
            { id: 'constellation', label: 'Lineage Constellation' }
          ].map(mode => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id as any)}
              className={`py-1.5 px-3 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                activeMode === mode.id
                  ? 'bg-[#C85A32] text-white shadow-md font-semibold scale-105'
                  : 'bg-black/50 hover:bg-black/80 text-[#D8D1C2] border border-[#3A3630]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 pointer-events-auto">
          <button
            type="button"
            onClick={onExploreClick}
            className="py-4 px-8 bg-[#C85A32] hover:bg-[#B34D28] text-white font-semibold text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            <span>Explore Living Keepers →</span>
          </button>

          <button
            type="button"
            onClick={onEnterBaithakClick}
            className="py-4 px-7 bg-white/10 hover:bg-white/15 backdrop-blur-md text-[#FDFBF7] font-semibold text-xs uppercase tracking-widest rounded-2xl border border-white/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:border-[#D97724]"
          >
            <Sparkles className="w-4 h-4 text-[#E6B94D]" />
            <span>Interactive 3D Pavilion</span>
          </button>
        </div>

        {/* Current Sound Signature Notice */}
        {currentTrack && (
          <div className="pt-2 text-xs font-mono text-[#A8A296] flex items-center gap-2 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Resonating to: <strong className="text-white font-sans">{currentTrack.title}</strong> — {currentTrack.artistName}</span>
          </div>
        )}

      </div>

    </div>
  );
};
