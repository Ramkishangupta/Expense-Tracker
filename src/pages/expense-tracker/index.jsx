import useAddTransaction from "../../hooks/useAddTransactions";
import useGetTransaction from "../../hooks/useGetTransaction";
import useGetUserInfo from "../../hooks/useGetUserInfo";
import useGenerateExcelAndClearData from "../../hooks/generateExcelFile"; // Import the hook
import { useState } from "react";
import "./style.css";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";

const ExpenseTracker = () => {
  const { addTransaction } = useAddTransaction();
  const { transactions, transactionTotals } = useGetTransaction();
  const { generateAndClearData } = useGenerateExcelAndClearData(transactions); // Use the hook
  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const { userName } = useGetUserInfo();
  const { balance, expenses, income } = transactionTotals;
  const navigate = useNavigate();

  // Add transaction submission handler
  const onSubmit = async (e) => {
    e.preventDefault();
    await addTransaction({
      description,
      transactionAmount: parseFloat(transactionAmount) || 0,
      transactionType,
    });

    setDescription("");
    setTransactionAmount("");
    setTransactionType("expense");
  };

  // Sign-out handler
  const signUserOut = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/Expense-Tracker/"); // Navigate to the login or home page
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  return (
    <div className="container1">
      <div className="expense-tracker">
        <div className="container">
          <h1>Expense Tracker</h1>
          <h3>{userName}</h3>
          <div className="balance">
            <h3>Current balance</h3>
            <h2>{balance}₹</h2>
          </div>
          <div className="summary">
            <div className="income">
              <h4>Income</h4>
              <p>{income}₹</p>
            </div>
            <div className="expenses">
              <h4>Expenses</h4>
              <p>{expenses}₹</p>
            </div>
          </div>
          <form className="add-transaction" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              onChange={(e) => setTransactionAmount(parseFloat(e.target.value))}
              value={transactionAmount}
              required
            />
            <div className="flex flex-col">
              <div>
                <input
                  type="radio"
                  id="expense"
                  name="type"
                  value="expense"
                  checked={transactionType === "expense"}
                  onChange={(e) => setTransactionType(e.target.value)}
                  required
                />
                <label htmlFor="expense">Expense</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="income"
                  name="type"
                  value="income"
                  checked={transactionType === "income"}
                  onChange={(e) => setTransactionType(e.target.value)}
                  required
                />
                <label htmlFor="income">Income</label>
              </div>
            </div>
            <button type="submit">Add Transaction</button>
          </form>
          {/* Button to generate Excel file and clear data */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
            className="items-end"
          >
            <button
              onClick={generateAndClearData}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "6px 12px",
                fontSize: "14px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Generate Excel
            </button>
            <button
              onClick={signUserOut}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                padding: "6px 12px",
                fontSize: "14px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <div className="exp1">
        {transactions.length > 0 ? (
          <>
            <h3>Transaction History</h3>
            <ul className="transaction-history">
              {transactions.map((transaction) => {
                const { id, description, transactionAmount, transactionType } =
                  transaction;
                return (
                  <li
                    key={id}
                    className={`transaction-type-${transactionType}`}
                  >
                    <h4>{description}</h4>
                    <p>
                      {transactionAmount.toFixed(2)}₹
                      <label className={`label-${transactionType}`}>
                        {transactionType}
                      </label>
                    </p>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>
            No Transactions
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
