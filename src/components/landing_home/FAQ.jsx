import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const faqs = [
  {
    question: 'What is EduNova?',
    answer: 'EduNova is an AI-powered learning platform offering personalized education across various disciplines.',
  },
  {
    question: 'How are courses validated?',
    answer: 'Courses are peer-reviewed and AI-assessed to ensure quality and alignment with learning goals.',
  },
  {
    question: 'How is my subscription used?',
    answer: 'Subscriptions fund AI infrastructure, content development, and educator incentives.',
  },
  {
    question: 'How can I track my learning progress?',
    answer: 'Through your dashboard, with real-time metrics on completion, mastery, and milestones.',
  },
  {
    question: 'What is the Mentor’s Commitment?',
    answer: 'A promise by our mentors to guide, inspire, and support learners across their journeys.',
  },
  {
    question: 'Can I choose specific mentors or learning paths?',
    answer: 'Yes, EduNova allows tailored mentor selection and custom learning tracks.',
  },
];

const EduNovaFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-4/5  mx-auto p-4 mb-6">
        <h1 className=" font-bold mb-4 headline">Frequently Asked Questions</h1>
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-gray-300 py-4">
          <div
            onClick={() => toggle(index)}
            className="flex justify-between items-center cursor-pointer"
          >
            <h3 className="text-lg font-medium">{faq.question}</h3>
            {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
          </div>
          {openIndex === index && (
            <p className="mt-2 text-gray-600">{faq.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default EduNovaFAQ;
