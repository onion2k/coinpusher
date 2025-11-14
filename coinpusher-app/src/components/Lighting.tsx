export const Lighting = () => (
  <>
    <hemisphereLight
      intensity={0.8}
      color="#fdf6e3"
      groundColor="#e0f2ff"
    />
    <ambientLight intensity={0.25} color="#f6f1eb" />
    <directionalLight
      castShadow
      position={[5, 10, 5]}
      intensity={1.5}
      color="#ffe9c7"
      shadow-mapSize={[2048, 2048]}
    />
    <spotLight
      castShadow
      position={[-2, 7, 3]}
      angle={0.45}
      penumbra={0.45}
      intensity={1.4}
      color="#c8e7ff"
      target-position={[0, 0, 0]}
    />
  </>
)
