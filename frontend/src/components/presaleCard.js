import React, { useState, useContext, useEffect, useCallback } from "react";
import {
    useWallet,
  } from "@solana/wallet-adapter-react";
import PrePayInput from "./prePayInput"
import PreReceiveInput from "./preReceiveInput"
import Stats from "../components/stats.js"
import { Icon, IconType } from "./icons";

import { toast } from "react-toastify";

import "./components.scss"
import CountItem from "./countItem"

import Countdown from "react-countdown";
import ThemeContext from '../context/themeContext';
import usePresale from "../hooks/usePresale.js"

import {
    JUP_PRICEFEED_ID,
    JUP_TOKEN_PUBKEY,
    USDT_TOKEN_PUBKEY,
    USDC_TOKEN_PUBKEY,
    PRICE_PER_TOKEN
} from "../constants";

const PresaleCard = () => {

    const { buyToken, depositToken, transactionPending, startTime, endTime, getPrice } = usePresale();
    const tokens = useContext(ThemeContext);
    const { publicKey } = useWallet();

    const [quoteAmount, setQuoteAmount] = useState(0);
    const [tokenAmount, setTokenAmount] = useState(0);
    const [dropIndex, setDropIndex] = useState(0);
    const [ratio, setRatio] = useState(1)
    const [balance, setBalance] = useState(0)
    const [canBuy, setCanBuy] = useState(true);

    useEffect(() => {
        const current = Date.now();
        if (startTime * 1000 < current && endTime * 1000 > current) {
            setCanBuy(true);
        } else {
            setCanBuy(false);
        }
    }, [startTime, endTime]);

    const _setRatio = useCallback(async () => {
        const price = await getPrice(tokens[dropIndex].ft)
        if (price) setRatio(parseInt(Number(price) / PRICE_PER_TOKEN))
        else setRatio(0)
    }, [dropIndex, publicKey])

    useEffect(() => {
        _setRatio()
    }, [_setRatio])

    useEffect(() => {
        setTokenAmount(quoteAmount * ratio)
    }, [quoteAmount, ratio])

    // useEffect(() => {
    //     setQuoteAmount(tokenAmount / ratio)
    // }, [tokenAmount])

    const onBuyToken = async () => {
        if (balance < quoteAmount) {
            toast.warning("Please check balance again.");
            return;
        }
        if (tokens[dropIndex].ft === "SOL") { buyToken(quoteAmount); }
        else {
            if (tokens[dropIndex].ft === "JUP") {
                depositToken(JUP_TOKEN_PUBKEY, JUP_PRICEFEED_ID, quoteAmount)
            } else if (tokens[dropIndex].ft === "USDT") {
                depositToken(USDT_TOKEN_PUBKEY, JUP_PRICEFEED_ID, quoteAmount)
            } else if (tokens[dropIndex].ft === "USDC") {
                depositToken(USDC_TOKEN_PUBKEY, JUP_PRICEFEED_ID, quoteAmount)
            }
        }
    };

    return (
        <div className="w-full md:w-[407px] rounded-3xl p-6 border border-solid border-[#68F2C9] flex flex-col mt-[50px] lg:ml-[50px] xl:ml-[206px]">
            <div className="w-full md:w-[359px] flex flex-col">
                <div className="text-[14px] leading-[17px] tracking-wide uppercase text-left">
                    {Date.now() < startTime * 1000 && "Pre-Sale Starts In"}
                    {Date.now() >= startTime * 1000 && Date.now() < endTime * 1000 && "Pre-Sale Ends In"}
                    {Date.now() > endTime * 1000 && ""}
                </div>
                {endTime ? Date.now() < endTime * 1000 ? (
                    <Countdown
                        date={
                            Date.now() < startTime * 1000 ? startTime * 1000 : endTime * 1000
                        }
                        renderer={renderer}
                    />
                ) : (
                    <span className="text-3xl font-bold text-[#d00711]">
                        Presale Completed.
                    </span>
                ):<span className="text-3xl font-bold text-[#00CABE]">
                    Please connect your wallet.
                </span> 
                }
                <div className="w-full h-0 border-[0.5px] border-[#587267] mt-4" />
                <Stats />
                <div className="w-full h-0 border border-[#587267] mt-4" />
                <PrePayInput
                    title="Amount you pay"
                    value={quoteAmount}
                    setValue={(val) => setQuoteAmount(val)}
                    dropIndex={dropIndex}
                    setDropIndex={(val) => setDropIndex(val)}
                    balance={balance}
                    setBalance={(val) => setBalance(val)}
                    transactionPending={transactionPending}
                />
                <PreReceiveInput 
                    title="Amount you receive"
                    value={tokenAmount}
                    setValue={(val) => setTokenAmount(val)}
                    transactionPending={transactionPending}
                />
                <div className="flex flex-col mt-4">
                    <div className="w-full h-0 border border-[#587267]" />
                    <div className="flex flex-row items-center justify-center text-[14px] font-normal leading-[16.94px] mt-2.5">
                        <div className="flex flex-row items-center mr-2">
                            <img src='/assets/icon/ic_cdbd.svg' className="mr-1"/>
                            <span>{ratio} CDBD</span>
                        </div>
                        =
                        <div className="flex flex-row items-center ml-2">
                            {tokens[dropIndex].ft === "SOL" && <img src='/assets/img/sol.svg' className="w-5 h-5" />}
                            {tokens[dropIndex].ft === "USDT" && <img src='/assets/img/usdt.png' className="w-5 h-5" />}
                            {tokens[dropIndex].ft === "USDC" && <img src='/assets/img/usdc.svg' className="w-5 h-5" />}
                            {tokens[dropIndex].ft === "JUP" && <img src='/assets/img/jup.svg' className="w-5 h-5" />}
                            <span className="ml-1">1 {tokens[dropIndex].ft}</span>
                        </div>
                    </div>
                </div>
            </div>
            {(canBuy && !transactionPending) && (
                <button
                    className="w-full h-9 flex flex-row items-center justify-center rounded-3xl px-4 py-2 text-[14px] bg-cyan-500 mt-5"
                    onClick={onBuyToken}
                >
                    Buy Now
                </button>
            )}
            {(canBuy && transactionPending) && 
                <div className="flex flex-row items-center justify-center mt-5">
                    <Icon type={IconType.LOADING} className="w-9 h-9" />
                </div>
            }
            {!canBuy && (
                <button
                    className="w-full h-9 flex flex-row items-center justify-center rounded-3xl px-4 py-2 text-[14px] bg-cyan-500 mt-5"
                    disabled
                >
                    Buy Now
                </button>
            )}
        </div>
    )
}

const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
}) => {
    if (completed) {
        // Render a completed state
        return <Completionist />;
    } else {
        // Render a countdown
        return (
            <div className="flex flex-row justify-between mt-4">
                <CountItem title="DAYS" value={`${days>=10?days.toString():'0' + days.toString()}`}></CountItem>
                <div className="flex flex-row items-center text-[32px] font-normal leading-[38.73px]">:</div>
                <CountItem title="HRS" value={`${hours>=10?hours.toString():'0' + hours.toString()}`}></CountItem>
                <div className="flex flex-row items-center text-[32px] font-normal leading-[38.73px]">:</div>
                <CountItem title="MIN" value={`${minutes>=10?minutes.toString():'0' + minutes.toString()}`}></CountItem>
                <div className="flex flex-row items-center text-[32px] font-normal leading-[38.73px]">:</div>
                <CountItem title="SEC" value={`${seconds>=10?seconds.toString():'0' + seconds.toString()}`}></CountItem>
            </div>
        );
    }
};

export default PresaleCard;