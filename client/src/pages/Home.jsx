import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useTable } from "react-table";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Home() {
  const [userData, setUserData] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ amount: "", description: "", category: "", currentBudget: "" });

  useEffect(() => {
    setUserData({
      name: "Shahar",
      email: "shahar@example.com",
      budget: 5000,
    });

    setExpenses([
      { amount: 200, description: "Gas", category: "Transport", currentBudget: 1000 },
      { amount: 300, description: "Food", category: "Groceries", currentBudget: 1000 },
      { amount: 150, description: "Entertainment", category: "Leisure", currentBudget: 1000 },
    ]);
  }, []);

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Expenses",
        data: [200, 300, 250, 400, 350, 500, 600],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  const columns = React.useMemo(
    () => [
      { Header: "Amount", accessor: "amount" },
      { Header: "Description", accessor: "description" },
      { Header: "Category", accessor: "category" },
      { Header: "Current Budget", accessor: "currentBudget" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: expenses,
  });

  const addExpense = () => {
    if (newExpense.amount && newExpense.description && newExpense.category && newExpense.currentBudget) {
      setExpenses([...expenses, newExpense]);
      setNewExpense({ amount: "", description: "", category: "", currentBudget: "" });
    } else {
      alert("Please fill all the fields");
    }
  };

  return (
    <div className="home-container">
      <div className="user-info">
        <h1>Hello, {userData.name}</h1>
        <p>Email: {userData.email}</p>
        <p>Budget: {userData.budget}</p>
      </div>

      <div className="chart-container">
        <h2>Monthly Expenses</h2>
        <Line data={chartData} />
      </div>

      <div className="table-container">
        <h2>Expenses Table</h2>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} key={column.id}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} key={cell.column.id}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="add-expense-form">
          <h3>Add New Expense</h3>
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          />
          <input
            type="number"
            placeholder="Current Budget"
            value={newExpense.currentBudget}
            onChange={(e) => setNewExpense({ ...newExpense, currentBudget: e.target.value })}
          />
          <button onClick={addExpense}>Add Expense</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
