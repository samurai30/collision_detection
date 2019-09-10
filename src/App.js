import React from 'react';
import BasicScene from "./Components/Scenes/BasicScene";

class App extends React.Component{
    render() {
        const css = {
            marginTop:'1%'
        };

        return (
            <div style={css}>
                <div className="d-flex justify-content-center">
                    <h3>COLLISION DETECTION & AVOIDANCE</h3>
                </div>
                <div className="d-flex justify-content-center">
                    <BasicScene/>
                </div>
            </div>)
    }
}

export default App;
