import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload, OrbitControls, useGLTF } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import CanvasLoader from "../Loader";

const Stars = () => {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 10 })); // Augmenter le rayon

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial transparent color='#ffffff' size={0.1} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
};

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");
  return <primitive object={earth.scene} scale={2.3} position={[0, 0, 0]} />;
};

const Scene = () => {
  return (
    <Canvas
      shadows
      frameloop='demand'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 35,
        near: 0.1,
        far: 200,
        position: [0, 0, 10], // Ajuster la position de la caméra
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls autoRotate enableZoom={false} />
        <Stars />
        <Earth />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
