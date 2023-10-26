import ReactDOM from 'react-dom'
import React, { Suspense } from 'react'
import { Canvas, useLoader } from 'react-three-fiber'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader'
import './styles.css'

function RhinoModel() {
  const object = useLoader(Rhino3dmLoader, '/rhino_logo.3dm', (loader) => {
    loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/')
  })
  return <primitive object={object} dispose={null} />
}

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 35] }}>
      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
      <Suspense fallback={null}>
        <RhinoModel />
      </Suspense>
    </Canvas>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
