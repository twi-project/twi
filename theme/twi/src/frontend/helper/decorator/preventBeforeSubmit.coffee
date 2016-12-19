###
# Call event.preventDefault before submit
###
preventBeforeSubmit = (target, key, descriptor) ->
  submit = descriptor.value

  descriptor.value = _submit = (event) ->
    do event.preventDefault; submit.call this, event

  return

module.exports = module.exports.default = preventBeforeSubmit
