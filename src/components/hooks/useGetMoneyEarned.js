

import React, { useEffect, useState, useContext } from 'react';
import { db } from '../../firebase';
import moment from 'moment'
import AuthUserContext from '../Auth/AuthUserContext';
import ScoreContext from '../context/scoreContext';

export const useGetMoneyEarned = (userUid) => {
    const authUser = useContext(AuthUserContext)
    const [loadingMoneyWon, setLoadingMoneyWon] = useState(true)

    const [usersMoney, setUsersMoney] = useState(0)
    const [usersMoneyEarned, setUsersMoneyEarned] = useState(0)



    useEffect(() => {
        const fetchMoney = async () => {
            db.getMoneyWon(userUid).then(res => {
                return (res.val()) //resolve promise
            }).then(moneyWon => {
                if (moneyWon === null) {
                    setUsersMoney(0)
                } else {
                    setUsersMoney(moneyWon)
                }
            });

            db.getMoneyEarned(userUid).then(res => {
                return (res.val()) //resolve promise
            }).then(moneyEarned => {
                if (moneyEarned === null) {
                    setUsersMoneyEarned(0)
                } else {
                    setUsersMoneyEarned(moneyEarned)
                }
            });

            setLoadingMoneyWon(false)


        };
        fetchMoney();
    }, [userUid])



    return [usersMoney, usersMoneyEarned, loadingMoneyWon]
}

