import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter04/05-multi-material/Canvas'), {
  ssr: false,
})

const MultiMaterial: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter04 / 05-multi-material" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default MultiMaterial
