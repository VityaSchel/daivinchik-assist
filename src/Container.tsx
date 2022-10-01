import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import styles from './styles/globals.module.scss'

export default function Container(props: { children: React.ReactNode }) {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        {props.children}
      </View>
    </SafeAreaView>
  )
}