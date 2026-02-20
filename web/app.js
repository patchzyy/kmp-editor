var KmpEditorWeb = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/gl/shader.js
  var require_shader = __commonJS({
    "src/gl/shader.js"(exports, module) {
      var GLShader = class _GLShader {
        static makeVertex(gl, src) {
          return _GLShader.make(gl, src, gl.VERTEX_SHADER);
        }
        static makeFragment(gl, src) {
          return _GLShader.make(gl, src, gl.FRAGMENT_SHADER);
        }
        static make(gl, src, kind) {
          let shader = gl.createShader(kind);
          gl.shaderSource(shader, src);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Error compiling shader: \n\n" + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
          }
          return new _GLShader(shader);
        }
        constructor(id) {
          this.id = id;
        }
      };
      var GLProgram = class _GLProgram {
        static makeFromSrc(gl, vertexSrc, fragmentSrc) {
          let vertexShader = GLShader.makeVertex(gl, vertexSrc);
          if (vertexShader == null)
            return;
          let fragmentShader = GLShader.makeFragment(gl, fragmentSrc);
          if (fragmentShader == null)
            return;
          return _GLProgram.make(gl, vertexShader, fragmentShader);
        }
        static make(gl, vertexShader, fragmentShader) {
          let program = gl.createProgram();
          gl.attachShader(program, vertexShader.id);
          gl.attachShader(program, fragmentShader.id);
          gl.linkProgram(program);
          if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Error creating program: \n\n" + gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
          }
          return new _GLProgram(program);
        }
        constructor(id) {
          this.id = id;
          this.attributes = {};
          this.uniforms = {};
          this.hasColor = false;
        }
        registerLocations(gl, attrbs, unifs) {
          for (let attrb of attrbs)
            this.attributes[attrb] = gl.getAttribLocation(this.id, attrb);
          for (let unif of unifs)
            this.uniforms[unif] = gl.getUniformLocation(this.id, unif);
          this.hasColor = attrbs.find((a) => a == "aColor") != null;
          return this;
        }
        use(gl) {
          gl.useProgram(this.id);
          return this;
        }
        bindPosition(gl, attrb, buffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer.id);
          gl.vertexAttribPointer(this.attributes[attrb], 3, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(this.attributes[attrb]);
          return this;
        }
        bindNormals(gl, attrb, buffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer.id);
          gl.vertexAttribPointer(this.attributes[attrb], 3, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(this.attributes[attrb]);
          return this;
        }
        bindColors(gl, attrb, buffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer.id);
          gl.vertexAttribPointer(this.attributes[attrb], 4, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(this.attributes[attrb]);
          return this;
        }
        setFloat(gl, unif, x) {
          gl.uniform1f(this.uniforms[unif], x);
          return this;
        }
        setMat4(gl, unif, matrix) {
          gl.uniformMatrix4fv(this.uniforms[unif], false, matrix.asFloat32Array());
          return this;
        }
        setVec4(gl, unif, vec) {
          gl.uniform4fv(this.uniforms[unif], new Float32Array(vec));
          return this;
        }
        drawTriangles(gl, count, offset = 0) {
          gl.drawArrays(gl.TRIANGLES, offset, count);
          return this;
        }
        drawTriangleStrip(gl, count, offset = 0) {
          gl.drawArrays(gl.TRIANGLE_STRIP, offset, count);
          return this;
        }
      };
      if (module)
        module.exports = { GLShader, GLProgram };
    }
  });

  // src/math/vec3.js
  var require_vec3 = __commonJS({
    "src/math/vec3.js"(exports, module) {
      var Vec3 = class _Vec3 {
        constructor(x, y, z) {
          this.x = x;
          this.y = y;
          this.z = z;
        }
        clone() {
          return new _Vec3(this.x, this.y, this.z);
        }
        magn() {
          return Math.sqrt(this.dot(this));
        }
        normalize() {
          const magn = this.magn();
          return new _Vec3(
            this.x / magn,
            this.y / magn,
            this.z / magn
          );
        }
        add(other) {
          return new _Vec3(
            this.x + other.x,
            this.y + other.y,
            this.z + other.z
          );
        }
        sub(other) {
          return new _Vec3(
            this.x - other.x,
            this.y - other.y,
            this.z - other.z
          );
        }
        neg() {
          return new _Vec3(
            -this.x,
            -this.y,
            -this.z
          );
        }
        scale(f) {
          return new _Vec3(
            this.x * f,
            this.y * f,
            this.z * f
          );
        }
        mul(other) {
          return new _Vec3(
            this.x * other.x,
            this.y * other.y,
            this.z * other.z
          );
        }
        dot(other) {
          return this.x * other.x + this.y * other.y + this.z * other.z;
        }
        cross(other) {
          return new _Vec3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
          );
        }
        lerp(other, amount) {
          return new _Vec3(
            this.x + (other.x - this.x) * amount,
            this.y + (other.y - this.y) * amount,
            this.z + (other.z - this.z) * amount
          );
        }
        min(other) {
          if (other == null)
            return this;
          return new _Vec3(
            Math.min(this.x, other.x),
            Math.min(this.y, other.y),
            Math.min(this.z, other.z)
          );
        }
        max(other) {
          if (other == null)
            return this;
          return new _Vec3(
            Math.max(this.x, other.x),
            Math.max(this.y, other.y),
            Math.max(this.z, other.z)
          );
        }
        project(other) {
          return other.scale(this.dot(other) / other.dot(other));
        }
        projectOnPlane(planeNormal) {
          return this.sub(this.project(planeNormal));
        }
        directionToPlane(planeNormal, pointOnPlane) {
          let vec = this.sub(pointOnPlane);
          let proj = vec.projectOnPlane(planeNormal);
          return pointOnPlane.add(proj).sub(this);
        }
        asArray() {
          return [this.x, this.y, this.z];
        }
        isFinite() {
          return isFinite(this.x) && isFinite(this.y) && isFinite(this.z);
        }
      };
      if (module)
        module.exports = { Vec3 };
    }
  });

  // src/math/mat4.js
  var require_mat4 = __commonJS({
    "src/math/mat4.js"(exports, module) {
      var { Vec3 } = require_vec3();
      var Mat4 = class _Mat4 {
        constructor(cells) {
          this.m = cells;
        }
        static identity() {
          return new _Mat4(
            [
              [1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 1]
            ]
          );
        }
        static translation(x, y, z) {
          return new _Mat4(
            [
              [1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [x, y, z, 1]
            ]
          );
        }
        static scale(x, y, z) {
          return new _Mat4(
            [
              [x, 0, 0, 0],
              [0, y, 0, 0],
              [0, 0, z, 0],
              [0, 0, 0, 1]
            ]
          );
        }
        static rotation(vec, radians) {
          const x = vec.x;
          const y = vec.y;
          const z = vec.z;
          const c = Math.cos(radians);
          const s = Math.sin(radians);
          const t = 1 - c;
          return new _Mat4(
            [
              [t * x * x + c, t * x * y - z * s, t * x * z + y * s, 0],
              [t * x * y + z * s, t * y * y + c, t * y * z - x * s, 0],
              [t * x * z - y * s, t * y * z + x * s, t * z * z + c, 0],
              [0, 0, 0, 1]
            ]
          );
        }
        static rotationFromTo(fromVec, toVec) {
          const axis = fromVec.cross(toVec).normalize();
          const angle = Math.acos(fromVec.dot(toVec));
          if (angle == 0)
            return _Mat4.identity();
          if (angle == Math.PI && fromVec.magn() == Math.abs(fromVec.z))
            return _Mat4.rotation(new Vec3(1, 0, 0), Math.PI);
          if (angle == Math.PI)
            return _Mat4.rotation(new Vec3(0, 0, 1), Math.PI);
          return _Mat4.rotation(axis, -angle);
        }
        static basisRotation(i1, j1, k1, i2, j2, k2) {
          const basis1 = new _Mat4(
            [
              [i1.x, j1.x, k1.x, 0],
              [i1.y, j1.y, k1.y, 0],
              [i1.z, j1.z, k1.z, 0],
              [0, 0, 0, 1]
            ]
          );
          const basis2 = new _Mat4(
            [
              [i2.x, j2.x, k2.x, 0],
              [i2.y, j2.y, k2.y, 0],
              [i2.z, j2.z, k2.z, 0],
              [0, 0, 0, 1]
            ]
          );
          return basis1.mul(basis2.transpose());
        }
        static ortho(left, right, top, bottom, near, far) {
          return new _Mat4(
            [
              [2 / (right - left), 0, 0, 0],
              [0, 2 / (top - bottom), 0, 0],
              [0, 0, -2 / (far - near), 0],
              [-(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1]
            ]
          );
        }
        static frustum(left, right, top, bottom, near, far) {
          return new _Mat4(
            [
              [2 * near / (right - left), 0, 0, 0],
              [0, 2 * near / (top - bottom), 0, 0],
              [(right + left) / (right - left), (top + bottom) / (top - bottom), -(far + near) / (far - near), -1],
              [0, 0, -(2 * far * near) / (far - near), 0]
            ]
          );
        }
        static perspective(fovyRadians, aspectWidthByHeight, near, far) {
          const h = Math.tan(fovyRadians) * near;
          const w = h * aspectWidthByHeight;
          return _Mat4.frustum(-w, w, -h, h, near, far);
        }
        static lookat(eye, target, up) {
          const zaxis = eye.sub(target).normalize();
          const xaxis = zaxis.cross(up).normalize();
          const yaxis = zaxis.cross(xaxis);
          return new _Mat4(
            [
              [xaxis.x, yaxis.x, zaxis.x, 0],
              [xaxis.y, yaxis.y, zaxis.y, 0],
              [xaxis.z, yaxis.z, zaxis.z, 0],
              [-xaxis.dot(eye), -yaxis.dot(eye), -zaxis.dot(eye), 1]
            ]
          );
        }
        transpose() {
          return new _Mat4(
            [
              [this.m[0][0], this.m[1][0], this.m[2][0], this.m[3][0]],
              [this.m[0][1], this.m[1][1], this.m[2][1], this.m[3][1]],
              [this.m[0][2], this.m[1][2], this.m[2][2], this.m[3][2]],
              [this.m[0][3], this.m[1][3], this.m[2][3], this.m[3][3]]
            ]
          );
        }
        mul(other) {
          const a00 = +this.m[0][0];
          const a01 = +this.m[0][1];
          const a02 = +this.m[0][2];
          const a03 = +this.m[0][3];
          const a10 = +this.m[1][0];
          const a11 = +this.m[1][1];
          const a12 = +this.m[1][2];
          const a13 = +this.m[1][3];
          const a20 = +this.m[2][0];
          const a21 = +this.m[2][1];
          const a22 = +this.m[2][2];
          const a23 = +this.m[2][3];
          const a30 = +this.m[3][0];
          const a31 = +this.m[3][1];
          const a32 = +this.m[3][2];
          const a33 = +this.m[3][3];
          const b00 = +other.m[0][0];
          const b01 = +other.m[0][1];
          const b02 = +other.m[0][2];
          const b03 = +other.m[0][3];
          const b10 = +other.m[1][0];
          const b11 = +other.m[1][1];
          const b12 = +other.m[1][2];
          const b13 = +other.m[1][3];
          const b20 = +other.m[2][0];
          const b21 = +other.m[2][1];
          const b22 = +other.m[2][2];
          const b23 = +other.m[2][3];
          const b30 = +other.m[3][0];
          const b31 = +other.m[3][1];
          const b32 = +other.m[3][2];
          const b33 = +other.m[3][3];
          const m00 = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
          const m01 = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
          const m02 = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
          const m03 = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
          const m10 = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
          const m11 = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
          const m12 = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
          const m13 = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
          const m20 = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
          const m21 = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
          const m22 = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
          const m23 = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
          const m30 = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
          const m31 = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
          const m32 = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
          const m33 = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
          return new _Mat4(
            [
              [m00, m01, m02, m03],
              [m10, m11, m12, m13],
              [m20, m21, m22, m23],
              [m30, m31, m32, m33]
            ]
          );
        }
        mulVec4(v) {
          let result = [0, 0, 0, 0];
          for (let i = 0; i < 4; i++) {
            let acc = 0;
            for (let k = 0; k < 4; k++)
              acc += this.m[i][k] * v[k];
            result[i] = acc;
          }
          return result;
        }
        mulPoint(vec) {
          const v = [vec.x, vec.y, vec.z, 1];
          let result = [0, 0, 0, 0];
          for (let i = 0; i < 4; i++) {
            let acc = 0;
            for (let k = 0; k < 4; k++)
              acc += this.m[i][k] * v[k];
            result[i] = acc;
          }
          return new Vec3(result[0], result[1], result[2]);
        }
        mulDirection(vec) {
          const v = [vec.x, vec.y, vec.z, 0];
          let result = [0, 0, 0, 0];
          for (let i = 0; i < 4; i++) {
            let acc = 0;
            for (let k = 0; k < 4; k++)
              acc += this.m[i][k] * v[k];
            result[i] = acc;
          }
          return new Vec3(result[0], result[1], result[2]);
        }
        asFloat32Array() {
          return new Float32Array([
            this.m[0][0],
            this.m[0][1],
            this.m[0][2],
            this.m[0][3],
            this.m[1][0],
            this.m[1][1],
            this.m[1][2],
            this.m[1][3],
            this.m[2][0],
            this.m[2][1],
            this.m[2][2],
            this.m[2][3],
            this.m[3][0],
            this.m[3][1],
            this.m[3][2],
            this.m[3][3]
          ]);
        }
        invert() {
          const a2323 = this.m[2][2] * this.m[3][3] - this.m[2][3] * this.m[3][2];
          const a1323 = this.m[2][1] * this.m[3][3] - this.m[2][3] * this.m[3][1];
          const a1223 = this.m[2][1] * this.m[3][2] - this.m[2][2] * this.m[3][1];
          const a0323 = this.m[2][0] * this.m[3][3] - this.m[2][3] * this.m[3][0];
          const a0223 = this.m[2][0] * this.m[3][2] - this.m[2][2] * this.m[3][0];
          const a0123 = this.m[2][0] * this.m[3][1] - this.m[2][1] * this.m[3][0];
          const a2313 = this.m[1][2] * this.m[3][3] - this.m[1][3] * this.m[3][2];
          const a1313 = this.m[1][1] * this.m[3][3] - this.m[1][3] * this.m[3][1];
          const a1213 = this.m[1][1] * this.m[3][2] - this.m[1][2] * this.m[3][1];
          const a2312 = this.m[1][2] * this.m[2][3] - this.m[1][3] * this.m[2][2];
          const a1312 = this.m[1][1] * this.m[2][3] - this.m[1][3] * this.m[2][1];
          const a1212 = this.m[1][1] * this.m[2][2] - this.m[1][2] * this.m[2][1];
          const a0313 = this.m[1][0] * this.m[3][3] - this.m[1][3] * this.m[3][0];
          const a0213 = this.m[1][0] * this.m[3][2] - this.m[1][2] * this.m[3][0];
          const a0312 = this.m[1][0] * this.m[2][3] - this.m[1][3] * this.m[2][0];
          const a0212 = this.m[1][0] * this.m[2][2] - this.m[1][2] * this.m[2][0];
          const a0113 = this.m[1][0] * this.m[3][1] - this.m[1][1] * this.m[3][0];
          const a0112 = this.m[1][0] * this.m[2][1] - this.m[1][1] * this.m[2][0];
          const det = 1 / (this.m[0][0] * (this.m[1][1] * a2323 - this.m[1][2] * a1323 + this.m[1][3] * a1223) - this.m[0][1] * (this.m[1][0] * a2323 - this.m[1][2] * a0323 + this.m[1][3] * a0223) + this.m[0][2] * (this.m[1][0] * a1323 - this.m[1][1] * a0323 + this.m[1][3] * a0123) - this.m[0][3] * (this.m[1][0] * a1223 - this.m[1][1] * a0223 + this.m[1][2] * a0123));
          return new _Mat4(
            [
              [
                det * (this.m[1][1] * a2323 - this.m[1][2] * a1323 + this.m[1][3] * a1223),
                det * -(this.m[0][1] * a2323 - this.m[0][2] * a1323 + this.m[0][3] * a1223),
                det * (this.m[0][1] * a2313 - this.m[0][2] * a1313 + this.m[0][3] * a1213),
                det * -(this.m[0][1] * a2312 - this.m[0][2] * a1312 + this.m[0][3] * a1212)
              ],
              [
                det * -(this.m[1][0] * a2323 - this.m[1][2] * a0323 + this.m[1][3] * a0223),
                det * (this.m[0][0] * a2323 - this.m[0][2] * a0323 + this.m[0][3] * a0223),
                det * -(this.m[0][0] * a2313 - this.m[0][2] * a0313 + this.m[0][3] * a0213),
                det * (this.m[0][0] * a2312 - this.m[0][2] * a0312 + this.m[0][3] * a0212)
              ],
              [
                det * (this.m[1][0] * a1323 - this.m[1][1] * a0323 + this.m[1][3] * a0123),
                det * -(this.m[0][0] * a1323 - this.m[0][1] * a0323 + this.m[0][3] * a0123),
                det * (this.m[0][0] * a1313 - this.m[0][1] * a0313 + this.m[0][3] * a0113),
                det * -(this.m[0][0] * a1312 - this.m[0][1] * a0312 + this.m[0][3] * a0112)
              ],
              [
                det * -(this.m[1][0] * a1223 - this.m[1][1] * a0223 + this.m[1][2] * a0123),
                det * (this.m[0][0] * a1223 - this.m[0][1] * a0223 + this.m[0][2] * a0123),
                det * -(this.m[0][0] * a1213 - this.m[0][1] * a0213 + this.m[0][2] * a0113),
                det * (this.m[0][0] * a1212 - this.m[0][1] * a0212 + this.m[0][2] * a0112)
              ]
            ]
          ).transpose();
        }
      };
      if (module)
        module.exports = { Mat4 };
    }
  });

  // src/gl/scene.js
  var require_scene = __commonJS({
    "src/gl/scene.js"(exports, module) {
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var GfxScene = class {
        constructor() {
          this.root = new GfxNode();
        }
        clear(gl, r = 0, g = 0, b = 0, a = 1, depth = 1) {
          gl.clearColor(r, g, b, a);
          gl.clearDepth(depth);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        clearDepth(gl, depth = 1) {
          gl.clearDepth(depth);
          gl.clear(gl.DEPTH_BUFFER_BIT);
        }
        render(gl, camera) {
          this.renderNode(gl, camera, null, this.root);
        }
        renderNode(gl, camera, transform, node) {
          if (!node.enabled)
            return;
          if (node instanceof GfxNodeTransform || node instanceof GfxNodeRendererTransform) {
            let nodeMatrix = node.computeMatrix();
            transform = transform == null ? nodeMatrix : transform.mul(nodeMatrix);
          }
          if (node instanceof GfxNodeRenderer || node instanceof GfxNodeRendererTransform) {
            if (node.material != null && node.model != null) {
              node.material.program.use(gl);
              node.material.program.bindPosition(gl, "aPosition", node.model.positions);
              node.material.program.bindNormals(gl, "aNormal", node.model.normals);
              if (node.material.program.hasColor)
                node.material.program.bindColors(gl, "aColor", node.model.colors);
              if (node.material.lastProjectionMatrix !== camera.projection) {
                node.material.lastProjectionMatrix = camera.projection;
                node.material.program.setMat4(gl, "uMatProj", camera.projection);
              }
              if (node.material.lastViewMatrix !== camera.view) {
                node.material.lastViewMatrix = camera.view;
                node.material.program.setMat4(gl, "uMatView", camera.view);
              }
              node.material.program.setMat4(gl, "uMatModel", transform != null ? transform : Mat4.identity());
              node.material.program.setVec4(gl, "uDiffuseColor", node.diffuseColor);
              node.material.program.drawTriangles(gl, node.model.positions.count / 3);
            }
          }
          for (let child of node.children)
            this.renderNode(gl, camera, transform, child);
        }
      };
      var GfxCamera = class {
        constructor() {
          this.projection = Mat4.identity();
          this.view = Mat4.identity();
        }
        setProjection(matrix) {
          this.projection = matrix;
          return this;
        }
        setView(matrix) {
          this.view = matrix;
          return this;
        }
        computeMatrix() {
          return this.projection.mul(this.view);
        }
      };
      var GfxMaterial = class {
        constructor() {
          this.program = null;
        }
        setProgram(program) {
          this.program = program;
          return this;
        }
      };
      var GfxModel = class {
        constructor() {
          this.positions = null;
          this.normals = null;
          this.colors = null;
        }
        setPositions(positions) {
          this.positions = positions;
          return this;
        }
        setNormals(normals) {
          this.normals = normals;
          return this;
        }
        setColors(colors) {
          this.colors = colors;
          return this;
        }
      };
      var GfxNode = class {
        constructor() {
          this.parent = null;
          this.children = [];
          this.enabled = true;
        }
        attach(parent) {
          this.detach();
          parent.children.push(this);
          this.parent = parent;
          return this;
        }
        detach() {
          if (this.parent != null) {
            this.parent.children.splice(this.parent.children.indexOf(this), 1);
            this.parent = null;
          }
          return this;
        }
        setEnabled(enabled) {
          this.enabled = enabled;
          return this;
        }
      };
      var GfxNodeTransform = class extends GfxNode {
        constructor() {
          super();
          this.translation = null;
          this.scaling = null;
          this.rotationAxis = null;
          this.rotationAngle = null;
          this.customMatrix = null;
        }
        setTranslation(vec) {
          this.translation = vec;
          return this;
        }
        setRotation(axis, angle) {
          this.rotationAxis = axis;
          this.rotationAngle = angle;
          return this;
        }
        setScaling(vec) {
          this.scaling = vec;
          return this;
        }
        setCustom(matrix) {
          this.customMatrix = matrix;
          return this;
        }
        computeMatrix() {
          let matrix = Mat4.identity();
          if (this.customMatrix != null)
            matrix = this.customMatrix;
          if (this.translation != null)
            matrix = matrix.mul(Mat4.translation(this.translation.x, this.translation.y, this.translation.z));
          if (this.scaling != null)
            matrix = matrix.mul(Mat4.scale(this.scaling.x, this.scaling.y, this.scaling.z));
          if (this.rotationAxis != null)
            matrix = matrix.mul(Mat4.rotation(this.rotationAxis, this.rotationAngle));
          return matrix;
        }
      };
      var GfxNodeRenderer = class extends GfxNode {
        constructor() {
          super();
          this.model = null;
          this.material = null;
          this.diffuseColor = [1, 1, 1, 1];
        }
        setModel(model) {
          this.model = model;
          return this;
        }
        setMaterial(material) {
          this.material = material;
          return this;
        }
        setDiffuseColor(color) {
          this.diffuseColor = color;
          return this;
        }
      };
      var GfxNodeRendererTransform = class extends GfxNode {
        constructor() {
          super();
          this.model = null;
          this.material = null;
          this.diffuseColor = [1, 1, 1, 1];
          this.translation = null;
          this.scaling = null;
          this.rotationAxis = null;
          this.rotationAngle = null;
          this.customMatrix = null;
        }
        setModel(model) {
          this.model = model;
          return this;
        }
        setMaterial(material) {
          this.material = material;
          return this;
        }
        setDiffuseColor(color) {
          this.diffuseColor = color;
          return this;
        }
        setTranslation(vec) {
          this.translation = vec;
          return this;
        }
        setRotation(axis, angle) {
          this.rotationAxis = axis;
          this.rotationAngle = angle;
          return this;
        }
        setScaling(vec) {
          this.scaling = vec;
          return this;
        }
        setCustomMatrix(matrix) {
          this.customMatrix = matrix;
          return this;
        }
        computeMatrix() {
          let matrix = Mat4.identity();
          if (this.customMatrix != null)
            matrix = matrix.mul(this.customMatrix);
          if (this.scaling != null)
            matrix = matrix.mul(Mat4.scale(this.scaling.x, this.scaling.y, this.scaling.z));
          if (this.translation != null)
            matrix = matrix.mul(Mat4.translation(this.translation.x, this.translation.y, this.translation.z));
          if (this.rotationAxis != null)
            matrix = matrix.mul(Mat4.rotation(this.rotationAxis, this.rotationAngle));
          return matrix;
        }
      };
      if (module)
        module.exports = {
          GfxScene,
          GfxCamera,
          GfxMaterial,
          GfxModel,
          GfxNode,
          GfxNodeTransform,
          GfxNodeRenderer,
          GfxNodeRendererTransform
        };
    }
  });

  // src/gl/buffer.js
  var require_buffer = __commonJS({
    "src/gl/buffer.js"(exports, module) {
      var GLBuffer = class _GLBuffer {
        static makePosition(gl, positions) {
          return _GLBuffer.make(gl, positions);
        }
        static makeNormal(gl, normals) {
          return _GLBuffer.make(gl, normals);
        }
        static makeColor(gl, colors) {
          return _GLBuffer.make(gl, colors);
        }
        static make(gl, data) {
          let buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
          return new _GLBuffer(buffer, data.length);
        }
        constructor(id, count) {
          this.id = id;
          this.count = count;
        }
      };
      if (module)
        module.exports = { GLBuffer };
    }
  });

  // src/util/collisionMesh.js
  var require_collisionMesh = __commonJS({
    "src/util/collisionMesh.js"(exports, module) {
      var { Vec3 } = require_vec3();
      var CollisionMesh = class {
        constructor() {
          this.triangles = [];
          this.bboxMin = null;
          this.bboxMax = null;
          this.cacheSubdiv = null;
        }
        addTri(v1, v2, v3) {
          let tri = {};
          tri.v1 = v1, tri.v1to2 = v2.sub(v1), tri.v1to3 = v3.sub(v1), tri.normal = tri.v1to2.cross(tri.v1to3).normalize();
          tri.bboxMin = v1.min(v2.min(v3));
          tri.bboxMax = v1.max(v2.max(v3));
          this.bboxMin = tri.bboxMin.min(this.bboxMin);
          this.bboxMax = tri.bboxMax.max(this.bboxMax);
          this.triangles.push(tri);
          this.cacheSubdiv = null;
        }
        buildCacheSubdiv(xSubdivs = 10, ySubdivs = 10, zSubdivs = 10) {
          if (this.triangles.length == 0)
            return this;
          let cache = {
            xSubdivs,
            ySubdivs,
            zSubdivs,
            cells: []
          };
          for (let zSubdiv = 0; zSubdiv < zSubdivs; zSubdiv++) {
            let zCells = [];
            let zMin = this.bboxMin.z + (this.bboxMax.z - this.bboxMax.z) / zSubdivs * zSubdiv;
            let zMax = this.bboxMin.z + (this.bboxMax.z - this.bboxMax.z) / zSubdivs * (zSubdiv + 1);
            for (let ySubdiv = 0; ySubdiv < ySubdivs; ySubdiv++) {
              let yCells = [];
              let yMin = this.bboxMin.y + (this.bboxMax.y - this.bboxMax.y) / ySubdivs * ySubdiv;
              let yMax = this.bboxMin.y + (this.bboxMax.y - this.bboxMax.y) / ySubdivs * (ySubdiv + 1);
              for (let xSubdiv = 0; xSubdiv < xSubdivs; xSubdiv++) {
                let xCells = [];
                let xMin = this.bboxMin.x + (this.bboxMax.x - this.bboxMax.x) / xSubdivs * xSubdiv;
                let xMax = this.bboxMin.x + (this.bboxMax.x - this.bboxMax.x) / xSubdivs * (xSubdiv + 1);
                for (let tri of this.triangles) {
                  if (tri.bboxMin.x - 1 > xMax || tri.bboxMax.x + 1 < xMin)
                    continue;
                  if (tri.bboxMin.y - 1 > yMax || tri.bboxMax.y + 1 < yMin)
                    continue;
                  if (tri.bboxMin.z - 1 > zMax || tri.bboxMax.z + 1 < zMin)
                    continue;
                  xCells.push(tri);
                }
                yCells.push(xCells);
              }
              zCells.push(yCells);
            }
            cache.cells.push(zCells);
          }
          this.cacheSubdiv = cache;
          return this;
        }
        raycast(origin, dir, margin = 1e-6) {
          if (false) {
            let cache = this.cacheSubdiv;
            let current = origin;
            let step = dir.normalize().scale(Math.min(
              (this.bboxMax.x - this.bboxMin.x) / cache.xSubdivs,
              (this.bboxMax.y - this.bboxMin.y) / cache.ySubdivs,
              (this.bboxMax.z - this.bboxMin.z) / cache.zSubdivs
            ) * 0.9);
            let lastZCell = -1;
            let lastYCell = -1;
            let lastXCell = -1;
            for (let i = 0; i < 500; i++) {
              if (current.x > this.bboxMax.x && dir.x > 0 || current.x < this.bboxMin.x && dir.x < 0 || current.y > this.bboxMax.y && dir.y > 0 || current.y < this.bboxMin.y && dir.y < 0 || current.z > this.bboxMax.z && dir.z > 0 || current.z < this.bboxMin.z && dir.z < 0)
                break;
              let xCell = Math.floor((current.x - this.bboxMin.x) / (this.bboxMax.x - this.bboxMin.x) * cache.xSubdivs);
              let yCell = Math.floor((current.y - this.bboxMin.y) / (this.bboxMax.y - this.bboxMin.y) * cache.ySubdivs);
              let zCell = Math.floor((current.z - this.bboxMin.z) / (this.bboxMax.z - this.bboxMin.z) * cache.zSubdivs);
              if (xCell >= 0 && xCell < cache.xSubdivs) {
                if (yCell >= 0 && yCell < cache.ySubdivs) {
                  if (zCell >= 0 && zCell < cache.zSubdivs) {
                    if (xCell != lastXCell || yCell != lastYCell || zCell != lastZCell) {
                      let hit = this.raycastTris(origin, dir, cache.cells[zCell][yCell][xCell], margin);
                      if (hit != null) {
                        console.log(i);
                        return hit;
                      }
                    }
                  }
                }
              }
              lastXCell = xCell;
              lastYCell = yCell;
              lastZCell = zCell;
              current = current.add(step);
            }
            return null;
          }
          return this.raycastTris(origin, dir, this.triangles, margin);
        }
        raycastTris(origin, dir, tris, margin = 1e-6) {
          let nearestHit = null;
          for (let tri of tris) {
            const crossP = dir.cross(tri.v1to2);
            const det = crossP.dot(tri.v1to3);
            if (det < margin)
              continue;
            const v1toOrigin = origin.sub(tri.v1);
            const u = v1toOrigin.dot(crossP);
            if (u < 0 || u > det)
              continue;
            const crossQ = v1toOrigin.cross(tri.v1to3);
            const v = dir.dot(crossQ);
            if (v < 0 || u + v > det)
              continue;
            const distScaled = Math.abs(tri.v1to2.dot(crossQ) / det);
            if (nearestHit == null || distScaled < nearestHit.distScaled) {
              nearestHit = {
                distScaled,
                position: origin.add(dir.scale(distScaled)),
                u,
                v,
                tri
              };
            }
          }
          return nearestHit;
        }
        solve(pos, speed, margin = 0.1, friction = 0.01, cutoff = 1e-3) {
          let iters = 0;
          while (speed.magn() > 1e-3 && iters < 10) {
            iters += 1;
            let speedMagn = speed.magn();
            let speedNorm = speed.normalize();
            let hit = this.raycast(pos, speedNorm);
            if (hit == null || hit.distScaled >= speedMagn + margin) {
              pos = pos.add(speed);
              speed = new Vec3(0, 0, 0);
              break;
            } else {
              speed = speedNorm.scale(speedMagn - (hit.distScaled - margin) - friction).projectOnPlane(hit.tri.normal);
              pos = pos.add(speedNorm.scale(hit.distScaled - margin));
            }
          }
          return pos;
        }
      };
      if (module)
        module.exports = { CollisionMesh };
    }
  });

  // src/util/modelBuilder.js
  var require_modelBuilder = __commonJS({
    "src/util/modelBuilder.js"(exports, module) {
      var { GfxModel } = require_scene();
      var { GLBuffer } = require_buffer();
      var { CollisionMesh } = require_collisionMesh();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var ModelBuilder = class {
        constructor() {
          this.positions = [];
          this.normals = [];
          this.colors = [];
        }
        addTri(v1, v2, v3, c1 = null, c2 = null, c3 = null) {
          this.positions.push(v1);
          this.positions.push(v2);
          this.positions.push(v3);
          this.normals.push(new Vec3(0, 0, 0));
          this.normals.push(new Vec3(0, 0, 0));
          this.normals.push(new Vec3(0, 0, 0));
          this.colors.push(c1 ? c1 : [1, 1, 1, 1]);
          this.colors.push(c2 ? c2 : [1, 1, 1, 1]);
          this.colors.push(c3 ? c3 : [1, 1, 1, 1]);
          return this;
        }
        addQuad(v1, v2, v3, v4, c1 = null, c2 = null, c3 = null, c4 = null) {
          this.addTri(v1, v2, v3, c1, c2, c3);
          this.addTri(v1, v3, v4, c1, c3, c4);
          return this;
        }
        addQuadSubdiv(v1, v2, v3, v4, subdivs) {
          for (let j = 0; j < subdivs; j++) {
            for (let i = 0; i < subdivs; i++) {
              let p1 = v1.lerp(v2, (i + 0) / subdivs);
              let p2 = v1.lerp(v2, (i + 1) / subdivs);
              let p3 = v4.lerp(v3, (i + 1) / subdivs);
              let p4 = v4.lerp(v3, (i + 0) / subdivs);
              let f1 = p1.lerp(p4, (j + 0) / subdivs);
              let f2 = p2.lerp(p3, (j + 0) / subdivs);
              let f3 = p2.lerp(p3, (j + 1) / subdivs);
              let f4 = p1.lerp(p4, (j + 1) / subdivs);
              this.addQuad(f1, f2, f3, f4);
            }
          }
          return this;
        }
        addCube(x1, y1, z1, x2, y2, z2, subdivs = 1) {
          let v1Top = new Vec3(x1, y1, z1);
          let v2Top = new Vec3(x2, y1, z1);
          let v3Top = new Vec3(x2, y2, z1);
          let v4Top = new Vec3(x1, y2, z1);
          let v1Bot = new Vec3(x1, y1, z2);
          let v2Bot = new Vec3(x2, y1, z2);
          let v3Bot = new Vec3(x2, y2, z2);
          let v4Bot = new Vec3(x1, y2, z2);
          this.addQuadSubdiv(v1Top, v2Top, v3Top, v4Top, subdivs);
          this.addQuadSubdiv(v1Bot, v4Bot, v3Bot, v2Bot, subdivs);
          this.addQuadSubdiv(v2Top, v1Top, v1Bot, v2Bot, subdivs);
          this.addQuadSubdiv(v3Top, v2Top, v2Bot, v3Bot, subdivs);
          this.addQuadSubdiv(v4Top, v3Top, v3Bot, v4Bot, subdivs);
          this.addQuadSubdiv(v1Top, v4Top, v4Bot, v1Bot, subdivs);
          return this;
        }
        addSphere(x1, y1, z1, x2, y2, z2, subdivs = 8) {
          let index = this.positions.length;
          this.addCube(x1, y1, z1, x2, y2, z2, subdivs);
          let c = new Vec3(
            (x1 + x2) / 2,
            (y1 + y2) / 2,
            (z1 + z2) / 2
          );
          let size = new Vec3(
            Math.abs(x2 - x1) / 2,
            Math.abs(y2 - y1) / 2,
            Math.abs(z2 - z1) / 2
          );
          for (let i = index; i < this.positions.length; i++)
            this.positions[i] = c.add(this.positions[i].sub(c).normalize().mul(size));
          return this;
        }
        addCone(x1, y1, z1, x2, y2, z2, subdivs = 8, upVec = null) {
          let index = this.positions.length;
          let cx = (x1 + x2) / 2;
          let cy = (y1 + y2) / 2;
          let sx = (x2 - x1) / 2;
          let sy = (y2 - y1) / 2;
          for (let i = 0; i < subdivs; i++) {
            let angle0 = (i + 0) / subdivs * Math.PI * 2;
            let angle1 = (i + 1) / subdivs * Math.PI * 2;
            let cos0 = Math.cos(angle0);
            let cos1 = Math.cos(angle1);
            let sin0 = Math.sin(angle0);
            let sin1 = Math.sin(angle1);
            this.addTri(
              new Vec3(cx + cos0 * sx, cy + sin0 * sy, z1),
              new Vec3(cx + cos1 * sx, cy + sin1 * sy, z1),
              new Vec3(cx, cy, z1)
            );
            this.addTri(
              new Vec3(cx + cos1 * sx, cy + sin1 * sy, z1),
              new Vec3(cx + cos0 * sx, cy + sin0 * sy, z1),
              new Vec3(cx, cy, z2)
            );
          }
          if (upVec != null) {
            let matrix = Mat4.rotationFromTo(new Vec3(0, 0, -1), upVec);
            for (let i = index; i < this.positions.length; i++)
              this.positions[i] = matrix.mulPoint(this.positions[i]);
          }
          return this;
        }
        addCylinder(x1, y1, z1, x2, y2, z2, subdivs = 8, upVec = null) {
          let index = this.positions.length;
          let cx = (x1 + x2) / 2;
          let cy = (y1 + y2) / 2;
          let sx = (x2 - x1) / 2;
          let sy = (y2 - y1) / 2;
          for (let i = 0; i < subdivs; i++) {
            let angle0 = (i + 0) / subdivs * Math.PI * 2;
            let angle1 = (i + 1) / subdivs * Math.PI * 2;
            let cos0 = Math.cos(angle0);
            let cos1 = Math.cos(angle1);
            let sin0 = Math.sin(angle0);
            let sin1 = Math.sin(angle1);
            this.addTri(
              new Vec3(cx + cos0 * sx, cy + sin0 * sy, z1),
              new Vec3(cx + cos1 * sx, cy + sin1 * sy, z1),
              new Vec3(cx, cy, z1)
            );
            this.addTri(
              new Vec3(cx + cos1 * sx, cy + sin1 * sy, z2),
              new Vec3(cx + cos0 * sx, cy + sin0 * sy, z2),
              new Vec3(cx, cy, z2)
            );
            this.addQuad(
              new Vec3(cx + cos1 * sx, cy + sin1 * sy, z1),
              new Vec3(cx + cos0 * sx, cy + sin0 * sy, z1),
              new Vec3(cx + cos0 * sx, cy + sin0 * sy, z2),
              new Vec3(cx + cos1 * sx, cy + sin1 * sy, z2)
            );
          }
          if (upVec != null) {
            let matrix = Mat4.rotationFromTo(new Vec3(0, 0, -1), upVec);
            for (let i = index; i < this.positions.length; i++)
              this.positions[i] = matrix.mulPoint(this.positions[i]);
          }
          return this;
        }
        getBoundingBox() {
          let bbox = {
            xMin: null,
            yMin: null,
            zMin: null,
            xMax: null,
            yMax: null,
            zMax: null
          };
          for (let pos of this.positions) {
            bbox.xMin = bbox.xMin == null ? pos.x : Math.min(bbox.xMin, pos.x);
            bbox.yMin = bbox.xMin == null ? pos.y : Math.min(bbox.yMin, pos.y);
            bbox.zMin = bbox.xMin == null ? pos.z : Math.min(bbox.zMin, pos.z);
            bbox.xMax = bbox.xMax == null ? pos.x : Math.max(bbox.xMax, pos.x);
            bbox.yMax = bbox.xMax == null ? pos.y : Math.max(bbox.yMax, pos.y);
            bbox.zMax = bbox.xMax == null ? pos.z : Math.max(bbox.zMax, pos.z);
          }
          bbox.xSize = bbox.xMax - bbox.xMin;
          bbox.ySize = bbox.yMax - bbox.yMin;
          bbox.zSize = bbox.zMax - bbox.zMin;
          bbox.xCenter = (bbox.xMin + bbox.xMax) / 2;
          bbox.yCenter = (bbox.yMin + bbox.yMax) / 2;
          bbox.zCenter = (bbox.zMin + bbox.zMax) / 2;
          return bbox;
        }
        getSaneBoundingBox(maxSize = 1e5) {
          let center = this.getMedianCenter();
          let bbox = {
            xMin: null,
            yMin: null,
            zMin: null,
            xMax: null,
            yMax: null,
            zMax: null
          };
          for (let pos of this.positions) {
            if (Math.abs(pos.x - center.x) < maxSize) {
              bbox.xMin = bbox.xMin == null ? pos.x : Math.min(bbox.xMin, pos.x);
              bbox.xMax = bbox.xMax == null ? pos.x : Math.max(bbox.xMax, pos.x);
            }
            if (Math.abs(pos.y - center.y) < maxSize) {
              bbox.yMin = bbox.xMin == null ? pos.y : Math.min(bbox.yMin, pos.y);
              bbox.yMax = bbox.xMax == null ? pos.y : Math.max(bbox.yMax, pos.y);
            }
            if (Math.abs(pos.z - center.z) < maxSize) {
              bbox.zMin = bbox.xMin == null ? pos.z : Math.min(bbox.zMin, pos.z);
              bbox.zMax = bbox.xMax == null ? pos.z : Math.max(bbox.zMax, pos.z);
            }
          }
          bbox.xSize = bbox.xMax - bbox.xMin;
          bbox.ySize = bbox.yMax - bbox.yMin;
          bbox.zSize = bbox.zMax - bbox.zMin;
          bbox.xCenter = (bbox.xMin + bbox.xMax) / 2;
          bbox.yCenter = (bbox.yMin + bbox.yMax) / 2;
          bbox.zCenter = (bbox.zMin + bbox.zMax) / 2;
          return bbox;
        }
        getMedianCenter() {
          if (this.positions.length == 0)
            return { x: 0, y: 0, z: 0 };
          let xs = [];
          let ys = [];
          let zs = [];
          for (let pos of this.positions) {
            xs.push(pos.x);
            ys.push(pos.y);
            zs.push(pos.z);
          }
          xs.sort((a, b) => a - b);
          ys.sort((a, b) => a - b);
          zs.sort((a, b) => a - b);
          return {
            x: xs[Math.floor(xs.length / 2)],
            y: ys[Math.floor(xs.length / 2)],
            z: zs[Math.floor(xs.length / 2)]
          };
        }
        makeDoubleSided() {
          let len = this.positions.length;
          for (let i = 0; i < len; i += 3) {
            let v1 = this.positions[i + 0];
            let v2 = this.positions[i + 1];
            let v3 = this.positions[i + 2];
            this.addTri(v1, v3, v2);
          }
          return this;
        }
        calculateNormals(maxSmoothAngle = 1.5) {
          for (let i = 0; i < this.positions.length; i += 3) {
            let v1 = this.positions[i + 0];
            let v2 = this.positions[i + 1];
            let v3 = this.positions[i + 2];
            let v1to2 = v2.sub(v1);
            let v1to3 = v3.sub(v1);
            let normal = v1to2.cross(v1to3).normalize();
            this.normals[i + 0] = normal;
            this.normals[i + 1] = normal;
            this.normals[i + 2] = normal;
          }
          return this;
          const rounding = 1e-3;
          const hash = (vec) => {
            return Math.round(vec.x * rounding) / rounding * 1e6 + Math.round(vec.y * rounding) / rounding * 1e3 + Math.round(vec.z * rounding) / rounding;
          };
          let verticesSet = /* @__PURE__ */ new Map();
          for (let j = 0; j < this.positions.length; j++) {
            let key = hash(this.positions[j]);
            let value = verticesSet.get(key);
            if (value === void 0)
              verticesSet.set(key, [j]);
            else
              value.push(j);
          }
          let normalAccum = [];
          let normalCount = [];
          for (let j = 0; j < this.positions.length; j++) {
            normalAccum[j] = this.normals[j];
            normalCount[j] = 1;
            let vertices = verticesSet.get(hash(this.positions[j]));
            if (vertices === void 0)
              continue;
            for (let i of vertices) {
              if (i == j)
                continue;
              if (Math.abs(Math.acos(this.normals[j].dot(this.normals[i]))) <= maxSmoothAngle) {
                normalAccum[j] = normalAccum[j].add(this.normals[i]);
                normalCount[j] += 1;
              }
            }
          }
          for (let i = 0; i < this.positions.length; i++)
            this.normals[i] = normalAccum[i].scale(1 / normalCount[i]).normalize();
          return this;
        }
        makeModel(gl) {
          let positions = [];
          let normals = [];
          let colors = [];
          for (let i = 0; i < this.positions.length; i++) {
            positions.push(this.positions[i].x);
            positions.push(this.positions[i].y);
            positions.push(this.positions[i].z);
            normals.push(this.normals[i].x);
            normals.push(this.normals[i].y);
            normals.push(this.normals[i].z);
            colors.push(this.colors[i][0]);
            colors.push(this.colors[i][1]);
            colors.push(this.colors[i][2]);
            colors.push(this.colors[i][3]);
          }
          let model = new GfxModel().setPositions(GLBuffer.makePosition(gl, positions)).setNormals(GLBuffer.makeNormal(gl, normals)).setColors(GLBuffer.makeColor(gl, colors));
          return model;
        }
        makeCollision() {
          let col = new CollisionMesh();
          for (let i = 0; i < this.positions.length; i += 3)
            col.addTri(this.positions[i + 0], this.positions[i + 1], this.positions[i + 2]);
          return col;
        }
      };
      if (module)
        module.exports = { ModelBuilder };
    }
  });

  // src/math/geometry.js
  var require_geometry = __commonJS({
    "src/math/geometry.js"(exports, module) {
      var Geometry = class _Geometry {
        static linePointMinimumVec(origin, direction, point) {
          let pointFromOrigin = point.sub(origin);
          let pointOverDirection = pointFromOrigin.project(direction);
          return pointFromOrigin.sub(pointOverDirection);
        }
        static linePointDistance(origin, direction, point) {
          return _Geometry.linePointMinimumVec(origin, direction, point).magn();
        }
        static lineLineDistance(origin1, direction1, origin2, direction2) {
          let cross = direction1.cross(direction2);
          let crossMagn = cross.magn();
          if (crossMagn < 1e-3)
            return Infinity;
          return Math.abs(cross.scale(1 / crossMagn).dot(origin2.sub(origin1)));
        }
        // Projects line 1 such that it will intersect line 2
        static lineLineProjection(origin1, direction1, origin2, direction2) {
          let normal = _Geometry.linePointMinimumVec(origin2, direction2, origin1).cross(direction2).normalize();
          return direction1.projectOnPlane(normal);
        }
        static lineZPlaneIntersection(origin, direction, planeZ) {
          return origin.add(direction.scale((planeZ - origin.z) / direction.z));
        }
      };
      if (module)
        module.exports = { Geometry };
    }
  });

  // src/viewer/pointViewer.js
  var require_pointViewer = __commonJS({
    "src/viewer/pointViewer.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var PointViewer = class {
        constructor(window2, viewer, data) {
          this.window = window2;
          this.viewer = viewer;
          this.data = data;
          this.renderers = [];
          this.scene = new GfxScene();
          this.sceneAfter = new GfxScene();
          this.hoveringOverPoint = null;
          this.targetPos = null;
          this.ctrlIsHeld = false;
          this.lastAxisHotkey = "";
          this.snapCollision = this.viewer.cfg.snapToCollision;
          this.lockX = this.viewer.cfg.lockAxisX;
          this.lockY = this.viewer.cfg.lockAxisY;
          this.lockZ = this.viewer.cfg.lockAxisZ;
          this.modelPoint = new ModelBuilder().addSphere(-150, -150, -150, 150, 150, 150).calculateNormals().makeModel(viewer.gl);
          this.modelPointSelection = new ModelBuilder().addSphere(-250, -250, 250, 250, 250, -250).calculateNormals().makeModel(viewer.gl);
          this.modelPath = new ModelBuilder().addCylinder(-150, -150, 0, 150, 150, 1e3, 8, new Vec3(1, 0, 0)).calculateNormals().makeModel(viewer.gl);
          this.modelArrow = new ModelBuilder().addCone(-250, -250, 1e3, 250, 250, 1300, 8, new Vec3(1, 0, 0)).calculateNormals().makeModel(viewer.gl);
          this.modelArrowUp = new ModelBuilder().addCone(-150, -150, 600, 150, 150, 1500, 8, new Vec3(0, 0.01, 1).normalize()).calculateNormals().makeModel(viewer.gl);
        }
        setData(data) {
          this.data = data;
          this.refresh();
        }
        destroy() {
          for (let r of this.renderers)
            r.detach();
          this.renderers = [];
        }
        refresh() {
          for (let r of this.renderers)
            r.detach();
          this.renderers = [];
          for (let point of this.points().nodes) {
            if (point.selected === void 0) {
              point.selected = false;
              point.moveOrigin = point.pos;
            }
            point.renderer = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelPoint).setMaterial(this.viewer.material);
            point.rendererSelected = new GfxNodeRendererTransform().attach(this.sceneAfter.root).setModel(this.modelPointSelection).setMaterial(this.viewer.materialUnshaded).setEnabled(false);
            point.rendererSelectedCore = new GfxNodeRenderer().attach(point.rendererSelected).setModel(this.modelPoint).setMaterial(this.viewer.material);
            point.rendererDirection = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelPath).setMaterial(this.viewer.material);
            point.rendererDirectionArrow = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelArrow).setMaterial(this.viewer.material);
            point.rendererDirectionUp = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelArrowUp).setMaterial(this.viewer.material);
            this.renderers.push(point.renderer);
            this.renderers.push(point.rendererSelected);
            this.renderers.push(point.rendererDirection);
            this.renderers.push(point.rendererDirectionArrow);
            this.renderers.push(point.rendererDirectionUp);
          }
        }
        getHoveringOverElement(cameraPos, ray, distToHit, includeSelected = true) {
          let elem = null;
          let minDistToCamera = distToHit + 1e3;
          let minDistToPoint = 1e6;
          for (let point of this.points().nodes) {
            if (!includeSelected && point.selected)
              continue;
            let distToCamera = point.pos.sub(cameraPos).magn();
            if (distToCamera >= minDistToCamera)
              continue;
            let scale = this.viewer.getElementScale(point.pos);
            let pointDistToRay = Geometry.linePointDistance(ray.origin, ray.direction, point.pos);
            if (pointDistToRay < 150 * scale * 4 && pointDistToRay < minDistToPoint) {
              elem = point;
              minDistToCamera = distToCamera;
              minDistToPoint = pointDistToRay;
            }
          }
          return elem;
        }
        selectAll() {
          for (let point of this.points().nodes)
            point.selected = true;
          this.refreshPanels();
        }
        unselectAll() {
          for (let point of this.points().nodes)
            point.selected = false;
          this.refreshPanels();
        }
        toggleAllSelection() {
          let hasSelection = this.points().nodes.find((p) => p.selected) != null;
          if (hasSelection)
            this.unselectAll();
          else
            this.selectAll();
        }
        deleteSelectedPoints() {
          let pointsToDelete = [];
          for (let point of this.points().nodes) {
            if (!point.selected)
              continue;
            pointsToDelete.push(point);
          }
          for (let point of pointsToDelete)
            this.points().removeNode(point);
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        snapSelectedToY() {
          for (let point of this.points().nodes) {
            if (point.selected) {
              let hit = this.viewer.collision.raycast(point.pos, new Vec3(0, 0, 1));
              if (hit != null && point.pos.sub(hit.position).magn() > 1) {
                let check = this.viewer.collision.raycast(hit.position, new Vec3(0, 0, 1));
                if (check != null && check.position.sub(hit.position).magn() > 1)
                  point.pos = hit.position.sub(point.pos.mul(new Vec3(0, 0, 2))).mul(new Vec3(1, 1, -1));
                else
                  point.pos = hit.position;
              }
            }
          }
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        onKeyDown(ev) {
          if (this.viewer.mouseDown && !ev.ctrlKey && this.viewer.mouseAction == "move") {
            const setAxisLocks = (s, x, y, z) => {
              if (this.lastAxisHotkey === s)
                return false;
              if (!this.lastAxisHotkey) {
                this.snapCollision = this.viewer.cfg.snapToCollision;
                this.lockX = this.viewer.cfg.lockAxisX;
                this.lockY = this.viewer.cfg.lockAxisY;
                this.lockZ = this.viewer.cfg.lockAxisZ;
              }
              this.lastAxisHotkey = s;
              if (this.hoveringOverPoint != null)
                this.targetPos = this.hoveringOverPoint.pos;
              if (x || y || z)
                this.viewer.cfg.snapToCollision = false;
              this.viewer.cfg.lockAxisX = x;
              this.viewer.cfg.lockAxisY = y;
              this.viewer.cfg.lockAxisZ = z;
              this.window.refreshPanels();
            };
            switch (ev.key) {
              case "X":
                setAxisLocks("X", true, false, false);
                return true;
              case "x":
                setAxisLocks("x", false, true, true);
                return true;
              case "Y":
                setAxisLocks("Y", false, true, false);
                return true;
              case "y":
                setAxisLocks("y", true, false, true);
                return true;
              case "Z":
                setAxisLocks("Z", false, false, true);
                return true;
              case "z":
                setAxisLocks("z", true, true, false);
                return true;
            }
          }
          switch (ev.key) {
            case "A":
            case "a":
              this.toggleAllSelection();
              return true;
            case "Backspace":
            case "Delete":
            case "X":
            case "x":
              this.deleteSelectedPoints();
              return true;
            case "Y":
            case "y":
              this.snapSelectedToY();
              return true;
          }
          return false;
        }
        onMouseDown(ev, x, y, cameraPos, ray, hit, distToHit, mouse3DPos) {
          for (let point of this.points().nodes)
            point.moveOrigin = point.pos;
          let hoveringOverElem = this.getHoveringOverElement(cameraPos, ray, distToHit);
          if (ev.altKey || !(ev.ctrlKey || ev.metaKey) && (hoveringOverElem == null || !hoveringOverElem.selected))
            this.unselectAll();
          if (ev.ctrlKey || ev.metaKey)
            this.ctrlIsHeld = true;
          if (hoveringOverElem != null) {
            if (ev.altKey) {
              if (this.points().nodes.length >= this.points().maxNodes) {
                alert("KMP error!\n\nMaximum number of points surpassed (" + this.points().maxNodes + ")");
                return;
              }
              let newPoint = this.points().addNode();
              this.points().onCloneNode(newPoint, hoveringOverElem);
              this.refresh();
              newPoint.selected = true;
              this.targetPos = newPoint.moveOrigin.clone();
              this.viewer.setCursor("-webkit-grabbing");
              this.refreshPanels();
              this.window.setNotSaved();
            } else {
              hoveringOverElem.selected = true;
              this.targetPos = hoveringOverElem.moveOrigin.clone();
              this.refreshPanels();
              this.viewer.setCursor("-webkit-grabbing");
            }
          } else if (ev.altKey) {
            if (this.points().nodes.length >= this.points().maxNodes) {
              alert("KMP error!\n\nMaximum number of points surpassed (" + this.points().maxNodes + ")");
              return;
            }
            let newPoint = this.points().addNode();
            newPoint.pos = mouse3DPos;
            this.refresh();
            newPoint.selected = true;
            this.targetPos = newPoint.moveOrigin.clone();
            this.viewer.setCursor("-webkit-grabbing");
            this.refreshPanels();
            this.window.setNotSaved();
          }
        }
        onMouseMove(ev, x, y, cameraPos, ray, hit, distToHit) {
          if (!this.viewer.mouseDown || this.ctrlIsHeld) {
            let lastHover = this.hoveringOverPoint;
            this.hoveringOverPoint = this.getHoveringOverElement(cameraPos, ray, distToHit);
            if (this.hoveringOverPoint != null) {
              this.viewer.setCursor("-webkit-grab");
              if (this.ctrlIsHeld) {
                this.hoveringOverPoint.selected = true;
                this.refreshPanels();
              }
            }
            if (this.hoveringOverPoint != lastHover)
              this.viewer.render();
          } else if (this.viewer.mouseAction == "move") {
            this.window.setNotSaved();
            this.viewer.setCursor("-webkit-grabbing");
            let moveVector = null;
            let screenPosMoved = this.viewer.pointToScreen(this.targetPos);
            screenPosMoved.x += this.viewer.mouseMoveOffsetPixels.x;
            screenPosMoved.y += this.viewer.mouseMoveOffsetPixels.y;
            let pointRayMoved = this.viewer.getScreenRay(screenPosMoved.x, screenPosMoved.y);
            let hit2 = this.viewer.collision.raycast(pointRayMoved.origin, pointRayMoved.direction);
            if (this.viewer.cfg.snapToCollision && hit2 != null)
              moveVector = hit2.position.sub(this.targetPos);
            else {
              let screenPos = this.viewer.pointToScreen(this.targetPos);
              let pointRay = this.viewer.getScreenRay(screenPos.x, screenPos.y);
              let origDistToScreen = this.targetPos.sub(pointRay.origin).magn();
              let direction = pointRayMoved.direction;
              if (this.viewer.cfg.lockAxisX && this.viewer.cfg.lockAxisY && this.viewer.cfg.lockAxisZ) {
                return;
              } else if (this.viewer.cfg.lockAxisX) {
                if (this.viewer.cfg.lockAxisY)
                  direction = Geometry.lineLineProjection(pointRayMoved.origin, direction, this.targetPos, new Vec3(0, 1, 0));
                else if (this.viewer.cfg.lockAxisZ)
                  direction = Geometry.lineLineProjection(pointRayMoved.origin, direction, this.targetPos, new Vec3(0, 0, 1));
                direction = direction.scale((this.targetPos.x - pointRayMoved.origin.x) / direction.x);
              } else if (this.viewer.cfg.lockAxisY) {
                if (this.viewer.cfg.lockAxisZ)
                  direction = Geometry.lineLineProjection(pointRayMoved.origin, direction, this.targetPos, new Vec3(1, 0, 0));
                direction = direction.scale((this.targetPos.z - pointRayMoved.origin.z) / direction.z);
              } else if (this.viewer.cfg.lockAxisZ) {
                direction = direction.scale((this.targetPos.y - pointRayMoved.origin.y) / direction.y);
              } else {
                direction = direction.scale(origDistToScreen);
              }
              let newPos = pointRayMoved.origin.add(direction);
              if (this.viewer.cfg.lockAxisX)
                newPos.x = this.targetPos.x;
              if (this.viewer.cfg.lockAxisY)
                newPos.z = this.targetPos.z;
              if (this.viewer.cfg.lockAxisZ)
                newPos.y = this.targetPos.y;
              moveVector = newPos.sub(this.targetPos);
            }
            for (let point of this.points().nodes) {
              if (!point.selected)
                continue;
              point.pos = point.moveOrigin.add(moveVector);
            }
            this.refreshPanels();
          }
        }
        onMouseUp(ev, x, y) {
          this.ctrlIsHeld = false;
          if (this.lastAxisHotkey) {
            this.lastAxisHotkey = "";
            this.viewer.cfg.snapToCollision = this.snapCollision;
            this.viewer.cfg.lockAxisX = this.lockX;
            this.viewer.cfg.lockAxisY = this.lockY;
            this.viewer.cfg.lockAxisZ = this.lockZ;
            this.window.refreshPanels();
          }
        }
      };
      if (module)
        module.exports = { PointViewer };
    }
  });

  // src/viewer/viewerStartPoints.js
  var require_viewerStartPoints = __commonJS({
    "src/viewer/viewerStartPoints.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { PointViewer } = require_pointViewer();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var ViewerStartPoints = class extends PointViewer {
        constructor(window2, viewer, data) {
          super(window2, viewer, data);
          this.modelZoneWide = new ModelBuilder().addQuad(new Vec3(0, -1e3, -20), new Vec3(0, 1e3, -20), new Vec3(-5300, 1e3, -20), new Vec3(-5300, -1e3, -20)).addQuad(new Vec3(-5300, -1e3, -20), new Vec3(-5300, 1e3, -20), new Vec3(0, 1e3, -20), new Vec3(0, -1e3, -20)).calculateNormals().makeModel(viewer.gl);
          this.modelZoneNarrow = new ModelBuilder().addQuad(new Vec3(0, -1e3, -20), new Vec3(0, 1e3, -20), new Vec3(-4800, 1e3, -20), new Vec3(-4800, -1e3, -20)).addQuad(new Vec3(-4800, -1e3, -20), new Vec3(-4800, 1e3, -20), new Vec3(0, 1e3, -20), new Vec3(0, -1e3, -20)).calculateNormals().makeModel(viewer.gl);
        }
        points() {
          return this.data.startPoints;
        }
        refreshPanels() {
          let panel = this.window.addPanel("Starting Points", false, (open) => {
            if (open) this.viewer.setSubviewer(this);
          });
          this.panel = panel;
          panel.addText(null, "<strong>Hold Alt + Click:</strong> Create Point");
          panel.addText(null, "<strong>Hold Alt + Drag Point:</strong> Duplicate Point");
          panel.addText(null, "<strong>Hold Ctrl:</strong> Multiselect");
          panel.addCheckbox(null, "Draw rotation guides", this.viewer.cfg.enableRotationRender, (x) => this.viewer.cfg.enableRotationRender = x);
          panel.addCheckbox(null, "Draw start zone bounds", this.viewer.cfg.startPointsEnableZoneRender, (x) => this.viewer.cfg.startPointsEnableZoneRender = x);
          panel.addSpacer(null);
          panel.addButton(null, "(A) Select/Unselect All", () => this.toggleAllSelection());
          panel.addButton(null, "(X) Delete Selected", () => this.deleteSelectedPoints());
          panel.addButton(null, "(Y) Snap To Collision Y", () => this.snapSelectedToY());
          panel.addButton(null, "(F) Set Selected as First Point", () => this.setSelectedAsFirstPoint());
          panel.addSpacer(null);
          let polePosOptions = [
            { str: "Left", value: 0 },
            { str: "Right", value: 1 }
          ];
          panel.addSelectionDropdown(null, "Pole Position", this.data.trackInfo.polePosition, polePosOptions, true, false, (x) => {
            this.window.setNotSaved();
            this.data.trackInfo.polePosition = x;
            this.refresh();
          });
          let driverDistOptions = [
            { str: "Normal", value: 0 },
            { str: "Narrow", value: 1 }
          ];
          panel.addSelectionDropdown(null, "Start Zone", this.data.trackInfo.driverDistance, driverDistOptions, true, false, (x) => {
            this.window.setNotSaved();
            this.data.trackInfo.driverDistance = x;
            this.refresh();
          });
          let selectedPoints = this.data.startPoints.nodes.filter((p) => p.selected);
          let selectionGroup = panel.addGroup(null, "Selection:");
          let enabled = selectedPoints.length > 0;
          let multiedit = selectedPoints.length > 1;
          if (selectedPoints.length == 1) {
            let i = this.data.startPoints.nodes.findIndex((p) => p === selectedPoints[0]);
            panel.addText(selectionGroup, "<strong>KTPT Index:</strong> " + i.toString() + " (0x" + i.toString(16) + ")");
          }
          panel.addSelectionNumericInput(selectionGroup, "X", -1e6, 1e6, selectedPoints.map((p) => p.pos.x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Y", -1e6, 1e6, selectedPoints.map((p) => -p.pos.z), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.z = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Z", -1e6, 1e6, selectedPoints.map((p) => -p.pos.y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. X", -1e6, 1e6, selectedPoints.map((p) => p.rotation.x), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.x = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Y", -1e6, 1e6, selectedPoints.map((p) => p.rotation.y), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.y = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Z", -1e6, 1e6, selectedPoints.map((p) => p.rotation.z), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.z = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Player Index", -1, 12, selectedPoints.map((p) => p.playerIndex), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].playerIndex = x;
          });
        }
        refresh() {
          super.refresh();
          for (let point of this.data.startPoints.nodes) {
            point.rendererStartZone = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.data.trackInfo.driverDistance ? this.modelZoneNarrow : this.modelZoneWide).setMaterial(this.viewer.material);
            this.renderers.push(point.rendererStartZone);
          }
          this.refreshPanels();
        }
        setSelectedAsFirstPoint() {
          for (let p = 0; p < this.points().nodes.length; p++) {
            let point = this.points().nodes[p];
            if (!point.selected)
              continue;
            this.points().nodes.splice(p, 1);
            this.points().nodes.unshift(point);
          }
          this.data.refreshIndices(this.viewer.cfg.isBattleTrack);
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        onKeyDown(ev) {
          if (super.onKeyDown(ev))
            return true;
          switch (ev.key) {
            case "F":
            case "f":
              this.setSelectedAsFirstPoint();
              return true;
          }
        }
        drawAfterModel() {
          for (let point of this.data.startPoints.nodes) {
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            point.renderer.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([0, 0, 1, 1]);
            point.rendererSelected.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([0.5, 0.5, 1, 1]).setEnabled(point.selected);
            point.rendererSelectedCore.setDiffuseColor([0, 0, 1, 1]);
            let matrixScale = Mat4.scale(scale, scale / 1.5, scale / 1.5);
            let matrixDirection = Mat4.rotation(new Vec3(0, 0, 1), 90 * Math.PI / 180).mul(Mat4.rotation(new Vec3(1, 0, 0), point.rotation.x * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 0, 1), -point.rotation.y * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 1, 0), -point.rotation.z * Math.PI / 180)).mul(Mat4.translation(point.pos.x, point.pos.y, point.pos.z));
            point.rendererDirection.setCustomMatrix(matrixScale.mul(matrixDirection)).setDiffuseColor([0.75, 0.75, 1, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionArrow.setCustomMatrix(matrixScale.mul(matrixDirection)).setDiffuseColor([0, 0, 1, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionUp.setCustomMatrix(matrixScale.mul(matrixDirection)).setDiffuseColor([0.25, 0.25, 1, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererStartZone.setCustomMatrix(matrixDirection).setDiffuseColor([0.25, 0.25, 1, 0.5]).setEnabled(this.viewer.cfg.startPointsEnableZoneRender && !this.viewer.cfg.isBattleTrack && this.data.startPoints.nodes.indexOf(point) == 0);
          }
          this.scene.render(this.viewer.gl, this.viewer.getCurrentCamera());
          this.sceneAfter.clearDepth(this.viewer.gl);
          this.sceneAfter.render(this.viewer.gl, this.viewer.getCurrentCamera());
        }
      };
      if (module)
        module.exports = { ViewerStartPoints };
    }
  });

  // src/viewer/pathViewer.js
  var require_pathViewer = __commonJS({
    "src/viewer/pathViewer.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var PathViewer = class {
        constructor(window2, viewer, data) {
          this.window = window2;
          this.viewer = viewer;
          this.data = data;
          this.renderers = [];
          this.scene = new GfxScene();
          this.sceneAfter = new GfxScene();
          this.sceneSizeCircles = new GfxScene();
          this.hoveringOverPoint = null;
          this.linkingPoints = false;
          this.targetPos = null;
          this.ctrlIsHeld = false;
          this.altIsHeld = false;
          this.lastAxisHotkey = "";
          this.snapCollision = this.viewer.cfg.snapToCollision;
          this.lockX = this.viewer.cfg.lockAxisX;
          this.lockY = this.viewer.cfg.lockAxisY;
          this.lockZ = this.viewer.cfg.lockAxisZ;
          this.modelPoint = new ModelBuilder().addSphere(-150, -150, -150, 150, 150, 150).calculateNormals().makeModel(viewer.gl);
          this.modelPointSelection = new ModelBuilder().addSphere(-250, -250, 250, 250, 250, -250).calculateNormals().makeModel(viewer.gl);
          this.modelPath = new ModelBuilder().addCylinder(-100, -100, 0, 100, 100, 1).calculateNormals().makeModel(viewer.gl);
          this.modelArrow = new ModelBuilder().addCone(-250, -250, -500, 250, 250, 0).calculateNormals().makeModel(viewer.gl);
          this.modelSizeCircle = new ModelBuilder().addSphere(-1, -1, -1, 1, 1, 1, 8).calculateNormals().makeModel(viewer.gl);
        }
        setData(data) {
          this.data = data;
          this.refresh();
        }
        destroy() {
          for (let r of this.renderers)
            r.detach();
          this.renderers = [];
        }
        refresh() {
          for (let r of this.renderers)
            r.detach();
          this.renderers = [];
          for (let point of this.points().nodes) {
            if (point.selected === void 0) {
              point.selected = false;
              point.moveOrigin = point.pos;
            }
            point.renderer = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelPoint).setMaterial(this.viewer.material);
            point.rendererSelected = new GfxNodeRendererTransform().attach(this.sceneAfter.root).setModel(this.modelPointSelection).setMaterial(this.viewer.materialUnshaded).setEnabled(false);
            point.rendererSelectedCore = new GfxNodeRenderer().attach(point.rendererSelected).setModel(this.modelPoint).setMaterial(this.viewer.material);
            point.rendererSizeCircle = new GfxNodeRendererTransform().attach(this.sceneSizeCircles.root).setModel(this.modelSizeCircle).setMaterial(this.viewer.materialUnshaded);
            this.renderers.push(point.renderer);
            this.renderers.push(point.rendererSelected);
            this.renderers.push(point.rendererSizeCircle);
            point.rendererOutgoingPaths = [];
            point.rendererOutgoingPathArrows = [];
            for (let next of point.next) {
              let rPath = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelPath).setMaterial(this.viewer.material);
              let rArrow = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelArrow).setMaterial(this.viewer.material);
              point.rendererOutgoingPaths.push(rPath);
              point.rendererOutgoingPathArrows.push(rArrow);
              this.renderers.push(rPath);
              this.renderers.push(rArrow);
            }
          }
        }
        getHoveringOverElement(cameraPos, ray, distToHit, includeSelected = true) {
          let elem = null;
          let minDistToCamera = distToHit + 1e3;
          let minDistToPoint = 1e6;
          for (let point of this.points().nodes) {
            if (!includeSelected && point.selected)
              continue;
            let distToCamera = point.pos.sub(cameraPos).magn();
            if (distToCamera >= minDistToCamera)
              continue;
            let scale = this.viewer.getElementScale(point.pos);
            let pointDistToRay = Geometry.linePointDistance(ray.origin, ray.direction, point.pos);
            if (pointDistToRay < 150 * scale * 4 && pointDistToRay < minDistToPoint) {
              elem = point;
              minDistToCamera = distToCamera;
              minDistToPoint = pointDistToRay;
            }
          }
          return elem;
        }
        selectAll() {
          for (let point of this.points().nodes)
            point.selected = true;
          this.refreshPanels();
        }
        unselectAll() {
          for (let point of this.points().nodes)
            point.selected = false;
          this.refreshPanels();
        }
        toggleAllSelection() {
          let hasSelection = this.points().nodes.find((p) => p.selected) != null;
          if (hasSelection)
            this.unselectAll();
          else
            this.selectAll();
        }
        deleteSelectedPoints() {
          let pointsToDelete = [];
          for (let point of this.points().nodes) {
            if (!point.selected)
              continue;
            pointsToDelete.push(point);
          }
          for (let point of pointsToDelete)
            this.points().removeNode(point);
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        snapSelectedToY() {
          for (let point of this.points().nodes) {
            if (point.selected) {
              let hit = this.viewer.collision.raycast(point.pos, new Vec3(0, 0, 1));
              if (hit != null && point.pos.sub(hit.position).magn() > 1) {
                let check = this.viewer.collision.raycast(hit.position, new Vec3(0, 0, 1));
                if (check != null && check.position.sub(hit.position).magn() > 1)
                  point.pos = hit.position.sub(point.pos.mul(new Vec3(0, 0, 2))).mul(new Vec3(1, 1, -1));
                else
                  point.pos = hit.position;
              }
            }
          }
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        unlinkSelectedPoints() {
          for (let point of this.points().nodes) {
            if (!point.selected)
              continue;
            let nextPointsToUnlink = [];
            for (let next of point.next) {
              if (!next.node.selected)
                continue;
              nextPointsToUnlink.push(next.node);
            }
            for (let next of nextPointsToUnlink)
              this.points().unlinkNodes(point, next);
          }
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        setSelectedAsFirstPoint() {
          for (let p = 0; p < this.points().nodes.length; p++) {
            let point = this.points().nodes[p];
            if (!point.selected)
              continue;
            this.points().nodes.splice(p, 1);
            this.points().nodes.unshift(point);
          }
          this.data.refreshIndices(this.viewer.cfg.isBattleTrack);
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        onKeyDown(ev) {
          if (this.viewer.mouseDown && !(ev.ctrlKey || ev.metaKey) && this.viewer.mouseAction == "move") {
            const setAxisLocks = (s, x, y, z) => {
              if (this.lastAxisHotkey === s)
                return false;
              if (!this.lastAxisHotkey) {
                this.snapCollision = this.viewer.cfg.snapToCollision;
                this.lockX = this.viewer.cfg.lockAxisX;
                this.lockY = this.viewer.cfg.lockAxisY;
                this.lockZ = this.viewer.cfg.lockAxisZ;
              }
              this.lastAxisHotkey = s;
              if (this.hoveringOverPoint != null)
                this.targetPos = this.hoveringOverPoint.pos;
              if (x || y || z)
                this.viewer.cfg.snapToCollision = false;
              this.viewer.cfg.lockAxisX = x;
              this.viewer.cfg.lockAxisY = y;
              this.viewer.cfg.lockAxisZ = z;
              this.window.refreshPanels();
            };
            switch (ev.key) {
              case "X":
                setAxisLocks("X", true, false, false);
                return true;
              case "x":
                setAxisLocks("x", false, true, true);
                return true;
              case "Y":
                setAxisLocks("Y", false, true, false);
                return true;
              case "y":
                setAxisLocks("y", true, false, true);
                return true;
              case "Z":
                setAxisLocks("Z", false, false, true);
                return true;
              case "z":
                setAxisLocks("z", true, true, false);
                return true;
            }
          }
          switch (ev.key) {
            case "A":
            case "a":
              this.toggleAllSelection();
              return true;
            case "Backspace":
            case "Delete":
            case "X":
            case "x":
              this.deleteSelectedPoints();
              return true;
            case "Y":
            case "y":
              this.snapSelectedToY();
              return true;
            case "U":
            case "u":
              this.unlinkSelectedPoints();
              return true;
            case "F":
            case "f":
              this.setSelectedAsFirstPoint();
              return true;
          }
          return false;
        }
        onMouseDown(ev, x, y, cameraPos, ray, hit, distToHit, mouse3DPos) {
          this.linkingPoints = false;
          for (let point of this.points().nodes)
            point.moveOrigin = point.pos;
          let hoveringOverElem = this.getHoveringOverElement(cameraPos, ray, distToHit);
          if (ev.altKey || !(ev.ctrlKey || ev.metaKey) && (hoveringOverElem == null || !hoveringOverElem.selected))
            this.unselectAll();
          if (ev.ctrlKey || ev.metaKey)
            this.ctrlIsHeld = true;
          if (ev.altKey)
            this.altIsHeld = true;
          if (hoveringOverElem != null) {
            if (ev.altKey) {
              if (this.points().nodes.length >= this.points().maxNodes) {
                alert("KMP error!\n\nMaximum number of points surpassed (" + this.points().maxNodes + ")");
                return;
              } else if (hoveringOverElem.next.length >= this.points().maxNextNodes) {
                alert("Node link error!\n\nMax outgoing connections to a point surpassed (maximum " + this.points().maxNextNodes + ")");
                return;
              }
              let newPoint = this.points().addNode();
              this.points().onCloneNode(newPoint, hoveringOverElem);
              newPoint.pos = hoveringOverElem.pos;
              newPoint.size = hoveringOverElem.size;
              this.points().linkNodes(hoveringOverElem, newPoint);
              this.refresh();
              newPoint.selected = true;
              this.targetPos = newPoint.moveOrigin.clone();
              this.linkingPoints = true;
              this.data.refreshIndices(this.viewer.cfg.isBattleTrack);
              this.viewer.setCursor("-webkit-grabbing");
              this.refreshPanels();
              this.window.setNotSaved();
            } else {
              hoveringOverElem.selected = true;
              this.targetPos = hoveringOverElem.moveOrigin.clone();
              this.refreshPanels();
              this.viewer.setCursor("-webkit-grabbing");
            }
          } else if (ev.altKey) {
            if (this.points().nodes.length >= this.points().maxNodes) {
              alert("KMP error!\n\nMaximum number of points surpassed (" + this.points().maxNodes + ")");
              return;
            }
            let newPoint = this.points().addNode();
            newPoint.pos = mouse3DPos;
            this.refresh();
            newPoint.selected = true;
            this.targetPos = newPoint.moveOrigin.clone();
            this.data.refreshIndices(this.viewer.cfg.isBattleTrack);
            this.viewer.setCursor("-webkit-grabbing");
            this.refreshPanels();
            this.window.setNotSaved();
          }
        }
        onMouseMove(ev, x, y, cameraPos, ray, hit, distToHit) {
          if (!this.viewer.mouseDown || this.ctrlIsHeld) {
            let lastHover = this.hoveringOverPoint;
            this.hoveringOverPoint = this.getHoveringOverElement(cameraPos, ray, distToHit);
            if (this.hoveringOverPoint != null) {
              this.viewer.setCursor("-webkit-grab");
              if (this.ctrlIsHeld) {
                this.hoveringOverPoint.selected = true;
                this.refreshPanels();
              }
            }
            if (this.hoveringOverPoint != lastHover)
              this.viewer.render();
          } else if (this.viewer.mouseAction == "move") {
            let linkToPoint = this.getHoveringOverElement(cameraPos, ray, distToHit, false);
            let selectedPoints = [];
            for (let point of this.points().nodes) {
              if (!point.selected)
                continue;
              selectedPoints.push(point);
            }
            if (selectedPoints.length == 1 && ev.altKey && !this.altIsHeld) {
              if (this.points().nodes.length >= this.points().maxNodes) {
                alert("KMP error!\n\nMaximum number of points surpassed (" + this.points().maxNodes + ")");
                return;
              }
              let point = selectedPoints[0];
              let newPoint = this.points().addNode();
              newPoint.pos = point.moveOrigin;
              newPoint.size = point.size;
              this.points().linkNodes(point, newPoint);
              this.refresh();
              point.selected = false;
              newPoint.selected = true;
              this.targetPos = newPoint.moveOrigin.clone();
              this.linkingPoints = true;
              this.altIsHeld = true;
              this.data.refreshIndices(this.viewer.cfg.isBattleTrack);
              this.viewer.setCursor("-webkit-grabbing");
              this.refreshPanels();
              this.window.setNotSaved();
              return;
            } else if (!ev.altKey) {
              this.altIsHeld = false;
            }
            this.window.setNotSaved();
            this.viewer.setCursor("-webkit-grabbing");
            let moveVector = null;
            let screenPosMoved = this.viewer.pointToScreen(this.targetPos);
            screenPosMoved.x += this.viewer.mouseMoveOffsetPixels.x;
            screenPosMoved.y += this.viewer.mouseMoveOffsetPixels.y;
            let pointRayMoved = this.viewer.getScreenRay(screenPosMoved.x, screenPosMoved.y);
            let hit2 = this.viewer.collision.raycast(pointRayMoved.origin, pointRayMoved.direction);
            if (this.viewer.cfg.snapToCollision && hit2 != null)
              moveVector = hit2.position.sub(this.targetPos);
            else {
              let screenPos = this.viewer.pointToScreen(this.targetPos);
              let pointRay = this.viewer.getScreenRay(screenPos.x, screenPos.y);
              let origDistToScreen = this.targetPos.sub(pointRay.origin).magn();
              let direction = pointRayMoved.direction;
              if (this.viewer.cfg.lockAxisX && this.viewer.cfg.lockAxisY && this.viewer.cfg.lockAxisZ) {
                return;
              } else if (this.viewer.cfg.lockAxisX) {
                if (this.viewer.cfg.lockAxisY)
                  direction = Geometry.lineLineProjection(pointRayMoved.origin, direction, this.targetPos, new Vec3(0, 1, 0));
                else if (this.viewer.cfg.lockAxisZ)
                  direction = Geometry.lineLineProjection(pointRayMoved.origin, direction, this.targetPos, new Vec3(0, 0, 1));
                direction = direction.scale((this.targetPos.x - pointRayMoved.origin.x) / direction.x);
              } else if (this.viewer.cfg.lockAxisY) {
                if (this.viewer.cfg.lockAxisZ)
                  direction = Geometry.lineLineProjection(pointRayMoved.origin, direction, this.targetPos, new Vec3(1, 0, 0));
                direction = direction.scale((this.targetPos.z - pointRayMoved.origin.z) / direction.z);
              } else if (this.viewer.cfg.lockAxisZ) {
                direction = direction.scale((this.targetPos.y - pointRayMoved.origin.y) / direction.y);
              } else {
                direction = direction.scale(origDistToScreen);
              }
              let newPos = pointRayMoved.origin.add(direction);
              if (this.viewer.cfg.lockAxisX)
                newPos.x = this.targetPos.x;
              if (this.viewer.cfg.lockAxisY)
                newPos.z = this.targetPos.z;
              if (this.viewer.cfg.lockAxisZ)
                newPos.y = this.targetPos.y;
              moveVector = newPos.sub(this.targetPos);
            }
            for (let point of this.points().nodes) {
              if (!point.selected)
                continue;
              if (this.linkingPoints && linkToPoint != null && linkToPoint.pos != point.moveOrigin)
                point.pos = linkToPoint.pos;
              else
                point.pos = point.moveOrigin.add(moveVector);
            }
            this.refreshPanels();
          }
        }
        onMouseUp(ev, x, y) {
          this.ctrlIsHeld = false;
          this.altIsHeld = false;
          if (this.lastAxisHotkey) {
            this.lastAxisHotkey = "";
            this.viewer.cfg.snapToCollision = this.snapCollision;
            this.viewer.cfg.lockAxisX = this.lockX;
            this.viewer.cfg.lockAxisY = this.lockY;
            this.viewer.cfg.lockAxisZ = this.lockZ;
            this.window.refreshPanels();
          }
          if (this.viewer.mouseAction == "move") {
            if (this.linkingPoints) {
              let pointBeingLinked = this.points().nodes.find((p) => p.selected);
              if (pointBeingLinked == null)
                return;
              let pointBeingLinkedTo = this.points().nodes.find((p) => p != pointBeingLinked && p.pos == pointBeingLinked.pos);
              if (pointBeingLinkedTo != null) {
                this.points().removeNode(pointBeingLinked);
                if (pointBeingLinkedTo.prev.length >= this.points().maxPrevNodes) {
                  alert("Node link error!\n\nMax incoming connections to a point surpassed (maximum " + this.points().maxPrevNodes + ")");
                  this.refresh();
                  return;
                }
                this.points().linkNodes(pointBeingLinked.prev[0].node, pointBeingLinkedTo);
                this.refresh();
                this.window.setNotSaved();
              }
            }
          }
        }
        drawSizeCircles() {
          let gl = this.viewer.gl;
          let camera = this.viewer.getCurrentCamera();
          gl.enable(gl.STENCIL_TEST);
          gl.stencilFunc(gl.ALWAYS, 0, 255);
          gl.stencilMask(255);
          gl.clearStencil(0);
          gl.clear(gl.STENCIL_BUFFER_BIT);
          gl.colorMask(false, false, false, false);
          gl.depthMask(false);
          gl.cullFace(gl.FRONT);
          gl.stencilOp(gl.KEEP, gl.INCR, gl.KEEP);
          this.sceneSizeCircles.render(gl, camera);
          gl.cullFace(gl.BACK);
          gl.stencilOp(gl.KEEP, gl.DECR, gl.KEEP);
          this.sceneSizeCircles.render(gl, camera);
          gl.cullFace(gl.BACK);
          gl.colorMask(true, true, true, true);
          gl.stencilMask(0);
          gl.stencilFunc(gl.NOTEQUAL, 0, 255);
          this.sceneSizeCircles.render(gl, camera);
          gl.depthMask(true);
          gl.disable(gl.STENCIL_TEST);
        }
      };
      if (module)
        module.exports = { PathViewer };
    }
  });

  // src/viewer/viewerEnemyPaths.js
  var require_viewerEnemyPaths = __commonJS({
    "src/viewer/viewerEnemyPaths.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { PathViewer } = require_pathViewer();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var ViewerEnemyPaths = class extends PathViewer {
        constructor(window2, viewer, data) {
          super(window2, viewer, data);
        }
        points() {
          return this.data.enemyPoints;
        }
        refreshPanels() {
          let panel = this.window.addPanel("Enemy Paths", false, (open) => {
            if (open) this.viewer.setSubviewer(this);
          });
          this.panel = panel;
          panel.addText(null, "<strong>Hold Alt + Click:</strong> Create Point");
          panel.addText(null, "<strong>Hold Alt + Drag Point:</strong> Extend Path");
          panel.addText(null, "<strong>Hold Ctrl:</strong> Multiselect");
          panel.addCheckbox(null, "Show point sizes", this.viewer.cfg.enemyPathsEnableSizeRender, (x) => this.viewer.cfg.enemyPathsEnableSizeRender = x);
          panel.addSpacer(null);
          if (this.data.enemyPoints.nodes.length == 0 && this.data.itemPoints.nodes.length > 0)
            panel.addButton(null, "Copy From Item Paths", () => this.copyFromItemPaths());
          panel.addButton(null, "(A) Select/Unselect All", () => this.toggleAllSelection());
          panel.addButton(null, "(X) Delete Selected", () => this.deleteSelectedPoints());
          panel.addButton(null, "(Y) Snap To Collision Y", () => this.snapSelectedToY());
          panel.addButton(null, "(U) Unlink Selected", () => this.unlinkSelectedPoints());
          panel.addButton(null, "(F) Set Selected as First Point", () => this.setSelectedAsFirstPoint());
          panel.addSpacer(null);
          let selectedPoints = this.data.enemyPoints.nodes.filter((p) => p.selected);
          let selectionGroup = panel.addGroup(null, "Selection:");
          let enabled = selectedPoints.length > 0;
          let multiedit = selectedPoints.length > 1;
          if (selectedPoints.length == 1) {
            const formatNum = (x) => {
              if (x === null || x === void 0)
                return "";
              return x.toString();
            };
            const formatNumHex = (x) => {
              if (x === null || x === void 0)
                return "";
              return x.toString() + " (0x" + x.toString(16) + ")";
            };
            panel.addText(selectionGroup, "<strong>ENPH Index:</strong> " + formatNumHex(selectedPoints[0].pathIndex) + ", point #" + formatNum(selectedPoints[0].pathPointIndex));
            panel.addText(selectionGroup, "<strong>ENPT Index:</strong> " + formatNumHex(selectedPoints[0].pointIndex));
          }
          panel.addSelectionNumericInput(selectionGroup, "X", -1e6, 1e6, selectedPoints.map((p) => p.pos.x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Y", -1e6, 1e6, selectedPoints.map((p) => -p.pos.z), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.z = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Z", -1e6, 1e6, selectedPoints.map((p) => -p.pos.y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Deviation", 1, 1e3, selectedPoints.map((p) => p.deviation), null, 0.1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].deviation = x;
          });
          let setting1Options = [
            { str: "None", value: 0 },
            { str: "Requires Mushroom", value: 1 },
            { str: "Use Mushroom", value: 2 },
            { str: "Allow Wheelie", value: 3 },
            { str: "End Wheelie", value: 4 }
          ];
          panel.addSelectionDropdown(selectionGroup, "Setting 1", selectedPoints.map((p) => p.setting1), setting1Options, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].setting1 = x;
          });
          let setting2Options = [
            { str: "None", value: 0 },
            { str: "End Drift", value: 1 },
            { str: "Forbid Drift(?)", value: 2 },
            { str: "Force Drift", value: 3 }
          ];
          panel.addSelectionDropdown(selectionGroup, "Setting 2", selectedPoints.map((p) => p.setting2), setting2Options, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].setting2 = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Setting 3", 0, 255, selectedPoints.map((p) => p.setting3), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].setting3 = x;
          });
        }
        refresh() {
          super.refresh();
          this.refreshPanels();
        }
        copyFromItemPaths() {
          let newGraph = this.data.itemPoints.clone();
          newGraph.onAddNode = (node) => {
            node.pos = new Vec3(0, 0, 0);
            node.deviation = 10;
            node.setting1 = 0;
            node.setting2 = 0;
            node.setting3 = 0;
          };
          newGraph.onCloneNode = (newNode, oldNode) => {
            newNode.pos = oldNode.pos.clone();
            newNode.deviation = oldNode.deviation;
            newNode.setting1 = oldNode.setting1;
            newNode.setting2 = oldNode.setting2;
            newNode.setting3 = oldNode.setting3;
          };
          for (let point of newGraph.nodes) {
            point.setting1 = 0;
            point.setting2 = 0;
            point.setting3 = 0;
          }
          this.data.enemyPoints = newGraph;
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        drawAfterModel() {
          let cameraPos = this.viewer.getCurrentCameraPosition();
          for (let p = 0; p < this.data.enemyPoints.nodes.length; p++) {
            let point = this.data.enemyPoints.nodes[p];
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            let useMushroom = point.setting1 == 2;
            point.renderer.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor(p == 0 ? [0.6, 0, 0, 1] : useMushroom ? [1, 0.5, 0.95, 1] : [1, 0, 0, 1]);
            let sizeCircleScale = point.deviation * 50;
            point.rendererSizeCircle.setTranslation(point.pos).setScaling(new Vec3(sizeCircleScale, sizeCircleScale, sizeCircleScale)).setDiffuseColor([1, 0.5, 0, 0.5]);
            for (let n = 0; n < point.next.length; n++) {
              let nextPos = point.next[n].node.pos;
              let scale2 = Math.min(scale, this.viewer.getElementScale(nextPos));
              let requiresMushroom = point.next[n].node.setting1 == 1;
              let matrixScale = Mat4.scale(scale2, scale2, nextPos.sub(point.pos).magn());
              let matrixAlign = Mat4.rotationFromTo(new Vec3(0, 0, 1), nextPos.sub(point.pos).normalize());
              let matrixTranslate = Mat4.translation(point.pos.x, point.pos.y, point.pos.z);
              let matrixScaleArrow = Mat4.scale(scale2, scale2, scale2);
              let matrixTranslateArrow = Mat4.translation(nextPos.x, nextPos.y, nextPos.z);
              point.rendererOutgoingPaths[n].setCustomMatrix(matrixScale.mul(matrixAlign.mul(matrixTranslate))).setDiffuseColor(requiresMushroom ? [1, 0.5, 0.75, 1] : [1, 0.5, 0, 1]);
              point.rendererOutgoingPathArrows[n].setCustomMatrix(matrixScaleArrow.mul(matrixAlign.mul(matrixTranslateArrow))).setDiffuseColor([1, 0.75, 0, 1]);
            }
          }
          if (this.viewer.cfg.enemyPathsEnableSizeRender)
            this.drawSizeCircles();
          this.scene.render(this.viewer.gl, this.viewer.getCurrentCamera());
          for (let p = 0; p < this.data.enemyPoints.nodes.length; p++) {
            let point = this.data.enemyPoints.nodes[p];
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            point.rendererSelected.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([1, 0.5, 0.5, 1]).setEnabled(point.selected);
            point.rendererSelectedCore.setDiffuseColor(p == 0 ? [0.6, 0, 0, 1] : [1, 0, 0, 1]);
          }
          this.sceneAfter.clearDepth(this.viewer.gl);
          this.sceneAfter.render(this.viewer.gl, this.viewer.getCurrentCamera());
        }
      };
      if (module)
        module.exports = { ViewerEnemyPaths };
    }
  });

  // src/viewer/viewerItemPaths.js
  var require_viewerItemPaths = __commonJS({
    "src/viewer/viewerItemPaths.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { PathViewer } = require_pathViewer();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var ViewerItemPaths = class extends PathViewer {
        constructor(window2, viewer, data) {
          super(window2, viewer, data);
        }
        points() {
          return this.data.itemPoints;
        }
        refreshPanels() {
          let panel = this.window.addPanel("Item Paths", false, (open) => {
            if (open) this.viewer.setSubviewer(this);
          });
          this.panel = panel;
          panel.addText(null, "<strong>Hold Alt + Click:</strong> Create Point");
          panel.addText(null, "<strong>Hold Alt + Drag Point:</strong> Extend Path");
          panel.addText(null, "<strong>Hold Ctrl:</strong> Multiselect");
          panel.addCheckbox(null, "Show point sizes", this.viewer.cfg.enemyPathsEnableSizeRender, (x) => this.viewer.cfg.enemyPathsEnableSizeRender = x);
          panel.addSpacer(null);
          if (this.data.itemPoints.nodes.length == 0 && this.data.enemyPoints.nodes.length > 0)
            panel.addButton(null, "Copy From Enemy Paths", () => this.copyFromEnemyPaths());
          panel.addButton(null, "(A) Select/Unselect All", () => this.toggleAllSelection());
          panel.addButton(null, "(X) Delete Selected", () => this.deleteSelectedPoints());
          panel.addButton(null, "(Y) Snap To Collision Y", () => this.snapSelectedToY());
          panel.addButton(null, "(U) Unlink Selected", () => this.unlinkSelectedPoints());
          panel.addButton(null, "(F) Set Selected as First Point", () => this.setSelectedAsFirstPoint());
          panel.addButton(null, "(D) Set as Default Bill Route", () => this.setDefaultBillRoute());
          panel.addSpacer(null);
          let selectedPoints = this.data.itemPoints.nodes.filter((p) => p.selected);
          let selectionGroup = panel.addGroup(null, "Selection:");
          let enabled = selectedPoints.length > 0;
          let multiedit = selectedPoints.length > 1;
          if (selectedPoints.length == 1) {
            const formatNum = (x) => {
              if (x === null || x === void 0)
                return "";
              return x.toString();
            };
            const formatNumHex = (x) => {
              if (x === null || x === void 0)
                return "";
              return x.toString() + " (0x" + x.toString(16) + ")";
            };
            panel.addText(selectionGroup, "<strong>ITPH Index:</strong> " + formatNumHex(selectedPoints[0].pathIndex) + ", point #" + formatNum(selectedPoints[0].pathPointIndex));
            panel.addText(selectionGroup, "<strong>ITPT Index:</strong> " + formatNumHex(selectedPoints[0].pointIndex));
          }
          panel.addSelectionNumericInput(selectionGroup, "X", -1e6, 1e6, selectedPoints.map((p) => p.pos.x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Y", -1e6, 1e6, selectedPoints.map((p) => -p.pos.z), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.z = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Z", -1e6, 1e6, selectedPoints.map((p) => -p.pos.y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Deviation", 1, 1e3, selectedPoints.map((p) => p.deviation), null, 0.1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].deviation = x;
          });
          let setting1Options = [
            { str: "None", value: 0 },
            { str: "B.Bill uses gravity", value: 1 },
            { str: "B.Bill disregards gravity", value: 2 }
          ];
          panel.addSelectionDropdown(selectionGroup, "Setting 1", selectedPoints.map((p) => p.setting1), setting1Options, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].setting1 = x;
          });
          let setting2Options = [
            { str: "None", value: 0 },
            { str: "B.Bill can't stop", value: 1 },
            { str: "Low-priority route", value: 10 },
            { str: "B.Bill can't stop & Low-priority route", value: 11 }
          ];
          panel.addSelectionDropdown(selectionGroup, "Setting 2", selectedPoints.map((p) => p.setting2), setting2Options, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].setting2 = x;
          });
        }
        refresh() {
          super.refresh();
          this.refreshPanels();
        }
        setDefaultBillRoute() {
          for (let point of this.data.itemPoints.nodes)
            if (point.selected)
              for (let prev of point.prev) {
                let i = prev.node.next.findIndex((p) => p.node == point);
                let prevLink = prev.node.next.splice(i, 1)[0];
                prev.node.next.unshift(prevLink);
              }
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        copyFromEnemyPaths() {
          let newGraph = this.data.enemyPoints.clone();
          newGraph.onAddNode = (node) => {
            node.pos = new Vec3(0, 0, 0);
            node.deviation = 10;
            node.setting1 = 0;
            node.setting2 = 0;
          };
          newGraph.onCloneNode = (newNode, oldNode) => {
            newNode.pos = oldNode.pos.clone();
            newNode.deviation = oldNode.deviation;
            newNode.setting1 = oldNode.setting1;
            newNode.setting2 = oldNode.setting2;
          };
          for (let point of newGraph.nodes) {
            point.setting1 = 0;
            point.setting2 = 0;
            delete point.setting3;
          }
          this.data.itemPoints = newGraph;
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        onKeyDown(ev) {
          if (super.onKeyDown(ev))
            return true;
          switch (ev.key) {
            case "D":
            case "d":
              this.setDefaultBillRoute();
              return true;
          }
        }
        drawAfterModel() {
          let cameraPos = this.viewer.getCurrentCameraPosition();
          for (let p = 0; p < this.data.itemPoints.nodes.length; p++) {
            let point = this.data.itemPoints.nodes[p];
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            let bbillCantStop = (point.setting2 & 1) != 0;
            point.renderer.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor(p == 0 ? [0, 0.4, 0, 1] : bbillCantStop ? [0.75, 0.75, 0.75, 1] : [0, 0.8, 0, 1]);
            let sizeCircleScale = point.deviation * 50;
            point.rendererSizeCircle.setTranslation(point.pos).setScaling(new Vec3(sizeCircleScale, sizeCircleScale, sizeCircleScale)).setDiffuseColor([0.25, 0.8, 0, 0.5]);
            for (let n = 0; n < point.next.length; n++) {
              let nextPos = point.next[n].node.pos;
              let scale2 = Math.min(scale, this.viewer.getElementScale(nextPos));
              let nextBbillCantStop = (point.next[n].node.setting2 & 1) != 0;
              let lowPriority = (point.next[n].node.setting2 & 10) != 0;
              let matrixScale = Mat4.scale(scale2, scale2, nextPos.sub(point.pos).magn());
              let matrixAlign = Mat4.rotationFromTo(new Vec3(0, 0, 1), nextPos.sub(point.pos).normalize());
              let matrixTranslate = Mat4.translation(point.pos.x, point.pos.y, point.pos.z);
              let matrixScaleArrow = Mat4.scale(scale2, scale2, scale2);
              let matrixTranslateArrow = Mat4.translation(nextPos.x, nextPos.y, nextPos.z);
              point.rendererOutgoingPaths[n].setCustomMatrix(matrixScale.mul(matrixAlign.mul(matrixTranslate))).setDiffuseColor(nextBbillCantStop ? [0.5, 0.5, 0.5, 1] : lowPriority ? [0.5, 1, 0.8, 1] : n != 0 ? [0.8, 1, 0.5, 1] : [0.5, 1, 0, 1]);
              point.rendererOutgoingPathArrows[n].setCustomMatrix(matrixScaleArrow.mul(matrixAlign.mul(matrixTranslateArrow))).setDiffuseColor(nextBbillCantStop ? [0.85, 0.85, 0.85, 1] : [0.1, 0.8, 0, 1]);
            }
          }
          if (this.viewer.cfg.enemyPathsEnableSizeRender)
            this.drawSizeCircles();
          this.scene.render(this.viewer.gl, this.viewer.getCurrentCamera());
          for (let p = 0; p < this.data.itemPoints.nodes.length; p++) {
            let point = this.data.itemPoints.nodes[p];
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            point.rendererSelected.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([0.4, 1, 0.1, 1]).setEnabled(point.selected);
            point.rendererSelectedCore.setDiffuseColor(p == 0 ? [0, 0.4, 0, 1] : [0, 0.8, 0, 1]);
          }
          this.sceneAfter.clearDepth(this.viewer.gl);
          this.sceneAfter.render(this.viewer.gl, this.viewer.getCurrentCamera());
        }
      };
      if (module)
        module.exports = { ViewerItemPaths };
    }
  });

  // src/viewer/viewerCheckpoints.js
  var require_viewerCheckpoints = __commonJS({
    "src/viewer/viewerCheckpoints.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var ViewerCheckpoints = class {
        constructor(window2, viewer, data) {
          this.window = window2;
          this.viewer = viewer;
          this.data = data;
          this.scene = new GfxScene();
          this.sceneAfter = new GfxScene();
          this.scenePanels = new GfxScene();
          this.sceneSidePanels = new GfxScene();
          this.hoveringOverPoint = null;
          this.linkingPoints = false;
          this.multiSelect = false;
          this.zTop = 0;
          this.zBottom = 0;
          this.modelPoint = new ModelBuilder().addSphere(-150, -150, -150, 150, 150, 150).calculateNormals().makeModel(viewer.gl);
          this.modelPointSelection = new ModelBuilder().addSphere(-250, -250, 250, 250, 250, -250).calculateNormals().makeModel(viewer.gl);
          this.modelPath = new ModelBuilder().addCylinder(-100, -100, 0, 100, 100, 1).calculateNormals().makeModel(viewer.gl);
          this.modelArrow = new ModelBuilder().addCone(-250, -250, -500, 250, 250, 0).calculateNormals().makeModel(viewer.gl);
          this.modelDirArrow = new ModelBuilder().addCone(-100, -200, 0, 100, 200, 400, 8, new Vec3(1, 0, 0)).calculateNormals().makeModel(viewer.gl);
          let panelFrontColor = [1, 1, 1, 1];
          let panelBackColor = [1, 1, 1, 0.5];
          this.modelPanel = new ModelBuilder().addQuad(new Vec3(0, 0, 1), new Vec3(1, 0, 1), new Vec3(1, 0, 0), new Vec3(0, 0, 0), panelFrontColor, panelFrontColor, panelFrontColor, panelFrontColor).addQuad(new Vec3(0, 0, 0), new Vec3(1, 0, 0), new Vec3(1, 0, 1), new Vec3(0, 0, 1), panelBackColor, panelBackColor, panelBackColor, panelBackColor).calculateNormals().makeModel(viewer.gl);
          this.modelPanelWithoutBacksize = new ModelBuilder().addQuad(new Vec3(0, 0, 1), new Vec3(1, 0, 1), new Vec3(1, 0, 0), new Vec3(0, 0, 0), panelFrontColor, panelFrontColor, panelFrontColor, panelFrontColor).calculateNormals().makeModel(viewer.gl);
          this.renderers = [];
        }
        setModel(model) {
          if (this.window.noModelLoaded) {
            let bbox = model.getBoundingBox();
            this.zTop = bbox.zMin - 1e3;
            this.refreshPanels();
          }
        }
        setData(data) {
          this.data = data;
          this.refresh();
        }
        destroy() {
          for (let r of this.renderers)
            r.detach();
          this.renderers = [];
        }
        refreshPanels() {
          let panel = this.window.addPanel("Checkpoints", false, (open) => {
            if (open) this.viewer.setSubviewer(this);
          });
          this.panel = panel;
          panel.addText(null, "<strong>Hold Alt + Click:</strong> Create Checkpoint");
          panel.addText(null, "<strong>Hold Alt + Drag Point:</strong> Extend Path");
          panel.addText(null, "<strong>Hold Ctrl:</strong> Multiselect");
          panel.addCheckbox(null, "Render vertical panels", this.viewer.cfg.checkpointsEnableVerticalPanels, (x) => this.viewer.cfg.checkpointsEnableVerticalPanels = x);
          panel.addCheckbox(null, "Render respawn point links", this.viewer.cfg.checkpointsEnableRespawnPointLinks, (x) => this.viewer.cfg.checkpointsEnableRespawnPointLinks = x);
          panel.addCheckbox(null, "Render direction indicators", this.viewer.cfg.checkpointsEnableDirectionArrows, (x) => this.viewer.cfg.checkpointsEnableDirectionArrows = x);
          panel.addSpacer(null);
          panel.addButton(null, "(A) Select/Unselect All", () => this.toggleAllSelection());
          panel.addButton(null, "(X) Delete Selected", () => this.deleteSelectedPoints());
          panel.addButton(null, "(U) Unlink Selected", () => this.unlinkSelectedPoints());
          panel.addButton(null, "(S) Toggle Show Loaded Checkpoints", () => this.toggleShowLoaded());
          panel.addButton(null, "(E) Clear Respawn Point Assignment", () => this.clearRespawnPoints());
          panel.addButton(null, "(R) Assign Selected Respawn Point", () => this.assignRespawnPoints());
          panel.addSpacer(null);
          panel.addSelectionNumericInput(null, "Editing Y", -1e6, 1e6, -this.zTop, null, 100, true, false, (x, i) => {
            this.zTop = -x;
          });
          let selectedPoints = this.data.checkpointPoints.nodes.filter((p) => p.selected[0] || p.selected[1]);
          let selectionGroup = panel.addGroup(null, "Selection:");
          let enabled = selectedPoints.length > 0;
          let multiedit = selectedPoints.length > 1;
          if (selectedPoints.length == 1) {
            const formatNum = (x) => {
              if (x === null || x === void 0)
                return "";
              return x.toString();
            };
            const formatNumHex = (x) => {
              if (x === null || x === void 0)
                return "";
              return x.toString() + " (0x" + x.toString(16) + ")";
            };
            const setPath = (x) => {
              if (selectedPoints[0].pointIndex != 0 && selectedPoints[0].prev.length == 1 && selectedPoints[0].prev[0].node.next.length == 1) {
                this.window.setNotSaved();
                selectedPoints[0].firstInPath = x;
                this.refresh();
              } else {
                selectedPoints[0].firstInPath = true;
              }
            };
            const getCompletion = () => {
              let maxLayer = this.data.checkpointPoints.maxLayer;
              let groupCompletion = selectedPoints[0].pathPointIndex / selectedPoints[0].pathLen;
              let overallCompletion = (groupCompletion + selectedPoints[0].pathLayer) / (maxLayer + 1);
              return overallCompletion !== NaN ? (100 * overallCompletion).toFixed(4).toString() + "%" : "N/A";
            };
            panel.addText(selectionGroup, "<strong>CKPH Index:</strong> " + formatNumHex(selectedPoints[0].pathIndex) + ", point #" + formatNum(selectedPoints[0].pathPointIndex));
            panel.addText(selectionGroup, "<strong>CKPT Index:</strong> " + formatNumHex(selectedPoints[0].pointIndex));
            panel.addText(selectionGroup, "<strong>Group Layer:</strong> " + formatNum(selectedPoints[0].pathLayer));
            panel.addText(selectionGroup, "<strong>Lap Completion:</strong> " + getCompletion());
            panel.addCheckbox(selectionGroup, "Start new checkpoint group", selectedPoints[0].firstInPath, setPath);
          }
          panel.addSelectionNumericInput(selectionGroup, "X1", -1e6, 1e6, selectedPoints.map((p) => p.pos[0].x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos[0].x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Z1", -1e6, 1e6, selectedPoints.map((p) => -p.pos[0].y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos[0].y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "X2", -1e6, 1e6, selectedPoints.map((p) => p.pos[1].x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos[1].x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Z2", -1e6, 1e6, selectedPoints.map((p) => -p.pos[1].y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos[1].y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Type", 0, 255, selectedPoints.map((p) => p.type), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].type = x;
          });
          let respawnCount = this.data.respawnPoints.nodes.length;
          const respawnIndex = (node) => {
            return this.data.respawnPoints.nodes.indexOf(node.respawnNode);
          };
          panel.addSelectionNumericInput(selectionGroup, "Respawn", 0, respawnCount - 1, selectedPoints.map((p) => respawnIndex(p)), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].respawnNode = this.data.respawnPoints.nodes[x];
          });
          panel.addText(selectionGroup, "<strong>Type 0:</strong> Lap Counter");
          panel.addText(selectionGroup, "<strong>Type 1-254:</strong> Key Checkpoints");
          panel.addText(selectionGroup, "<strong>Type 255:</strong> Regular Checkpoint");
        }
        refresh() {
          for (let r of this.renderers)
            r.detach();
          this.renderers = [];
          for (let point of this.data.checkpointPoints.nodes) {
            if (point.selected === void 0) {
              point.selected = [false, false];
              point.moveOrigin = [point.pos[0], point.pos[1]];
            }
            let renderer1 = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelPoint).setMaterial(this.viewer.material);
            let renderer2 = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelPoint).setMaterial(this.viewer.materialColor);
            point.renderer = [renderer1, renderer2];
            point.rendererCheckbar = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelPath).setMaterial(this.viewer.material);
            point.rendererDirArrow = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelDirArrow).setMaterial(this.viewer.material);
            point.rendererCheckpanel = new GfxNodeRendererTransform().attach(this.scenePanels.root).setModel(this.modelPanelWithoutBacksize).setMaterial(this.viewer.material);
            point.rendererRespawnLink = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelPath).setMaterial(this.viewer.material);
            let rendererSelected1 = new GfxNodeRendererTransform().attach(this.sceneAfter.root).setModel(this.modelPointSelection).setMaterial(this.viewer.materialUnshaded).setEnabled(false);
            let rendererSelectedCore1 = new GfxNodeRenderer().attach(rendererSelected1).setModel(this.modelPoint).setMaterial(this.viewer.material);
            let rendererSelected2 = new GfxNodeRendererTransform().attach(this.sceneAfter.root).setModel(this.modelPointSelection).setMaterial(this.viewer.materialUnshaded).setEnabled(false);
            let rendererSelectedCore2 = new GfxNodeRenderer().attach(rendererSelected2).setModel(this.modelPoint).setMaterial(this.viewer.material);
            point.rendererSelected = [rendererSelected1, rendererSelected2];
            point.rendererSelectedCore = [rendererSelectedCore1, rendererSelectedCore2];
            this.renderers.push(renderer1);
            this.renderers.push(renderer2);
            this.renderers.push(rendererSelected1);
            this.renderers.push(rendererSelected2);
            this.renderers.push(point.rendererCheckbar);
            this.renderers.push(point.rendererDirArrow);
            this.renderers.push(point.rendererCheckpanel);
            this.renderers.push(point.rendererRespawnLink);
            point.rendererOutgoingPaths = [];
            point.rendererOutgoingPathArrows = [];
            point.rendererOutgoingPathPanels = [];
            point.rendererOutgoingQuads = [];
            for (let next of point.next) {
              let rPath1 = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelPath).setMaterial(this.viewer.material);
              let rArrow1 = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelArrow).setMaterial(this.viewer.material);
              let rPath2 = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelPath).setMaterial(this.viewer.material);
              let rArrow2 = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelArrow).setMaterial(this.viewer.material);
              let rPanel1 = new GfxNodeRendererTransform().attach(this.sceneSidePanels.root).setModel(this.modelPanel).setMaterial(this.viewer.material);
              let rPanel2 = new GfxNodeRendererTransform().attach(this.sceneSidePanels.root).setModel(this.modelPanel).setMaterial(this.viewer.material);
              point.rendererOutgoingPaths.push([rPath1, rPath2]);
              point.rendererOutgoingPathArrows.push([rArrow1, rArrow2]);
              point.rendererOutgoingPathPanels.push([rPanel1, rPanel2]);
              this.renderers.push(rPath1);
              this.renderers.push(rPath2);
              this.renderers.push(rArrow1);
              this.renderers.push(rArrow2);
              this.renderers.push(rPanel1);
              this.renderers.push(rPanel2);
            }
          }
          this.refreshPanels();
        }
        getHoveringOverElement(cameraPos, ray, distToHit, includeSelected = true) {
          let elem = null;
          let minDistToCamera = distToHit + 1e3;
          let minDistToPoint = 1e6;
          for (let which = 0; which < 2; which++) {
            for (let point of this.data.checkpointPoints.nodes) {
              if (!includeSelected && point.selected[which])
                continue;
              let distToCamera = point.pos[which].sub(cameraPos).magn();
              if (distToCamera >= minDistToCamera)
                continue;
              let scale = this.viewer.getElementScale(point.pos[which]);
              let pointDistToRay = Geometry.linePointDistance(ray.origin, ray.direction, point.pos[which]);
              if (pointDistToRay < 150 * scale * 4 && pointDistToRay < minDistToPoint) {
                elem = { point, which };
                minDistToCamera = distToCamera;
                minDistToPoint = pointDistToRay;
              }
            }
          }
          return elem;
        }
        selectAll() {
          for (let point of this.data.checkpointPoints.nodes)
            point.selected = [true, true];
          this.refreshPanels();
        }
        unselectAll() {
          for (let point of this.data.checkpointPoints.nodes)
            point.selected = [false, false];
          this.refreshPanels();
        }
        toggleAllSelection() {
          let hasSelection = this.data.checkpointPoints.nodes.find((p) => p.selected[0] || p.selected[1]) != null;
          if (hasSelection)
            this.unselectAll();
          else
            this.selectAll();
        }
        deleteSelectedPoints() {
          let pointsToDelete = [];
          for (let point of this.data.checkpointPoints.nodes) {
            if (!point.selected[0] && !point.selected[1])
              continue;
            pointsToDelete.push(point);
          }
          for (let point of pointsToDelete) {
            let nextPoints = point.next.map((x) => x);
            let prevPoints = point.prev.map((x) => x);
            this.data.checkpointPoints.removeNode(point);
            for (let next of nextPoints) {
              if (next.node.pointIndex != 0 && next.node.prev.length == 1 && next.node.prev[0].node.next.length == 1)
                next.node.firstInPath = false;
              else
                next.node.firstInPath = true;
            }
            for (let prev of prevPoints)
              for (let adj of prev.node.next) {
                if (adj.node.pointIndex != 0 && adj.node.prev.length == 1 && adj.node.prev[0].node.next.length == 1)
                  adj.node.firstInPath = false;
                else
                  adj.node.firstInPath = true;
              }
          }
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        unlinkSelectedPoints() {
          for (let point of this.data.checkpointPoints.nodes) {
            if (!point.selected[0] && !point.selected[1])
              continue;
            let nextPointsToUnlink = [];
            for (let next of point.next) {
              if (!next.node.selected[0] && !next.node.selected[1])
                continue;
              nextPointsToUnlink.push(next.node);
            }
            for (let next of nextPointsToUnlink) {
              this.data.checkpointPoints.unlinkNodes(point, next);
              if (next.pointIndex != 0 && next.prev.length == 1 && next.prev[0].node.next.length == 1)
                next.firstInPath = false;
              else
                next.firstInPath = true;
            }
            for (let next of point.next) {
              if (next.node.pointIndex != 0 && next.node.prev.length == 1 && next.node.prev[0].node.next.length == 1)
                next.node.firstInPath = false;
              else
                next.node.firstInPath = true;
            }
          }
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        clearRespawnPoints() {
          for (let point of this.data.checkpointPoints.nodes) {
            if (!point.selected[0] && !point.selected[1])
              continue;
            point.respawnNode = null;
          }
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        assignRespawnPoints() {
          let selectedRespawnNodes = this.data.respawnPoints.nodes.filter((p) => p.selected === true);
          if (selectedRespawnNodes.length != 1) {
            alert("Select a single point using the Respawn Points panel.");
            return;
          }
          for (let point of this.data.checkpointPoints.nodes) {
            if (!point.selected[0] && !point.selected[1])
              continue;
            point.respawnNode = selectedRespawnNodes[0];
          }
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        toggleShowLoaded() {
          let notAllRendered = this.data.checkpointPoints.nodes.some((p) => !p.isRendered);
          for (let point of this.data.checkpointPoints.nodes)
            point.isRendered = notAllRendered;
          if (notAllRendered)
            return;
          let selectedPoints = [];
          for (let point of this.data.checkpointPoints.nodes) {
            if (!point.selected[0] && !point.selected[1])
              continue;
            point.isRendered = true;
            selectedPoints.push(point);
          }
          while (selectedPoints.length > 0) {
            let point = selectedPoints.pop();
            for (let prev of point.prev) {
              if (prev.node.isRendered)
                continue;
              prev.node.isRendered = true;
              if (prev.node.type == 255)
                selectedPoints.push(prev.node);
            }
            for (let next of point.next) {
              if (next.node.isRendered)
                continue;
              next.node.isRendered = true;
              if (next.node.type == 255)
                selectedPoints.push(next.node);
            }
          }
        }
        onKeyDown(ev) {
          if (ev.ctrlKey || ev.metaKey)
            return false;
          switch (ev.key) {
            case "A":
            case "a":
              this.toggleAllSelection();
              return true;
            case "Backspace":
            case "Delete":
            case "X":
            case "x":
              this.deleteSelectedPoints();
              return true;
            case "U":
            case "u":
              this.unlinkSelectedPoints();
              return true;
            case "E":
            case "e":
              this.clearRespawnPoints();
              return true;
            case "S":
            case "s":
              this.toggleShowLoaded();
              return true;
            case "R":
            case "r":
              this.assignRespawnPoints();
              return true;
          }
          return false;
        }
        onMouseDown(ev, x, y, cameraPos, ray, hit, distToHit, mouse3DPos) {
          this.linkingPoints = false;
          for (let point of this.data.checkpointPoints.nodes)
            point.moveOrigin = [point.pos[0], point.pos[1]];
          let hoveringOverElem = this.getHoveringOverElement(cameraPos, ray, distToHit);
          if (ev.altKey || !(ev.ctrlKey || ev.metaKey) && (hoveringOverElem == null || !hoveringOverElem.point.selected[hoveringOverElem.which]))
            this.unselectAll();
          if (ev.ctrlKey || ev.metaKey)
            this.multiSelect = true;
          if (hoveringOverElem != null) {
            if (ev.altKey) {
              if (hoveringOverElem.point.next.length >= this.data.checkpointPoints.maxNextNodes) {
                alert("Node link error!\n\nMax outgoing connections to a point surpassed (maximum " + this.data.checkpointPoints.maxNextNodes + ")");
                return;
              }
              let newPoint = this.data.checkpointPoints.addNode();
              newPoint.pos = [hoveringOverElem.point.pos[0], hoveringOverElem.point.pos[1]];
              newPoint.respawnNode = hoveringOverElem.point.respawnNode;
              this.data.checkpointPoints.linkNodes(hoveringOverElem.point, newPoint);
              if (hoveringOverElem.point.next.length > 1)
                for (let next of hoveringOverElem.point.next)
                  next.node.firstInPath = true;
              this.refresh();
              newPoint.selected = [true, true];
              this.linkingPoints = true;
              this.data.refreshIndices(this.viewer.cfg.isBattleTrack);
              this.viewer.setCursor("-webkit-grabbing");
              this.refreshPanels();
              this.window.setNotSaved();
            } else {
              hoveringOverElem.point.selected[hoveringOverElem.which] = true;
              this.refreshPanels();
              this.viewer.setCursor("-webkit-grabbing");
            }
          } else if (ev.altKey) {
            let newPoint = this.data.checkpointPoints.addNode();
            let zTopHit = Geometry.lineZPlaneIntersection(ray.origin, ray.direction, this.zTop);
            newPoint.pos[0] = zTopHit;
            newPoint.pos[1] = zTopHit.add(new Vec3(1e3, 0, 0));
            newPoint.pos[0].z = 0;
            newPoint.pos[1].z = 0;
            newPoint.firstInPath = true;
            this.refresh();
            newPoint.selected[0] = true;
            newPoint.selected[1] = true;
            this.data.refreshIndices(this.viewer.cfg.isBattleTrack);
            this.viewer.setCursor("-webkit-grabbing");
            this.refreshPanels();
            this.window.setNotSaved();
          }
        }
        onMouseMove(ev, x, y, cameraPos, ray, hit, distToHit) {
          if (!this.viewer.mouseDown) {
            let lastHover = this.hoveringOverPoint;
            this.hoveringOverPoint = this.getHoveringOverElement(cameraPos, ray, distToHit);
            if (this.hoveringOverPoint != null) {
              this.viewer.setCursor("-webkit-grab");
              if (lastHover == null || this.hoveringOverPoint.point != lastHover.point || this.hoveringOverPoint.which != lastHover.which)
                this.viewer.render();
            } else if (lastHover != null)
              this.viewer.render();
          } else if (ev.ctrlKey || ev.metaKey) {
            let lastHover = this.hoveringOverPoint;
            this.hoveringOverPoint = this.getHoveringOverElement(cameraPos, ray, distToHit);
            if (this.hoveringOverPoint != null) {
              this.viewer.setCursor("-webkit-grab");
              this.hoveringOverPoint.point.selected[this.hoveringOverPoint.which] = true;
              this.refreshPanels();
              if (lastHover == null || this.hoveringOverPoint.point != lastHover.point || this.hoveringOverPoint.which != lastHover.which)
                this.viewer.render();
            } else if (lastHover != null)
              this.viewer.render();
          } else if (!this.multiSelect && this.viewer.mouseAction == "move") {
            let linkToPoint = this.getHoveringOverElement(cameraPos, ray, distToHit, false);
            for (let point of this.data.checkpointPoints.nodes) {
              for (let which = 0; which < 2; which++) {
                if (!point.selected[which])
                  continue;
                this.window.setNotSaved();
                this.viewer.setCursor("-webkit-grabbing");
                if (this.linkingPoints && linkToPoint != null) {
                  point.pos[which] = linkToPoint.point.pos[which];
                } else {
                  let screenPosMoved = this.viewer.pointToScreen(point.moveOrigin[which]);
                  screenPosMoved.x += this.viewer.mouseMoveOffsetPixels.x;
                  screenPosMoved.y += this.viewer.mouseMoveOffsetPixels.y;
                  let pointRayMoved = this.viewer.getScreenRay(screenPosMoved.x, screenPosMoved.y);
                  point.pos[which] = Geometry.lineZPlaneIntersection(pointRayMoved.origin, pointRayMoved.direction, this.zTop);
                }
              }
            }
            this.refreshPanels();
          }
        }
        onMouseUp(ev, x, y) {
          this.multiSelect = false;
          if (this.viewer.mouseAction == "move") {
            if (this.linkingPoints) {
              let pointBeingLinked = this.data.checkpointPoints.nodes.find((p) => p.selected[0] || p.selected[1]);
              if (pointBeingLinked == null)
                return;
              let pointBeingLinkedTo = this.data.checkpointPoints.nodes.find((p) => p != pointBeingLinked && (p.pos[0] == pointBeingLinked.pos[0] || p.pos[0] == pointBeingLinked.pos[1] || p.pos[1] == pointBeingLinked.pos[0] || p.pos[1] == pointBeingLinked.pos[1]));
              if (pointBeingLinkedTo != null) {
                this.data.checkpointPoints.removeNode(pointBeingLinked);
                if (pointBeingLinkedTo.prev.length >= this.data.checkpointPoints.maxPrevNodes) {
                  alert("Node link error!\n\nMax incoming connections to a point surpassed (maximum " + this.data.checkpointPoints.maxPrevNodes + ")");
                  this.refresh();
                  return;
                }
                this.data.checkpointPoints.linkNodes(pointBeingLinked.prev[0].node, pointBeingLinkedTo);
                if (pointBeingLinkedTo.pointIndex != 0 && pointBeingLinkedTo.prev.length == 1 && pointBeingLinkedTo.prev[0].node.next.length == 1)
                  pointBeingLinkedTo.firstInPath = false;
                else
                  pointBeingLinkedTo.firstInPath = true;
                this.refresh();
                this.window.setNotSaved();
              }
            }
          }
        }
        drawAfterModel() {
          let cameraPos = this.viewer.getCurrentCameraPosition();
          let camera = this.viewer.getCurrentCamera();
          let setupPanelMatrices = (renderer, v1, v2) => {
            let v = v2.sub(v1);
            let matrixScale = Mat4.scale(v.magn(), 1, this.zBottom - this.zTop);
            let matrixAlign = Mat4.rotationFromTo(new Vec3(1, 0, 0), v.normalize());
            let matrixTranslate = Mat4.translation(v1.x, v1.y, v1.z);
            renderer.setCustomMatrix(matrixScale.mul(matrixAlign.mul(matrixTranslate)));
          };
          let setupPathMatrices = (renderer, scale, v1, v2) => {
            let v = v2.sub(v1);
            let matrixScale = Mat4.scale(scale, scale, v.magn());
            let matrixAlign = Mat4.rotationFromTo(new Vec3(0, 0, 1), v.normalize());
            let matrixTranslate = Mat4.translation(v1.x, v1.y, v1.z);
            renderer.setCustomMatrix(matrixScale.mul(matrixAlign.mul(matrixTranslate)));
          };
          let setupArrowMatrices = (renderer, scale, v1, v2) => {
            let midpoint = v1.add(v2).scale(0.5);
            let facing = v2.sub(v1).normalize().cross(new Vec3(0, 0, -1));
            let matrixScale = Mat4.scale(scale, scale, scale);
            let matrixAlign = Mat4.rotationFromTo(new Vec3(1, 0, 0), facing);
            let matrixTranslate = Mat4.translation(midpoint.x, midpoint.y, midpoint.z);
            renderer.setCustomMatrix(matrixScale.mul(matrixAlign.mul(matrixTranslate)));
          };
          for (let point of this.data.checkpointPoints.nodes) {
            point.pos[0].z = this.zTop;
            point.pos[1].z = this.zTop;
          }
          for (let point of this.data.checkpointPoints.nodes) {
            let scales = [0, 0];
            let prevIsRendered2 = point.prev.some((p) => p.node.isRendered);
            for (let which = 0; which < 2; which++) {
              let hovering = this.hoveringOverPoint != null && this.hoveringOverPoint.point == point && this.hoveringOverPoint.which == which;
              let scale = (hovering ? 1.5 : 1) * this.viewer.getElementScale(point.pos[which]);
              scales[which] = scale;
              point.renderer[which].setTranslation(point.pos[which]).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor(point.type == 0 ? [1, 0.5, 1, 1] : point.type != 255 ? [1, 0, 1, 1] : [0, 0, 1, 1]).setEnabled(point.isRendered || prevIsRendered2);
              for (let n = 0; n < point.next.length; n++) {
                let nextPos = point.next[n].node.pos[which];
                let scale2 = Math.min(scale, this.viewer.getElementScale(nextPos));
                let matrixScale = Mat4.scale(scale2, scale2, nextPos.sub(point.pos[which]).magn());
                let matrixAlign = Mat4.rotationFromTo(new Vec3(0, 0, 1), nextPos.sub(point.pos[which]).normalize());
                let matrixTranslate = Mat4.translation(point.pos[which].x, point.pos[which].y, point.pos[which].z);
                let matrixScaleArrow = Mat4.scale(scale2, scale2, scale2);
                let matrixTranslateArrow = Mat4.translation(nextPos.x, nextPos.y, nextPos.z);
                point.rendererOutgoingPaths[n][which].setCustomMatrix(matrixScale.mul(matrixAlign.mul(matrixTranslate))).setDiffuseColor(point.next[n].node.firstInPath ? [0, 0.8, 0.7, 1] : [0, 0.5, 1, 1]).setEnabled(point.isRendered);
                point.rendererOutgoingPathArrows[n][which].setCustomMatrix(matrixScaleArrow.mul(matrixAlign.mul(matrixTranslateArrow))).setDiffuseColor(point.next[n].node.firstInPath ? [0, 0.9, 0.8, 1] : [0, 0.75, 1, 1]).setEnabled(point.isRendered);
                setupPanelMatrices(point.rendererOutgoingPathPanels[n][which], point.pos[which], nextPos);
                point.rendererOutgoingPathPanels[n][which].setDiffuseColor([0, 0.25, 1, 0.3]).setEnabled(point.isRendered);
              }
            }
            let barScale = (this.hoveringOverPoint != null && this.hoveringOverPoint.point == point ? 1.5 : 1) * Math.min(scales[0], scales[1]) / 1.5;
            setupPathMatrices(point.rendererCheckbar, barScale, point.pos[0], point.pos[1]);
            point.rendererCheckbar.setDiffuseColor(point.type == 0 ? [1, 0.5, 1, 1] : point.type != 255 ? [1, 0, 1, 1] : [0, 0, 1, 1]).setEnabled(point.isRendered || prevIsRendered2);
            setupPanelMatrices(point.rendererCheckpanel, point.pos[0], point.pos[1]);
            point.rendererCheckpanel.setDiffuseColor(point.type == 0 ? [1, 0.5, 1, 0.6] : point.type != 255 ? [1, 0.25, 1, 0.6] : [0, 0.25, 1, 0.6]).setEnabled(point.isRendered || prevIsRendered2);
            setupArrowMatrices(point.rendererDirArrow, barScale, point.pos[0], point.pos[1]);
            point.rendererDirArrow.setDiffuseColor(point.type == 0 ? [1, 0.5, 1, 1] : point.type != 255 ? [1, 0, 1, 1] : [0, 0, 1, 1]).setEnabled(this.viewer.cfg.checkpointsEnableDirectionArrows && (point.isRendered || prevIsRendered2));
            let respawnNode = point.respawnNode;
            if (respawnNode == null && this.data.respawnPoints.nodes.length > 0)
              respawnNode = this.data.respawnPoints.nodes[0];
            if (respawnNode != null) {
              setupPathMatrices(point.rendererRespawnLink, barScale, point.pos[0], respawnNode.pos);
              point.rendererRespawnLink.setDiffuseColor([0.85, 0.85, 0, 1]).setEnabled(this.viewer.cfg.checkpointsEnableRespawnPointLinks && point.isRendered);
            } else
              point.rendererRespawnLink.setEnabled(false);
          }
          this.scene.render(this.viewer.gl, camera);
          if (this.viewer.cfg.checkpointsEnableVerticalPanels) {
            this.scenePanels.render(this.viewer.gl, camera);
            this.sceneSidePanels.render(this.viewer.gl, camera);
          }
          for (let point of this.data.checkpointPoints.nodes) {
            for (let which = 0; which < 2; which++) {
              let hovering = this.hoveringOverPoint != null && this.hoveringOverPoint.point == point && this.hoveringOverPoint.which == which;
              let scale = (hovering ? 1.5 : 1) * this.viewer.getElementScale(point.pos[which]);
              point.rendererSelected[which].setTranslation(point.pos[which]).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([0.5, 0.5, 1, 1]).setEnabled(point.selected[which] && (point.isRendered || prevIsRendered));
              point.rendererSelectedCore[which].setDiffuseColor([0, 0, 1, 1]);
            }
          }
          this.sceneAfter.clearDepth(this.viewer.gl);
          this.sceneAfter.render(this.viewer.gl, camera);
        }
      };
      if (module)
        module.exports = { ViewerCheckpoints };
    }
  });

  // src/viewer/viewerObjects.js
  var require_viewerObjects = __commonJS({
    "src/viewer/viewerObjects.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { PointViewer } = require_pointViewer();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var objectNames = [];
      objectNames[1] = "airblock          ";
      objectNames[2] = "Psea              ";
      objectNames[3] = "lensFX            ";
      objectNames[4] = "venice_nami       ";
      objectNames[5] = "sound_river       ";
      objectNames[6] = "sound_water_fall  ";
      objectNames[7] = "pocha             ";
      objectNames[8] = "sound_lake        ";
      objectNames[9] = "sound_big_fall    ";
      objectNames[10] = "sound_sea         ";
      objectNames[11] = "sound_fountain    ";
      objectNames[12] = "sound_volcano     ";
      objectNames[13] = "sound_audience    ";
      objectNames[14] = "sound_big_river   ";
      objectNames[15] = "sound_sand_fall   ";
      objectNames[16] = "sound_lift        ";
      objectNames[17] = "pochaYogan        ";
      objectNames[18] = "entry             ";
      objectNames[19] = "pochaMori         ";
      objectNames[20] = "eline_control     ";
      objectNames[21] = "sound_Mii         ";
      objectNames[22] = "begoman_manager   ";
      objectNames[23] = "ice               ";
      objectNames[24] = "startline2D       ";
      objectNames[101] = "itembox           ";
      objectNames[102] = "DummyPole         ";
      objectNames[103] = "flag              ";
      objectNames[104] = "flagBlend         ";
      objectNames[105] = "gnd_sphere        ";
      objectNames[106] = "gnd_trapezoid     ";
      objectNames[107] = "gnd_wave1         ";
      objectNames[108] = "gnd_wave2         ";
      objectNames[109] = "gnd_wave3         ";
      objectNames[110] = "gnd_wave4         ";
      objectNames[111] = "sun               ";
      objectNames[112] = "woodbox           ";
      objectNames[113] = "KmoonZ            ";
      objectNames[114] = "sunDS             ";
      objectNames[115] = "coin              ";
      objectNames[116] = "ironbox           ";
      objectNames[117] = "ItemDirect        ";
      objectNames[118] = "s_itembox         ";
      objectNames[119] = "pile_coin         ";
      objectNames[201] = "f_itembox         ";
      objectNames[202] = "MashBalloonGC     ";
      objectNames[203] = "WLwallGC          ";
      objectNames[204] = "CarA1             ";
      objectNames[205] = "basabasa          ";
      objectNames[206] = "HeyhoShipGBA      ";
      objectNames[207] = "koopaBall         ";
      objectNames[208] = "kart_truck        ";
      objectNames[209] = "car_body          ";
      objectNames[210] = "skyship           ";
      objectNames[211] = "w_woodbox         ";
      objectNames[212] = "w_itembox         ";
      objectNames[213] = "w_itemboxline     ";
      objectNames[214] = "VolcanoBall1      ";
      objectNames[215] = "penguin_s         ";
      objectNames[216] = "penguin_m         ";
      objectNames[217] = "penguin_l         ";
      objectNames[218] = "castleballoon1    ";
      objectNames[219] = "dossunc           ";
      objectNames[220] = "dossunc_soko      ";
      objectNames[221] = "boble             ";
      objectNames[222] = "K_bomb_car        ";
      objectNames[223] = "K_bomb_car_dummy  ";
      objectNames[224] = "car_body_dummy    ";
      objectNames[225] = "kart_truck_dummy  ";
      objectNames[226] = "hanachan          ";
      objectNames[227] = "seagull           ";
      objectNames[228] = "moray             ";
      objectNames[229] = "crab              ";
      objectNames[230] = "basabasa_dummy    ";
      objectNames[231] = "CarA2             ";
      objectNames[232] = "CarA3             ";
      objectNames[233] = "Hwanwan           ";
      objectNames[234] = "HeyhoBallGBA      ";
      objectNames[235] = "Twanwan           ";
      objectNames[236] = "cruiserR          ";
      objectNames[237] = "bird              ";
      objectNames[238] = "sin_itembox       ";
      objectNames[239] = "Twanwan_ue        ";
      objectNames[240] = "BossHanachan      ";
      objectNames[241] = "Kdossunc          ";
      objectNames[242] = "BossHanachanHead  ";
      objectNames[243] = "K_bomb_car1       ";
      objectNames[301] = "dummy             ";
      objectNames[302] = "dokan_sfc         ";
      objectNames[303] = "castletree1       ";
      objectNames[304] = "castletree1c      ";
      objectNames[305] = "castletree2       ";
      objectNames[306] = "castleflower1     ";
      objectNames[307] = "mariotreeGC       ";
      objectNames[308] = "mariotreeGCc      ";
      objectNames[309] = "donkytree1GC      ";
      objectNames[310] = "donkytree2GC      ";
      objectNames[311] = "peachtreeGC       ";
      objectNames[312] = "peachtreeGCc      ";
      objectNames[313] = "npc_mii_a         ";
      objectNames[314] = "npc_mii_b         ";
      objectNames[315] = "npc_mii_c         ";
      objectNames[316] = "obakeblockSFCc    ";
      objectNames[317] = "WLarrowGC         ";
      objectNames[318] = "WLscreenGC        ";
      objectNames[319] = "WLdokanGC         ";
      objectNames[320] = "MarioGo64c        ";
      objectNames[321] = "PeachHunsuiGC     ";
      objectNames[322] = "kinokoT1          ";
      objectNames[323] = "kinokoT2          ";
      objectNames[324] = "pylon01           ";
      objectNames[325] = "PalmTree          ";
      objectNames[326] = "parasol           ";
      objectNames[327] = "cruiser           ";
      objectNames[328] = "K_sticklift00     ";
      objectNames[329] = "heyho2            ";
      objectNames[330] = "HeyhoTreeGBAc     ";
      objectNames[331] = "MFaceBill         ";
      objectNames[332] = "truckChimSmk      ";
      objectNames[333] = "MiiObj01          ";
      objectNames[334] = "MiiObj02          ";
      objectNames[335] = "MiiObj03          ";
      objectNames[336] = "gardentreeDS      ";
      objectNames[337] = "gardentreeDSc     ";
      objectNames[338] = "FlagA1            ";
      objectNames[339] = "FlagA2            ";
      objectNames[340] = "FlagB1            ";
      objectNames[341] = "FlagB2            ";
      objectNames[342] = "FlagA3            ";
      objectNames[343] = "DKtreeA64         ";
      objectNames[344] = "DKtreeA64c        ";
      objectNames[345] = "DKtreeB64         ";
      objectNames[346] = "DKtreeB64c        ";
      objectNames[347] = "TownTreeDSc       ";
      objectNames[348] = "Piston            ";
      objectNames[349] = "oilSFC            ";
      objectNames[350] = "DKmarutaGCc       ";
      objectNames[351] = "DKropeGCc         ";
      objectNames[352] = "mii_balloon       ";
      objectNames[353] = "windmill          ";
      objectNames[354] = "dossun            ";
      objectNames[355] = "TownTreeDS        ";
      objectNames[356] = "Ksticketc         ";
      objectNames[357] = "monte_a           ";
      objectNames[358] = "MiiStatueM1       ";
      objectNames[359] = "ShMiiObj01        ";
      objectNames[360] = "ShMiiObj02        ";
      objectNames[361] = "ShMiiObj03        ";
      objectNames[362] = "Hanabi            ";
      objectNames[363] = "miiposter         ";
      objectNames[364] = "dk_miiobj00       ";
      objectNames[365] = "light_house       ";
      objectNames[366] = "r_parasol         ";
      objectNames[367] = "obakeblock2SFCc   ";
      objectNames[368] = "obakeblock3SFCc   ";
      objectNames[369] = "koopaFigure       ";
      objectNames[370] = "pukupuku          ";
      objectNames[371] = "v_stand1          ";
      objectNames[372] = "v_stand2          ";
      objectNames[373] = "leaf_effect       ";
      objectNames[374] = "karehayama        ";
      objectNames[375] = "EarthRing         ";
      objectNames[376] = "SpaceSun          ";
      objectNames[377] = "BlackHole         ";
      objectNames[378] = "StarRing          ";
      objectNames[379] = "M_obj_kanban      ";
      objectNames[380] = "MiiStatueL1       ";
      objectNames[381] = "MiiStatueD1       ";
      objectNames[382] = "MiiSphinxY1       ";
      objectNames[383] = "MiiSphinxY2       ";
      objectNames[384] = "FlagA5            ";
      objectNames[385] = "CarB              ";
      objectNames[386] = "FlagA4            ";
      objectNames[387] = "Steam             ";
      objectNames[388] = "Alarm             ";
      objectNames[389] = "group_monte_a     ";
      objectNames[390] = "MiiStatueL2       ";
      objectNames[391] = "MiiStatueD2       ";
      objectNames[392] = "MiiStatueP1       ";
      objectNames[393] = "SentakuDS         ";
      objectNames[394] = "fks_screen_wii    ";
      objectNames[395] = "KoopaFigure64     ";
      objectNames[396] = "b_teresa          ";
      objectNames[397] = "MiiStatueDK1      ";
      objectNames[398] = "MiiKanban         ";
      objectNames[399] = "BGteresaSFC       ";
      objectNames[401] = "kuribo            ";
      objectNames[402] = "choropu           ";
      objectNames[403] = "cow               ";
      objectNames[404] = "pakkun_f          ";
      objectNames[405] = "WLfirebarGC       ";
      objectNames[406] = "wanwan            ";
      objectNames[407] = "poihana           ";
      objectNames[408] = "DKrockGC          ";
      objectNames[409] = "sanbo             ";
      objectNames[410] = "choropu2          ";
      objectNames[411] = "TruckWagon        ";
      objectNames[412] = "heyho             ";
      objectNames[413] = "Press             ";
      objectNames[414] = "Press_soko        ";
      objectNames[415] = "pile              ";
      objectNames[416] = "choropu_ground    ";
      objectNames[417] = "WLfireringGC      ";
      objectNames[418] = "pakkun_dokan      ";
      objectNames[419] = "begoman_spike     ";
      objectNames[420] = "FireSnake         ";
      objectNames[421] = "koopaFirebar      ";
      objectNames[422] = "Epropeller        ";
      objectNames[423] = "dc_pillar_c       ";
      objectNames[424] = "FireSnake_v       ";
      objectNames[425] = "honeBall          ";
      objectNames[426] = "puchi_pakkun      ";
      objectNames[427] = "sanbo_big         ";
      objectNames[428] = "sanbo_big         ";
      objectNames[501] = "kinoko_ud         ";
      objectNames[502] = "kinoko_bend       ";
      objectNames[503] = "VolcanoRock1      ";
      objectNames[504] = "bulldozer_left    ";
      objectNames[505] = "bulldozer_right   ";
      objectNames[506] = "kinoko_nm         ";
      objectNames[507] = "Crane             ";
      objectNames[508] = "VolcanoPiece      ";
      objectNames[509] = "FlamePole         ";
      objectNames[510] = "TwistedWay        ";
      objectNames[511] = "TownBridgeDSc     ";
      objectNames[512] = "DKship64          ";
      objectNames[513] = "kinoko_kuki       ";
      objectNames[514] = "DKturibashiGCc    ";
      objectNames[515] = "FlamePoleEff      ";
      objectNames[516] = "aurora            ";
      objectNames[517] = "venice_saku       ";
      objectNames[518] = "casino_roulette   ";
      objectNames[519] = "BossField01_OBJ1  ";
      objectNames[520] = "dc_pillar         ";
      objectNames[521] = "dc_sandcone       ";
      objectNames[522] = "venice_hasi       ";
      objectNames[523] = "venice_gondola    ";
      objectNames[524] = "quicksand         ";
      objectNames[525] = "bblock            ";
      objectNames[526] = "ami               ";
      objectNames[527] = "M_obj_jump        ";
      objectNames[528] = "starGate          ";
      objectNames[529] = "RM_ring1          ";
      objectNames[530] = "FlamePole_v       ";
      objectNames[531] = "M_obj_s_jump      ";
      objectNames[532] = "InsekiA           ";
      objectNames[533] = "InsekiB           ";
      objectNames[534] = "FlamePole_v_big   ";
      objectNames[535] = "Mdush             ";
      objectNames[536] = "HP_pipe           ";
      objectNames[537] = "DemoCol           ";
      objectNames[538] = "M_obj_s_jump2     ";
      objectNames[539] = "M_obj_jump2       ";
      objectNames[601] = "DonkyCannonGC     ";
      objectNames[602] = "BeltEasy          ";
      objectNames[603] = "BeltCrossing      ";
      objectNames[604] = "BeltCurveA        ";
      objectNames[605] = "BeltCurveB        ";
      objectNames[606] = "escalator         ";
      objectNames[607] = "DonkyCannon_wii   ";
      objectNames[608] = "escalator_group   ";
      objectNames[609] = "tree_cannon       ";
      objectNames[701] = "group_enemy_b     ";
      objectNames[702] = "group_enemy_c     ";
      objectNames[703] = "taimatsu          ";
      objectNames[704] = "truckChimSmkW     ";
      objectNames[705] = "Mstand            ";
      objectNames[706] = "dkmonitor         ";
      objectNames[707] = "group_enemy_a     ";
      objectNames[708] = "FlagB3            ";
      objectNames[709] = "spot              ";
      objectNames[710] = "group_enemy_d     ";
      objectNames[711] = "FlagB4            ";
      objectNames[712] = "group_enemy_e     ";
      objectNames[713] = "group_monte_L     ";
      objectNames[714] = "group_enemy_f     ";
      objectNames[715] = "FallBsA           ";
      objectNames[716] = "FallBsB           ";
      objectNames[717] = "FallBsC           ";
      objectNames[718] = "volsmk            ";
      objectNames[719] = "ridgemii00        ";
      objectNames[720] = "Flash_L           ";
      objectNames[721] = "Flash_B           ";
      objectNames[722] = "Flash_W           ";
      objectNames[723] = "Flash_M           ";
      objectNames[724] = "Flash_S           ";
      objectNames[725] = "MiiSignNoko       ";
      objectNames[726] = "UtsuboDokan       ";
      objectNames[727] = "Spot64            ";
      objectNames[728] = "DemoEf            ";
      objectNames[729] = "Fall_MH           ";
      objectNames[730] = "Fall_Y            ";
      objectNames[731] = "DemoJugemu        ";
      objectNames[732] = "group_enemy_a_demo";
      objectNames[733] = "group_monte_a_demo";
      objectNames[734] = "volfall           ";
      objectNames[735] = "MiiStatueM2       ";
      objectNames[736] = "RhMiiKanban       ";
      objectNames[737] = "MiiStatueL3       ";
      objectNames[738] = "MiiSignWario      ";
      objectNames[739] = "MiiStatueBL1      ";
      objectNames[740] = "MiiStatueBD1      ";
      objectNames[741] = "Kamifubuki        ";
      objectNames[742] = "Crescent64        ";
      objectNames[743] = "MiiSighKino       ";
      objectNames[744] = "MiiObjD01         ";
      objectNames[745] = "MiiObjD02         ";
      objectNames[746] = "MiiObjD03         ";
      objectNames[747] = "mare_a            ";
      objectNames[748] = "mare_b            ";
      objectNames[749] = "EnvKareha         ";
      objectNames[750] = "EnvFire           ";
      objectNames[751] = "EnvSnow           ";
      objectNames[752] = "M_obj_start       ";
      objectNames[753] = "EnvKarehaUp       ";
      objectNames[754] = "M_obj_kanban_y    ";
      objectNames[755] = "DKfalls           ";
      var conditionalModeOptions = [
        { str: "None", value: 0 },
        { str: "Lap Range", value: 1 },
        { str: "Checkpoint Range", value: 2 },
        { str: "Lap Range (Inverted)", value: 3 },
        { str: "Checkpoint Range (Inverted)", value: 4 },
        { str: "Lap Progress Range", value: 5 },
        { str: "Lap Progress Range (Inverted)", value: 6 }
      ];
      function clampCondIndex(value) {
        value = Math.round(value);
        if (!isFinite(value))
          value = 0;
        return Math.max(0, Math.min(7, value));
      }
      function clampCondPercent(value) {
        value = Math.round(value);
        if (!isFinite(value))
          value = 0;
        return Math.max(0, Math.min(100, value));
      }
      function isLapCondMode(mode) {
        return mode == 1 || mode == 3 || mode == 5 || mode == 6;
      }
      function isLapProgressCondMode(mode) {
        return mode == 5 || mode == 6;
      }
      function isInvertedCondMode(mode) {
        return mode == 3 || mode == 4 || mode == 6;
      }
      function getCondPadding(p) {
        return (p.xpfThing ?? 0) & 65535;
      }
      function getCondProgressStartPercent(p) {
        return clampCondPercent(getCondPadding(p) >> 8 & 255);
      }
      function getCondProgressEndPercent(p) {
        return clampCondPercent(getCondPadding(p) & 255);
      }
      function setCondProgressStartPercent(p, value) {
        let padding = getCondPadding(p);
        p.xpfThing = (clampCondPercent(value) << 8 | padding & 255) & 65535;
      }
      function setCondProgressEndPercent(p, value) {
        let padding = getCondPadding(p);
        p.xpfThing = (padding & 65280 | clampCondPercent(value)) & 65535;
      }
      function getCondDisplayStart(p) {
        let mode = p.condMode || 0;
        let start = p.condStart || 0;
        if (isLapCondMode(mode))
          return clampCondIndex(start) + 1;
        return clampCondIndex(start);
      }
      function getCondDisplayEnd(p) {
        let mode = p.condMode || 0;
        let end = p.condEnd || 0;
        if (isLapCondMode(mode))
          return clampCondIndex(end) + 1;
        return clampCondIndex(end);
      }
      function condDisplayToRaw(mode, value) {
        if (isLapCondMode(mode))
          return clampCondIndex(value - 1);
        return clampCondIndex(value);
      }
      function describeConditional(p) {
        let mode = p.condMode || 0;
        if (mode == 0)
          return "<strong>Conditional State:</strong> Disabled";
        let start = clampCondIndex(p.condStart || 0);
        let end = clampCondIndex(p.condEnd || 0);
        if (isLapCondMode(mode)) {
          start += 1;
          end += 1;
        }
        if (isLapProgressCondMode(mode)) {
          let startPercent = getCondProgressStartPercent(p);
          let endPercent = getCondProgressEndPercent(p);
          let startValue = clampCondIndex(p.condStart || 0) * 100 + startPercent;
          let endValue = clampCondIndex(p.condEnd || 0) * 100 + endPercent;
          let wraps2 = startValue > endValue ? " (wrap-around)" : "";
          let rangeText = "lap " + start + " @ " + startPercent + "% to lap " + end + " @ " + endPercent + "%";
          if (isInvertedCondMode(mode))
            return "<strong>Conditional State:</strong> OFF in " + rangeText + wraps2 + ", ON elsewhere";
          return "<strong>Conditional State:</strong> ON in " + rangeText + wraps2 + ", OFF elsewhere";
        }
        let targetName = isLapCondMode(mode) ? "laps" : "checkpoint regions";
        let wraps = (p.condStart || 0) > (p.condEnd || 0) ? " (wrap-around)" : "";
        if (isInvertedCondMode(mode))
          return "<strong>Conditional State:</strong> OFF in " + targetName + " " + start + " to " + end + wraps + ", ON elsewhere";
        return "<strong>Conditional State:</strong> ON in " + targetName + " " + start + " to " + end + wraps + ", OFF elsewhere";
      }
      function getCheckpointCompletion(point, maxLayer) {
        if (point == null || point.pathLen == null || point.pathLen <= 0 || point.pathPointIndex == null || point.pathLayer == null || maxLayer < 0)
          return null;
        let groupCompletion = point.pathPointIndex / point.pathLen;
        let overallCompletion = (groupCompletion + point.pathLayer) / (maxLayer + 1);
        return isFinite(overallCompletion) ? overallCompletion : null;
      }
      function getCheckpointCenter(point) {
        return point.pos[0].add(point.pos[1]).scale(0.5);
      }
      function projectPointOntoSegment2D(point, start, end) {
        let dx = end.x - start.x;
        let dy = end.y - start.y;
        let lenSq = dx * dx + dy * dy;
        if (lenSq <= 0) {
          let offsetX = point.x - start.x;
          let offsetY = point.y - start.y;
          return { t: 0, distSq: offsetX * offsetX + offsetY * offsetY };
        }
        let t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lenSq;
        t = Math.max(0, Math.min(1, t));
        let projX = start.x + dx * t;
        let projY = start.y + dy * t;
        let distX = point.x - projX;
        let distY = point.y - projY;
        return { t, distSq: distX * distX + distY * distY };
      }
      function normalizeProgress(progress) {
        if (!isFinite(progress))
          return null;
        let wrapped = progress % 1;
        if (wrapped < 0)
          wrapped += 1;
        return wrapped;
      }
      function getLapProgressPercentForObject(data, objectPoint) {
        if (objectPoint == null || objectPoint.pos == null || data == null || data.checkpointPoints == null)
          return null;
        let checkpointPoints = data.checkpointPoints.nodes;
        if (checkpointPoints == null || checkpointPoints.length == 0)
          return null;
        let maxLayer = data.checkpointPoints.maxLayer;
        if (!isFinite(maxLayer) || maxLayer < 0) {
          maxLayer = -1;
          for (let point of checkpointPoints) {
            if (point.pathLayer != null && isFinite(point.pathLayer))
              maxLayer = Math.max(maxLayer, point.pathLayer);
          }
        }
        if (maxLayer < 0)
          return null;
        let bestDistSq = Infinity;
        let bestProgress = null;
        for (let point of checkpointPoints) {
          let pointCompletion = getCheckpointCompletion(point, maxLayer);
          if (pointCompletion == null)
            continue;
          let pointCenter = getCheckpointCenter(point);
          if (!pointCenter.isFinite())
            continue;
          let hasSegment = false;
          for (let next of point.next) {
            if (next == null || next.node == null)
              continue;
            let nextCompletion = getCheckpointCompletion(next.node, maxLayer);
            if (nextCompletion == null)
              continue;
            let nextCenter = getCheckpointCenter(next.node);
            if (!nextCenter.isFinite())
              continue;
            let projection = projectPointOntoSegment2D(objectPoint.pos, pointCenter, nextCenter);
            let segmentStart = pointCompletion;
            let segmentEnd = nextCompletion;
            if (segmentEnd < segmentStart)
              segmentEnd += 1;
            let progress2 = normalizeProgress(segmentStart + (segmentEnd - segmentStart) * projection.t);
            if (progress2 != null && projection.distSq < bestDistSq) {
              bestDistSq = projection.distSq;
              bestProgress = progress2;
            }
            hasSegment = true;
          }
          if (hasSegment)
            continue;
          let distX = objectPoint.pos.x - pointCenter.x;
          let distY = objectPoint.pos.y - pointCenter.y;
          let distSq = distX * distX + distY * distY;
          let progress = normalizeProgress(pointCompletion);
          if (progress != null && distSq < bestDistSq) {
            bestDistSq = distSq;
            bestProgress = progress;
          }
        }
        return bestProgress != null ? bestProgress * 100 : null;
      }
      var ViewerObjects = class extends PointViewer {
        constructor(window2, viewer, data) {
          super(window2, viewer, data);
          this.interCloneCount = 3;
        }
        points() {
          return this.data.objects;
        }
        refreshPanels() {
          let panel = this.window.addPanel("Objects", false, (open) => {
            if (open) this.viewer.setSubviewer(this);
          });
          this.panel = panel;
          panel.addText(null, "<strong>Hold Alt + Click:</strong> Create Object");
          panel.addText(null, "<strong>Hold Alt + Drag Object:</strong> Duplicate Object");
          panel.addText(null, "<strong>Hold Ctrl:</strong> Multiselect");
          panel.addCheckbox(null, "Draw rotation guides", this.viewer.cfg.enableRotationRender, (x) => this.viewer.cfg.enableRotationRender = x);
          panel.addCheckbox(null, "Use signed settings (-32768...32767)", this.viewer.cfg.objectsEnableSignedSettings, (x) => {
            this.viewer.cfg.objectsEnableSignedSettings = x;
            this.refreshPanels();
          });
          panel.addSpacer(null);
          panel.addButton(null, "(A) Select/Unselect All", () => this.toggleAllSelection());
          panel.addButton(null, "(T) Select All With Same ID", () => this.toggleAllSelectionByID());
          panel.addButton(null, "(X) Delete Selected", () => this.deleteSelectedPoints());
          panel.addButton(null, "(Y) Snap To Collision Y", () => this.snapSelectedToY());
          panel.addSpacer(null);
          panel.addButton(null, "Add Duplicates Between 2 Selected", () => this.interClone(this.interCloneCount));
          panel.addSelectionNumericInput(null, "Dupe Count", 1, 100, this.interCloneCount, 1, 1, true, false, (x) => {
            this.interCloneCount = x;
          });
          panel.addSpacer(null, 2);
          panel.addButton(null, "Open Object Database", () => this.window.openExternalLink("https://szs.wiimm.de/cgi/mkw/object"));
          panel.addSpacer(null);
          let selectedPoints = this.data.objects.nodes.filter((p) => p.selected);
          let selectionGroup = panel.addGroup(null, "Selection:");
          let enabled = selectedPoints.length > 0;
          let multiedit = selectedPoints.length > 1;
          if (selectedPoints.length == 1) {
            let i = this.data.objects.nodes.findIndex((p) => p === selectedPoints[0]);
            panel.addText(selectionGroup, "<strong>GOBJ Index:</strong> " + i.toString() + " (0x" + i.toString(16) + ")");
            let lapProgress = getLapProgressPercentForObject(this.data, selectedPoints[0]);
            panel.addText(selectionGroup, "<strong>Lap Progress:</strong> " + (lapProgress != null ? lapProgress.toFixed(4).toString() + "%" : "N/A"));
          }
          let objName = panel.addText(selectionGroup, "<strong>Name:</strong> " + (selectedPoints.length > 0 ? objectNames[selectedPoints[0].id] : ""));
          panel.addSelectionNumericInput(selectionGroup, "ID", 0, 65535, selectedPoints.map((p) => p.id), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].id = x;
            objName.innerHTML = "<strong>Name:</strong> " + objectNames[x];
          });
          panel.addSelectionNumericInput(selectionGroup, "X", -1e6, 1e6, selectedPoints.map((p) => p.pos.x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Y", -1e6, 1e6, selectedPoints.map((p) => -p.pos.z), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.z = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Z", -1e6, 1e6, selectedPoints.map((p) => -p.pos.y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. X", -1e6, 1e6, selectedPoints.map((p) => p.rotation.x), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.x = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Y", -1e6, 1e6, selectedPoints.map((p) => p.rotation.y), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.y = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Z", -1e6, 1e6, selectedPoints.map((p) => p.rotation.z), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.z = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Scale X", -1e6, 1e6, selectedPoints.map((p) => p.scale.x), null, 0.1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].scale.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Scale Y", -1e6, 1e6, selectedPoints.map((p) => p.scale.z), null, 0.1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].scale.z = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Scale Z", -1e6, 1e6, selectedPoints.map((p) => p.scale.y), null, 0.1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].scale.y = x;
          });
          let routeOptions = [{ str: "None", value: 65535 }];
          for (let i = 0; i < this.data.routes.length; i++)
            routeOptions.push({ str: "Route " + i + " (0x" + i.toString(16) + ")", value: i });
          panel.addSelectionDropdown(selectionGroup, "Route", selectedPoints.map((p) => p.routeIndex), routeOptions, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].routeIndex = x;
          });
          for (let s = 0; s < 8; s++)
            if (this.viewer.cfg.objectsEnableSignedSettings)
              panel.addSelectionNumericInput(selectionGroup, "Setting " + (s + 1), -32768, 32767, selectedPoints.map((p) => p.settings[s] >= 32768 ? p.settings[s] - 65536 : p.settings[s]), 1, 1, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].settings[s] = x < 0 ? 65536 + x : x;
              });
            else
              panel.addSelectionNumericInput(selectionGroup, "Setting " + (s + 1), 0, 65535, selectedPoints.map((p) => p.settings[s]), 1, 1, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].settings[s] = x;
              });
          panel.addSpacer(selectionGroup);
          panel.addText(selectionGroup, "<strong>Conditional Objects (Presence Flags bits 3-11, Padding for Lap Progress %):</strong>");
          panel.addSelectionDropdown(selectionGroup, "Cond. Mode", selectedPoints.map((p) => p.condMode || 0), conditionalModeOptions, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].condMode = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Cond. Start", 0, 8, selectedPoints.map((p) => getCondDisplayStart(p)), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            let mode = selectedPoints[i].condMode || 0;
            if (mode == 0) {
              selectedPoints[i].condMode = 1;
              mode = 1;
            }
            selectedPoints[i].condStart = condDisplayToRaw(mode, x);
          });
          panel.addSelectionNumericInput(selectionGroup, "Cond. End", 0, 8, selectedPoints.map((p) => getCondDisplayEnd(p)), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            let mode = selectedPoints[i].condMode || 0;
            if (mode == 0) {
              selectedPoints[i].condMode = 1;
              mode = 1;
            }
            selectedPoints[i].condEnd = condDisplayToRaw(mode, x);
          });
          panel.addSelectionNumericInput(selectionGroup, "Cond. Start %", 0, 100, selectedPoints.map((p) => getCondProgressStartPercent(p)), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            let mode = selectedPoints[i].condMode || 0;
            if (!isLapProgressCondMode(mode))
              selectedPoints[i].condMode = 5;
            setCondProgressStartPercent(selectedPoints[i], x);
          });
          panel.addSelectionNumericInput(selectionGroup, "Cond. End %", 0, 100, selectedPoints.map((p) => getCondProgressEndPercent(p)), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            let mode = selectedPoints[i].condMode || 0;
            if (!isLapProgressCondMode(mode))
              selectedPoints[i].condMode = 5;
            setCondProgressEndPercent(selectedPoints[i], x);
          });
          if (enabled && selectedPoints.length > 0) {
            let first = selectedPoints[0];
            let allSame = selectedPoints.every((p) => (p.condMode || 0) === (first.condMode || 0) && (p.condStart || 0) === (first.condStart || 0) && (p.condEnd || 0) === (first.condEnd || 0));
            if (allSame && isLapProgressCondMode(first.condMode || 0))
              allSame = selectedPoints.every((p) => getCondProgressStartPercent(p) === getCondProgressStartPercent(first) && getCondProgressEndPercent(p) === getCondProgressEndPercent(first));
            if (allSame)
              panel.addText(selectionGroup, describeConditional(first));
            else
              panel.addText(selectionGroup, "<strong>Conditional State:</strong> Multiple selected objects have different conditional values");
          }
          panel.addSpacer(selectionGroup);
          panel.addSelectionNumericInput(selectionGroup, "Padding", 0, 65535, selectedPoints.map((p) => p.xpfThing ?? 0), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].xpfThing = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Presence", 0, 7, selectedPoints.map((p) => p.presence & 7), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].presence = x & 7;
          });
        }
        refresh() {
          super.refresh();
          this.refreshPanels();
        }
        toggleAllSelectionByID() {
          let selectedObjs = this.data.objects.nodes.filter((p) => p.selected);
          for (let point of this.data.objects.nodes)
            point.selected = selectedObjs.find((p) => p.id == point.id) != null;
          this.refreshPanels();
        }
        interClone(count) {
          let selectedObjs = this.data.objects.nodes.filter((p) => p.selected);
          if (selectedObjs.length !== 2)
            return;
          if (this.points().nodes.length + count > this.points().maxNodes) {
            alert("KMP error!\n\nMaximum number of points surpassed (" + this.points().maxNodes + ")");
            return;
          }
          let newPoints = [];
          for (let i = 0; i < count; i++) {
            newPoints.push(this.points().addNode());
            this.points().onCloneNode(newPoints[i], selectedObjs[0]);
            newPoints[i].pos.x = (selectedObjs[0].pos.x * (i + 1) + selectedObjs[1].pos.x * (count - i)) / (count + 1);
            newPoints[i].pos.y = (selectedObjs[0].pos.y * (i + 1) + selectedObjs[1].pos.y * (count - i)) / (count + 1);
            newPoints[i].pos.z = (selectedObjs[0].pos.z * (i + 1) + selectedObjs[1].pos.z * (count - i)) / (count + 1);
            newPoints[i].selected = true;
          }
          this.refresh();
          this.refreshPanels();
          this.window.setNotSaved();
        }
        onKeyDown(ev) {
          if (super.onKeyDown(ev))
            return true;
          switch (ev.key) {
            case "T":
            case "t":
              this.toggleAllSelectionByID();
              return true;
          }
          return false;
        }
        drawAfterModel() {
          for (let point of this.data.objects.nodes) {
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            point.renderer.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([1, 0, 1, 1]);
            point.rendererSelected.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([1, 0.5, 1, 1]).setEnabled(point.selected);
            point.rendererSelectedCore.setDiffuseColor([1, 0, 1, 1]);
            let matrixDirection = Mat4.scale(scale, scale / 1.5, scale / 1.5).mul(Mat4.rotation(new Vec3(0, 0, 1), 90 * Math.PI / 180)).mul(Mat4.rotation(new Vec3(1, 0, 0), point.rotation.x * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 0, 1), -point.rotation.y * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 1, 0), -point.rotation.z * Math.PI / 180)).mul(Mat4.translation(point.pos.x, point.pos.y, point.pos.z));
            point.rendererDirection.setCustomMatrix(matrixDirection).setDiffuseColor([1, 0.5, 1, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionArrow.setCustomMatrix(matrixDirection).setDiffuseColor([1, 0.35, 1, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionUp.setCustomMatrix(matrixDirection).setDiffuseColor([0.75, 0, 0.75, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
          }
          this.scene.render(this.viewer.gl, this.viewer.getCurrentCamera());
          this.sceneAfter.clearDepth(this.viewer.gl);
          this.sceneAfter.render(this.viewer.gl, this.viewer.getCurrentCamera());
        }
      };
      if (module)
        module.exports = { ViewerObjects };
    }
  });

  // src/viewer/viewerRoutes.js
  var require_viewerRoutes = __commonJS({
    "src/viewer/viewerRoutes.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { PathViewer } = require_pathViewer();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var ViewerRoutes = class extends PathViewer {
        constructor(window2, viewer, data) {
          super(window2, viewer, data);
          this.currentRouteIndex = 0;
        }
        points() {
          if (this.currentRouteIndex < 0 || this.currentRouteIndex >= this.data.routes.length)
            return { nodes: [] };
          return this.data.routes[this.currentRouteIndex].points;
        }
        refreshPanels() {
          let panel = this.window.addPanel("Routes", false, (open) => {
            if (open) this.viewer.setSubviewer(this);
          });
          this.panel = panel;
          panel.addText(null, "<strong>Hold Alt + Click:</strong> Create Point");
          panel.addText(null, "<strong>Hold Alt + Drag Point:</strong> Extend Path");
          panel.addText(null, "<strong>Hold Ctrl:</strong> Multiselect");
          panel.addSpacer(null);
          panel.addButton(null, "(A) Select/Unselect All", () => this.toggleAllSelection());
          panel.addButton(null, "(X) Delete Selected", () => this.deleteSelectedPoints());
          panel.addButton(null, "(Y) Snap To Collision Y", () => this.snapSelectedToY());
          panel.addButton(null, "(U) Unlink Selected", () => this.unlinkSelectedPoints());
          panel.addSpacer(null);
          let routeOptions = [];
          for (let i = 0; i < this.data.routes.length; i++)
            routeOptions.push({ str: "Route " + i + " (0x" + i.toString(16) + ")", value: i });
          panel.addText(null, "\u26A0\uFE0F <strong>Does not currently auto-manage route references from objects, cameras, and areas!</strong>");
          panel.addSelectionDropdown(null, "Current", this.currentRouteIndex, routeOptions, true, false, (x, i) => {
            this.currentRouteIndex = x;
            this.refresh();
          });
          panel.addButton(null, "Create New Route", () => this.createRoute());
          panel.addButton(null, "Delete Current Route", () => this.deleteRoute());
          panel.addSpacer(null);
          if (this.currentRouteIndex < 0 || this.currentRouteIndex >= this.data.routes.length)
            return;
          let route = this.data.routes[this.currentRouteIndex];
          let setting1Options = [
            { str: "Straight Edges", value: 0 },
            { str: "Curved Edges", value: 1 }
          ];
          panel.addSelectionDropdown(null, "Setting 1", route.setting1, setting1Options, true, false, (x, i) => {
            this.window.setNotSaved();
            route.setting1 = x;
            this.refresh();
          });
          let setting2Options = [
            { str: "Cyclic Motion", value: 0 },
            { str: "Back-and-Forth Motion", value: 1 }
          ];
          panel.addSelectionDropdown(null, "Setting 2", route.setting2, setting2Options, true, false, (x, i) => {
            this.window.setNotSaved();
            route.setting2 = x;
          });
          let selectedPoints = route.points.nodes.filter((p) => p.selected);
          let selectionGroup = panel.addGroup(null, "Selection:");
          let enabled = selectedPoints.length > 0;
          let multiedit = selectedPoints.length > 1;
          if (selectedPoints.length == 1) {
            let i = route.points.nodes.findIndex((p) => p === selectedPoints[0]);
            panel.addText(selectionGroup, "<strong>Point Index:</strong> " + i.toString() + " (0x" + i.toString(16) + ")");
          }
          panel.addSelectionNumericInput(selectionGroup, "X", -1e6, 1e6, selectedPoints.map((p) => p.pos.x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Y", -1e6, 1e6, selectedPoints.map((p) => -p.pos.z), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.z = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Z", -1e6, 1e6, selectedPoints.map((p) => -p.pos.y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Setting 1", 0, 65535, selectedPoints.map((p) => p.setting1), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].setting1 = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Setting 2", 0, 65535, selectedPoints.map((p) => p.setting2), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].setting2 = x;
          });
        }
        refresh() {
          super.refresh();
          this.refreshPanels();
        }
        createRoute() {
          this.data.addNewRoute();
          this.currentRouteIndex = this.data.routes.length - 1;
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        deleteRoute() {
          if (this.currentRouteIndex < 0 || this.currentRouteIndex >= this.data.routes.length)
            return;
          this.data.routes.splice(this.currentRouteIndex, 1);
          this.currentRouteIndex = Math.min(this.currentRouteIndex, this.data.routes.length - 1);
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        onKeyDown(ev) {
          switch (ev.key) {
            case "A":
            case "a":
              this.toggleAllSelection();
              return true;
            case "Backspace":
            case "Delete":
            case "X":
            case "x":
              this.deleteSelectedPoints();
              return true;
            case "Y":
            case "y":
              this.snapSelectedToY();
              return true;
            case "U":
            case "u":
              this.unlinkSelectedPoints();
              return true;
          }
          return false;
        }
        drawAfterModel() {
          if (this.currentRouteIndex < 0 || this.currentRouteIndex >= this.data.routes.length)
            return;
          let route = this.data.routes[this.currentRouteIndex];
          let cameraPos = this.viewer.getCurrentCameraPosition();
          for (let point of route.points.nodes) {
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            point.renderer.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([0, 0.75, 0.75, 1]);
            for (let n = 0; n < point.next.length; n++) {
              let nextPos = point.next[n].node.pos;
              let scale2 = Math.min(scale, this.viewer.getElementScale(nextPos));
              let matrixScale = Mat4.scale(scale2, scale2, nextPos.sub(point.pos).magn());
              let matrixAlign = Mat4.rotationFromTo(new Vec3(0, 0, 1), nextPos.sub(point.pos).normalize());
              let matrixTranslate = Mat4.translation(point.pos.x, point.pos.y, point.pos.z);
              let matrixScaleArrow = Mat4.scale(scale2, scale2, scale2);
              let matrixTranslateArrow = Mat4.translation(nextPos.x, nextPos.y, nextPos.z);
              point.rendererOutgoingPaths[n].setCustomMatrix(matrixScale.mul(matrixAlign.mul(matrixTranslate))).setDiffuseColor([0.5, 1, 1, 1]);
              point.rendererOutgoingPathArrows[n].setCustomMatrix(matrixScaleArrow.mul(matrixAlign.mul(matrixTranslateArrow))).setDiffuseColor([0, 0.55, 0.75, 1]);
            }
          }
          this.scene.render(this.viewer.gl, this.viewer.getCurrentCamera());
          for (let point of route.points.nodes) {
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            point.rendererSelected.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([0.5, 1, 1, 1]).setEnabled(point.selected);
            point.rendererSelectedCore.setDiffuseColor([0, 0.75, 0.75, 1]);
          }
          this.sceneAfter.clearDepth(this.viewer.gl);
          this.sceneAfter.render(this.viewer.gl, this.viewer.getCurrentCamera());
        }
      };
      if (module)
        module.exports = { ViewerRoutes };
    }
  });

  // src/viewer/viewerAreas.js
  var require_viewerAreas = __commonJS({
    "src/viewer/viewerAreas.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { PointViewer } = require_pointViewer();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var ViewerAreas = class extends PointViewer {
        constructor(window2, viewer, data) {
          super(window2, viewer, data);
          this.modelAreaBox = new ModelBuilder().addCube(5e3, 5e3, -1e4, -5e3, -5e3, 0).calculateNormals().makeModel(viewer.gl);
          this.modelAreaCylinder = new ModelBuilder().addCylinder(5e3, 5e3, -1e4, -5e3, -5e3, 0, 24).calculateNormals().makeModel(viewer.gl);
        }
        points() {
          return this.data.areaPoints;
        }
        refreshPanels() {
          let panel = this.window.addPanel("Area", false, (open) => {
            if (open) this.viewer.setSubviewer(this);
          });
          this.panel = panel;
          panel.addText(null, "<strong>Hold Alt + Click:</strong> Create Area");
          panel.addText(null, "<strong>Hold Alt + Drag Object:</strong> Duplicate Area");
          panel.addText(null, "<strong>Hold Ctrl:</strong> Multiselect");
          panel.addCheckbox(null, "Draw rotation guides", this.viewer.cfg.enableRotationRender, (x) => this.viewer.cfg.enableRotationRender = x);
          panel.addSpacer(null);
          panel.addButton(null, "(A) Select/Unselect All", () => this.toggleAllSelection());
          panel.addButton(null, "(T) Select All With Same Type", () => this.toggleAllSelectionByType());
          panel.addButton(null, "(X) Delete Selected", () => this.deleteSelectedPoints());
          panel.addButton(null, "(Y) Snap To Collision Y", () => this.snapSelectedToY());
          panel.addSpacer(null);
          let selectedPoints = this.data.areaPoints.nodes.filter((p) => p.selected);
          let selectionGroup = panel.addGroup(null, "Selection:");
          let enabled = selectedPoints.length > 0;
          let multiedit = selectedPoints.length > 1;
          if (selectedPoints.length == 1) {
            let i = this.data.areaPoints.nodes.findIndex((p) => p === selectedPoints[0]);
            panel.addText(selectionGroup, "<strong>AREA Index:</strong> " + i.toString() + " (0x" + i.toString(16) + ")");
          }
          panel.addCheckbox(selectionGroup, "Render Area", !enabled ? false : multiedit ? selectedPoints.every((p) => p.isRendered) : selectedPoints[0].isRendered, (x) => {
            for (let point of selectedPoints)
              point.isRendered = x;
          });
          let typeOptions = [
            { str: "Camera", value: 0 },
            { str: "Env Effect", value: 1 },
            { str: "Fog Effect", value: 2 },
            { str: "Moving Water", value: 3 },
            { str: "Force Recalc", value: 4 },
            { str: "Minimap Control", value: 5 },
            { str: "Bloom Effect", value: 6 },
            { str: "Enable Boos", value: 7 },
            { str: "Object Group", value: 8 },
            { str: "Object Unload", value: 9 },
            { str: "Fall Boundary", value: 10 }
          ];
          panel.addSelectionDropdown(selectionGroup, "Type", selectedPoints.map((p) => p.type), typeOptions, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].type = x;
            this.refresh();
          });
          let shapeOptions = [
            { str: "Box", value: 0 },
            { str: "Cylinder", value: 1 }
          ];
          panel.addSelectionDropdown(selectionGroup, "Shape", selectedPoints.map((p) => p.shape), shapeOptions, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].shape = x;
            this.refresh();
          });
          panel.addSelectionNumericInput(selectionGroup, "X", -1e6, 1e6, selectedPoints.map((p) => p.pos.x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Y", -1e6, 1e6, selectedPoints.map((p) => -p.pos.z), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.z = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Z", -1e6, 1e6, selectedPoints.map((p) => -p.pos.y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. X", -1e6, 1e6, selectedPoints.map((p) => p.rotation.x), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.x = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Y", -1e6, 1e6, selectedPoints.map((p) => p.rotation.y), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.y = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Z", -1e6, 1e6, selectedPoints.map((p) => p.rotation.z), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.z = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Scale X", -1e6, 1e6, selectedPoints.map((p) => p.scale.x), null, 0.1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].scale.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Scale Y", -1e6, 1e6, selectedPoints.map((p) => p.scale.y), null, 0.1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].scale.y = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Scale Z", -1e6, 1e6, selectedPoints.map((p) => p.scale.z), null, 0.1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].scale.z = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Priority", 0, 255, selectedPoints.map((p) => p.priority), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].priority = x;
          });
          let selectionType = enabled && selectedPoints.every((p) => p.type == selectedPoints[0].type) ? selectedPoints[0].type : -1;
          switch (selectionType) {
            case 0:
              let camOptions = [{ str: "None", value: 255 }];
              for (let i = 0; i < this.data.cameras.nodes.length; i++)
                camOptions.push({ str: "Camera " + i + " (0x" + i.toString(16) + ")", value: i });
              panel.addSelectionDropdown(selectionGroup, "Camera", selectedPoints.map((p) => p.cameraIndex), camOptions, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].cameraIndex = x;
              });
              break;
            case 1:
              let envOptions = [
                { str: "EnvKareha", value: 0 },
                { str: "EnvKarehaUp", value: 1 }
              ];
              panel.addSelectionDropdown(selectionGroup, "Object", selectedPoints.map((p) => p.setting1), envOptions, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].setting1 = x;
              });
              break;
            case 2:
              panel.addSelectionNumericInput(selectionGroup, "BFG entry", 0, 65535, selectedPoints.map((p) => p.setting1), 1, 1, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].setting1 = x;
              });
              panel.addSelectionNumericInput(selectionGroup, "Setting 2", 0, 65535, selectedPoints.map((p) => p.setting2), 1, 1, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].setting2 = x;
              });
              break;
            case 3:
              let routeOptions = [{ str: "None", value: 255 }];
              for (let i = 0; i < this.data.routes.length; i++)
                routeOptions.push({ str: "Route " + i + " (0x" + i.toString(16) + ")", value: i });
              panel.addSelectionDropdown(selectionGroup, "Route", selectedPoints.map((p) => p.routeIndex), routeOptions, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].routeIndex = x;
              });
              panel.addSelectionNumericInput(selectionGroup, "Acceleration", 0, 65535, selectedPoints.map((p) => p.setting1), 1, 1, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].setting1 = x;
              });
              panel.addSelectionNumericInput(selectionGroup, "Route Speed", 0, 65535, selectedPoints.map((p) => p.setting2), 1, 1, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].setting2 = x;
              });
              break;
            case 4:
              panel.addSelectionNumericInput(selectionGroup, "Enemy Point", 0, 255, selectedPoints.map((p) => p.enemyIndex), 1, 1, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].enemyIndex = x;
              });
              break;
            case 5:
              panel.addSelectionNumericInput(selectionGroup, "Setting 1", 0, 65535, selectedPoints.map((p) => p.setting1), 1, 1, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].setting1 = x;
              });
              panel.addSelectionNumericInput(selectionGroup, "Setting 2", 0, 65535, selectedPoints.map((p) => p.setting2), 1, 1, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].setting2 = x;
              });
              break;
            case 6:
              panel.addSelectionNumericInput(selectionGroup, "BBLM File", 0, 65535, selectedPoints.map((p) => p.setting1), 1, 1, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].setting1 = x;
              });
              panel.addSelectionNumericInput(selectionGroup, "Fade Time", 0, 65535, selectedPoints.map((p) => p.setting2), 1, 1, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].setting2 = x;
              });
              break;
            case 7:
              break;
            case 8:
            case 9:
              panel.addSelectionNumericInput(selectionGroup, "Group ID", 0, 65535, selectedPoints.map((p) => p.setting1), 1, 1, enabled, multiedit, (x, i) => {
                this.window.setNotSaved();
                selectedPoints[i].setting1 = x;
              });
              break;
            case 10:
              panel.addCheckbox(selectionGroup, "Enable Conditional OOB (requires LE-CODE)", this.data.areaPoints.enableCOOB, (x) => {
                this.data.areaPoints.enableCOOB = x;
                this.refreshPanels();
              });
              if (this.data.areaPoints.enableCOOB) {
                let coobPoints = this.data.areaPoints.nodes.filter((p) => p.type === 10);
                let modeOptions = [
                  { str: "Checkpoint Range", value: 255 },
                  { str: "KCP Region", value: 1 }
                ];
                panel.addSelectionDropdown(selectionGroup, "Mode", coobPoints.map((p) => p.routeIndex), modeOptions, enabled, multiedit, (x, i) => {
                  coobPoints[i].routeIndex = x;
                  this.refreshPanels();
                });
                panel.addSelectionNumericInput(selectionGroup, coobPoints[0].routeIndex == 1 ? "Setting" : "Start Index", 0, 65535, selectedPoints.map((p) => p.setting1), 1, 1, enabled, multiedit, (x, i) => {
                  this.window.setNotSaved();
                  selectedPoints[i].setting1 = x;
                });
                panel.addSelectionNumericInput(selectionGroup, coobPoints[0].routeIndex == 1 ? "KCP Number" : "End Index", 0, 65535, selectedPoints.map((p) => p.setting2), 1, 1, enabled, multiedit, (x, i) => {
                  this.window.setNotSaved();
                  selectedPoints[i].setting2 = x;
                });
              }
              break;
          }
        }
        refresh() {
          super.refresh();
          for (let point of this.data.areaPoints.nodes) {
            point.rendererArea = new GfxNodeRendererTransform().attach(this.scene.root).setModel(point.shape ? this.modelAreaCylinder : this.modelAreaBox).setMaterial(this.viewer.material);
            this.renderers.push(point.rendererArea);
          }
          this.refreshPanels();
        }
        toggleAllSelectionByType() {
          let selectedPoints = this.data.areaPoints.nodes.filter((p) => p.selected);
          for (let point of this.data.areaPoints.nodes)
            point.selected = selectedPoints.find((p) => p.type == point.type) != null;
          this.refreshPanels();
        }
        onKeyDown(ev) {
          if (super.onKeyDown(ev))
            return true;
          switch (ev.key) {
            case "T":
            case "t":
              this.toggleAllSelectionByType();
              return true;
          }
          return false;
        }
        onMouseDown(ev, x, y, cameraPos, ray, hit, distToHit, mouse3DPos) {
          super.onMouseDown(ev, x, y, cameraPos, ray, hit, distToHit, mouse3DPos);
          if (ev.altKey) {
            let newPointIndex = this.data.areaPoints.nodes.findIndex((p) => p.selected);
            if (newPointIndex > 0) {
              this.data.areaPoints.nodes[newPointIndex].isRendered = true;
              this.refresh();
            }
          }
        }
        drawAfterModel() {
          for (let point of this.data.areaPoints.nodes) {
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            point.renderer.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([1, 0.5, 0, 1]);
            point.rendererSelected.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([1, 0.7, 0, 1]).setEnabled(point.selected);
            point.rendererSelectedCore.setDiffuseColor([1, 0.5, 0, 1]);
            let pointScale = Mat4.scale(scale, scale / 1.5, scale / 1.5);
            let areaScale = Mat4.scale(point.scale.x, point.scale.z, point.scale.y).mul(Mat4.rotation(new Vec3(0, 0, 1), 90 * Math.PI / 180));
            let matrixDirection = Mat4.rotation(new Vec3(0, 0, 1), 90 * Math.PI / 180).mul(Mat4.rotation(new Vec3(1, 0, 0), point.rotation.x * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 0, 1), -point.rotation.y * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 1, 0), -point.rotation.z * Math.PI / 180)).mul(Mat4.translation(point.pos.x, point.pos.y, point.pos.z));
            point.rendererDirection.setCustomMatrix(pointScale.mul(matrixDirection)).setDiffuseColor([1, 0.7, 0, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionArrow.setCustomMatrix(pointScale.mul(matrixDirection)).setDiffuseColor([1, 0.35, 0, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionUp.setCustomMatrix(pointScale.mul(matrixDirection)).setDiffuseColor([0.75, 0.5, 0, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererArea.setCustomMatrix(areaScale.mul(matrixDirection)).setDiffuseColor([1, 0.7, 0, 0.5]).setEnabled(point.isRendered);
          }
          this.scene.render(this.viewer.gl, this.viewer.getCurrentCamera());
          this.sceneAfter.clearDepth(this.viewer.gl);
          this.sceneAfter.render(this.viewer.gl, this.viewer.getCurrentCamera());
        }
      };
      if (module)
        module.exports = { ViewerAreas };
    }
  });

  // src/viewer/viewerCameras.js
  var require_viewerCameras = __commonJS({
    "src/viewer/viewerCameras.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { PointViewer } = require_pointViewer();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var ViewerCameras = class extends PointViewer {
        constructor(window2, viewer, data) {
          super(window2, viewer, data);
        }
        points() {
          return this.data.cameras;
        }
        refreshPanels() {
          let panel = this.window.addPanel("Cameras", false, (open) => {
            if (open) this.viewer.setSubviewer(this);
          });
          this.panel = panel;
          panel.addText(null, "<strong>Hold Alt + Click:</strong> Create Camera");
          panel.addText(null, "<strong>Hold Alt + Drag Object:</strong> Duplicate Camera");
          panel.addText(null, "<strong>Hold Ctrl:</strong> Multiselect");
          panel.addCheckbox(null, "Draw rotation guides", this.viewer.cfg.enableRotationRender, (x) => this.viewer.cfg.enableRotationRender = x);
          panel.addSpacer(null);
          panel.addButton(null, "(A) Select/Unselect All", () => this.toggleAllSelection());
          panel.addButton(null, "(T) Select All With Same Type", () => this.toggleAllSelectionByType());
          panel.addButton(null, "(X) Delete Selected", () => this.deleteSelectedPoints());
          panel.addButton(null, "(Y) Snap To Collision Y", () => this.snapSelectedToY());
          panel.addSpacer(null);
          let firstOptions = [];
          for (let i = 0; i < this.data.cameras.nodes.length; i++)
            firstOptions.push({ str: "Camera " + i + " (0x" + i.toString(16) + ")", value: i });
          panel.addSelectionDropdown(null, "Intro Start", this.data.firstIntroCam, firstOptions, true, false, (x, i) => {
            this.window.setNotSaved();
            this.data.firstIntroCam = x;
          });
          let selectedPoints = this.data.cameras.nodes.filter((p) => p.selected);
          let selectionGroup = panel.addGroup(null, "Selection:");
          let enabled = selectedPoints.length > 0;
          let multiedit = selectedPoints.length > 1;
          if (selectedPoints.length == 1) {
            let i = this.data.cameras.nodes.findIndex((p) => p === selectedPoints[0]);
            panel.addText(selectionGroup, "<strong>CAME Index:</strong> " + i.toString() + " (0x" + i.toString(16) + ")");
          }
          let typeOptions = [
            { str: "Goal", value: 0 },
            { str: "FixSearch", value: 1 },
            { str: "PathSearch", value: 2 },
            { str: "KartFollow", value: 3 },
            { str: "KartPathFollow", value: 4 },
            { str: "OP_FixMoveAt", value: 5 },
            { str: "OP_PathMoveAt", value: 6 },
            { str: "MiniGame", value: 7 },
            { str: "MissionSuccess", value: 8 },
            { str: "Unknown", value: 9 }
          ];
          panel.addSelectionDropdown(selectionGroup, "Type", selectedPoints.map((p) => p.type), typeOptions, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].type = x;
            this.refresh();
          });
          let nextOptions = [{ str: "None", value: 255 }];
          for (let i = 0; i < this.data.cameras.nodes.length; i++)
            nextOptions.push({ str: "Camera " + i + " (0x" + i.toString(16) + ")", value: i });
          panel.addSelectionDropdown(selectionGroup, "Next Camera", selectedPoints.map((p) => p.nextCam), nextOptions, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].nextCam = x;
          });
          let routeOptions = [{ str: "None", value: 255 }];
          for (let i = 0; i < this.data.routes.length; i++)
            routeOptions.push({ str: "Route " + i + " (0x" + i.toString(16) + ")", value: i });
          panel.addSelectionDropdown(selectionGroup, "Route", selectedPoints.map((p) => p.routeIndex), routeOptions, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].routeIndex = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "X", -1e6, 1e6, selectedPoints.map((p) => p.pos.x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Y", -1e6, 1e6, selectedPoints.map((p) => -p.pos.z), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.z = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Z", -1e6, 1e6, selectedPoints.map((p) => -p.pos.y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. X", -1e6, 1e6, selectedPoints.map((p) => p.rotation.x), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.x = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Y", -1e6, 1e6, selectedPoints.map((p) => p.rotation.y), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.y = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Z", -1e6, 1e6, selectedPoints.map((p) => p.rotation.z), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.z = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Time", 0, 1e6, selectedPoints.map((p) => p.time), null, 10, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].time = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Point Speed", 0, 65535, selectedPoints.map((p) => p.vCam), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].vCam = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Zoom Speed", 0, 65535, selectedPoints.map((p) => p.vZoom), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].vZoom = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "View Speed", 0, 65535, selectedPoints.map((p) => p.vView), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].vView = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Zoom Start", -1e6, 1e6, selectedPoints.map((p) => p.zoomStart), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].zoomStart = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Zoom End", -1e6, 1e6, selectedPoints.map((p) => p.zoomEnd), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].zoomEnd = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "View Start X", -1e6, 1e6, selectedPoints.map((p) => p.viewPosStart.x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].viewPosStart.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "View Start Y", -1e6, 1e6, selectedPoints.map((p) => -p.viewPosStart.z), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].viewPosStart.z = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "View Start Z", -1e6, 1e6, selectedPoints.map((p) => -p.viewPosStart.y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].viewPosStart.y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "View End X", -1e6, 1e6, selectedPoints.map((p) => p.viewPosEnd.x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].viewPosEnd.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "View End Y", -1e6, 1e6, selectedPoints.map((p) => -p.viewPosEnd.z), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].viewPosEnd.z = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "View End Z", -1e6, 1e6, selectedPoints.map((p) => -p.viewPosEnd.y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].viewPosEnd.y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Shake(?)", 0, 255, selectedPoints.map((p) => p.shake), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].shake = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Start(?)", 0, 255, selectedPoints.map((p) => p.start), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].start = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Movie(?)", 0, 255, selectedPoints.map((p) => p.movie), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].movie = x;
          });
        }
        refresh() {
          super.refresh();
          this.refreshPanels();
        }
        toggleAllSelectionByType() {
          let selectedPoints = this.data.cameras.nodes.filter((p) => p.selected);
          for (let point of this.data.cameras.nodes)
            point.selected = selectedPoints.find((p) => p.type == point.type) != null;
          this.refreshPanels();
        }
        onKeyDown(ev) {
          if (super.onKeyDown(ev))
            return true;
          switch (ev.key) {
            case "T":
            case "t":
              this.toggleAllSelectionByType();
              return true;
          }
          return false;
        }
        drawAfterModel() {
          for (let point of this.data.cameras.nodes) {
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            point.renderer.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([0.5, 0.1, 0.7, 1]);
            point.rendererSelected.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([0.7, 0.1, 1, 1]).setEnabled(point.selected);
            point.rendererSelectedCore.setDiffuseColor([0.5, 0.1, 0.7, 1]);
            let pointScale = Mat4.scale(scale, scale / 1.5, scale / 1.5);
            let matrixDirection = Mat4.rotation(new Vec3(0, 0, 1), 90 * Math.PI / 180).mul(Mat4.rotation(new Vec3(1, 0, 0), point.rotation.x * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 0, 1), -point.rotation.y * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 1, 0), -point.rotation.z * Math.PI / 180)).mul(Mat4.translation(point.pos.x, point.pos.y, point.pos.z));
            point.rendererDirection.setCustomMatrix(pointScale.mul(matrixDirection)).setDiffuseColor([0.7, 0.1, 1, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionArrow.setCustomMatrix(pointScale.mul(matrixDirection)).setDiffuseColor([0.5, 0.1, 0.8, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionUp.setCustomMatrix(pointScale.mul(matrixDirection)).setDiffuseColor([0.75, 0.1, 1, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
          }
          this.scene.render(this.viewer.gl, this.viewer.getCurrentCamera());
          this.sceneAfter.clearDepth(this.viewer.gl);
          this.sceneAfter.render(this.viewer.gl, this.viewer.getCurrentCamera());
        }
      };
      if (module)
        module.exports = { ViewerCameras };
    }
  });

  // src/viewer/viewerRespawnPoints.js
  var require_viewerRespawnPoints = __commonJS({
    "src/viewer/viewerRespawnPoints.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { PointViewer } = require_pointViewer();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var ViewerRespawnPoints = class extends PointViewer {
        constructor(window2, viewer, data) {
          super(window2, viewer, data);
          this.modelPlayerPos = new ModelBuilder().addSphere(-60, -60, -60, 60, 60, 60).calculateNormals().makeModel(viewer.gl);
        }
        points() {
          return this.data.respawnPoints;
        }
        refreshPanels() {
          let panel = this.window.addPanel("Respawn Points", false, (open) => {
            if (open) this.viewer.setSubviewer(this);
          });
          this.panel = panel;
          panel.addText(null, "<strong>Hold Alt + Click:</strong> Create Point");
          panel.addText(null, "<strong>Hold Alt + Drag Point:</strong> Duplicate Point");
          panel.addText(null, "<strong>Hold Ctrl:</strong> Multiselect");
          panel.addCheckbox(null, "Draw rotation guides", this.viewer.cfg.enableRotationRender, (x) => this.viewer.cfg.enableRotationRender = x);
          panel.addCheckbox(null, "Draw player respawn positions", this.viewer.cfg.respawnsEnablePlayerSlots, (x) => this.viewer.cfg.respawnsEnablePlayerSlots = x);
          panel.addSpacer(null);
          panel.addButton(null, "(A) Select/Unselect All", () => this.toggleAllSelection());
          panel.addButton(null, "(X) Delete Selected", () => this.deleteSelectedPoints());
          panel.addButton(null, "(Y) Snap To Collision Y", () => this.snapSelectedToY());
          panel.addSpacer(null);
          let selectedPoints = this.data.respawnPoints.nodes.filter((p) => p.selected);
          let selectionGroup = panel.addGroup(null, "Selection:");
          let enabled = selectedPoints.length > 0;
          let multiedit = selectedPoints.length > 1;
          if (selectedPoints.length == 1) {
            let i = this.data.respawnPoints.nodes.findIndex((p) => p === selectedPoints[0]);
            panel.addText(selectionGroup, "<strong>JGPT Index:</strong> " + i.toString() + " (0x" + i.toString(16) + ")");
          }
          panel.addSelectionNumericInput(selectionGroup, "X", -1e6, 1e6, selectedPoints.map((p) => p.pos.x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Y", -1e6, 1e6, selectedPoints.map((p) => -p.pos.z), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.z = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Z", -1e6, 1e6, selectedPoints.map((p) => -p.pos.y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. X", -1e6, 1e6, selectedPoints.map((p) => p.rotation.x), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.x = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Y", -1e6, 1e6, selectedPoints.map((p) => p.rotation.y), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.y = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Z", -1e6, 1e6, selectedPoints.map((p) => p.rotation.z), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.z = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "ID", 0, 65535, selectedPoints.map((p) => p.id), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].id = x;
          });
          const toSoundTrig = (soundData) => {
            if (soundData == 65535) return -1;
            else return (soundData - 199) / 100 | 0;
          };
          const fromSoundTrig = (soundTrig) => {
            if (soundTrig == -1) return 65535;
            else return soundTrig * 100 + 199;
          };
          panel.addSelectionNumericInput(selectionGroup, "Sound Trig.", -1, 7, selectedPoints.map((p) => toSoundTrig(p.soundData)), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].soundData = fromSoundTrig(x);
          });
        }
        refresh() {
          super.refresh();
          for (let point of this.data.respawnPoints.nodes) {
            point.rendererPlayerPositions = [];
            for (let i = 0; i < 12; i++) {
              let rPlayerPos = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelPlayerPos).setMaterial(this.viewer.material);
              point.rendererPlayerPositions.push(rPlayerPos);
              this.renderers.push(rPlayerPos);
            }
          }
          this.refreshPanels();
        }
        deleteSelectedPoints() {
          let pointsToDelete = [];
          for (let point of this.points().nodes) {
            if (!point.selected)
              continue;
            pointsToDelete.push(point);
          }
          for (let point of pointsToDelete) {
            this.data.removeRespawnPointLinks(point);
            this.points().removeNode(point);
          }
          this.refresh();
          this.window.setNotSaved();
          this.window.setUndoPoint();
        }
        drawAfterModel() {
          for (let point of this.data.respawnPoints.nodes) {
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            point.renderer.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([0.55, 0.55, 0, 1]);
            point.rendererSelected.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([0.95, 0.95, 0, 1]).setEnabled(point.selected);
            point.rendererSelectedCore.setDiffuseColor([0.55, 0.55, 0, 1]);
            let matrixScale = Mat4.scale(scale, scale / 1.5, scale / 1.5);
            let matrixDirection = Mat4.rotation(new Vec3(0, 0, 1), 90 * Math.PI / 180).mul(Mat4.rotation(new Vec3(1, 0, 0), point.rotation.x * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 0, 1), -point.rotation.y * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 1, 0), -point.rotation.z * Math.PI / 180)).mul(Mat4.translation(point.pos.x, point.pos.y, point.pos.z));
            point.rendererDirection.setCustomMatrix(matrixScale.mul(matrixDirection)).setDiffuseColor([0.85, 0.85, 0, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionArrow.setCustomMatrix(matrixScale.mul(matrixDirection)).setDiffuseColor([0.75, 0.75, 0, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionUp.setCustomMatrix(matrixScale.mul(matrixDirection)).setDiffuseColor([0.5, 0.5, 0, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            let k = 0;
            for (let i = -600; i <= 0; i += 300)
              for (let j = -450; j <= 450; j += 300) {
                point.rendererPlayerPositions[k].setCustomMatrix(Mat4.translation(i, j, 0).mul(matrixDirection).mul(Mat4.translation(0, 0, -550))).setDiffuseColor([0.75, 0.75, 0, 1]).setEnabled(this.viewer.cfg.respawnsEnablePlayerSlots);
                k++;
              }
          }
          this.scene.render(this.viewer.gl, this.viewer.getCurrentCamera());
          this.sceneAfter.clearDepth(this.viewer.gl);
          this.sceneAfter.render(this.viewer.gl, this.viewer.getCurrentCamera());
        }
      };
      if (module)
        module.exports = { ViewerRespawnPoints };
    }
  });

  // src/viewer/viewerCannonPoints.js
  var require_viewerCannonPoints = __commonJS({
    "src/viewer/viewerCannonPoints.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { PointViewer } = require_pointViewer();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var ViewerCannonPoints = class extends PointViewer {
        constructor(window2, viewer, data) {
          super(window2, viewer, data);
          let panelColor = [1, 0.5, 0.5, 1];
          this.modelPanel = new ModelBuilder().addQuad(new Vec3(0, 0, 1), new Vec3(1, 0, 1), new Vec3(1, 0, -1), new Vec3(0, 0, -1), panelColor, panelColor, panelColor, panelColor).addQuad(new Vec3(0, 0, -1), new Vec3(1, 0, -1), new Vec3(1, 0, 1), new Vec3(0, 0, 1), panelColor, panelColor, panelColor, panelColor).calculateNormals().makeModel(viewer.gl);
        }
        points() {
          return this.data.cannonPoints;
        }
        refreshPanels() {
          let panel = this.window.addPanel("Cannon Points", false, (open) => {
            if (open) this.viewer.setSubviewer(this);
          });
          this.panel = panel;
          let selectedPoints = this.data.cannonPoints.nodes.filter((p) => p.selected);
          panel.addText(null, "<strong>Hold Alt + Click:</strong> Create Point");
          panel.addText(null, "<strong>Hold Alt + Drag Point:</strong> Duplicate Point");
          panel.addText(null, "<strong>Hold Ctrl:</strong> Multiselect");
          panel.addCheckbox(null, "Draw rotation guides", this.viewer.cfg.enableRotationRender, (x) => this.viewer.cfg.enableRotationRender = x);
          panel.addCheckbox(null, "Draw backwards Y rotation guides", this.viewer.cfg.cannonsEnableDirectionRender, (x) => this.viewer.cfg.cannonsEnableDirectionRender = x);
          panel.addCheckbox(null, "Highlight selected trigger KCL", this.viewer.cfg.cannonsEnableKclHighlight, (x) => {
            this.viewer.cfg.cannonsEnableKclHighlight = x;
            if (selectedPoints.length == 1) {
              let selectedIndex = this.data.cannonPoints.nodes.findIndex((p) => p === selectedPoints[0]);
              this.window.hl.reset();
              this.window.hl.baseType = x ? 17 : -1;
              this.window.hl.basicEffect = x ? selectedIndex : -1;
              this.window.openKcl(this.window.currentKclFilename);
              this.highlighting = true;
            }
          });
          panel.addSpacer(null);
          panel.addButton(null, "(A) Select/Unselect All", () => this.toggleAllSelection());
          panel.addButton(null, "(X) Delete Selected", () => this.deleteSelectedPoints());
          panel.addButton(null, "(Y) Snap To Collision Y", () => this.snapSelectedToY());
          panel.addSpacer(null);
          let selectionGroup = panel.addGroup(null, "Selection:");
          let enabled = selectedPoints.length > 0;
          let multiedit = selectedPoints.length > 1;
          if (selectedPoints.length == 1) {
            let selectedIndex = this.data.cannonPoints.nodes.findIndex((p) => p === selectedPoints[0]);
            panel.addText(selectionGroup, "<strong>CNPT Index:</strong> " + selectedIndex + " (0x" + selectedIndex.toString(16) + ")");
            if (this.viewer.cfg.cannonsEnableKclHighlight) {
              this.window.hl.reset();
              this.window.hl.baseType = 17;
              this.window.hl.basicEffect = selectedIndex;
              this.window.openKcl(this.window.currentKclFilename);
              this.highlighting = true;
            }
          } else if (this.highlighting) {
            this.window.hl.reset();
            this.window.openKcl(this.window.currentKclFilename);
            this.highlighting = false;
          }
          panel.addSelectionNumericInput(selectionGroup, "Dest. X", -1e6, 1e6, selectedPoints.map((p) => p.pos.x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Dest. Y", -1e6, 1e6, selectedPoints.map((p) => -p.pos.z), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.z = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Dest. Z", -1e6, 1e6, selectedPoints.map((p) => -p.pos.y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. X", -1e6, 1e6, selectedPoints.map((p) => p.rotation.x), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.x = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Y", -1e6, 1e6, selectedPoints.map((p) => p.rotation.y), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.y = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Z", -1e6, 1e6, selectedPoints.map((p) => p.rotation.z), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.z = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "ID", 0, 65535, selectedPoints.map((p) => p.id), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].id = x;
          });
          let effectOptions = [
            { str: "Fast, Straight Line", value: 0 },
            { str: "Curved", value: 1 },
            { str: "Curved (and Slow?)", value: 2 }
          ];
          panel.addSelectionDropdown(selectionGroup, "Effect", selectedPoints.map((p) => p.effect), effectOptions, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].effect = x;
          });
        }
        refresh() {
          super.refresh();
          for (let point of this.data.cannonPoints.nodes) {
            point.rendererPanel = new GfxNodeRendererTransform().attach(this.scene.root).setModel(this.modelPanel).setMaterial(this.viewer.material);
            this.renderers.push(point.rendererPanel);
          }
          this.refreshPanels();
        }
        drawAfterModel() {
          for (let point of this.data.cannonPoints.nodes) {
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            point.renderer.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([1, 0, 0, 1]);
            point.rendererSelected.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([1, 0.5, 0.5, 1]).setEnabled(point.selected);
            point.rendererSelectedCore.setDiffuseColor([1, 0, 0, 1]);
            let matrixDirection = Mat4.scale(scale, scale / 1.5, scale / 1.5).mul(Mat4.rotation(new Vec3(0, 0, 1), 90 * Math.PI / 180)).mul(Mat4.rotation(new Vec3(1, 0, 0), point.rotation.x * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 0, 1), -point.rotation.y * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 1, 0), -point.rotation.z * Math.PI / 180)).mul(Mat4.translation(point.pos.x, point.pos.y, point.pos.z));
            point.rendererDirection.setCustomMatrix(matrixDirection).setDiffuseColor([1, 0.75, 0.75, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionArrow.setCustomMatrix(matrixDirection).setDiffuseColor([1, 0, 0, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionUp.setCustomMatrix(matrixDirection).setDiffuseColor([1, 0.25, 0.25, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            if (point.selected && this.viewer.cfg.cannonsEnableDirectionRender) {
              let matrixScale = Mat4.scale(1e6, 1, 1e5);
              let matrixAlign = Mat4.rotation(new Vec3(0, 0, 1), (-90 - point.rotation.y) * Math.PI / 180);
              let matrixTranslate = Mat4.translation(point.pos.x, point.pos.y, point.pos.z);
              point.rendererPanel.setCustomMatrix(matrixScale.mul(matrixAlign.mul(matrixTranslate))).setDiffuseColor([1, 0.5, 0.5, 0.5]).setEnabled(true);
            } else
              point.rendererPanel.setEnabled(false);
          }
          this.scene.render(this.viewer.gl, this.viewer.getCurrentCamera());
          this.sceneAfter.clearDepth(this.viewer.gl);
          this.sceneAfter.render(this.viewer.gl, this.viewer.getCurrentCamera());
        }
      };
      if (module)
        module.exports = { ViewerCannonPoints };
    }
  });

  // src/viewer/viewerFinishPoints.js
  var require_viewerFinishPoints = __commonJS({
    "src/viewer/viewerFinishPoints.js"(exports, module) {
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { PointViewer } = require_pointViewer();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var { Geometry } = require_geometry();
      var ViewerFinishPoints = class extends PointViewer {
        constructor(window2, viewer, data) {
          super(window2, viewer, data);
        }
        points() {
          return this.data.finishPoints;
        }
        refreshPanels() {
          let panel = this.window.addPanel("Battle Finish Points", false, (open) => {
            if (open) this.viewer.setSubviewer(this);
          });
          this.panel = panel;
          panel.addText(null, "<strong>Hold Alt + Click:</strong> Create Point");
          panel.addText(null, "<strong>Hold Alt + Drag Point:</strong> Duplicate Point");
          panel.addText(null, "<strong>Hold Ctrl:</strong> Multiselect");
          panel.addCheckbox(null, "Draw rotation guides", this.viewer.cfg.enableRotationRender, (x) => this.viewer.cfg.enableRotationRender = x);
          panel.addSpacer(null);
          panel.addButton(null, "(A) Select/Unselect All", () => this.toggleAllSelection());
          panel.addButton(null, "(X) Delete Selected", () => this.deleteSelectedPoints());
          panel.addButton(null, "(Y) Snap To Collision Y", () => this.snapSelectedToY());
          panel.addSpacer(null);
          let selectedPoints = this.data.finishPoints.nodes.filter((p) => p.selected);
          let selectionGroup = panel.addGroup(null, "Selection:");
          let enabled = selectedPoints.length > 0;
          let multiedit = selectedPoints.length > 1;
          if (selectedPoints.length == 1) {
            let i = this.data.finishPoints.nodes.findIndex((p) => p === selectedPoints[0]);
            panel.addText(selectionGroup, "<strong>MSPT Index:</strong> " + i.toString() + " (0x" + i.toString(16) + ")");
          }
          panel.addSelectionNumericInput(selectionGroup, "X", -1e6, 1e6, selectedPoints.map((p) => p.pos.x), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.x = x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Y", -1e6, 1e6, selectedPoints.map((p) => -p.pos.z), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.z = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Z", -1e6, 1e6, selectedPoints.map((p) => -p.pos.y), null, 100, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].pos.y = -x;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. X", -1e6, 1e6, selectedPoints.map((p) => p.rotation.x), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.x = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Y", -1e6, 1e6, selectedPoints.map((p) => p.rotation.y), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.y = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "Rot. Z", -1e6, 1e6, selectedPoints.map((p) => p.rotation.z), null, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].rotation.z = x % 360;
          }, (x) => {
            return x % 360;
          });
          panel.addSelectionNumericInput(selectionGroup, "ID", 0, 65535, selectedPoints.map((p) => p.id), 1, 1, enabled, multiedit, (x, i) => {
            this.window.setNotSaved();
            selectedPoints[i].id = x;
          });
        }
        refresh() {
          super.refresh();
          this.refreshPanels();
        }
        drawAfterModel() {
          for (let point of this.data.finishPoints.nodes) {
            let scale = (this.hoveringOverPoint == point ? 1.5 : 1) * this.viewer.getElementScale(point.pos);
            point.renderer.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([0.5, 0, 1, 1]);
            point.rendererSelected.setTranslation(point.pos).setScaling(new Vec3(scale, scale, scale)).setDiffuseColor([0.75, 0.5, 1, 1]).setEnabled(point.selected);
            point.rendererSelectedCore.setDiffuseColor([0.5, 0, 1, 1]);
            let matrixDirection = Mat4.scale(scale, scale / 1.5, scale / 1.5).mul(Mat4.rotation(new Vec3(0, 0, 1), 90 * Math.PI / 180)).mul(Mat4.rotation(new Vec3(1, 0, 0), point.rotation.x * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 0, 1), -point.rotation.y * Math.PI / 180)).mul(Mat4.rotation(new Vec3(0, 1, 0), -point.rotation.z * Math.PI / 180)).mul(Mat4.translation(point.pos.x, point.pos.y, point.pos.z));
            point.rendererDirection.setCustomMatrix(matrixDirection).setDiffuseColor([0.87, 0.75, 1, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionArrow.setCustomMatrix(matrixDirection).setDiffuseColor([0.5, 0, 1, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
            point.rendererDirectionUp.setCustomMatrix(matrixDirection).setDiffuseColor([0.5, 0.25, 1, 1]).setEnabled(this.viewer.cfg.enableRotationRender);
          }
          this.scene.render(this.viewer.gl, this.viewer.getCurrentCamera());
          this.sceneAfter.clearDepth(this.viewer.gl);
          this.sceneAfter.render(this.viewer.gl, this.viewer.getCurrentCamera());
        }
      };
      if (module)
        module.exports = { ViewerFinishPoints };
    }
  });

  // src/viewer/viewerTrackInformation.js
  var require_viewerTrackInformation = __commonJS({
    "src/viewer/viewerTrackInformation.js"(exports, module) {
      var ViewerTrackInformation = class {
        constructor(window2, viewer, data) {
          this.window = window2;
          this.viewer = viewer;
          this.data = data;
        }
        setData(data) {
          this.data = data;
          this.refresh();
        }
        destroy() {
        }
        refreshPanels() {
          let panel = this.window.addPanel("Track Info", false, (open) => {
            if (open) this.viewer.setSubviewer(this);
          });
          this.panel = panel;
          panel.addSpacer(null);
          let trackModeOptions = [
            { str: "Race", value: false },
            { str: "Battle", value: true }
          ];
          panel.addSelectionDropdown(null, "Course Type", this.viewer.cfg.isBattleTrack, trackModeOptions, true, false, (x) => {
            this.window.setNotSaved();
            this.viewer.cfg.isBattleTrack = x;
            this.viewer.refreshPanels();
          });
          panel.addSelectionNumericInput(null, "Lap Count", 1, 9, this.data.trackInfo.lapCount, 1, 1, true, false, (x) => {
            this.window.setNotSaved();
            this.data.trackInfo.lapCount = x;
          });
          const convertFloat32MSB2 = (x) => {
            let view = new DataView(new ArrayBuffer(4));
            view.setFloat32(0, x);
            view.setUint8(2, 0);
            view.setUint8(3, 0);
            return view.getFloat32(0);
          };
          panel.addSelectionNumericInput(null, "Speed Mod.", 0, 99999, this.data.trackInfo.speedMod, null, 0.1, true, false, (x) => {
            this.window.setNotSaved();
            this.data.trackInfo.speedMod = convertFloat32MSB2(x);
          }, convertFloat32MSB2);
          let flareGroup = panel.addGroup(null, "Lens Flare:");
          panel.addSelectionNumericInput(flareGroup, "Red", 0, 255, this.data.trackInfo.flareColor[0], 1, 1, true, false, (x) => {
            this.window.setNotSaved();
            this.data.trackInfo.flareColor[0] = x;
          });
          panel.addSelectionNumericInput(flareGroup, "Green", 0, 255, this.data.trackInfo.flareColor[1], 1, 1, true, false, (x) => {
            this.window.setNotSaved();
            this.data.trackInfo.flareColor[1] = x;
          });
          panel.addSelectionNumericInput(flareGroup, "Blue", 0, 255, this.data.trackInfo.flareColor[2], 1, 1, true, false, (x) => {
            this.window.setNotSaved();
            this.data.trackInfo.flareColor[2] = x;
          });
          panel.addSelectionNumericInput(flareGroup, "Alpha", 0, 255, this.data.trackInfo.flareColor[3], 1, 1, true, false, (x) => {
            this.window.setNotSaved();
            this.data.trackInfo.flareColor[3] = x;
          });
          let lensFlareOptions = [
            { str: "Disabled", value: 0 },
            { str: "Enabled", value: 1 }
          ];
          panel.addSelectionDropdown(flareGroup, "Flashing", this.data.trackInfo.lensFlareFlash, lensFlareOptions, true, false, (x) => {
            this.window.setNotSaved();
            this.data.trackInfo.lensFlareFlash = x;
            this.refreshPanels();
          });
        }
        refresh() {
          this.refreshPanels();
        }
        onKeyDown(ev) {
        }
        onMouseDown(ev, x, y, cameraPos, ray, hit, distToHit, mouse3DPos) {
        }
        onMouseMove(ev, x, y, cameraPos, ray, hit, distToHit) {
        }
        onMouseUp(ev, x, y) {
        }
        drawAfterModel() {
        }
      };
      if (module)
        module.exports = { ViewerTrackInformation };
    }
  });

  // src/viewer/viewer.js
  var require_viewer = __commonJS({
    "src/viewer/viewer.js"(exports, module) {
      var { GLProgram } = require_shader();
      var { GfxScene, GfxCamera, GfxMaterial, GfxModel, GfxNodeRenderer, GfxNodeRendererTransform } = require_scene();
      var { ViewerStartPoints } = require_viewerStartPoints();
      var { ViewerEnemyPaths } = require_viewerEnemyPaths();
      var { ViewerItemPaths } = require_viewerItemPaths();
      var { ViewerCheckpoints } = require_viewerCheckpoints();
      var { ViewerObjects } = require_viewerObjects();
      var { ViewerRoutes } = require_viewerRoutes();
      var { ViewerAreas } = require_viewerAreas();
      var { ViewerCameras } = require_viewerCameras();
      var { ViewerRespawnPoints } = require_viewerRespawnPoints();
      var { ViewerCannonPoints } = require_viewerCannonPoints();
      var { ViewerFinishPoints } = require_viewerFinishPoints();
      var { ViewerTrackInformation } = require_viewerTrackInformation();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var { Mat4 } = require_mat4();
      var Viewer = class {
        constructor(mainWindow, canvas, cfg, data) {
          this.window = mainWindow;
          this.cfg = cfg;
          this.data = data;
          this.canvas = canvas;
          this.canvas.onresize = () => this.resize();
          this.canvas.onmousedown = (ev) => this.onMouseDown(ev);
          document.addEventListener("mousemove", (ev) => this.onMouseMove(ev));
          document.addEventListener("mouseup", (ev) => this.onMouseUp(ev));
          document.addEventListener("mouseleave", (ev) => this.onMouseUp(ev));
          this.canvas.onwheel = (ev) => this.onMouseWheel(ev);
          this.canvas.oncontextmenu = (ev) => ev.preventDefault();
          document.onkeydown = (ev) => this.onKeyDown(ev);
          document.addEventListener("keyup", (ev) => this.onKeyUp(ev));
          globalThis.window.addEventListener("blur", () => {
            this.keysDown = {};
            this.stopFlyMovementLoop();
          });
          this.subviewer = null;
          this.mouseDown = false;
          this.mouseDownOrigin = null;
          this.mouseDownRaycast = null;
          this.mouseLastClickDate = /* @__PURE__ */ new Date();
          this.mouseAction = null;
          this.mouseLast = null;
          this.mouseMoveOffsetPixels = { x: 0, y: 0 };
          this.mouseMoveOffsetPan = new Vec3(0, 0, 0);
          this.mouseMoveOffsetPanDelta = new Vec3(0, 0, 0);
          this.mouseMoveOffsetRaycast = new Vec3(0, 0, 0);
          this.keysDown = {};
          this.flyMoveAnimFrame = null;
          this.flyMoveLastTime = 0;
          this.cameraFocus = new Vec3(0, 0, 0);
          this.cameraHorzAngle = Math.PI / 2;
          this.cameraVertAngle = 1;
          this.cameraDist = 1e4;
          this.gl = canvas.getContext("webgl", { stencil: true });
          this.resize();
          this.gl.clearColor(0, 0, 0, 1);
          this.gl.clearDepth(1);
          this.gl.enable(this.gl.DEPTH_TEST);
          this.gl.enable(this.gl.CULL_FACE);
          this.gl.depthFunc(this.gl.LEQUAL);
          this.gl.enable(this.gl.BLEND);
          this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
          this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
          this.scene = new GfxScene();
          this.material = new GfxMaterial().setProgram(
            GLProgram.makeFromSrc(this.gl, vertexSrc, fragmentSrc).registerLocations(this.gl, ["aPosition", "aNormal"], ["uMatProj", "uMatView", "uMatModel", "uAmbientColor", "uDiffuseColor"])
          );
          this.materialColor = new GfxMaterial().setProgram(
            GLProgram.makeFromSrc(this.gl, vertexSrcColor, fragmentSrcColor).registerLocations(this.gl, ["aPosition", "aNormal", "aColor"], ["uMatProj", "uMatView", "uMatModel", "uAmbientColor", "uDiffuseColor", "uFogDensity"])
          );
          this.materialUnshaded = new GfxMaterial().setProgram(
            GLProgram.makeFromSrc(this.gl, vertexSrc, fragmentSrcUnshaded).registerLocations(this.gl, ["aPosition", "aNormal"], ["uMatProj", "uMatView", "uMatModel", "uDiffuseColor"])
          );
          this.model = null;
          this.collision = null;
          this.renderer = new GfxNodeRenderer().attach(this.scene.root).setMaterial(this.materialColor).setDiffuseColor([1, 1, 1, 1]);
          this.cachedCamera = new GfxCamera();
          this.cachedCameraPos = new Vec3(0, 0, 0);
          this.enableDebugRaycast = false;
          let debugRaycastBuilder = new ModelBuilder().addSphere(-100, -100, -100, 100, 100, 100).calculateNormals();
          this.debugRaycastRenderer = new GfxNodeRendererTransform().attach(this.scene.root).setModel(debugRaycastBuilder.makeModel(this.gl)).setMaterial(this.material).setDiffuseColor([1, 0, 1, 1]).setEnabled(this.enableDebugRaycast);
          this.subviewers = [
            new ViewerTrackInformation(this.window, this, this.data),
            new ViewerStartPoints(this.window, this, this.data),
            new ViewerEnemyPaths(this.window, this, this.data),
            new ViewerItemPaths(this.window, this, this.data),
            new ViewerCheckpoints(this.window, this, this.data),
            new ViewerRespawnPoints(this.window, this, this.data),
            new ViewerObjects(this.window, this, this.data),
            new ViewerRoutes(this.window, this, this.data),
            new ViewerAreas(this.window, this, this.data),
            new ViewerCameras(this.window, this, this.data),
            new ViewerCannonPoints(this.window, this, this.data),
            new ViewerFinishPoints(this.window, this, this.data)
          ];
          this.subviewerRoutes = this.subviewers[7];
          this.currentSubviewer = this.subviewers[0];
          this.render();
        }
        resize() {
          let width = this.canvas.getBoundingClientRect().width;
          let height = window.innerHeight;
          this.width = this.canvas.width = width;
          this.height = this.canvas.height = height;
          this.gl.viewport(0, 0, width, height);
        }
        refreshPanels() {
          for (let subviewer of this.subviewers) {
            if (subviewer)
              subviewer.refreshPanels();
          }
        }
        setData(data) {
          this.data = data;
          for (let subviewer of this.subviewers) {
            if (subviewer)
              subviewer.setData(data);
          }
        }
        setModel(modelBuilder) {
          this.modelBuilder = modelBuilder;
          this.model = modelBuilder.makeModel(this.gl);
          if (this.renderer && this.renderer.setModel)
            this.renderer.setModel(this.model);
          this.collision = modelBuilder.makeCollision().buildCacheSubdiv();
          for (let subviewer of this.subviewers) {
            if (subviewer && subviewer.setModel)
              subviewer.setModel(modelBuilder);
          }
        }
        setSubviewer(subviewer) {
          if (this.currentSubviewer != null && this.currentSubviewer != subviewer) {
            this.currentSubviewer.destroy();
            this.currentSubviewer.panel.setOpen(false);
          }
          this.currentSubviewer = subviewer;
          if (this.currentSubviewer != null) {
            this.currentSubviewer.refresh();
            this.currentSubviewer.panel.setOpen(true);
          }
          this.render();
        }
        centerView() {
          if (this.modelBuilder == null)
            return;
          let bbox = this.modelBuilder.getSaneBoundingBox();
          this.cameraFocus = new Vec3(bbox.xCenter, bbox.yCenter, bbox.zCenter);
          this.cameraHorzAngle = Math.PI / 2;
          this.cameraVertAngle = 1;
          this.cameraDist = Math.max(bbox.xSize, bbox.ySize, bbox.zSize) / 2;
        }
        render() {
          this.cachedCameraPos = this.cameraFocus.add(this.getCameraEyeOffset());
          if (this.cfg.useOrthoProjection) {
            let scale = this.cameraDist / 1e3;
            this.cachedCamera = new GfxCamera().setProjection(Mat4.ortho(-this.width * scale, this.width * scale, -this.height * scale, this.height * scale, -5e5, 1e6)).setView(Mat4.lookat(this.getCurrentCameraPosition(), this.cameraFocus, new Vec3(0, 0, -1)));
          } else {
            this.cachedCamera = new GfxCamera().setProjection(Mat4.perspective(30 * Math.PI / 180, this.width / this.height, 100, 1e6)).setView(Mat4.lookat(this.getCurrentCameraPosition(), this.cameraFocus, new Vec3(0, 0, -1)));
          }
          this.scene.clear(this.gl);
          let ambient = 1 - this.cfg.shadingFactor;
          this.material.program.use(this.gl).setVec4(this.gl, "uAmbientColor", [ambient, ambient, ambient, 1]);
          this.materialColor.program.use(this.gl).setVec4(this.gl, "uAmbientColor", [ambient, ambient, ambient, 1]);
          this.materialColor.program.use(this.gl).setFloat(this.gl, "uFogDensity", this.cfg.fogFactor);
          if (this.currentSubviewer != null && this.currentSubviewer.drawBeforeModel)
            this.currentSubviewer.drawBeforeModel();
          this.scene.render(this.gl, this.getCurrentCamera());
          if (this.currentSubviewer != null && this.currentSubviewer.drawAfterModel)
            this.currentSubviewer.drawAfterModel();
        }
        getElementScale(pos) {
          if (this.cfg.useOrthoProjection)
            return this.cameraDist / 15e3 * this.cfg.pointScale;
          else
            return pos.sub(this.getCurrentCameraPosition()).magn() / 2e4 * this.cfg.pointScale;
        }
        getCurrentCameraPosition() {
          return this.cachedCameraPos;
        }
        getCurrentCamera() {
          return this.cachedCamera;
        }
        getCameraEyeOffset() {
          let eyeZDist = Math.cos(this.cameraVertAngle);
          return new Vec3(
            Math.cos(this.cameraHorzAngle) * this.cameraDist * eyeZDist,
            -Math.sin(this.cameraHorzAngle) * this.cameraDist * eyeZDist,
            -Math.sin(this.cameraVertAngle) * this.cameraDist
          );
        }
        isFlyMovementKey(ev) {
          return ev.code == "KeyW" || ev.code == "KeyA" || ev.code == "KeyS" || ev.code == "KeyD" || ev.code == "KeyQ" || ev.code == "KeyE";
        }
        hasFlyMovementInput() {
          return !!(this.keysDown["KeyW"] || this.keysDown["KeyA"] || this.keysDown["KeyS"] || this.keysDown["KeyD"] || this.keysDown["KeyQ"] || this.keysDown["KeyE"]);
        }
        startFlyMovementLoop() {
          if (this.flyMoveAnimFrame != null)
            return;
          if (!this.mouseDown || this.mouseAction != "fly")
            return;
          if (!this.hasFlyMovementInput())
            return;
          this.flyMoveLastTime = performance.now();
          this.flyMoveAnimFrame = globalThis.window.requestAnimationFrame((time) => this.updateFlyMovementFrame(time));
        }
        stopFlyMovementLoop() {
          if (this.flyMoveAnimFrame != null)
            globalThis.window.cancelAnimationFrame(this.flyMoveAnimFrame);
          this.flyMoveAnimFrame = null;
          this.flyMoveLastTime = 0;
        }
        updateFlyMovementFrame(time) {
          this.flyMoveAnimFrame = null;
          if (!this.mouseDown || this.mouseAction != "fly" || !this.hasFlyMovementInput())
            return;
          let dt = (time - this.flyMoveLastTime) / 1e3;
          this.flyMoveLastTime = time;
          dt = Math.max(1e-3, Math.min(0.05, dt));
          if (this.moveFlyCamera(dt))
            this.render();
          this.flyMoveAnimFrame = globalThis.window.requestAnimationFrame((nextTime) => this.updateFlyMovementFrame(nextTime));
        }
        moveFlyCamera(dt) {
          let worldUp = new Vec3(0, 0, -1);
          let cameraPos = this.getCurrentCameraPosition();
          let forward = this.cameraFocus.sub(cameraPos);
          if (forward.magn() <= 1e-4)
            return false;
          forward = forward.normalize();
          let right = worldUp.cross(forward);
          if (right.magn() <= 1e-4)
            right = new Vec3(Math.sin(this.cameraHorzAngle), Math.cos(this.cameraHorzAngle), 0);
          else
            right = right.normalize();
          let move = new Vec3(0, 0, 0);
          if (this.keysDown["KeyW"])
            move = move.add(forward);
          if (this.keysDown["KeyS"])
            move = move.sub(forward);
          if (this.keysDown["KeyA"])
            move = move.sub(right);
          if (this.keysDown["KeyD"])
            move = move.add(right);
          if (this.keysDown["KeyE"])
            move = move.add(worldUp);
          if (this.keysDown["KeyQ"])
            move = move.sub(worldUp);
          if (move.magn() <= 1e-4)
            return false;
          let speed = Math.max(2e3, this.cameraDist * 3);
          if (this.keysDown["ShiftLeft"] || this.keysDown["ShiftRight"])
            speed *= 2.5;
          this.cameraFocus = this.cameraFocus.add(move.normalize().scale(speed * dt));
          return true;
        }
        getScreenRay(x, y) {
          let camera = this.getCurrentCamera();
          let xViewport = x / this.width * 2 - 1;
          let yViewport = y / this.height * 2 - 1;
          let matrix = camera.view.mul(camera.projection).invert();
          let near = matrix.mulVec4([xViewport, -yViewport, -1, 1]);
          let far = matrix.mulVec4([xViewport, -yViewport, 1, 1]);
          near = new Vec3(near[0], near[1], near[2]).scale(1 / near[3]);
          far = new Vec3(far[0], far[1], far[2]).scale(1 / far[3]);
          return { origin: near, direction: far.sub(near).normalize() };
        }
        pointToScreen(pos) {
          let camera = this.getCurrentCamera();
          let p = camera.projection.transpose().mul(camera.view.transpose()).mulVec4([pos.x, pos.y, pos.z, 1]);
          p[0] /= p[3];
          p[1] /= p[3];
          p[2] /= p[3];
          return {
            x: (p[0] + 1) / 2 * this.width,
            y: (1 - (p[1] + 1) / 2) * this.height,
            z: p[2],
            w: p[3]
          };
        }
        getMousePosFromEvent(ev) {
          let rect = this.canvas.getBoundingClientRect();
          return {
            x: ev.clientX - rect.left,
            y: ev.clientY - rect.top
          };
        }
        setCursor(cursor) {
          this.canvas.style.cursor = cursor;
        }
        onKeyDown(ev) {
          this.keysDown[ev.code] = true;
          if (ev.repeat == void 0)
            this.window.setUndoPoint();
          if (ev.key == "5") {
            this.cfg.useOrthoProjection = !this.cfg.useOrthoProjection;
            ev.preventDefault();
            this.render();
            return;
          }
          if (this.mouseDown && this.mouseAction == "fly" && this.isFlyMovementKey(ev)) {
            this.startFlyMovementLoop();
            ev.preventDefault();
            return;
          }
          if (this.currentSubviewer != null) {
            if (this.currentSubviewer.onKeyDown(ev)) {
              ev.preventDefault();
              this.render();
              return;
            }
          }
        }
        onKeyUp(ev) {
          delete this.keysDown[ev.code];
          if (!this.hasFlyMovementInput())
            this.stopFlyMovementLoop();
        }
        onMouseDown(ev) {
          this.window.setUndoPoint();
          let mouse = this.getMousePosFromEvent(ev);
          let ray = this.getScreenRay(mouse.x, mouse.y);
          let cameraPos = this.getCurrentCameraPosition();
          let clickDelta = (/* @__PURE__ */ new Date()).getTime() - this.mouseLastClickDate.getTime();
          let doubleClick = clickDelta > 5 && clickDelta < 300;
          let hit = this.collision.raycast(ray.origin, ray.direction);
          let distToHit = hit == null ? 1e6 : hit.distScaled;
          this.mouseDown = true;
          this.mouseDownOrigin = mouse;
          this.mouseDownRaycast = hit;
          this.mouseLast = mouse;
          this.mouseAction = null;
          this.mouseMoveOffsetPixels = { x: 0, y: 0 };
          this.mouseMoveOffsetPan = new Vec3(0, 0, 0);
          this.mouseMoveOffsetPanDelta = new Vec3(0, 0, 0);
          this.mouseMoveOffsetRaycast = new Vec3(0, 0, 0);
          if (ev.button == 2) {
            ev.preventDefault();
            if (doubleClick) {
              let ray2 = this.getScreenRay(mouse.x, mouse.y);
              let hit2 = this.collision.raycast(ray2.origin, ray2.direction);
              if (hit2 != null) {
                this.cameraFocus = hit2.position;
                this.cameraDist = 8e3;
              }
            } else
              this.mouseAction = "fly";
            this.startFlyMovementLoop();
          } else if (ev.button == 1) {
            ev.preventDefault();
            if (doubleClick) {
              let ray2 = this.getScreenRay(mouse.x, mouse.y);
              let hit2 = this.collision.raycast(ray2.origin, ray2.direction);
              if (hit2 != null) {
                this.cameraFocus = hit2.position;
                this.cameraDist = 8e3;
              }
            } else if (ev.shiftKey)
              this.mouseAction = "pan";
            else
              this.mouseAction = "orbit";
          } else {
            this.mouseAction = "move";
            let mouse3DPos = hit ? hit.position : ray.origin.add(ray.direction.scale(1e3));
            if (this.currentSubviewer != null)
              this.currentSubviewer.onMouseDown(ev, mouse.x, mouse.y, cameraPos, ray, hit, distToHit, mouse3DPos);
          }
          this.mouseLastClickDate = /* @__PURE__ */ new Date();
          this.render();
        }
        onMouseMove(ev) {
          let mouse = this.getMousePosFromEvent(ev);
          let ray = this.getScreenRay(mouse.x, mouse.y);
          let cameraPos = this.getCurrentCameraPosition();
          this.setCursor("default");
          let hit = this.collision.raycast(ray.origin, ray.direction);
          let distToHit = hit == null ? 1e6 : hit.distScaled;
          if (this.mouseDown) {
            ev.preventDefault();
            let dx = mouse.x - this.mouseLast.x;
            let dy = mouse.y - this.mouseLast.y;
            let ox = mouse.x - this.mouseDownOrigin.x;
            let oy = mouse.y - this.mouseDownOrigin.y;
            if (this.mouseAction == "pan") {
              let matrix = this.getCurrentCamera().view;
              let delta = matrix.mulDirection(new Vec3(-dx * this.cameraDist / 500, -dy * this.cameraDist / 500, 0));
              this.cameraFocus = this.cameraFocus.add(delta);
            } else if (this.mouseAction == "orbit") {
              this.cameraHorzAngle += dx * 75e-4;
              this.cameraVertAngle += dy * 75e-4;
              this.cameraVertAngle = Math.max(-Math.PI / 2 + 1e-4, Math.min(Math.PI / 2 - 1e-4, this.cameraVertAngle));
            } else if (this.mouseAction == "fly") {
              let cameraPos2 = this.getCurrentCameraPosition();
              this.cameraHorzAngle += dx * 75e-4;
              this.cameraVertAngle += dy * 75e-4;
              this.cameraVertAngle = Math.max(-Math.PI / 2 + 1e-4, Math.min(Math.PI / 2 - 1e-4, this.cameraVertAngle));
              this.cameraFocus = cameraPos2.sub(this.getCameraEyeOffset());
              this.startFlyMovementLoop();
            } else if (this.mouseAction == "move") {
              let matrix = this.getCurrentCamera().view;
              let offset = matrix.mulDirection(new Vec3(ox * this.cameraDist / 500, oy * this.cameraDist / 500, 0));
              let delta = matrix.mulDirection(new Vec3(dx * this.cameraDist / 500, dy * this.cameraDist / 500, 0));
              this.mouseMoveOffsetPixels = { x: ox, y: oy };
              this.mouseMoveOffsetPan = offset;
              this.mouseMoveOffsetPanDelta = delta;
              this.mouseMoveOffsetRaycast = hit;
            }
            if (this.currentSubviewer != null)
              this.currentSubviewer.onMouseMove(ev, mouse.x, mouse.y, cameraPos, ray, hit, distToHit);
            this.mouseLast = mouse;
            this.render();
          } else {
            if (hit != null && this.enableDebugRaycast)
              this.debugRaycastRenderer.setTranslation(hit.position);
            if (this.currentSubviewer != null)
              this.currentSubviewer.onMouseMove(ev, mouse.x, mouse.y, cameraPos, ray, hit, distToHit);
          }
        }
        onMouseUp(ev) {
          if (!this.mouseDown)
            return;
          ev.preventDefault();
          let mouse = this.getMousePosFromEvent(ev);
          if (this.currentSubviewer != null && this.currentSubviewer.onMouseUp)
            this.currentSubviewer.onMouseUp(ev, mouse.x, mouse.y);
          this.window.setUndoPoint();
          this.mouseDown = false;
          this.mouseLast = mouse;
          this.stopFlyMovementLoop();
        }
        onMouseWheel(ev) {
          if (ev.deltaY > 0)
            this.cameraDist = Math.min(5e5, this.cameraDist * 1.25);
          else if (ev.deltaY < 0) {
            if (this.cameraDist <= 1e3) {
              let matrix = this.getCurrentCamera().view;
              let delta = matrix.mulDirection(new Vec3(0, 0, ev.deltaY * 2));
              this.cameraFocus = this.cameraFocus.add(delta);
            } else
              this.cameraDist = Math.max(1e3, this.cameraDist / 1.25);
          }
          this.render();
        }
      };
      var vertexSrc = `
	precision highp float;
	
	attribute vec4 aPosition;
	attribute vec4 aNormal;

	uniform mat4 uMatModel;
	uniform mat4 uMatView;
	uniform mat4 uMatProj;
	
	varying vec4 vNormal;
	varying vec4 vScreenNormal;

	void main()
	{
		vNormal = uMatModel * vec4(aNormal.xyz, 0);
		vScreenNormal = uMatView * uMatModel * vec4(aNormal.xyz, 0);
		
		gl_Position = uMatProj * uMatView * uMatModel * aPosition;
	}`;
      var fragmentSrc = `
	precision highp float;
	
	varying vec4 vNormal;
	varying vec4 vScreenNormal;
	
	uniform vec4 uDiffuseColor;
	uniform vec4 uAmbientColor;

	void main()
	{
		vec4 lightDir = vec4(0, 0, -1, 0);
		
		vec4 ambientColor = uAmbientColor;
		vec4 diffuseColor = uDiffuseColor;
		vec4 lightColor = vec4(1, 1, 1, 1);
		
		float lightIncidence = max(0.0, dot(normalize(lightDir), normalize(vScreenNormal)));
		
		gl_FragColor = diffuseColor * mix(ambientColor, lightColor, lightIncidence);
	}`;
      var vertexSrcColor = `
	precision highp float;
	
	attribute vec4 aPosition;
	attribute vec4 aNormal;
	attribute vec4 aColor;

	uniform mat4 uMatModel;
	uniform mat4 uMatView;
	uniform mat4 uMatProj;
	
	varying float vDepth;
	varying vec4 vNormal;
	varying vec4 vScreenNormal;
	varying vec4 vColor;

	void main()
	{
		vNormal = uMatModel * vec4(aNormal.xyz, 0);
		vScreenNormal = uMatView * uMatModel * vec4(aNormal.xyz, 0);
		
		vColor = aColor;
		
		vec4 position = uMatProj * uMatView * uMatModel * aPosition;
		gl_Position = position;
		vDepth = position.z / position.w;
	}`;
      var fragmentSrcColor = `
	precision highp float;
	
	varying float vDepth;
	varying vec4 vNormal;
	varying vec4 vScreenNormal;
	varying vec4 vColor;
	
	uniform vec4 uDiffuseColor;
	uniform vec4 uAmbientColor;
	uniform float uFogDensity;

	void main()
	{
		vec4 lightDir = vec4(0, 0, -1, 0);
		
		vec4 ambientColor = uAmbientColor;
		vec4 diffuseColor = uDiffuseColor * vColor;
		vec4 lightColor = vec4(1, 1, 1, 1);
		
		const float log2 = 1.442695;
		//const float fogDensity = 0.00001;
		float z = gl_FragCoord.z / gl_FragCoord.w;
		float fogFactor = clamp(exp2(-uFogDensity * uFogDensity * z * z * log2) + 0.01, 0.2, 1.0);
		
		float lightIncidence = max(0.0, dot(normalize(lightDir), normalize(vScreenNormal)));
		
		gl_FragColor = diffuseColor * mix(ambientColor, lightColor, lightIncidence) * vec4(vec3(fogFactor), 1.0);
	}`;
      var fragmentSrcUnshaded = `
	precision highp float;
	
	varying vec4 vNormal;
	varying vec4 vScreenNormal;
	
	uniform vec4 uDiffuseColor;

	void main()
	{
		gl_FragColor = uDiffuseColor;
	}`;
      module.exports = { Viewer };
    }
  });

  // src/util/binaryParser.js
  var require_binaryParser = __commonJS({
    "src/util/binaryParser.js"(exports, module) {
      var { Vec3 } = require_vec3();
      var BinaryParser = class {
        constructor(bytes) {
          this.bytes = bytes;
          this.head = 0;
          this.littleEndian = false;
        }
        getLength() {
          return this.bytes.length;
        }
        seek(index) {
          this.head = index;
        }
        readByte() {
          let b = this.bytes[this.head];
          this.head += 1;
          return b;
        }
        readSByte() {
          let x = this.readByte();
          if ((x & 128) == 0)
            return x;
          return -(~x + 1);
        }
        readBytes(length) {
          let arr = [];
          for (let i = 0; i < length; i++)
            arr.push(this.readByte());
          if (this.littleEndian)
            arr = arr.reverse();
          return arr;
        }
        readUInt16() {
          let b = this.readBytes(2);
          let result = b[0] << 8 | b[1];
          if (result < 0)
            return 65536 + result;
          else
            return result;
        }
        readUInt16s(length) {
          let arr = [];
          for (let i = 0; i < length; i++)
            arr.push(this.readUInt16());
          return arr;
        }
        readUInt32() {
          let b = this.readBytes(4);
          let result = b[0] << 24 | b[1] << 16 | b[2] << 8 | b[3];
          if (result < 0)
            return 4294967296 + result;
          else
            return result;
        }
        readInt16() {
          let x = this.readUInt16();
          if ((x & 32768) == 0)
            return x;
          return -(~x + 1);
        }
        readInt32() {
          let x = this.readUInt32();
          if ((x & 2147483648) == 0)
            return x;
          return -(~x + 1);
        }
        readFloat32() {
          let b = this.readBytes(4);
          let buf = new ArrayBuffer(4);
          let view = new DataView(buf);
          view.setUint8(0, b[0]);
          view.setUint8(1, b[1]);
          view.setUint8(2, b[2]);
          view.setUint8(3, b[3]);
          return view.getFloat32(0);
        }
        readFloat32MSB2() {
          let b = this.readBytes(2);
          let buf = new ArrayBuffer(4);
          let view = new DataView(buf);
          view.setUint8(0, b[0]);
          view.setUint8(1, b[1]);
          view.setUint8(2, 0);
          view.setUint8(3, 0);
          return view.getFloat32(0);
        }
        readVec3() {
          let x = this.readFloat32();
          let y = this.readFloat32();
          let z = this.readFloat32();
          return new Vec3(x, y, z);
        }
        readPosVec3() {
          let x = this.readFloat32();
          let y = this.readFloat32();
          let z = this.readFloat32();
          return new Vec3(x, -z, -y);
        }
        readAsciiLength(length) {
          let str = "";
          for (let i = 0; i < length; i++)
            str += String.fromCharCode(this.readByte());
          if (this.littleEndian)
            str = str.split("").reverse().join("");
          return str;
        }
        readAsciiZeroTerminated() {
          let str = "";
          while (true) {
            let c = this.readByte();
            if (c == 0)
              break;
            str += String.fromCharCode(c);
          }
          if (this.littleEndian)
            str = str.split("").reverse().join("");
          return str;
        }
        read(type) {
          if (type instanceof Array)
            return this["read" + type[0]](type[1]);
          else
            return this["read" + type]();
        }
      };
      if (module)
        module.exports = { BinaryParser };
    }
  });

  // src/util/binaryWriter.js
  var require_binaryWriter = __commonJS({
    "src/util/binaryWriter.js"(exports, module) {
      var { Vec3 } = require_vec3();
      var BinaryWriter = class {
        constructor(bytes) {
          this.bytes = [];
          this.head = 0;
          this.littleEndian = false;
        }
        getBytes() {
          return this.bytes;
        }
        getLength() {
          return this.bytes.length;
        }
        seek(index) {
          while (index > this.bytes.length)
            this.bytes.push(0);
          this.head = index;
        }
        writeByte(b) {
          this.bytes[this.head] = b & 255;
          this.head += 1;
        }
        writeSByte(b) {
          if (b >= 0)
            this.writeByte(b);
          else
            this.writeByte(256 + b);
        }
        writeBytes(bytes) {
          if (this.littleEndian)
            bytes.reverse();
          for (let i = 0; i < bytes.length; i++)
            this.writeByte(bytes[i]);
        }
        writeUInt16(x) {
          this.writeBytes([
            x >> 8,
            x >> 0
          ]);
        }
        writeUInt16s(ints) {
          for (let i = 0; i < ints.length; i++)
            this.writeUInt16(ints[i]);
        }
        writeUInt32(x) {
          this.writeBytes([
            x >> 24,
            x >> 16,
            x >> 8,
            x >> 0
          ]);
        }
        writeInt16(x) {
          if (x >= 0)
            this.writeUInt16(x);
          else
            this.writeUInt16(65536 + x);
        }
        writeInt32(x) {
          if (x >= 0)
            this.writeUInt32(x);
          else
            this.writeUInt32(4294967296 + x);
        }
        writeFloat32(x) {
          let view = new DataView(new ArrayBuffer(4));
          view.setFloat32(0, x);
          this.writeBytes([
            view.getUint8(0),
            view.getUint8(1),
            view.getUint8(2),
            view.getUint8(3)
          ]);
        }
        writeFloat32MSB2(x) {
          let view = new DataView(new ArrayBuffer(4));
          view.setFloat32(0, x);
          this.writeBytes([
            view.getUint8(0),
            view.getUint8(1)
          ]);
        }
        writeVec3(v) {
          this.writeFloat32(v.x);
          this.writeFloat32(v.y);
          this.writeFloat32(v.z);
        }
        writePosVec3(v) {
          this.writeFloat32(v.x);
          this.writeFloat32(-v.z);
          this.writeFloat32(-v.y);
        }
        writeAsciiLength(str, length) {
          if (this.littleEndian)
            str = str.split("").reverse().join("");
          for (let i = 0; i < Math.min(str.length, length); i++)
            this.writeByte(str.charCodeAt(i));
          for (let i = str.length; i < length; i++)
            this.writeByte(0);
        }
        writeAscii(str) {
          if (this.littleEndian)
            str = str.split("").reverse().join("");
          for (let i = 0; i < str.length; i++)
            this.writeByte(str.charCodeAt(i));
        }
        write(type, prop) {
          if (type instanceof Array)
            this["write" + type[0]](prop);
          else
            this["write" + type](prop);
        }
      };
      if (module)
        module.exports = { BinaryWriter };
    }
  });

  // src/util/kmpData.js
  var require_kmpData = __commonJS({
    "src/util/kmpData.js"(exports, module) {
      var { BinaryParser } = require_binaryParser();
      var { BinaryWriter } = require_binaryWriter();
      var { Vec3 } = require_vec3();
      var sectionOrder = [
        "KTPT",
        "ENPT",
        "ENPH",
        "ITPT",
        "ITPH",
        "CKPT",
        "CKPH",
        "GOBJ",
        "POTI",
        "AREA",
        "CAME",
        "JGPT",
        "CNPT",
        "MSPT",
        "STGI"
      ];
      var format = {
        "KTPT": {
          pos: "PosVec3",
          rotation: "Vec3",
          playerIndex: "UInt16",
          padding: "UInt16"
        },
        "ENPT": {
          pos: "PosVec3",
          deviation: "Float32",
          setting1: "UInt16",
          setting2: "Byte",
          setting3: "Byte"
        },
        "ENPH": {
          startIndex: "Byte",
          pointNum: "Byte",
          prevGroups: ["Bytes", 6],
          nextGroups: ["Bytes", 6],
          unknown: "UInt16"
        },
        "ITPT": {
          pos: "PosVec3",
          deviation: "Float32",
          setting1: "UInt16",
          setting2: "UInt16"
        },
        "ITPH": {
          startIndex: "Byte",
          pointNum: "Byte",
          prevGroups: ["Bytes", 6],
          nextGroups: ["Bytes", 6],
          padding: "UInt16"
        },
        "CKPT": {
          x1: "Float32",
          z1: "Float32",
          x2: "Float32",
          z2: "Float32",
          respawnIndex: "Byte",
          type: "Byte",
          prev: "Byte",
          next: "Byte"
        },
        "CKPH": {
          startIndex: "Byte",
          pointNum: "Byte",
          prevGroups: ["Bytes", 6],
          nextGroups: ["Bytes", 6],
          padding: "UInt16"
        },
        "GOBJ": {
          id: "UInt16",
          xpfThing: "UInt16",
          pos: "PosVec3",
          rotation: "Vec3",
          scale: "Vec3",
          routeIndex: "UInt16",
          settings: ["UInt16s", 8],
          presence: "UInt16"
        },
        "POTI": {
          pointNum: "UInt16",
          setting1: "Byte",
          setting2: "Byte"
        },
        "AREA": {
          shape: "Byte",
          type: "Byte",
          cameraIndex: "Byte",
          priority: "Byte",
          pos: "PosVec3",
          rotation: "Vec3",
          scale: "Vec3",
          setting1: "UInt16",
          setting2: "UInt16",
          routeIndex: "Byte",
          enemyIndex: "Byte",
          padding: "UInt16"
        },
        "CAME": {
          type: "Byte",
          nextCam: "Byte",
          shake: "Byte",
          routeIndex: "Byte",
          vCam: "UInt16",
          vZoom: "UInt16",
          vView: "UInt16",
          start: "Byte",
          movie: "Byte",
          pos: "PosVec3",
          rotation: "Vec3",
          zoomStart: "Float32",
          zoomEnd: "Float32",
          viewPosStart: "PosVec3",
          viewPosEnd: "PosVec3",
          time: "Float32"
        },
        "JGPT": {
          pos: "PosVec3",
          rotation: "Vec3",
          id: "UInt16",
          soundData: "UInt16"
        },
        "CNPT": {
          pos: "PosVec3",
          rotation: "Vec3",
          id: "UInt16",
          effect: "UInt16"
        },
        "MSPT": {
          pos: "PosVec3",
          rotation: "Vec3",
          id: "UInt16",
          padding: "UInt16"
        },
        "STGI": {
          lapCount: "Byte",
          polePosition: "Byte",
          driverDistance: "Byte",
          lensFlareFlash: "Byte",
          unknown1: "Byte",
          flareColor: ["Bytes", 4],
          unknown2: "Byte",
          speedMod: "Float32MSB2"
        }
      };
      function cloneProperties(newNode, oldNode, sectionId) {
        for (let prop in format[sectionId]) {
          if (oldNode[prop] instanceof Array) {
            newNode[prop] = [];
            for (let x of oldNode[prop])
              newNode[prop].push(x);
          } else if (oldNode[prop] instanceof Vec3)
            newNode[prop] = oldNode[prop].clone();
          else
            newNode[prop] = oldNode[prop];
        }
      }
      var KmpData = class _KmpData {
        static load(bytes) {
          let parser = new BinaryParser(bytes);
          if (parser.readAsciiLength(4) != "RKMD")
            throw "kmp: invalid magic number";
          let fileLenInBytes = parser.readUInt32();
          let sectionNum = parser.readUInt16();
          if (sectionNum != 15)
            throw "kmp: unexpected section number: " + sectionNum;
          let headerLenInBytes = parser.readUInt16();
          parser.readUInt32();
          let sectionOffsets = [];
          for (let i = 0; i < sectionNum; i++)
            sectionOffsets.push(parser.readUInt32());
          if (parser.head != headerLenInBytes)
            throw "kmp: invalid header length";
          let sectionData = { sectionNum, unhandled: [] };
          for (let i = 0; i < sectionNum; i++)
            sectionData[sectionOrder[i]] = { headerData: 0, entries: [] };
          for (let sectionOffset of sectionOffsets) {
            if (sectionOffset < 0 || sectionOffset + headerLenInBytes >= parser.getLength())
              continue;
            parser.seek(sectionOffset + headerLenInBytes);
            let sectionId = parser.readAsciiLength(4);
            let entryNum = parser.readUInt16();
            let headerData = parser.readUInt16();
            if (sectionId in format) {
              sectionData[sectionId].headerData = headerData;
              for (let i = 0; i < entryNum; i++) {
                let props = {};
                for (let prop in format[sectionId])
                  props[prop] = parser.read(format[sectionId][prop]);
                if (sectionId == "POTI") {
                  props.points = [];
                  for (let j = 0; j < props.pointNum; j++) {
                    let point = {};
                    point.pos = parser.readPosVec3();
                    point.setting1 = parser.readUInt16();
                    point.setting2 = parser.readUInt16();
                    props.points.push(point);
                  }
                }
                sectionData[sectionId].entries.push(props);
              }
              if (sectionId === "GOBJ" && entryNum > 0) {
                for (let i = 0; i < sectionData["GOBJ"].entries.length; i++) {
                  let p = sectionData["GOBJ"].entries[i];
                  let flags = p.presence || 0;
                  p.condMode = flags >> 3 & 7;
                  p.condStart = flags >> 6 & 7;
                  p.condEnd = flags >> 9 & 7;
                  p.presence = flags & 7;
                }
              }
            } else {
              let unhandledSection = unhandledSections.find((s) => s.id == sectionId);
              if (unhandledSection == null)
                throw "kmp: section not handled: " + sectionId;
              let bytes2 = [];
              for (let i = 0; i < entryNum; i++)
                for (let j = 0; j < unhandledSection.entryLen; j++)
                  bytes2.push(parser.readByte());
              sectionData.unhandled.push({ id: sectionId, headerData, bytes: bytes2 });
              break;
            }
          }
          return sectionData;
        }
        static convertToWorkingFormat(loadedKmp) {
          let data = new _KmpData();
          data.sectionNum = loadedKmp.sectionNum;
          data.trackInfo = loadedKmp["STGI"].entries[0];
          data.unhandledSectionData = loadedKmp.unhandled;
          let sectionsToGraphs = {
            "KTPT": "startPoints",
            "ENPT": "enemyPoints",
            "ITPT": "itemPoints",
            "GOBJ": "objects",
            "AREA": "areaPoints",
            "CAME": "cameras",
            "JGPT": "respawnPoints",
            "CNPT": "cannonPoints",
            "MSPT": "finishPoints"
          };
          for (let [sectionId, graph] of Object.entries(sectionsToGraphs)) {
            data.headerData[sectionId] = loadedKmp[sectionId].headerData;
            for (let kmpPoint of loadedKmp[sectionId].entries) {
              let node = data[graph].addNode();
              cloneProperties(node, kmpPoint, sectionId);
              if (sectionId === "GOBJ") {
                node.condMode = kmpPoint.condMode || 0;
                node.condStart = kmpPoint.condStart || 0;
                node.condEnd = kmpPoint.condEnd || 0;
                node.presence = kmpPoint.presence & 7;
              }
            }
          }
          let enemyPaths = loadedKmp["ENPH"].entries;
          for (let i = 0; i < enemyPaths.length; i++) {
            let kmpPath = enemyPaths[i];
            for (let p = kmpPath.startIndex; p < kmpPath.startIndex + kmpPath.pointNum - 1; p++) {
              data.enemyPoints.linkNodes(data.enemyPoints.nodes[p], data.enemyPoints.nodes[p + 1]);
              data.enemyPoints.nodes[p].pathIndex = i;
              data.enemyPoints.nodes[p + 1].pathIndex = i;
            }
            const emptyPrevGroups = kmpPath.prevGroups.find((g) => g != 255 && g < enemyPaths.length) == null;
            for (let j = 0; j < 6; j++) {
              if (kmpPath.nextGroups[j] != 255 && kmpPath.nextGroups[j] < enemyPaths.length) {
                const nextComesBackToThis = enemyPaths[kmpPath.nextGroups[j]].nextGroups.find((g) => g == i) != null;
                const nextIsBattleDispatch = kmpPath.nextGroups[j] > i && enemyPaths[kmpPath.nextGroups[j]].prevGroups.find((g) => g != 255 && g < enemyPaths.length) == null;
                if (!emptyPrevGroups || (!nextComesBackToThis || nextIsBattleDispatch)) {
                  let lastPoint = kmpPath.startIndex + kmpPath.pointNum - 1;
                  let nextPoint = enemyPaths[kmpPath.nextGroups[j]].startIndex;
                  data.enemyPoints.linkNodes(data.enemyPoints.nodes[lastPoint], data.enemyPoints.nodes[nextPoint]);
                  data.enemyPoints.nodes[lastPoint].pathIndex = i;
                  data.enemyPoints.nodes[nextPoint].pathIndex = kmpPath.nextGroups[j];
                }
              }
            }
          }
          let itemPaths = loadedKmp["ITPH"].entries;
          for (let i = 0; i < itemPaths.length; i++) {
            let kmpPath = itemPaths[i];
            for (let p = kmpPath.startIndex; p < kmpPath.startIndex + kmpPath.pointNum - 1; p++)
              data.itemPoints.linkNodes(data.itemPoints.nodes[p], data.itemPoints.nodes[p + 1]);
            for (let j = 0; j < 6; j++) {
              if (kmpPath.nextGroups[j] != 255 && kmpPath.nextGroups[j] < itemPaths.length) {
                let lastPoint = kmpPath.startIndex + kmpPath.pointNum - 1;
                let nextPoint = itemPaths[kmpPath.nextGroups[j]].startIndex;
                data.itemPoints.linkNodes(data.itemPoints.nodes[lastPoint], data.itemPoints.nodes[nextPoint]);
              }
            }
          }
          for (let i = 0; i < loadedKmp["CKPT"].entries.length; i++) {
            let kmpPoint = loadedKmp["CKPT"].entries[i];
            let node = data.checkpointPoints.addNode();
            node.pos = [new Vec3(kmpPoint.x1, -kmpPoint.z1, 0), new Vec3(kmpPoint.x2, -kmpPoint.z2, 0)];
            node.type = kmpPoint.type;
            node.respawnNode = null;
            node.firstInPath = false;
            node.isRendered = true;
          }
          let checkpointPaths = loadedKmp["CKPH"].entries;
          for (let i = 0; i < checkpointPaths.length; i++) {
            let kmpPath = checkpointPaths[i];
            for (let p = kmpPath.startIndex; p < kmpPath.startIndex + kmpPath.pointNum - 1; p++)
              data.checkpointPoints.linkNodes(data.checkpointPoints.nodes[p], data.checkpointPoints.nodes[p + 1]);
            for (let j = 0; j < 6; j++) {
              if (kmpPath.nextGroups[j] != 255 && kmpPath.nextGroups[j] < checkpointPaths.length) {
                let lastPoint = kmpPath.startIndex + kmpPath.pointNum - 1;
                let nextPoint = checkpointPaths[kmpPath.nextGroups[j]].startIndex;
                data.checkpointPoints.linkNodes(data.checkpointPoints.nodes[lastPoint], data.checkpointPoints.nodes[nextPoint]);
              }
            }
            data.checkpointPoints.nodes[kmpPath.startIndex].firstInPath = true;
          }
          for (let i = 0; i < loadedKmp["POTI"].entries.length; i++) {
            let kmpRoute = loadedKmp["POTI"].entries[i];
            let route = data.addNewRoute();
            route.setting1 = kmpRoute.setting1;
            route.setting2 = kmpRoute.setting2;
            let lastNode = null;
            for (let kmpPoint of kmpRoute.points) {
              let node = route.points.addNode();
              node.pos = kmpPoint.pos.clone();
              node.setting1 = kmpPoint.setting1;
              node.setting2 = kmpPoint.setting2;
              if (lastNode != null)
                route.points.linkNodes(lastNode, node);
              lastNode = node;
            }
          }
          for (let i = 0; i < loadedKmp["CKPT"].entries.length; i++) {
            let respawnIndex = loadedKmp["CKPT"].entries[i].respawnIndex;
            if (respawnIndex >= 0 && respawnIndex < data.respawnPoints.nodes.length)
              data.checkpointPoints.nodes[i].respawnNode = data.respawnPoints.nodes[respawnIndex];
          }
          data.firstIntroCam = (loadedKmp["CAME"].headerData & 65280) >>> 8;
          data.firstSelectionCam = loadedKmp["CAME"].headerData & 255;
          data.isBattleTrack = loadedKmp["ITPT"].entries.length == 0 && loadedKmp["CKPT"].entries.length == 0 && loadedKmp["MSPT"].entries.length > 0;
          return data;
        }
        convertToStorageFormat(asBattle = false) {
          let w = new BinaryWriter();
          let sectionNum = 15;
          w.writeAscii("RKMD");
          let fileLenAddr = w.head;
          w.writeUInt32(0);
          w.writeUInt16(sectionNum);
          let headerLenAddr = w.head;
          w.writeUInt16(0);
          w.writeUInt32(2520);
          let sectionOffsetsAddr = w.head;
          for (let i = 0; i < sectionNum; i++)
            w.writeUInt32(4294967295);
          let headerEndAddr = w.head;
          w.seek(headerLenAddr);
          w.writeUInt16(headerEndAddr);
          w.seek(headerEndAddr);
          let writeUnhandledSection = (tag) => {
            let unhandledSection = this.unhandledSectionData.find((s) => s.id == tag);
            if (unhandledSection == null) {
              unhandledSection = {
                id: tag,
                bytes: [],
                extraData: 0
              };
            }
            let unhandledSectionProperties = unhandledSections.find((s) => s.id == tag);
            let order = sectionOrder.findIndex((s) => s == tag);
            let head = w.head;
            w.seek(sectionOffsetsAddr + order * 4);
            w.writeUInt32(head - headerEndAddr);
            w.seek(head);
            w.writeAscii(unhandledSection.id);
            w.writeUInt16(unhandledSection.bytes.length / unhandledSectionProperties.entryLen);
            w.writeUInt16(unhandledSection.extraData);
            w.writeBytes(unhandledSection.bytes);
          };
          let sectionId = "KTPT";
          let sectionKtptAddr = w.head;
          let sectionKtptOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionKtptOrder * 4);
          w.writeUInt32(sectionKtptAddr - headerEndAddr);
          w.seek(sectionKtptAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(this.startPoints.nodes.length);
          w.writeUInt16(this.headerData[sectionId]);
          if (this.startPoints.nodes.length > 255)
            throw "kmp encode: max start points surpassed (have " + this.startPoints.nodes.length + ", max 255)";
          for (let p of this.startPoints.nodes)
            for (let prop in format[sectionId])
              w.write(format[sectionId][prop], p[prop]);
          let enemyPaths = this.enemyPoints.convertToStorageFormat(asBattle);
          let enemyPoints = [];
          enemyPaths.forEach((path) => path.nodes.forEach((node) => enemyPoints.push(node)));
          if (enemyPaths.length >= 255)
            throw "kmp encode: max enemy path number surpassed (have " + enemyPaths.length + ", max 254)";
          if (enemyPoints.length > 255)
            throw "kmp encode: max enemy point number surpassed (have " + enemyPoints.length + ", max 255)";
          sectionId = "ENPT";
          let sectionEnptAddr = w.head;
          let sectionEnptOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionEnptOrder * 4);
          w.writeUInt32(sectionEnptAddr - headerEndAddr);
          w.seek(sectionEnptAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(enemyPoints.length);
          w.writeUInt16(this.headerData[sectionId]);
          for (let p of enemyPoints)
            for (let prop in format[sectionId])
              w.write(format[sectionId][prop], p[prop]);
          sectionId = "ENPH";
          let sectionEnphAddr = w.head;
          let sectionEnphOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionEnphOrder * 4);
          w.writeUInt32(sectionEnphAddr - headerEndAddr);
          w.seek(sectionEnphAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(enemyPaths.length);
          w.writeUInt16(this.headerData[sectionId]);
          for (let path of enemyPaths) {
            if (path.nodes.length > 255)
              throw "kmp encode: max enemy point number in a path surpassed (have " + path.nodes.length + ", max 255)";
            w.writeByte(enemyPoints.findIndex((n) => n == path.nodes[0]));
            w.writeByte(path.nodes.length);
            let incomingPaths = path.prev.reduce((accum, p) => accum + 1, 0);
            let outgoingPaths = path.next.reduce((accum, p) => accum + 1, 0);
            if (incomingPaths > 6)
              throw "kmp encode: max incoming connections to an enemy point surpassed (have " + incomingPaths + ", max 6)";
            if (outgoingPaths > 6)
              throw "kmp encode: max outgoing connections to an enemy point surpassed (have " + outgoingPaths + ", max 6)";
            for (let i = 0; i < 6; i++) {
              if (i < path.prev.length)
                w.writeByte(enemyPaths.findIndex((p) => p == path.prev[i]));
              else
                w.writeByte(255);
            }
            for (let i = 0; i < 6; i++) {
              if (i < path.next.length)
                w.writeByte(enemyPaths.findIndex((p) => p == path.next[i]));
              else
                w.writeByte(255);
            }
            w.writeUInt16(0);
          }
          let itemPaths = this.itemPoints.convertToStorageFormat();
          let itemPoints = [];
          itemPaths.forEach((path) => path.nodes.forEach((node) => itemPoints.push(node)));
          if (itemPaths.length >= 255)
            throw "kmp encode: max item path number surpassed (have " + itemPaths.length + ", max 254)";
          if (itemPoints.length > 255)
            throw "kmp encode: max item point number surpassed (have " + itemPoints.length + ", max 255)";
          sectionId = "ITPT";
          let sectionItptAddr = w.head;
          let sectionItptOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionItptOrder * 4);
          w.writeUInt32(sectionItptAddr - headerEndAddr);
          w.seek(sectionItptAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(itemPoints.length);
          w.writeUInt16(this.headerData[sectionId]);
          for (let p of itemPoints)
            for (let prop in format[sectionId])
              w.write(format[sectionId][prop], p[prop]);
          sectionId = "ITPH";
          let sectionItphAddr = w.head;
          let sectionItphOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionItphOrder * 4);
          w.writeUInt32(sectionItphAddr - headerEndAddr);
          w.seek(sectionItphAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(itemPaths.length);
          w.writeUInt16(this.headerData[sectionId]);
          for (let path of itemPaths) {
            if (path.nodes.length > 255)
              throw "kmp encode: max item point number in a path surpassed (have " + path.nodes.length + ", max 255)";
            w.writeByte(itemPoints.findIndex((n) => n == path.nodes[0]));
            w.writeByte(path.nodes.length);
            let incomingPaths = path.prev.reduce((accum, p) => accum + 1, 0);
            let outgoingPaths = path.next.reduce((accum, p) => accum + 1, 0);
            if (incomingPaths > 6)
              throw "kmp encode: max incoming connections to an item point surpassed (have " + incomingPaths + ", max 6)";
            if (outgoingPaths > 6)
              throw "kmp encode: max outgoing connections to an item point surpassed (have " + outgoingPaths + ", max 6)";
            for (let i = 0; i < 6; i++) {
              if (i < path.prev.length)
                w.writeByte(itemPaths.findIndex((p) => p == path.prev[i]));
              else
                w.writeByte(255);
            }
            for (let i = 0; i < 6; i++) {
              if (i < path.next.length)
                w.writeByte(itemPaths.findIndex((p) => p == path.next[i]));
              else
                w.writeByte(255);
            }
            w.writeUInt16(0);
          }
          let checkpointPaths = this.checkpointPoints.convertToStorageFormat();
          let checkpointPoints = [];
          checkpointPaths.forEach((path) => path.nodes.forEach((node) => checkpointPoints.push(node)));
          if (checkpointPaths.length >= 255)
            throw "kmp encode: max checkpoint path number surpassed (have " + checkpointPaths.length + ", max 254)";
          if (checkpointPoints.length > 255)
            throw "kmp encode: max checkpoint point number surpassed (have " + checkpointPoints.length + ", max 255)";
          sectionId = "CKPT";
          let sectionCkptAddr = w.head;
          let sectionCkptOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionCkptOrder * 4);
          w.writeUInt32(sectionCkptAddr - headerEndAddr);
          w.seek(sectionCkptAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(checkpointPoints.length);
          w.writeUInt16(this.headerData[sectionId]);
          for (let i = 0; i < checkpointPoints.length; i++) {
            let p = checkpointPoints[i];
            w.writeFloat32(p.pos[0].x);
            w.writeFloat32(-p.pos[0].y);
            w.writeFloat32(p.pos[1].x);
            w.writeFloat32(-p.pos[1].y);
            let respawnIndex = this.respawnPoints.nodes.findIndex((p2) => p.respawnNode === p2);
            if (respawnIndex == -1)
              respawnIndex = 0;
            w.writeByte(respawnIndex);
            w.writeByte(p.type);
            let path = checkpointPaths.find((pth) => pth.nodes.find((p2) => p === p2) != null);
            let indexInPath = path.nodes.findIndex((p2) => p === p2);
            w.writeByte(indexInPath > 0 ? i - 1 : 255);
            w.writeByte(indexInPath < path.nodes.length - 1 ? i + 1 : 255);
          }
          sectionId = "CKPH";
          let sectionCkphAddr = w.head;
          let sectionCkphOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionCkphOrder * 4);
          w.writeUInt32(sectionCkphAddr - headerEndAddr);
          w.seek(sectionCkphAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(checkpointPaths.length);
          w.writeUInt16(this.headerData[sectionId]);
          for (let path of checkpointPaths) {
            if (path.nodes.length > 255)
              throw "kmp encode: max checkpoint point number in a path surpassed (have " + path.nodes.length + ", max 255)";
            w.writeByte(checkpointPoints.findIndex((n) => n == path.nodes[0]));
            w.writeByte(path.nodes.length);
            let incomingPaths = path.prev.reduce((accum, p) => accum + 1, 0);
            let outgoingPaths = path.next.reduce((accum, p) => accum + 1, 0);
            if (incomingPaths > 6)
              throw "kmp encode: max incoming connections to an checkpoint point surpassed (have " + incomingPaths + ", max 6)";
            if (outgoingPaths > 6)
              throw "kmp encode: max outgoing connections to an checkpoint point surpassed (have " + outgoingPaths + ", max 6)";
            for (let i = 0; i < 6; i++) {
              if (i < path.prev.length)
                w.writeByte(checkpointPaths.findIndex((p) => p == path.prev[i]));
              else
                w.writeByte(255);
            }
            for (let i = 0; i < 6; i++) {
              if (i < path.next.length)
                w.writeByte(checkpointPaths.findIndex((p) => p == path.next[i]));
              else
                w.writeByte(255);
            }
            w.writeUInt16(0);
          }
          sectionId = "GOBJ";
          let sectionGobjAddr = w.head;
          let sectionGobjOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionGobjOrder * 4);
          w.writeUInt32(sectionGobjAddr - headerEndAddr);
          w.seek(sectionGobjAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(this.objects.nodes.length);
          w.writeUInt16(this.headerData[sectionId]);
          if (this.objects.nodes.length > 255)
            alert("Warning: More than 255 objects found (" + this.objects.nodes.length + ").\nTrack slot 5.3 is required for objects to load correctly.");
          for (let p of this.objects.nodes) {
            let packedPresence = p.presence & 7 | ((p.condMode || 0) & 7) << 3 | ((p.condStart || 0) & 7) << 6 | ((p.condEnd || 0) & 7) << 9;
            let saved = p.presence;
            p.presence = packedPresence;
            for (let prop in format[sectionId])
              w.write(format[sectionId][prop], p[prop]);
            p.presence = saved;
          }
          sectionId = "POTI";
          let sectionPotiAddr = w.head;
          let sectionPotiOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionPotiOrder * 4);
          w.writeUInt32(sectionPotiAddr - headerEndAddr);
          w.seek(sectionPotiAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(this.routes.length);
          w.writeUInt16(this.routes.reduce((accum, route) => accum + route.points.nodes.length, 0));
          for (let route of this.routes) {
            let routePaths = route.points.convertToStorageFormat();
            let routePoints = [];
            routePaths.forEach((path) => path.nodes.forEach((node) => routePoints.push(node)));
            if (routePoints.length > 65535)
              throw "kmp encode: max route point number surpassed (have " + routePoints.length + ", max 65535)";
            w.writeUInt16(routePoints.length);
            w.writeByte(route.setting1);
            w.writeByte(route.setting2);
            for (let point of routePoints) {
              w.writeVec3(new Vec3(point.pos.x, -point.pos.z, -point.pos.y));
              w.writeUInt16(point.setting1);
              w.writeUInt16(point.setting2);
            }
          }
          sectionId = "AREA";
          let sectionAreaAddr = w.head;
          let sectionAreaOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionAreaOrder * 4);
          w.writeUInt32(sectionAreaAddr - headerEndAddr);
          w.seek(sectionAreaAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(this.areaPoints.nodes.length);
          w.writeUInt16(this.headerData[sectionId]);
          if (this.areaPoints.nodes.length > 255)
            throw "kmp encode: max AREA points surpassed (have " + this.areaPoints.nodes.length + ", max 255)";
          for (let p of this.areaPoints.nodes)
            for (let prop in format[sectionId])
              w.write(format[sectionId][prop], p[prop]);
          sectionId = "CAME";
          let sectionCameAddr = w.head;
          let sectionCameOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionCameOrder * 4);
          w.writeUInt32(sectionCameAddr - headerEndAddr);
          w.seek(sectionCameAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(this.cameras.nodes.length);
          w.writeByte(this.firstIntroCam);
          w.writeByte(this.firstSelectionCam);
          if (this.cameras.nodes.length > 255)
            throw "kmp encode: max cameras surpassed (have " + this.cameras.nodes.length + ", max 255)";
          for (let p of this.cameras.nodes)
            for (let prop in format[sectionId])
              w.write(format[sectionId][prop], p[prop]);
          sectionId = "JGPT";
          let sectionJgptAddr = w.head;
          let sectionJgptOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionJgptOrder * 4);
          w.writeUInt32(sectionJgptAddr - headerEndAddr);
          w.seek(sectionJgptAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(this.respawnPoints.nodes.length);
          w.writeUInt16(this.headerData[sectionId]);
          if (this.respawnPoints.nodes.length > 255)
            throw "kmp encode: max respawn points surpassed (have " + this.respawnPoints.nodes.length + ", max 255)";
          for (let p of this.respawnPoints.nodes)
            for (let prop in format[sectionId])
              w.write(format[sectionId][prop], p[prop]);
          sectionId = "CNPT";
          let sectionCnptAddr = w.head;
          let sectionCnptOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionCnptOrder * 4);
          w.writeUInt32(sectionCnptAddr - headerEndAddr);
          w.seek(sectionCnptAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(this.cannonPoints.nodes.length);
          w.writeUInt16(this.headerData[sectionId]);
          if (this.cannonPoints.nodes.length > 255)
            throw "kmp encode: max cannon points surpassed (have " + this.cannonPoints.nodes.length + ", max 255)";
          for (let p of this.cannonPoints.nodes)
            for (let prop in format[sectionId])
              w.write(format[sectionId][prop], p[prop]);
          sectionId = "MSPT";
          let sectionMsptAddr = w.head;
          let sectionMsptOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionMsptOrder * 4);
          w.writeUInt32(sectionMsptAddr - headerEndAddr);
          w.seek(sectionMsptAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(this.finishPoints.nodes.length);
          w.writeUInt16(this.headerData[sectionId]);
          if (this.finishPoints.nodes.length > 255)
            throw "kmp encode: max finish points surpassed (have " + this.finishPoints.nodes.length + ", max 255)";
          for (let p of this.finishPoints.nodes)
            for (let prop in format[sectionId])
              w.write(format[sectionId][prop], p[prop]);
          sectionId = "STGI";
          let sectionStgiAddr = w.head;
          let sectionStgiOrder = sectionOrder.findIndex((s) => s == sectionId);
          w.seek(sectionOffsetsAddr + sectionStgiOrder * 4);
          w.writeUInt32(sectionStgiAddr - headerEndAddr);
          w.seek(sectionStgiAddr);
          w.writeAscii(sectionId);
          w.writeUInt16(1);
          w.writeUInt16(this.headerData[sectionId]);
          for (let prop in format[sectionId])
            w.write(format[sectionId][prop], this.trackInfo[prop]);
          w.seek(fileLenAddr);
          w.writeUInt32(w.getLength());
          return w.getBytes();
        }
        constructor() {
          this.unhandledSectionData = [];
          this.headerData = {};
          this.startPoints = new NodeGraph();
          this.startPoints.onAddNode = (node) => {
            node.pos = new Vec3(0, 0, 0);
            node.rotation = new Vec3(0, 0, 0);
            node.playerIndex = 65535;
            node.padding = 0;
          };
          this.startPoints.onCloneNode = (newNode, oldNode) => {
            cloneProperties(newNode, oldNode, "KTPT");
          };
          this.routes = [];
          this.enemyPoints = new NodeGraph();
          this.enemyPoints.maxNextNodes = 6;
          this.enemyPoints.maxPrevNodes = 6;
          this.enemyPoints.onAddNode = (node) => {
            node.pos = new Vec3(0, 0, 0);
            node.deviation = 10;
            node.setting1 = 0;
            node.setting2 = 0;
            node.setting3 = 0;
          };
          this.enemyPoints.onCloneNode = (newNode, oldNode) => {
            cloneProperties(newNode, oldNode, "ENPT");
          };
          this.itemPoints = new NodeGraph();
          this.itemPoints.maxNextNodes = 6;
          this.itemPoints.maxPrevNodes = 6;
          this.itemPoints.onAddNode = (node) => {
            node.pos = new Vec3(0, 0, 0);
            node.deviation = 10;
            node.setting1 = 0;
            node.setting2 = 0;
          };
          this.itemPoints.onCloneNode = (newNode, oldNode) => {
            cloneProperties(newNode, oldNode, "ITPT");
          };
          this.objects = new NodeGraph();
          this.objects.maxNodes = 65535;
          this.objects.onAddNode = (node) => {
            node.pos = new Vec3(0, 0, 0);
            node.rotation = new Vec3(0, 0, 0);
            node.scale = new Vec3(1, 1, 1);
            node.id = 0;
            node.xpfThing = 0;
            node.route = null;
            node.routeIndex = 65535;
            node.settings = [0, 0, 0, 0, 0, 0, 0, 0];
            node.presence = 7;
            node.condMode = 0;
            node.condStart = 0;
            node.condEnd = 0;
          };
          this.objects.onCloneNode = (newNode, oldNode) => {
            cloneProperties(newNode, oldNode, "GOBJ");
            newNode.condMode = oldNode.condMode || 0;
            newNode.condStart = oldNode.condStart || 0;
            newNode.condEnd = oldNode.condEnd || 0;
          };
          this.checkpointPoints = new NodeGraph();
          this.checkpointPoints.maxNextNodes = 6;
          this.checkpointPoints.maxPrevNodes = 6;
          this.checkpointPoints.onAddNode = (node) => {
            node.pos = [new Vec3(0, 0, 0), new Vec3(0, 0, 0)];
            node.respawnNode = null;
            node.respawnIndex = 0;
            node.type = 255;
            node.firstInPath = false;
            node.isRendered = true;
          };
          this.checkpointPoints.onCloneNode = (newNode, oldNode) => {
            newNode.pos = [oldNode.pos[0].clone(), oldNode.pos[1].clone()];
            newNode.respawnNode = oldNode.respawnNode;
            newNode.respawnIndex = oldNode.respawnIndex;
            newNode.type = oldNode.type;
            newNode.firstInPath = oldNode.firstInPath;
            newNode.isRendered = oldNode.isRendered;
          };
          this.checkpointPoints.findFirstNode = (nodes) => {
            return nodes.find((n) => n.type == 0);
          };
          this.respawnPoints = new NodeGraph();
          this.respawnPoints.onAddNode = (node) => {
            node.pos = new Vec3(0, 0, 0);
            node.rotation = new Vec3(0, 0, 0);
            node.id = 0;
            node.soundData = 65535;
          };
          this.respawnPoints.onCloneNode = (newNode, oldNode) => {
            cloneProperties(newNode, oldNode, "JGPT");
          };
          this.cannonPoints = new NodeGraph();
          this.cannonPoints.onAddNode = (node) => {
            node.pos = new Vec3(0, 0, 0);
            node.rotation = new Vec3(0, 0, 0);
            node.id = 0;
            node.effect = 65535;
          };
          this.cannonPoints.onCloneNode = (newNode, oldNode) => {
            cloneProperties(newNode, oldNode, "CNPT");
          };
          this.finishPoints = new NodeGraph();
          this.finishPoints.onAddNode = (node) => {
            node.pos = new Vec3(0, 0, 0);
            node.rotation = new Vec3(0, 0, 0);
            node.id = 0;
            node.padding = 0;
          };
          this.finishPoints.onCloneNode = (newNode, oldNode) => {
            cloneProperties(newNode, oldNode, "MSPT");
          };
          this.areaPoints = new NodeGraph();
          this.areaPoints.enableCOOB = false;
          this.areaPoints.onAddNode = (node) => {
            node.pos = new Vec3(0, 0, 0);
            node.rotation = new Vec3(0, 0, 0);
            node.scale = new Vec3(1, 1, 1);
            node.shape = 0;
            node.type = 0;
            node.priority = 0;
            node.setting1 = 0;
            node.setting2 = 0;
            node.cameraIndex = 255;
            node.routeIndex = 255;
            node.enemyIndex = 255;
            node.isRendered = false;
          };
          this.areaPoints.onCloneNode = (newNode, oldNode) => {
            cloneProperties(newNode, oldNode, "AREA");
          };
          this.cameras = new NodeGraph();
          this.firstIntroCam = 0;
          this.firstSelectionCam = 0;
          this.cameras.onAddNode = (node) => {
            node.pos = new Vec3(0, 0, 0);
            node.rotation = new Vec3(0, 0, 0);
            node.type = 0;
            node.nextCam = 0;
            node.shake = 0;
            node.routeIndex = 255;
            node.vCam = 0;
            node.vZoom = 0;
            node.vView = 0;
            node.start = 0;
            node.movie = 0;
            node.zoomStart = 0;
            node.zoomEnd = 0;
            node.viewPosStart = new Vec3(0, 0, 0);
            node.viewPosEnd = new Vec3(0, 0, 0);
            node.time = 0;
          };
          this.cameras.onCloneNode = (newNode, oldNode) => {
            cloneProperties(newNode, oldNode, "CAME");
          };
          this.trackInfo = {};
          this.trackInfo.lapCount = 3;
          this.trackInfo.polePosition = 0;
          this.trackInfo.driverDistance = 0;
          this.trackInfo.lensFlareFlash = 0;
          this.trackInfo.unknown1 = 0;
          this.trackInfo.flareColor = [255, 255, 255, 0];
          this.trackInfo.unknown2 = 0;
          this.trackInfo.speedMod = 0;
        }
        addNewRoute() {
          let route = {};
          route.setting1 = 0;
          route.setting2 = 0;
          route.points = new NodeGraph();
          route.points.maxNodes = 65535;
          route.points.onAddNode = (node) => {
            node.pos = new Vec3(0, 0, 0);
            node.setting1 = 0;
            node.setting2 = 0;
          };
          route.points.onCloneNode = (newNode, oldNode) => {
            newNode.pos = oldNode.pos.clone();
            newNode.setting1 = oldNode.setting1;
            newNode.setting2 = oldNode.setting2;
          };
          this.routes.push(route);
          return route;
        }
        removeRespawnPointLinks(node) {
          for (let checkpoint of this.checkpointPoints.nodes) {
            if (checkpoint.respawnNode === node) {
              checkpoint.respawnNode = this.respawnPoints.nodes.length > 0 ? this.respawnPoints.nodes[0] : null;
            }
          }
        }
        refreshIndices(asBattle) {
          this.enemyPoints.convertToStorageFormat(asBattle);
          this.itemPoints.convertToStorageFormat();
          this.checkpointPoints.convertToStorageFormat();
        }
        clone() {
          let cloned = new _KmpData();
          cloned.trackInfo = {};
          cloned.trackInfo.lapCount = this.trackInfo.lapCount;
          cloned.trackInfo.polePosition = this.trackInfo.polePosition;
          cloned.trackInfo.driverDistance = this.trackInfo.driverDistance;
          cloned.trackInfo.lensFlareFlash = this.trackInfo.lensFlareFlash;
          cloned.trackInfo.unknown1 = this.trackInfo.unknown1;
          cloned.trackInfo.flareColor = [
            this.trackInfo.flareColor[0],
            this.trackInfo.flareColor[1],
            this.trackInfo.flareColor[2],
            this.trackInfo.flareColor[3]
          ];
          cloned.trackInfo.unknown2 = this.trackInfo.unknown2;
          cloned.trackInfo.speedMod = this.trackInfo.speedMod;
          cloned.unhandledSectionData = this.unhandledSectionData;
          cloned.startPoints = this.startPoints.clone();
          cloned.finishPoints = this.finishPoints.clone();
          cloned.enemyPoints = this.enemyPoints.clone();
          cloned.itemPoints = this.itemPoints.clone();
          cloned.checkpointPoints = this.checkpointPoints.clone();
          cloned.objects = this.objects.clone();
          cloned.respawnPoints = this.respawnPoints.clone();
          cloned.cannonPoints = this.cannonPoints.clone();
          cloned.areaPoints = this.areaPoints.clone();
          cloned.cameras = this.cameras.clone();
          cloned.firstIntroCam = this.firstIntroCam;
          cloned.firstSelectionCam = this.firstSelectionCam;
          for (let route of this.routes) {
            let newRoute = cloned.addNewRoute();
            newRoute.setting1 = route.setting1;
            newRoute.setting2 = route.setting2;
            newRoute.points = route.points.clone();
          }
          for (let checkpoint of cloned.checkpointPoints.nodes) {
            let respawnIndex = this.respawnPoints.nodes.findIndex((p) => p == checkpoint.respawnNode);
            checkpoint.respawnNode = null;
            if (respawnIndex >= 0)
              checkpoint.respawnNode = cloned.respawnPoints.nodes[respawnIndex];
          }
          return cloned;
        }
      };
      var NodeGraph = class _NodeGraph {
        constructor() {
          this.nodes = [];
          this.maxNodes = 255;
          this.maxNextNodes = 1;
          this.maxPrevNodes = 1;
          this.onAddNode = () => {
          };
          this.onCloneNode = () => {
          };
          this.findFirstNode = (nodes) => nodes.length > 0 ? nodes[0] : null;
        }
        addNode() {
          let node = {
            next: [],
            prev: []
          };
          this.onAddNode(node);
          this.nodes.push(node);
          return node;
        }
        removeNode(node) {
          for (let prev of node.prev) {
            let nextIndex = prev.node.next.findIndex((n) => n.node == node);
            if (nextIndex >= 0)
              prev.node.next.splice(nextIndex, 1);
          }
          for (let next of node.next) {
            let prevIndex = next.node.prev.findIndex((n) => n.node == node);
            if (prevIndex >= 0)
              next.node.prev.splice(prevIndex, 1);
          }
          this.nodes.splice(this.nodes.findIndex((n) => n == node), 1);
        }
        linkNodes(node1, node2) {
          if (node1 == node2)
            return;
          let node1NextIndex = node1.next.findIndex((n) => n.node == node2);
          if (node1NextIndex >= 0)
            node1.next[node1NextIndex].count += 1;
          else
            node1.next.push({ node: node2, count: 1 });
          let node2PrevIndex = node2.prev.findIndex((n) => n.node == node1);
          if (node2PrevIndex >= 0)
            node2.prev[node2PrevIndex].count += 1;
          else
            node2.prev.push({ node: node1, count: 1 });
        }
        unlinkNodes(node1, node2) {
          let node1NextIndex = node1.next.findIndex((n) => n.node == node2);
          if (node1NextIndex >= 0) {
            node1.next[node1NextIndex].count -= 1;
            if (node1.next[node1NextIndex].count <= 0)
              node1.next.splice(node1NextIndex, 1);
          }
          let node2PrevIndex = node2.prev.findIndex((n) => n.node == node1);
          if (node2PrevIndex >= 0) {
            node2.prev[node2PrevIndex].count -= 1;
            if (node2.prev[node2PrevIndex].count <= 0)
              node2.prev.splice(node2PrevIndex, 1);
          }
        }
        clone() {
          let clonedNodes = [];
          let clonedNodesMap = /* @__PURE__ */ new Map();
          for (let node of this.nodes) {
            let clonedNode = {
              next: [],
              prev: []
            };
            this.onCloneNode(clonedNode, node);
            clonedNodesMap.set(node, clonedNode);
            clonedNodes.push(clonedNode);
          }
          for (let node of this.nodes) {
            let clonedNode = clonedNodesMap.get(node);
            for (let next of node.next) {
              clonedNode.next.push({
                node: clonedNodesMap.get(next.node),
                count: next.count
              });
            }
            for (let prev of node.prev) {
              clonedNode.prev.push({
                node: clonedNodesMap.get(prev.node),
                count: prev.count
              });
            }
          }
          let graph = new _NodeGraph();
          graph.nodes = clonedNodes;
          graph.maxNextNodes = this.maxNextNodes;
          graph.maxPrevNodes = this.maxPrevNodes;
          graph.headerData = this.headerData;
          graph.onAddNode = this.onAddNode;
          graph.onCloneNode = this.onCloneNode;
          return graph;
        }
        convertToStorageFormat(asBattle = false) {
          let paths = [];
          let nodesToHandle = this.nodes.map((n) => n);
          let nodesToPath = /* @__PURE__ */ new Map();
          const firstNode = this.findFirstNode(this.nodes) || (this.nodes.length > 0 ? this.nodes[0] : null);
          if (firstNode) {
            nodesToHandle.filter((n) => n !== firstNode);
            nodesToHandle.unshift(firstNode);
          }
          const nodeIsBattleDispatcher = (node) => asBattle && node.next.length + node.prev.length > 2;
          while (nodesToHandle.length > 0) {
            const node = nodesToHandle[0];
            const pathIndex = paths.length;
            let path = { nodes: [], next: [], prev: [] };
            paths.push(path);
            if (nodeIsBattleDispatcher(node)) {
              node.pathIndex = pathIndex;
              path.nodes.push(node);
              nodesToPath.set(node, path);
              nodesToHandle = nodesToHandle.filter((n) => n !== node);
              continue;
            }
            let nodeAtPathStart = node;
            if (node !== firstNode) {
              while (nodeAtPathStart.prev.length == 1 && nodeAtPathStart.prev[0].node.next.length == 1 && !nodeIsBattleDispatcher(nodeAtPathStart.prev[0].node)) {
                if (nodesToPath.get(nodeAtPathStart.prev[0].node, path))
                  break;
                nodeAtPathStart = nodeAtPathStart.prev[0].node;
                if (nodeAtPathStart === node)
                  break;
              }
            }
            nodeAtPathStart.pathIndex = pathIndex;
            path.nodes.push(nodeAtPathStart);
            nodesToPath.set(nodeAtPathStart, path);
            nodesToHandle = nodesToHandle.filter((n) => n !== nodeAtPathStart);
            let nodeAtPath = nodeAtPathStart;
            while (nodeAtPath.next.length == 1 && nodeAtPath.next[0].node.prev.length == 1 && !nodeIsBattleDispatcher(nodeAtPath.next[0].node)) {
              nodeAtPath = nodeAtPath.next[0].node;
              if (nodesToPath.get(nodeAtPath, path))
                break;
              if ("firstInPath" in nodeAtPath && nodeAtPath.firstInPath)
                break;
              nodeAtPath.pathIndex = pathIndex;
              path.nodes.push(nodeAtPath);
              nodesToPath.set(nodeAtPath, path);
              nodesToHandle = nodesToHandle.filter((n) => n !== nodeAtPath);
            }
          }
          let pointIndex = 0;
          for (let path of paths) {
            let lastNode = path.nodes[path.nodes.length - 1];
            for (let next of lastNode.next) {
              let nextPath = nodesToPath.get(next.node);
              for (let i = 0; i < next.count; i++)
                path.next.push(nextPath);
              nextPath.prev.push(path);
            }
            for (let i = 0; i < path.nodes.length; i++) {
              path.nodes[i].pathPointIndex = i;
              path.nodes[i].pointIndex = pointIndex;
              pointIndex += 1;
            }
          }
          let checkpointPaths = paths.filter((p) => "firstInPath" in p.nodes[0]);
          if (checkpointPaths.length > 0) {
            for (let group of checkpointPaths) {
              group.layer = -1;
              for (let node of group.nodes)
                node.pathLayer = null;
            }
            const calculateGroupLayers = (group, layer) => {
              group.layer = layer;
              if (layer > this.maxLayer)
                this.maxLayer = layer;
              if (checkpointPaths.length > 1) {
                for (let next of group.next)
                  if (next.layer === -1)
                    calculateGroupLayers(next, layer + 1);
              }
            };
            this.maxLayer = 0;
            calculateGroupLayers(checkpointPaths[0], 0);
            for (let path of checkpointPaths)
              for (let node of path.nodes) {
                node.pathLen = path.nodes.length;
                node.pathLayer = path.layer;
              }
          }
          if (asBattle) {
            for (let path of paths) {
              if (path.nodes.length == 1 && path.next.length + path.prev.length > 2) {
                for (let prev of path.prev) {
                  if (path.next.find((g) => g === prev))
                    continue;
                  path.next.push(prev);
                }
                path.prev = [];
              }
            }
          }
          return paths;
        }
      };
      if (module)
        module.exports = { KmpData };
    }
  });

  // src/util/kclLoader.js
  var require_kclLoader = __commonJS({
    "src/util/kclLoader.js"(exports, module) {
      var { BinaryParser } = require_binaryParser();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var cat = (isDeath, isInvis, isEffect, isWall, isItem) => {
        return { isDeath, isInvis, isEffect, isWall, isItem };
      };
      var collisionTypeData = [
        { f: cat(0, 0, 0, 0, 0), c: [1, 1, 1, 1], priority: 0, name: "Road" },
        { f: cat(0, 0, 0, 0, 0), c: [1, 0.9, 0.8, 1], priority: 0, name: "Slippery Road (sand/dirt)" },
        { f: cat(0, 0, 0, 0, 0), c: [0, 0.8, 0, 1], priority: 0, name: "Weak Off-Road" },
        { f: cat(0, 0, 0, 0, 0), c: [0, 0.6, 0, 1], priority: 0, name: "Off-Road" },
        { f: cat(0, 0, 0, 0, 0), c: [0, 0.4, 0, 1], priority: 0, name: "Heavy Off-Road" },
        { f: cat(0, 0, 0, 0, 0), c: [0.8, 0.9, 1, 1], priority: 0, name: "Slippery Road (ice)" },
        { f: cat(0, 0, 0, 0, 0), c: [1, 0.5, 0, 1], priority: 0, name: "Boost Panel" },
        { f: cat(0, 0, 0, 0, 0), c: [1, 0.6, 0, 1], priority: 0, name: "Boost Ramp" },
        { f: cat(0, 0, 0, 0, 0), c: [1, 0.8, 0, 1], priority: 0, name: "Slow Ramp" },
        { f: cat(0, 0, 0, 0, 1), c: [0.9, 0.9, 1, 0.5], priority: 2, name: "Item Road" },
        { f: cat(1, 0, 0, 0, 0), c: [0.7, 0.1, 0.1, 1], priority: 0, name: "Solid Fall" },
        { f: cat(0, 0, 0, 0, 0), c: [0, 0.5, 1, 1], priority: 0, name: "Moving Water" },
        { f: cat(0, 0, 0, 1, 0), c: [0.6, 0.6, 0.6, 1], priority: 0, name: "Wall" },
        { f: cat(0, 1, 0, 1, 0), c: [0, 0, 0.6, 0.8], priority: 3, name: "Invisible Wall" },
        { f: cat(0, 0, 0, 0, 1), c: [0.6, 0.6, 0.7, 0.5], priority: 2, name: "Item Wall" },
        { f: cat(0, 0, 0, 1, 0), c: [0.6, 0.6, 0.6, 1], priority: 0, name: "Wall 2" },
        { f: cat(1, 0, 0, 0, 0), c: [0.8, 0, 0, 0.8], priority: 4, name: "Fall Boundary" },
        { f: cat(0, 0, 1, 0, 0), c: [1, 0, 0.5, 0.8], priority: 1, name: "Cannon Activator" },
        { f: cat(0, 0, 1, 0, 0), c: [0.5, 0, 1, 0.5], priority: 1, name: "Force Recalculation" },
        { f: cat(0, 0, 0, 0, 0), c: [0, 0.3, 1, 1], priority: 0, name: "Half-pipe Ramp" },
        { f: cat(0, 1, 0, 1, 0), c: [0.8, 0.4, 0, 0.8], priority: 1, name: "Player-Only Wall" },
        { f: cat(0, 0, 0, 0, 0), c: [0.9, 0.9, 1, 1], priority: 0, name: "Moving Road" },
        { f: cat(0, 0, 0, 0, 0), c: [0.9, 0.7, 1, 1], priority: 0, name: "Sticky Road" },
        { f: cat(0, 0, 0, 0, 0), c: [1, 1, 1, 1], priority: 0, name: "Road 2" },
        { f: cat(0, 0, 1, 0, 0), c: [1, 0, 1, 0.8], priority: 1, name: "Sound Trigger" },
        { f: cat(0, 1, 0, 1, 0), c: [0.4, 0.6, 0.4, 0.8], priority: 1, name: "Weak Wall" },
        { f: cat(0, 0, 1, 0, 0), c: [0.8, 0, 1, 0.8], priority: 1, name: "Effect Trigger" },
        { f: cat(0, 0, 1, 0, 0), c: [1, 0, 1, 0.5], priority: 1, name: "Item State Modifier" },
        { f: cat(0, 1, 0, 1, 0), c: [0, 0.6, 0, 0.8], priority: 3, name: "Half-pipe Invis Wall" },
        { f: cat(0, 0, 0, 0, 0), c: [0.9, 0.9, 1, 1], priority: 0, name: "Rotating Road" },
        { f: cat(0, 0, 0, 1, 0), c: [0.8, 0.7, 0.8, 1], priority: 0, name: "Special Wall" },
        { f: cat(0, 1, 0, 1, 0), c: [0, 0, 0.6, 0.8], priority: 3, name: "Invisible Wall 2" }
      ];
      var KclLoader = class {
        static load(bytes, cfg, hl) {
          let parser = new BinaryParser(bytes);
          let section1Offset = parser.readUInt32();
          let section2Offset = parser.readUInt32();
          let section3Offset = parser.readUInt32();
          let section4Offset = parser.readUInt32();
          let triLists = [[], [], [], [], []];
          let vertices = [];
          parser.seek(section1Offset);
          while (parser.head < section2Offset) {
            let x = parser.readFloat32();
            let y = parser.readFloat32();
            let z = parser.readFloat32();
            vertices.push(new Vec3(x, -z, -y));
          }
          let normals = [];
          parser.seek(section2Offset);
          while (parser.head < section3Offset + 16) {
            let x = parser.readFloat32();
            let y = parser.readFloat32();
            let z = parser.readFloat32();
            normals.push(new Vec3(x, -z, -y));
          }
          let model = new ModelBuilder();
          if (!cfg.kclEnableModel) {
            model.addTri(new Vec3(0, 0, 0), new Vec3(1, 0, 0), new Vec3(0, 1, 0));
            return model.calculateNormals();
          }
          let triIndex = -1;
          parser.seek(section3Offset + 16);
          while (parser.head < section4Offset) {
            triIndex++;
            let len = parser.readFloat32();
            let posIndex = parser.readUInt16();
            let dirIndex = parser.readUInt16();
            let normAIndex = parser.readUInt16();
            let normBIndex = parser.readUInt16();
            let normCIndex = parser.readUInt16();
            let collisionFlags = parser.readUInt16();
            if (posIndex >= vertices.length || dirIndex >= normals.length || normAIndex >= normals.length || normBIndex >= normals.length || normCIndex >= normals.length)
              continue;
            let vertex = vertices[posIndex];
            let direction = normals[dirIndex];
            let normalA = normals[normAIndex];
            let normalB = normals[normBIndex];
            let normalC = normals[normCIndex];
            let crossA = normalA.cross(direction);
            let crossB = normalB.cross(direction);
            let v1 = vertex;
            let v2 = vertex.add(crossB.scale(len / crossB.dot(normalC)));
            let v3 = vertex.add(crossA.scale(len / crossA.dot(normalC)));
            if (!v1.isFinite() || !v2.isFinite() || !v3.isFinite())
              continue;
            let flagBasicType = collisionFlags & 31;
            if (flagBasicType >= collisionTypeData.length)
              continue;
            let data = collisionTypeData[flagBasicType];
            let isTargetFlag = !(hl.baseType < 0 && hl.basicEffect < 0 && hl.blightEffect < 0 && hl.intensity < 0 && hl.collisionEffect < 0) && (hl.baseType == -1 || flagBasicType == hl.baseType) && (hl.basicEffect == -1 || (collisionFlags >>> 5 & 7) == hl.basicEffect) && (hl.blightEffect == -1 || (collisionFlags >>> 8 & 7) == hl.blightEffect) && (hl.intensity == -1 || (collisionFlags >>> 11 & 3) == hl.intensity) && (hl.collisionEffect == -1 || (collisionFlags >>> 13 & 7) == hl.collisionEffect);
            if (isTargetFlag || cfg.kclTriIndex[0] <= triIndex && cfg.kclTriIndex[1] >= triIndex) {
              let color2 = [1, 1, 0, 1];
              triLists[data.priority].push({ v1, v2, v3, color: color2 });
              continue;
            }
            if (cfg && data.f.isWall && cfg.kclEnableWalls !== void 0 && !cfg.kclEnableWalls)
              continue;
            if (cfg && data.f.isDeath && cfg.kclEnableDeathBarriers !== void 0 && !cfg.kclEnableDeathBarriers)
              continue;
            if (cfg && data.f.isInvis && cfg.kclEnableInvisible !== void 0 && !cfg.kclEnableInvisible)
              continue;
            if (cfg && data.f.isItem && cfg.kclEnableItemRoad !== void 0 && !cfg.kclEnableItemRoad)
              continue;
            if (cfg && data.f.isEffect && cfg.kclEnableEffects !== void 0 && !cfg.kclEnableEffects)
              continue;
            let color = data.c;
            if (cfg && cfg.kclEnableColors !== void 0 && !cfg.kclEnableColors)
              color = [1, 1, 1, 1];
            if (cfg && cfg.kclHighlighter !== void 0) {
              let v1to2 = v2.sub(v1);
              let v1to3 = v3.sub(v1);
              let normal = v1to2.cross(v1to3).normalize();
              let highlighted = false;
              switch (cfg.kclHighlighter) {
                case 1:
                  highlighted = collisionFlags & 8192;
                  break;
                case 2:
                  highlighted = data.f.isWall && normal.dot(new Vec3(0, 0, 1)) > 0.9;
                  break;
                case 3:
                  highlighted = data.f.isWall && collisionFlags & 32768;
                  break;
                case 6:
                  highlighted = data.f.isWall && normal.dot(new Vec3(0, 0, 1)) > 0;
                  break;
              }
              if (highlighted)
                color = [1, 1, 0, 1];
            }
            triLists[data.priority].push({ v1, v2, v3, color });
          }
          for (let lis of triLists)
            for (let tri of lis)
              model.addTri(tri.v1, tri.v2, tri.v3, tri.color, tri.color, tri.color);
          return model.calculateNormals();
        }
      };
      if (module)
        module.exports = { KclLoader, collisionTypeData };
    }
  });

  // src/util/objLoader.js
  var require_objLoader = __commonJS({
    "src/util/objLoader.js"(exports, module) {
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var ObjLoader = class _ObjLoader {
        static load(bytes) {
          let str = new TextDecoder("utf-8").decode(bytes);
          let lines = str.replace("\r\n", "\n").split("\n").map((s) => s.trim());
          let objects = [];
          let curObject = null;
          let curGeometry = null;
          for (let line of lines) {
            if (line.startsWith("#"))
              continue;
            let tagO = line.match(/^o[ ]+(.*)/);
            if (tagO != null) {
              let object = {};
              object.name = tagO[1];
              object.vertices = [];
              object.normals = [];
              object.texCoords = [];
              object.geometries = [];
              objects.push(object);
              curObject = object;
              continue;
            }
            if (curObject == null) {
              let object = {};
              object.name = "Default Object";
              object.vertices = [];
              object.normals = [];
              object.texCoords = [];
              object.geometries = [];
              objects.push(object);
              curObject = object;
            }
            let tagV = line.match(/^v[ ]+([0-9.-]+)[ ]+([0-9.-]+)[ ]+([0-9.-]+)/);
            if (tagV != null) {
              let vertex = new Vec3(parseFloat(tagV[1]), -parseFloat(tagV[3]), -parseFloat(tagV[2]));
              curObject.vertices.push(vertex);
              continue;
            }
            let tagVT = line.match(/^vt[ ]+([0-9.-]+)[ ]+([0-9.-]+)/);
            if (tagVT != null) {
              let texCoord = new Vec3(parseFloat(tagVT[1]), parseFloat(tagVT[2]), 0);
              curObject.texCoords.push(texCoord);
              continue;
            }
            let tagVN = line.match(/^vn[ ]+([0-9.-]+)[ ]+([0-9.-]+)[ ]+([0-9.-]+)/);
            if (tagVN != null) {
              let normal = new Vec3(parseFloat(tagVN[1]), parseFloat(tagVN[2]), parseFloat(tagVN[3]));
              curObject.normals.push(normal);
              continue;
            }
            let tagG = line.match(/^g[ ]+(.*)/);
            if (tagG != null) {
              let geometry = {};
              geometry.name = tagG[1];
              geometry.faces = [];
              curObject.geometries.push(geometry);
              curGeometry = geometry;
              continue;
            }
            if (curGeometry == null)
              continue;
            if (line.startsWith("f")) {
              let splits = line.substr(1).split(" ").map((v) => v.trim());
              let face = [];
              for (let split of splits) {
                if (split == "")
                  continue;
                let indices = split.split("/");
                let vertex = {};
                vertex.position = curObject.vertices[parseInt(indices[0]) - 1];
                vertex.texCoord = indices.length < 2 ? new Vec3(0, 0, 0) : curObject.texCoords[parseInt(indices[1]) - 1];
                vertex.normal = indices.length < 3 ? new Vec3(0, 0, 0) : curObject.normals[parseInt(indices[2]) - 1];
                if (vertex.position)
                  face.push(vertex);
              }
              curGeometry.faces.push(face);
              continue;
            }
          }
          return objects;
        }
        static makeModelBuilder(bytes) {
          let objects = _ObjLoader.load(bytes);
          let model = new ModelBuilder();
          for (let object of objects) {
            for (let geometry of object.geometries) {
              for (let face of geometry.faces) {
                if (face.length >= 3) {
                  model.addTri(face[0].position, face[1].position, face[2].position);
                  model.addTri(face[0].position, face[2].position, face[1].position);
                }
              }
            }
          }
          return model.calculateNormals();
        }
      };
      if (module)
        module.exports = { ObjLoader };
    }
  });

  // src/util/brresLoader.js
  var require_brresLoader = __commonJS({
    "src/util/brresLoader.js"(exports, module) {
      var { BinaryParser } = require_binaryParser();
      var { ModelBuilder } = require_modelBuilder();
      var { Vec3 } = require_vec3();
      var BrresLoader = class _BrresLoader {
        static load(bytes) {
          let parser = new BinaryParser(bytes);
          if (parser.readAsciiLength(4) != "bres")
            throw "brres: invalid magic number";
          let byteOrderMark = parser.readUInt16();
          if (byteOrderMark != 65279)
            throw "brres: unsupported endianness";
          parser.readUInt16();
          let fileLenInBytes = parser.readUInt32();
          let rootSectionOffset = parser.readUInt16();
          let sectionNum = parser.readUInt16();
          parser.seek(rootSectionOffset);
          let rootSection = _BrresLoader.readRootSection(parser);
          let sections = [];
          for (let i = 0; i < rootSection.folders.length; i++) {
            for (let j = 1; j < rootSection.folders[i].entries.length; j++) {
              parser.seek(rootSection.folders[i].addr + rootSection.folders[i].entries[j].dataOffset);
              let sectionHeader = _BrresLoader.readCommonSectionHeader(parser);
              sections.push(sectionHeader);
            }
          }
          let courseModelMDL0 = null;
          let debugStructure = "BRRES File\n";
          for (let i = 0; i < rootSection.folders.length; i++) {
            debugStructure += "\u2514 " + rootSection.root.entries[i + 1].name + "\n";
            for (let j = 1; j < rootSection.folders[i].entries.length; j++) {
              let entry = rootSection.folders[i].entries[j];
              debugStructure += "   \u2514 " + entry.name + " {" + entry.dataTag + "}\n";
              if (entry.name == "course" && entry.dataTag == "MDL0")
                courseModelMDL0 = entry;
            }
          }
          console.log(debugStructure);
          if (courseModelMDL0 == null)
            throw "No course model found! Make sure to have a `course` MDL0 entry in your BRRES data!";
          parser.seek(courseModelMDL0.offsetBase + courseModelMDL0.dataOffset);
          let mdl0 = _BrresLoader.readMdl0Section(parser);
          let model = new ModelBuilder();
          for (let polygon of mdl0.generatedPolygons) {
            for (let instr of polygon.instructions) {
              if (instr.kind == "DrawQuads") {
                for (let i = 0; i < instr.count; i += 4) {
                  let v0 = instr.vertices[i + 0];
                  let v1 = instr.vertices[i + 1];
                  let v2 = instr.vertices[i + 2];
                  let v3 = instr.vertices[i + 3];
                  if (v0 && v1 && v2 && v3 && v0.isFinite() && v1.isFinite() && v2.isFinite() && v3.isFinite())
                    model.addQuad(v0, v1, v2, v3);
                }
              } else if (instr.kind == "DrawTriangles") {
                for (let i = 0; i < instr.count; i += 3) {
                  let v0 = instr.vertices[i + 0];
                  let v1 = instr.vertices[i + 1];
                  let v2 = instr.vertices[i + 2];
                  if (v0 && v1 && v2 && v0.isFinite() && v1.isFinite() && v2.isFinite())
                    model.addTri(v0, v2, v1);
                }
              } else if (instr.kind == "DrawTriangleStrip") {
                let v0 = instr.vertices[0];
                let v1 = instr.vertices[1];
                let winding = false;
                for (let i = 2; i < instr.count; i += 1) {
                  let v2 = instr.vertices[i];
                  if (v0 && v1 && v2 && v0.isFinite() && v1.isFinite() && v2.isFinite())
                    if (winding)
                      model.addTri(v0, v1, v2);
                    else
                      model.addTri(v0, v2, v1);
                  v0 = v1;
                  v1 = v2;
                  winding = !winding;
                }
              } else if (instr.kind == "DrawTriangleFan") {
                let v0 = instr.vertices[0];
                let v1 = instr.vertices[1];
                for (let i = 2; i < instr.count; i += 1) {
                  let v2 = instr.vertices[i];
                  if (v0 && v1 && v2 && v0.isFinite() && v1.isFinite() && v2.isFinite())
                    model.addTri(v0, v2, v1);
                  v1 = v2;
                }
              }
            }
          }
          return model.calculateNormals();
        }
        static readRootSection(parser) {
          let addr = parser.head;
          let tag = parser.readAsciiLength(4);
          if (tag != "root")
            throw "brres: invalid root section magic number";
          let len = parser.readInt32();
          let root = _BrresLoader.readIndexGroup(parser);
          let folders = [];
          for (let i = 1; i < root.entries.length; i++) {
            parser.seek(root.addr + root.entries[i].dataOffset);
            folders.push(_BrresLoader.readIndexGroup(parser));
          }
          return { addr, tag, len, root, folders };
        }
        static readIndexGroup(parser) {
          let addr = parser.head;
          let len = parser.readInt32();
          let entryNum = parser.readInt32();
          let entries = [];
          for (let i = 0; i <= entryNum; i++) {
            let entry = _BrresLoader.readIndexEntry(parser);
            entry.offsetBase = addr;
            entry.nameLen = 0;
            entry.name = null;
            entry.dataTag = null;
            entries.push(entry);
          }
          for (let i = 1; i < entries.length; i++) {
            parser.seek(addr + entries[i].nameOffset - 4);
            entries[i].nameLen = parser.readUInt32();
            entries[i].name = parser.readAsciiLength(entries[i].nameLen);
            if (entries[i].dataOffset != 0) {
              parser.seek(addr + entries[i].dataOffset);
              entries[i].dataTag = parser.readAsciiLength(4);
            }
          }
          parser.seek(addr + 8 + entries.length * 16);
          return { addr, len, entries };
        }
        static readIndexEntry(parser) {
          let addr = parser.head;
          let id = parser.readUInt16();
          parser.readUInt16();
          let left = parser.readUInt16();
          let right = parser.readUInt16();
          let nameOffset = parser.readInt32();
          let dataOffset = parser.readInt32();
          return { addr, id, left, right, nameOffset, dataOffset };
        }
        static readCommonSectionHeader(parser) {
          let addr = parser.head;
          let tag = parser.readAsciiLength(4);
          let len = parser.readInt32();
          let version = parser.readInt32();
          let offset = parser.readInt32();
          return { addr, tag, len, version, offset };
        }
        static readMdl0Section(parser) {
          let addr = parser.head;
          if (parser.readAsciiLength(4) != "MDL0")
            throw "brres: invalid MDL0 magic number";
          let len = parser.readUInt32();
          let version = parser.readUInt32();
          if (version != 11)
            throw "brres: unsupported MDL0 version";
          let parentOffset = parser.readInt32();
          let sectionOffsets = [];
          for (let i = 0; i < 14; i++)
            sectionOffsets.push(parser.readInt32());
          let nameOffset = parser.readInt32();
          let header = _BrresLoader.readMdl0Header(parser);
          let sections = [];
          for (let i = 0; i < sectionOffsets.length; i++) {
            if (sectionOffsets[i] != 0) {
              parser.seek(addr + sectionOffsets[i]);
              sections.push(_BrresLoader.readIndexGroup(parser));
            } else
              sections.push(null);
          }
          let vertexGroups = [];
          if (sections[2] != null) {
            for (let i = 1; i < sections[2].entries.length; i++) {
              parser.seek(sections[2].addr + sections[2].entries[i].dataOffset);
              vertexGroups.push(_BrresLoader.readMdl0VertexGroup(parser));
            }
          }
          let polygons = [];
          if (sections[10] != null) {
            for (let i = 1; i < sections[10].entries.length; i++) {
              parser.seek(sections[10].addr + sections[10].entries[i].dataOffset);
              let polygon = _BrresLoader.readMdl0Polygon(parser);
              for (let vertexGroup of vertexGroups) {
                if (vertexGroup.index == polygon.vertexGroupIndex)
                  polygon.vertexGroup = vertexGroup;
              }
              polygons.push(polygon);
            }
          }
          let generatedPolygons = [];
          for (let polygon of polygons)
            generatedPolygons.push(_BrresLoader.generatePolygon(null, polygon));
          return { generatedPolygons };
        }
        static readMdl0Header(parser) {
          let addr = parser.head;
          let len = parser.readInt32();
          let mdl0Offset = parser.readInt32();
          parser.readInt32();
          parser.readInt32();
          let vertexCount = parser.readInt32();
          let faceCount = parser.readInt32();
          parser.readInt32();
          let boneCount = parser.readInt32();
          parser.readInt32();
          let boneTableOffset = parser.readInt32();
          parser.readFloat32();
          parser.readFloat32();
          parser.readFloat32();
          parser.readFloat32();
          parser.readFloat32();
          parser.readFloat32();
          return { addr, len, mdl0Offset, vertexCount, faceCount, boneCount, boneTableOffset };
        }
        static readMdl0VertexGroup(parser) {
          let addr = parser.head;
          let len = parser.readInt32();
          let mdl0Offset = parser.readInt32();
          let dataOffset = parser.readInt32();
          let nameOffset = parser.readInt32();
          let index = parser.readInt32();
          parser.readUInt32();
          let type = parser.readInt32();
          let divisor = Math.pow(2, parser.readByte());
          let stride = parser.readByte();
          let vertexCount = parser.readInt16();
          parser.readFloat32();
          parser.readFloat32();
          parser.readFloat32();
          parser.readFloat32();
          parser.readFloat32();
          parser.readFloat32();
          parser.seek(addr + dataOffset);
          let vertices = [];
          for (let i = 0; i < vertexCount; i++) {
            let x = 0;
            let y = 0;
            let z = 0;
            switch (type) {
              case 0:
                x = parser.readByte() / divisor;
                y = parser.readByte() / divisor;
                z = parser.readByte() / divisor;
                break;
              case 1:
                x = parser.readSByte() / divisor;
                y = parser.readSByte() / divisor;
                z = parser.readSByte() / divisor;
                break;
              case 2:
                x = parser.readUInt16() / divisor;
                y = parser.readUInt16() / divisor;
                z = parser.readUInt16() / divisor;
                break;
              case 3:
                x = parser.readInt16() / divisor;
                y = parser.readInt16() / divisor;
                z = parser.readInt16() / divisor;
                break;
              case 4:
                x = parser.readFloat32();
                y = parser.readFloat32();
                z = parser.readFloat32();
                break;
              default:
                throw "brres: mdl0 invalid vertex group type";
            }
            let vec = new Vec3(x, -z, -y);
            vec.index = i;
            vertices.push(vec);
          }
          return { addr, len, mdl0Offset, dataOffset, nameOffset, index, type, divisor, stride, vertexCount, vertices };
        }
        static readMdl0Polygon(parser) {
          let addr = parser.head;
          let len = parser.readInt32();
          let mdl0Offset = parser.readInt32();
          let boneIndex = parser.readInt32();
          parser.readInt32();
          parser.readInt32();
          parser.readInt32();
          let sections = [];
          for (let i = 0; i < 2; i++) {
            let sectionAddr = parser.head;
            let size = parser.readInt32();
            let size2 = parser.readInt32();
            let offset = parser.readInt32();
            sections.push({ addr: sectionAddr, size, size2, offset });
          }
          parser.readInt32();
          parser.readInt32();
          let nameOffset = parser.readInt32();
          let index = parser.readInt32();
          let vertexCount = parser.readInt32();
          let faceCount = parser.readInt32();
          let vertexGroupIndex = parser.readInt16();
          let normalGroupIndex = parser.readInt16();
          let colorGroupIndices = [parser.readInt16(), parser.readInt16()];
          let texCoordGroupIndices = [];
          for (let i = 0; i < 8; i++)
            texCoordGroupIndices.push(parser.readInt16());
          parser.readInt32();
          let boneTableOffset = parser.readInt32();
          parser.seek(sections[0].addr + sections[0].offset);
          let vertexDefinitions = parser.readBytes(sections[0].size);
          parser.seek(sections[1].addr + sections[1].offset);
          let vertexData = parser.readBytes(sections[1].size);
          return {
            addr,
            len,
            mdl0Offset,
            boneIndex,
            sections,
            nameOffset,
            index,
            vertexCount,
            faceCount,
            vertexGroupIndex,
            normalGroupIndex,
            colorGroupIndices,
            texCoordGroupIndices,
            boneTableOffset,
            vertexDefinitions,
            vertexData,
            vertexGroup: null
          };
        }
        static generatePolygon(mdl0, polygon) {
          let parser = new BinaryParser(polygon.vertexData);
          let vertexDescription = _BrresLoader.readVertexDescription(polygon.vertexDefinitions);
          let instructions = [];
          end: while (parser.head < polygon.vertexData.length) {
            let opcode = parser.readByte();
            let count = 0;
            let instr = { kind: null };
            switch (opcode & 248) {
              case 0:
                break;
              case 32:
                console.error("brres: unimplemented SetMatrix instruction");
                parser.readUInt16();
                parser.readInt16();
                break;
              case 40:
              case 48:
              case 56:
                parser.readInt32();
                break;
              case 128:
                instr.kind = "DrawQuads";
                instr.count = parser.readUInt16();
                instr.vertices = _BrresLoader.readVertices(parser, polygon, vertexDescription, instr.count);
                break;
              case 144:
                instr.kind = "DrawTriangles";
                instr.count = parser.readUInt16();
                instr.vertices = _BrresLoader.readVertices(parser, polygon, vertexDescription, instr.count);
                break;
              case 152:
                instr.kind = "DrawTriangleStrip";
                instr.count = parser.readUInt16();
                instr.vertices = _BrresLoader.readVertices(parser, polygon, vertexDescription, instr.count);
                break;
              case 160:
                instr.kind = "DrawTriangleFan";
                instr.count = parser.readUInt16();
                instr.vertices = _BrresLoader.readVertices(parser, polygon, vertexDescription, instr.count);
                break;
              case 168:
                instr.kind = "DrawLines";
                instr.count = parser.readUInt16();
                instr.vertices = _BrresLoader.readVertices(parser, polygon, vertexDescription, instr.count);
                break;
              case 176:
                instr.kind = "DrawLineStrip";
                instr.count = parser.readUInt16();
                instr.vertices = _BrresLoader.readVertices(parser, polygon, vertexDescription, instr.count);
                break;
              case 184:
                instr.kind = "DrawPoints";
                instr.count = parser.readUInt16();
                instr.vertices = _BrresLoader.readVertices(parser, polygon, vertexDescription, instr.count);
                break;
              default:
                break end;
            }
            if (instr.kind != null)
              instructions.push(instr);
          }
          return { vertexDescription, instructions };
        }
        static readVertexDescription(bytes) {
          let parser = new BinaryParser(bytes);
          let byteDequant = 0;
          let normalIndex3 = 0;
          let matrix = {
            pos: false,
            norm: false,
            colfalse: false,
            col1: false,
            texfalse: false,
            tex1: false,
            tex2: false,
            tex3: false,
            tex4: false,
            tex5: false,
            tex6: false,
            tex7: false
          };
          let presence = {
            pos: 0,
            norm: 0,
            col0: 0,
            col1: 0,
            tex0: 0,
            tex1: 0,
            tex2: 0,
            tex3: 0,
            tex4: 0,
            tex5: 0,
            tex6: 0,
            tex7: 0
          };
          let fields = {
            pos: 0,
            norm: 0,
            col0: 0,
            col1: 0,
            tex0: 0,
            tex1: 0,
            tex2: 0,
            tex3: 0,
            tex4: 0,
            tex5: 0,
            tex6: 0,
            tex7: 0
          };
          let format = {
            pos: 0,
            norm: 0,
            col0: 0,
            col1: 0,
            tex0: 0,
            tex1: 0,
            tex2: 0,
            tex3: 0,
            tex4: 0,
            tex5: 0,
            tex6: 0,
            tex7: 0
          };
          let scale = {
            pos: 0,
            norm: 0,
            col0: 0,
            col1: 0,
            tex0: 0,
            tex1: 0,
            tex2: 0,
            tex3: 0,
            tex4: 0,
            tex5: 0,
            tex6: 0,
            tex7: 0
          };
          let colorCount = 0;
          let normalCount = 0;
          let textureCount = 0;
          end: while (parser.head < bytes.length) {
            let opcode = parser.readByte();
            let current = 0;
            switch (opcode) {
              case 0:
                break;
              case 8: {
                let opcode2 = parser.readByte();
                switch (opcode2 & 240) {
                  case 80:
                    parser.readByte();
                    current = parser.readByte();
                    presence.col1 = current << 1 & 2;
                    current = parser.readByte();
                    presence.col1 |= current >> 7 & 1;
                    presence.col0 = current >> 5 & 3;
                    presence.norm = current >> 3 & 3;
                    presence.pos = current >> 1 & 3;
                    matrix.tex7 = (current & 1) > 0;
                    current = parser.readByte();
                    matrix.tex6 = (current & 128) > 0;
                    matrix.tex5 = (current & 64) > 0;
                    matrix.tex4 = (current & 32) > 0;
                    matrix.tex3 = (current & 16) > 0;
                    matrix.tex2 = (current & 8) > 0;
                    matrix.tex1 = (current & 4) > 0;
                    matrix.tex0 = (current & 2) > 0;
                    matrix.pos = (current & 1) > 0;
                    break;
                  case 96:
                    parser.readByte();
                    parser.readByte();
                    current = parser.readByte();
                    presence.tex7 = current >> 6 & 3;
                    presence.tex6 = current >> 4 & 3;
                    presence.tex5 = current >> 2 & 3;
                    presence.tex4 = current >> 0 & 3;
                    current = parser.readByte();
                    presence.tex3 = current >> 6 & 3;
                    presence.tex2 = current >> 4 & 3;
                    presence.tex1 = current >> 2 & 3;
                    presence.tex0 = current >> 0 & 3;
                    break;
                  case 112:
                    current = parser.readByte();
                    normalIndex3 = (current & 128) > 0;
                    byteDequant = (current & 64) > 0;
                    scale.tex0 = current >> 1 & 31;
                    format.tex0 = current << 2 & 4;
                    current = parser.readByte();
                    format.tex0 |= current >> 6 & 3;
                    fields.tex0 = (current & 32) > 0 ? 2 : 1;
                    format.col1 = current >> 2 & 7;
                    fields.col1 = (current & 2) > 0 ? 4 : 3;
                    format.col0 = current << 2 & 4;
                    current = parser.readByte();
                    format.col0 |= current >> 6 & 3;
                    fields.col0 = (current & 32) > 0 ? 4 : 3;
                    format.norm = current >> 2 & 7;
                    fields.norm = (current & 2) > 0 ? 3 : 1;
                    scale.pos = (current << 4 & 16) + ((current = parser.readByte()) >> 4 & 15);
                    format.pos = current >> 1 & 7;
                    fields.pos = (current & 1) > 0 ? 3 : 2;
                    break;
                  case 128:
                    current = parser.readByte();
                    format.tex4 = current >> 4 & 3;
                    fields.tex4 = (current & 8) > 0 ? 2 : 1;
                    scale.tex3 = (current << 2 & 28) + ((current = parser.readByte()) >> 6 & 3);
                    format.tex3 = current >> 3 & 3;
                    fields.tex3 = (current & 4) > 0 ? 2 : 1;
                    scale.tex2 = (current << 3 & 24) + ((current = parser.readByte()) >> 5 & 7);
                    format.tex2 = current >> 2 & 3;
                    fields.tex2 = (current & 2) > 0 ? 2 : 1;
                    scale.tex1 = (current << 4 & 16) + ((current = parser.readByte()) >> 4 & 15);
                    format.tex1 = current >> 1 & 3;
                    fields.tex1 = (current & 1) > 0 ? 2 : 1;
                    break;
                  case 144:
                    current = parser.readByte();
                    scale.tex7 = current >> 3 & 31;
                    format.tex7 = current >> 0 & 3;
                    current = parser.readByte();
                    fields.tex7 = (current & 128) > 0 ? 2 : 1;
                    scale.tex6 = current >> 2 & 31;
                    format.tex6 = current << 1 & 2;
                    current = parser.readByte();
                    format.tex6 |= current >> 7 & 1;
                    fields.tex6 = (current & 64) > 0 ? 2 : 1;
                    scale.tex5 = current >> 1 & 31;
                    current = parser.readByte();
                    format.tex5 |= current >> 6 & 3;
                    fields.tex5 = (current & 32) > 0 ? 2 : 1;
                    scale.tex4 = current >> 0 & 31;
                    break;
                  default:
                    parser.readByte();
                    parser.readByte();
                    parser.readByte();
                    parser.readByte();
                    break;
                }
                break;
              }
              case 16:
                parser.readByte();
                current = parser.readByte();
                switch (parser.readInt16()) {
                  case 2064:
                    parser.readByte();
                    parser.readByte();
                    parser.readByte();
                    parser.readByte();
                    current = parser.readByte();
                    textureCount = current >> 4 & 15;
                    normalCount = current >> 2 & 3;
                    colorCount = current >> 0 & 3;
                    break;
                  default:
                    for (let i = 0; i < 1 + 4 * ((current & 15) + 1); i++)
                      parser.readByte();
                    break;
                }
                break;
              default:
                break end;
            }
          }
          return { matrix, presence, fields, format, scale, colorCount, normalCount, textureCount };
        }
        static readVertices(parser, polygon, descr, count) {
          let vertices = [];
          for (let i = 0; i < count; i++) {
            if (descr.matrix.pos || descr.matrix.tex0 || descr.matrix.tex1 || descr.matrix.tex2 || descr.matrix.tex3 || descr.matrix.tex4 || descr.matrix.tex5 || descr.matrix.tex6 || descr.matrix.tex7)
              throw "brres: mdl0 unsupported vertex description matrix";
            switch (descr.presence.pos) {
              case 0:
                break;
              case 1:
                throw "brres: mdl0 unsupported direct vertex presence";
              case 2:
                vertices.push(polygon.vertexGroup.vertices[parser.readByte()]);
                break;
              case 3:
                vertices.push(polygon.vertexGroup.vertices[parser.readUInt16()]);
                break;
            }
            switch (descr.presence.norm) {
              case 0:
                break;
              case 1:
                throw "brres: mdl0 unsupported direct normal presence";
              case 2:
                parser.readByte();
                break;
              case 3:
                parser.readUInt16();
                break;
            }
            switch (descr.presence.col0) {
              case 0:
                break;
              case 1:
                throw "brres: mdl0 unsupported direct col0 presence";
              case 2:
                parser.readByte();
                break;
              case 3:
                parser.readUInt16();
                break;
            }
            switch (descr.presence.col1) {
              case 0:
                break;
              case 1:
                throw "brres: mdl0 unsupported direct col1 presence";
              case 2:
                parser.readByte();
                break;
              case 3:
                parser.readUInt16();
                break;
            }
            switch (descr.presence.tex0) {
              case 0:
                break;
              case 1:
                throw "brres: mdl0 unsupported direct tex0 presence";
              case 2:
                parser.readByte();
                break;
              case 3:
                parser.readUInt16();
                break;
            }
            switch (descr.presence.tex1) {
              case 0:
                break;
              case 1:
                throw "brres: mdl0 unsupported direct tex1 presence";
              case 2:
                parser.readByte();
                break;
              case 3:
                parser.readUInt16();
                break;
            }
            switch (descr.presence.tex2) {
              case 0:
                break;
              case 1:
                throw "brres: mdl0 unsupported direct tex2 presence";
              case 2:
                parser.readByte();
                break;
              case 3:
                parser.readUInt16();
                break;
            }
            switch (descr.presence.tex3) {
              case 0:
                break;
              case 1:
                throw "brres: mdl0 unsupported direct tex3 presence";
              case 2:
                parser.readByte();
                break;
              case 3:
                parser.readUInt16();
                break;
            }
            switch (descr.presence.tex4) {
              case 0:
                break;
              case 1:
                throw "brres: mdl0 unsupported direct tex4 presence";
              case 2:
                parser.readByte();
                break;
              case 3:
                parser.readUInt16();
                break;
            }
            switch (descr.presence.tex5) {
              case 0:
                break;
              case 1:
                throw "brres: mdl0 unsupported direct tex5 presence";
              case 2:
                parser.readByte();
                break;
              case 3:
                parser.readUInt16();
                break;
            }
            switch (descr.presence.tex6) {
              case 0:
                break;
              case 1:
                throw "brres: mdl0 unsupported direct tex6 presence";
              case 2:
                parser.readByte();
                break;
              case 3:
                parser.readUInt16();
                break;
            }
            switch (descr.presence.tex7) {
              case 0:
                break;
              case 1:
                throw "brres: mdl0 unsupported direct tex7 presence";
              case 2:
                parser.readByte();
                break;
              case 3:
                parser.readUInt16();
                break;
            }
          }
          return vertices;
        }
      };
      if (module)
        module.exports = { BrresLoader };
    }
  });

  // src/mainWindowWeb.js
  var require_mainWindowWeb = __commonJS({
    "src/mainWindowWeb.js"(exports, module) {
      var { Viewer } = require_viewer();
      var { ModelBuilder } = require_modelBuilder();
      var { KmpData } = require_kmpData();
      var { KclLoader, collisionTypeData } = require_kclLoader();
      var gMainWindow = null;
      var APP_VERSION = true ? "0.7.7" : "web";
      function main() {
        gMainWindow = new MainWindow();
      }
      function isMacPlatform() {
        return /Mac|iPhone|iPad|iPod/i.test(window.navigator.platform);
      }
      function normalizeFilename(str) {
        if (str == null)
          return null;
        return str.replace(new RegExp("\\\\", "g"), "/");
      }
      function getExtension(filename) {
        if (filename == null)
          return "";
        const i = filename.lastIndexOf(".");
        if (i < 0)
          return "";
        return filename.substring(i).toLowerCase();
      }
      var MainWindow = class {
        constructor() {
          this.currentKmpFileHandle = null;
          this.currentDirectoryHandle = null;
          this.currentKclFileHandle = null;
          this.currentKclBytes = null;
          this.currentModelFileHandle = null;
          document.body.onresize = () => this.onResize();
          window.addEventListener("beforeunload", (ev) => this.onClose(ev));
          this.bindToolbar();
          document.body.onkeydown = (ev) => {
            const isMod = ev.ctrlKey || ev.metaKey;
            const key = ev.key.toLowerCase();
            if (!isMod)
              return;
            if (key === "z") {
              ev.preventDefault();
              ev.stopPropagation();
              if (ev.shiftKey)
                this.redo();
              else
                this.undo();
              return;
            }
            if (key === "y") {
              ev.preventDefault();
              ev.stopPropagation();
              this.redo();
              return;
            }
            if (key === "n") {
              ev.preventDefault();
              ev.stopPropagation();
              void this.newKmp();
              return;
            }
            if (key === "o") {
              ev.preventDefault();
              ev.stopPropagation();
              void this.askOpenKmp();
              return;
            }
            if (key === "s") {
              ev.preventDefault();
              ev.stopPropagation();
              if (ev.shiftKey)
                void this.saveKmpAs();
              else
                void this.saveKmp(this.currentKmpFilename);
            }
          };
          this.noModelLoaded = true;
          this.cfg = {
            isBattleTrack: false,
            useOrthoProjection: false,
            pointScale: 1,
            shadingFactor: 0.3,
            fogFactor: 25e-7,
            kclEnableModel: true,
            kclEnableColors: true,
            kclEnableWalls: true,
            kclEnableDeathBarriers: true,
            kclEnableInvisible: true,
            kclEnableItemRoad: false,
            kclEnableEffects: false,
            kclHighlighter: 0,
            kclTriIndex: [-1, -1],
            enableRotationRender: true,
            startPointsEnableZoneRender: true,
            enemyPathsEnableSizeRender: true,
            checkpointsEnableVerticalPanels: true,
            checkpointsEnableRespawnPointLinks: true,
            checkpointsEnableDirectionArrows: true,
            respawnsEnablePlayerSlots: true,
            objectsEnableSignedSettings: false,
            cannonsEnableDirectionRender: false,
            cannonsEnableKclHighlight: true,
            snapToCollision: true,
            lockAxisX: false,
            lockAxisY: false,
            lockAxisZ: false,
            unlockAxes() {
              this.lockAxisX = false;
              this.lockAxisY = false;
              this.lockAxisZ = false;
            }
          };
          this.hl = {
            baseType: -1,
            basicEffect: -1,
            blightEffect: -1,
            intensity: -1,
            collisionEffect: -1
          };
          this.hl.reset = () => {
            this.hl.baseType = -1, this.hl.basicEffect = -1, this.hl.blightEffect = -1, this.hl.intensity = -1, this.hl.collisionEffect = -1;
          };
          this.currentKmpFilename = null;
          this.currentKclFilename = null;
          this.currentKmpData = new KmpData();
          this.currentNotSaved = false;
          this.undoNeedsNewSlot = false;
          this.undoStack = [];
          this.undoPointer = -1;
          this.savedUndoSlot = -1;
          this.panels = [];
          this.refreshTitle();
          this.sidePanelDiv = document.getElementById("divSidePanel");
          this.viewer = new Viewer(this, document.getElementById("canvasMain"), this.cfg, this.currentKmpData);
          this.refreshPanels();
          void this.newKmp(false);
        }
        onResize() {
          this.viewer.resize();
          this.viewer.render();
        }
        onReload() {
          window.location.reload();
        }
        onClose(ev) {
          if (!this.currentNotSaved)
            return;
          ev.preventDefault();
          ev.returnValue = "";
        }
        openExternalLink(link) {
          window.open(link, "_blank", "noopener,noreferrer");
        }
        bindToolbar() {
          const byId = (id) => document.getElementById(id);
          const bind = (id, fn) => {
            const button = byId(id);
            if (button != null)
              button.onclick = () => {
                void fn();
              };
          };
          bind("btnNewKmp", () => this.newKmp());
          bind("btnOpenKmp", () => this.askOpenKmp());
          bind("btnOpenTrackFolder", () => this.askOpenTrackFolder());
          bind("btnSaveKmp", () => this.saveKmp(this.currentKmpFilename));
          bind("btnSaveKmpAs", () => this.saveKmpAs());
          bind("btnOpenModel", () => this.openCustomModel());
          bind("btnUndo", () => {
            this.undo();
            return Promise.resolve();
          });
          bind("btnRedo", () => {
            this.redo();
            return Promise.resolve();
          });
        }
        async pickSingleFileFromInput(accept, directory = false) {
          return await new Promise((resolve) => {
            const input = document.createElement("input");
            input.type = "file";
            input.style.display = "none";
            input.accept = accept;
            if (directory) {
              input.setAttribute("webkitdirectory", "");
              input.setAttribute("directory", "");
            }
            input.onchange = () => {
              const files = input.files;
              if (directory)
                resolve(files);
              else if (files != null && files.length > 0)
                resolve(files[0]);
              else
                resolve(null);
              input.remove();
            };
            document.body.appendChild(input);
            input.click();
          });
        }
        async pickFileHandle(options) {
          if (window.showOpenFilePicker == null)
            return null;
          try {
            const handles = await window.showOpenFilePicker(options);
            if (handles != null && handles.length > 0)
              return handles[0];
          } catch (e) {
            if (e.name !== "AbortError")
              console.error(e);
          }
          return null;
        }
        async pickDirectoryHandle() {
          if (window.showDirectoryPicker == null)
            return null;
          try {
            return await window.showDirectoryPicker();
          } catch (e) {
            if (e.name !== "AbortError")
              console.error(e);
          }
          return null;
        }
        async readHandleBytes(fileHandle) {
          const file = await fileHandle.getFile();
          return new Uint8Array(await file.arrayBuffer());
        }
        async readFileBytesFromDirectory(directoryHandle, filename) {
          try {
            const fileHandle = await directoryHandle.getFileHandle(filename);
            return {
              filename,
              fileHandle,
              bytes: await this.readHandleBytes(fileHandle)
            };
          } catch (e) {
            return null;
          }
        }
        buildKmpFileTypeFilter() {
          return {
            description: "KMP Files (*.kmp)",
            accept: { "application/octet-stream": [".kmp"] }
          };
        }
        buildModelFileTypeFilter() {
          return {
            description: "Supported model formats (*.obj, *.brres, *.kcl)",
            accept: { "application/octet-stream": [".obj", ".brres", ".kcl"] }
          };
        }
        getKmpDownloadName() {
          return this.currentKmpFilename == null ? "course.kmp" : this.currentKmpFilename;
        }
        downloadBytes(bytes, filename) {
          const blob = new Blob([new Uint8Array(bytes)], { type: "application/octet-stream" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }
        refreshPanels() {
          let panel = this.addPanel("Model");
          panel.addText(null, "<strong>Hold Right Mouse:</strong> Look Around");
          panel.addText(null, "<strong>Hold Right Mouse + WASDQE:</strong> Move Camera");
          panel.addText(null, "<strong>Middle Mouse:</strong> Rotate Camera");
          panel.addText(null, "<strong>Hold Shift + Middle Mouse:</strong> Pan Camera");
          panel.addText(null, "<strong>Mouse Wheel:</strong> Zoom");
          panel.addText(null, "<strong>Double Right Click:</strong> Focus Camera");
          panel.addSpacer(null);
          panel.addButton(null, "Load KMP", () => this.askOpenKmp());
          panel.addButton(null, "Load Track Folder", () => this.askOpenTrackFolder());
          panel.addButton(null, "Load Model", () => this.openCustomModel());
          panel.addButton(null, "(5) Toggle Projection", () => this.cfg.useOrthoProjection = !this.cfg.useOrthoProjection);
          panel.addButton(null, "Center view", () => this.viewer.centerView());
          panel.addSlider(null, "Shading", 0, 1, this.cfg.shadingFactor, 0.05, (x) => this.cfg.shadingFactor = x);
          panel.addSlider(null, "Fog", 1e-7, 2e-4, this.cfg.fogFactor, 1e-7, (x) => this.cfg.fogFactor = x);
          panel.addSlider(null, "Point Scale", 0.1, 5, this.cfg.pointScale, 0.1, (x) => this.cfg.pointScale = x);
          panel.addSpacer(null);
          let kclGroup = panel.addGroup(null, "Collision data:");
          panel.addCheckbox(kclGroup, "Use colors", this.cfg.kclEnableColors, (x) => {
            this.cfg.kclEnableColors = x;
            this.reloadCurrentKcl();
          });
          panel.addCheckbox(kclGroup, "Show walls", this.cfg.kclEnableWalls, (x) => {
            this.cfg.kclEnableWalls = x;
            this.reloadCurrentKcl();
          });
          panel.addCheckbox(kclGroup, "Show death barriers", this.cfg.kclEnableDeathBarriers, (x) => {
            this.cfg.kclEnableDeathBarriers = x;
            this.reloadCurrentKcl();
          });
          panel.addCheckbox(kclGroup, "Show invisible walls", this.cfg.kclEnableInvisible, (x) => {
            this.cfg.kclEnableInvisible = x;
            this.reloadCurrentKcl();
          });
          panel.addCheckbox(kclGroup, "Show item road/wall", this.cfg.kclEnableItemRoad, (x) => {
            this.cfg.kclEnableItemRoad = x;
            this.reloadCurrentKcl();
          });
          panel.addCheckbox(kclGroup, "Show effects/triggers", this.cfg.kclEnableEffects, (x) => {
            this.cfg.kclEnableEffects = x;
            this.reloadCurrentKcl();
          });
          panel.addSpacer(kclGroup);
          let hlOptions = [
            { str: "None", value: 0 },
            { str: "Trickable Road", value: 1 },
            { str: "Horizontal Walls", value: 2 },
            { str: "Barrel Roll Walls", value: 3 },
            { str: "Custom Flag", value: 4 },
            { str: "Triangle Index", value: 5 },
            { str: "Sloped Walls", value: 6 }
          ];
          panel.addSelectionDropdown(kclGroup, "Highlight", this.cfg.kclHighlighter, hlOptions, true, false, (x) => {
            this.cfg.kclHighlighter = x;
            this.refreshPanels();
          });
          const onBlur = (x) => {
            this.reloadCurrentKcl();
            this.viewer.render();
            return x;
          };
          if (this.cfg.kclHighlighter === 4) {
            let flagOptions = [{ str: "None", value: -1 }];
            for (let i = 0; i <= 31; i++)
              flagOptions.push({ str: "(0x" + i.toString(16) + ") " + collisionTypeData[i].name, value: i });
            panel.addSelectionDropdown(kclGroup, "Base Type", this.hl.baseType, flagOptions, true, false, (x, i) => {
              this.hl.baseType = x;
              onBlur(null);
            });
            panel.addSelectionNumericInput(kclGroup, "Variant", -1, 7, this.hl.basicEffect, 1, 0, true, false, (x) => {
              this.hl.basicEffect = x;
            }, onBlur);
            panel.addSelectionNumericInput(kclGroup, "BLIGHT Index", -1, 7, this.hl.blightEffect, 1, 0, true, false, (x) => {
              this.hl.blightEffect = x;
            }, onBlur);
            panel.addSelectionNumericInput(kclGroup, "Wheel Depth", -1, 3, this.hl.intensity, 1, 0, true, false, (x) => {
              this.hl.intensity = x;
            }, onBlur);
            panel.addSelectionNumericInput(kclGroup, "Collision Effect", -1, 7, this.hl.collisionEffect, 1, 0, true, false, (x) => {
              this.hl.collisionEffect = x;
            }, onBlur);
          } else if (this.cfg.kclHighlighter === 5) {
            panel.addSelectionNumericInput(kclGroup, "Tri Index Min", -1, 65535, this.cfg.kclTriIndex[0], 1, 1, true, false, (x) => {
              this.cfg.kclTriIndex[0] = x;
            }, onBlur);
            panel.addSelectionNumericInput(kclGroup, "Tri Index Max", -1, 65535, this.cfg.kclTriIndex[1], 1, 1, true, false, (x) => {
              this.cfg.kclTriIndex[1] = x;
            }, onBlur);
          } else {
            this.hl.reset();
            this.reloadCurrentKcl();
          }
          panel.addSpacer(null);
          let moveGroup = panel.addGroup(null, "Movement:");
          panel.addCheckbox(moveGroup, "Snap to collision", this.cfg.snapToCollision, (x) => {
            this.cfg.snapToCollision = x;
            if (x) this.cfg.unlockAxes();
            this.refreshPanels();
          });
          panel.addCheckbox(moveGroup, "Lock X axis", this.cfg.lockAxisX, (x) => {
            this.cfg.lockAxisX = x;
            if (x) this.cfg.snapToCollision = false;
            this.refreshPanels();
          });
          panel.addCheckbox(moveGroup, "Lock Y axis", this.cfg.lockAxisY, (x) => {
            this.cfg.lockAxisY = x;
            if (x) this.cfg.snapToCollision = false;
            this.refreshPanels();
          });
          panel.addCheckbox(moveGroup, "Lock Z axis", this.cfg.lockAxisZ, (x) => {
            this.cfg.lockAxisZ = x;
            if (x) this.cfg.snapToCollision = false;
            this.refreshPanels();
          });
          this.refreshTitle();
          this.viewer.refreshPanels();
        }
        refreshTitle() {
          const title = (this.currentKmpFilename == null ? "[New File]" : "[" + this.currentKmpFilename + "]") + (this.currentNotSaved ? "*" : "") + " -- Lorenzi's KMP Editor v" + APP_VERSION;
          document.title = title;
          const status = document.getElementById("lblFileStatus");
          if (status != null)
            status.textContent = (this.currentKmpFilename == null ? "New File" : this.currentKmpFilename) + (this.currentNotSaved ? " *" : "");
        }
        addPanel(name, open = true, onToggle = null, closable = false) {
          let panel = this.panels.find((p) => p.name == name);
          if (panel != null) {
            panel.clearContent();
            return panel;
          }
          panel = new Panel(this, this.sidePanelDiv, name, open, onToggle, closable, () => {
            this.viewer.render();
          });
          this.panels.push(panel);
          return panel;
        }
        setNotSaved() {
          this.undoNeedsNewSlot = true;
          if (!this.currentNotSaved) {
            this.currentNotSaved = true;
            this.refreshTitle();
          }
        }
        setUndoPoint() {
          if (!this.undoNeedsNewSlot) {
            this.undoStack[this.undoPointer].subviewer = this.viewer.currentSubviewer;
            return;
          }
          this.undoStack.splice(this.undoPointer + 1, this.undoStack.length - this.undoPointer - 1);
          this.undoStack.push({
            data: this.currentKmpData.clone(),
            subviewer: this.viewer.currentSubviewer,
            currentRouteIndex: this.viewer.subviewerRoutes.currentRouteIndex
          });
          this.undoPointer += 1;
          this.undoNeedsNewSlot = false;
          this.currentKmpData.refreshIndices(this.cfg.isBattleTrack);
        }
        resetUndoStack() {
          this.undoNeedsNewSlot = true;
          this.undoStack = [];
          this.undoPointer = -1;
          this.currentKmpData.refreshIndices(this.cfg.isBattleTrack);
        }
        undo() {
          if (this.undoPointer <= 0)
            return;
          this.setUndoPoint();
          this.undoPointer -= 1;
          this.currentKmpData = this.undoStack[this.undoPointer].data.clone();
          this.currentKmpData.refreshIndices(this.cfg.isBattleTrack);
          this.viewer.setSubviewer(this.undoStack[this.undoPointer].subviewer);
          this.viewer.subviewerRoutes.currentRouteIndex = this.undoStack[this.undoPointer].currentRouteIndex;
          this.setNotSaved();
          this.undoNeedsNewSlot = false;
          this.viewer.setData(this.currentKmpData);
          this.viewer.render();
          this.refreshPanels();
        }
        redo() {
          if (this.undoPointer >= this.undoStack.length - 1)
            return;
          this.undoPointer += 1;
          this.currentKmpData = this.undoStack[this.undoPointer].data.clone();
          this.viewer.setSubviewer(this.undoStack[this.undoPointer].subviewer);
          this.viewer.subviewerRoutes.currentRouteIndex = this.undoStack[this.undoPointer].currentRouteIndex;
          this.setNotSaved();
          this.undoNeedsNewSlot = false;
          this.viewer.setData(this.currentKmpData);
          this.viewer.render();
          this.refreshPanels();
        }
        async askSaveChanges() {
          if (!this.currentNotSaved)
            return true;
          if (window.confirm("Save current changes?\n\nOK = Save\nCancel = more options"))
            return await this.saveKmp(this.currentKmpFilename);
          if (window.confirm("Discard unsaved changes?\n\nOK = Don't Save\nCancel = Keep Editing"))
            return true;
          return false;
        }
        async newKmp(checkSavePrompt = true) {
          if (checkSavePrompt && !await this.askSaveChanges())
            return false;
          this.currentKmpFilename = null;
          this.currentKmpFileHandle = null;
          this.currentDirectoryHandle = null;
          this.currentKmpData = new KmpData();
          this.currentNotSaved = false;
          this.cfg.isBattleTrack = false;
          this.resetUndoStack();
          this.viewer.setData(this.currentKmpData);
          this.setDefaultModel();
          this.refreshPanels();
          this.viewer.render();
          this.noModelLoaded = true;
          return true;
        }
        async askOpenKmp() {
          if (!await this.askSaveChanges())
            return;
          if (window.showOpenFilePicker != null) {
            const handle = await this.pickFileHandle({
              multiple: false,
              types: [this.buildKmpFileTypeFilter()]
            });
            if (handle == null)
              return;
            const bytes = await this.readHandleBytes(handle);
            await this.openKmpFromBytes(handle.name, bytes, {
              kmpHandle: handle
            });
            return;
          }
          const file = await this.pickSingleFileFromInput(".kmp");
          if (file == null)
            return;
          await this.openKmpFromBytes(file.name, new Uint8Array(await file.arrayBuffer()));
        }
        async askOpenTrackFolder() {
          if (!await this.askSaveChanges())
            return;
          if (window.showDirectoryPicker != null) {
            const directoryHandle = await this.pickDirectoryHandle();
            if (directoryHandle == null)
              return;
            const kmpFile = await this.readFileBytesFromDirectory(directoryHandle, "course.kmp");
            if (kmpFile == null) {
              window.alert("No course.kmp was found in the selected folder.");
              return;
            }
            const kclFile = await this.readFileBytesFromDirectory(directoryHandle, "course.kcl");
            await this.openKmpFromBytes(directoryHandle.name + "/course.kmp", kmpFile.bytes, {
              kmpHandle: kmpFile.fileHandle,
              directoryHandle,
              kclBytes: kclFile == null ? null : kclFile.bytes,
              kclFilename: kclFile == null ? null : directoryHandle.name + "/course.kcl",
              kclHandle: kclFile == null ? null : kclFile.fileHandle
            });
            return;
          }
          const files = await this.pickSingleFileFromInput("", true);
          if (files == null || files.length <= 0)
            return;
          let courseKmpFile = null;
          let courseKclFile = null;
          for (const file of files) {
            const relativePath = file.webkitRelativePath || file.name;
            const lowered = relativePath.toLowerCase();
            if (lowered.endsWith("/course.kmp") || lowered === "course.kmp")
              courseKmpFile = file;
            else if (lowered.endsWith("/course.kcl") || lowered === "course.kcl")
              courseKclFile = file;
          }
          if (courseKmpFile == null) {
            window.alert("No course.kmp was found in the selected folder.");
            return;
          }
          const folderPath = courseKmpFile.webkitRelativePath || courseKmpFile.name;
          const folderName = folderPath.includes("/") ? folderPath.split("/")[0] : "track";
          const kmpBytes = new Uint8Array(await courseKmpFile.arrayBuffer());
          const kclBytes = courseKclFile == null ? null : new Uint8Array(await courseKclFile.arrayBuffer());
          await this.openKmpFromBytes(folderName + "/course.kmp", kmpBytes, {
            kclBytes,
            kclFilename: kclBytes == null ? null : folderName + "/course.kcl"
          });
        }
        async openKmpFromBytes(filename, bytes, source = {}) {
          if (filename == ".")
            return;
          try {
            this.currentKmpFilename = normalizeFilename(filename);
            this.currentKmpFileHandle = source.kmpHandle == null ? null : source.kmpHandle;
            this.currentDirectoryHandle = source.directoryHandle == null ? null : source.directoryHandle;
            this.currentKmpData = KmpData.convertToWorkingFormat(KmpData.load(bytes));
            this.currentNotSaved = false;
            this.cfg.isBattleTrack = this.currentKmpData.isBattleTrack;
            this.resetUndoStack();
            if (source.kclBytes != null)
              this.openKclFromBytes(source.kclFilename, source.kclBytes, source.kclHandle);
            else if (this.currentDirectoryHandle != null) {
              const kclFile = await this.readFileBytesFromDirectory(this.currentDirectoryHandle, "course.kcl");
              if (kclFile != null)
                this.openKclFromBytes(this.currentDirectoryHandle.name + "/course.kcl", kclFile.bytes, kclFile.fileHandle);
              else
                this.setDefaultModel();
            } else
              this.setDefaultModel();
            this.viewer.setData(this.currentKmpData);
            this.viewer.centerView();
            this.refreshPanels();
            this.viewer.render();
            this.noModelLoaded = false;
          } catch (e) {
            console.error(e);
            alert("KMP open error!\n\n" + e);
            await this.newKmp(false);
          }
        }
        async saveKmp(filename) {
          if (this.currentKmpFileHandle == null && filename == null)
            return await this.saveKmpAs();
          try {
            const bytes = this.currentKmpData.convertToStorageFormat(this.cfg.isBattleTrack);
            if (this.currentKmpFileHandle != null) {
              const writable = await this.currentKmpFileHandle.createWritable();
              await writable.write(new Uint8Array(bytes));
              await writable.close();
              this.currentKmpFilename = normalizeFilename(this.currentKmpFileHandle.name);
            } else {
              const outName = normalizeFilename(filename || this.getKmpDownloadName());
              this.downloadBytes(bytes, outName);
              this.currentKmpFilename = outName;
            }
            this.currentNotSaved = false;
            this.savedUndoSlot = this.undoPointer;
            this.refreshPanels();
            return true;
          } catch (e) {
            console.error(e);
            alert("KMP save error!\n\n" + e);
            return false;
          }
        }
        async saveKmpAs() {
          if (window.showSaveFilePicker != null) {
            try {
              const filename = this.getKmpDownloadName();
              const suggestedName = filename.includes("/") ? filename.substring(filename.lastIndexOf("/") + 1) : filename;
              const handle = await window.showSaveFilePicker({
                suggestedName,
                types: [this.buildKmpFileTypeFilter()]
              });
              if (handle == null)
                return false;
              this.currentKmpFileHandle = handle;
              this.currentKmpFilename = normalizeFilename(handle.name);
              return await this.saveKmp(this.currentKmpFilename);
            } catch (e) {
              if (e.name === "AbortError")
                return false;
              throw e;
            }
          }
          return await this.saveKmp(this.getKmpDownloadName());
        }
        setDefaultModel() {
          let model = new ModelBuilder().addCube(-5e3, -5e3, -3, 5e3, 5e3, 3).calculateNormals();
          this.noModelLoaded = true;
          this.viewer.setModel(model);
          this.viewer.centerView();
          this.currentKclFilename = null;
          this.currentKclFileHandle = null;
          this.currentKclBytes = null;
        }
        async openCourseBrres() {
          if (this.currentDirectoryHandle == null)
            return;
          const brresFile = await this.readFileBytesFromDirectory(this.currentDirectoryHandle, "course_model.brres");
          if (brresFile != null)
            this.openBrresFromBytes(this.currentDirectoryHandle.name + "/course_model.brres", brresFile.bytes, brresFile.fileHandle);
        }
        async openCourseKcl() {
          if (this.currentDirectoryHandle == null)
            return;
          const kclFile = await this.readFileBytesFromDirectory(this.currentDirectoryHandle, "course.kcl");
          if (kclFile != null)
            this.openKclFromBytes(this.currentDirectoryHandle.name + "/course.kcl", kclFile.bytes, kclFile.fileHandle);
        }
        async openCustomModel() {
          if (window.showOpenFilePicker != null) {
            const handle = await this.pickFileHandle({
              multiple: false,
              types: [this.buildModelFileTypeFilter()]
            });
            if (handle == null)
              return;
            const bytes = await this.readHandleBytes(handle);
            this.openModelFromBytes(handle.name, bytes, handle);
            return;
          }
          const file = await this.pickSingleFileFromInput(".obj,.brres,.kcl");
          if (file == null)
            return;
          this.openModelFromBytes(file.name, new Uint8Array(await file.arrayBuffer()));
        }
        openModelFromBytes(filename, bytes, fileHandle = null) {
          const ext = getExtension(filename);
          if (ext === ".brres") {
            this.openBrresFromBytes(filename, bytes, fileHandle);
            return;
          }
          if (ext === ".kcl") {
            this.openKclFromBytes(filename, bytes, fileHandle);
            return;
          }
          const modelBuilder = require_objLoader().ObjLoader.makeModelBuilder(bytes);
          this.viewer.setModel(modelBuilder);
          this.currentKclFilename = null;
          this.currentKclFileHandle = null;
          this.currentKclBytes = null;
          this.currentModelFileHandle = fileHandle;
          if (this.noModelLoaded)
            this.viewer.centerView();
          this.noModelLoaded = false;
        }
        openBrresFromBytes(filename, bytes, fileHandle = null) {
          if (bytes == null)
            return;
          let modelBuilder = null;
          try {
            modelBuilder = require_brresLoader().BrresLoader.load(bytes);
          } catch (e) {
            window.alert("Error opening BRRES file!\n\n" + e.toString());
            return;
          }
          this.viewer.setModel(modelBuilder);
          this.currentKclFilename = null;
          this.currentKclFileHandle = null;
          this.currentKclBytes = null;
          this.currentModelFileHandle = fileHandle;
          if (this.noModelLoaded)
            this.viewer.centerView();
          this.noModelLoaded = false;
        }
        openKclFromBytes(filename, bytes, fileHandle = null) {
          if (bytes == null)
            return;
          let normalizedBytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
          let modelBuilder = KclLoader.load(normalizedBytes, this.cfg, this.hl);
          this.viewer.setModel(modelBuilder);
          this.currentKclFilename = normalizeFilename(filename);
          this.currentKclBytes = new Uint8Array(normalizedBytes);
          this.currentKclFileHandle = fileHandle;
          if (this.noModelLoaded)
            this.viewer.centerView();
          this.noModelLoaded = false;
        }
        reloadCurrentKcl() {
          if (this.currentKclBytes == null)
            return;
          this.openKclFromBytes(this.currentKclFilename, this.currentKclBytes, this.currentKclFileHandle);
        }
      };
      var Panel = class {
        constructor(window2, parentDiv, name, open = true, onToggle = null, closable = true, onRefreshView = null) {
          this.window = window2;
          this.parentDiv = parentDiv;
          this.name = name;
          this.closable = closable;
          this.open = open;
          this.onToggle = onToggle;
          this.panelDiv = document.createElement("div");
          this.panelDiv.className = "panel";
          this.parentDiv.appendChild(this.panelDiv);
          this.titleButton = document.createElement("button");
          this.titleButton.className = "panelTitle";
          this.titleButton.innerHTML = "\u25B6 " + name;
          this.panelDiv.appendChild(this.titleButton);
          this.contentDiv = document.createElement("div");
          this.contentDiv.className = "panelContent";
          this.contentDiv.style.display = "none";
          this.panelDiv.appendChild(this.contentDiv);
          this.titleButton.onclick = () => this.toggleOpen();
          this.onRefreshView = onRefreshView != null ? onRefreshView : () => {
          };
          this.onDestroy = [];
          this.refreshOpen();
        }
        destroy() {
          for (let f of this.onDestroy)
            f();
          this.onDestroy = [];
          if (this.panelDiv)
            this.parentDiv.removeChild(this.panelDiv);
        }
        clearContent() {
          for (let f of this.onDestroy)
            f();
          this.onDestroy = [];
          while (this.contentDiv.lastChild)
            this.contentDiv.removeChild(this.contentDiv.lastChild);
        }
        setOpen(open) {
          let changed = this.open != open;
          this.open = open;
          this.refreshOpen();
          if (changed && this.onToggle != null)
            this.onToggle(this.open);
        }
        toggleOpen() {
          this.open = !this.open;
          this.refreshOpen();
          if (this.onToggle != null)
            this.onToggle(this.open);
        }
        refreshOpen() {
          if (this.open) {
            this.contentDiv.style.display = "block";
            this.titleButton.innerHTML = "\u25BC " + this.name;
          } else {
            this.contentDiv.style.display = "none";
            this.titleButton.innerHTML = "\u25B6 " + this.name;
          }
        }
        addGroup(group, str) {
          let div = document.createElement("div");
          div.className = "panelGroup";
          let labelDiv = document.createElement("div");
          labelDiv.className = "panelRowElement";
          div.appendChild(labelDiv);
          let label = document.createElement("div");
          label.className = "panelGroupTitle";
          label.innerHTML = str;
          labelDiv.appendChild(label);
          if (group == null)
            this.contentDiv.appendChild(div);
          else
            group.appendChild(div);
          return div;
        }
        addSpacer(group, n = 1) {
          for (let i = 0; i < n; i++) {
            let div = document.createElement("div");
            div.className = "panelRowElement";
            if (group == null)
              this.contentDiv.appendChild(div);
            else
              group.appendChild(div);
          }
          return null;
        }
        addText(group, str) {
          if (isMacPlatform()) {
            str = str.replace("Alt", "\u2325");
            str = str.replace("Ctrl", "\u2318");
          }
          let div = document.createElement("div");
          div.className = "panelRowElement";
          let text = document.createElement("span");
          text.className = "panelLabel";
          text.innerHTML = str;
          div.appendChild(text);
          if (group == null)
            this.contentDiv.appendChild(div);
          else
            group.appendChild(div);
          return text;
        }
        addButton(group, str, onclick = null) {
          let div = document.createElement("div");
          div.className = "panelRowElement";
          let label = document.createElement("label");
          div.appendChild(label);
          let button = document.createElement("button");
          button.className = "panelButton";
          button.innerHTML = str;
          button.onclick = () => {
            onclick();
            this.onRefreshView();
          };
          label.appendChild(button);
          if (group == null)
            this.contentDiv.appendChild(div);
          else
            group.appendChild(div);
          return button;
        }
        addCheckbox(group, str, checked = false, onchange = null) {
          let div = document.createElement("div");
          div.className = "panelRowElement";
          let label = document.createElement("label");
          div.appendChild(label);
          let checkbox = document.createElement("input");
          checkbox.className = "panelCheckbox";
          checkbox.type = "checkbox";
          checkbox.checked = checked;
          checkbox.onchange = () => {
            onchange(checkbox.checked);
            this.onRefreshView();
          };
          let text = document.createElement("span");
          text.className = "panelLabel";
          text.innerHTML = str;
          label.appendChild(checkbox);
          label.appendChild(text);
          if (group == null)
            this.contentDiv.appendChild(div);
          else
            group.appendChild(div);
          return checkbox;
        }
        addSlider(group, str, min = 0, max = 1, value = 0, step = 0.1, onchange = null) {
          let div = document.createElement("div");
          div.className = "panelRowElement";
          let label = document.createElement("label");
          div.appendChild(label);
          let slider = document.createElement("input");
          slider.className = "panelCheckbox";
          slider.type = "range";
          slider.min = min;
          slider.max = max;
          slider.step = step;
          slider.value = value;
          slider.oninput = () => {
            onchange(slider.value);
            this.onRefreshView();
          };
          let text = document.createElement("span");
          text.className = "panelLabel";
          text.innerHTML = str;
          label.appendChild(text);
          label.appendChild(slider);
          if (group == null)
            this.contentDiv.appendChild(div);
          else
            group.appendChild(div);
          return slider;
        }
        addSelectionNumericInput(group, str, min = 0, max = 1, values = 0, step = 0.1, dragStep = 0.1, enabled = true, multiedit = false, onchange = null, modify = null) {
          let div = document.createElement("div");
          div.className = "panelRowElement";
          let label = document.createElement("label");
          div.appendChild(label);
          if (!(values instanceof Array))
            values = [values];
          if (onchange == null)
            onchange = (x, i) => {
            };
          if (modify == null)
            modify = (x) => {
              return x;
            };
          let input = document.createElement("input");
          input.className = "panelNumericInput";
          input.type = "input";
          input.value = enabled && values.every((v) => v === values[0]) ? values[0] : "";
          input.disabled = !enabled;
          input.lastInput = input.value;
          let inFocus = false;
          input.onfocus = () => {
            inFocus = true;
            this.window.setUndoPoint();
          };
          input.onblur = () => {
            inFocus = false;
            this.window.setUndoPoint();
            this.window.viewer.canvas.focus();
            input.value = modify(input.lastInput);
          };
          input.onkeydown = (ev) => {
            if (inFocus) {
              if (ev.key === "Enter")
                input.value = modify(input.lastInput);
              else
                ev.stopPropagation();
            }
          };
          let safeParseFloat = (s) => {
            let x = 0;
            if (s.substring(0, 2) == "0x")
              x = parseInt(s, 16);
            else
              x = parseFloat(s);
            if (isNaN(x) || !isFinite(x))
              return 0;
            return x;
          };
          let clampValue = (x) => {
            if (step != null)
              x = Math.round(x / step) * step;
            x = Math.max(x, min);
            x = Math.min(x, max);
            return x;
          };
          let valueDelta = 0;
          input.oninput = () => {
            if (!enabled)
              return;
            valueDelta = 0;
            for (let i = 0; i < values.length; i++)
              onchange(input.value != "" ? clampValue(safeParseFloat(input.value)) : values[i], i);
            input.lastInput = input.value != "" ? clampValue(safeParseFloat(input.value)) : lastInput;
            this.onRefreshView();
          };
          let text = document.createElement("div");
          text.className = "panelNumericInputLabel";
          text.innerHTML = str;
          let mouseDown = false;
          let lastEv = null;
          text.onmousedown = (ev) => {
            if (!enabled)
              return;
            lastEv = ev;
            mouseDown = true;
            this.window.setUndoPoint();
          };
          let onMouseUp = (ev) => {
            if (!mouseDown)
              return;
            mouseDown = false;
          };
          let onMouseMove = (ev) => {
            if (mouseDown && dragStep > 0) {
              let dy = lastEv.screenY - ev.screenY;
              let value = safeParseFloat(input.value);
              valueDelta += dy * dragStep;
              value += dy * dragStep;
              value = clampValue(value);
              if (!multiedit) {
                input.value = modify(value.toFixed(5));
                for (let i = 0; i < values.length; i++)
                  onchange(value, i);
              } else {
                input.value = values.every((v) => v === values[0]) ? modify(clampValue(values[0] + valueDelta)) : "";
                for (let i = 0; i < values.length; i++)
                  onchange(clampValue(values[i] + valueDelta), i);
              }
              lastEv = ev;
              input.lastInput = input.value;
              this.onRefreshView();
              ev.preventDefault();
            }
          };
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
          document.addEventListener("mouseleave", onMouseUp);
          this.onDestroy.push(() => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mouseleave", onMouseUp);
          });
          label.appendChild(text);
          label.appendChild(input);
          if (group == null)
            this.contentDiv.appendChild(div);
          else
            group.appendChild(div);
          return input;
        }
        addSelectionDropdown(group, str, values = 0, options = [], enabled = true, multiedit = false, onchange = null) {
          let div = document.createElement("div");
          div.className = "panelRowElement";
          let label = document.createElement("label");
          div.appendChild(label);
          if (!(values instanceof Array))
            values = [values];
          if (onchange == null)
            onchange = (x, i) => {
            };
          let select = document.createElement("select");
          select.className = "panelSelect";
          select.disabled = !enabled;
          for (let option of options) {
            let selectOption = document.createElement("option");
            selectOption.innerHTML = option.str;
            selectOption.value = option.value;
            select.appendChild(selectOption);
          }
          if (enabled && values.every((v) => v === values[0]))
            select.selectedIndex = options.findIndex((op) => op.value == values[0]);
          else
            select.selectedIndex = -1;
          select.onchange = () => {
            if (select.selectedIndex < 0)
              return;
            this.window.setUndoPoint();
            for (let i = 0; i < values.length; i++)
              onchange(options[select.selectedIndex].value, i);
            this.onRefreshView();
          };
          let text = document.createElement("div");
          text.className = "panelInputLabel";
          text.innerHTML = str;
          label.appendChild(text);
          label.appendChild(select);
          if (group == null)
            this.contentDiv.appendChild(div);
          else
            group.appendChild(div);
          return select;
        }
      };
      module.exports = { main, MainWindow, gMainWindow };
    }
  });
  return require_mainWindowWeb();
})();
//# sourceMappingURL=app.js.map
