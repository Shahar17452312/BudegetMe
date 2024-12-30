import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HamburgerMenu from '../components/HamburgerMenu';
import '../assets/styles/home.css';
import axios from 'axios';

function Home() {
  const id = localStorage.getItem("user_id");
  const token = localStorage.getItem("accesstoken");
  const name = localStorage.getItem("user_name");

  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const budgetResponse = await axios.get(`http://localhost:8080/user/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBudget(budgetResponse.data.amount);
        try{
          const expensesResponse = await axios.get(`http://localhost:8080/expenses/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
  
          console.log(budgetResponse.data);
  
          let remainingBudget = budgetResponse.data.amount;
          const updatedChartData = [];
  
          const expensesData = expensesResponse.data.expenses.map(element => {
            console.log(typeof(element.date));
            remainingBudget -= element.amount;
            element.date = element.date.slice(0, 10);
  
            const month = new Date(element.date).toLocaleString('en-US', { month: 'long' });
            const existingEntry = updatedChartData.find(entry => entry.month === month);
            
            if (existingEntry) {
              existingEntry.expenses += element.amount;
            } else {
              updatedChartData.push({ month, expenses: element.amount });
            }
  
            return element;
          });
  
          expensesData.sort((a,b)=>{
            var dateOfA = new Date(a.date); // החודש ב-JavaScript מתחיל מ-0 (ינואר הוא 0)
            var dateOfB=new Date(b.date);
  
            return dateOfA-dateOfB;
  
  
          });
  
          // מיין את החודשים בסדר כרונולוגי
          const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          updatedChartData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
  
  
          setChartData(updatedChartData);
          setExpenses(expensesData);
          setBudget(remainingBudget);
        }
        catch(error){
          console.log(error.message);
        }

      } 
      
      
      catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [update]);

  const addExpense = async () => {
    // בודק אם יש נתונים חסרים
    if (!id || !amount || !description || !category || !date) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // שולח את ההוצאה ל-API לעדכון
      await axios.post(`http://localhost:8080/expenses/addExpense/${id}`, {
        user_id: id,
        amount: parseFloat(amount),
        description,
        category,
        date
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // עדכון נתוני ההוצאות בטבלה ובגרף
      const newExpense = { amount: parseFloat(amount), description, category, date };
      const expensesToSort=[...expenses,newExpense];
   
      setExpenses(expensesToSort);

      const month = new Date(date).toLocaleString('en-US', { month: 'long' });
      const existingEntry = chartData.find(entry => entry.month === month);
      if (existingEntry) {
        existingEntry.expenses += parseFloat(amount);
      } else {
        setChartData([...chartData, { month, expenses: parseFloat(amount) }]);
      }

      // עדכון התקציב הנותר
      setBudget(budget - parseFloat(amount));
      
      // איפוס השדות
      setAmount('');
      setDescription('');
      setCategory('');
      setDate('');

      // עדכון הסטייט של הוצאות
      setUpdate(!update);

    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="home-container">
      <HamburgerMenu />
      <div className="greeting-container">
        <h1 className="greeting-title">Hello, {name}!</h1>
        <p className="site-description">Welcome to our site! Here you can find useful information and perform many actions.</p>
      </div>

      <div className="graph-container">
        <h2>Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="expenses" stroke="#4CAF50" fill="#4CAF50" />
          </LineChart>
        </ResponsiveContainer>
      </div>

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

        {budget>0? <h1>Your current budget is {budget}</h1>:<h1  style={{backgroundColor:"red"}}> your current budget is {budget}</h1>}
        {budget > 0 ? <h2>Great job!</h2> : <h2>You need to save money.</h2>}

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
