import { Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, type RefObject } from 'react'
import { AdditiveBlending, BufferGeometry, CanvasTexture, Float32BufferAttribute, type Group } from 'three'

/**
 * Abstract string lights — a nod to the warm bulb canopy over Shantione's garden.
 * ~250 points and a handful of fireflies: deliberately tiny so it costs almost nothing.
 * `progress` (0→1) is written by the scroll timeline and gently draws the lights forward.
 */

const STRANDS = 9
const BULBS = 28
const SPAN = 9

function useGlowTexture() {
  return useMemo(() => {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,240,210,1)')
    g.addColorStop(0.25, 'rgba(246,213,154,0.75)')
    g.addColorStop(1, 'rgba(246,213,154,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    return new CanvasTexture(canvas)
  }, [])
}

function useStrands() {
  return useMemo(() => {
    const bulbs: number[] = []
    const wires: number[] = []
    for (let s = 0; s < STRANDS; s++) {
      const z = -2 - s * 3.6
      const y = 2.6 + (s % 2) * 0.35
      const sag = 0.9 + (s % 3) * 0.25
      const tilt = (s % 2 === 0 ? 1 : -1) * 0.25
      for (let b = 0; b <= BULBS; b++) {
        const t = b / BULBS
        const x = -SPAN + t * SPAN * 2
        const yy = y - sag * (1 - (2 * t - 1) ** 2) + tilt * (2 * t - 1)
        bulbs.push(x, yy, z)
        if (b > 0) wires.push(...bulbs.slice(-6, -3), x, yy, z)
      }
    }
    const bulbGeo = new BufferGeometry()
    bulbGeo.setAttribute('position', new Float32BufferAttribute(bulbs, 3))
    const wireGeo = new BufferGeometry()
    wireGeo.setAttribute('position', new Float32BufferAttribute(wires, 3))
    return { bulbGeo, wireGeo }
  }, [])
}

function Strands({ progress }: { progress: RefObject<number> }) {
  const group = useRef<Group>(null)
  const texture = useGlowTexture()
  const { bulbGeo, wireGeo } = useStrands()

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const targetZ = (progress.current ?? 0) * 18
    group.current.position.z += (targetZ - group.current.position.z) * Math.min(1, delta * 3)
    group.current.rotation.z = Math.sin(t * 0.25) * 0.015
    group.current.position.y = Math.sin(t * 0.4) * 0.05
  })

  return (
    <group ref={group}>
      <lineSegments geometry={wireGeo}>
        <lineBasicMaterial color="#d9bf8f" transparent opacity={0.12} />
      </lineSegments>
      <points geometry={bulbGeo}>
        <pointsMaterial
          map={texture}
          size={0.42}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          color="#ffe2ad"
        />
      </points>
    </group>
  )
}

export default function LanternField({ progress, active }: { progress: RefObject<number>; active: boolean }) {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      style={{ pointerEvents: 'none' }}
    >
      <fog attach="fog" args={['#13281c', 8, 34]} />
      <Strands progress={progress} />
      <Sparkles count={50} scale={[14, 6, 10]} position={[0, -0.5, -4]} size={2.2} speed={0.25} opacity={0.6} color="#f3c98b" />
    </Canvas>
  )
}
