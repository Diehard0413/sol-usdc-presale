import { useState, useEffect, useCallback } from "react"
import "./components.scss"
import {
    useConnection,
    useWallet
} from "@solana/wallet-adapter-react";
import * as splToken from "@solana/spl-token";
import {
    TOKEN_PUBKEY,
} from "../constants"
import {numberWithCommas} from "../utils"
import usePresale from "../hooks/usePresale.js";

const PreReceiveInput = ({title, value, setValue, transactionPending}) => {

    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState (0)

    const getBalance = useCallback(async() => {
        if (publicKey && connection) {
            try{
                const tokenAddress = await splToken.getAssociatedTokenAddress(TOKEN_PUBKEY, publicKey)
                const tokenDetails = await splToken.getAccount(connection, tokenAddress)
                if (tokenDetails.amount) {
                    setBalance (Number(tokenDetails.amount) / 1000000)
                }
            } catch (e) {
                setBalance (0)
                console.log (e)
            }
        }
    }, [publicKey, transactionPending])

    useEffect(() => {
        getBalance()
    }, [getBalance])

    return (
        <div className="flex flex-col mt-4">
            <div className="flex flex-row justify-between items-center">
                <div className="text-[14px] font-normal leading-[16.94px]">
                    {title}:
                </div>
                <div className="flex flex-row text-[13px] font-medium leading-[15.73px] text-white/60 items-center">
                    <img src='/assets/img/wallet.svg' className="ml-0.5"/>
                    <div> {numberWithCommas(balance.toFixed(2))} CDBD</div>
                </div>
            </div>
            <div className="h-[41px] flex flex-row pl-3 rounded-[32px] mt-2 bg-[#08131799] border border-solid border-[#68F2C9] relative items-center">
                <img src='/assets/icon/ic_cdbd.svg' />
                <div className="presale-pay-input-tag">
                    <input 
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="0"
                        className="px-1 w-full bg-transparent text-sm font-semibold focus:outline-none"
                        disabled
                    />
                </div>
            </div>
        </div>
    );
}

export default PreReceiveInput;