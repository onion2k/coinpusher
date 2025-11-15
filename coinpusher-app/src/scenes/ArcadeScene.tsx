import { Suspense } from 'react'
import { Physics } from '@react-three/rapier'

import { ArenaWalls } from '@/components/ArenaWalls'
import { CoinSpawner } from '@/components/CoinSpawner'
import { GiftSpawner } from '@/components/GiftSpawner'
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
  dropTargetX?: number | null
  dropQueue?: number[]
  onDropTargetChange?: (value: number | null) => void
  onConfirmDrop?: (x: number) => void
  onDropRequestConsumed?: () => void
}

export const ArcadeScene = ({
  onStatsChange,
  dropTargetX,
  dropQueue,
  onDropTargetChange,
  onConfirmDrop,
  onDropRequestConsumed,
}: ArcadeSceneProps) => (
  <Suspense fallback={null}>
    <Physics gravity={GRAVITY_VECTOR} timeStep="vary" colliders="hull">
      <Lighting />
      <ArenaWalls />
      <Floor />
      <PegBoard onTargetChange={onDropTargetChange} onConfirmTarget={onConfirmDrop} />

      <Platform
        position={[0, PLATFORM_TOP_HEIGHT, -0.9]}
        width={PLATFORM_WIDTH}
        depth={PLATFORM_DEPTH * 0.9}
        height={PLATFORM_HEIGHT}
        color="#9fd5ff"
        motionAxis="z"
        motionAmplitude={0.3}
        motionSpeed={1.9}
        phase={Math.PI / 4}
      />

      <ShelfPusher
        position={[0, TOP_PUSHER_HEIGHT, TOP_PUSHER_OFFSET_Z]}
        width={PLATFORM_WIDTH}
        height={TOP_PUSHER_VERTICAL_SIZE}
        depth={TOP_PUSHER_DEPTH}
        color="#ffde8f"
      />

      <ShelfPusher
        position={[0, BOTTOM_PUSHER_HEIGHT, BOTTOM_PUSHER_OFFSET_Z]}
        width={PLATFORM_WIDTH}
        height={BOTTOM_PUSHER_VERTICAL_SIZE}
        depth={BOTTOM_PUSHER_DEPTH}
        color="#ffc6a8"
      />

      <Platform
        position={[0, PLATFORM_BOTTOM_HEIGHT, 0]}
        width={PLATFORM_WIDTH}
        depth={PLATFORM_DEPTH}
        height={PLATFORM_HEIGHT}
        color="#aed581"
        motionAxis="z"
        motionAmplitude={0.45}
        motionSpeed={1.1}
      />

      <CoinSpawner
        onStatsChange={onStatsChange}
        dropTargetX={dropTargetX}
        dropQueue={dropQueue}
        onDropRequestConsumed={onDropRequestConsumed}
      />
      <GiftSpawner />
    </Physics>
  </Suspense>
)
