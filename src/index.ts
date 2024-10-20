import Express from "express";
import Medicine from "./router/medicine.router";
import Admin from "./router/admin.router";
import Transaction from "./router/transaction.router";
const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use("/Medicine", Medicine);
app.use("/Admin", Admin);
app.use("/Transaction", Transaction);

app.listen(3000, () => {
  console.log("listen on port 3000 | http://localhost:3000");
});

