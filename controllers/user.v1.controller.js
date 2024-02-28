import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "../utils/error.js";
import { json } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersData = () =>
  JSON.parse(fs.readFileSync(`${__dirname}/../data/usersData.json`));

const allUsers = usersData();

const findUser = (req) => {
  const id = +req.params.id;
  const user = allUsers.find((el) => el.id === id);
  return user;
};

const addNewUser = (req) => {
  const newId = +allUsers[allUsers.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);
  return newUser;
};

function writeFilePromise(filePath, data, res, status) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.status(status).json(data));
      }
    });
  });
}

//* user handlers
export const getAllUsers = (req, res, next) => {
  try {
    return res.status(200).json(usersData());
  } catch (error) {
    next(error);
  }
};

export const getUser = (req, res, next) => {
  try {
    const user = findUser(req);
    if (!user) return next(errorHandler(404, "User not found!"));

    const { password, ...rest } = user;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const newUser = addNewUser(req);
    allUsers.push(newUser);

    await writeFilePromise(
      `${__dirname}/../data/usersData.json`,
      JSON.stringify(allUsers),
      res,
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = findUser(req);
    if (!user) return next(errorHandler(404, "User not found!"));

    const { username, email, password } = req.body;
    user.username = username;
    user.email = email;
    user.password = password;
    console.log(user);
    //! How to only change one user's data (pass one user as the data param)
    await writeFilePromise(
      `${__dirname}/../data/usersData.json`,
      JSON.stringify(allUsers),
      res,
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const curUser = findUser(req);
    if (!curUser) return next(errorHandler(404, "User not found!"));

    const newUsersArray = allUsers.filter((user) => user.id !== curUser.id);
    await writeFilePromise(
      `${__dirname}/../data/usersData.json`,
      JSON.stringify(newUsersArray),
      res,
      202,
    );
  } catch (error) {
    next(error);
  }
};
