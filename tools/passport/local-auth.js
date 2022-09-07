import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt-nodejs';
import User from "../../data/contenedores/ContenedorMongoUsers.js"

passport.use('register', new LocalStrategy(async (username, password, done)=> {
    const user = await User.findOne({username: username})
    if(user){
        return done(null, false)
    } else {
        const newUser = new User();
        newUser.username = username;
        newUser.password = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        await newUser.save();
        done(null, newUser)
    }
}));

passport.use('login', new LocalStrategy(async (username, password, done)=> {
    const user = await User.findOne({username: username})
    if(!user){
        return done(null, false)
    }
    if(!bcrypt.compareSync(password, user.password)){
        return done(null, false)
    }
    done(null, user)
    }));

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser( async (id, done)=>{
    const user = await User.findById(id)
    done(null, user)
})

export default passport;