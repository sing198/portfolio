import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const ASSET_BASE = `${import.meta.env.BASE_URL}sculpture/`

// The cells stay joined at rest. As the visitor scrolls, each cell opens as one
// piece, rather than scattering thousands of disconnected individual triangles.
function prepareFractureGeometry(source) {
  const geometry = source.index ? source.toNonIndexed() : source.clone()
  geometry.computeBoundingBox()
  const center = geometry.boundingBox.getCenter(new THREE.Vector3())
  const size = geometry.boundingBox.getSize(new THREE.Vector3())
  geometry.translate(-center.x, -center.y, -center.z)
  geometry.scale(4.35 / size.y, 4.35 / size.y, 4.35 / size.y)

  const positions = geometry.attributes.position
  const cells = new Map()
  const centers = new Float32Array(positions.count * 3)
  const axes = new Float32Array(positions.count * 3)
  const phases = new Float32Array(positions.count)
  const vector = new THREE.Vector3()

  for (let index = 0; index < positions.count; index += 3) {
    vector.set(0, 0, 0)
    for (let corner = 0; corner < 3; corner++) {
      vector.x += positions.getX(index + corner) / 3
      vector.y += positions.getY(index + corner) / 3
      vector.z += positions.getZ(index + corner) / 3
    }
    const cellX = Math.floor((vector.x + 3) / 0.46)
    const cellY = Math.floor((vector.y + 3) / 0.43)
    const cellZ = Math.floor((vector.z + 3) / 0.52)
    const key = `${cellX},${cellY},${cellZ}`
    if (!cells.has(key)) {
      const phase = ((cellX * 73 + cellY * 37 + cellZ * 19) % 101) / 101
      const axis = new THREE.Vector3(
        Math.sin(phase * 15 + 1), Math.cos(phase * 12 + 2), Math.sin(phase * 9 + 3),
      ).normalize()
      cells.set(key, {
        center: new THREE.Vector3(
          cellX * 0.46 - 3 + 0.23,
          cellY * 0.43 - 3 + 0.215,
          cellZ * 0.52 - 3 + 0.26,
        ),
        axis,
        phase,
      })
    }
    const cell = cells.get(key)
    for (let corner = 0; corner < 3; corner++) {
      const vertex = index + corner
      centers.set(cell.center.toArray(), vertex * 3)
      axes.set(cell.axis.toArray(), vertex * 3)
      phases[vertex] = cell.phase
    }
  }
  geometry.setAttribute('aShardCenter', new THREE.BufferAttribute(centers, 3))
  geometry.setAttribute('aShardAxis', new THREE.BufferAttribute(axes, 3))
  geometry.setAttribute('aShardPhase', new THREE.BufferAttribute(phases, 1))
  geometry.computeBoundingSphere()
  // Opening fragments extend past the original bounds, so the mesh is not culled.
  return geometry
}

