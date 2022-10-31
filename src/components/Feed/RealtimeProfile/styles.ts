import { StyleSheet } from 'react-native'

export const defaultStyles = StyleSheet.create({ 
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
  pfpPlaceholderSize: { width: 100 },
  pfpPlaceholder: {
    width: 100
  },
  pfp: {
    width: 100,
    height: 100,
    borderRadius: 15
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginLeft: 20,
    height: 100,
  },
  name: {
    fontWeight: 'bold'
  },
  infoAge: {
    color: '#888'
  },
  infoText: {
    marginTop: 5,
    color: '#888',
    fontStyle: 'italic',
  },
  infoPlace: {
    fontWeight: 'bold'
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
    height: 420,
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

export const compactStyles = StyleSheet.create({
  ...defaultStyles,
  pending: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,

    title: {
      marginBottom: 10
    }
  },
  pfpPlaceholderSize: { width: 50 },
  pfpPlaceholder: {
    width: 50
  },
  pfp: {
    width: 50,
    height: 50,
    borderRadius: 8
  },
  info: {
    ...defaultStyles.info,
    marginLeft: 15,
    flexWrap: 'wrap',
    flexDirection: 'row',
    height: 50
  },
  infoText: {
    display: 'none'
  },
  name: {
    fontWeight: 'bold',
    width: '100%'
  },
  infoPlace: {
    fontWeight: 'bold',
    marginRight: 10
  },
  interactions: {
    marginTop: 10
  },
  instagramContainer: {
    ...defaultStyles.instagramContainer,
    height: 300
  },
  instagram: {
    marginTop: 5
  },
})