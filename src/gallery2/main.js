import { createScene } from './scene.js'
import { updateCards } from './animate.js'

const canvas = document.getElementById('gallery-canvas')
const progressEl = document.getElementById('progress')

const { render, cards, onResize } = createScene(canvas)

function updateProgressDisplay(scrollProgress) {
  const idx = Math.min(Math.floor(scrollProgress * 6), 5)
  progressEl.textContent = `${idx + 1} / 6`
}

function onScroll() {
  const scrollY = window.scrollY
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0

  updateCards(cards, progress)
  updateProgressDisplay(progress)
}

window.addEventListener('scroll', onScroll, { passive: true })

function loop() {
  render()
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
window.addEventListener('resize', onResize)
