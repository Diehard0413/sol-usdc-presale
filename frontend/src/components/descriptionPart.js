
import "./components.scss"

import CoinImg from "../assets/img/pre-coin.png"

const DescriptionPart = () => {
    return (
        <div className="w-full lg:w-[500px] min-h-[404px] flex flex-col">
            <div className="flex flex-col">
                <div className="text-[42px] md:text-[72px] leading-[79px] text-left">
                    CoinDashboard Unveils<span className="text-[#0cafcc]">$CDBD</span>
                </div>
                <div className="text-[#FFFFFFBF] mt-4 text-left">Unlock unparalleled insights with $CDBD, the native token powering CoinDashboard's next evolution.</div>
                <div className="flex flex-col mt-4">
                    <div className="flex flex-row items-start">
                        <img src="/assets/img/check.svg" className="pr-2"/>
                        <div className="text-[#FFFFFFBF] text-left">
                            <span className="font-semibold text-white">Community Governance:</span> Participate in platform development and vote on feature proposals.
                        </div>
                    </div>
                    <div className="flex flex-row items-start mt-2.5">
                        <img src="/assets/img/check.svg" className="pr-2"/>
                        <div className="text-[#FFFFBF] text-left">
                            <span className="font-semibold text-white">Staking Rewards:</span> Earn $CDBD by staking your tokens and supporting the network.
                        </div>
                    </div>
                </div>
            </div>
            <a 
                href="https://coindashboard.gitbook.io/coindashboard-documentation/" 
                target="_blank"
                className="w-[166px] h-[36px] rounded-3xl px-4 py-2 border border-solid mt-6 border-[#0cafcc] text-sm font-medium tracking-tight flex flex-row gap-1 items-center hover:bg-[#0cafcc] hover:text-white"
            >
                <img src="/assets/img/document.svg"/>
                Read WhitePaper
            </a>
        </div>
    );
}

export default DescriptionPart;