import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter02/03-forced-materials/Canvas'), {
  ssr: false,
})

const ForcedMaterials: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter02 / 03-forced-materials" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default ForcedMaterials
