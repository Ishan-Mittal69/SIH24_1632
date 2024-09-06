import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, Building, MapPin } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const HeroSection = () => {
    const [query, setQuery] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query))
        navigate("/browse")
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className='mx-auto px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium'>Official National Job Portal</span>
                <h1 className='text-4xl font-bold'>Discover Opportunities Across All Sectors</h1>
                <p className='max-w-2xl mx-auto'>Explore a wide range of job opportunities in both public and private sectors. From government positions to roles in leading companies, find the career that's right for you.</p>
                <div className='flex w-[60%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Search for jobs by title, skill, or company'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full'
                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-blue-600 hover:bg-blue-700">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
                <div className='mt-6 text-sm text-gray-600'>
                    <p>New to job searching? Check out our <Link to="/resources" className='text-blue-600 hover:underline'>Career Resources</Link> for tips on resume writing, interview preparation, and understanding your rights as a job seeker.</p>
                </div>
            </div>
        </div>
    )
}

export default HeroSection