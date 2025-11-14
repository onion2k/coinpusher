import { CuboidCollider, RigidBody } from '@react-three/rapier'

import {
  ARENA_FLOOR_THICKNESS,
  ARENA_HALF_DEPTH,
  ARENA_HALF_WIDTH,
  COLLECTOR_DEPTH,
  COLLECTOR_DROP_HEIGHT,
} from '@/utils/constants'

export const Floor = () => {
  const baseWidth = ARENA_HALF_WIDTH * 2 + 0.6
  const baseDepth = ARENA_HALF_DEPTH + COLLECTOR_DEPTH

  return (
    <group>
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, -ARENA_FLOOR_THICKNESS / 2, 0]}
      >
        <CuboidCollider
          args={[
            baseWidth / 2,
            ARENA_FLOOR_THICKNESS / 2,
            baseDepth / 2,
          ]}
        />
        <mesh receiveShadow>
          <boxGeometry
            args={[baseWidth, ARENA_FLOOR_THICKNESS, baseDepth]}
          />
          <meshStandardMaterial color="#d9eaf4" roughness={0.6} />
        </mesh>
      </RigidBody>

      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, COLLECTOR_DROP_HEIGHT, baseDepth / 2 - 0.2]}
      >
        <CuboidCollider
          args={[baseWidth / 2, 0.05, COLLECTOR_DEPTH / 2]}
          rotation={[-0.4, 0, 0]}
        />
        <mesh receiveShadow rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[baseWidth, 0.1, COLLECTOR_DEPTH]} />
          <meshStandardMaterial color="#b5d8e8" roughness={0.7} />
        </mesh>
      </RigidBody>
    </group>
  )
}
