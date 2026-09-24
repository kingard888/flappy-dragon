'use client'

import './Dragon.css'

export default function Dragon({ flying = true }) {
  return (
    <div className={`dragon ${flying ? 'flying' : ''}`}>
      <div className="dragon-shadow" />

      <div className="dragon-wing dragon-wing-back">
        <div className="wing-bone" />
        <div className="wing-bone wing-bone-2" />
        <div className="wing-bone wing-bone-3" />
      </div>

      <div className="dragon-wing dragon-wing-front">
        <div className="wing-bone" />
        <div className="wing-bone wing-bone-2" />
        <div className="wing-bone wing-bone-3" />
      </div>

      <div className="dragon-tail">
        <span />
        <span />
        <span />
      </div>

      <div className="dragon-body">
        <div className="dragon-belly" />

        <div className="dragon-spikes">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>

      <div className="dragon-neck">
        <div className="neck-spikes">
          <i />
          <i />
          <i />
        </div>
      </div>

      <div className="dragon-head">
        <div className="horn horn-left" />
        <div className="horn horn-right" />

        <div className="ear ear-left" />
        <div className="ear ear-right" />

        <div className="dragon-eye dragon-eye-left" />
        <div className="dragon-eye dragon-eye-right" />

        <div className="dragon-snout" />

        <div className="dragon-fang fang-left" />
        <div className="dragon-fang fang-right" />

        <div className="dragon-nostril nostril-left" />
        <div className="dragon-nostril nostril-right" />
      </div>

      <div className="dragon-leg leg-front">
        <span />
        <span />
      </div>

      <div className="dragon-leg leg-back">
        <span />
        <span />
      </div>
    </div>
  )
}
