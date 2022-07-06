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
            <li>
              <NextLink href={'/oreilly/2-8-cameras-lookat'}>
                <a className="text-teal-700">cameras-lookat</a>
              </NextLink>
            </li>
          </ul>
        </li>
        <li>
          <p className="text-gray-700">Chapter 03</p>
          <ul className="list-inside list-decimal space-y-4 mt-4">
            <li>
              <NextLink href={'/oreilly/3-1-ambient-light'}>
                <a className="text-teal-700">ambient-light</a>
              </NextLink>
            </li>
            <li>
              <NextLink href={'/oreilly/3-2-point-light'}>
                <a className="text-teal-700">point-light</a>
              </NextLink>
            </li>
            <li>
              <NextLink href={'/oreilly/3-3-spot-light'}>
                <a className="text-teal-700">spot-light</a>
              </NextLink>
            </li>
            <li>
              <NextLink href={'/oreilly/3-4-directional-light'}>
                <a className="text-teal-700">directional-light</a>
              </NextLink>
            </li>
            <li>
              <NextLink href={'/oreilly/3-5-hemisphere-light'}>
                <a className="text-teal-700">hemisphere-light</a>
              </NextLink>
            </li>
            <li className="text-gray-700">area-right (deprecated)</li>
            <li>
              <NextLink href={'/oreilly/3-7-lensflares'}>
                <a className="text-teal-700">lensflares</a>
              </NextLink>
            </li>
          </ul>
        </li>
        <li>
          <p className="text-gray-700">Chapter 04</p>
          <ul className="list-inside list-decimal space-y-4 mt-4">
            <li>
              <NextLink href={'/oreilly/4-1-basic-mesh-material'}>
                <a className="text-teal-700">basic-mesh-material</a>
              </NextLink>
            </li>
            <li>
              <NextLink href={'/oreilly/4-2-depth-material'}>
                <a className="text-teal-700">depth-material</a>
              </NextLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default Oreilly
