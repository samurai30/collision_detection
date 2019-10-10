import React from 'react';
import SceneCar from '../AppEngine';
import type {SceneEventArgs} from "../AppEngine";
import * as BABYLON from 'babylonjs';
import * as ammo from "ammo.js";

class SkullScene extends React.Component{

    onSceneMount(e: SceneEventArgs){
        const { canvas, engine, scene } = e;
        let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -5), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        camera.keysUp.push(87);
        camera.keysDown.push(83);
        camera.keysLeft.push(65);
        camera.keysRight.push(68);
        // Enable physics
        scene.enablePhysics(new BABYLON.Vector3(0,-10,0), new BABYLON.AmmoJSPlugin(undefined,ammo));

        // Create ground collider
        let ground = BABYLON.Mesh.CreateGround("ground1", 20, 20, 2, scene);
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);

        // Import mesh and set colliders
        BABYLON.SceneLoader.ImportMesh("", "", "skull.babylon", scene, function (newMeshes) {
            // Scale loaded mesh
            newMeshes[0].scaling.scaleInPlace(0.01);
            newMeshes[0].position.set(0,0,0);

            // Add colliders
            let collidersVisible = false;
            let sphereCollider = BABYLON.Mesh.CreateSphere("sphere1", 16, 0.5, scene);
            sphereCollider.position.y = 0.08;
            sphereCollider.isVisible = collidersVisible;
            let boxCollider = BABYLON.Mesh.CreateBox("box1", 0.3, scene);
            boxCollider.position.y = -0.13;
            boxCollider.position.z = -0.13;
            boxCollider.isVisible = collidersVisible;

            // Create a physics root and add all children
            let physicsRoot = new BABYLON.Mesh("", scene);
            physicsRoot.addChild(newMeshes[0]);
            physicsRoot.addChild(boxCollider);
            physicsRoot.addChild(sphereCollider);
            physicsRoot.position.y+=3;

            // Enable physics on colliders first then physics root of the mesh
            boxCollider.physicsImpostor = new BABYLON.PhysicsImpostor(boxCollider, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
            sphereCollider.physicsImpostor = new BABYLON.PhysicsImpostor(sphereCollider, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0 }, scene);
            physicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(physicsRoot, BABYLON.PhysicsImpostor.NoImpostor, { mass: 3 }, scene);

            // Orient the physics root
            physicsRoot.rotation.x = Math.PI/5;
            physicsRoot.rotation.z = Math.PI/6;
        });


        engine.runRenderLoop(function () {
            scene.render();
        });
        }


    render(){

        const css = {
            borderRadius:20,
            outline: 'none'
        };

        return (<div>
            <SceneCar  width={800} height={800} onSceneMount={this.onSceneMount} style={css} adaptToDeviceRatio={true}/>
        </div>)
    }
}

export default SkullScene;