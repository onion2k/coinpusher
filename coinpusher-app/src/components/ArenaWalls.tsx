import { CuboidCollider, RigidBody } from '@react-three/rapier'

import {
  ARENA_HALF_DEPTH,
  ARENA_HALF_WIDTH,
  ARENA_WALL_HEIGHT,
} from '@/utils/constants'

const wallThickness = 0.2

export const ArenaWalls = () => (
  <group>
    <RigidBody
      type="fixed"
      colliders={false}
      position={[-ARENA_HALF_WIDTH - wallThickness / 2, ARENA_WALL_HEIGHT / 2, 0]}
    >
      <CuboidCollider
        args={[wallThickness / 2, ARENA_WALL_HEIGHT / 2, ARENA_HALF_DEPTH]}
      />
      <mesh castShadow receiveShadow>
        <boxGeometry
          args={[wallThickness, ARENA_WALL_HEIGHT, ARENA_HALF_DEPTH * 2]}
        />
        <meshStandardMaterial color="#cbe4ff" roughness={0.4} />
      </mesh>
    </RigidBody>

    <RigidBody
      type="fixed"
      colliders={false}
      position={[ARENA_HALF_WIDTH + wallThickness / 2, ARENA_WALL_HEIGHT / 2, 0]}
    >
      <CuboidCollider
        args={[wallThickness / 2, ARENA_WALL_HEIGHT / 2, ARENA_HALF_DEPTH]}
      />
      <mesh castShadow receiveShadow>
        <boxGeometry
          args={[wallThickness, ARENA_WALL_HEIGHT, ARENA_HALF_DEPTH * 2]}
        />
        <meshStandardMaterial color="#cbe4ff" roughness={0.4} />
      </mesh>
    </RigidBody>

    <RigidBody
      type="fixed"
      colliders={false}
      position={[0, ARENA_WALL_HEIGHT / 2, -ARENA_HALF_DEPTH - wallThickness / 2]}
    >
      <CuboidCollider
        args={[ARENA_HALF_WIDTH, ARENA_WALL_HEIGHT / 2, wallThickness / 2]}
      />
      <mesh castShadow receiveShadow>
        <boxGeometry
          args={[ARENA_HALF_WIDTH * 2, ARENA_WALL_HEIGHT, wallThickness]}
        />
        <meshStandardMaterial color="#b3dff0" roughness={0.5} />
      </mesh>
    </RigidBody>
  </group>
)
