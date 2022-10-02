export const callMiddleware = async (mtprotoClass) => {
  mtprotoClass.__call__ = mtprotoClass.call
  mtprotoClass.__dcId__ = undefined
  mtprotoClass.call = async (methodName: string, params: any) => {
    const result = await mtprotoClass.__call__(methodName, params, mtprotoClass.__dcId__ && { dcId: mtprotoClass.__dcId__ })
    const regex = /^[A-Z]+_MIGRATE_(\d+)$/
    if(regex.test(result.error_message)) {
      const migrateError = result.error_message.match(regex)
      const newDc = migrateError[1]
      console.log('Migrating to new dc', newDc)
      mtprotoClass.__dcId__ = newDc
      return await mtprotoClass.__call__(methodName, params)
    } else {
      return result
    }
  }
}