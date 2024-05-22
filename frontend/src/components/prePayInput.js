import { useContext, useEffect, useState, useCallback } from 'react'
import {
    useConnection,
    useWallet
} from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import * as splToken from "@solana/spl-token";
import ThemeContext from '../context/themeContext';
import { FaAngleDown, FaAngleRight, FaAngleUp } from 'react-icons/fa';

import "./components.scss"

import {
    USDC_TOKEN_PUBKEY,
    USDT_TOKEN_PUBKEY,
    JUP_TOKEN_PUBKEY
} from "../constants"
import {numberWithCommas} from "../utils"
import usePresale from '../hooks/usePresale';

const PrePayInput = ({title, value, setValue, dropIndex, setDropIndex, balance, setBalance, transactionPending}) => {

    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const tokens = useContext(ThemeContext);

    const [drop, setDrop] = useState(false);
    // const [dropIndex, setDropIndex] = useState(0);
    // const [balance, setBalance] = useState (0)

    const handleDrop = () => {
        setDrop(!drop);
    }

    const handleDropItem = (idx) => {
        setDropIndex(idx);
    }

    const getBalance = useCallback(async() => {
        if (publicKey && connection) {
            try{
                if (tokens[dropIndex].ft === "SOL") {
                    const bal = await connection.getBalance(publicKey)
                    setBalance (bal / LAMPORTS_PER_SOL)
                } else if (tokens[dropIndex].ft === "USDT") {
                    const usdtAddress = await splToken.getAssociatedTokenAddress(USDT_TOKEN_PUBKEY, publicKey)
                    const usdtDetails = await splToken.getAccount(connection, usdtAddress)
                    if (usdtDetails.amount) setBalance (Number(usdtDetails.amount) / 1000000)
                } else if (tokens[dropIndex].ft === "USDC") {
                    const usdcAddress = await splToken.getAssociatedTokenAddress(USDC_TOKEN_PUBKEY, publicKey)
                    const usdcDetails = await splToken.getAccount(connection, usdcAddress)
                    if (usdcDetails.amount) setBalance (Number(usdcDetails.amount) / 1000000)
                } else if (tokens[dropIndex].ft === "JUP") {
                    const jupAddress = await splToken.getAssociatedTokenAddress(JUP_TOKEN_PUBKEY, publicKey)
                    const jupDetails = await splToken.getAccount(connection, jupAddress)
                    if (jupDetails.amount) setBalance (Number(jupDetails.amount) / 1000000)
                }
            } catch (e) {
                setBalance (0)
                console.log (e)
            }
        }
    },[publicKey, dropIndex, transactionPending])

    useEffect(() => {
        getBalance()
    }, [getBalance])

    const onChange = (e) => {
        if (Number(e.target.value) >= 0) {
            setValue(e.target.value)
        }
    }

    return (
        <div className="flex flex-col mt-4">
            <div className="flex flex-row justify-between items-center">
                <div className="text-[14px] leading-[16.94px]">
                    {title}:
                </div>
                <div className="flex flex-row text-[13px] font-medium leading-[15.73px] text-white/60 items-center">
                    <img src='/assets/img/wallet.svg' className='ml-0.5' />
                    <div> {numberWithCommas(balance.toFixed(2))} {tokens[dropIndex].ft}</div>
                </div>
            </div>
            <div className="h-[41px] flex flex-row pl-3 rounded-[32px] bg-[#08131799] border border-solid border-[#68F2C9] relative items-center mt-2">
                <div className="border-none rounded-[10px] w-[90%]">
                    <div className='flex flex-row items-center'>
                        <img src={tokens[dropIndex].icon} alt={tokens[dropIndex].ft} className='w-4 h-4'></img>
                        <input type="number" placeholder="0" className="px-1 w-full bg-transparent text-sm font-semibold focus:outline-none" value={value} onChange={(e) => onChange(e)}/>
                    </div>
                </div>
                <div className="bg-[#08363F] min-w-[102px] relative rounded-r-[32px] px-2 py-3 h-[95%] cursor-pointer flex flex-row items-center" onClick={handleDrop}>
                    <div className="w-full h-full flex flex-row gap-1 justify-between z-10 items-center">
                        <div className='flex flex-row items-center gap-1'>
                            <img src={tokens[dropIndex].icon} alt={tokens[dropIndex].ft} className='token-icon'></img>
                            <p className='text-[14px] font-medium leading-[16.94px]'>{tokens[dropIndex].ft}</p>
                        </div>
                        {drop ? <FaAngleUp /> : <FaAngleDown />}
                    </div>
                    {drop &&
                        <div className="dropdown-token-list">
                            {tokens.map((token, idx) => {
                                return (
                                    dropIndex !== idx && <div className="dropdown-token-item" onClick={() => handleDropItem(idx)} key={idx} ><img src={token.icon} alt={token.ft} className='token-icon'></img>{token.ft}</div>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default PrePayInput;