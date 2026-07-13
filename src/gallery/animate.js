const CARD_DURATION = 2.0
const STAGGER = 0.5
const CARD_COUNT = 6

export const totalDuration = (CARD_COUNT - 1) * STAGGER + CARD_DURATION

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t)
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function updateCards(cards, timelinePosition) {
  const t = ((timelinePosition % totalDuration) + totalDuration) % totalDuration

  cards.forEach((card, index) => {
    const localTime = t - index * STAGGER

    if (localTime < 0 || localTime > CARD_DURATION) {
      card.visible = false
      return
    }

    card.visible = true

    const progress = localTime / CARD_DURATION
    const eased = easeInOutCubic(progress)

    const startScale = index === 0 ? 0.3 : 0.15
    const scaleCurve = startScale + eased * (1 - startScale)
    card.scale.setScalar(scaleCurve)

    let opacityCurve
    if (progress < 0.1) {
      opacityCurve = easeOutQuad(progress / 0.1)
    } else if (progress > 0.85) {
      opacityCurve = 1 - easeOutQuad((progress - 0.85) / 0.15)
    } else {
      opacityCurve = 1.0
    }
    card.material.opacity = opacityCurve

    const zBase = card.userData.basePos.z
    const zDrift = Math.sin(progress * Math.PI) * 1.2
    card.position.z = zBase + zDrift
  })
}

export function getActiveCardIndex(timelinePosition) {
  const t = ((timelinePosition % totalDuration) + totalDuration) % totalDuration
  const raw = t / STAGGER
  return Math.min(Math.floor(raw), CARD_COUNT - 1)
}
