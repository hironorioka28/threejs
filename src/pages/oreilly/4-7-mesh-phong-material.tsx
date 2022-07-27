import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter04/07-mesh-phong-material/Canvas'), {
  ssr: false,
})

const MeshPhongtMaterial: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter04 / 07-mesh-phong-material" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default MeshPhongtMaterial
