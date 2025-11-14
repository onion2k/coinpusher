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
    <meshStandardMaterial
      color="#d4af37"
      metalness={0.5}
      roughness={0.8}
      transparent
      opacity={0.35}
    />
  </mesh>
)

