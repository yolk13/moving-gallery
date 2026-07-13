import { createScene } from './gallery/scene.js'
import { updateCards, totalDuration, getActiveCardIndex } from './gallery/animate.js'

const canvas = document.getElementById('gallery-canvas')
const progressEl = document.getElementById('progress')

const { render, cards, onResize } = createScene(canvas)

let timelinePosition = 0
let lastTime = 0
let floatTime = 0
let autoPlay = true
let lastScrollTime = performance.now()

function updateProgressDisplay() {
  const idx = getActiveCardIndex(timelinePosition)
  progressEl.textContent = `${idx + 1} / 6`
}

function onScroll() {
  const scrollY = window.scrollY
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const scrollProgress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0
  timelinePosition = scrollProgress * totalDuration
  autoPlay = false
  lastScrollTime = performance.now()

  updateCards(cards, timelinePosition)
  updateProgressDisplay()
}

window.addEventListener('scroll', onScroll, { passive: true })

function updateFloat(delta) {
  floatTime += delta
  cards.forEach((card, index) => {
    if (card.visible) {
      const offset = Math.sin(floatTime * 0.8 + index * 1.5) * 0.006
      card.position.y += offset
    }
  })
}

function loop(time) {
  const delta = lastTime ? (time - lastTime) / 1000 : 0.016
  lastTime = time

  if (!autoPlay && time - lastScrollTime > 1500) {
    autoPlay = true
  }

  if (autoPlay) {
    timelinePosition += delta * 0.7
    if (timelinePosition >= totalDuration) {
      timelinePosition = 0
    }
    updateCards(cards, timelinePosition)
    updateProgressDisplay()
  }

  updateFloat(delta)
  render()

  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)

window.addEventListener('resize', onResize)
