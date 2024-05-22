const Dive = () => {
    return (
        <div className="px-4 w-full flex flex-col mt-[160px]">
            <div className="max-w-[731px] mx-auto flex flex-col gap-4">
                <div className="mx-auto flex flex-col items-center">
                    <div className=" w-max rounded-3xl border border-solid border-green-800 px-3 py-1 flex flex-row gap-1">
                        <img src="/assets/icon/ic_stargroup.svg" />
                        <div className="font-medium">Features</div>
                    </div>
                    <div className="text-[32px] md:text-[52px] leading-[62.4px] tracking-tighter">
                        Dive Deeper into Crypto with On-Chain Intelligence
                    </div>
                </div>
                <p className="text-white/75 mt-2">Soon to be integrated across all our features, $CDBD empowers you to navigate the crypto landscape with confidence.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-5 items-center justify-center mt-12">
                <div className="w-[237px] flex flex-col gap-4 items-center">
                    <div className="w-[88px] h-[88px] p-3 rounded-[99px] bg-gradient-to-t from-gray-600/5 to-white/5">
                        <div className="w-full h-full rounded-[99px] bg-[#68EAF20F] flex items-center justify-center">
                            <img src="/assets/icon/ic_chart.svg" />
                        </div>
                    </div>
                    <div className="text-xl tracking-tight">
                        Powerful Charts
                    </div>
                    <p className="text-[14px] leading-[21px] text-white/75">Stay ahead of the curve with breaking crypto news, all in one place with TradingView.</p>
                </div>
                <div className="w-[237px] flex flex-col gap-4 items-center">
                    <div className="w-[88px] h-[88px] p-3 rounded-[99px] bg-gradient-to-t from-gray-600/5 to-white/5">
                        <div className="w-full h-full rounded-[99px] bg-[#68EAF20F] flex items-center justify-center">
                            <img src="/assets/icon/ic_indicator.svg" />
                        </div>
                    </div>
                    <div className="text-xl tracking-tight">
                        Enhanced Indicators
                    </div>
                    <p className="text-[14px] leading-[21px] text-white/75">CoinDashboard boasts the best charts, enhanced with unique indicators for unparalleled clarity.</p>
                </div>
                <div className="w-[237px] flex flex-col gap-4 items-center">
                    <div className="w-[88px] h-[88px] p-3 rounded-[99px] bg-gradient-to-t from-gray-600/5 to-white/5">
                        <div className="w-full h-full rounded-[99px] bg-[#68EAF20F] flex items-center justify-center">
                            <img src="/assets/icon/ic_trends.svg" />
                        </div>
                    </div>
                    <div className="text-xl tracking-tight">
                        News & Trends
                    </div>
                    <p className="text-[14px] leading-[21px] text-white/75">Stay informed with instant access to breaking crypto news. Chart your path to the success journey.</p>
                </div>
            </div>
        </div>
    )
}

export default Dive;