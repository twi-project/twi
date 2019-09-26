import {Model} from "sequelize"

import createModel from "core/db/createModel"

import schema from "./schema"

@createModel(schema, {paranoid: true})
class Story extends Model {
  get isTranslation() {
    const {originalAuthor, originalTitle, originalUrl} = this

    return Boolean(originalAuthor && originalTitle && originalUrl)
  }

  get isRemoved() {
    return Boolean(this.deletedAt)
  }

  hasPublisher(user) {
    if (!user) {
      return false
    }

    return this.userId === Number(user.id)
  }
}

export default Story
