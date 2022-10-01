import React from 'react'
import { SafeAreaView, View } from 'react-native'
import styles from './styles/globals'

export default function Container(props: { children: React.ReactNode }) {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        {props.children}
      </View>
    </SafeAreaView>
  )
}