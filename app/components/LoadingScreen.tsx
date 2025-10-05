'use client';

import { useEffect, useRef, useState } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface LoadingScreenProps {
  duration?: number; // Duration in seconds before animation reverses
}

/**
 * High-performance WebGL loading screen component with 3D rotating sphere
 * Features text mapped to sphere surface with smooth animation from bottom to center
 * @param duration - Number of seconds to display before going down (default: 5)
 */
export default function LoadingScreen({ duration = 5 }: LoadingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Vertex shader for 3D sphere with texture coordinates
    const vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec2 a_textureCoord;
      uniform mat4 u_modelViewMatrix;
      uniform mat4 u_projectionMatrix;
      uniform float u_sphereY;
      uniform float u_zOffset;
      varying vec2 v_textureCoord;
      
      void main() {
        // First apply rotation to the sphere around its center
        vec4 rotatedPosition = u_modelViewMatrix * vec4(a_position, 1.0);
        
        // Then apply vertical animation and positioning
        rotatedPosition.y += u_sphereY;
        rotatedPosition.z -= 4.0 + u_zOffset;
        
        gl_Position = u_projectionMatrix * rotatedPosition;
        v_textureCoord = a_textureCoord;
      }
    `;

    // Fragment shader for rendering text texture on sphere with better transparency
    const fragmentShaderSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      varying vec2 v_textureCoord;
      
      void main() {
        vec4 textColor = texture2D(u_texture, v_textureCoord);
        
        // Use the alpha channel for proper transparency
        float alpha = textColor.a;
        
        // Create crisp black text with smooth alpha blending
        vec3 finalColor = vec3(0.0, 0.0, 0.0); // Black text
        
        // Only render where there's text (alpha > threshold)
        if (alpha < 0.1) {
          discard; // Completely transparent areas
        }
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Compile shader helper function
    function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    }

    // Create and link shader program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    // Generate sphere geometry with texture coordinates
    function createSphere(radius: number, segments: number) {
      const vertices: number[] = [];
      const textureCoords: number[] = [];
      const indices: number[] = [];

      // Generate vertices and texture coordinates
      for (let lat = 0; lat <= segments; lat++) {
        const theta = (lat * Math.PI) / segments;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let lon = 0; lon <= segments; lon++) {
          const phi = (lon * 2 * Math.PI) / segments;
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);

          const x = cosPhi * sinTheta;
          const y = cosTheta;
          const z = sinPhi * sinTheta;

          vertices.push(radius * x, radius * y, radius * z);
          textureCoords.push(1.0 - (lon / segments), lat / segments);
        }
      }

      // Generate indices for triangle strips
      for (let lat = 0; lat < segments; lat++) {
        for (let lon = 0; lon < segments; lon++) {
          const first = lat * (segments + 1) + lon;
          const second = first + segments + 1;

          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
        }
      }

      return { vertices, textureCoords, indices };
    }

    const mainSphere = createSphere(0.6, 64); // Main sphere for main text
    const ringSphere = createSphere(0.6, 64); // Ring sphere for "Team EDC" - same size as main

    // Create and bind vertex buffers for main sphere
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mainSphere.vertices), gl.STATIC_DRAW);

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mainSphere.textureCoords), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mainSphere.indices), gl.STATIC_DRAW);

    // Create and bind vertex buffers for ring sphere
    const ringPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ringPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ringSphere.vertices), gl.STATIC_DRAW);

    const ringTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ringTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ringSphere.textureCoords), gl.STATIC_DRAW);

    const ringIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ringIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ringSphere.indices), gl.STATIC_DRAW);

    // Create text texture with high resolution and better rendering
    function createTextTexture(glContext: WebGLRenderingContext): WebGLTexture | null {
      const textCanvas = document.createElement('canvas');
      // Increase resolution for crisp text
      const scale = 2;
      textCanvas.width = 1024 * scale;
      textCanvas.height = 512 * scale;
      const ctx = textCanvas.getContext('2d');
      if (!ctx) return null;

      // Scale context for high DPI rendering
      ctx.scale(scale, scale);

      // Enable text antialiasing and improve rendering quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Transparent background instead of black
      ctx.clearRect(0, 0, textCanvas.width / scale, textCanvas.height / scale);

      // White text with better font rendering
      ctx.fillStyle = 'white';
      ctx.font = `bold 60px ${inter.style.fontFamily}, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Add text shadow for better contrast
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      const texts = ['Innovate', 'Inspire', 'Elevate'];
      const xPositions = [170, 512, 854]; // Adjusted for higher resolution

      texts.forEach((text, index) => {
        ctx.fillText(text, xPositions[index], 256);
      });

      const texture = glContext.createTexture();
      if (!texture) return null;

      glContext.bindTexture(glContext.TEXTURE_2D, texture);
      glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, textCanvas);
      glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
      glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
      // Use better filtering for crisp text
      glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR_MIPMAP_LINEAR);
      glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
      glContext.generateMipmap(glContext.TEXTURE_2D);

      return texture;
    }

    const mainTextTexture = createTextTexture(gl);
    if (!mainTextTexture) return;

    // Create ring text texture with HIGH RESOLUTION and pristine quality
    function createRingTextTexture(glContext: WebGLRenderingContext): WebGLTexture | null {
      const textCanvas = document.createElement('canvas');
      // MAXIMUM resolution for ultra-crisp text - same as main sphere
      const scale = 4; // Doubled from 2 to 4 for maximum quality
      textCanvas.width = 2048 * scale; // Doubled base resolution
      textCanvas.height = 1024 * scale; // Doubled base resolution
      const ctx = textCanvas.getContext('2d');
      if (!ctx) return null;

      ctx.scale(scale, scale);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, textCanvas.width / scale, textCanvas.height / scale);

      // High-quality font rendering for Team EDC with smaller size
      ctx.fillStyle = 'white';
      ctx.font = `400 32px ${inter.style.fontFamily}, Arial, sans-serif`; // Decreased from 48px to 32px
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Enhanced shadow for better contrast and depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Repeat "Team • EDC" multiple times around the ring with proper spacing
      const text = 'Entrepreneurship Development Cell       •';
      const repetitions = 3; // Keep at 4 to prevent overlapping
      const totalWidth = 2048; // Updated for new resolution
      const spacing = totalWidth / repetitions;

      for (let i = 0; i < repetitions; i++) {
        const x = (i * spacing) + (spacing / 2);
        ctx.fillText(text, x, 512); // Updated Y position for new resolution
      }

      const texture = glContext.createTexture();
      if (!texture) return null;

      glContext.bindTexture(glContext.TEXTURE_2D, texture);
      glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, textCanvas);
      glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
      glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
      glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR_MIPMAP_LINEAR);
      glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
      glContext.generateMipmap(glContext.TEXTURE_2D);

      return texture;
    }

    const ringTextTexture = createRingTextTexture(gl);
    if (!ringTextTexture) return;

    // Get shader attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const textureCoordLocation = gl.getAttribLocation(program, 'a_textureCoord');
    const modelViewMatrixLocation = gl.getUniformLocation(program, 'u_modelViewMatrix');
    const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projectionMatrix');
    const sphereYLocation = gl.getUniformLocation(program, 'u_sphereY');
    const zOffsetLocation = gl.getUniformLocation(program, 'u_zOffset');
    const textureLocation = gl.getUniformLocation(program, 'u_texture');

    // Matrix helper functions
    function createPerspectiveMatrix(fov: number, aspect: number, near: number, far: number): Float32Array {
      const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
      const rangeInv = 1.0 / (near - far);

      return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
      ]);
    }

    function createRotationMatrix(angleX: number, angleY: number, angleZ: number = 0): Float32Array {
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      // Combined XYZ rotation matrix
      return new Float32Array([
        cosY * cosZ, -cosY * sinZ, sinY, 0,
        sinX * sinY * cosZ + cosX * sinZ, -sinX * sinY * sinZ + cosX * cosZ, -sinX * cosY, 0,
        -cosX * sinY * cosZ + sinX * sinZ, cosX * sinY * sinZ + sinX * cosZ, cosX * cosY, 0,
        0, 0, 0, 1
      ]);
    }

    // Animation variables
    let startTime = Date.now();
    let rotationX = 0;
    let rotationY = 0;
    
    // Mouse tracking variables
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationZ = 0;
    let targetZOffset = 0;
    let currentRotationX = 0;
    let currentRotationZ = 0;
    let currentZOffset = 0;
    
    // Mouse movement handler
    function handleMouseMove(event: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Normalize mouse position to -1 to 1 range
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      
      // Convert mouse position to rotation angles (increased sensitivity)
      targetRotationX = mouseY * 1.6; // Vertical mouse movement affects X rotation
      targetRotationZ = mouseX * 1.5; // Horizontal mouse movement affects Z rotation
      
      // Z-axis depth sensitivity based on distance from center
      const distanceFromCenter = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
      targetZOffset = distanceFromCenter * 0.4; // Mouse distance from center affects Z depth (reduced sensitivity)
    }
    
    // Add mouse event listener
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => {
      // Reset to center when mouse leaves
      targetRotationX = 0;
      targetRotationZ = 0;
      targetZOffset = 0;
    });

    function render() {
      if (!canvas || !gl) return;
      
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;

      // Resize canvas to match display size with proper pixel density
      const pixelRatio = window.devicePixelRatio || 1;
      const displayWidth = Math.floor(canvas.clientWidth * pixelRatio);
      const displayHeight = Math.floor(canvas.clientHeight * pixelRatio);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      // Clear with cream background (#f9f4eb)
      gl.clearColor(0.976, 0.957, 0.922, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      
      // Enable blending for better transparency
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      
      // Enable multisampling if available for smoother edges
      if (gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || gl.getExtension('EXT_texture_filter_anisotropic')) {
        // Anisotropic filtering available
      }

      gl.useProgram(program);

      // Animation phases: up (2.5s) -> stay (duration-2.5s) -> down (2.5s) - SNAPPIER!
      const upDuration = 2.5;
      const downDuration = 2.5;
      const stayDuration = Math.max(0, duration - upDuration);
      const totalDuration = upDuration + stayDuration + downDuration;
      
      let sphereY: number;
      let progressValue: number;
      
      if (elapsed <= upDuration) {
        // Going up phase - SNAPPY with stronger easing
        const animationProgress = Math.min(elapsed / upDuration, 1.0);
        const easeOut = 1 - Math.pow(1 - animationProgress, 4); // Stronger ease out (quartic)
        sphereY = -2.5 + (2.5 * easeOut); // From -2.5 to 0 (start further down)
        progressValue = Math.min(Math.floor(1 + (elapsed / upDuration) * 99), 100);
      } else if (elapsed <= upDuration + stayDuration) {
        // Staying at center phase
        sphereY = 0; // Stay at center
        progressValue = 100;
      } else {
        // Going down phase - SNAPPY with stronger easing
        const downElapsed = elapsed - upDuration - stayDuration;
        const animationProgress = Math.min(downElapsed / downDuration, 1.0);
        const easeIn = Math.pow(animationProgress, 4); // Stronger ease in (quartic)
        sphereY = 0 - (2.5 * easeIn); // From 0 to -2.5 (exit further down)
        progressValue = 100; // Keep progress at 100% during exit animation
      }
      
      setProgress(progressValue);

      // Sphere spins from left to right (Y-axis rotation) - continuous
      rotationY += 0.01; // Rotation around Y-axis for left-to-right spin
      
      // Smooth interpolation for mouse-based rotations and Z offset (lerp with 0.1 factor for smooth movement)
      const lerpFactor = 0.1;
      currentRotationX += (targetRotationX - currentRotationX) * lerpFactor;
      currentRotationZ += (targetRotationZ - currentRotationZ) * lerpFactor;
      currentZOffset += (targetZOffset - currentZOffset) * lerpFactor;

      // Set up matrices
      const projectionMatrix = createPerspectiveMatrix(
        Math.PI / 4, // 45 degree field of view
        canvas.width / canvas.height,
        0.1,
        100.0
      );

      // Create combined rotation matrix: automatic Y rotation + mouse-based X/Z rotations (no initial tilt)
      const modelViewMatrix = createRotationMatrix(
        currentRotationX, 
        rotationY, 
        currentRotationZ
      );

      // Set up common uniforms
      gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
      gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
      gl.uniform1f(sphereYLocation, sphereY);
      gl.uniform1f(zOffsetLocation, currentZOffset);

      // Draw main sphere
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, mainTextTexture);
      gl.uniform1i(textureLocation, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionLocation);

      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
      gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(textureCoordLocation);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.drawElements(gl.TRIANGLES, mainSphere.indices.length, gl.UNSIGNED_SHORT, 0);

      // Draw ring sphere with EXACT SAME movement as main sphere
      const ringRotationMatrix = createRotationMatrix(
        currentRotationX, // SAME mouse sensitivity as main sphere
        rotationY, // SAME automatic rotation speed as main sphere
        currentRotationZ  // SAME mouse sensitivity as main sphere
      );
      gl.uniformMatrix4fv(modelViewMatrixLocation, false, ringRotationMatrix);
      
      // Position ring sphere closer to the main sphere
      const ringSphereLowerY = sphereY - 0.15; // Moved closer - reduced from 0.3 to 0.15
      gl.uniform1f(sphereYLocation, ringSphereLowerY);
      // Apply the SAME Z-offset to the ring sphere
      gl.uniform1f(zOffsetLocation, currentZOffset);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, ringTextTexture);
      gl.uniform1i(textureLocation, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, ringPositionBuffer);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionLocation);

      gl.bindBuffer(gl.ARRAY_BUFFER, ringTextureCoordBuffer);
      gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(textureCoordLocation);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ringIndexBuffer);
      gl.drawElements(gl.TRIANGLES, ringSphere.indices.length, gl.UNSIGNED_SHORT, 0);

      // Continue animation
      animationRef.current = requestAnimationFrame(render);
    }

    // Start animation
    render();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Remove event listeners
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [duration]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: '100vw', maxHeight: '100vh' }}
      />
      <div className={`absolute bottom-32 text-black text-3xl font-black tracking-wider ${inter.className}`}>
        {progress}%
      </div>
    </div>
  );
}