import { StyleSheet } from 'react-native'

export default StyleSheet.create({ 
  pfp: {
    borderRadius: 100,
    marginRight: 10
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  logout: {
    marginLeft: 'auto'
  },
  updating: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 50
  },
  text: {
    textAlign: 'center',
    marginTop: 10
  }
})