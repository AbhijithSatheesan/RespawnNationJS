import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import { addGameListContents } from "./gameListSlice";

const useGameListHook = () => {
    const dispatch = useDispatch()


    useEffect(() => {
        const fetchGameList = async () => {
            try{
                const res = await api.get('games/browse_games/');
                dispatch(addGameListContents(res.data));
            } catch (err) {
                console.error('gamelsit fetch failed',err);
            }
        };


        fetchGameList();
    }, [dispatch]);
};

export default useGameListHook;

