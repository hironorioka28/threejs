import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter04/04-mesh-normal-material/Canvas'), {
  ssr: false,
})

const MeshNormalMaterial: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter04 / 04-mesh-normal-material" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default MeshNormalMaterial
