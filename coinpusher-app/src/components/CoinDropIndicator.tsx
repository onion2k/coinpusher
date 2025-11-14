import type { ThreeElements } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

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
  const matcapTexture = useLoader(TextureLoader, '/C09E5C_DAD2B9_654429_81582D-256px.png')

  return (
    <mesh position={position} rotation={coinRotation}>
      <cylinderGeometry args={[radius, radius, thickness, 32]} />
      <meshMatcapMaterial matcap={matcapTexture} transparent opacity={0.35} />
    </mesh>
  )
}
