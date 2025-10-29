import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  RigidBody,
  type RapierRigidBody,
} from '@react-three/rapier'
import { Quaternion } from 'three'
import { useMemo, useRef } from 'react'

import type { Vector3Tuple } from '@/utils/types'

type MotionAxis = 'x' | 'z'

interface PlatformProps {
  position: Vector3Tuple
  width: number
  depth: number
  height: number
  color?: string
  motionAxis?: MotionAxis
  motionAmplitude?: number
  motionSpeed?: number
  phase?: number
}

const axisIndex: Record<MotionAxis, 0 | 2> = {
  x: 0,
  z: 2,
}

export const Platform = ({
  position,
  width,
  depth,
  height,
  color = '#5b7c8d',
  motionAxis = 'z',
  motionAmplitude = 0.5,
  motionSpeed = 0.9,
  phase = 0,
}: PlatformProps) => {
  const bodyRef = useRef<RapierRigidBody | null>(null)
  const identityRotation = useMemo(() => new Quaternion(), [])
  const basePosition = useMemo(() => [...position] as Vector3Tuple, [position])
  const motionIndex = axisIndex[motionAxis]

  useFrame(({ clock }) => {
    const body = bodyRef.current

    if (!body) {
      return
    }

    const elapsed = clock.getElapsedTime()
    const offset = Math.sin(elapsed * motionSpeed + phase) * motionAmplitude

    const nextTranslation = {
      x: basePosition[0],
      y: basePosition[1],
      z: basePosition[2],
    }

    if (motionIndex === 0) {
      nextTranslation.x = basePosition[0] + offset
    } else {
      nextTranslation.z = basePosition[2] + offset
    }

    body.setNextKinematicTranslation(nextTranslation)
    body.setNextKinematicRotation(identityRotation)
  })

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      colliders={false}
      position={position}
    >
      <CuboidCollider args={[width / 2, height / 2, depth / 2]} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
    </RigidBody>
  )
}
