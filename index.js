import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
// import depRouter from "./routes/deposit.js";
const app = express();
// app.use(depRouter);

app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
export const loadUsers = () => {
  try {
    const dataBuffer = fs.readFileSync("users.json");
    const dataJson = dataBuffer.toString();
    const data = JSON.parse(dataJson);
    return data;
  } catch (e) {
    return [];
  }
};

const save = (data) => {
  const dataJson = JSON.stringify(data);
  fs.writeFileSync("users.json", dataJson);
};
const add = (newUser) => {
  try {
    const users = loadUsers();
    if (!newUser.cash) {
      newUser.cash = 0;
    }
    if (!newUser.credit) {
      newUser.credit = 0;
    }
    const newUserWithID = { ...newUser, id: uuidv4() };
    users.push(newUserWithID);
    save(users);
    return newUserWithID;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const updateUser = (id, name, cash, credit) => {
  const users = loadUsers();
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    const updatedUser = { ...users[userIndex], name, cash, credit };
    users[userIndex] = updatedUser;
    save(users);
  } else {
    console.log("No user with that specific id");
  }
};
// updateUser("dfb95044-2d9d-42ee-ab7b-eb1ccb6d9073", "Shhady", "50", "90");

app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to my bank API</n></h1><p>instructions in README file</n></p><p>For all Users enter localhost:5050/users</p>"
  );
});

app.get("/users", (req, res) => {
  res.send(loadUsers());
});

app.post("/users", (req, res) => {
  //   console.log(req.body);
  const newUser = add(req.body);
  if (newUser) {
    res.status(201).json(newUser);
  } else {
    res.status(404).json({ message: "creating new user failed!" });
  }
});

app.put("/users/:id", (req, res) => {
  const users = loadUsers();
  let id = req.params.id;
  const userIdFind = users.find((user) => user.id === id);
  if (!userIdFind) {
    res.status(404).json({ message: "no user with specific id" });
  }
  if (userIdFind) {
    updateUser(req.body.id, req.body.name, req.body.cash, req.body.credit);
    res.status(200).json({
      id: req.body.id,
      name: req.body.name,
      cash: req.body.cash,
      credit: req.body.credit,
      Message: "update succeed",
    });
  }
});

app.get("/users/:id", (req, res) => {
  const users = loadUsers();
  let id = req.params.id;
  let user = users.find((user) => user.id === id);
  res.send(user);
});

app.patch("/credit", (req, res) => {
  const users = loadUsers();
  let id = req.body.id;
  let creditAmount = req.body.creditAmount;
  const user = users.find((user) => user.id === id);
  let newCredit = Number(user.credit) + Number(req.body.creditAmount);
  if (!user) {
    res.status(404).json({ message: "no user with specific id" });
  }
  if (creditAmount) {
    user.credit += creditAmount;
  }
  if (id) {
    user.id = id;
  }

  if (newCredit > 0) {
    res.json({
      message: "Success!",
      amount: req.body.amount,
      toAccountID: req.body.id,
      cash: req.body.cash,
      Name: req.body.name,
      credit: newCredit,
    });
    updateUser(user.id, user.name, user.cash, newCredit);
  } else {
    res.status(404).json({ message: "credit can't be less than 0" });
  }
});

app.patch("/deposit", function (req, res) {
  const users = loadUsers();
  let amount = req.body.amount;
  let id = req.body.id;
  const user = users.find((user) => user.id === id);
  let newCash = Number(user.cash) + Number(req.body.amount);
  if (!req.body.amount || !req.body.id) {
    res.status(400).json({
      code: 400,
      message: "Must provide an ID and amount to deposit.",
    });
  }
  try {
    if (amount) {
      user.cash += amount;
    }
    if (id) {
      user.id = id;
    }
    updateUser(user.id, user.name, newCash, user.credit); // deposit(req.body);
    res.json({
      message: "Success!",
      amount: req.body.amount,
      toAccountID: req.body.id,
      cash: newCash,
      Name: req.body.name,
      credit: req.body.credit,
    });
  } catch (err) {
    res.status(400).json({
      code: 400,
      message: err.message,
    });
  }
});

app.patch("/withdraw", function (req, res) {
  const users = loadUsers();
  let amount = req.body.amount;
  let id = req.body.id;
  const user = users.find((user) => user.id === id);
  let newCash = Number(user.cash) - Number(req.body.amount);
  if (!req.body.amount || !req.body.id) {
    res.status(400).json({
      code: 400,
      message: "Must provide an ID and amount to withdraw.",
    });
  }
  try {
    if (amount) {
      user.cash -= amount;
    }
    if (id) {
      user.id = id;
    }
    updateUser(user.id, user.name, newCash, user.credit); // deposit(req.body);
    res.json({
      message: "Success!",
      amount: req.body.amount,
      toAccountID: req.body.id,
      cash: newCash,
      Name: req.body.name,
      credit: req.body.credit,
    });
  } catch (err) {
    res.status(400).json({
      code: 400,
      message: err.message,
    });
  }
});

app.listen(9000, () => {
  console.log("server running");
});
