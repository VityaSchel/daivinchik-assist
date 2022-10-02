import { StyleSheet } from 'react-native'

export default StyleSheet.create({ 
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  innerContainer: {
    width: '100%',
    maxWidth: 330
  },
  moreInfoButton: {
    marginTop: 10
  },
  button: {
    marginTop: 10
  },
  warning: {
    color: '#999999',
    fontSize: 12,
    marginTop: 20,
  },
  link: {
    color: '#689aff'
  }
})