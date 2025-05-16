 import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter , Route,Routes} from 'react-router-dom';
import './App.css'
import './index.css'
import Cart from './components/Cart'
import NavBar from './components/NavBar'
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import About from './pages/About';
import NotFound from './pages/NotFound';
import AboutCompany from './pages/AboutCompany';
import AboutPeople from './pages/AboutPeople';
import Countries from './pages/Countries';
import AddProduct from './pages/AddProduct';
import Menu from './pages/Menu';
import axios from 'axios';
import getArrayFromNum from './utils/getArrayFromNum';
function App() {
  // const [count, setCount] = useState(0)
    const [items, setItems] = useState([
        // {id: 0 , name:"Burger", count:0},
        // {id: 1, name:'Fries', count:0},
        // {id: 2 , name:'Water', count:0},
    ]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(()=>{
      const fetchProducts = async ()=>{
        const {data} = await axios.get("http://localhost:3000/products");
        setItems(data);
        console.log(data)
      };
      const fetchCategories = async ()=>{
        const {data} = await axios.get("http://localhost:3000/categories");
        setCategories([{ id: 0, name: "All" }, ...data]);
        console.log(data)
      };
      fetchProducts();
      fetchCategories();
    },[]);
    
    const handReset = ()=>{
        const newItems = items.map((item)=>({...item, count:0}));
        setCartItems(newItems);
    }
    const handleincrement = (id) => {
      const updatedItems = items.map((item) => {
          if (item.id === id) {const newCount = item.count + 1;
              return {...item,count: newCount,isInCart: true};
          }
          return item;
      });
  
      setItems(updatedItems);
      setCartItems(updatedItems.filter((item)=>item.count > 0));
  };
  

    const handledecrement = (id) => {
      const updatedItems = items.map((item)=>{
        if (item.id === id) {const newCount = item.count > 0 ? item.count - 1 : 0;
              return {...item,count: newCount,isInCart: newCount > 0};}
          return item;
      });
      setItems(updatedItems);
      setCartItems(updatedItems.filter((item)=>item.count > 0));
  };
     


  const toggleInCart = (id) => {
      const newItems = items.map((itm) =>
          itm.id === id ? { ...itm, isInCart: !itm.isInCart, count:!itm.isInCart?1:0 } : itm
      );
      setCartItems(newItems);
      setItems(newItems);
    };
    
    const handleSearchChange = (e) => {
      e.preventDefault();
      
      const lowerCase = e.target.value.toLowerCase();
      setSearchInput(lowerCase);
    };
    
    //filtering
    const handleSelectedCategory = (id) => {setSelectedCategory(id); setCurrentPage(1);}
    let filteredItems = selectedCategory? items.filter(item => item.category === selectedCategory): items;
    const handleCurrentPage = (id) => setCurrentPage(id);

    //searching
    filteredItems=filteredItems.filter((itm) => itm.name.toLowerCase().includes(searchInput));

    //pagination
    const pageSize=5;
    const noOfPages=Math.ceil(filteredItems.length/pageSize);
    const pages=getArrayFromNum(noOfPages);
 
    const start=(currentPage-1)*pageSize;
    const end = start+pageSize;
    filteredItems=filteredItems.slice(start,end);

  return (
    // <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
    <>
    <BrowserRouter>
    <NavBar noOfItemInCart={items.reduce((sum,item)=>sum+item.count,0)}/>
    <Routes>
      <Route path ="/" element ={<Home/>}/>
      <Route path ="/cart" element ={<CartPage items = {/*items.filter((itm)=>itm.isInCart)*/ cartItems.filter((itm)=>itm.isInCart)} handReset = {handReset} handleincrement={handleincrement}  handledecrement={handledecrement} />}/>
      <Route path ="/countries" element ={<Countries/>}/>
      <Route path ="/menu" element ={<Menu pages = {pages} items = {filteredItems} categories = {categories} toggleInCart={toggleInCart} selectedCategory={selectedCategory} handleSelectedCategory={handleSelectedCategory} currentPage={currentPage} handleCurrentPage = {handleCurrentPage} handleSearchChange={handleSearchChange} searchInput={searchInput}/>}/>
      <Route path ="/about" element ={<About/>}>
        <Route path ="company" element={<AboutCompany/>}/>
        <Route path ="people" element={<AboutPeople/>}/>
      </Route>
      <Route path ="/add-product" element ={<AddProduct/>}/>
      <Route path ="*" element ={<NotFound/>}/>

    </Routes>
    </BrowserRouter>
    </>
  )
}
export default App
