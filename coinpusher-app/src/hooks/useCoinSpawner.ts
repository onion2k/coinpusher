import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  COIN_MAX_CAPACITY,
  COIN_SPAWN_HEIGHT,
  COIN_SPAWN_SCATTER,
  COIN_SPAWN_Z,
  PLATFORM_WIDTH,
} from '@/utils/constants'
import type {
  CoinConfig,
  CoinExitReason,
  CoinSpawnerStats,
  Vector3Tuple,
} from '@/utils/types'

const randomInRange = (radius: number): number =>
  (Math.random() - 0.5) * 2 * radius

const TARGET_LIMIT = (PLATFORM_WIDTH * 0.9) / 2

const clampTarget = (value: number): number =>
  Math.max(-TARGET_LIMIT, Math.min(TARGET_LIMIT, value))

const createCoin = (
  id: number,
  spawnHeight: number,
  scatterRadius: number,
  spawnZ: number,
  overrideX?: number | null,
): CoinConfig => ({
  id,
  position: [
    typeof overrideX === 'number'
      ? clampTarget(overrideX)
      : randomInRange(scatterRadius),
    spawnHeight,
    spawnZ,
  ] as Vector3Tuple,
})


const createCoinInit = (
  id: number,
): CoinConfig => ({
  id,
  position: [(Math.random()-0.5)*3, 2, (Math.random()-0.5)*2] as Vector3Tuple,
})

interface UseCoinSpawnerOptions {
  capacity?: number
  scatterRadius?: number
  spawnHeight?: number
  spawnZ?: number
  initialCoins?: number
  dropTargetX?: number | null
  dropQueue?: number[]
  onDropRequestConsumed?: () => void
}

const createInitialCoins = (
  count: number,
): CoinConfig[] =>
  Array.from({ length: count }, (_, index) =>
    createCoinInit(index),
  )

export const useCoinSpawner = (
  options: UseCoinSpawnerOptions = {},
): {
  coins: CoinConfig[]
  stats: CoinSpawnerStats
  handleCoinExit: (id: number, reason: CoinExitReason) => void
  spawnZ: number
} => {
  const {
    capacity = COIN_MAX_CAPACITY,
    scatterRadius = COIN_SPAWN_SCATTER,
    spawnHeight = COIN_SPAWN_HEIGHT,
    spawnZ: spawnZPosition = COIN_SPAWN_Z,
    initialCoins = 40,
    dropTargetX = null,
    dropQueue = [],
    onDropRequestConsumed,
  } = options

  const initialCoinsList = useMemo(
    () => createInitialCoins(initialCoins),
    [initialCoins],
  )

  const [coins, setCoins] = useState<CoinConfig[]>(initialCoinsList)
  const [stats, setStats] = useState<CoinSpawnerStats>({
    activeCoins: initialCoinsList.length,
    totalSpawned: initialCoinsList.length,
    collected: 0,
  })

  const nextIdRef = useRef(initialCoinsList.length - 1)
  const targetRef = useRef<number | null>(dropTargetX)
  const dropQueueRef = useRef<number[]>(dropQueue)
  const dropConsumedRef = useRef(onDropRequestConsumed)

  useEffect(() => {
    targetRef.current = dropTargetX ?? null
  }, [dropTargetX])

  useEffect(() => {
    dropQueueRef.current = dropQueue
  }, [dropQueue])

  useEffect(() => {
    dropConsumedRef.current = onDropRequestConsumed
  }, [onDropRequestConsumed])

  useFrame(() => {
    if (coins.length >= capacity || dropQueueRef.current.length === 0) {
      return
    }

    setCoins((prev) => {
      if (prev.length >= capacity) {
        return prev
      }

      if (prev.length >= capacity) {
        return prev
      }

      if (dropQueueRef.current.length === 0) {
        return prev
      }

      const availableSlots = Math.max(0, capacity - prev.length)
      if (availableSlots === 0) {
        return prev
      }

      const nextCoins = [...prev]
      let spawned = 0

      while (
        spawned < availableSlots &&
        dropQueueRef.current.length > 0
      ) {
        const requestedX = dropQueueRef.current[0]
        dropConsumedRef.current?.()
        dropQueueRef.current = dropQueueRef.current.slice(1)

        nextIdRef.current += 1
        const nextCoin = createCoin(
          nextIdRef.current,
          spawnHeight,
          scatterRadius,
          spawnZPosition,
          requestedX ?? targetRef.current,
        )
        nextCoins.push(nextCoin)
        spawned += 1
      }

      if (!spawned) {
        return prev
      }

      setStats((prevStats) => ({
        ...prevStats,
        activeCoins: nextCoins.length,
        totalSpawned: prevStats.totalSpawned + spawned,
      }))

      return nextCoins
    })
  })

  const handleCoinExit = useCallback(
    (id: number, reason: CoinExitReason) => {
      setCoins((prev) => {
        if (!prev.some((coin) => coin.id === id)) {
          return prev
        }

        const nextCoins = prev.filter((coin) => coin.id !== id)

        setStats((prevStats) => ({
          activeCoins: nextCoins.length,
          totalSpawned: prevStats.totalSpawned,
          collected:
            reason === 'collected'
              ? prevStats.collected + 1
              : prevStats.collected,
        }))

        return nextCoins
      })
    },
    [],
  )

  return { coins, stats, handleCoinExit, spawnZ: spawnZPosition }
}
