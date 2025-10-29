import { CuboidCollider, RigidBody } from '@react-three/rapier'

import type { Vector3Tuple } from '@/utils/types'

interface ShelfPusherProps {
  position: Vector3Tuple
  width: number
  height: number
  depth: number
  color?: string
}

export const ShelfPusher = ({
  position,
  width,
  height,
  depth,
  color = '#2e3f49',
}: ShelfPusherProps) => (
  <RigidBody type="fixed" colliders={false} position={position}>
    <CuboidCollider args={[width / 2, height / 2, depth / 2]} />
    <mesh castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.15} />
    </mesh>
  </RigidBody>
)
