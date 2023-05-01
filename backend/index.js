const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const Product = require("./dataSchema");
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/reactdata",
    {
        dbName: "reactdata",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);
const port = process.env.PORT || 4000;
const host = "localhost";

app.get("/", async (req, resp) => {
    const query = {};
    const allProducts = await Product.find(query);
    console.log(allProducts);
    resp.send(allProducts);
});

app.get("/:id", async (req, resp) => {
    const id = req.params.id;
    const query = { _id: id };
    const oneProduct = await Product.findOne(query);
    console.log(oneProduct);
    resp.send(oneProduct);
});


app.delete("/delete", async (req, res) => {
    const p_id = req.body._id;
    console.log("Delete :", req.body);
    try {
        const query = { _id: p_id };
        await Product.deleteOne(query);
        const messageResponse = {
            message: `Product ${p_id} deleted correctly`,
        };
        res.send(JSON.stringify(messageResponse));
    } catch (err) {
        console.log("Error while deleting :" + p_id + " " + err);
    }
});

app.post("/insert", async (req, res) => {
    console.log(req.body);
    const p_id = req.body._id;
    const ptitle = req.body.title;
    const pprice = req.body.price;
    const pdescription = req.body.description;
    const pcategory = req.body.category;
    const pimage = req.body.image;
    const prate = req.body.rating.rate;
    const pcount = req.body.rating.count;
    const formData = new Product({
        _id: p_id,
        title: ptitle,
        price: pprice,
        description: pdescription,
        category: pcategory,
        image: pimage,
        rating: { rate: prate, count: pcount },
    });
    try {
        // await formData.save();
        await Product.create(formData);
        const messageResponse = { message: `Product ${p_id} added correctly` };
        res.send(JSON.stringify(messageResponse));
    } catch (err) {
        console.log("Error while adding a new product:" + err);
    }
});

app.post("/update", async (req, res) => {
    const p_id = req.body._id;
    try {
        const query = { _id: req.body._id};
        await Product.updateOne(query);
        const messageResponse = {
            message: `Product ${p_id} price changed`,
        };
        res.send(JSON.stringify(messageResponse));
    } catch (err) {
        console.log("Error while changing :" + p_id + " " + err);
    }
});

//New update post 
app.put("/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: id };
    const { price } = req.body;

    try {
        const updatedProduct = await Product.findOneAndUpdate(
            query,
            { price },
            { new: true }
        );

        const messageResponse = {
            message: `Product ${id} price updated successfully`,
            data: updatedProduct,
        };
        res.send(JSON.stringify(messageResponse));
    } catch (err) {
        console.log(`Error while updating product ${id} price: ${err}`);
        res.status(500).send("Error while updating product price");
    }
});



app.listen(port, () => {
    console.log(`App listening at http://%s:%s`, host, port);
});
