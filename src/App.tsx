import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Demo from './demo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex items-center justify-center w-screen h-screen App">
      <Demo />
    </div>
  )
}

export default App
