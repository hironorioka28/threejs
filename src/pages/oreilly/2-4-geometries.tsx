import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter02/04-geometries/Canvas'), {
  ssr: false,
})

const Geometories: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter02 / 04-geometries" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default Geometories
