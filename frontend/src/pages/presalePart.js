import DescriptionPart from "../components/descriptionPart";
import PresaleCard from "../components/presaleCard";
import {
    useWallet,
} from "@solana/wallet-adapter-react";
import {
    PRESALE_AUTHORITY,
    TOKEN_PUBKEY,
    USDT_TOKEN_PUBKEY,
    USDC_TOKEN_PUBKEY,
    JUP_TOKEN_PUBKEY,
    JUP_PRICEFEED_ID,
    TOKEN_PRESALE_HARDCAP
} from "../constants"

import usePresale from "../hooks/usePresale";

import "./pages.css"


const PresalePart = () => {

    const { publicKey } = useWallet();
    const {
        createPresale,
        depositToken,
        updatePresale,
        claimToken,
        withdrawSol,
        withdrawToken,
        buyToken,
        updateAuth
    } = usePresale();

    const onCreatePresale = async () => {
        await createPresale();
    };

    const onDepositToken = async (depositingToken, pythAccount, amount) => {
        await depositToken(depositingToken, pythAccount, amount);
    };

    const onBuyToken = async () => {
        await buyToken(0.1);
    };

    const onWithdrawToken = async (withdrawingToken) => {
        await withdrawToken(withdrawingToken);
    };

    const onUpdateAuth = async () => {
        await updateAuth();
    };
  
    const onUpdatePresale = async () => {
        await updatePresale();
    };

    const onClaimClub = async () => {
        await claimToken();
    };

    const onWithdrawSol = async () => {
        await withdrawSol();
    };

    return (
        <div className="w-full display-flex justify-content-center align-items-center">
            {
                publicKey && publicKey.toBase58() === PRESALE_AUTHORITY.toBase58() &&
                <div className="grid grid-cols-4 items-center gap-2 mb-5">
                    <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={onCreatePresale}
                    >
                        Create Presale
                    </button>
                    {/* <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={onBuyToken}
                    >
                        Buy Token
                    </button> */}
                    <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={() => onDepositToken(TOKEN_PUBKEY, JUP_PRICEFEED_ID, TOKEN_PRESALE_HARDCAP)}
                    >
                        Deposit MintToken
                    </button>
                    {/* <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={() => onDepositToken(USDT_TOKEN_PUBKEY, JUP_PRICEFEED_ID, 1)}
                    >
                        Deposit USDTToken
                    </button> */}
                    {/* <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={() => onDepositToken(USDC_TOKEN_PUBKEY, JUP_PRICEFEED_ID, 1)}
                    >
                        Deposit USDCToken
                    </button>
                    <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={() => onDepositToken(JUP_TOKEN_PUBKEY, JUP_PRICEFEED_ID)}
                    >
                        Deposit JUPToken
                    </button> */}
                    {/* <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={onUpdatePresale}
                    >
                        Update Presale
                    </button>
                    <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={onClaimClub}
                    >
                        Claim Club
                    </button> */}
                    <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={onWithdrawSol}
                    >
                        Withdraw Sol
                    </button>
                    <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={() => onWithdrawToken(TOKEN_PUBKEY)}
                    >
                        Withdraw MintToken
                    </button>
                    <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={() => onWithdrawToken(USDT_TOKEN_PUBKEY)}
                    >
                        Withdraw USDTToken
                    </button>
                    <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={() => onWithdrawToken(USDC_TOKEN_PUBKEY)}
                    >
                        Withdraw USDCToken
                    </button>
                    <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={() => onWithdrawToken(JUP_TOKEN_PUBKEY)}
                    >
                        Withdraw JUPToken
                    </button>
                    <button
                        className="px-5 py-2 bg-[#d00711] rounded-full text-[#eff3f6] font-inter text-sm font-bold"
                        onClick={() => onUpdateAuth()}
                    >
                        Update Auth
                    </button>
                </div>
            }
            <div className="px-4 flex flex-col lg:flex-row items-center justify-center">
                <DescriptionPart />
                <PresaleCard />
            </div>
        </div >
    );
}

export default PresalePart;