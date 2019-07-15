import {GraphQLScalarType as Scalar} from "graphql"
import {GraphQLError} from "graphql/error"
import {Kind} from "graphql/language"

import mongoose from "mongoose"

const {Types: t} = mongoose

const STRING = Kind.STRING

function validateObjectId(ast) {
  const {kind, value} = ast

  if (kind !== STRING) {
    throw new GraphQLError(
      "Query error: Expected String value for TObjectID type, "
        + `but got a type of ${kind}`,

      [ast]
    )
  }

  if (!t.ObjectId.isValid(value)) {
    throw new GraphQLError("Invalid ObjectID value.", [ast])
  }

  return value
}

const parseValue = value => validateObjectId({
  kind: STRING, value
})

const parseLiteral = ast => validateObjectId({...ast})

const TObjectID = new Scalar({
  name: "ObjectID",
  description: (
    "An ObjectId is a 12 byte binary BSON type "
      + "that used as unique identifier for documents."
  ),
  serialize: String,
  parseLiteral,
  parseValue
})

export default TObjectID