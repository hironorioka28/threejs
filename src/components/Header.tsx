import NextLink from 'next/link'

type Props = {
  pageTitle: string
}

const Header = ({ pageTitle }: Props): JSX.Element => {
  return (
    <header className="px-4 h-12 bg-teal-700 flex items-center">
      <div className="flex space-x-8 items-center">
        <NextLink href="/oreilly">
          <a className="text-xl font-bold text-white">O&rsquo;reilly</a>
        </NextLink>
        <p className="text-white">{pageTitle}</p>
      </div>
    </header>
  )
}

export default Header
