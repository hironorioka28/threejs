import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter03/01-ambient-light/Canvas'), {
  ssr: false,
})

const AmbientLight: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter03 / 01-ambient-light" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default AmbientLight
