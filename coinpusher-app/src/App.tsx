import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useCallback, useState } from 'react'

import { ArcadeScene } from '@/scenes/ArcadeScene'
import { useResponsiveCamera } from '@/hooks/useResponsiveCamera'
import type { CoinSpawnerStats } from '@/utils/types'

import './App.css'

const initialStats: CoinSpawnerStats = {
  activeCoins: 0,
  totalSpawned: 0,
  collected: 0,
}

function App() {
  const [, setStats] = useState<CoinSpawnerStats>(initialStats)
  const [dropTargetX, setDropTargetX] = useState<number | null>(null)
  const [dropQueue, setDropQueue] = useState<number[]>([])
  const { camera, controls } = useResponsiveCamera()

  const handleStatsChange = useCallback((nextStats: CoinSpawnerStats) => {
    setStats(nextStats)
  }, [])

  const handleDropTargetChange = useCallback((value: number | null) => {
    setDropTargetX(value)
  }, [])

  const handleConfirmDrop = useCallback((value: number) => {
    setDropQueue((prev) => [...prev, value])
  }, [])

  const handleDropRequestConsumed = useCallback(() => {
    setDropQueue((prev) => prev.slice(1))
  }, [])

  return (
    <div className="app">
      <Canvas
        shadows
        camera={camera}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#f0f6ff']} />
        <ArcadeScene
          onStatsChange={handleStatsChange}
          dropTargetX={dropTargetX}
          dropQueue={dropQueue}
          onDropTargetChange={handleDropTargetChange}
          onConfirmDrop={handleConfirmDrop}
          onDropRequestConsumed={handleDropRequestConsumed}
        />
        <OrbitControls
          makeDefault
          enablePan={false}
          target={controls.target}
          minPolarAngle={controls.minPolarAngle}
          maxPolarAngle={controls.maxPolarAngle}
          minAzimuthAngle={controls.minAzimuthAngle}
          maxAzimuthAngle={controls.maxAzimuthAngle}
          minDistance={controls.minDistance}
          maxDistance={controls.maxDistance}
        />
      </Canvas>
    </div>
  )
}

export default App
