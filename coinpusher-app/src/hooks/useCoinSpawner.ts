import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  COIN_MAX_CAPACITY,
  COIN_SPAWN_HEIGHT,
  COIN_SPAWN_INTERVAL,
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

interface UseCoinSpawnerOptions {
  spawnInterval?: number
  capacity?: number
  scatterRadius?: number
  spawnHeight?: number
  spawnZ?: number
  initialCoins?: number
  dropTargetX?: number | null
}

const createInitialCoins = (
  count: number,
  spawnHeight: number,
  scatterRadius: number,
  spawnZ: number,
): CoinConfig[] =>
  Array.from({ length: count }, (_, index) =>
    createCoin(index, spawnHeight, scatterRadius, spawnZ),
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
    spawnInterval = COIN_SPAWN_INTERVAL,
    capacity = COIN_MAX_CAPACITY,
    scatterRadius = COIN_SPAWN_SCATTER,
    spawnHeight = COIN_SPAWN_HEIGHT,
    spawnZ: spawnZPosition = COIN_SPAWN_Z,
    initialCoins = 0,
    dropTargetX = null,
  } = options

  const initialCoinsList = useMemo(
    () => createInitialCoins(initialCoins, spawnHeight, scatterRadius, spawnZPosition),
    [initialCoins, spawnHeight, scatterRadius, spawnZPosition],
  )

  const [coins, setCoins] = useState<CoinConfig[]>(initialCoinsList)
  const [stats, setStats] = useState<CoinSpawnerStats>({
    activeCoins: initialCoinsList.length,
    totalSpawned: initialCoinsList.length,
    collected: 0,
  })

  const elapsedRef = useRef(0)
  const nextIdRef = useRef(initialCoinsList.length - 1)
  const targetRef = useRef<number | null>(dropTargetX)

  useEffect(() => {
    targetRef.current = dropTargetX ?? null
  }, [dropTargetX])

  useFrame((_, delta) => {
    elapsedRef.current += delta

    if (
      elapsedRef.current < spawnInterval ||
      coins.length >= capacity // early exit based on latest render state
    ) {
      return
    }

    elapsedRef.current = 0

    setCoins((prev) => {
      if (prev.length >= capacity) {
        return prev
      }

      nextIdRef.current += 1
      const nextCoin = createCoin(
        nextIdRef.current,
        spawnHeight,
        scatterRadius,
        spawnZPosition,
        targetRef.current,
      )
      const nextCoins = [...prev, nextCoin]

      setStats((prevStats) => ({
        ...prevStats,
        activeCoins: nextCoins.length,
        totalSpawned: prevStats.totalSpawned + 1,
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
