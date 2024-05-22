import {
    useAnchorWallet,
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { numberWithCommas } from "../utils"
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { TOKEN_PRESALE_HARDCAP } from "../constants"
import { useEffect, useState, useMemo, useRef } from "react";

import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { IDL } from "../idl/token_presale";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import {
    PRESALE_PROGRAM_PUBKEY,
    PRESALE_SEED,
    PRESALE_AUTHORITY,
    PRESALE_ID
} from "../constants";

const PrettoSlider = styled(Slider)({
    color: '#52af77',
    height: 8,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#8aebd5',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&::before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#52af77',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&::before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});

const Stats = () => {

    const [totalBuyAmount, setTotalBuyAmount] = useState(0)
    const { publicKey } = useWallet();
    const anchorWallet = useAnchorWallet();
    const { connection } = useConnection();

    const program = useMemo(() => {
        if (anchorWallet) {
            const provider = new anchor.AnchorProvider(
                connection,
                anchorWallet,
                anchor.AnchorProvider.defaultOptions()
            );
            return new anchor.Program(IDL, PRESALE_PROGRAM_PUBKEY, provider);
        }
    }, [connection, anchorWallet]);

    const getPresaleInfo = async () => {
        if (program) {
            try {
                const [presale_info, presale_bump] = findProgramAddressSync(
                    [
                        utf8.encode(PRESALE_SEED),
                        PRESALE_AUTHORITY.toBuffer(),
                        new Uint8Array([PRESALE_ID]),
                    ],
                    program.programId
                );
                const info = await program.account.presaleInfo.fetch(presale_info);
                console.log (Number(info.soldTokenAmount), ">?????????????")
                setTotalBuyAmount(info.soldTokenAmount)
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect (() => {
        const interval = setInterval(async() => await getPresaleInfo(), 2000)
        return () => clearInterval(interval)
    }, [publicKey])

    return (
        <div className="flex flex-col mt-4">
            <div>Raised <span className="text-[#65f0ca]">{totalBuyAmount ? numberWithCommas(Number(totalBuyAmount / 1000000)) : 0}</span> of {numberWithCommas(TOKEN_PRESALE_HARDCAP)} CDBD</div>
            <PrettoSlider aria-label="Volume" value={Number(totalBuyAmount) / 100000 / 1000000} />
        </div>
    )
}

export default Stats