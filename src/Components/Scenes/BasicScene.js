import React from 'react'
import * as BABYLON from "babylonjs";
import SceneBasic from "../AppEngine";
import type {SceneEventArgs} from "../AppEngine";


class BasicScene extends React.Component{
    onSceneMount = (e: SceneEventArgs) => {
        const { canvas, scene, engine } = e;
        let camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0,5,-10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        // Add lights to the scene
        let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light1.intensity = 0.7;
        // Add and manipulate meshes in the scene
        let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2,segments:32}, scene);
        sphere.position.y = 1;
        let ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10,height:10},scene);

        scene.registerBeforeRender(() =>{
            ground.rotation.y += 0.001;

        });
        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }

        });
    };
    componentDidMount() {

    }

    render(){
        const css = {
            borderRadius:20,
            outline: 'none'
        };
       return (
           <div style={css}>
                <SceneBasic width={1280} height={720} onSceneMount={this.onSceneMount} style={css} adaptToDeviceRatio={true}/>
            </div>
       );
    }
}

export default BasicScene;