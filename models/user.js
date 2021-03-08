    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const bcrypt = require('bcrypt');

    const userSchema = new Schema({
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            maxLength: 100
        }
    }, { timestamps: true });

    userSchema.pre('save', async function (next) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        next();
    });

    userSchema.statics.login = async function(email, password) {
        const user = await this.findOne({ email });
        if(user){
            const auth = bcrypt.compare(password, user.password);
            if(auth){
                return user;
            }
            throw Error('incorrect password');
        }
        throw Error('incorrect email');
    }

    const User = mongoose.model('user', userSchema);

    module.exports = User;