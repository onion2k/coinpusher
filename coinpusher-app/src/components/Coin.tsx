import { useFrame } from '@react-three/fiber'
import {
  CylinderCollider,
  RigidBody,
  type RapierRigidBody,
} from '@react-three/rapier'
import type { Texture } from 'three'
import { useEffect, useMemo, useRef } from 'react'

import {
  ARENA_HALF_DEPTH,
  ARENA_HALF_WIDTH,
  COIN_COLLECTION_HEIGHT,
  COIN_DESPAWN_HEIGHT,
} from '@/utils/constants'
import type { CoinConfig, CoinExitReason } from '@/utils/types'

interface CoinProps {
  coin: CoinConfig
  radius: number
  thickness: number
  onExit: (id: number, reason: CoinExitReason) => void
  matcapTextures: Texture[]
}

const horizontalLimit = ARENA_HALF_WIDTH + 1
const depthLimit = ARENA_HALF_DEPTH + 2
const coinRotation: [number, number, number] = [Math.PI / 2, 0, 0]

export const Coin = ({ coin, radius, thickness, onExit, matcapTextures }: CoinProps) => {
  const bodyRef = useRef<RapierRigidBody | null>(null)
  const didExitRef = useRef(false)
  const textureIndex = useMemo(
    () => Math.floor(Math.random() * Math.max(1, matcapTextures.length)),
    [coin.id, matcapTextures.length],
  )
  const matcapTexture = matcapTextures[textureIndex]

  useEffect(() => {
    const body = bodyRef.current

    if (!body) {
      return
    }

    const impulseX = (Math.random() - 0.5) * 0.01
    body.applyImpulse({ x: impulseX, y: 0, z: 0 }, true)
  }, [coin.id])

  useFrame(() => {
    const body = bodyRef.current

    if (!body || didExitRef.current) {
      return
    }

    const { x, y, z } = body.translation()

    if (y <= COIN_COLLECTION_HEIGHT) {
      didExitRef.current = true
      onExit(coin.id, 'collected')
      return
    }

    const isOutOfBounds =
      Math.abs(x) > horizontalLimit || Math.abs(z) > depthLimit || y <= COIN_DESPAWN_HEIGHT

    if (isOutOfBounds) {
      didExitRef.current = true
      onExit(coin.id, 'cleanup')
    }
  })

  return (
    <RigidBody
      ref={bodyRef}
      position={coin.position}
      colliders={false}
      restitution={0.3}
      friction={0.6}
      linearDamping={0.3}
      angularDamping={0.4}
    >
      <CylinderCollider args={[thickness / 2, radius]} rotation={coinRotation} />
      <mesh castShadow receiveShadow rotation={coinRotation}>
        <cylinderGeometry args={[radius, radius, thickness, 32]} />
        <meshMatcapMaterial matcap={matcapTexture} />
      </mesh>
    </RigidBody>
  )
}
