// app.patch("/users/:id", (req, res) => {
//     const users = loadUsers();
//     let { name, credit, cash } = req.body;
//     let id = req.params.id;
//     let userIdFind = users.find((user) => user.id === id);
//     if (!userIdFind) {
//       res.status(404).json({ message: "no user with specific id" });
//     }
//     if (name) {
//       userIdFind.name = name;
//     }
//     if (cash) {
//       userIdFind.cash = cash;
//     }
//     if (credit) {
//       userIdFind.credit = credit;
//     }
//     res.send(userIdFind);
//   });
