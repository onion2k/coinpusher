import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useCallback, useState } from 'react'

import { ArcadeScene } from '@/scenes/ArcadeScene'
import type { CoinSpawnerStats } from '@/utils/types'

import './App.css'

const initialStats: CoinSpawnerStats = {
  activeCoins: 0,
  totalSpawned: 0,
  collected: 0,
}

function App() {
  const [stats, setStats] = useState<CoinSpawnerStats>(initialStats)
  const [dropTargetX, setDropTargetX] = useState<number | null>(null)

  const handleStatsChange = useCallback((nextStats: CoinSpawnerStats) => {
    setStats(nextStats)
  }, [])

  const handleDropTargetChange = useCallback((value: number | null) => {
    setDropTargetX(value)
  }, [])

  return (
    <div className="app">
      <Canvas
        shadows
        camera={{ position: [5.5, 6, 10], fov: 45 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#0e141b']} />
        <ArcadeScene
          onStatsChange={handleStatsChange}
          dropTargetX={dropTargetX}
          onDropTargetChange={handleDropTargetChange}
        />
        <OrbitControls
          makeDefault
          enablePan={false}
          maxPolarAngle={Math.PI * 0.49}
          minDistance={8}
          maxDistance={20}
        />
      </Canvas>

      <section className="hud">
        <h1 className="hud__title">Coin Pusher</h1>
        <div className="hud__stats">
          <div className="hud__stat">
            <span className="hud__label">Active</span>
            <span className="hud__value">{stats.activeCoins}</span>
          </div>
          <div className="hud__stat">
            <span className="hud__label">Collected</span>
            <span className="hud__value">{stats.collected}</span>
          </div>
          <div className="hud__stat">
            <span className="hud__label">Dropped</span>
            <span className="hud__value">{stats.totalSpawned}</span>
          </div>
        </div>
        <p className="hud__hint">Drag to orbit • Scroll to zoom</p>
      </section>
    </div>
  )
}

export default App
