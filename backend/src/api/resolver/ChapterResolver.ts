import {InjectRepository} from "typeorm-typedi-extensions"
import {Service} from "typedi"
import {
  Resolver,
  Query,
  Mutation,
  UseMiddleware,
  Args,
  Arg,
  ID,
  Authorized,
  Ctx,
  Int
} from "type-graphql"
import {ParameterizedContext} from "koa"
import {set} from "lodash"

import {ChapterPage, ChapterPageParams} from "api/type/chapter/ChapterPage"
import {ChapterRepo} from "repo/ChapterRepo"
import {StoryRepo} from "repo/StoryRepo"

import {User} from "entity/User"
import {Chapter} from "entity/Chapter"

import ChapterPageArgs from "api/args/ChapterPageArgs"

import StoryChapterAddInput from "api/input/story/ChapterAdd"
import UpdateInput from "api/input/chapter/Update"

import NotFound from "api/middleware/NotFound"
import GetViewer from "api/middleware/GetViewer"

type Context = ParameterizedContext<{viewer: User}>

@Service()
@Resolver()
class ChapterResolver {
  @InjectRepository()
  private _chapterRepo!: ChapterRepo

  @InjectRepository()
  private _storyRepo!: StoryRepo

  @Query(() => Chapter, {
    description: "Returns chapter by story ID and chapter number"
  })
  @UseMiddleware(NotFound)
  chapter(

    @Arg("storyId", () => ID)
    storyId: number,

    @Arg("number", () => Int)
    number: number,
  ): Promise<Chapter | undefined> {
    return this._chapterRepo.findOne({
      where: {isDraft: false, storyId, number}
    })
  }

  @Query(() => ChapterPage, {
    description: "Returns list of the chapters by story ID."
  })
  async chapters(
    @Args() {storyId, limit, offset, page}: ChapterPageArgs
  ): Promise<ChapterPageParams> {
    const [rows, count] = await this._chapterRepo.findAndCount({
      where: {
        storyId,
        isDraft: false
      }
    })

    return {rows, count, limit, offset, page}
  }

  @Mutation(() => Chapter, {description: "Creates a new chapter."})
  @Authorized()
  @UseMiddleware(GetViewer)
  async storyChapterAdd(
    @Ctx()
    ctx: Context,

    @Arg("story")
    {id, chapter: fields}: StoryChapterAddInput
  ): Promise<Chapter> {
    let story = await this._storyRepo.findOne(id)

    if (!story) {
      ctx.throw(400)
    }

    await this._storyRepo.increment({id: story.id}, "chaptersCount", 1)

    story = await this._storyRepo.findOne(story.id)

    return this._chapterRepo.createAndSave({...fields, story})
  }

  @Mutation(() => Chapter, {description: "Update chapter with given ID."})
  @Authorized()
  @UseMiddleware(GetViewer)
  async storyChapterUpdate(
    @Ctx()
    ctx: Context,

    @Arg("chapter")
    {id, ...fields}: UpdateInput
  ): Promise<Chapter> {
    const chapter = await this._chapterRepo.findOne(id)

    if (!chapter) {
      ctx.throw(400)
    }

    Object.entries(fields).forEach(([key, value]) => set(chapter, key, value))

    return this._chapterRepo.save(chapter)
  }

  @Mutation(() => ID, {description: "Remove chapter with given ID."})
  @Authorized()
  @UseMiddleware(GetViewer)
  async storyChapterRemove(
    @Ctx()
    ctx: Context,

    @Arg("chapterId", () => ID)
    chapterId: number
  ): Promise<number> {
    const chapter = await this._chapterRepo.findOne(chapterId)

    if (!chapter) {
      ctx.throw(400)
    }

    // Remove next line, because it handled by ChapterSubscriber.
    // chapter.number = null

    await Promise.all([
      this._storyRepo.decrement({id: chapter.story.id}, "chaptersCount", 1),
      this._chapterRepo.softRemove(chapter)
    ])

    return chapterId
  }
}

export default ChapterResolver
