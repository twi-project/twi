"use strict"

passport = require "koa-passport"
{Strategy} = require "passport-local"

{t} = i18n = require "../core/i18n"
user = require "../model/User"
{app: {enableSignup}} = require "../core/helper/configure"

NotFoundException = require "../core/error/NotFound"
ForbiddenException = require "../core/error/Forbidden"

passport.serializeUser (iUserId, cb) -> cb null, iUserId
passport.deserializeUser user.getAuthenticated

passport.use new Strategy
  usernameField: "username"
  passwordField: "pass",
  user.signin

###
# Response signin page
# 
# GET /auth/signin
###
actionLogin = (ctx) ->
  if do ctx.isAuthenticated
    return ctx.redirect "/"

  await ctx.render "auth/signin",
    title: t "auth.title.signin"
    __csrf: ctx.csrf
    __return: ctx.query.return or "/"

  await return

###
# POST /auth/signin
###
actionSignin = (ctx) ->
  ctx.redirect ctx.query.return or "/"

  await return

###
# Response signup page for GET method
# 
# GET /auth/signup
###
actionRegister = (ctx) ->
  {inviteHash} = ctx.params
  unless enableSignup
    return await ctx.render "auth/signup-disabled",
      title: t "auth.title.inviteOnly"

  if do ctx.isAuthenticated
    return ctx.redirect "/"

  await ctx.render "auth/signup",
    title: t "user.title.signup"
    __csrf: ctx.csrf
    __return: ctx.query.return or "/"

  await return

###
# Register new user
# 
# POST /auth/signup
###
actionSignup = (ctx) ->
  {inviteHash} = ctx.params
  unless enableSignup
    throw new ForbiddenException "Unauthorized access to registration form."

  {login, email, pass, repass} = ctx.request.body

  await user.signup login, email, pass, repass

  ctx.redirect ctx.query.return or "/"

  await return

###
# Confirm account via email
#
# GET /auth/confirm/:confirmationHash
###
actionConfirm = (ctx) ->
  {confirmationHash} = ctx.params

  unless await user.activate confirmationHash
    await ctx.render "auth/confirm-fail",
      title: t "auth.title.confirm.fail"
    return

  await ctx.render "auth/confirm-success",
    title: t "auth.title.confirm.success"

  await return

###
# Logout
#
# POST /auth/logout
###
actionLogout = (ctx) ->
  do ctx.logout
  ctx.redirect ctx.query.return or "/"

  await return

module.exports = (r) ->
  r "/signin"
    # .get actionLogin
    .post passport.authenticate("local"), actionSignin

  r "/signup/:inviteHash?"
    # .get actionRegister
    .post actionSignup

  # Confirmation link
  # r "/confirm/:confirmationHash"
  #   .get actionConfirm

  # r "/logout"
  #   .get actionLogout

  return
