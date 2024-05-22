import { CircularProgress } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const Tokenomics = () => {
    return (
        <div className="px-4 w-full flex flex-col gap-12">
            <div className="max-w-full md:max-w-[572px] mx-auto flex flex-col gap-4">
                <div className="mx-auto flex flex-col gap-2 items-center">
                    <div className="w-max rounded-3xl border border-solid border-green-800 px-3 py-1 flex flex-row gap-1">
                        <img src="/assets/icon/ic_stargroup.svg" />
                        <div className="font-medium">tokenomics</div>
                    </div>
                    <div className="text-[32px] md:text-[52px] leading-[62.4px] tracking-tighter">
                        Key Tokenomics
                    </div>
                </div>
                <p className="text-white/75">Deep dive into the key aspects of our supply, geared to enable growth, longevity and community.</p>
            </div>
            <div className="flex-wrap md:flex-nowrap flex flex-row gap-8 justify-center">
                <div className="w-[130px] flex flex-col gap-[18.9px] items-center">
                    <CircleProgressBar percent={10}/>
                    <div className="flex flex-col gap-[7.56px]">
                        <div>Pre-Sale</div>
                        <p className="text-[14px] leading-[21px] text-white/75">10% of total supply</p>
                    </div>
                </div>
                <div className="w-[130px] flex flex-col gap-[18.9px] items-center">
                    <CircleProgressBar percent={10}/>
                    <div className="flex flex-col gap-[7.56px]">
                        <div>Stake Pool</div>
                        <p className="text-[14px] leading-[21px] text-white/75">10% of total supply</p>
                    </div>
                </div>
                <div className="w-[130px] flex flex-col gap-[18.9px] items-center">
                    <CircleProgressBar percent={5}/>
                    <div className="flex flex-col gap-[7.56px]">
                        <div>Airdrops</div>
                        <p className="text-[14px] leading-[21px] text-white/75">5% of total supply</p>
                    </div>
                </div>
                <div className="w-[130px] flex flex-col gap-[18.9px] items-center">
                    <CircleProgressBar percent={15}/>
                    <div className="flex flex-col gap-[7.56px]">
                        <div>Team + Advisors</div>
                        <p className="text-[14px] leading-[21px] text-white/75">15% of total supply</p>
                    </div>
                </div>
                <div className="w-[130px] flex flex-col gap-[18.9px] items-center">
                    <CircleProgressBar percent={20}/>
                    <div className="flex flex-col gap-[7.56px]">
                        <div>Reserve</div>
                        <p className="text-[14px] leading-[21px] text-white/75">20% of total supply</p>
                    </div>
                </div>
                <div className="w-[130px] flex flex-col gap-[18.9px] items-center">
                    <CircleProgressBar percent={5}/>
                    <div className="flex flex-col gap-[7.56px]">
                        <div>Reserve for Liquidity Pool</div>
                        <p className="text-[14px] leading-[21px] text-white/75">5% of total supply</p>
                    </div>
                </div>
                <div className="w-[130px] flex flex-col gap-[18.9px] items-center">
                    <CircleProgressBar percent={35}/>
                    <div className="flex flex-col gap-[7.56px]">
                        <div>Initial Circulating Supply</div>
                        <p className="text-[14px] leading-[21px] text-white/75">35% of total supply</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

const CircleProgressBar = ({percent}) => {
    return (
        <div className={`progress`}>
            <span className="title timer" data-from="0" data-to={percent} data-speed="1800">{percent}</span>
            <div className="overlay"></div>
            <div className={`left animate${percent}`}></div>
            <div className="right"></div>
        </div>
    )
}
export default Tokenomics;