

import React, { useEffect, useState, useContext } from 'react';
import { db } from '../../firebase';
import moment from 'moment'
import AuthUserContext from '../Auth/AuthUserContext';
import ScoreContext from '../context/scoreContext';

export const useGetMoneyEarned = () => {
    const authUser = useContext(AuthUserContext)
    const [loadingWinners, setLoadingWinners] = useState(true)

    const [usersMoney, setUsersMoney] = useState({})



    useEffect(() => {


        const fetchWinners = async () => {
            try {
                console.log("fetching winners")
                const result = await db.getWinners();
                extractUsersMoney(result.val())
            } catch (error) {
            }

        };
        fetchWinners();



    }, []);

    const extractUsersMoney = (winners) => {

        let usersMoneyTemp = [];

        let win;
        for (win of Object.values(winners)) {
            if (usersMoneyTemp.length === 0) {     // get first users money
                const a = { displayName: win.displayName, uid: win.uid, moneyEarned: win.moneyEarned };

                usersMoneyTemp = [...usersMoneyTemp, a]
            } else {  // add money to existing users or create new users
                if (usersMoneyTemp.map(obj => obj.uid).includes(win.uid)) {                                 // Check if user exists already in array
                    let objIndex = usersMoneyTemp.findIndex(obj => obj.uid === win.uid)  //index of object to update
                    usersMoneyTemp[objIndex].moneyEarned = usersMoneyTemp[objIndex].moneyEarned + win.moneyEarned    // add money to new object
                } else {                                                                                              // If user does not exist add to array
                    const a = { displayName: win.displayName, uid: win.uid, moneyEarned: win.moneyEarned };

                    usersMoneyTemp = [...usersMoneyTemp, a]
                }

            }
        }

        setUsersMoney(usersMoneyTemp)

        setLoadingWinners(false)
    }



    return [usersMoney, loadingWinners]
}

