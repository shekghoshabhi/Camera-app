let video = document.querySelector('video');
let body = document.querySelector('body')
let galleryBtn = document.querySelector(".gallery");
let options = {
	video: true
	// audio: true
};
let mediaRecorder;
let chunks = [];
let filter = "";
let minZoom = 1;
let maxZoom = 3;
let curZoom = 1;
//accessing the user media devices(webcam amd microphone) => returns a promise
//mediastream contains both audio and video streams as we have passed in the options
navigator.mediaDevices.getUserMedia(options).then((mediaStream) => {
	video.srcObject = mediaStream;
	let recorderOptions = { mimeType: 'video/webm; codecs=vp9' };
	mediaRecorder = new MediaRecorder(mediaStream, recorderOptions);

	mediaRecorder.addEventListener('dataavailable', (e) => {
		chunks.push(e.data);
	});

	mediaRecorder.addEventListener('stop', (e) => {
		let blob = new Blob(chunks, { type: 'video/mp4' });
		chunks = [];
		addMedia('video', blob);
		// let url = URL.createObjectURL(blob);
		// let a = document.createElement('a');
		// a.href = url;
		// a.download = 'video.mp4';
		// a.click();
		// a.remove();
	});
});

let record_btn = document.querySelector('.record_btn');
let cap_btn = document.querySelector('.capture_btn');
let isRecording = false;
//start and stop the recording
record_btn.addEventListener('click', () => {
	let div = record_btn.querySelector('div');
	if (isRecording) {
		div.classList.remove('start_recording');
		mediaRecorder.stop();
		isRecording = false;
	} else {
		filter = ""
		removeFilter();
		mediaRecorder.start();
		div.classList.add('start_recording');
		isRecording = true;
	}
});


//capturing images from the video
function capture(){
	let c = document.createElement('canvas');
	c.width = video.videoWidth
	c.height = video.videoHeight
	let ctx = c.getContext('2d');

	//realted to the scaling
	ctx.translate(c.width / 2, c.height / 2);
	ctx.scale(curZoom, curZoom);
	ctx.translate(-c.width / 2, -c.height / 2);
	
	ctx.drawImage(video, 0, 0);  //drawing the image on the canva
	
	//for adding the filter
	if(filter !==""){
		ctx.fillStyle = filter;
		ctx.fillRect(0, 0, c.width, c.height);
	}
	addMedia("img", c.toDataURL());
	// let a = document.createElement('a');
	// a.href = c.toDataURL(); // generating the download link
	// a.download = "image.png";
	// a.click();
	// a.remove();
}

cap_btn.addEventListener('click', () => {
	capture();
})

function applyFilter(color){
	filter = color;
    let div = document.createElement('div');
    div.style.backgroundColor = color;
    div.classList.add('overlay')
    body.appendChild(div);
}

function removeFilter(){
	filter = "";
	let prev = document.querySelector('.overlay');
	if(prev != null)
    	prev.remove();
}

let filters = document.querySelectorAll('.filter');
for(let f of filters){
    f.addEventListener('click', e =>{
        let color = e.target.style.backgroundColor;
		removeFilter();
        applyFilter(color);
    })
}

let zoomIn = document.querySelector(".icon-add");
let zoomOut = document.querySelector(".icon-minus");

zoomIn.addEventListener('click', e =>{
	if(curZoom >= maxZoom){
		return;
	}
	curZoom += 0.1
	video.style.transform = `scale(${curZoom})`
})

zoomOut.addEventListener('click', e =>{
	if(curZoom <= minZoom){
		return;
	}
	curZoom -= 0.1;
	video.style.transform = `scale(${curZoom})`
})



//accessing the galler 
galleryBtn.addEventListener('click', e => {
	location.assign('../gallery.html')
})

