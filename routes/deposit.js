// import express from "express";

// const depRouter = express.Router();

// depRouter.use(express.json());
// depRouter.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

// depRouter.put("/deposit", function (req, res) {
//   const users = loadUsers();
//   let id = req.body.id;
//   const user = users.find((user) => user.id === id);
//   let newCash = user.cash + req.body.amount;
//   if (!req.body.amount || !req.body.id) {
//     res.status(400).json({
//       code: 400,
//       message: "Missing params! must provide accountID and amount to deposit.",
//     });
//   }
//   try {
//     // deposit(req.body);
//     res.json({
//       message: "Success!",
//       amount: req.body.amount,
//       toAccountID: req.body.id,
//       cash: newCash,
//     });
//   } catch (err) {
//     res.status(400).json({
//       code: 400,
//       message: err.message,
//     });
//   }
// });

// export default depRouter;
