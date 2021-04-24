import {Repository, EntityRepository} from "typeorm"
import {Service} from "typedi"

import {Chapter} from "entity/Chapter"

@Service()
@EntityRepository(Chapter)
export class ChapterRepo extends Repository<Chapter> {}

export default ChapterRepo