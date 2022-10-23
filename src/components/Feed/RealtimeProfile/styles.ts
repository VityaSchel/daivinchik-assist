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
    marginTop: 20
  },
  pfpPlaceholder: {
    width: 100
  },
  pfp: {
    borderRadius: 15
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginLeft: 20,
    height: 100,
  },

  infoAge: {
    // marginTop: 'auto',
    color: '#888'
  },
  
  infoText: {
    marginTop: 5,
    color: '#888',
    fontStyle: 'italic',
    
  },
  bold: {
    fontWeight: 'bold'
  },
  interactions: {
    marginTop: 30
  }
})