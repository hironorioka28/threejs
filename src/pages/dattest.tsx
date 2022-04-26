import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

const Dat = dynamic(() => import('@components/Dat'), { ssr: false })

const DatTest: NextPage = () => {
  return <Dat />
}

export default DatTest
