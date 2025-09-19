import React, { useEffect, useState } from 'react'

const LandingTeacher = () => {
    const [team,setTeam]=useState('')
    useEffect(()=>{
            setTeam(localStorage.getItem("Team"))
    },[])
  return (
    <div>
        <h1>{team} jadvaliga xush kelibsiz</h1>
    </div>
  )
}

export default LandingTeacher