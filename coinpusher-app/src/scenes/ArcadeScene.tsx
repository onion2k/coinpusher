import { Suspense } from 'react'
import { Physics } from '@react-three/rapier'

import { ArenaWalls } from '@/components/ArenaWalls'
import { CoinSpawner } from '@/components/CoinSpawner'
import { Floor } from '@/components/Floor'
import { Lighting } from '@/components/Lighting'
import { Platform } from '@/components/Platform'
import { PegBoard } from '@/components/PegBoard'
import { ShelfPusher } from '@/components/ShelfPusher'
import {
  BOTTOM_PUSHER_DEPTH,
  BOTTOM_PUSHER_HEIGHT,
  BOTTOM_PUSHER_OFFSET_Z,
  BOTTOM_PUSHER_VERTICAL_SIZE,
  GRAVITY_VECTOR,
  PLATFORM_BOTTOM_HEIGHT,
  PLATFORM_DEPTH,
  PLATFORM_HEIGHT,
  PLATFORM_TOP_HEIGHT,
  PLATFORM_WIDTH,
  TOP_PUSHER_DEPTH,
  TOP_PUSHER_HEIGHT,
  TOP_PUSHER_OFFSET_Z,
  TOP_PUSHER_VERTICAL_SIZE,
} from '@/utils/constants'
import type { CoinSpawnerStats } from '@/utils/types'

interface ArcadeSceneProps {
  onStatsChange?: (stats: CoinSpawnerStats) => void
}

export const ArcadeScene = ({ onStatsChange }: ArcadeSceneProps) => (
  <Suspense fallback={null}>
    <Physics gravity={GRAVITY_VECTOR} timeStep="vary" colliders="hull">
      <Lighting />
      <ArenaWalls />
      <Floor />
      <PegBoard />

      <Platform
        position={[0, PLATFORM_TOP_HEIGHT, -0.9]}
        width={PLATFORM_WIDTH * 0.9}
        depth={PLATFORM_DEPTH * 0.9}
        height={PLATFORM_HEIGHT}
        color="#6d98a6"
        motionAxis="z"
        motionAmplitude={0.3}
        motionSpeed={1.9}
        phase={Math.PI / 4}
      />

      <ShelfPusher
        position={[0, TOP_PUSHER_HEIGHT, TOP_PUSHER_OFFSET_Z]}
        width={PLATFORM_WIDTH * 0.85}
        height={TOP_PUSHER_VERTICAL_SIZE}
        depth={TOP_PUSHER_DEPTH}
      />

      <ShelfPusher
        position={[0, BOTTOM_PUSHER_HEIGHT, BOTTOM_PUSHER_OFFSET_Z]}
        width={PLATFORM_WIDTH * 0.92}
        height={BOTTOM_PUSHER_VERTICAL_SIZE}
        depth={BOTTOM_PUSHER_DEPTH}
        color="#3a5360"
      />

      <Platform
        position={[0, PLATFORM_BOTTOM_HEIGHT, 0]}
        width={PLATFORM_WIDTH}
        depth={PLATFORM_DEPTH}
        height={PLATFORM_HEIGHT}
        color="#4a6f7d"
        motionAxis="z"
        motionAmplitude={0.45}
        motionSpeed={1.1}
      />

      <CoinSpawner onStatsChange={onStatsChange} />
    </Physics>
  </Suspense>
)
