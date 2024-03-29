/*yes i'm ashamed of this*/

"use strict";

import Body from "./AstronomicalBody.js";
import Node from "./SceneNode.js";

var vs = `
#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;

// a varying to pass the texture coordinates to the fragment shader
out vec2 v_texcoord;

void main() 
{
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}`;

var fs = `
#version 300 es
precision mediump float;

// Passed in from the vertex shader.
in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main () 
{
  outColor = texture(u_texture, v_texcoord);
}`;

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

function loadTexture(gl, src)
{
  let texture = gl.createTexture();
  
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D (gl.TEXTURE_2D,    0, gl.RGBA, 1, 1, 0, gl.RGBA,
		 gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
  
  let image = new Image();
  image.addEventListener("load",
			 function () {
			   gl.bindTexture(gl.TEXTURE_2D, texture);
			   gl.texImage2D (gl.TEXTURE_2D, 0,
					  gl.RGBA, gl.RGBA,
					  gl.UNSIGNED_BYTE,
					  image)
			   gl.generateMipmap(gl.TEXTURE_2D)});
  image.src = "../data/textures/" + src;
  
  return texture;
}

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
  
  let sphereBufferInfo =
      flattenedPrimitives.createSphereBufferInfo(gl, 10, 12, 6);

  // setup GLSL program
  let programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  
  let sphereVAO =
      twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo);
  
  let texcoordAttrLoc = gl.getAttribLocation(programInfo.program,
					     "a_texcoord");

  let texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0, 0,
      1, 1,
      2, 2
    ]),
    gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texcoordAttrLoc);

  let size = 2;
  let type = gl.FLOAT;
  let normalise = true;
  let stride = 0;
  let offset = 0;

  gl.vertexAttribPointer(texcoordAttrLoc, size,
			 type,            normalise,
			 stride,          offset);
  
  function degToRad(d) {
    return d * Math.PI / 180;
  }

  let fieldOfViewRadians = degToRad(60);

  let sun = new Body({
    orbitMatrix: m4.scaling(1, 1, 1),
    bodyMatrix:  m4.scaling(5, 5, 5),
    drawInfo: {
      uniforms: {
	u_texture: loadTexture(gl, "sun.jpg")
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
	u_texture: loadTexture(gl, "mercury.jpg")
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
	u_texture: loadTexture(gl, "venus.jpg")
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
	u_texture: loadTexture(gl, "earth.jpg")
      },
      programInfo: programInfo,
      bufferInfo:  sphereBufferInfo,
      vertexArray: sphereVAO
    }
  });

  let moon = new Body({
    parent:      earth,
    orbitMatrix: m4.translation(30,  0,   0),
    bodyMatrix:  m4.scaling    (0.4, 0.4, 0.4),
    drawInfo: {
      uniforms: {
	u_texture: loadTexture(gl, "moon.jpg")
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
	u_texture: loadTexture(gl, "mars.jpg")
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
	u_texture: loadTexture(gl, "jupiter.jpg")
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
	u_texture: loadTexture(gl, "saturn.jpg")
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
	u_texture: loadTexture(gl, "uranus.jpg")
      },
      programInfo: programInfo,
      bufferInfo:  sphereBufferInfo,
      vertexArray: sphereVAO
    }
  });

  let neptune = new Body({
    parent:      sun,
    orbitMatrix: m4.translation(640, 0, 0),
    bodyMatrix:  m4.scaling    (2,   2, 2),
    drawInfo: {
      uniforms: {
	u_texture: loadTexture(gl, "neptune.jpg")
      },
      programInfo: programInfo,
      bufferInfo:  sphereBufferInfo,
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
    m4.multiply(m4.yRotation(0.01), moon.orbit.localMatrix, moon.orbit.localMatrix);
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
