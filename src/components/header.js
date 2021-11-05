import React from "react";
import cryptoBankLogo from '../images/cryptoBankLogo.png'
import menuButton from '../images/menu-button.png'

class Header extends React.Component {
    render() {
        return(
            <div class="flex flex-row bg-primary px-4 pt-10 pb-0">
                <img class="self-center" src={menuButton}/>
                <img src={cryptoBankLogo}/>
            </div>
        );
    }
}

export default Header