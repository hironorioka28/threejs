import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter03/05-hemisphere-light/Canvas'), {
  ssr: false,
})

const HemisphereLight: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter03 / 05-hemisphere-light" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default HemisphereLight
