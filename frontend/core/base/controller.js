// tmp
import {createElement} from "react"

import {dirname} from "path"
import objectIterator from "objectIterator"

import UIStore from "frontend/core/store/UIStore"

import buildModule, {wrapModule} from "./module"


const MANIFEST_PATTERN = /\/manifest.json$/

function mapManifets(manifests) {
  const res = {}

  manifests = manifests.filter(name => MANIFEST_PATTERN.test(name))

  for (let name of manifests) {
    name = name.replace(/^\.\//, "")

    res[name] = require(`frontend/module/${name}`)
  }

  return res
}

const manifests = mapManifets(
  require.context("frontend/module", true, MANIFEST_PATTERN).keys()
)

const buildComponent = (component, path) => function getComponent(state, cb) {
  const onFulfilled = view => cb(null, view)

  const onRejected = err => console.error(err)

  buildModule({
    ...component,
    stores: {
      ...component.stores,
      ui: new UIStore()
    }
  }, path).then(onFulfilled, onRejected)
}

const makeRoute = ({path, component}, name) => ({
  path: path || name,
  getComponent: buildComponent(component, name)
})

function mapRoutes(manifests, cb) {
  const res = []

  for (const [name, manifest] of objectIterator.entries(manifests)) {
    res.push(cb(manifest, dirname(name), manifests))
  }

  return res
}

const makeRoutes = manifests => mapRoutes(manifests, makeRoute)

// Tmp
function getIndexRoute(state, cb) {
  const onFulfilled = view => cb(null, view)

  const onRejected = err => console.error(err)

  buildModule({
    view: "Home",
    stores: {
      ui: new UIStore()
    }
  }, "home/home").then(onFulfilled, onRejected)
}

// Tmp
function getNotFoundView(state, cb) {
  const onFulfilled = view => cb(
    null, wrapModule(view.default, {ui: new UIStore()})
  )

  const onRejected = err => console.error(err)

  import("frontend/core/error/view/NotFound/NotFound")
    .then(onFulfilled, onRejected)
}

const routes = {
  childRoutes: [{
    path: "/",
    component: require("frontend/core/container/Main").default,
    indexRoute: {
      getComponent: getIndexRoute,
    },
    childRoutes: makeRoutes(manifests)
  }, {
    path: "*",
    getComponent: getNotFoundView
  }]
}

export default routes
