import {GraphQLString as TString, GraphQLInt as TInt} from "graphql"
import {GraphQLDateTime as TDateTime} from "graphql-iso-date"

import Type from "parasprite/Type"

import TChapter from "./TChapter"

import TAuthor from "../user/TAuthor"

import getChaptersById from "../../resolve/query/story/getChaptersById"

const TStory = Type(
  "Story", "Represends available information about the stories"
)
  .field("title", TString, true)
  .field("description", TString, true)
  .field("author", TAuthor, true)
  .field("slug", TString, true)
  .field("createdAt", TDateTime, true)
  .resolve("chapters", [TChapter, true], true, getChaptersById)
    .arg("cursor", TInt)
  .end()
.end()

export default TStory