function sculptureMaterial(uniforms, crystal = false) {
  const material = new THREE.MeshPhysicalMaterial({
    color: crystal ? '#567299' : '#b2b5ba',
    metalness: crystal ? 0.35 : 0.48,
    roughness: crystal ? 0.22 : 0.3,
    clearcoat: crystal ? 0.7 : 0.4,
    clearcoatRoughness: 0.24,
    iridescence: crystal ? 0.15 : 0,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [110, 380],
    side: THREE.DoubleSide,
    flatShading: crystal,
    transparent: crystal,
    depthWrite: !crystal,
  })

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uSculptureTime = uniforms.time
    shader.uniforms.uSculptureProgress = uniforms.progress
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `
      #include <common>
      attribute vec3 aShardCenter;
      attribute vec3 aShardAxis;
      attribute float aShardPhase;
      uniform float uSculptureTime;
      uniform float uSculptureProgress;
      varying vec3 vSculpturePosition;
      mat3 sculptureRotation(vec3 a, float angle) {
        float s = sin(angle), c = cos(angle), r = 1.0 - c;
        return mat3(
          r*a.x*a.x+c, r*a.x*a.y-a.z*s, r*a.x*a.z+a.y*s,
          r*a.x*a.y+a.z*s, r*a.y*a.y+c, r*a.y*a.z-a.x*s,
          r*a.x*a.z-a.y*s, r*a.y*a.z+a.x*s, r*a.z*a.z+c
        );
      }
    `).replace('#include <beginnormal_vertex>', `
      #include <beginnormal_vertex>
      objectNormal = sculptureRotation(aShardAxis,
        ${crystal ? '0.0' : 'uSculptureProgress * uSculptureProgress * (aShardPhase - 0.5) * 0.2'}) * objectNormal;
    `).replace('#include <begin_vertex>', `
      #include <begin_vertex>
      vSculpturePosition = position;
      float opening = ${crystal ? '0.0' : 'uSculptureProgress * uSculptureProgress'};
      mat3 shardRotation = sculptureRotation(aShardAxis, opening * (aShardPhase - 0.5) * 0.2);
      transformed = shardRotation * (transformed - aShardCenter) + aShardCenter;
      vec3 outward = normalize(aShardCenter + vec3(0.0, 0.15, 0.6));
      transformed += outward * opening * (0.08 + aShardPhase * 0.06);
      transformed.y += opening * (aShardPhase - 0.5) * 0.06;
      // A small continuous wave is visible before the shell opens into facets.
      transformed.z += sin(position.y * 3.8 + position.x * 2.0 - uSculptureTime * 0.8)
        * ${crystal ? '0.0' : 'uSculptureProgress * 0.035'};
    `)

  }
  material.customProgramCacheKey = () => `kinetic-sculpture-${crystal ? 'crystal' : 'metal'}`
  return material
}

function StaticSculpture() {
  return (
    <svg className="sculpture-fallback" viewBox="0 0 500 600" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sculpture-marble" x1="0" x2="1" y1="0" y2="0.7">
          <stop stopColor="#555963" />
          <stop offset=".46" stopColor="#d8dadd" />
          <stop offset="1" stopColor="#7c8c9e" />
        </linearGradient>
        <linearGradient id="sculpture-shadow" x2="1" y2="1">
          <stop stopColor="#293448" />
          <stop offset="1" stopColor="#988bba" />
        </linearGradient>
      </defs>
      <path fill="url(#sculpture-shadow)" d="m121 499 66-49 30-85 81 4 29 89 62 42-21 47H142z" />
      <path fill="url(#sculpture-marble)" d="M170 102Q256 46 320 106L347 181 335 283 296 362 248 383 202 352 167 294 154 193Z" />
      <path fill="none" stroke="#2f3346" strokeWidth="8" opacity=".6" d="m181 214 34-10 25 13m32-10 35 2 16 13m-68 0-11 57 25 7m-46 33 27 8 25-7" />
      <path fill="none" stroke="#f1e9e1" strokeWidth="1.5" opacity=".42" d="m302 108-28 66 23 29-13 82 24 19m-114-181 28 71-21 31 19 83" />
      <path fill="url(#sculpture-marble)" d="m146 547 216-1 12 22H132z" />
    </svg>
  )
}

