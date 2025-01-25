import  { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import axios from "axios";
import "../../public/styles/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const pages = ["Home", "Edit profile"];
  const id = localStorage.getItem("id");
  const [rows, setRows] = useState([]);
  var [accesstoken,SetAccesstoken]= useState(sessionStorage.getItem("accessToken"));
  const refreshToken=sessionStorage.getItem("refreshToken");
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();
  const [newTransaction, setNewTransaction] = useState({
    date_of_creation: "",
    category: "",
    description: "",
    amount: "",
  });

  const [expensesByMonths,setExpensesByMonths] = useState(
    [
      { month: 1, expenses: 0 },
      { month: 2, expenses: 0 },
      { month: 3, expenses: 0 },
      { month: 4, expenses: 0 },
      { month: 5, expenses: 0 },
      { month: 6, expenses: 0 },
      { month: 7, expenses: 0 },
      { month: 8, expenses: 0 },
      { month: 9, expenses: 0 },
      { month: 10, expenses: 0 },
      { month: 11, expenses: 0 },
      { month: 12 ,expenses: 0 }
    ]
  );

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (event) => {
    navigate("/" + event.target.innerText.toLowerCase().replace(/\s+/g, "-"));
    setAnchorElNav(null);
  };

  useEffect(() => {

    const fetch=async()=>{
      var response;
      try {
       response= await axios.get("http://localhost:3000/expense/" + id, {
            headers: {
              Authorization: "Bearer " + accesstoken,
            },
          });

          var dataAfterDateEdit=response.data.map((expense)=>{
            var date=expense.date_of_creation.slice(0,10);
            return {
              ...expense,
              date_of_creation:date
            }
          });
          dataAfterDateEdit.forEach((expense)=>{
            const month=parseInt(expense.date_of_creation.slice(6,7));
            setExpensesByMonths((prev)=>{
              const newArray=[...prev];
              newArray[month-1].expenses+=parseInt(expense.amount);
              return newArray
            })  
            console.log(expense.amount)
          })
          setRows(dataAfterDateEdit);
       

          console.log(expensesByMonths);
            
      } catch (error) {
        console.log(error);
        if(error.response.status===401){
           try{
              const newAccessToken=await axios.post("http://localhost:3000/auth/refresh-token",{
                refreshToken:refreshToken
              });

              console.log(newAccessToken);
              sessionStorage.setItem("accessToken",newAccessToken.data.accessToken);
              SetAccesstoken(sessionStorage.getItem("accessTokn"));

              try{
                response= await axios.get("http://localhost:3000/expense/" + id, {
                  headers: {
                    Authorization: "Bearer " + accesstoken,
                  },
                });
                  if (response.status === 200) {
                    console.log( response.data);
                    setRows(response.data);
                  }
              }
              catch(e){
                console.log(e.message);
              }
           }
           
           catch(e){
            console.log(e.message);
           }

        }

      }
    }

    fetch();
    
  },[]);

  const handleInputChange = (e) => {
    setNewTransaction({
      ...newTransaction,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTransaction = () => {
    // שליחה לשרת להוסיף את ההוצאה
    axios
      .post(
        "http://localhost:3000/expense/"+id,
        newTransaction,
        {
          headers: {
            Authorization: "Bearer " + accesstoken,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(rows);
          setRows([...rows, newTransaction]);
          setNewTransaction({ date_of_creation: "", category: "", description: "", amount: "" }); // ניקוי השדות
        }
      })
      .catch((error) => {
        console.error("Error adding transaction:", error);
      });
  };

 


  return (
    <div className="home-container" style={{ backgroundColor: "#e0f7fa" }}>
      <AppBar>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page) => (
                  <MenuItem data-name={page} key={page} onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <IconButton sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <div style={{ textAlign: "center", marginTop: "150px" }}>
        <h1>expneses by month ({new Date().getFullYear()})</h1>
        <BarChart
          width={600}
          height={400}
          data={expensesByMonths}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="expenses" fill="#8884d8" name="expenses" />
        </BarChart>
        <h2 style={{ marginTop: "50px", color: "black" }}>Transactions</h2>
        <TableContainer component={Paper} style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Money</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date_of_creation}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Form to add a new transaction */}
        <div style={{ marginTop: "30px" }}>
          <h3>Add Transaction</h3>
          <input
            type="date"
            name="date_of_creation"
            value={newTransaction.date}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="category"
            value={newTransaction.category}
            onChange={handleInputChange}
            placeholder="Category"
          />
          <input
            type="text"
            name="description"
            value={newTransaction.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <input
            type="number"
            name="amount"
            value={newTransaction.money}
            onChange={handleInputChange}
            placeholder="Money"
          />
          <button onClick={handleAddTransaction}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
