import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  COIN_SPAWN_HEIGHT,
  COIN_SPAWN_SCATTER,
  COIN_SPAWN_Z,
  PLATFORM_WIDTH,
} from '@/utils/constants'
import type { GiftConfig, GiftExitReason, Vector3Tuple } from '@/utils/types'

const TARGET_LIMIT = (PLATFORM_WIDTH * 0.9) / 2

const clampTarget = (value: number): number =>
  Math.max(-TARGET_LIMIT, Math.min(TARGET_LIMIT, value))

const randomInRange = (radius: number): number =>
  (Math.random() - 0.5) * 2 * radius

const createGift = (
  id: number,
  spawnHeight: number,
  scatterRadius: number,
  spawnZ: number,
): GiftConfig => ({
  id,
  position: [clampTarget(randomInRange(scatterRadius)), spawnHeight, spawnZ] as Vector3Tuple,
})

const createInitialGifts = (
  count: number,
  spawnHeight: number,
  scatterRadius: number,
  spawnZ: number,
): GiftConfig[] =>
  Array.from({ length: count }, (_, index) =>
    createGift(index, spawnHeight, scatterRadius, spawnZ),
  )

const randomSpawnDelay = (base: number): number => base * (0.6 + Math.random() * 0.8)

interface UseGiftSpawnerOptions {
  capacity?: number
  scatterRadius?: number
  spawnHeight?: number
  spawnZ?: number
  initialGifts?: number
  spawnInterval?: number
}

export const useGiftSpawner = (
  options: UseGiftSpawnerOptions = {},
): {
  gifts: GiftConfig[]
  handleGiftExit: (id: number, reason: GiftExitReason) => void
} => {
  const {
    capacity = 3,
    scatterRadius = 3,
    spawnHeight = 2.5,
    spawnZ: spawnZPosition = -0.8,
    initialGifts = 1,
    spawnInterval = 10000,
  } = options

  const initialGiftsList = useMemo(
    () => createInitialGifts(initialGifts, spawnHeight, scatterRadius, spawnZPosition),
    [initialGifts, scatterRadius, spawnHeight, spawnZPosition],
  )

  const [gifts, setGifts] = useState<GiftConfig[]>(initialGiftsList)
  const giftsRef = useRef(gifts)
  const nextIdRef = useRef(initialGiftsList.length - 1)
  const spawnTimerRef = useRef(randomSpawnDelay(spawnInterval))

  useEffect(() => {
    giftsRef.current = gifts
  }, [gifts])

  useFrame((_, delta) => {
    spawnTimerRef.current -= delta

    if (spawnTimerRef.current > 0) {
      return
    }

    if (giftsRef.current.length >= capacity) {
      // Try again soon once space frees up
      spawnTimerRef.current = 2
      return
    }

    spawnTimerRef.current = randomSpawnDelay(spawnInterval)

    setGifts((prev) => {
      if (prev.length >= capacity) {
        return prev
      }

      nextIdRef.current += 1
      const nextGift = createGift(
        nextIdRef.current,
        spawnHeight,
        scatterRadius,
        spawnZPosition,
      )

      return [...prev, nextGift]
    })
  })

  const handleGiftExit = useCallback((id: number, _reason: GiftExitReason) => {
    setGifts((prev) => {
      if (!prev.some((gift) => gift.id === id)) {
        return prev
      }

      return prev.filter((gift) => gift.id !== id)
    })
  }, [])

  return { gifts, handleGiftExit }
}
