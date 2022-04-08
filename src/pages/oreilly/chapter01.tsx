import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Header from '@components/Header'

const Canvas = dynamic(() => import('@components/chapter01/Canvas'), { ssr: false })

const Chapter01: NextPage = () => {
  return (
    <>
      <Header pageTitle="Chapter 01" />
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default Chapter01
