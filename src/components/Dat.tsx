import GUIContainer from 'src/GUI'

const Dat = (): JSX.Element => {
  const { message, speed, flag, fruit, number } = GUIContainer.useContainer()

  return (
    <>
      <p>{message}</p>
      <p>{speed}</p>
      <p>{`${flag}`}</p>
      <p>{fruit}</p>
      <p>{number}</p>
    </>
  )
}

const DatWithProvider = (): JSX.Element => (
  <GUIContainer.Provider>
    <Dat />
  </GUIContainer.Provider>
)

export default DatWithProvider
