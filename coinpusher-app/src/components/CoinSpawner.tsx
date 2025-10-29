import { useEffect } from 'react'

import { useCoinSpawner } from '@/hooks/useCoinSpawner'
import {
  COIN_RADIUS,
  COIN_THICKNESS,
} from '@/utils/constants'
import type { CoinSpawnerStats } from '@/utils/types'

import { Coin } from './Coin'

interface CoinSpawnerProps {
  onStatsChange?: (stats: CoinSpawnerStats) => void
}

export const CoinSpawner = ({ onStatsChange }: CoinSpawnerProps) => {
  const { coins, stats, handleCoinExit } = useCoinSpawner()

  useEffect(() => {
    onStatsChange?.(stats)
  }, [stats, onStatsChange])

  return (
    <>
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
