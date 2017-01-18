import React from "react"
// import {autorun} from "mobx"
import {Provider, observer} from "mobx-react"
import DocumentTitle from "react-document-title"

import AppStore from "store/container/App"

import TokenStore from "store/component/common/token/Token"
import CharacterStore from "store/component/editor/character/Character"
import NewStoryStore from "store/view/story/NewStory"

import App from "./App"
import Layout from "../view/layout/App/Layout"

const stores = {
  app: new AppStore(),
  tokenStore: new TokenStore(),
  character: new CharacterStore(),
  newStory: new NewStoryStore()
}

@observer
class MainContainer extends App {
  render() {
    const {width, height} = this.state

    return (
      <DocumentTitle title={stores.app.title}>
        <Provider {...stores}>
          <Layout {...this.props} width={width} height={height} />
        </Provider>
      </DocumentTitle>
    )
  }
}

export default MainContainer
