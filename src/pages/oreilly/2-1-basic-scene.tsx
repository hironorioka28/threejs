import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter02/01-basic-scene/Canvas'), { ssr: false })

const BasicScene: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter02 / 01-basic-scene" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default BasicScene
