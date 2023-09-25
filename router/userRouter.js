const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const { UserModel } = require("../model/userModel");

const userRouter = express.Router();

// ___________Account Creation of Users_____________

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(400).json({ msg: "Something went wrong" });
        } else {
          const instUser = new UserModel({
            name,
            email,
            gender,
            password: hash,
          });
          await instUser.save();
          res
            .status(200)
            .json({ msg: "Account has been Created Successfully!" });
        }
      });
    } else {
      res
        .status(400)
        .json({ msg: "User is already registered with same email-Id" });
    }
  } catch (error) {
    res.status(400).json({ msg: "Internal Server Error , try again!" });
  }
});

// _________User Login ____________

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          const token = jwt.sign(
            { UserID: user._id, name: user.name },
            "sociomasai"
          );
          const name = user.name;
          res.status(200).json({ msg: "Logged In Successfully", token, name });
        } else {
          res.status(400).json({ msg: "Password is wrong!" });
        }
      });
    } else {
      res
        .status(400)
        .json({ msg: "User does not have an Account , try to signUp" });
    }
  } catch (error) {
    res.status(400).json({ msg: "Internal Server Error, try Again!" });
  }
});

module.exports = { userRouter };
