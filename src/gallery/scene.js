import * as THREE from 'three'
import { CARDS } from './data.js'

const BG_COLOR = 0x0a0a0a

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(BG_COLOR)

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50)
  camera.position.set(0, 0.5, 7)
  camera.lookAt(0, 0.2, 0)

  const ambient = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambient)

  const key = new THREE.DirectionalLight(0xffffff, 2.0)
  key.position.set(2, 3, 4)
  scene.add(key)

  const fill = new THREE.DirectionalLight(0xffeedd, 0.8)
  fill.position.set(-2, 1, 2)
  scene.add(fill)

  const bgPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 16),
    new THREE.MeshBasicMaterial({ color: BG_COLOR })
  )
  bgPlane.position.set(0, 0, -6)
  scene.add(bgPlane)

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let hoveredCard = null

  const cards = []
  const cardGroup = new THREE.Group()
  scene.add(cardGroup)

  CARDS.forEach((cfg) => {
    const w = cfg.width
    const h = cfg.width * cfg.heightRatio

    const geo = new THREE.PlaneGeometry(w, h)
    const tex = new THREE.TextureLoader().load(cfg.img)
    tex.colorSpace = THREE.SRGBColorSpace

    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(geo, mat)
    const rad = THREE.MathUtils.degToRad(cfg.angle)
    const x = Math.sin(rad) * cfg.radius
    const z = 2.5 - Math.abs(Math.cos(rad)) * cfg.radius * 0.3
    mesh.position.set(x, cfg.height, z)
    mesh.lookAt(0, cfg.height, 0)
    mesh.userData = { cfg, targetScale: 1, basePos: mesh.position.clone(), tilt: new THREE.Vector2(0, 0) }

    const borderGeo = new THREE.PlaneGeometry(w + 0.04, h + 0.04)
    const borderMat = new THREE.MeshBasicMaterial({
      color: 0xd4a853,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    const border = new THREE.Mesh(borderGeo, borderMat)
    border.position.z = -0.001
    mesh.add(border)
    mesh.userData.border = border

    const startScale = cfg.id === 0 ? 0.2 : 0.12
    mesh.scale.set(startScale, startScale, startScale)
    mat.transparent = true
    mat.opacity = 0.3
    cardGroup.add(mesh)
    cards.push(mesh)
  })

  function onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(cards)

    cards.forEach((c) => {
      const target = { x: 0, y: 0 }
      if (intersects.length > 0 && intersects[0].object === c) {
        const p = intersects[0].point
        const local = c.worldToLocal(p.clone())
        target.x = local.x * 4
        target.y = local.y * 4
        if (hoveredCard !== c) {
          hoveredCard = c
          document.body.style.cursor = 'pointer'
        }
        c.userData.border.material.opacity = 0.6
      } else if (hoveredCard === c) {
        hoveredCard = null
        document.body.style.cursor = 'default'
        c.userData.border.material.opacity = 0
      }
      c.userData.tilt.x += (target.x - c.userData.tilt.x) * 0.08
      c.userData.tilt.y += (target.y - c.userData.tilt.y) * 0.08
    })
  }

  window.addEventListener('pointermove', onPointerMove)

  function updateTilt() {
    cards.forEach((c) => {
      const tx = THREE.MathUtils.clamp(c.userData.tilt.x, -0.12, 0.12)
      const ty = THREE.MathUtils.clamp(c.userData.tilt.y, -0.08, 0.08)
      c.rotation.x = ty
      c.rotation.y = tx
    })
  }

  function render() {
    updateTilt()
    renderer.render(scene, camera)
  }

  return { render, onResize, cards, cardGroup, scene, camera, renderer }
}
