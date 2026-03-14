import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setTournament } from '../../services/TechBackGround/techBackgroundSlice';

const TournamentDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTournament())
  }, [setTournament]);  
  return (
    <div>
      <h1>Tournament page</h1>
    </div>
  )
}

export default TournamentDashboard
