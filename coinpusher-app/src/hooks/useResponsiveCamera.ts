import { useEffect, useState } from 'react'

type CameraVector = [number, number, number]

interface ControlSettings {
  target: CameraVector
  minPolarAngle: number
  maxPolarAngle: number
  minAzimuthAngle: number
  maxAzimuthAngle: number
  minDistance: number
  maxDistance: number
}

interface CameraSettings {
  position: CameraVector
  fov: number
  zoom?: number
}

interface ResponsiveCameraPreset {
  camera: CameraSettings
  controls: ControlSettings
}

type PresetKey = 'desktop' | 'mobilePortrait' | 'mobileLandscape'

const MOBILE_BREAKPOINT = 900

const CAMERA_PRESETS: Record<PresetKey, ResponsiveCameraPreset> = {
  desktop: {
    camera: {
      position: [0, 8, 11],
      fov: 42,
    },
    controls: {
      target: [0, 1.75, -0.7],
      minPolarAngle: Math.PI / 6,
      maxPolarAngle: Math.PI * 0.48,
      minAzimuthAngle: -Math.PI / 6,
      maxAzimuthAngle: Math.PI / 6,
      minDistance: 9,
      maxDistance: 15,
    },
  },
  mobilePortrait: {
    camera: {
      position: [0, 12, 15],
      fov: 55,
      zoom: 1.0,
    },
    controls: {
      target: [0, 2, 0],
      minPolarAngle: Math.PI / 5,
      maxPolarAngle: Math.PI * 0.45,
      minAzimuthAngle: -Math.PI / 6,
      maxAzimuthAngle: Math.PI / 6,
      minDistance: 7,
      maxDistance: 10,
    },
  },
  mobileLandscape: {
    camera: {
      position: [0, 6.5, 6.5],
      fov: 55,
      zoom: 1.05,
    },
    controls: {
      target: [0, 1.75, -0.7],
      minPolarAngle: Math.PI / 5,
      maxPolarAngle: Math.PI * 0.47,
      minAzimuthAngle: -Math.PI / 6,
      maxAzimuthAngle: Math.PI / 6,
      minDistance: 7.5,
      maxDistance: 11,
    },
  },
}

const getPresetKey = (width: number, height: number): PresetKey => {
  if (width >= MOBILE_BREAKPOINT) return 'desktop'
  return height >= width ? 'mobilePortrait' : 'mobileLandscape'
}

const getPreset = (key: PresetKey) => CAMERA_PRESETS[key]

export const useResponsiveCamera = (): ResponsiveCameraPreset => {
  const [presetKey, setPresetKey] = useState<PresetKey>(() => {
    if (typeof window === 'undefined') return 'desktop'
    return getPresetKey(window.innerWidth, window.innerHeight)
  })

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handleResize = () => {
      const nextKey = getPresetKey(window.innerWidth, window.innerHeight)
      setPresetKey((current) => (current === nextKey ? current : nextKey))
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return getPreset(presetKey)
}
