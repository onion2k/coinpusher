export const Lighting = () => (
  <>
    <hemisphereLight
      intensity={0.8}
      color="#fdf6e3"
      groundColor="#e0f2ff"
    />
    <ambientLight intensity={0.55} color="#f6f1eb" />
    <directionalLight
      castShadow
      position={[8, 10, 4]}
      intensity={1.8}
      color="#ffe9c7"
      shadow-mapSize={[2048, 2048]}
    />
    <spotLight
      castShadow
      position={[-5, 7, 3]}
      angle={0.55}
      penumbra={0.5}
      intensity={1.2}
      color="#cfe9ff"
      target-position={[0, 0, 0]}
    />
    <pointLight position={[0, 4, 6]} intensity={0.6} color="#ffd1dc" />
  </>
)
