import { useEffect } from 'react'

import * as dat from 'dat.gui'

type Props = {
  setRot: React.Dispatch<React.SetStateAction<number>>
  setBounce: React.Dispatch<React.SetStateAction<number>>
}

const Gui = ({ setRot, setBounce }: Props): JSX.Element => {
  useEffect(() => {
    const gui = new dat.GUI()

    const controls = {
      rotationSpeed: 0.02,
      bouncingSpeed: 0.03,
    }

    const rotController = gui.add(controls, 'rotationSpeed', 0, 0.5)
    const bounceController = gui.add(controls, 'bouncingSpeed', 0, 0.5)

    rotController.onChange(() => {
      setRot(rotController.getValue())
    })
    bounceController.onChange(() => {
      setBounce(bounceController.getValue())
    })

    return () => {
      gui.destroy()
    }
  }, [setRot, setBounce])

  return <></>
}

export default Gui
