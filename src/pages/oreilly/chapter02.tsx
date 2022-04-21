import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter02/Canvas'), { ssr: false })

const Chapter02: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter 02" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default Chapter02
