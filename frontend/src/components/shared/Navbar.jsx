import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import ThemeToggle from "../ThemeToggle";
import GoogleTranslate from "../GoogleTranslate";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Bharat
            <span className="text-[#F83002] dark:text-[#F83002]">Path</span>
          </h1>
        </div>
        <div className="flex items-center gap-8">
          <ul className="flex font-medium items-center gap-6 text-black dark:text-white">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/admin/companies" className="hover:text-[#F83002]">
                    Companies
                  </Link>
                </li>
                <li>
                  <Link to="/admin/jobs" className="hover:text-[#F83002]">
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="hover:text-[#F83002]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:text-[#F83002]">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/browse" className="hover:text-[#F83002]">
                    Browse
                  </Link>
                </li>
                <li>
                  <ThemeToggle />
                </li>
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-[#F83002] text-[#F83002] hover:bg-[#F83002] hover:text-white"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt="User Avatar"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 dark:bg-gray-700 dark:text-white">
                <div className="flex flex-col items-start p-4">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 mb-2 hover:text-[#F83002]"
                  >
                    <User2 className="h-5 w-5" />
                    Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <GoogleTranslate className="max-w-28"/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
