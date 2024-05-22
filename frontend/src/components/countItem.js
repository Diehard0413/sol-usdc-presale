import "./components.scss"

const CountItem = (props) => {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="w-[43px] h-[41px] text-[34px] font-medium leading-[41.15px]">
                {props.value}
            </div>
            <div className="text-[13px] leading-[15.73px] text-white/60">{props.title}</div>
        </div>
    );
}

export default CountItem;