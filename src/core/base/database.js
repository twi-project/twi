import mongoose from "mongoose"
import isString from "lodash/isString"

import invariant from "core/helper/util/invariant"

mongoose.Promise = Promise

function getConnectionSctring({host, port, name}) {
  let connectionSctring = "mongodb://"

  invariant(
    host == null, TypeError,
    "Host is required parameter for database connection."
  )

  invariant(
    isString(host) === false, TypeError,
    "Host should be passed as a string."
  )

  invariant(
    name == null, TypeError,
    "Database is required for a connection."
  )

  invariant(
    isString(name) === false, TypeError,
    "Database name should be a string."
  )

  connectionSctring += host

  if (port && isString(port)) {
    connectionSctring += `:${port}`
  }

  connectionSctring += `/${name}`

  return connectionSctring
}

async function createConnection(config = {}) {
  const replicaUri = getConnectionSctring(config)

  return await mongoose.connect(replicaUri, {
    useMongoClient: true,
    promiseLibrary: Promise
  })
}

export default createConnection
