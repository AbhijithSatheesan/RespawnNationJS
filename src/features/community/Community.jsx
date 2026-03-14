import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCommunity } from '../../services/TechBackGround/techBackgroundSlice'

const Community = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCommunity());
    }, [dispatch]);
  return (
    <div>
      
    </div>
  )
}

export default Community
