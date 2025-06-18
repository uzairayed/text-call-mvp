import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from './firebase'
import AuthScreen from './AuthScreen'
import UsernameScreen from './UsernameScreen'
import HomeScreen from './HomeScreen'
import StartCallScreen from './StartCallScreen'
import LiveSessionScreen from './LiveSessionScreen'
import SummaryScreen from './SummaryScreen'
import { doc, getDoc } from 'firebase/firestore'
import './App.css'

function App() {
  const [user, loading] = useAuthState(auth)
  const [screen, setScreen] = useState('home')
  const [usernameChecked, setUsernameChecked] = useState(false)
  const [hasUsername, setHasUsername] = useState(false)
  const [recipient, setRecipient] = useState<string | undefined>(undefined)
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const checkUsername = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        setHasUsername(!!(userDoc.exists() && userDoc.data()?.username))
        setUsernameChecked(true)
      } else {
        setUsernameChecked(false)
        setHasUsername(false)
      }
    }
    checkUsername()
  }, [user])

  const handleNavigate = (nextScreen: string, recipientUsername?: string, newSessionId?: string) => {
    setScreen(nextScreen)
    if (recipientUsername) setRecipient(recipientUsername)
    if (newSessionId) setSessionId(newSessionId)
  }

  if (loading || (user && !usernameChecked)) return <div>Loading...</div>
  if (!user) return <AuthScreen />
  if (!hasUsername) return <UsernameScreen onComplete={() => setHasUsername(true)} />

  return (
    <>
      {screen === 'home' && <HomeScreen onNavigate={handleNavigate} />}
      {screen === 'startCall' && <StartCallScreen onNavigate={handleNavigate} />}
      {screen === 'liveSession' && recipient && sessionId && (
        <LiveSessionScreen onNavigate={handleNavigate} recipient={recipient} sessionId={sessionId} />
      )}
      {screen === 'summary' && <SummaryScreen onNavigate={handleNavigate} />}
    </>
  )
}

export default App
