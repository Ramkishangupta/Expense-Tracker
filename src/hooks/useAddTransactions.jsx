import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import useGetUserInfo from "./useGetUserInfo"; // Follow camelCase convention
import { db } from "../config/firebase-config";

const useAddTransaction = () => {
    const transactionCollectionRef = collection(db, "transactions");
    const { userId } = useGetUserInfo();

    const addTransaction = async ({ description, transactionType, transactionAmount }) => {
        try {
            await addDoc(transactionCollectionRef, {
                userID: userId,
                description: description,
                transactionAmount: transactionAmount,
                transactionType: transactionType,
                createdAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error adding transaction:", err);
        }
    };

    return { addTransaction };
};

export default useAddTransaction;
