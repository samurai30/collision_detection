import React, { Component } from "react";
import * as BABYLON from "babylonjs";
import 'babylonjs-loaders';

export type SceneEventArgs = {
    engine: BABYLON.Engine,
    scene: BABYLON.Scene,
    canvas: HTMLCanvasElement
};

export type SceneProps = {
    engineOptions?: BABYLON.EngineOptions,
    adaptToDeviceRatio?: boolean,
    onSceneMount?: (args: SceneEventArgs) => void,
    width?: number,
    height?: number,
    style?: any
};

export default class Scene extends Component<
    SceneProps & React.HTMLAttributes<HTMLCanvasElement>,
    {}
    > {
    scene: BABYLON.Scene;
    engine: BABYLON.Engine;
    canvas: HTMLCanvasElement;

    onResizeWindow = () => {
        if (this.engine) {
            this.engine.resize();
        }
    };

    componentDidMount() {

        this.engine = new BABYLON.Engine(
            this.canvas,
            true,
            this.props.engineOptions,
            this.props.adaptToDeviceRatio
        );

        let scene = new BABYLON.Scene(this.engine);
        this.scene = scene;

        if (typeof this.props.onSceneMount === "function") {
            this.props.onSceneMount({
                scene,
                engine: this.engine,
                canvas: this.canvas
            });
        } else {
            console.error("onSceneMount function not available");
        }

        // Resize the babylon engine when the window is resized
        window.addEventListener("resize", this.onResizeWindow);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResizeWindow);
    }

    onCanvasLoaded = (c: HTMLCanvasElement) => {
        if (c !== null) {
            this.canvas = c;
        }
    };

    render() {

        let { width, height,style, ...rest } = this.props;

        let opts: any = {};


        if (width !== undefined && height !== undefined) {
            opts.width = width;
            opts.height = height;
            opts.style = style
        }

        return <canvas {...opts} ref={this.onCanvasLoaded} />;
    }
}
