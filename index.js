const otplib = require("otplib/authenticator");
const crypto = require("crypto");

module.exports = (schema, options) => {
    otplib.options = { crypto }

    schema.add({
        _2faSecret: {
            type: String
        }
    })

    schema.methods.generate2FASecret = async function () {
        this._2faSecret = await otplib.generateSecret();

        await this.save();
    }
    
    schema.methods.verify2FAToken = async function (token) {
        return otplib.verify({ token, secret: this._2faSecret });
    }
}
