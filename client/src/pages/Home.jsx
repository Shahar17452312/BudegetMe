import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HamburgerMenu from '../components/HamburgerMenu';
import '../assets/styles/home.css';
import axios from 'axios';

function Home() {
  // Example data for expenses


  const data = [
    { month: 'January', expenses: 300 },
    { month: 'February', expenses: 400 },
    { month: 'March', expenses: 200 },
    { month: 'April', expenses: 500 },
    { month: 'May', expenses: 450 },
    { month: 'June', expenses: 600 },
    { month: 'July', expenses: 550 },
  ];
  const id=localStorage.getItem("user_id");
  const token=localStorage.getItem("accesstoken");
  const name=localStorage.getItem("user_name");
  
  const [expenses, setExpenses] = useState([]);

  // State for form inputs
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [budget,setBudget]=useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // בקשה ראשונה לקבלת התקציב
        const budgetResponse = await axios.get(`http://localhost:8080/user/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // בקשה שנייה לקבלת ההוצאות
        const expensesResponse = await axios.get(`http://localhost:8080/expenses/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setBudget(budgetResponse.data.amount);

        var amount=budgetResponse.data.amount;
        // עדכון הוצאות לאחר חיתוך התאריך
        const expensesData = expensesResponse.data.expenses.map(element => {
          console.log(element.amount);
          amount-=element.amount;
          element.date = element.date.slice(0, 10); // חיתוך התאריך
          return element;
        });

        setExpenses(expensesData);
        setBudget(amount);

      } catch (error) {
        console.log("error");
        console.log(error.message);
      }
    };

    fetchData();
  },[]); // תשתנה כאשר id או token משתנים





  // Handler for adding a new expense
  const addExpense = () => {
    if(!id||!amount||!description||!category||!date){
      alert("not all details entered");
      return;
    }
    try{
      axios.post("http://localhost:8080/expenses/addExpense/"+id,{
        user_id:id,
        amount:amount,
        description:description,
        category:category,
        date:date
      },{
        headers:{
          'Authorization': "Bearer " + token  // הוספת הטוקן בהצלחה

        }
      }).then(()=>{
          setExpenses([
            ...expenses,
            { amount: parseFloat(amount), description, category, date },
          ]);
          setAmount('');
          setDescription('');
          setCategory('');
          setDate('');
          setBudget(budget-amount);
        
      });
    }
    catch(error){
      console.log(error.message);
    }
    



   
  };

  return (
    <div className="home-container">
      <HamburgerMenu />
      <div className="greeting-container">
        <h1 className="greeting-title">Hello, {name}!</h1>
        <p className="site-description">Welcome to our site! Here you can find useful information and perform many actions.</p>
      </div>

      {/* Graph Section */}
      <div className="graph-container">
        <h2>Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="expenses" stroke="#4CAF50" fill="#4CAF50" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expense Table Section */}
      <div className="table-container">
        <h2>Expenses</h2>
        <table className="expense-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.amount} ₪</td>
                <td>{expense.description}</td>
                <td>{expense.category}</td>
                <td>{expense.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h1>your current budget is {budget}</h1>
        {budget>0?<h2>great job</h2>:<h2>you need to save money</h2>}
        {/* Form for adding new expense */}
        <div className="expense-form">
          <h3>Add a New Expense</h3>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
             lang="en"
          />
          <button onClick={addExpense}>Add Expense</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
