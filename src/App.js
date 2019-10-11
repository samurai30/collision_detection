import React from 'react';
import SkullScene from "./Components/Scenes/SkullScene";
import BasicScene from "./Components/Scenes/BasicScene";
import {Button} from "reactstrap";

class App extends React.Component{

    render() {
        const css = {
            marginTop:'1%'
        };

        return (
            <div style={css}>
                <div className="d-flex justify-content-center">
                    <h3>CG DEMO SP182205</h3>
                </div>
                <div className="d-flex justify-content-center">
                    <SkullScene/>
                </div>

            </div>)
    }
}

export default App;
