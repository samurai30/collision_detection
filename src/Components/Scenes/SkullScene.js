import React from 'react';
import SceneCar from '../AppEngine';
import type {SceneEventArgs} from "../AppEngine";
import * as BABYLON from 'babylonjs';
import * as ammo from "ammo.js";

class SkullScene extends React.Component{

    onSceneMount = async function(e: SceneEventArgs){
        const { canvas, engine, scene } = e;
        var colors = {
            seaFoam: BABYLON.Color3.FromHexString("#16a085"),
            green: BABYLON.Color3.FromHexString("#27ae60"),
            blue: BABYLON.Color3.FromHexString("#2980b9"),
            purple: BABYLON.Color3.FromHexString("#8e44ad"),
            navy: BABYLON.Color3.FromHexString("#2c3e50"),
            yellow: BABYLON.Color3.FromHexString("#f39c12"),
            orange: BABYLON.Color3.FromHexString("#d35400"),
            red: BABYLON.Color3.FromHexString("#c0392b"),
            white: BABYLON.Color3.FromHexString("#bdc3c7"),
            gray: BABYLON.Color3.FromHexString("#7f8c8d")
        };
        var createMat = (scene, color)=>{
            var mat = new BABYLON.StandardMaterial("", scene);
            mat.diffuseColor = color;
            mat.specularColor = BABYLON.Color3.FromHexString("#555555");
            mat.specularPower = 1;
            mat.emissiveColor = color.clone().scale(0.7);
            mat.backFaceCulling = false;
            return mat;
        };
        scene.clearColor = colors.navy;

        // Create materials
        var materials = {
            blue: createMat(scene, colors.blue),
            red: createMat(scene, colors.red),
            navy: createMat(scene, colors.navy),
            green: createMat(scene, colors.green)
        };

        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:500.0}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/maps/sahara", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;


        // Environment
        var light = new BABYLON.HemisphericLight("", new BABYLON.Vector3(0.1,1,0.3), scene);
        light.intensity = 0.6;

        var pointLight = new BABYLON.PointLight("light1", new BABYLON.Vector3(3, 10, 10), scene);
        pointLight.position.y = 5;
        pointLight.intensity = 0.7;
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 2, -4), scene);
        camera.attachControl(canvas, true);

        // Enable physics
        let ammo_engine =  new BABYLON.AmmoJSPlugin(undefined,ammo);
        ammo_engine.setMaxSteps(10);
        ammo_engine.setFixedTimeStep(1/(240));
        scene.enablePhysics(new BABYLON.Vector3(0,-10,0),ammo_engine);

        var grass0 = new BABYLON.StandardMaterial("grass0", scene);
        grass0.diffuseTexture = new BABYLON.Texture("textures/grass/Material_611.png", scene);
        var ground = BABYLON.Mesh.CreateBox("Ground", 1, scene);
        ground.scaling = new BABYLON.Vector3(100, 1, 100);

        ground.material = grass0
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);



        // Import mesh and set colliders
        let meshes = (await BABYLON.SceneLoader.ImportMeshAsync("", "models/", "apple.babylon", scene)).meshes;
        let knife = meshes[1];
        let knife_blade = meshes[2];
        let apple = meshes[0];

        knife.material.backFaceCulling = false;

        knife_blade.scaling.scaleInPlace(0.8);
        knife.scaling.scaleInPlace(0.5);
        knife.position.set(0,0,0);


        apple.scaling.scaleInPlace(1);
        apple.position.set(0,0,0);

        // Add colliders
        let collidersVisible = false;
        let sphereCollider = BABYLON.Mesh.CreateSphere("sphere1", 12, 0.6, scene);
        sphereCollider.isVisible = collidersVisible;

        let boxCollider = BABYLON.MeshBuilder.CreateBox("box1", {height: 0.2,width: 1.5}, scene);
        boxCollider.isVisible = collidersVisible;

        // Create a physics root and add all children
        let physicsRoot = new BABYLON.Mesh("apple", scene);
        let physicsRoot2 = new BABYLON.Mesh("knife", scene);
        physicsRoot.addChild(apple);
        physicsRoot.addChild(sphereCollider);
        physicsRoot.position.y+=3;


        physicsRoot2.addChild(knife);
        physicsRoot2.addChild(knife_blade);
        physicsRoot2.addChild(boxCollider);
        physicsRoot2.position.z -=5;
        // Enable physics on colliders first then physics root of the mesh
        sphereCollider.physicsImpostor = new BABYLON.PhysicsImpostor(sphereCollider, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0 }, scene);
        physicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(physicsRoot, BABYLON.PhysicsImpostor.NoImpostor, { mass: 3 }, scene);

        boxCollider.physicsImpostor = new BABYLON.PhysicsImpostor(boxCollider, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 6 }, scene);
        physicsRoot2.physicsImpostor = new BABYLON.PhysicsImpostor(physicsRoot2, BABYLON.PhysicsImpostor.NoImpostor, { mass: 0.2 }, scene);
        // // Add friction to pumpkin movement
        var appleSpeedReduction = 0.4;
        scene.onBeforeRenderObservable.add(()=>{
            var delta = scene.getEngine().getDeltaTime()/1000;
            var v = physicsRoot.physicsImpostor.getLinearVelocity();
            physicsRoot.physicsImpostor.setLinearVelocity(v.scale(Math.pow(appleSpeedReduction, delta)));
            v = physicsRoot.physicsImpostor.getAngularVelocity();
            physicsRoot.physicsImpostor.setAngularVelocity(v.scale(Math.pow(appleSpeedReduction, delta)));
        });


        // Create spheres to be thrown
        var ThrowKnife = [];
        var sphereIndex = 0;
        for(var i = 0;i<10;i++){
            ThrowKnife.push(physicsRoot2);
        }

        // On pointer event, fire a sphere
        scene.onPointerObservable.add((e)=>{
            if(e.type == BABYLON.PointerEventTypes.POINTERDOWN){
                ThrowKnife[sphereIndex].position.copyFrom(e.pickInfo.ray.origin);
                ThrowKnife[sphereIndex].physicsImpostor.setLinearVelocity(e.pickInfo.ray.direction.scale(15));
                sphereIndex = ++sphereIndex%ThrowKnife.length;
            }
        });

        engine.runRenderLoop(function () {
            scene.render();
        });
        };


    render(){

        const css = {
            borderRadius:20,
            outline: 'none'
        };

        return (<div>
            <SceneCar  width={1000} height={700} onSceneMount={this.onSceneMount} style={css} adaptToDeviceRatio={true}/>
        </div>)
    }
}

export default SkullScene;