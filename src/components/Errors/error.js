import React from "react"; 

export default class ErrorPage extends React.Component {
    clearStorage = () => {
        localStorage.clear()
    }
    render() {
        return (
            <>
                An error has occured
                <button type="button" onClick={() => this.clearStorage()}>Click here to clear local storage</button>
            </>
        )
    }
}
    