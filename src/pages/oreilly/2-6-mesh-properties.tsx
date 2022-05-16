import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter02/06-mesh-properties/Canvas'), {
  ssr: false,
})

const MeshProperties: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter02 / 06-mesh-properties" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default MeshProperties
