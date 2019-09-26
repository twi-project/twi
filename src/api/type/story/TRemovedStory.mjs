import {
  GraphQLInt as TInt,
  GraphQLString as TString,
  GraphQLBoolean as TBoolean
} from "graphql"

import Type from "parasprite/Type"

import TUser from "api/type/user/TUser"
import TDates from "api/type/common/TDates"
import TStoryTagPage from "api/type/story/TStoryTagPage"

import publisher from "api/resolve/query/story/publisher"
import tags from "api/resolve/query/story/storyTags"

const TRemovedStory = Type("RemovedStory")
  .field({
    name: "id",
    type: TInt,
    required: true
  })
  .field({
    name: "title",
    type: TString,
    required: true
  })
  .field({
    name: "dates",
    type: TDates,
    required: true
  })
  .resolve({
    name: "publisher",
    type: TUser,
    handler: publisher,
    required: true,
    noArgs: true
  })
  .resolve({
    name: "tags",
    type: TStoryTagPage,
    noArgs: true,
    required: true,
    handler: tags
  })
  .field({
    name: "isRemoved",
    type: TBoolean,
    required: true
  })
.end()

export default TRemovedStory
