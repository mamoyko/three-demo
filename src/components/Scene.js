import React, {Component} from 'react';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader'
// import * as OBJLoader from 'three-obj-loader';
// OBJLoader(THREE);

class Scene extends Component{
  constructor(props){
    super(props);
    this.state={
    }
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.computeBoundingBox = this.computeBoundingBox.bind(this);
    this.setupScene = this.setupScene.bind(this);
    this.destroyContext = this.destroyContext.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    this.onDocumentMouseWheel = this.onDocumentMouseWheel.bind(this);
    this.getMouseX = this.getMouseX.bind(this);
    this.getMouseY = this.getMouseY.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentWillMount(){
    window.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("touchstart", this.onMouseDown);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("touchend", this.onMouseUp);
    window.addEventListener("mousemove", this.onDocumentMouseMove);
    window.addEventListener("touchmove", this.onDocumentMouseMove);
    window.addEventListener("mousewheel", this.onDocumentMouseWheel, false);
  }

  componentDidMount(){
    this.setupScene();
  }

  setupScene(){

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 ); 
    camera.position.z = 25; 
    camera.position.y = 15; 

    const renderer = new THREE.WebGLRenderer(); 

    const light = new THREE.DirectionalLight("#c1582d", 1);
    light.position.set( 0, -70, 100 ).normalize();
    scene.add(light);

    const ambient = new THREE.AmbientLight("#85b2cd");
    scene.add(ambient);

    const texture = new THREE.Texture();
    const manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {};

    let onProgress = ( xhr ) => {
      if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
      }
    };

    let onError = () => {console.error('err')};
    
    const objs = [];
    const loader = new GLTFLoader();
    loader.load('Assets/new/scene.gltf', (gltf) => {
      gltf.scene.rotation.copy(new THREE.Euler(0, -2 * Math.PI / 4, 0));
      this.mesh = gltf.scene;
      this.mesh.scale.set( 1.3, 1.3, 1.3 );
      this.mesh.position.set(8, -8, 0);
      this.scene.add( this.mesh );
    },onProgress,onError)
    

    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    
    
    this.computeBoundingBox();
  }

  computeBoundingBox(){


    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor(0x00ffff, 1); 
    this.renderer.gammaOutput = true;

    this.container.appendChild(this.renderer.domElement);

    this.camera.lookAt( this.scene.position );

    this.start();
  }
  
  start(){
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  renderScene(){

    
    
	this.renderer.render( this.scene, this.camera );
  }

  animate() {
    this.frameId = requestAnimationFrame(this.animate);
    // this.controls.update();
    this.renderScene();
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  handleWindowResize(){
    // let width = window.innerWidth;
    // let height = window.innerHeight;
    // this.camera.aspect = width/height;
    // this.camera.updateProjectionMatrix();
  }

  onMouseDown(event){
    this.isMouseDown = true;
  }

  onMouseUp(event){
    this.isMouseDown = false;
  }

  onDocumentMouseMove(event){
    if(this.isMouseDown){
      if ( this.mesh ) {
        this.mesh.rotation.y = this.getMouseX(event)/50;
        this.mesh.rotation.x = this.getMouseY(event)/50;
      }
    }
  }

  onDocumentMouseWheel(event){
    console.log('hahah')
  }

  getMouseX(event){
    if (event.type.indexOf("touch") == -1)
        return event.clientX;
    else
        return event.touches[0].clientX;
  }

  getMouseY(event){
    if (event.type.indexOf("touch") == -1)
        return event.clientY;
    else
        return event.touches[0].clientY;
  }

  componentWillUnmount(){
    this.stop();
    this.destroyContext();
  }

  destroyContext(){
    this.container.removeChild(this.renderer.domElement);
    this.renderer.forceContextLoss();
    this.renderer.context = null;
    this.renderer.domElement = null;
    this.renderer = null;
  }


  render(){
    const width = '100%';
    const height = '100%';

    return(
      <div 
        ref={(container) => {this.container = container}}
        style={{width: width, height: height, position: 'absolute', overflow: 'hidden'}}
      >
      </div>
    )
  }
  
}

export default Scene;