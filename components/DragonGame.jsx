'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Dragon from './Dragon'

const WEATHER = [
  {
    name: 'Clear Sky',
    sky: 'linear-gradient(180deg, #4aa7e8 0%, #a8e2ff 65%, #d8f4ff 100%)'
  },
  {
    name: 'Mystic Sunset',
    sky: 'linear-gradient(180deg, #472d76 0%, #b34f75 48%, #f2a55f 100%)'
  },
  {
    name: 'Cloudy',
    sky: 'linear-gradient(180deg, #65788e 0%, #aab8c4 55%, #d4dce0 100%)'
  },
  {
    name: 'Rain',
    sky: 'linear-gradient(180deg, #293d58 0%, #506d86 55%, #8199aa 100%)'
  },
  {
    name: 'Storm',
    sky: 'linear-gradient(180deg, #101a32 0%, #273a59 55%, #43526c 100%)'
  },
  {
    name: 'Mist',
    sky: 'linear-gradient(180deg, #60747b 0%, #a9bab6 50%, #d9ded8 100%)'
  },
  {
    name: 'Snow',
    sky: 'linear-gradient(180deg, #61758f 0%, #a9c1d5 50%, #edf5fa 100%)'
  },
  {
    name: 'Aurora',
    sky: 'linear-gradient(180deg, #07172e 0%, #123b56 42%, #285a5c 72%, #111d3c 100%)'
  },
  {
    name: 'Eclipse',
    sky: 'linear-gradient(180deg, #080b1d 0%, #202347 55%, #4c315d 100%)'
  },
  {
    name: 'Arcane Night',
    sky: 'linear-gradient(180deg, #09051e 0%, #24124b 50%, #3a2162 100%)'
  }
]

const WEATHER_ICONS = [
  '☀',
  '☀',
  '☁',
  '☂',
  '⚡',
  '〰',
  '❄',
  '✦',
  '◐',
  '✧'
]

