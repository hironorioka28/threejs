import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter04/01-basic-mesh-material/Canvas'), {
  ssr: false,
})

const Lensflares: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter04 / 01-basic-mesh-material" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default Lensflares
