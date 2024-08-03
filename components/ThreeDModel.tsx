// components/ThreeDModel.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';

export const ThreeDModel = () => {
  return (
    <Canvas className="w-full h-full">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial color="#4338ca" />
      </Sphere>
      <OrbitControls enableZoom={false} autoRotate />
    </Canvas>
  );
};