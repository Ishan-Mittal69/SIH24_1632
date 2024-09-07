import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Briefcase, MapPin } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
                    <div className='p-6 sm:p-8'>
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6'>
                            <div className='flex items-center gap-4 mb-4 sm:mb-0'>
                                <Avatar className="h-24 w-24 ring-2 ring-blue-500 dark:ring-blue-400">
                                    <AvatarImage src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt="profile" />
                                </Avatar>
                                <div>
                                    <h1 className='font-bold text-2xl dark:text-white'>{user?.fullname}</h1>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1">{user?.profile?.bio || "No bio available"}</p>
                                </div>
                            </div>
                            <Button onClick={() => setOpen(true)} className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700" variant="outline">
                                <Pen className="mr-2 h-4 w-4" /> Edit Profile
                            </Button>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                            <div className='flex items-center gap-3'>
                                <Mail className="text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-800 dark:text-gray-200">{user?.email}</span>
                            </div>
                            <div className='flex items-center gap-3'>
                                <Contact className="text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-800 dark:text-gray-200">{user?.phoneNumber || "No phone number"}</span>
                            </div>
                        </div>

                        <div className='mb-6'>
                            <div className='flex items-center gap-3'>
                                <MapPin className="text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-800 dark:text-gray-200">
                                    {user?.profile?.city || user?.profile?.state || user?.profile?.country
                                        ? `${user.profile.city || ''} ${user.profile.state || ''} ${user.profile.country || ''}`.trim()
                                        : "Location not available"}
                                </span>
                            </div>
                        </div>

                        <div className='mb-6'>
                            <h2 className="text-lg font-semibold mb-2 dark:text-white">Skills</h2>
                            <div className='flex flex-wrap gap-2'>
                                {user?.profile?.skills && user.profile.skills.length > 0 
                                    ? user.profile.skills.map((item, index) => (
                                        <Badge 
                                            key={index} 
                                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-200 dark:hover:bg-blue-800"
                                            title="Click to view details"
                                        >
                                            {item}
                                        </Badge>
                                    )) 
                                    : <span className="text-gray-500 dark:text-gray-400">No skills listed</span>
                                }
                            </div>
                        </div>

                        <div className='grid w-full max-w-sm items-center gap-1.5'>
                            <Label className="text-md font-semibold dark:text-white">Resume</Label>
                            {isResume && user?.profile?.resume ? (
                                <a 
                                    target='blank' 
                                    href={user.profile.resume} 
                                    className='text-blue-600 dark:text-blue-400 hover:underline flex items-center'
                                >
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    {user.profile.resumeOriginalName}
                                </a>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400">No resume uploaded</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className='mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
                    <div className='p-6 sm:p-8'>
                        <h2 className='font-bold text-xl mb-4 dark:text-white'>Applied Jobs</h2>
                        <AppliedJobTable />
                    </div>
                </div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile