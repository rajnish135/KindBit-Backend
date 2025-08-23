export const faqData = {
  admin: [
    {
      question: "How do I know if a food item might be stale?",
      answer:
        "The system automatically flags older donations with a 'Might be stale' tag and a red dot. Admins can delete such items if not claimed within a safe window.",
    },
    {
      question: "What actions can an admin take on stale or suspicious donations?",
      answer:
        "Admins can delete stale food items and suspend the donor if needed. Both actions are available directly from the donation card.",
    },
    {
      question: "Can I suspend a donor or receiver manually?",
      answer:
        "Yes. Each donation card provides 'Suspend Donor' and 'Suspend Receiver' buttons to take action immediately.",
    },
    {
      question: "How is the donation status tracked?",
      answer:
        "Donations go through statuses: 'available' or 'deleted' → 'claimed' → 'picked'. Admins can monitor each status to ensure smooth handovers.",
    },
    {
      question: "Are donor and receiver emails visible?",
      answer:
        "Yes. Admins can view the donor and receiver email addresses in the donation cards to contact or take necessary actions.",
    },
    {
      question: "What does 'Delete This Stale Item' do?",
      answer:
        "This removes a donation marked stale from the system. It’s used when food is no longer safe or has passed the pickup window.",
    },
  ],
  donor: [
    {
      question: "How can I donate food?",
      answer:
        "Log in and go to the 'Donate' section, fill out the form with food details, upload a photo, and submit. Your donation will be listed as 'available' for nearby receivers.",
    },
    {
      question: "Is it necessary to upload a photo while donating?",
      answer:
        "Yes, adding a photo helps receivers understand what’s being offered and builds trust. It also improves visibility of your donation.",
    },
    {
      question: "What happens if no one claims my donation?",
      answer:
        "If a donation isn't claimed within a safe window (e.g., 24 hours), it will be flagged as 'Might be stale' and deleted by the admin.",
    },
    {
      question: "Can I track how many donations I’ve made?",
      answer:
        "Yes. Go to 'My Profile' or 'All Donations' to view your total donations and their status.",
    },
    {
      question: "Is my personal information shared with others?",
      answer:
        "Only your email is shared with the admin — never publicly.",
    },
    {
      question: "What kind of food can I donate?",
      answer:
        "You can donate freshly cooked food, packaged food, or surplus groceries. Avoid spoiled, expired, or half-eaten food.",
    },
  ],
  receiver: [
    {
      question: "How do I claim a food donation?",
      answer:
        "Tap the 'Claim' button on any available donation. The pickup location is visible before claiming so you can decide if it's convenient.",
    },
    {
      question: "Is there any cost to receive food?",
      answer:
        "No, all food donations are completely free of charge.",
    },
    {
      question: "Can I claim more than one food item at a time?",
      answer:
        "Yes, you can claim up to 3 items per day. Please be mindful not to hoard.",
    },
    {
      question: "Why can’t I see the donor's email or phone number?",
      answer:
        "To protect privacy, only location is shared. The system is designed so you can collect the food without personal communication.",
    },
    {
      question: "What should I do after receiving the food?",
      answer:
        "Click 'Mark as Received' and optionally leave a review to help the community.",
    },
  ],
};
