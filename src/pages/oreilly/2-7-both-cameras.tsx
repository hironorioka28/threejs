import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter02/07-both-cameras/Canvas'), {
  ssr: false,
})

const BothCameras: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter02 / 07-both-cameras" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default BothCameras
