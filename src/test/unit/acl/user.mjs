import test from "ava"

import User from "db/model/User"
import getAbilities from "acl/user"

test("Allow to read only by default", t => {
  const acl = getAbilities({})

  t.true(acl.can("read", "Something"))
  t.true(acl.cannot("manage", "Something"))
})

test("Allow super user to manage everything", t => {
  const acl = getAbilities({role: User.roles.super})

  t.true(acl.can("manage", "Something"))
})

test("Forbid banned user to manage something", t => {
  const acl = getAbilities({status: User.statuses.super})

  t.true(acl.cannot("manage", "Something"))
})