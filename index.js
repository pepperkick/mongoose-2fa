const otplib = require("otplib")

module.exports = (schema, options) => {
    schema.add({
        _2faSecret: {
            type: String
        }
    })

    schema.methods.generate2FASecret = async function () {
        this._2faSecret = await otplib.authenticator.generateSecret()
    }
    
    schema.methods.verify2FAToken = async function (token) {
        return otplib.authenticator.check({ token, secret: this._2faSecret });
    }
}
