'use strict'

_ = require 'lodash'
co = require 'co'
redis = require 'then-redis'
moment = require 'moment'
crypto = require 'crypto'
bcrypt = require '../core/helpers/co-bcrypt'
mailer = require '../core/mail/mailer'
model = require '../core/database'
user = model 'user', require '../core/database/schemas/user'
contacts = model 'contacts', require '../core/database/schemas/contacts'
validationHelper = require '../core/helpers/validation-helper'
redis = do redis.createClient

ForbiddenException = require '../core/errors/Forbidden'
NotFoundException = require '../core/errors/NotFound'

{info} = require '../core/logger'
{isEmail} = validationHelper

# Associate contacts with users
contacts.hasOne user, foreignKey: 'contacts_id'
user.belongsTo contacts, foreignKey: 'contacts_id'

# Authenticate user by login/email and pass
_authenticate = (sUsername, sPass) ->
  oOptions =
    attributes: [
      'userId'
      'password'
    ]
    where: (if isEmail sUsername then email: sUsername else login: sUsername)

  oUserData = yield user.findOne oOptions

  return null unless oUserData?

  return null unless yield bcrypt.compare sPass, oUserData.password

  return oUserData.userId

###
# Expiry period for confirmation link
#
# By default is 24 hours
###
CONFIRMATION_EXPIRE = 60 * 60 * 24

###
# Sending confirmation message via email
###
confirm = (sEmail, sId) ->
  sHash = crypto.createHash 'sha256'
    .update "#{+moment()}#{sEmail}"
    .digest 'hex'

  yield redis.set sHash, sId, 'EX', CONFIRMATION_EXPIRE
  yield mailer.send sEmail, "Добро пожаловать!", 'welcome',
    activationLink: sHash
  info "Confirmation message has been sent to #{sEmail}"
  return

class User
  constructor: ->
    ###
    # Status:
    #   - Inactive
    #   - Active
    #   - Banned
    #   - Deleted
    ###
    @STATUS_INACTIVE = 0
    @STATUS_ACTIVE = 1
    @STATUS_BANNED = 2
    @STATUS_DELETED = 3

    ###
    # Roles:
    #   - User
    #   - Moderator
    #   - Admin
    #   - Root
    ###
    @ROLE_USER = 0
    @ROLE_MODERATOR = 1
    @ROLE_ADMIN = 2
    @ROLE_ROOT = 3

    @GENDER_MALE = 1
    @GENDER_FEMALE = 0

    ###
    # Reserved.
    ###
    @RESERVED = [
      'admin'
      'moderator'
      'root'
    ]

  _getUser: (oOptions) ->
    yield user.findOne oOptions

  profile: (sUserId) ->
    oUserData = yield @_getUser
      attributes:
        exclude: [
          'contactsId'
          'userId'
          'email'
          'password'
          'role'
        ]
      include: [
        model: contacts
        attributes:
          exclude: [
            'contactsId'
            'userId'
          ]
      ]
      where:
        login: sUserId

    # Throwing error if user is not found
    unless oUserData?
      throw new NotFoundException "User \"#{sUserId}\" is not found."

    yield oUserData.get plain: yes

  signup: (sLogin, sEmail, sPass, sRepass) ->
    # unless sPass is sRepass and validationHelper.isValidPassword sPass
    #   throw new UnauthorizedException ""

    oUserData = yield user.create
      login: sLogin
      email: sEmail
      password: (yield bcrypt.hash sPass, 10)
      registeredAt: do moment().format
      role: @ROLE_USER
      status: @STATUS_INACTIVE

    {userId} = oUserData.get plain: yes
    yield contacts.create userId: userId
    yield confirm sEmail, userId

  activate: (sHash) ->
    sId = yield redis.get sHash
    return no unless sId?

    yield user.update {
      status: @STATUS_ACTIVE
    }, {
      where:
        userId: sId
    }

    yield redis.del sHash

    return yes

  getAuthenticated: (id, cb) ->
    user.findOne
      attributes: [
        'userId'
        'login'
        'role'
        'status'
      ]
      where:
        userId: id
    .then (oUserData) -> cb null, oUserData.get plain: yes
    .catch (err) -> cb err

  ###
  # Auth user by his username + password pair
  #
  # @param string sUsername
  # @param string sPass
  ###
  signin: (sUsername, sPass, cb) ->
    co _authenticate sUsername, sPass
      .then (userId) -> if userId? then cb null, userId else cb null, no
      .catch (err) -> cb err

module.exports = User
