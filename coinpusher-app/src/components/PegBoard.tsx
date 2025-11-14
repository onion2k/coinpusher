import { CylinderCollider, CuboidCollider, RigidBody } from '@react-three/rapier'

import {
  COIN_RADIUS,
  COIN_SPAWN_HEIGHT,
  COIN_SPAWN_Z,
  PLATFORM_WIDTH,
} from '@/utils/constants'

const pegRows = 5
const pegColumns = 6
const pegRadius = 0.09
const pegHeight = 0.35
const pegRotation: [number, number, number] = [Math.PI / 2, 0, 0]
const pegHorizontalPadding = -0.2
const pegVerticalSpacing = 0.7
const glassThickness = 0.05

export const PegBoard = () => {
  const boardWidth = PLATFORM_WIDTH * 0.9
  const boardHeight = 5
  const boardThickness = 0.08
  const boardCenterY = COIN_SPAWN_HEIGHT - boardHeight / 2
  const boardZ = COIN_SPAWN_Z - boardThickness / 2

  const pegZ = COIN_SPAWN_Z + pegRadius * 0.4
  const pegTopY = COIN_SPAWN_HEIGHT - 0.35
  const pegHorizontalSpace = boardWidth - pegHorizontalPadding
  const pegHorizontalStep =
    pegColumns > 1 ? pegHorizontalSpace / (pegColumns - 1) : 0
  const pegStartX = -pegHorizontalSpace / 2

  const pegPositions = []

  for (let row = 0; row < pegRows; row += 1) {
    const rowOffset = row % 2 === 0 ? 0 : pegHorizontalStep / 2
    const y = pegTopY - row * pegVerticalSpacing

    for (let column = 0; column < pegColumns; column += 1) {
      const x = pegStartX + column * pegHorizontalStep + rowOffset
      pegPositions.push({
        key: `${row}-${column}`,
        position: [x, y, pegZ] as [number, number, number],
      })
    }
  }

  const glassGapHeight = COIN_RADIUS * 2 + 0.5
  const glassHeight = Math.max(boardHeight - glassGapHeight, 0.3)
  const glassCenterY = boardCenterY + glassGapHeight / 2
  const glassZ =
    pegZ + pegRadius + glassThickness / 2 + 0.02 /* leave breathing room */

  return (
    <group>
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, boardCenterY, boardZ]}
      >
        <CuboidCollider
          args={[boardWidth / 2, boardHeight / 2, boardThickness / 2]}
        />
        <mesh castShadow receiveShadow>
          <boxGeometry args={[boardWidth, boardHeight, boardThickness]} />
          <meshStandardMaterial color="#191919" roughness={0.55} />
        </mesh>
      </RigidBody>

      {pegPositions.map(({ key, position }) => (
        <RigidBody
          key={key}
          type="fixed"
          colliders={false}
          position={position}
        >
          <CylinderCollider args={[pegHeight / 2, pegRadius]} rotation={pegRotation} />
          <mesh castShadow receiveShadow rotation={pegRotation}>
            <cylinderGeometry args={[pegRadius, pegRadius, pegHeight, 16]} />
            <meshStandardMaterial color="#6c6c6c" metalness={0.2} roughness={0.4} />
          </mesh>
        </RigidBody>
      ))}

      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, glassCenterY, glassZ]}
      >
        <CuboidCollider
          args={[boardWidth / 2, glassHeight / 2, glassThickness / 2]}
        />
        <mesh castShadow receiveShadow>
          <boxGeometry args={[boardWidth, glassHeight, glassThickness]} />
          <meshStandardMaterial
            color="#b7d7e6"
            transparent
            opacity={0.25}
            roughness={0.05}
            metalness={0}
          />
        </mesh>
      </RigidBody>
    </group>
  )
}
