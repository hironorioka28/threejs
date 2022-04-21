import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter02/02-foggy-scene/Canvas'), { ssr: false })

const FoggyScene: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter02 / 02-foggy-scene" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default FoggyScene
