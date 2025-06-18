import { useState } from 'react'
import HomeScreen from './HomeScreen'
import StartCallScreen from './StartCallScreen'
import IncomingCallScreen from './IncomingCallScreen'
import LiveSessionScreen from './LiveSessionScreen'
import SummaryScreen from './SummaryScreen'
import './App.css'

function App() {
  const [screen, setScreen] = useState('home')

  const handleNavigate = (nextScreen: string) => {
    setScreen(nextScreen)
  }

  return (
    <>
      {screen === 'home' && <HomeScreen onNavigate={handleNavigate} />}
      {screen === 'startCall' && <StartCallScreen onNavigate={handleNavigate} />}
      {screen === 'calling' && <IncomingCallScreen onNavigate={handleNavigate} />}
      {screen === 'liveSession' && <LiveSessionScreen onNavigate={handleNavigate} />}
      {screen === 'summary' && <SummaryScreen onNavigate={handleNavigate} />}
    </>
  )
}

export default App
