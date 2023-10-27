// Import dependencies
import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Rhino3dmLoader } from "three/addons/loaders/3DMLoader.js";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export default function ThreeEntryPoint() {
  let INTERSECTED;
  let camera, scene, renderer, raycaster;
  let controls, gui;
  let selectedMaterial, normalMaterial;

  const pointer = new THREE.Vector2();

  // Create Scene
  function init() {
    THREE.Object3D.DEFAULT_UP.set(0, 0, 1);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(26, -10, 5);

    const backgroundColor = new THREE.Color(0x191919);
    scene.background = backgroundColor;

    const light1 = new THREE.AmbientLight(0xffffff);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(0.5, 0, 0.866);
    scene.add(light2);

    raycaster = new THREE.Raycaster();

    selectedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    normalMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const loader = new Rhino3dmLoader();
    //generally, use this for the Library Path: https://cdn.jsdelivr.net/npm/rhino3dm@8.0.0-beta2/
    loader.setLibraryPath("https://unpkg.com/rhino3dm@8.0.0-beta2/");
    loader.load("model/Silver_Towers_Only.3dm", function (object) {
      scene.add(object);
      object.updateMatrixWorld();

      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3()).z / 20;

      const scalar = 1;

      object.scale.set(scalar / size, scalar / size, scalar / size);

      scene.add(object);

      initGUI(object.userData.layers);

      // hide spinner
      document.getElementById("loader").style.display = "none";
    });

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;

    document.addEventListener("click", onPointerClick);
    window.addEventListener("resize", resize);
  }

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  function animate() {
    controls.update();
    renderer.render(scene, camera);

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    const mouseLabel = document.getElementById("mouse-label");

    if (intersects.length > 0) {
      if (INTERSECTED != intersects[0].object) {
        if (INTERSECTED) INTERSECTED.material = normalMaterial;

        INTERSECTED = intersects[0].object;
        INTERSECTED.material = selectedMaterial;

        if (INTERSECTED.userData.attributes.name) {
          console.log(INTERSECTED.userData.attributes.name);
          mouseLabel.innerHTML = INTERSECTED.userData.attributes.name;
          mouseLabel.style.display = "flex";
          mouseLabel.style.color = "Blue";
        } else {
          console.log("No Name");
          mouseLabel.innerHTML = "No Name";
          mouseLabel.style.display = "flex";
          mouseLabel.style.color = "red";
        }
      }
    } else {
      if (INTERSECTED) INTERSECTED.material = selectedMaterial;

      INTERSECTED = null;

      mouseLabel.style.display = "none";
    }

    requestAnimationFrame(animate);
  }

  function initGUI(layers) {
    gui = new GUI({ title: "layers" });

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      gui
        .add(layer, "visible")
        .name(layer.name)
        .onChange(function (val) {
          const name = this.object.name;

          scene.traverse(function (child) {
            if ("attributes" in child.userData) {
              if ("layerIndex" in child.userData.attributes) {
                const layerName =
                  layers[child.userData.attributes.layerIndex].name;

                if (layerName === name) {
                  child.visible = val;
                  layer.visible = val;
                }
              }
            }
          });
        });
    }
  }

  function onPointerClick(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const mouseLabel = document.getElementById("mouse-label");
    mouseLabel.style.left = pointer.x + "px";
    mouseLabel.style.top = pointer.y + "px";
  }

  init();
  animate();
}
