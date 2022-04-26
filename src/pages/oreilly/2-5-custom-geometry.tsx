import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter02/05-custom-geometry/Canvas'), {
  ssr: false,
})

const CustomGeometry: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter02 / 05-custom-geometry" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default CustomGeometry
