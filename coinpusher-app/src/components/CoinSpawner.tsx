import { useEffect } from 'react'

import { useCoinSpawner } from '@/hooks/useCoinSpawner'
import {
  COIN_RADIUS,
  COIN_SPAWN_HEIGHT,
  COIN_THICKNESS,
} from '@/utils/constants'
import type { CoinSpawnerStats } from '@/utils/types'

import { CoinDropIndicator } from './CoinDropIndicator'
import { Coin } from './Coin'

interface CoinSpawnerProps {
  onStatsChange?: (stats: CoinSpawnerStats) => void
  dropTargetX?: number | null
}

export const CoinSpawner = ({ onStatsChange, dropTargetX }: CoinSpawnerProps) => {
  const { coins, stats, handleCoinExit, spawnZ } = useCoinSpawner({ dropTargetX })

  useEffect(() => {
    onStatsChange?.(stats)
  }, [stats, onStatsChange])

  return (
    <>
      {typeof dropTargetX === 'number' && (
        <CoinDropIndicator
          position={[dropTargetX, COIN_SPAWN_HEIGHT, spawnZ]}
          radius={COIN_RADIUS * 1.05}
          thickness={COIN_THICKNESS}
        />
      )}
      {coins.map((coin) => (
        <Coin
          key={coin.id}
          coin={coin}
          radius={COIN_RADIUS}
          thickness={COIN_THICKNESS}
          onExit={handleCoinExit}
        />
      ))}
    </>
  )
}
