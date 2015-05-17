/**
 * Created by GaborK on 13/05/15.
 */


/* testing cloth simulation */

var images = 128;

var pins = [];
for (var j = 0; j <= cloth.h; j+=2)
    pins.push(cloth.index(0, j));


if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var $container;
var camera, scene, renderer;

var clothGeometry;
var sphere;
var object, arrow;

var rotate = true;

var safeToRender = false;


function renderSafe(){
    safeToRender = true;
}

function initClothAnimation() {


    $container = $('<div></div>').addClass('.flag-animation');
    $('#wrap').prepend($container);

    // scene

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    // camera

    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.y = 150;
    camera.position.z = 300;
    camera.position.x = -30;
    scene.add( camera );

    // lights

    var light, materials;

    scene.add( new THREE.AmbientLight( 0x666666 ) );

    light = new THREE.DirectionalLight( 0xdfebff, 1 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.5 );

    light.castShadow = true;
    //light.shadowCameraVisible = true;

    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;

    var d = 300;

    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    light.shadowCameraFar = 1000;
    light.shadowDarkness = 0.5;

    scene.add( light );

    // cloth material

    var img = Math.floor(Math.random()*images);
    var clothTexture = THREE.ImageUtils.loadTexture( 'js/cloth/jpg/'+img+'.jpg', undefined, renderSafe );



    clothTexture.wrapS = clothTexture.wrapT = THREE.ClampToEdgeWrapping;
    clothTexture.minFilter = THREE.LinearFilter;
    clothTexture.anisotropy = 16;

    var clothMaterial = new THREE.MeshPhongMaterial( { alphaTest: 0.5, color: 0xffffff, specular: 0x030303, emissive: 0x111111, shiness: 10, map: clothTexture, side: THREE.DoubleSide } );

    // cloth geometry
    clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h );
    clothGeometry.dynamic = true;
    clothGeometry.computeFaceNormals();

    var uniforms = { texture:  { type: "t", value: clothTexture } };
    var vertexShader = document.getElementById( 'vertexShaderDepth' ).textContent;
    var fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

    // cloth mesh

    object = new THREE.Mesh( clothGeometry, clothMaterial );
    object.position.set( -150, 0, 200 );
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add( object );

    object.customDepthMaterial = new THREE.ShaderMaterial( { uniforms: uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader } );

    // sphere

    var ballGeo = new THREE.SphereGeometry( ballSize, 20, 20 );
    var ballMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    sphere = new THREE.Mesh( ballGeo, ballMaterial );
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add( sphere );

    // arrow

    arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 50, 0xff0000 );
    arrow.position.set( -200, 0, -200 );
    // scene.add( arrow );

    // ground

    // var groundTexture = THREE.ImageUtils.loadTexture( "textures/terrain/grasslight-big.jpg" );
    // groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    // groundTexture.repeat.set( 25, 25 );
    // groundTexture.anisotropy = 16;

    // var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

    // var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    // mesh.position.y = -250;
    // mesh.rotation.x = - Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add( mesh );



    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( scene.fog.color );

    $container.append( renderer.domElement );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMapEnabled = true;

    //

    //

    window.addEventListener( 'resize', onWindowResize, false );

    sphere.visible = !true

}

//

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animateCloth() {



        requestAnimationFrame( animateCloth );

        var time = Date.now();

        windStrength = 100;
        windForce.set(
            0.1,
            0.1,
            -0.05 ).normalize().multiplyScalar( windStrength );


        arrow.setLength( windStrength );
        arrow.setDirection( windForce );

        simulate(time);

    if(safeToRender){
        render();
    }

}

function render() {

    var timer = Date.now() * 0.0002;

    var p = cloth.particles;

    for ( var i = 0, il = p.length; i < il; i ++ ) {

        clothGeometry.vertices[ i ].copy( p[ i ].position );

    }

    clothGeometry.computeFaceNormals();
    clothGeometry.computeVertexNormals();

    clothGeometry.normalsNeedUpdate = true;
    clothGeometry.verticesNeedUpdate = true;

    sphere.position.copy( ballPosition );


    camera.lookAt( scene.position );

    renderer.render( scene, camera );

}