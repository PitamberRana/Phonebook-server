const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://p2:${password}@cluster010.qzwox.mongodb.net/phonebook?retryWrites=true&w=majority`;

const detailSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Detail = mongoose.model("Detail", detailSchema);
mongoose
  .connect(url)
  .then(() => {
    console.log("connected");

    // const detail = new Detail({
    //   name: " Hari Bahadur",
    //   number: 987654321,
    // });

    // return detail.save();
    const detail = Detail.find();
    return detail;
  })
  .then((result) => {
    result.forEach((x) => {
      console.log(x);
    });
    // console.dir(result);
    // console.log("detail saved!");
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));
