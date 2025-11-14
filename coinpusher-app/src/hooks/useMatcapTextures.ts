import { useMemo } from 'react'
import { TextureLoader, type Texture } from 'three'

import { MATCAP_TEXTURE_PATHS } from '@/utils/matcapTextures'

const textureCache = new Map<string, Texture>()
const loader = new TextureLoader()

const loadTexture = (path: string): Texture => {
  const cached = textureCache.get(path)
  if (cached) {
    return cached
  }

  const texture = loader.load(path)
  textureCache.set(path, texture)
  return texture
}

export const useMatcapTextures = (): Texture[] =>
  useMemo(() => MATCAP_TEXTURE_PATHS.map((path) => loadTexture(path)), [])
