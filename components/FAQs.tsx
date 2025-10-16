'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const faqData = {
  Brand: [
    { id: 1, question: 'What is Epiclinx?', answer: 'Epiclinx is a platform to connect creators and opportunities.' },
    { id: 2, question: 'How to join?', answer: 'You can sign up using your email and start instantly.' },
    { id: 3, question: 'Is it free?', answer: 'Yes, we offer a free plan with amazing features.' },
    { id: 4, question: 'How do I become a creator?', answer: 'Just switch to creator mode in your dashboard.' },
    { id: 5, question: 'Where is Epiclinx based?', answer: 'We are a global team with headquarters in the cloud.' },
  ],
  Creator: [
    { id: 1, question: 'How to earn as a creator?', answer: 'Creators earn by collaborating with brands.' },
    { id: 3, question: 'Is there a fee for creators?', answer: 'We take a small platform fee from your earnings.' },
  ],
  Other: [
    { id: 2, question: 'Do I need to be verified?', answer: 'Verification helps boost credibility but not required.' },
    { id: 4, question: 'Can I use it on mobile?', answer: 'Yes, Epiclinx is fully responsive and mobile-friendly.' },
  ],
}

const FAQs = () => {
  const [activeTab, setActiveTab] = useState('Brand')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* FAQ Section */}
      <div className="mx-auto max-w-7xl px-6 max-md:px-0 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>

        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full max-md:justify-between bg-[#424242] p-1">
            {['Brand', 'Creator', 'Other'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setOpenIndex(null) // reset accordion
                }}
                className={`rounded-full px-4 py-1 text-sm font-normal ${
                  activeTab === tab ? 'bg-[#00e0ca] text-black' : 'text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-3xl min-h-[300px] space-y-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {faqData[activeTab].map((item, index) => (
                <div key={item.id} className="rounded-3xl bg-[#424242] px-6 py-4">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="flex w-full items-center justify-between"
                  >
                    <p className="text-sm font-medium text-left">{item.question}</p>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#313131] text-white">
                      <span className="text-lg font-light leading-none">
                        {openIndex === index ? '−' : '+'}
                      </span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mt-2 text-sm text-white">{item.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default FAQs
