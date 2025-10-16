import SpotlightedCreators from '@/components/creators'
import Footer from '@/components/Footer'
import React from 'react'

const Page = () => {
  return (
    <div className='px-3'>
        <SpotlightedCreators pagination={true} bgColor={"bg-white/20"} textColor={"text-white"} />
        <br/>
    </div>
  )
}

export default Page