import * as THREE from 'three'
import { CARDS } from './data.js'

const FOV = 45
const CAM_DISTANCE = 7

function getVh() {
  return 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAM_DISTANCE
}

function getVw() {
  return getVh() * (window.innerWidth / window.innerHeight)
}

function getContainer() {
  return { w: getVw() * 0.5, h: getVh() }
}

function getFittedSize(imageAspect, containerW, containerH) {
  const containerAspect = containerW / containerH
  if (imageAspect > containerAspect) {
    return { w: containerW, h: containerW / imageAspect }
  }
  return { w: containerH * imageAspect, h: containerH }
}

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  renderer.setClearColor(0x0a0a0a, 1)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 50)
  camera.position.set(0, 0, CAM_DISTANCE)
  camera.lookAt(0, 0, 0)

  const ambient = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambient)
  const key = new THREE.DirectionalLight(0xffffff, 1.5)
  key.position.set(2, 3, 4)
  scene.add(key)

  const cards = []

  CARDS.forEach((cfg, i) => {
    const side = i % 2 === 0 ? -1 : 1
    const { w: cw } = getContainer()
    const startH = getVh() * 0.3

    const tex = new THREE.TextureLoader().load(cfg.img)
    tex.colorSpace = THREE.SRGBColorSpace

    const { w: finalW, h: finalH } = getFittedSize(cfg.aspect, cw, getVh())

    const geo = new THREE.PlaneGeometry(finalW, finalH)

    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.0,
      depthWrite: false
    })

    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(0, 0, 0)

    const startScale = startH / finalH
    mesh.scale.setScalar(startScale)

    const yDir = i % 2 === 0 ? -1 : 1
    const finalY = yDir * getVh() * 0.25

    mesh.userData = {
      index: i,
      side,
      startScale,
      startH,
      finalW,
      finalH,
      finalX: side * (cw / 2),
      finalY,
      startOpacity: 0
    }

    scene.add(mesh)
    cards.push(mesh)
  })

  function onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function render() {
    renderer.render(scene, camera)
  }

  return { render, onResize, cards, scene, camera, renderer }
}
