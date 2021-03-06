import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter04/02-depth-material/Canvas'), {
  ssr: false,
})

const DepthMaterial: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter04 / 02-depth-material" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default DepthMaterial
