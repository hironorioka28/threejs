import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter03/02-point-light/Canvas'), {
  ssr: false,
})

const PointLight: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter03 / 02-point-light" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default PointLight
