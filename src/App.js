import React from 'react';
import SkullScene from "./Components/Scenes/SkullScene";
import BasicScene from "./Components/Scenes/BasicScene";
import {Button} from "reactstrap";

class App extends React.Component{
    state ={
        toggle : false
    };

    toggleButton(){
        this.setState({toggle:!this.state.toggle})
    }
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
                    {
                        this.state.toggle ? <SkullScene/> : <BasicScene/>
                    }

                </div>

                <div className="d-flex justify-content-center">
                   <Button onClick={()=>this.toggleButton()}>SWITCH</Button>

                </div>
            </div>)
    }
}

export default App;
