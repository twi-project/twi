"use strict"
Koa = require "koa"
cors = require "kcors"
convert = require "koa-convert"
serve = require "koa-static"
favicon = require "koa-favicon"
bodyparser = require "koa-bodyparser"
sess = require "koa-generic-session"
redisStore = require "koa-redis"
passport = require "koa-passport"
controller = require "./controller"
view = require "./view"
isXhr = require "../middleware/xhr"
multipart = require "../middleware/multipart"
errorHandler = require "../middleware/error-handler"
logger = require "../middleware/logger"

{
  app: {host, port, secure, theme}
  session, IS_DEVEL
} = require "../helper/configure"

{default: CSRF} = require "koa-csrf"
{ok, info, normal}  = require "../logger"
{readFileSync, realpathSync} = require "fs"
{readFile, realpath} = require "promise-fs"

PUBLIC_DIR = realpathSync "#{__dirname}/../../public"
app = new Koa
app.keys = [session.secret]

normal "Init Twi middlewares"

# Check xhr request
app
  .use do cors
  .use isXhr

  # Set error handler
  .use errorHandler

  # Serve favicon and static files
  .use favicon "#{PUBLIC_DIR}/assets/img/icns/favicons/twi.ico"

  # Logger middleware for any requests
  .use logger

  # Bodyparser
  .use do bodyparser
  .use multipart

  # Session
  .use convert sess
    store: do redisStore
    prefix: session.prefix
    key: "#{session.prefix}#{session.sessidName}"
    cookie:
      maxAge: 1000 * 60 * 60 * 24 * 360 # One year in ms

  # Csrf tokens
  # .use new CSRF

  # Passport
  .use do passport.initialize
  .use do passport.session

  # Set controllers
  .use do controller.routes
  .use do controller.allowedMethods

# Set view engine
view app, debug: off

normal "
  Run Twi backend server for #{process.env.NODE_ENV or "development"} environment
"

msg = "Backend started started on"

module.exports = {
  app, host, port, secure, msg
}
