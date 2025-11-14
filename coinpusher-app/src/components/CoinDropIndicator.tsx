import type { ThreeElements } from '@react-three/fiber'

import { useMatcapTextures } from '@/hooks/useMatcapTextures'

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
}: CoinDropIndicatorProps) => {
  const [matcapTexture] = useMatcapTextures()

  return (
    <mesh position={position} rotation={coinRotation}>
      <cylinderGeometry args={[radius, radius, thickness, 32]} />
      <meshMatcapMaterial matcap={matcapTexture} transparent opacity={0.35} />
    </mesh>
  )
}
