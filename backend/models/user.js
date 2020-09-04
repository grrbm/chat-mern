const mongoose = require('mongoose'),
      jwt = require('jsonwebtoken'),
      bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});


userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
})

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user){
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user;
}

userSchema.statics.addUser = async function (username, password) {
    try{
        const user = new User({username, password});
        await user.save();
        const token = await user.generateAuthToken();
        return { user, token };
    } catch (e) {
        return;
    }
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;


    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 
                            "ABCDEFGHI012345", 
                           { expiresIn: 60 * 60 * 24})  //expires in 24h

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

const User = mongoose.model('User', userSchema)
module.exports = User