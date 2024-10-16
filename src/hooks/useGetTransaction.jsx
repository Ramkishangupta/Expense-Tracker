import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase-config";
import useGetUserInfo from "./useGetUserInfo";

const useGetTransaction = () => {
    const [transactions, setTransactions] = useState([]);
    const { userId } = useGetUserInfo(); // Ensure userId is fetched correctly
    const [transactionTotals, setTransactionTotals] = useState({
        balance: 0.0,
        income: 0.0,
        expenses: 0.0,
    });

    const getTransaction = async () => {
        if (!userId) {
            // Ensure userId is defined before proceeding
            console.error("User ID is undefined. Cannot fetch transactions.");
            return;
        }

        try {
            const transactionCollectionRef = collection(db, "transactions");
            const queryTransactions = query(
                transactionCollectionRef,
                where("userID", "==", userId),  // Only run this if userId is defined
                orderBy("createdAt")
            );

            const unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
                let docs = [];
                let totalIncome = 0.0;
                let totalExpenses = 0.0;

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    docs.push({ ...data, id });

                    if (data.transactionType === "expense") {
                        totalExpenses += Number(data.transactionAmount);
                    } else if (data.transactionType === "income") {
                        totalIncome += Number(data.transactionAmount);
                    }
                });

                const balance = totalIncome - totalExpenses;
                setTransactions(docs);
                setTransactionTotals({
                    balance,
                    income: totalIncome,
                    expenses: totalExpenses,
                });
            });

            return () => unsubscribe();
        } catch (err) {
            console.error("Error fetching transactions:", err);
        }
    };

    useEffect(() => {
        if (userId) {
            // Run the query only when userId is available
            getTransaction();
        }
    }, [userId]); // Dependency array includes userId

    return { transactions, transactionTotals };
};

export default useGetTransaction;
