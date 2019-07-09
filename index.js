const otplib = require("otplib/authenticator");
const crypto = require("crypto");

module.exports = (schema, options) => {
    otplib.options = { crypto };

    options.issuer = options.issuer || "backend";
    options.field = options.field || "email";

    schema.add({
        _2faSecret: {
            type: String,
            default: null
        }
    })

    schema.methods.enable2FA = async function () {
        this._2faSecret = await otplib.generateSecret();

        await this.save();
    }

    schema.methods.disable2FA = async function () {
        this._2faSecret = null;

        await this.save();
    }
    
    schema.methods.verify2FAToken = async function (token) {
        return otplib.verify({ token, secret: this._2faSecret });
    }

    schema.methods.get2FALink = async function () {
        return otplib.keyuri(this[options.field], options.issuer, this._2faSecret);
    }

    schema.methods.is2FAEnabled = function () {
        return this._2faSecret ? true : false;
    }
}
