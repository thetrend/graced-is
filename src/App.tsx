import styled from 'styled-components'

const StyledP = styled.p`
  color: purple;
`

function App() {
  return (
    <>
      <h1 className="text-3xl">Hello World!</h1>
      <StyledP>This is a paragraph</StyledP>
    </>
  )
}

export default App
