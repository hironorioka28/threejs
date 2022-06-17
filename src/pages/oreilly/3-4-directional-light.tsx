import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter03/04-directional-light/Canvas'), {
  ssr: false,
})

const DirectionalLight: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter03 / 04-directional-light" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default DirectionalLight
