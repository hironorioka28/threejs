import { useState, useEffect } from 'react'

import dat from 'dat.gui'
import { createContainer } from 'unstated-next'

const GUIContainer = createContainer(() => {
  const [message, setMessage] = useState<string>('dat.gui')
  const [speed, setSpeed] = useState<number>(0.8)
  const [flag, setFlag] = useState<boolean>(false)
  const [fruit, setFruit] = useState<'apple' | 'orange' | 'grape'>('apple')
  const [number, setNumber] = useState<number>(1)

  useEffect(() => {
    const gui = new dat.GUI()
    gui.add({ message }, 'message').onChange((v) => setMessage(v))
    gui.add({ speed }, 'speed', -5, 5).onChange((v) => setSpeed(v))
    gui.add({ flag }, 'flag').onChange((v) => setFlag(v))
    gui.add({ fruit }, 'fruit', ['apple', 'orange', 'grape']).onChange((v) => setFruit(v))
    gui.add({ number }, 'number', { one: 1, two: 2, three: 3 }).onChange((v) => setNumber(v))

    return () => {
      gui.destroy()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { message, speed, flag, fruit, number }
})

export default GUIContainer
