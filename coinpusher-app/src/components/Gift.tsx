import { useFrame } from '@react-three/fiber'
import {
  CuboidCollider,
  RigidBody,
  TrimeshCollider,
  type RapierRigidBody,
} from '@react-three/rapier'
import { useEffect, useMemo, useRef } from 'react'

import { Duck, useDuckModel } from '@/assets/duck'
import {
  ARENA_HALF_DEPTH,
  ARENA_HALF_WIDTH,
  COIN_COLLECTION_HEIGHT,
  COIN_DESPAWN_HEIGHT,
} from '@/utils/constants'
import type { GiftConfig, GiftExitReason } from '@/utils/types'

interface GiftProps {
  gift: GiftConfig
  onExit: (id: number, reason: GiftExitReason) => void
}

const horizontalLimit = ARENA_HALF_WIDTH + 1
const depthLimit = ARENA_HALF_DEPTH + 2
const DUCK_SCALE = 0.1

export const Gift = ({ gift, onExit }: GiftProps) => {
  const bodyRef = useRef<RapierRigidBody | null>(null)
  const didExitRef = useRef(false)
  const { nodes } = useDuckModel()
  const duckGeometry = nodes.RubberDuck_mesh.geometry
  const duckRotation = useMemo<[number, number, number]>(() => [0, Math.random() * Math.PI * 2, 0], [gift.id])
  const colliderArgs = useMemo<
    [Float32Array, Uint16Array | Uint32Array] | null
  >(() => {
    const positionAttribute = duckGeometry.attributes.position
    const index = duckGeometry.index

    if (!positionAttribute || !index) {
      return null
    }

    const original = positionAttribute.array as Float32Array
    const scaledVertices = new Float32Array(original.length)

    for (let i = 0; i < original.length; i += 3) {
      scaledVertices[i] = original[i] * DUCK_SCALE
      scaledVertices[i + 1] = original[i + 1] * DUCK_SCALE
      scaledVertices[i + 2] = original[i + 2] * DUCK_SCALE
    }

    const indexArray = index.array as Uint16Array | Uint32Array
    const IndexConstructor = indexArray.constructor as
      | Uint16ArrayConstructor
      | Uint32ArrayConstructor
    const indices = new IndexConstructor(indexArray.length)
    indices.set(indexArray)

    return [scaledVertices, indices]
  }, [duckGeometry])

  useEffect(() => {
    const body = bodyRef.current

    if (!body) {
      return
    }

    const impulseX = (Math.random() - 0.5) * 0.02
    const impulseZ = (Math.random() - 0.5) * 0.015
    body.applyImpulse({ x: impulseX, y: 0, z: impulseZ }, true)
  }, [gift.id])

  useFrame(() => {
    const body = bodyRef.current

    if (!body || didExitRef.current) {
      return
    }

    const { x, y, z } = body.translation()

    if (y <= COIN_COLLECTION_HEIGHT) {
      didExitRef.current = true
      onExit(gift.id, 'collected')
      return
    }

    const isOutOfBounds =
      Math.abs(x) > horizontalLimit || Math.abs(z) > depthLimit || y <= COIN_DESPAWN_HEIGHT

    if (isOutOfBounds) {
      didExitRef.current = true
      onExit(gift.id, 'cleanup')
    }
  })

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={gift.position}
      rotation={duckRotation}
      restitution={0.15}
      friction={0.95}
      linearDamping={0.6}
      angularDamping={0.9}
    >
      {colliderArgs ? (
        <TrimeshCollider args={colliderArgs} />
      ) : (
        <CuboidCollider args={[0.25, 0.18, 0.32]} />
      )}
      <Duck scale={DUCK_SCALE} />
    </RigidBody>
  )
}
