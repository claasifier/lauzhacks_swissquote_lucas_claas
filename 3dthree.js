$(document).ready(function(){
  function createTextCanvas(text, color, font, size) {
      size = size || 16;
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var fontStr = (size + 'px ') + (font || 'Arial');
      ctx.font = fontStr;
      var w = ctx.measureText(text).width;
      var h = Math.ceil(size);
      canvas.width = w;
      canvas.height = h;
      ctx.font = fontStr;
      ctx.fillStyle = color || 'black';
      ctx.fillText(text, 0, Math.ceil(size * 0.8));
      return canvas;
  }

  function createText2D(text, color, font, size, segW, segH) {
      var canvas = createTextCanvas(text, color, font, size);
      var plane = new THREE.PlaneGeometry(canvas.width, canvas.height, segW, segH);
      var tex = new THREE.Texture(canvas);
      tex.needsUpdate = true;
      var planeMat = new THREE.MeshBasicMaterial({
          map: tex,
          color: 0xFFFFFF,
          transparent: true
      });

      var mesh = new THREE.Mesh(plane, planeMat);
      mesh.scale.set(0.5, 0.5, 0.5);
      mesh.doubleSided = true;
      return mesh;
  }

  // from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  function hexToRgb(hex) { //TODO rewrite with vector output
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  }

  var renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  var w = 1300;
  var h = 800;

  renderer.setSize(w, h);

  document.getElementById("plot").appendChild(renderer.domElement);


  renderer.setClearColor(new THREE.Color(20/255, 16/255, 16/255));

  var camera = new THREE.PerspectiveCamera(45, w / (h*1.7), 1, 10000);
  camera.position.z = 200;
  camera.position.x = 100;
  camera.position.y = 100;

  var scene = new THREE.Scene();

  var scatterPlot = new THREE.Object3D();
  scene.add(scatterPlot);

  scatterPlot.rotation.y = 0;

  function v(x, y, z) {
      return new THREE.Vector3(x, y, z);
  }

  var unfiltered = []
  //     lowPass = [],
  //     highPass = [];

  var format = d3.format("+.3f");

  var points = []










  function processCompany(companyCsv, number){
    //HERE THE BIG PROCESSING STARTS
    d3.csv(companyCsv, function (error, d){
      if (error) throw error;

      d.forEach(function (dataPoint,i) {
          unfiltered[i] = {
              x: +parseDate(dataPoint.TIMESTAMP),
              y: (+dataPoint.VOL)*(+dataPoint.PRICE),
              z: number
          };
          // lowPass[i] = {
          //     x: +d.lp_x,
          //     y: +d.lp_y,
          //     z: +d.lp_z
          // };
          // highPass[i] = {
          //     x: +d.hp_x,
          //     y: +d.hp_y,
          //     z: +d.hp_z
          // }
      });

    var xExent = d3.extent(unfiltered, function (d) {return d.x; }),
        //yExent = d3.extent(unfiltered, function (d) {return d.y; }),
        yExent = [0,2000000],
        zExent = [0,30];

    var vpts = {
        xMax: xExent[1],
        xCen: (xExent[1] + xExent[0]) / 2,
        xMin: xExent[0],
        yMax: yExent[1],
        yCen: (yExent[1] + yExent[0]) / 2,
        yMin: yExent[0],
        zMax: zExent[1],
        zCen: (zExent[1] + zExent[0]) / 2,
        zMin: zExent[0]
    }

    var colour = d3.scale.category20c();

    var xScale = d3.scale.linear()
                  .domain(xExent)
                  .range([-50,50]);
    var yScale = d3.scale.linear()
                  .domain(yExent)
                  .range([-5,50]);
    var zScale = d3.scale.linear()
                  .domain(zExent)
                  .range([-50,50]);

    var lineGeo = new THREE.Geometry();
    lineGeo.colors = [[1,1,1]]
    lineGeo.vertices.push(
        v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zMin)), v(xScale(vpts.xMax), yScale(vpts.yMin), zScale(vpts.zMin)),
        v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zMin)), v(xScale(vpts.xMin), yScale(vpts.yMax), zScale(vpts.zMin)),
        v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zMin)), v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zMax)),
    );


    var lineMat = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        lineWidth: 1
    });

    var line = new THREE.Line(lineGeo, lineMat);
    line.type = THREE.Lines;
    scatterPlot.add(line);

    // var titleX = createText2D('-X');
    // titleX.position.x = xScale(vpts.xMin) - 12,
    // titleX.position.y = 5;
    // scatterPlot.add(titleX);
    //
    // var valueX = createText2D(format(xExent[0]));
    // valueX.position.x = xScale(vpts.xMin) - 12,
    // valueX.position.y = -5;
    // scatterPlot.add(valueX);
    //
    // var titleX = createText2D('X');
    // titleX.position.x = xScale(vpts.xMax) + 12;
    // titleX.position.y = 5;
    // scatterPlot.add(titleX);
    //
    // var valueX = createText2D(format(xExent[1]));
    // valueX.position.x = xScale(vpts.xMax) + 12,
    // valueX.position.y = -5;
    // scatterPlot.add(valueX);

    // var titleY = createText2D('-Y');
    // titleY.position.y = yScale(vpts.yMin) - 5;
    // scatterPlot.add(titleY);
    //
    // var valueY = createText2D(format(yExent[0]));
    // valueY.position.y = yScale(vpts.yMin) - 15,
    // scatterPlot.add(valueY);
    //
    // var titleY = createText2D('Y');
    // titleY.position.y = yScale(vpts.yMax) + 15;
    // scatterPlot.add(titleY);
    //
    // var valueY = createText2D(format(yExent[1]));
    // valueY.position.y = yScale(vpts.yMax) + 5,
    // scatterPlot.add(valueY);
    //
    // var titleZ = createText2D('-Z ' + format(zExent[0]));
    // titleZ.position.z = zScale(vpts.zMin) + 2;
    // scatterPlot.add(titleZ);
    //
    // var titleZ = createText2D('Z ' + format(zExent[1]));
    // titleZ.position.z = zScale(vpts.zMax) + 2;
    // scatterPlot.add(titleZ);

    var mat = new THREE.ParticleBasicMaterial({
        vertexColors: true,
        size: 1
    });

    var pointCount = unfiltered.length;
    var pointGeo = new THREE.Geometry();
    for (var i = 0; i < pointCount; i ++) {
      var x = xScale(unfiltered[i].x);
      var y = yScale(unfiltered[i].y);
      var z = zScale(unfiltered[i].z);

      pointGeo.vertices.push(new THREE.Vector3(x, y, z));
      //pointGeo.vertices[i].angle = Math.atan2(z, x);
      pointGeo.vertices[i].radius = Math.sqrt(x * x + z * z);
      //pointGeo.vertices[i].speed = (z / 100) * (x / 100);
      pointGeo.colors.push(new THREE.Color().setRGB(
        (0.9-y*8/255)*(1-7/255*z),(0.6-y*4/255),(0.3+y*8/255)*(0.9-7/255*z)
      ));
    }

    points[number] = new THREE.ParticleSystem(pointGeo, mat);
    scatterPlot.add(points[number]);

    renderer.render(scene, camera);
    var paused = false;
    var last = new Date().getTime();
    var down = false;
    var sx = 0,
        sy = 0;

    window.onmousedown = function(ev) {
        down = true;
        sx = ev.clientX;
        sy = ev.clientY;
    };
    window.onmouseup = function() {
        down = false;
    };
    window.onmousemove = function(ev) {
        if (down) {
            var dx = ev.clientX - sx;
            var dy = ev.clientY - sy;
            scatterPlot.rotation.y += dx * 0.01;
            camera.position.y += dy;
            sx += dx;
            sy += dy;
        }
    };

    var animating = false;
    window.ondblclick = function() {
        animating = !animating;
    };

    function animate(t) {
        scatterPlot.rotation.y += 0.0001;
        if (!paused) {
            last = t;
            if (animating) {
                var v = pointGeo.vertices;
                for (var i = 0; i < v.length; i++) {
                    var u = v[i];
                    u.angle += u.speed * 0.01;
                    u.x = Math.cos(u.angle) * u.radius;
                    u.z = Math.sin(u.angle) * u.radius;
                }
                pointGeo.__dirtyVertices = true;
            }
            renderer.clear();
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        }
        window.requestAnimationFrame(animate, renderer.domElement);
    };
    animate(new Date().getTime());
    onmessage = function(ev) {
        paused = (ev.data == 'pause');
    };
  });
}


  d3.csv("names.csv", function(error, companies){
    var i =0;
    console.log(companies[0]);
    companies.forEach(function(company){
      processCompany(String(company.NAME)+".csv",i);
      i++
    });
  });

  function alerthisshit(){
    alert('alerthisshit');
  }


  function parseDate(date){
    var clockTime = parseFloat((" "+date.charAt(8)+date.charAt(9)+date.charAt(10)+date.charAt(11)+date.charAt(12)+date.charAt(13)));
    var decTime = clockTime/240000;
    var date = (""+date.charAt(6)+date.charAt(7));
    return (parseFloat(date)+decTime);
  };
});
