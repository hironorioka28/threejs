import { memo, useEffect } from 'react'

import * as dat from 'dat.gui'

type Props = {
  setRot: React.Dispatch<React.SetStateAction<number>>
  setBounce: React.Dispatch<React.SetStateAction<number>>
}

// eslint-disable-next-line react/display-name
const Gui = memo(({ setRot, setBounce }: Props): JSX.Element => {
  useEffect(() => {
    const gui = new dat.GUI()

    const controls = {
      rotationSpeed: 0.02,
      bouncingSpeed: 0.03,
    }

    gui.add(controls, 'rotationSpeed', 0, 0.5).onChange((v) => setRot(v))
    gui.add(controls, 'bouncingSpeed', 0, 0.5).onChange((v) => setBounce(v))

    return () => {
      gui.destroy()
    }
  }, [setRot, setBounce])

  return <></>
})

export default Gui
