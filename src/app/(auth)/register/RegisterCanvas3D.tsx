"use client";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Stars,
  Sparkles as DreiSparkles,
} from "@react-three/drei";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { finalImg, hr_3 } from "@/assets/images";

function RotatingHouse() {
  const houseRef = useRef<THREE.Group>(null);
  const [showAlt, setShowAlt] = useState(false);
  // Load textures
  const finalTexture = useLoader(THREE.TextureLoader, finalImg.src);
  const hr3Texture = useLoader(THREE.TextureLoader, hr_3.src);

  useFrame((state) => {
    if (houseRef.current) {
      const rot = state.clock.elapsedTime * 0.5;
      houseRef.current.rotation.y = rot;
      // Swap texture at halfway point
      setShowAlt(Math.abs(Math.sin(rot)) > 0.7);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.08} floatIntensity={0.13}>
      <group ref={houseRef} position={[0, -1.5, 0]} scale={[1.2, 1.2, 1.2]}>
        {/* Main House Structure with dynamic texture */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[3.5, 2, 2.5]} />
          <meshStandardMaterial map={showAlt ? hr3Texture : finalTexture} />
        </mesh>
        {/* Foundation */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 0.3, 3]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[2.5, 1.5, 4]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Front Door */}
        <mesh position={[0, 0.5, 1.26]}>
          <boxGeometry args={[0.6, 1.5, 0.05]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Door Handle */}
        <mesh position={[0.2, 0.5, 1.28]}>
          <sphereGeometry args={[0.03]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        {/* Windows - Front */}
        <mesh position={[-0.8, 0.8, 1.26]}>
          <boxGeometry args={[0.8, 0.6, 0.05]} />
          <meshStandardMaterial color="#87CEEB" opacity={0.7} transparent />
        </mesh>
        <mesh position={[0.8, 0.8, 1.26]}>
          <boxGeometry args={[0.8, 0.6, 0.05]} />
          <meshStandardMaterial color="#87CEEB" opacity={0.7} transparent />
        </mesh>
        {/* Window Frames */}
        <mesh position={[-0.8, 0.8, 1.27]}>
          <boxGeometry args={[0.85, 0.65, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.8, 0.8, 1.27]}>
          <boxGeometry args={[0.85, 0.65, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Side Windows */}
        <mesh position={[1.76, 0.8, 0]}>
          <boxGeometry args={[0.05, 0.6, 0.8]} />
          <meshStandardMaterial color="#87CEEB" opacity={0.7} transparent />
        </mesh>
        <mesh position={[-1.76, 0.8, 0]}>
          <boxGeometry args={[0.05, 0.6, 0.8]} />
          <meshStandardMaterial color="#87CEEB" opacity={0.7} transparent />
        </mesh>
        {/* Chimney */}
        <mesh position={[1, 3, -0.5]}>
          <boxGeometry args={[0.4, 1, 0.4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Garage */}
        <mesh position={[2.5, 0.8, 0]}>
          <boxGeometry args={[1.5, 1.6, 2.5]} />
          <meshStandardMaterial color="#e8e8e8" />
        </mesh>
        {/* Garage Door */}
        <mesh position={[2.5, 0.5, 1.26]}>
          <boxGeometry args={[1.3, 1.4, 0.05]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
        {/* Driveway */}
        <mesh position={[1.5, -0.05, 2]}>
          <boxGeometry args={[3, 0.1, 2]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
        {/* Garden Elements */}
        <mesh position={[-2, 0.1, 1.5]}>
          <coneGeometry args={[0.3, 0.8, 8]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
        <mesh position={[-2.5, 0.1, 0.5]}>
          <coneGeometry args={[0.25, 0.6, 8]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
        {/* Pathway */}
        <mesh position={[0, -0.05, 2.5]}>
          <boxGeometry args={[0.8, 0.1, 1.5]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
      </group>
    </Float>
  );
}

function ArchitecturalElements() {
  return (
    <>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[-4, 3, -2]}>
          <octahedronGeometry args={[0.2]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[4, -1, -1]}>
          <dodecahedronGeometry args={[0.3]} />
          <meshStandardMaterial
            color="#f5f5f5"
            emissive="#f5f5f5"
            emissiveIntensity={0.05}
          />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[-3, -2, -3]}>
          <icosahedronGeometry args={[0.25]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </Float>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[3, 2, -4]} rotation={[0, 0, 0.3]}>
          <planeGeometry args={[1, 0.7]} />
          <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
      </Float>
      {/* Sparkles for extra magic */}
      <DreiSparkles
        count={40}
        scale={[8, 4, 8]}
        size={2}
        color="#fffbe6"
        speed={0.8}
      />
    </>
  );
}

export default function RegisterCanvas3D() {
  // Use finalImg as a beautiful background
  const finalTexture = useLoader(THREE.TextureLoader, finalImg.src);
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: `url(${finalImg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.25,
          filter: "blur(2px) saturate(1.2)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        className="w-full h-full"
        style={{ position: "relative", zIndex: 1 }}
      >
        <Stars
          radius={80}
          depth={50}
          count={2000}
          factor={4}
          fade
          speed={1.5}
        />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.8} />
        <spotLight position={[0, 10, 0]} intensity={0.5} />
        <RotatingHouse />
        <ArchitecturalElements />
        <Environment preset="city" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
