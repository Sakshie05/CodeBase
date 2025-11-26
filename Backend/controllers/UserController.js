import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient, ReturnDocument } from "mongodb";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

// The ObjectId is a 12-byte BSON type that guarantees uniqueness across different machines
// and processes, which is essential for distributed systems. It is generated in such a way
// that ensures no collisions across different databases or servers.

dotenv.config();

const uri = process.env.MONGO_URI;

let client;

// async function connectClient() {
//   if (!client) {
//     client = new MongoClient(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await client.connect();
//   }
//   return client;
// }

async function connectClient() {
  if (!client) {
    try {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
      console.log(" Connected to MongoDB");
    } catch (error) {
      console.error(" MongoDB connection failed:", error.message);
      throw error;
    }
  }
  return client;
}

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const client = await connectClient();
    const db = client.db("test");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      starRepos: [],
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // result.insertedId gives the MongoDB _id of the neww object
    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, message: "Signup successful!", userId: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("test");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ message: err.message || "Server error during login" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("test");
    const usersCollection = db.collection("users");
    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error fetching all the users" });
  }
};

export const getUserProfile = async (req, res) => {
  const currentID = req.params.id;

  try {
    await connectClient();
    const db = client.db("test");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(currentID),
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error fetching the user's details" });
  }
};

export const updateUserProfile = async (req, res) => {
  const currentId = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("test");
    const usersCollection = db.collection("users");

    let updatefields = {};

    if (email) {
      updatefields.email = email;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatefields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(currentId),
      },
      { $set: updatefields },
      { returnDocument: "after" }
    );

    if (!result.value) {
      res.status(404).json({ message: "User not found or updation failed" });
    }

    const { password: _, ...userWithoutPassword } = result.value;
    res.status(200).json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json(err.message || "Error updating the user profile");
  }
};

export const deleteUserProfile = async (req, res) => {
  const currentId = req.params.id;

  try {
    await connectClient();
    const db = client.db("test");
    const usersCollection = db.collection("users");

    const result = await usersCollection.findOneAndDelete({
      _id: new ObjectId(currentId),
    });

    if (result.deleteCount == 0) {
      return res.status(400).json({ message: "User notfound" });
    }

    res.json(result, { message: "User profile deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed at deleting the user profile" });
  }
};
