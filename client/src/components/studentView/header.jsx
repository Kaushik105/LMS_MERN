import React from 'react'
import {
  GraduationCap,
  LogOutIcon,
  TvMinimalPlay,
} from "lucide-react";
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/authContext';


function Header() {

      const {resetCredentials} = useAuth()
    
      function handleLogOut() {
        resetCredentials();
      }
  return (
    <div>
      <header className="flex h-18 justify-between items-center border-b px-6 lg:px-8 py-4">
        <Link to={"/"} className="flex gap-2 justify-center items-center">
          <GraduationCap size={44} />
          <h1 className="text-2xl font-bold">LMS Learning</h1>
        </Link>
        <div className="flex gap-2">
          <Button variant={"outline"}>
            <TvMinimalPlay />
          </Button>
          <Button onClick={handleLogOut} className={"cursor-pointer"} variant={"outline"}>
            {" "}
            <LogOutIcon />
            Logout
          </Button>
        </div>
      </header>
    </div>
  )
}

export default Header