export default function KineticSculpture() {
  const hostRef = useRef(null)
  const [state, setState] = useState('loading')

  useEffect(() => {
    const host = hostRef.current
    const hero = document.getElementById('home') || host
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const controller = new AbortController()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    const group = new THREE.Group()
    scene.add(group)

    let disposed = false
    let visible = true
    let loaded = false
    let frame = 0
    let previousTime = 0
    let animationTime = 0
    let progress = 0
    let targetProgress = 0
    let coreMesh
    const pointer = new THREE.Vector2()
    const targetPointer = new THREE.Vector2()
    const uniforms = { time: { value: 0 }, progress: { value: 0 } }
    const resources = new Set()
    let renderer

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch {
      setState('fallback')
      return () => { controller.abort() }
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.92
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.prepend(renderer.domElement)

    scene.add(new THREE.HemisphereLight('#e1e7ef', '#22232a', 0.9))
    const light = (color, intensity, x, y, z) => {
      const result = new THREE.DirectionalLight(color, intensity)
      result.position.set(x, y, z)
      scene.add(result)
    }
    light('#fff2e2', 3.3, -2.5, 4.5, 6)
    light('#d6dff2', 2.7, -4, 1.5, -2)
    light('#a9c0d8', 2.8, 4, 0.8, 1)
    light('#b1b7c6', 1.2, 1, -3, -3)

    function resize() {
      if (disposed) return
      const { width, height } = host.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      // The camera fits shoulders as well as the head on narrower screens.
      const verticalFov = THREE.MathUtils.degToRad(camera.fov)
      const fitHeight = 5.25 / (2 * Math.tan(verticalFov / 2))
      const fitWidth = 5.1 / (2 * Math.tan(verticalFov / 2) * camera.aspect)
      camera.position.set(0, 0.14, Math.max(fitHeight, fitWidth))
      camera.lookAt(0, 0.05, 0)
      camera.updateProjectionMatrix()
      readScroll()
      requestRender()
    }

    function readScroll() {
      const bounds = hero.getBoundingClientRect()
      const travel = THREE.MathUtils.clamp(-bounds.top, 0, bounds.height * 0.65)
      hero.style.setProperty('--sculpture-shift', String(motion.matches ? 0 : travel * 0.45))
      if (motion.matches) {
        targetProgress = 0
      } else {
        targetProgress = THREE.MathUtils.clamp(-bounds.top / (bounds.height * 0.4), 0, 1)
      }
      if (motion.matches) progress = 0
      requestRender()
    }

    function movePointer(event) {
      if (motion.matches || !visible) return
      const bounds = hero.getBoundingClientRect()
      targetPointer.set(
        THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width - 0.5, -0.5, 0.5),
        THREE.MathUtils.clamp((event.clientY - bounds.top) / bounds.height - 0.5, -0.5, 0.5),
      )
      requestRender()
    }

    function leavePointer() { targetPointer.set(0, 0) }

    function render(time = performance.now()) {
      frame = 0
      if (disposed || !visible || document.hidden) return
      const elapsed = Math.min((time - previousTime) / 1000 || 0, 0.05)
      previousTime = time
      if (!motion.matches) animationTime += elapsed
      const smoothing = 1 - Math.exp(-elapsed * 7)
      progress = THREE.MathUtils.lerp(progress, targetProgress, smoothing)
      pointer.lerp(targetPointer, smoothing)
      uniforms.time.value = animationTime
      uniforms.progress.value = motion.matches ? 0 : progress
      if (coreMesh) {
        coreMesh.visible = !motion.matches && progress > 0.12
        coreMesh.material.opacity = THREE.MathUtils.smoothstep(progress, 0.12, 0.34)
      }
      group.rotation.y = -0.23 + (motion.matches ? 0 : Math.sin(animationTime * 0.23) * 0.04 + pointer.x * 0.22 + progress * 0.22)
      group.rotation.x = motion.matches ? 0 : pointer.y * 0.08 - progress * 0.035
      group.rotation.z = -0.035 + (motion.matches ? 0 : Math.sin(animationTime * 0.18) * 0.015)
      group.position.y = motion.matches ? 0 : Math.sin(animationTime * 0.6) * 0.035
      renderer.render(scene, camera)
      if (loaded && !motion.matches) requestRender()
    }

    function requestRender() {
      if (!disposed && visible && !document.hidden && !frame) frame = requestAnimationFrame(render)
    }

    function syncMotion() {
      if (motion.matches) {
        targetProgress = 0
        progress = 0
        pointer.set(0, 0)
        targetPointer.set(0, 0)
        if (frame) cancelAnimationFrame(frame)
        frame = 0
      }
      readScroll()
    }

    function syncVisibility() {
      if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0 }
      else { previousTime = performance.now(); requestRender() }
    }

    function loseContext(event) {
      event.preventDefault()
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      loaded = false
      setState('fallback')
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible && frame) { cancelAnimationFrame(frame); frame = 0 }
      if (visible) { previousTime = performance.now(); readScroll() }
    }, { rootMargin: '80px' })
    intersection.observe(host)
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    window.addEventListener('scroll', readScroll, { passive: true })
    hero.addEventListener('pointermove', movePointer, { passive: true })
    hero.addEventListener('pointerleave', leavePointer)
    document.addEventListener('visibilitychange', syncVisibility)
    motion.addEventListener('change', syncMotion)
    renderer.domElement.addEventListener('webglcontextlost', loseContext)
    resize()
    readScroll()

    async function loadSculpture() {
      try {
        const response = await fetch(`${ASSET_BASE}LeePerrySmith.glb`, { signal: controller.signal })
        if (!response.ok) throw new Error('Sculpture unavailable')
        const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), ASSET_BASE)
        gltf.scene.updateMatrixWorld(true)
        let source
        gltf.scene.traverse((object) => { if (object.isMesh && !source) source = object })
        if (!source) throw new Error('Sculpture mesh unavailable')
        const sourceGeometry = source.geometry.clone().applyMatrix4(source.matrixWorld)
        const geometry = prepareFractureGeometry(sourceGeometry)
        sourceGeometry.dispose()
        gltf.scene.traverse((object) => {
          if (!object.isMesh) return
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => material.dispose())
        })
        if (disposed) { geometry.dispose(); return }
        resources.add(geometry)
        const marble = sculptureMaterial(uniforms)
        const crystal = sculptureMaterial(uniforms, true)
        resources.add(marble)
        resources.add(crystal)
        const shell = new THREE.Mesh(geometry, marble)
        // Inset along the scan's smooth normals. Scaling about the origin can
        // push a concave shoulder surface outside the marble shell.
        const coreGeometry = geometry.clone()
        const corePositions = coreGeometry.attributes.position
        const coreNormals = coreGeometry.attributes.normal
        for (let vertex = 0; vertex < corePositions.count; vertex++) {
          corePositions.setXYZ(vertex,
            corePositions.getX(vertex) - coreNormals.getX(vertex) * 0.045,
            corePositions.getY(vertex) - coreNormals.getY(vertex) * 0.045,
            corePositions.getZ(vertex) - coreNormals.getZ(vertex) * 0.045,
          )
        }
        coreGeometry.computeBoundingSphere()
        resources.add(coreGeometry)
        const core = new THREE.Mesh(coreGeometry, crystal)
        core.visible = false
        coreMesh = core
        shell.frustumCulled = false
        core.frustumCulled = false
        group.add(shell, core)

        const baseGeometry = new THREE.CylinderGeometry(1.34, 1.4, 0.13, 80)
        const baseMaterial = new THREE.MeshPhysicalMaterial({ color: '#53565c', roughness: 0.3, metalness: 0.5 })
        resources.add(baseGeometry)
        resources.add(baseMaterial)
        const base = new THREE.Mesh(baseGeometry, baseMaterial)
        base.position.y = -2.3
        base.scale.z = 0.7
        group.add(base)
        loaded = true
        setState('ready')
        previousTime = performance.now()
        requestRender()

        new THREE.TextureLoader().load(`${ASSET_BASE}head-normal.jpg`, (texture) => {
          if (disposed) { texture.dispose(); return }
          texture.flipY = false
          texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
          marble.normalMap = texture
          marble.normalScale.set(0.35, 0.35)
          marble.needsUpdate = true
          resources.add(texture)
          requestRender()
        })
      } catch (error) {
        if (!disposed && error.name !== 'AbortError') setState('fallback')
      }
    }
    loadSculpture()

    return () => {
      disposed = true
      controller.abort()
      if (frame) cancelAnimationFrame(frame)
      intersection.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', readScroll)
      hero.removeEventListener('pointermove', movePointer)
      hero.removeEventListener('pointerleave', leavePointer)
      document.removeEventListener('visibilitychange', syncVisibility)
      motion.removeEventListener('change', syncMotion)
      renderer.domElement.removeEventListener('webglcontextlost', loseContext)
      resources.forEach((resource) => resource.dispose())
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
      hero.style.removeProperty('--sculpture-shift')
    }
  }, [])

  return (
    <div ref={hostRef} className={`kinetic-sculpture is-${state}`} data-state={state} aria-hidden="true">
      {state !== 'ready' && <StaticSculpture />}
    </div>
  )
}
