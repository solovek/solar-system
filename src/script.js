/*yes i'm ashamed of this*/

"use strict";

import Body from "./AstronomicalBody.js";
import Node from "./Node.js";

var vs = `#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var fs = `#version 300 es
precision mediump float;

// Passed in from the vertex shader.
in vec4 v_color;

uniform vec4 u_colorMult;
uniform vec4 u_colorOffset;

out vec4 outColor;

void main() {
   outColor = v_color * u_colorMult + u_colorOffset;
}
`;

/****
 * UI
 */
var time = 0;
const setTime = (event, ui) => {
  time = ui.value;
};

var cameraX = 0;
const setCameraX = (event, ui) => {
  cameraX = ui.value;
};

var cameraY = 0;
const setCameraY = (event, ui) => {
  cameraY = ui.value;
};

var cameraZ = 0;
const setCameraZ = (event, ui) => {
  cameraZ = ui.value;
};

const updateUI = (fn, drawer) => (...args) => {
  fn(...args);
  drawer();
};

const makeSlider = (id, fn, max) =>
  webglLessonsUI.setupSlider(id, { slide: fn, max: max });

function main()
{
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl)
    throw Error("Browser doesn't support webgl");
  
  makeSlider("#x", updateUI(setCameraX, drawScene), 200);
  makeSlider("#y", updateUI(setCameraY, drawScene), 300);
  makeSlider("#z", updateUI(setCameraZ, drawScene), 300);

  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");
  
  var sphereBufferInfo =
      flattenedPrimitives.createSphereBufferInfo(gl, 10, 12, 6);

  // setup GLSL program
  var programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  var sphereVAO =
      twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo);

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(60);

  var bodies = [];
  var objectsToDraw = [];
  var objects = [];

  let sun = new Body({
    orbitMatrix: m4.scaling(1, 1, 1),
    bodyMatrix:  m4.scaling(5, 5, 5),
    drawInfo: {
      uniforms: {
	u_colorOffset: [0.6, 0.6, 0, 1], // yellow
	u_colorMult:   [0.4, 0.4, 0, 1],
      },
      programInfo: programInfo,
      bufferInfo:  sphereBufferInfo,
      vertexArray: sphereVAO
    }
  });

  let mercury = new Body({
    parent:      sun,
    orbitMatrix: m4.translation(100, 0, 0),
    bodyMatrix:  m4.scaling    (1,   1, 1),
    drawInfo: {
      uniforms: {
	u_colorOffset: [0.8, 0.2, 0.2, 1], // blue-green
	u_colorMult:   [0.8, 0.5, 0.2, 1]
      },
      programInfo: programInfo,
      bufferInfo:  sphereBufferInfo,
      vertexArray: sphereVAO
    }
  });

  let venus = new Body({
    parent:      sun,
    orbitMatrix: m4.translation(150, 0, 0),
    bodyMatrix:  m4.scaling    (1,   1, 1),
    drawInfo : {
      uniforms: {
	u_colorOffset: [0.9, 0.1, 0.1, 1], // blue-green
	u_colorMult:   [0.8, 0.5, 0.2, 1]
      },
      programInfo: programInfo,
      bufferInfo:  sphereBufferInfo,
      vertexArray: sphereVAO
    }
  });

  let earth = new Body({
    parent:      sun,
    orbitMatrix: m4.translation(200, 0, 0),
    bodyMatrix:  m4.scaling    (2,   2, 2),
    drawInfo: {
      uniforms: {
	u_colorOffset: [0.2, 0.5, 0.8, 1],  // blue-green
	u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo:  sphereBufferInfo,
      vertexArray: sphereVAO,
    }
  });

  let moon = new Body({
    parent:      earth,
    orbitMatrix: m4.translation(30,  0,   0),
    bodyMatrix:  m4.scaling    (0.4, 0.4, 0.4),
    drawInfo: {
      uniforms: {
	u_colorOffset: [0.6, 0.6, 0.6, 1],  // gray
	u_colorMult:   [0.1, 0.1, 0.1, 1],
      },
      programInfo: programInfo,
      bufferInfo:  sphereBufferInfo,
      vertexArray: sphereVAO,
    }
  });

  let mars = new Body({
    parent:      sun,
    orbitMatrix: m4.translation(300, 0, 0),
    bodyMatrix:  m4.scaling    (3,   3, 3),
    drawInfo: {
      uniforms: {
	u_colorOffset: [1, 0, 0, 1], // blue-green
	u_colorMult:   [0.8, 0.5, 0.2, 1]
      },
      programInfo: programInfo,
      bufferInfo:  sphereBufferInfo,
      vertexArray: sphereVAO
    }
  });
  
  let jupiter = new Body({
    parent:      sun,
    orbitMatrix: m4.translation(400, 0, 0),
    bodyMatrix:  m4.scaling    (5,   5, 5),
    drawInfo: {
      uniforms: {
	u_colorOffset: [0.3, 0.3, 0.3, 1], // blue-green
	u_colorMult:   [0.8, 0.5, 0.2, 1]
      },
      programInfo: programInfo,
      bufferInfo:  sphereBufferInfo,
      vertexArray: sphereVAO
    }
  });
  
  let saturn = new Body({
    parent:      sun,
    orbitMatrix: m4.translation(510, 0, 0),
    bodyMatrix:  m4.scaling    (5,   5, 5),
    drawInfo: {
      uniforms: {
	u_colorOffset: [0.2, 0.5, 0.8, 1], // blue-green
	u_colorMult:   [0.8, 0.5, 0.2, 1]
      },
      programInfo: programInfo,
      bufferInfo:  sphereBufferInfo,
      vertexArray: sphereVAO
    }
  });
  
  let uranus = new Body({
    parent:      sun,
    orbitMatrix: m4.translation(590, 0, 0),
    bodyMatrix:  m4.scaling    (2,   2, 2),
    drawInfo: {
      uniforms: {
	u_colorOffset: [0.2, 0.5, 0.8, 1], // blue-green
	u_colorMult:   [0.8, 0.5, 0.2, 1]
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO
    }
  });

  let neptune = new Body({
    parent:      sun,
    orbitMatrix: m4.translation(640, 0, 0),
    bodyMatrix:  m4.scaling    (2,   2, 2),
    drawInfo: {
      uniforms: {
	u_colorOffset: [0, 0, 0.8, 1], // blue-green
	u_colorMult:   [0.8, 0.5, 0.2, 1]
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
      vertexArray: sphereVAO
    }
  });
  
  var objects = [
    sun,
    mercury,
    venus,
    earth,
    moon,
    mars,
    jupiter,
    saturn,
    uranus,
    neptune
  ];
  
  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    time *= 0.001;

    twgl.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Clear the canvas AND the depth buffer.
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    var cameraPosition = [cameraX,
                          cameraY - 1000, 
                          cameraZ];
    var target = [0, 0, 0];
    var up = [0, 0, 1];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // update the local matrices for each object.
    m4.multiply(m4.yRotation(0.01), sun.orbit.localMatrix, sun.orbit.localMatrix);
    //m4.multiply(m4.yRotation(0.01), moonOrbitNode.localMatrix, moonOrbitNode.localMatrix);
    // spin the sun
    m4.multiply(m4.yRotation(0.005), sun.body.localMatrix, sun.body.localMatrix);
    // spin the earth
    //m4.multiply(m4.yRotation(0.05), earthNode.localMatrix, earthNode.localMatrix);
    // spin the moon
    //m4.multiply(m4.yRotation(-0.01), moonNode.localMatrix, moonNode.localMatrix);

    // Update all world matrices in the scene graph
    sun.orbit.updateWorldMatrix();

    // Compute all the matrices for rendering
    objects.forEach(object => {
      object.drawInfo.uniforms.u_matrix = 
        m4.multiply(viewProjectionMatrix, 
                    object.body.worldMatrix);
    });

    // ------ Draw the objects --------
    let drawInfos = [];
    
    objects.forEach(object => {
      drawInfos.push(object.drawInfo);
    });
    
    twgl.drawObjectList(gl, drawInfos);

    requestAnimationFrame(drawScene);
  }
}

main();
