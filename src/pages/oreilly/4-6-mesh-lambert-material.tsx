import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter04/06-mesh-lambert-material/Canvas'), {
  ssr: false,
})

const MeshLambertMaterial: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter04 / 06-mesh-lambert-material" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default MeshLambertMaterial
