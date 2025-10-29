export const Lighting = () => (
  <>
    <ambientLight intensity={0.35} />
    <directionalLight
      castShadow
      position={[6, 8, 6]}
      intensity={1}
      shadow-mapSize={[1024, 1024]}
    />
    <spotLight
      castShadow
      position={[-4, 6, 2]}
      angle={0.6}
      penumbra={0.4}
      intensity={0.7}
      target-position={[0, 0, 0]}
    />
  </>
)
