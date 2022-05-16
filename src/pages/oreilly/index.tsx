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
          <p className="text-gray-700">Chapter 02</p>
          <ul className="list-inside list-decimal space-y-4 mt-4">
            <li>
              <NextLink href={'/oreilly/2-1-basic-scene'}>
                <a className="text-teal-700">basic-scene</a>
              </NextLink>
            </li>
            <li>
              <NextLink href={'/oreilly/2-2-foggy-scene'}>
                <a className="text-teal-700">foggy-scene</a>
              </NextLink>
            </li>
            <li>
              <NextLink href={'/oreilly/2-3-forced-materials'}>
                <a className="text-teal-700">forced-materials</a>
              </NextLink>
            </li>
            <li>
              <NextLink href={'/oreilly/2-4-geometries'}>
                <a className="text-teal-700">geometries</a>
              </NextLink>
            </li>
            <li>
              <NextLink href={'/oreilly/2-5-custom-geometry'}>
                <a className="text-teal-700">custom-geometry</a>
              </NextLink>
            </li>
            <li>
              <NextLink href={'/oreilly/2-6-mesh-properties'}>
                <a className="text-teal-700">mesh-properties</a>
              </NextLink>
            </li>
            <li>
              <NextLink href={'/oreilly/2-7-both-cameras'}>
                <a className="text-teal-700">both-cameras</a>
              </NextLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default Oreilly
