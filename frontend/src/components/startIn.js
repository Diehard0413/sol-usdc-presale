import CountItem from "./countItem";

import "./components.scss"

const StartIn = () => {
    return (
        <div className="mb-4 flex flex-col gap-4">
            <div className="startin-title">Pre-Sale Starts In</div>
            <div className="flex flex-row justify-between">
                <CountItem title="DAYS" value='05'></CountItem>
                <div className="flex flex-row items-center text-[32px] font-normal leading-[38.73px]">:</div>
                <CountItem title="HRS" value='23'></CountItem>
                <div className="flex flex-row items-center text-[32px] font-normal leading-[38.73px]">:</div>
                <CountItem title="MIN" value='32'></CountItem>
                <div className="flex flex-row items-center text-[32px] font-normal leading-[38.73px]">:</div>
                <CountItem title="SEC" value='57'></CountItem>
            </div>
        </div>
    );
}

export default StartIn;