'use strict'

function enableSecurePasswordPlugin(Bookshelf) {
    const DEFAULT_PASSWORD_FIELD = 'password'
    const PRIVATE_PASSWORD_FIELD = '__password'
    const DEFAULT_PASSWORD_DIGEST_FIELD = 'userpassword'
    const DEFAULT_SALT_ROUNDS = 12
    const PasswordMismatchError = require('./error')
    const proto = Bookshelf.Model.prototype
    let bcrypt
    try {
        bcrypt = require('bcryptjs')
    } catch (e) { }

    Bookshelf.PasswordMismatchError = PasswordMismatchError
    Bookshelf.Model.PasswordMismatchError = PasswordMismatchError

    Bookshelf.plugin('bookshelf-virtuals-plugin')

    function passwordDigestField(model) {
        if (typeof model.hasSecurePassword === 'string' || model.hasSecurePassword instanceof String) {
            return model.hasSecurePassword
        }

        return DEFAULT_PASSWORD_DIGEST_FIELD
    }

    function bcryptRounds(model) {
        if (typeof model.bcryptRounds === 'number' && model.bcryptRounds === parseInt(model.bcryptRounds, 10)) {
            return model.bcryptRounds
        }

        return DEFAULT_SALT_ROUNDS
    }

    function hash(rounds, value) {
        if (value === null) {
            return Promise.resolve(null)
        }

        if (isEmpty(value)) {
            return Promise.resolve(undefined)
        }

        return bcrypt
            .genSalt(rounds)
            .then((salt) => {
                return bcrypt.hash(value, salt)
            })
    }

    function isEmpty(str) {
        if (str === undefined || str === null) {
            return true
        }

        return ('' + str).length === 0
    }

    function enablePasswordHashing(model) {
        const field = passwordDigestField(model)

        model.virtuals = model.virtuals || {}
        model.virtuals[DEFAULT_PASSWORD_FIELD] = {
            get: function getPassword() { },
            set: function setPassword(value) {
                this[PRIVATE_PASSWORD_FIELD] = value
            }
        }

        model.on('saving', (model) => {
            const value = model[PRIVATE_PASSWORD_FIELD]

            return hash(bcryptRounds(model), value).then((_hashed) => {
                model.unset(DEFAULT_PASSWORD_FIELD)
                if (_hashed !== undefined) {
                    model.set(field, _hashed)
                }
                return model
            })
        })
    }

    const Model = Bookshelf.Model.extend({
        hasSecurePassword: false,

        constructor: function () {
            if (this.hasSecurePassword) {
                enablePasswordHashing(this)
            }

            proto.constructor.apply(this, arguments)
        },

        authenticate: function authenticate(password) {
            const digest = this.get(passwordDigestField(this))

            if (!this.hasSecurePassword) {
                return proto.authenticate.apply(this, arguments)
            }

            if (isEmpty(password) || isEmpty(digest)) {
                return Promise.reject(new this.constructor.PasswordMismatchError())
            }

            return bcrypt
                .compare(password, digest)
                .then((matches) => {
                    if (!matches) {
                        throw new this.constructor.PasswordMismatchError()
                    }

                    return this
                })
        }
    })

    Bookshelf.Model = Model
}

module.exports = enableSecurePasswordPlugin