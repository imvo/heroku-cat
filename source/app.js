require([], function(){
    // detect WebGL
    if( !Detector.webgl ){
        Detector.addGetWebGLMessage();
        throw 'WebGL Not Available'
    }

    var range =50;
    var container = document.getElementById( 'container' )
    var containerWidth = window.innerWidth;
    var containerHeight = window.innerHeight;
    // setup webgl renderer full page
    var renderer	= new THREE.WebGLRenderer();
    renderer.setSize( containerWidth, containerHeight );
    document.body.appendChild( renderer.domElement );
    // setup a scene and camera
    var scene	= new THREE.Scene();

    //var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    //camera.position.z = 3;


    var camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 10000 );
    camera.position.set( 0, 0, range * 2 );
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    // declare the rendering loop
    var onRenderFcts= [];


    // handle window resize events
    var winResize	= new THREEx.WindowResize(renderer, camera)

    //////////////////////////////////////////////////////////////////////////////////
    //		default 3 points lightning					//
    //////////////////////////////////////////////////////////////////////////////////

    //var ambientLight= new THREE.AmbientLight( 0x020202 )
    //scene.add( ambientLight)
    var frontLight	= new THREE.DirectionalLight('white', 1)
    frontLight.position.set(0.5, 0.5, 2)
    scene.add( frontLight )
    //var backLight	= new THREE.DirectionalLight('white', 0.75)
    //backLight.position.set(-0.5, -0.5, -2)
    //scene.add( backLight )


    //////////////////////////////////////////////////////////////////////////////////
    //		add an object and make it move					//
    //////////////////////////////////////////////////////////////////////////////////

    // make a ref cat object
    var nyanCat    = new THREEx.NyanCat()
    nyanCat.container.scale.multiplyScalar(0.7)
    //nyanCat.container.position.set(-2,-1,0)
    //scene.add( nyanCat.container )

    // clone cats into screen
    var cats = [];
    var counter = 0;
    var objects = [];
    for (var i =-60; i<=60;i=i+40){
        for (var j =-30; j<=30;j=j+30){
            cats[counter] = nyanCat.container.clone();
            cats[counter].position.set(i,j,0);
            scene.add( cats[counter] );
            //objects.push( cats[counter] );
            counter++;
        }
    }


    //make every cat rotate
    onRenderFcts.push(function(delta, now){
        //nyanCat.container.rotateX(0.5 * delta);
        //nyanCat.container.rotateY(delta);
        for (var i =0; i<=(cats.length-1);i++){
            cats[i].rotateY(delta);
            //cats[0].rotateY(delta);
        }
    })


    var	projector = new THREE.Projector();
    var	mouseVector = new THREE.Vector3();



    window.addEventListener( 'click', onClick, false );
    function onClick(e){
//alert ();
        mouseVector.x = 2 * (e.clientX / containerWidth) - 1;
        mouseVector.y = 1 - 2 * ( e.clientY / containerHeight );

        var raycaster = projector.pickingRay( mouseVector.clone(), camera ),
            intersects = raycaster.intersectObjects( cats );


        for( var i = 0; i < intersects.length; i++ ) {
            var intersection = intersects[ i ],
                obj = intersection.object;

            obj.material.color.setRGB( 1.0 - i / intersects.length, 0, 0 );
        }

    }

    /*
     document.addEventListener("click", function(event) {
     //cats[1].on('click', function()
     cats[7].scale.x += 0.005;
     cats[7].scale.y += 0.005;
     cats[7].scale.z += 0.005;
     cats[7].rotation.y += 4;
     //alert('gotit');

     var projector = new THREE.Projector();

     event.preventDefault();

     var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
     projector.unprojectVector( vector, camera );

     var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

     var intersects = raycaster.intersectObjects( objects );

     if ( intersects.length > 0 ) {

     intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

     var particle = new THREE.Sprite( particleMaterial );
     particle.position = intersects[ 0 ].point;
     particle.scale.x = particle.scale.y = 16;
     scene.add( particle );

     }
     }); */





    //////////////////////////////////////////////////////////////////////////////////
    //		Camera Controls							//
    //////////////////////////////////////////////////////////////////////////////////
    /*var mouse	= {x : 0, y : 0}
     document.addEventListener('mousemove', function(event){
     mouse.x	= (event.clientX / window.innerWidth ) - 0.5
     mouse.y	= (event.clientY / window.innerHeight) - 0.5
     }, false)
     onRenderFcts.push(function(delta, now){
     camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3)
     camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3)
     camera.lookAt( scene.position )
     })
     */
    //////////////////////////////////////////////////////////////////////////////////
    //		render the scene						//
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function(){
        renderer.render( scene, camera );
    })

    //////////////////////////////////////////////////////////////////////////////////
    //		Rendering Loop runner						//
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec= null
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        // measure time
        lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
        var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
        lastTimeMsec	= nowMsec
        // call each update function
        onRenderFcts.forEach(function(onRenderFct){
            onRenderFct(deltaMsec/1000, nowMsec/1000)
        })
    })
})