import { NextPage } from 'next'
import NextLink from 'next/link'

const Oreilly: NextPage = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold">はじめての Three.js</h1>
      <ul className="list-disc space-y-4">
        <li>
          <NextLink href={'/oreilly/chapter01'}>
            <a className="text-teal-700">Chapter 01</a>
          </NextLink>
        </li>
        <li>
          <NextLink href={'/oreilly/chapter02'}>
            <a className="text-teal-700">Chapter 02</a>
          </NextLink>
        </li>
      </ul>
    </div>
  )
}

export default Oreilly
