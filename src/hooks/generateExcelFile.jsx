import { deleteDoc, doc } from "firebase/firestore";
import { writeFile, utils } from "xlsx";
import { db } from "../config/firebase-config";

const useGenerateExcelAndClearData = (transactions) => {
  const generateAndClearData = async () => {
    if (!transactions || transactions.length === 0) {
      console.warn("No transactions to export.");
      return;
    }

    // Step 1: Prepare data for Excel
    const transactionData = transactions.map((transaction) => ({
      DateTime: transaction.createdAt.toDate().toLocaleString(), // Assuming createdAt is a Firestore Timestamp
      Description: transaction.description,
      TransactionAmount: transaction.transactionAmount,
      TransactionType: transaction.transactionType,
    }));

    // Step 2: Create a worksheet and workbook
    const worksheet = utils.json_to_sheet(transactionData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Step 3: Generate and save the Excel file
    const fileName = `Transactions-${new Date().toISOString().slice(0, 10)}.xlsx`;
    writeFile(workbook, fileName);

    // Step 4: Delete data from Firebase
    try {
      const deletePromises = transactions.map((transaction) =>
        deleteDoc(doc(db, "transactions", transaction.id))
      );

      await Promise.all(deletePromises);
      console.log("All transactions have been deleted from Firebase.");
    } catch (error) {
      console.error("Error deleting transactions:", error);
    }
  };

  return { generateAndClearData };
};

export default useGenerateExcelAndClearData;
