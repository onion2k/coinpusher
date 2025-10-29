export type Vector3Tuple = readonly [number, number, number]

export interface CoinConfig {
  id: number
  position: Vector3Tuple
}

export interface CoinSpawnerStats {
  activeCoins: number
  totalSpawned: number
  collected: number
}

export type CoinExitReason = 'collected' | 'cleanup'
