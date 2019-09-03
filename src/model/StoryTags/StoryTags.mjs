import {Model} from "sequelize"

import createModel from "core/db/createModel"

import schema from "./schema"
import indexes from "./indexes"

@createModel(schema, {indexes})
class StoryTags extends Model {
  static tableName = "story_tags"
}

export default StoryTags