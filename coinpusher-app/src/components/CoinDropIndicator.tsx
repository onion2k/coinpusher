import type { ThreeElements } from '@react-three/fiber'

interface CoinDropIndicatorProps {
  position: ThreeElements['mesh']['position']
  radius: number
  thickness: number
}

const coinRotation: [number, number, number] = [Math.PI / 2, 0, 0]

export const CoinDropIndicator = ({
  position,
  radius,
  thickness,
}: CoinDropIndicatorProps) => (
  <mesh position={position} rotation={coinRotation}>
    <cylinderGeometry args={[radius, radius, thickness, 32]} />
    <meshPhysicalMaterial
      color="#ffe68f"
      metalness={0.75}
      roughness={0.35}
      transparent
      opacity={0.5}
      reflectivity={0.6}
      clearcoat={0.25}
      clearcoatRoughness={0.25}
      envMapIntensity={0.9}
    />
  </mesh>
)
