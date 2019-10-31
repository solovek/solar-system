/*yes i'm ashamed of this*/

"use strict";

import Body from "./AstronomicalBody.js";
import Node from "./SceneNode.js";

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

let canvas = document.getElementById("canvas");

let cameraX = 0;
let cameraY = 0;
let cameraZ = 0;

let panning = false;
let prevx;
let prevy;

canvas.onmousedown = event => {
  prevx = event.pageX;
  prevy = event.pageY;
  if (event.which == 1)
    panning = true;
  console.log("down");
};

canvas.onmouseup = event => {
  if (event.which == 1)
    panning = false;
  console.log("up");
};

canvas.onmousemove = event => {
  if (panning) {
    let deltax = event.pageX - prevx;
    let deltay = event.pageY - prevy;
    
    cameraX -= deltax;
    cameraZ += deltay;
    
    prevx = event.pageX;
    prevy = event.pageY;
  }
};

document.addEventListener('DOMMouseScroll',
			  event => {
			    cameraY += -event.detail * 10;
			  },
			  false);

function main()
{
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  let gl = canvas.getContext("webgl2");
  if (!gl)
    throw Error("Browser doesn't support webgl");

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
    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    let cameraPosition = [cameraX, cameraY-1000, cameraZ];
    let target = [cameraX, cameraY, cameraZ];
    let up     = [0, 0, 1];
    let cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    let viewMatrix = m4.inverse(cameraMatrix);

    let viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

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
    twgl.drawObjectList(gl, objects.map(obj => obj.drawInfo));

    requestAnimationFrame(drawScene);
  }
}

main();
