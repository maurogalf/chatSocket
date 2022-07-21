import mongoose from 'mongoose';

const { Schema } = mongoose;

mongoose.connect('mongodb://localhost:27017/usersDB')
    .then();
    
mongoose.connection.on('error', (err) => {
    console.log(err);
});

mongoose.connection.on('open', () => {
    console.log('MongoDB connected');
});

const userSchema = new Schema({
    username: String,
    password: String
});

const User = mongoose.model('users', userSchema)

export default User