export default function DragonGame() {
  const gameRef = useRef(null)
  const frameRef = useRef(null)
  const lastTimeRef = useRef(0)
  const playerRef = useRef({
    x: 120,
    y: 300,
    velocity: 0,
    rotation: 0
  })

  const obstaclesRef = useRef([])
  const scoreRef = useRef(0)
  const bestRef = useRef(0)
  const runningRef = useRef(false)
  const startedRef = useRef(false)
  const spawnTimerRef = useRef(0)

  const [gameState, setGameState] = useState('ready')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [weatherIndex, setWeatherIndex] = useState(0)
  const [player, setPlayer] = useState({
    x: 120,
    y: 300,
    rotation: 0
  })

  const getBest = useCallback(() => {
    if (typeof window === 'undefined') return 0

    const saved = Number(localStorage.getItem('aetherion-dragon-best') || 0)
    bestRef.current = saved
    setBest(saved)

    return saved
  }, [])

  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 120,
      y: 300,
      velocity: 0,
      rotation: 0
    }

    obstaclesRef.current = []
    scoreRef.current = 0
    spawnTimerRef.current = 0

    setScore(0)
    setWeatherIndex(0)
    setPlayer({
      x: 120,
      y: 300,
      rotation: 0
    })

    runningRef.current = false
    startedRef.current = false
    setGameState('ready')
  }, [])

  const flap = useCallback(() => {
    if (gameState === 'gameover') {
      resetGame()
      return
    }

    if (!startedRef.current) {
      startedRef.current = true
      runningRef.current = true
      setGameState('playing')
    }

    playerRef.current.velocity = -420
  }, [gameState, resetGame])

  const endGame = useCallback(() => {
    runningRef.current = false
    startedRef.current = false
    setGameState('gameover')

    const finalScore = scoreRef.current

    if (finalScore > bestRef.current) {
      bestRef.current = finalScore
      setBest(finalScore)

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'aetherion-dragon-best',
          String(finalScore)
        )
      }
    }
  }, [])

  useEffect(() => {
    getBest()
  }, [getBest])

  useEffect(() => {
    const handleKeyDown = event => {
      if (
        event.code === 'Space' ||
        event.code === 'ArrowUp' ||
        event.code === 'KeyW'
      ) {
        event.preventDefault()

        if (!event.repeat) {
          flap()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [flap])

  useEffect(() => {
    const game = gameRef.current

    if (!game) return

    const handlePointerDown = event => {
      if (event.target.closest('button')) return
      flap()
    }

    game.addEventListener('pointerdown', handlePointerDown)

    return () => {
      game.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [flap])

  useEffect(() => {
    const game = gameRef.current

    if (!game) return

    const loop = timestamp => {
      const delta = Math.min(
        (timestamp - lastTimeRef.current) / 1000,
        0.033
      )

      lastTimeRef.current = timestamp

      if (runningRef.current) {
        const width = game.clientWidth
        const height = game.clientHeight

        const playerData = playerRef.current

        playerData.velocity += 1250 * delta
        playerData.y += playerData.velocity * delta

        playerData.rotation = Math.max(
          -25,
          Math.min(75, playerData.velocity * 0.075)
        )

        spawnTimerRef.current += delta

        if (spawnTimerRef.current >= 1.55) {
          spawnTimerRef.current = 0

          const gap = Math.max(155, height * 0.28)
          const minTop = 80
          const maxTop = Math.max(
            minTop + 30,
            height - gap - 100
          )

          const top = Math.random() * (maxTop - minTop) + minTop

          obstaclesRef.current.push({
            x: width + 100,
            top,
            gap,
            width: 76,
            passed: false
          })
        }

        obstaclesRef.current.forEach(obstacle => {
          obstacle.x -= 250 * delta
        })

        obstaclesRef.current =
          obstaclesRef.current.filter(
            obstacle => obstacle.x > -120
          )

        const dragonBox = {
          left: playerData.x + 35,
          right: playerData.x + 150,
          top: playerData.y + 25,
          bottom: playerData.y + 105
        }

        if (
          playerData.y < -25 ||
          playerData.y > height - 95
        ) {
          endGame()
        }

        for (const obstacle of obstaclesRef.current) {
          const topRock = {
            left: obstacle.x,
            right: obstacle.x + obstacle.width,
            top: 0,
            bottom: obstacle.top
          }

          const bottomRock = {
            left: obstacle.x,
            right: obstacle.x + obstacle.width,
            top: obstacle.top + obstacle.gap,
            bottom: height
          }

          const hitTop =
            dragonBox.right > topRock.left &&
            dragonBox.left < topRock.right &&
            dragonBox.bottom > topRock.top &&
            dragonBox.top < topRock.bottom

          const hitBottom =
            dragonBox.right > bottomRock.left &&
            dragonBox.left < bottomRock.right &&
            dragonBox.bottom > bottomRock.top &&
            dragonBox.top < bottomRock.bottom

          if (hitTop || hitBottom) {
            endGame()
            break
          }

          if (
            !obstacle.passed &&
            obstacle.x + obstacle.width < playerData.x
          ) {
            obstacle.passed = true

            scoreRef.current += 1

            const nextScore = scoreRef.current
            setScore(nextScore)

            const nextWeather =
              Math.floor(nextScore / 5) % WEATHER.length

            setWeatherIndex(nextWeather)
          }
        }

        setPlayer({
          x: playerData.x,
          y: playerData.y,
          rotation: playerData.rotation
        })
      }

      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frameRef.current)
    }
  }, [endGame])

  const currentWeather = WEATHER[weatherIndex]

  return (
    <main
      ref={gameRef}
      className="dragon-game"
      style={{
        '--game-sky': currentWeather.sky
      }}
    >
      <div className="game-sky" />

      <div className={`weather weather-${weatherIndex}`}>
        {Array.from({ length: 22 }).map((_, index) => (
          <span key={index}>
            {WEATHER_ICONS[weatherIndex]}
          </span>
        ))}
      </div>

      <div className="game-header">
        <div className="score-box">
          <span>Score</span>
          <strong>{score}</strong>
        </div>

        <div className="weather-box">
          <span>{WEATHER_ICONS[weatherIndex]}</span>
          <div>
            <small>Weather</small>
            <strong>{currentWeather.name}</strong>
          </div>
        </div>

        <div className="score-box">
          <span>Best</span>
          <strong>{best}</strong>
        </div>
      </div>

      <div className="obstacles">
        {obstaclesRef.current.map((obstacle, index) => (
          <div
            key={`${obstacle.x}-${index}`}
            className="rock-group"
            style={{
              left: obstacle.x,
              top: 0,
              height: '100%'
            }}
          >
            <div
              className="rock rock-top"
              style={{
                height: obstacle.top
              }}
            />

            <div
              className="rock rock-bottom"
              style={{
                top: obstacle.top + obstacle.gap,
                height: `calc(100% - ${obstacle.top + obstacle.gap}px)`
              }}
            />
          </div>
        ))}
      </div>

      <div
        className="player"
        style={{
          left: player.x,
          top: player.y,
          transform: `rotate(${player.rotation}deg)`
        }}
      >
        <Dragon flying={gameState !== 'gameover'} />
      </div>

      {gameState === 'ready' && (
        <div className="game-overlay">
          <div className="title">
            <span>AETHERION</span>
            <strong>DRAGON</strong>
          </div>

          <p>Tap, click, or press SPACE to fly</p>

          <button onClick={flap}>
            START FLIGHT
          </button>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="game-overlay">
          <div className="game-over">
            <span>FLIGHT ENDED</span>
            <strong>{score}</strong>
            <small>Score</small>
          </div>

          <p>Beat your record and fly farther.</p>

          <button onClick={resetGame}>
            TRY AGAIN
          </button>
        </div>
      )}

      <div className="ground">
        <div className="grass" />
        <div className="ground-dirt" />
      </div>
    </main>
  )
    }
