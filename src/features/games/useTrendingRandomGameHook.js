import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTrendingRandomGame } from "./trendingRandomGame";
import api from "../../services/api";


const useTrendingRandomGameHook = () => {
    const dispatch = useDispatch()


    useEffect(() =>{
        const fetchRandomTrendingGame = async () => {
            try{
                const res = await api.get('games/trending_game');
                dispatch(addTrendingRandomGame(res.data));
            } 
            catch (err) {
                console.error('cannot fetch trending game', err);
            }
        };

        fetchRandomTrendingGame();
    }, [dispatch]);
};

export default useTrendingRandomGameHook;