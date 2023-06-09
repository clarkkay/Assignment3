import { useState, useEffect } from "react";
import "./App.css";
function App() {
  const [product, setProduct] = useState([]);
  const [viewer1, setViewer1] = useState(false);
  const [viewer2, setViewer2] = useState(false);
  const [viewer4, setViewer4] = useState(false);
  const [oneProduct, setOneProduct] = useState([]);
  const [step, setStep] = useState(1);
  const [checked4, setChecked4] = useState(false);
  const [index, setIndex] = useState(0);
  //show all items
  const showAllItems = product.map((el) => (
    <div key={el._id}>
      <hr></hr>
      <img class="prodImg" src={el.image} width={100} alt="prod"/> <br />
      <p class="details">
      Title: {el.title} <br />
      Category: {el.category} <br />
      Price: {el.price} <br />
      Rate : {el.rating.rate} and Count: {el.rating.count} <br />
      </p>
    </div>
  ));
// new Product
  const [addNewProduct, setAddNewProduct] = useState({
    _id: 0,
    title: "",
    price: 0.0,
    description: "",
    category: "",
    image: "link",
    rating: { rate: 0.0, count: 0 },
  });

  const showOneItem = oneProduct.map((el) => (
    <div key={el._id}>
      <img class="prodImg"src={el.image} width={100} alt="prod"/> <br />
      <p class="details">
      Title: {el.title} <br />
      Category: {el.category} <br />
      Price: {el.price} <br />
      Rate : {el.rating.rate} and Count: {el.rating.count} <br />
      <br />
      </p>
      <div>
      <form onSubmit={handlePriceChangeSubmit}>
        <label>
          Product Price:
          <input
            type="text"
            name="price"
            value={product.price}
            onChange={handlePriceChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
    </div>
  ));

  function getAllProducts() {
    fetch("http://localhost:4000/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Show Catalog of Products :");
        console.log(data);
        setProduct(data);
      });
    setViewer1(!viewer1);
    setViewer2(false);
  }
  function getOneProduct(id) {
    console.log(id);
    if (id >= 1 && id <= 20) {
    setViewer2(!viewer2);
      fetch("http://localhost:4000/" + id)
        .then((response) => response.json())
        .then((data) => {
          console.log("Show one product :", id);
          console.log(data);
          const dataArr = [];
          dataArr.push(data);
          setOneProduct(dataArr);
        });
      setViewer2(!viewer2);
      setViewer1(false);
    } else {
      console.log("Wrong number of Product id.");
    }
}


  //newHandleChange trial
  function handleChange(evt) {
    const value = evt.target.value;
    if (step === 1) {
      if (evt.target.name === "_id") {
        setAddNewProduct({ ...addNewProduct, _id: value });
      } else if (evt.target.name === "title") {
        setAddNewProduct({ ...addNewProduct, title: value });
      }
    } else if (step === 2) {
      if (evt.target.name === "price") {
        setAddNewProduct({ ...addNewProduct, price: value });
      } else if (evt.target.name === "description") {
        setAddNewProduct({ ...addNewProduct, description: value });
      }
    } else if (step === 3) {
      if (evt.target.name === "category") {
        setAddNewProduct({ ...addNewProduct, category: value });
      } else if (evt.target.name === "image") {
        const temp = value;
        setAddNewProduct({ ...addNewProduct, image: temp });
      }
    }
  }
  //handlePriceChange trial
  const [newPrice, setNewPrice] = useState(0.0);
  function handlePriceChange(evt) {
    const value = evt.target.value;
    console.log(oneProduct, value);
    setNewPrice(value);
  }

  // handle on submit for price change
  function handlePriceChangeSubmit(e) {
    e.preventDefault();
    const newArr = {...oneProduct, rating: {...oneProduct.rating}};
    console.log("arr", newArr);
    newArr[0].price = newPrice;
    setOneProduct([newArr]);
    fetch("http://localhost:4000/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(oneProduct[0]),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Update price completed");
        console.log(data);
        if (data) {
          //const keys = Object.keys(data);
          const value = Object.values(data);
          alert(value);
        }
        setOneProduct([]);
      });
    console.log(oneProduct);
  }

  function submitPrev() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  function submitNext() {
    if (step < 3) {
      setStep(step + 1);
    }
  }


  function handleOnSubmit(e) {
    e.preventDefault();
    console.log(e.target.value);
    fetch("http://localhost:4000/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addNewProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post a new product completed");
        console.log(data);
        if (data) {
          //const keys = Object.keys(data);
          const value = Object.values(data);
          alert(value);
        }
        setAddNewProduct({});
        setStep(1);
      });
  }

  function getOneByOneProductNext() {
    if (product.length > 0) {
      if (index === product.length - 1) setIndex(0);
      else setIndex(index + 1);
      if (product.length > 0) setViewer4(true);
      else setViewer4(false);
    }
  }
  function getOneByOneProductPrev() {
    if (product.length > 0) {
      if (index === 0) setIndex(product.length - 1);
      else setIndex(index - 1);
      if (product.length > 0) setViewer4(true);
      else setViewer4(false);
    }
  }
  function deleteOneProduct(deleteid) {
    console.log("Product to delete :", deleteid);
    fetch("http://localhost:4000/delete/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: deleteid }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Delete a product completed : ", deleteid);
        console.log(data);
        if (data) {
          //const keys = Object.keys(data);
          const value = Object.values(data);
          alert(value);
        }
      });
    setChecked4(!checked4);
  }

  useEffect(() => {
    getAllProducts();
  }, []);
  useEffect(() => {
    getAllProducts();
  }, [checked4]);

  return (
    <div>
      <h1 class="title">Catalog of Products</h1>
      <div class="search">
        <h1>Search:</h1>
        <input
          type="text"
          id="message"
          name="message"
          placeholder="id"
          onChange={(e) => getOneProduct(e.target.value)}
        />
        <hr></hr>
      </div>
      <hr></hr>
      <div class="body">
      <div id="allProd">
        <h3>Show all available Products.</h3>
        <button id="getAllButton" onClick={() => getAllProducts()}>Show All products</button>
        {viewer1 && <div>{showAllItems}</div>}
        {viewer2 && <div>{showOneItem}</div>}
        <hr></hr>
      </div>

      <div id="addNew">
        <h3>Add New Product</h3>
        <form onSubmit={handleOnSubmit}>
          {step === 1 && (
            <div>
              <label>
                Product ID:
                <input
                  type="text"
                  name="_id"
                  value={addNewProduct._id}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Product Title:
                <input
                  type="text"
                  name="title"
                  value={addNewProduct.title}
                  onChange={handleChange}
                />
              </label>
              <br />
              <button onClick={() => submitNext()}>Next</button>
            </div>
          )}
          {step === 2 && (
            <div>
              <label>
                Product Price:
                <input
                  type="text"
                  name="price"
                  value={addNewProduct.price}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Product Description:
                <textarea
                  name="description"
                  value={addNewProduct.description}
                  onChange={handleChange}
                />
              </label>
              <br />
              <button onClick={() => submitPrev()}>Prev</button>
              <button onClick={() => submitNext()}>Next</button>
            </div>
          )}
          {step === 3 && (
            <div>
              <label>
                Product Category:
                <input
                  type="text"
                  name="category"
                  value={addNewProduct.category}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Product Image URL:
                <input
                  type="text"
                  name="image"
                  value={addNewProduct.image}
                  onChange={handleChange}
                />
              </label>
              <br />
              <button onClick={() => submitPrev()}>Prev</button>
              <button type="submit">Submit</button>
            </div>
          )}
        </form>
      </div>
      <hr></hr>
      <div id="delete">
        <h3>Delete one product:</h3>
        <input
          type="checkbox"
          id="acceptdelete"
          name="acceptdelete"
          checked={checked4}
          onChange={(e) => setChecked4(!checked4)}
        />
        <button onClick={() => getOneByOneProductPrev()}>Prev</button>
        <button onClick={() => getOneByOneProductNext()}>Next</button>
        <button onClick={() => deleteOneProduct(product[index]._id)}>
          Delete
        </button>
        {checked4 && (
          <div key={product[index]._id}>
            <img src={product[index].image} width={30} /> <br />
            Id:{product[index]._id} <br />
            Title: {product[index].title} <br />
            Category: {product[index].category} <br />
            Price: {product[index].price} <br />
            Rate :{product[index].rating.rate} and Count:
            {product[index].rating.count} <br />
          </div>
        )}
      </div>
    </div>
    </div>
  ); // return end
} // App end
export default App;

{/* <input type="text" value={price} onChange={(e)=> {setPrice(e)}} /> */}
{/* <button onClick={update}> */}