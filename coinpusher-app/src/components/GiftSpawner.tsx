import { Gift } from './Gift'
import { useGiftSpawner } from '@/hooks/useGiftSpawner'

interface GiftSpawnerProps {
  capacity?: number
  initialGifts?: number
  spawnInterval?: number
}

export const GiftSpawner = ({ capacity, initialGifts, spawnInterval }: GiftSpawnerProps) => {
  const { gifts, handleGiftExit } = useGiftSpawner({
    capacity,
    initialGifts,
    spawnInterval,
  })

  return (
    <>
      {gifts.map((gift) => (
        <Gift key={gift.id} gift={gift} onExit={handleGiftExit} />
      ))}
    </>
  )
}
