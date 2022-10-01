import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function Container(props: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 20
  },
})