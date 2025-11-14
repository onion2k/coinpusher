export const COIN_RADIUS = 0.25
export const COIN_THICKNESS = 0.08
export const COIN_SPAWN_INTERVAL = 2.5
export const COIN_SPAWN_HEIGHT = 3.5
export const COIN_DESPAWN_HEIGHT = -4.2
export const COIN_COLLECTION_HEIGHT = -0.8
export const COIN_MAX_CAPACITY = 150
export const COIN_SPAWN_SCATTER = 1

export const PLATFORM_WIDTH = 4
export const PLATFORM_DEPTH = 2
export const PLATFORM_HEIGHT = 0.2
export const PLATFORM_TOP_HEIGHT = 1.4
export const PLATFORM_BOTTOM_HEIGHT = 0.4

export const TOP_PUSHER_HEIGHT = PLATFORM_TOP_HEIGHT + 0.15
export const TOP_PUSHER_DEPTH = 0.5
export const TOP_PUSHER_VERTICAL_SIZE = 0.5
export const TOP_PUSHER_OFFSET_Z = -1.75
export const COIN_SPAWN_Z =
  TOP_PUSHER_OFFSET_Z + TOP_PUSHER_DEPTH / 2 + 0.25

export const BOTTOM_PUSHER_HEIGHT = PLATFORM_BOTTOM_HEIGHT + 0.25
export const BOTTOM_PUSHER_DEPTH = 0.8
export const BOTTOM_PUSHER_VERTICAL_SIZE = 0.38
export const BOTTOM_PUSHER_OFFSET_Z = -0.5

export const ARENA_HALF_WIDTH = PLATFORM_WIDTH / 2
export const ARENA_HALF_DEPTH = PLATFORM_DEPTH
export const ARENA_WALL_HEIGHT = 1.8

export const ARENA_FLOOR_THICKNESS = 0.2
export const COLLECTOR_DEPTH = 1.6
export const COLLECTOR_DROP_HEIGHT = -1.7

export const GRAVITY_VECTOR: [number, number, number] = [0, -9.81, 0]
