import { faqData } from "./faqData.js";

// Combine all FAQs into one array
const allFaqs = [
  ...faqData.admin,
  ...faqData.donor,
  ...faqData.receiver,
];

// Function to find the best answer
export function findFaqAnswer(userQuery) {
  const query = userQuery.toLowerCase();

  for (const faq of allFaqs) {
    const q = faq.question.toLowerCase();
    // If query contains part of FAQ question keywords → return answer
    if (query.includes(q) || q.includes(query)) {
      return faq.answer;
    }
  }

  return null; // No match found
}
