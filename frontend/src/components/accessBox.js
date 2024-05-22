import "./components.scss"

const AccessBox = (props) => {
    return (
        <div class="access-box no-access">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_2432_19865)">
                    {/* <mask id="mask0_2432_19865" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16" style="mask-type: luminance;"> */}
                        <path d="M7.99998 14.6666C11.682 14.6666 14.6666 11.682 14.6666 7.99998C14.6666 4.31798 11.682 1.33331 7.99998 1.33331C4.31798 1.33331 1.33331 4.31798 1.33331 7.99998C1.33331 11.682 4.31798 14.6666 7.99998 14.6666Z" fill="white" stroke="white" stroke-width="1.66667" stroke-linejoin="round"></path>
                        <path d="M9.88565 6.11432L6.11432 9.88565M6.11432 6.11432L9.88565 9.88565" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
                    {/* </mask> */}
                    {/* <g mask="url(#mask0_2432_19865)"><path d="M0 0H16V16H0V0Z" fill="#EF127C"></path></g> */}
                </g>
                <defs><clipPath id="clip0_2432_19865"><rect width="16" height="16" fill="white"></rect></clipPath></defs>
            </svg>
            <span>Not eligible for the Pre-Sale. <br/> Check our<a rel="noreferrer" href="https://discord.gg/theprimes" target="_blank">Discord<svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.3488 1.25982C15.0799 0.662214 13.7399 0.238636 12.3632 0C12.1878 0.310007 11.9931 0.730259 11.8563 1.06005C10.3922 0.84009 8.90481 0.84009 7.4408 1.06005C7.30397 0.730259 7.09826 0.310007 6.93295 0C5.55503 0.235822 4.214 0.65951 2.94546 1.25982C0.422738 5.07978 -0.2596 8.81023 0.0820281 12.4898C1.56022 13.6034 3.21149 14.4521 4.96584 15C5.35995 14.4542 5.70891 13.8755 6.00909 13.27C5.43328 13.0495 4.8887 12.78 4.36156 12.4596C4.4984 12.3598 4.63431 12.2495 4.76104 12.1393C7.93855 13.6299 11.3796 13.6299 14.5176 12.1393C14.6545 12.2495 14.7812 12.3598 14.9171 12.4596C14.3909 12.78 13.8454 13.0495 13.2705 13.27C13.5704 13.8754 13.9191 14.4541 14.3129 15C16.0678 14.4537 17.7194 13.6049 19.1967 12.4898C19.6164 8.23073 18.5336 4.52949 16.3498 1.25982H16.3488ZM6.44623 10.2199C5.49114 10.2199 4.71145 9.32942 4.71145 8.24015C4.71145 7.14995 5.47185 6.2595 6.44714 6.2595C7.41142 6.2595 8.2012 7.14995 8.181 8.24015C8.181 9.32942 7.41142 10.2199 6.44623 10.2199ZM12.8508 10.2199C11.8957 10.2199 11.1151 9.32942 11.1151 8.24015C11.1151 7.14995 11.8755 6.2595 12.8508 6.2595C13.8151 6.2595 14.6049 7.14995 14.5856 8.24015C14.5856 9.32942 13.8252 10.2189 12.8499 10.2189L12.8508 10.2199Z" fill="url(#paint0_linear_2690_39596)"></path><defs><linearGradient id="paint0_linear_2690_39596" x1="10.5947" y1="15" x2="10.5947" y2="-3.51563" gradientUnits="userSpaceOnUse"><stop stop-color="#8D0AF4"></stop><stop offset="1" stop-color="#EF127C"></stop></linearGradient></defs></svg></a>for more details.</span>
        </div>
    );
}

export default AccessBox;