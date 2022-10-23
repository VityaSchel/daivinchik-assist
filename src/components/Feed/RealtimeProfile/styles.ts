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
  },
  history: {
    borderBottomWidth: 2,
    borderColor: '#ccc',
    maxHeight: 100
  },
  historyEntry: {
    marginVertical: 10,
    marginLeft: 10
  },
  instagramContainer: {
    borderBottomWidth: 2,
    borderColor: '#ccc',
    height: 450,
    // marginTop: 5
  },
  instagram: {
    marginTop: 30
  },
  instagramTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  instagramActions: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
})