import { useCallback } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { CylinderCollider, CuboidCollider, RigidBody } from '@react-three/rapier'

import {
  COIN_RADIUS,
  COIN_SPAWN_HEIGHT,
  COIN_SPAWN_Z,
  PLATFORM_WIDTH,
} from '@/utils/constants'

const pegRows = 5
const pegColumns = 4
const pegRadius = 0.05
const pegHeight = 0.35
const pegRotation: [number, number, number] = [Math.PI / 2, 0, 0]
const pegVerticalSpacing = 0.7
const pegHorizontalMargin = pegRadius + 0.05
const glassThickness = 0.05
const sideThickness = 0.08

interface PegBoardProps {
  onTargetChange?: (x: number | null) => void
  onConfirmTarget?: (x: number) => void
}

export const PegBoard = ({ onTargetChange, onConfirmTarget }: PegBoardProps) => {
  const boardWidth = PLATFORM_WIDTH
  const boardHeight = 5
  const boardThickness = 0.08
  const boardCenterY = COIN_SPAWN_HEIGHT - boardHeight / 2
  const boardZ = COIN_SPAWN_Z - boardThickness / 2

  const pegZ = COIN_SPAWN_Z + pegRadius * 0.4
  const pegTopY = COIN_SPAWN_HEIGHT - 0.5
  const availableWidth = Math.max(boardWidth - pegHorizontalMargin * 2, pegRadius * 2)
  const pegHorizontalStep =
    pegColumns > 1 ? availableWidth / (pegColumns - 0.5) : 0
  const pegStartX = -availableWidth / 2
  const isSingleColumn = pegHorizontalStep === 0

  const pegPositions: { key: string; position: [number, number, number] }[] = []

  for (let row = 0; row < pegRows; row += 1) {
    const rowStart = row % 2 === 0 ? pegStartX : pegStartX + pegHorizontalStep / 2
    const y = pegTopY - row * pegVerticalSpacing

    for (let column = 0; column < pegColumns; column += 1) {
      const x = isSingleColumn ? 0 : rowStart + column * pegHorizontalStep
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
  const boardBackZ = boardZ - boardThickness / 2
  const glassFrontZ = glassZ + glassThickness / 2
  const sideDepth = glassFrontZ - boardBackZ
  const sideCenterZ = boardBackZ + sideDepth / 2
  const sideHeight = glassHeight
  const sideOffsetX = boardWidth / 2 + sideThickness / 2
  const pointerLimit = Math.max(boardWidth / 2 - pegHorizontalMargin, pegHorizontalMargin)

  const clampPointerX = useCallback(
    (value: number) => Math.max(-pointerLimit, Math.min(pointerLimit, value)),
    [pointerLimit],
  )

  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation()
      const clampedX = clampPointerX(event.point.x)
      onTargetChange?.(clampedX)
    },
    [clampPointerX, onTargetChange],
  )

  const handlePointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation()
      const clampedX = clampPointerX(event.point.x)
      onTargetChange?.(clampedX)
      onConfirmTarget?.(clampedX)
    },
    [clampPointerX, onTargetChange, onConfirmTarget],
  )

  const handlePointerExit = useCallback(() => {
    onTargetChange?.(null)
  }, [onTargetChange])

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
          <meshStandardMaterial color="#ffe5b4" roughness={0.4} metalness={0.05} />
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
            <meshStandardMaterial color="#ff9ec4" metalness={0.2} roughness={0.35} />
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
        <mesh
          castShadow
          receiveShadow
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerOut={handlePointerExit}
          onPointerLeave={handlePointerExit}
        >
          <boxGeometry args={[boardWidth, glassHeight, glassThickness]} />
          <meshStandardMaterial
            color="#fefcff"
            transparent
            opacity={0.25}
            roughness={0.05}
            metalness={0}
          />
        </mesh>
      </RigidBody>

      {[sideOffsetX, -sideOffsetX].map((x) => (
        <RigidBody
          key={`side-${x}`}
          type="fixed"
          colliders={false}
          position={[x, glassCenterY, sideCenterZ]}
        >
          <CuboidCollider
            args={[sideThickness / 2, sideHeight / 2, sideDepth / 2]}
          />
          <mesh castShadow receiveShadow>
            <boxGeometry args={[sideThickness, sideHeight, sideDepth]} />
            <meshStandardMaterial
              color="#e1f5ff"
              transparent
              opacity={0.25}
              roughness={0.05}
              metalness={0}
            />
          </mesh>
        </RigidBody>
      ))}
    </group>
  )
}
