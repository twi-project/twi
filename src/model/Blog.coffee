'use strict'

md = new (require 'markdown-it')
moment = require 'moment'
model = require '../core/database'
post = model 'post', require '../core/database/schemas/post'
tag = model 'tag', require '../core/database/schemas/tag'
postTags = model 'postTags', require '../core/database/schemas/postTags'
user = model 'user', require '../core/database/schemas/user'

NotFoundException = require '../core/errors/NotFound'
ForbiddenException = require '../core/errors/Forbidden'

post.belongsTo user,
  foreignKey: 'userId'

# postTags.belongsTo tag

# tag.belongsTo postTags,
#   as: 'postTags'
#   foreignKey: 'tagId'

# postTags.find
#   include: [{
#     model: postTags
#     as: 'postTags'
#   }]
# .then (oData) -> console.log oData
# .catch (err) -> console.log err

# post.belongsToMany tag,
#   as: 'tag'
#   through:
#     model: postTags
#     as: 'postTags'
#     foreignKey: 'tagId'

# tag.belongsToMany post,
#   as: 'post'
#   through:
#     model: postTags
#     as: 'postTags'
#     foreignKey: 'postId'

# post.find
#   attributes:
#     exclude: [
#       'userId'
#     ]
#   where:
#     userId: 1
#   include: [
#     # model: user
#     # as: 'user'
#     # attributes: [
#     #   'login'
#     # ]
#     all: yes
#   ]
# .then (oData) ->
#   console.log oData = oData.get plain: yes
# #   tag.findAll()
# # .then (oData) -> console.log oData
# .catch (err) -> console.log err

###
# Get tag his name
#
# @param string sName
#
# @yield object
###
getTagByName = (sName) ->
  oTagData = yield tag.findOne
    attributes:
      exclude: [
        'tagId'
      ]
    where:
      name: unescape sName # I'm not sure is that secure

  unless oTagData?
    throw new NotFoundException "Tag \"#{sName}\" is not found."

  yield oTagData.get plain: yes

# module.exports = new Blog
module.exports = {
  getTagByName
}
