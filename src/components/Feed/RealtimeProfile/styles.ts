import { StyleSheet } from 'react-native'

export default StyleSheet.create({ 
  pending: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,

    title: {
      marginBottom: 10
    }
  },
  miniProfile: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,

    info: {
      display: 'flex',
      flex: 1,
      marginLeft: 20
    }
  }
})