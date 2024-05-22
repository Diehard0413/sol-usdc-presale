const Price = () => {
    return (
        <div className='bg-white/5 px-[20px] lg:px-[180px] py-[64px] flex flex-col md:flex-row justify-between'>
            <div className="flex flex-col">
                <div className="text-xl">Total Supply</div>
                <div className="text-[48px] leading-[52.8px] text-sky-400 mt-2">100,000,000</div>
            </div>
            <div className="flex flex-col mt-5 md:mt-0 mr-0 md:mr-5">
                <div className="text-xl">Pre-Sale Price</div>
                <div className="text-[48px] leading-[52.8px] text-sky-400 mt-2">$0.005</div>
            </div>
            <div className="flex flex-col mt-5 md:mt-0 mr-0 md:mr-5">
                <div className="text-xl">Pre-Sale Supply</div>
                <div className="text-[48px] leading-[52.8px] text-sky-400 mt-2">10,000,000</div>
            </div>
        </div>
    )
}

export default Price;