import React from 'react'

const Numbers = () => {
  const stats = [
    { number: '1,200', label: 'Jobs posted by growing brands' },
    { number: '2,100', label: 'Projects completed  and counting' },
    { number: '4,400', label: 'Epiclinx created' },
  ]

  return (
    <div className="max-w-7xl mx-auto text-white py-20 px-4 text-center">
      <p className="uppercase text-sm text-gray-100 mb-6 tracking-wide">
        Join the the other 500+ creators that have been linked with brands
      </p>
      <div className="md:grid md:grid-cols-3 max-md:flex max-md:flex-col gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white/20 rounded-3xl p-6 flex flex-col items-start gap-4 justify-center"
          >
            <h3 className="text-6xl font-bold mb-1">{item.number}</h3>
            <p className="text-lg font-light text-gray-100">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Numbers
