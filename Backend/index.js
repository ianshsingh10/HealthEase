import express, { request, response } from 'express';
import {PORT ,database} from './config.js';
import mongoose from 'mongoose';
import User from './models/userModel.js';
import bcrypt from 'bcrypt';

const app=express();

app.use(express.json());

app.get("/",(req,res)=>{
  console.log(req);
  return res.send("HealthEase");
})

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: 'Error registering user'});
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ message: 'Username and password are required' });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    res.status(200).send({ message: 'Login successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: 'Error logging in' });
  }
});




mongoose
  .connect(database)
  .then(()=>{
    console.log('Connected to the Database');
    app.listen(PORT,()=>{
      console.log("HealthEase");
    });
  })
  .catch((error)=>{
    console.log(error);
  });
