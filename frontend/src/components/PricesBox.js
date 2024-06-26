import "./components.scss"
import CoinImg from "../assets/img/pre-coin.png"

const PricesBox = () => {
    return (
        <div className="price-box display-flex align-items-center">
            <span>Pre-Sale Price</span>:<img src={CoinImg} alt="coinImg" className="price-box-img"/> {`2,000`}=<svg width="25" height="18" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_302_1638)"><path d="M0.119241 17.1382L4.06591 13.5578C4.21687 13.414 4.41527 13.357 4.60937 13.357H22.8963C23.2313 13.357 23.3564 13.7592 23.1019 13.9748L19.1625 17.5552C19.0029 17.699 18.8045 17.7714 18.6161 17.7714H0.324762C-0.00880064 17.7714 -0.135244 17.3682 0.119241 17.1382ZM4.3132 10.855L1.02785 7.29004C0.813622 7.06 1.01922 6.67084 1.34991 6.67084H19.6326C19.8367 6.67084 20.0121 6.74363 20.1387 6.87303L23.424 10.452C23.6411 10.682 23.4369 11.0712 23.1019 11.0712L4.81779 11.0993C4.61937 11.0705 4.44116 10.9987 4.3132 10.855ZM19.8382 4.4145H1.55841C1.22629 4.4145 1.09404 4.01131 1.3514 3.78127L5.29377 0.200888C5.44761 0.0714893 5.64019 0.000104904 5.84004 0.000104904H24.1256C24.4577 0.000104904 24.5857 0.402231 24.3298 0.617897L20.3888 4.19828C20.2379 4.34205 20.0395 4.4145 19.8382 4.4145Z" fill="url(#paint0_linear_302_1638)"></path></g><defs><linearGradient id="paint0_linear_302_1638" x1="24.4937" y1="5.52129" x2="11.2902" y2="21.784" gradientUnits="userSpaceOnUse"><stop stop-color="#51FFC9"></stop><stop offset="1" stop-color="#793CDC"></stop></linearGradient><clipPath id="clip0_302_1638"><rect width="24.4809" height="17.778" fill="white"></rect></clipPath></defs></svg>{`0.015`}
        </div>
    );
}

export default PricesBox;