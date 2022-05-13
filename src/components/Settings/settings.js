import React from "react"; 

export default class Settings extends React.Component {
    render() {
        let changeState = this.props.setState
        return (
            <>
              Settings page
                <button type="button" onClick={() => changeState("bruh", "bruh")}>Go to home page</button>  
            </>
        )
    }
}