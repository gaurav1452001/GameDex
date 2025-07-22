import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Auth from '../../components/Auth'
import Account from '../../components/Account'
import { TouchableOpacity, View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function signIn() {
  const [session, setSession] = useState<Session | null>(null)
  const navigation = useNavigation()
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session) 
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
      </View>
    </SafeAreaView>
  )
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#181818',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 10,
  },
}