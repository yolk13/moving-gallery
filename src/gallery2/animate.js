const CARD_COUNT = 6

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t)
}

function easeInCubic(t) {
  return t * t * t
}

export function updateCards(cards, scrollProgress) {
  const segmentSize = 1 / CARD_COUNT

  cards.forEach((card) => {
    const i = card.userData.index
    const segStart = i * segmentSize
    const segEnd = (i + 1) * segmentSize

    let localP = (scrollProgress - segStart) / segmentSize
    localP = Math.max(0, Math.min(1, localP))

    if (localP <= 0 || localP >= 1) {
      card.visible = false
      return
    }

    card.visible = true

    const { startScale, finalX, finalY } = card.userData

    let scale, opacity, targetX, targetY

    if (localP < 0.15) {
      const t = localP / 0.15
      const e = easeOutQuad(t)
      scale = startScale + e * (1 - startScale)
      opacity = 1
      targetX = 0
      targetY = 0
    } else if (localP < 0.55) {
      const t = (localP - 0.15) / 0.4
      const e = easeOutQuad(t)
      scale = 1
      opacity = 1
      targetX = finalX * e
      targetY = finalY * e
    } else if (localP < 0.80) {
      scale = 1
      opacity = 1
      targetX = finalX
      targetY = finalY
    } else {
      const t = (localP - 0.80) / 0.20
      const e = easeInCubic(t)
      scale = 1
      opacity = 1 - e
      targetX = finalX
      targetY = finalY
    }

    card.scale.setScalar(scale)
    card.material.opacity = opacity
    card.position.x = targetX
    card.position.y = targetY
  })
}
