let req = indexedDB.open("Camera", 1);
let container = document.querySelector('body .container');
let dbaccess;
req.addEventListener('success', function(){
    dbaccess = req.result;
})

req.addEventListener("upgradeneeded" , function(){
    let db = req.result;
    db.createObjectStore('gallery', {keyPath : "mid"})
})

req.addEventListener("error", () => {
    alert("Some error occured");
})

function addMedia(type, media){
    let tx = dbaccess.transaction('gallery', 'readwrite');
    let galleryStore = tx.objectStore('gallery')
    let data = {
        mid: Date.now(),
        type,
        media
    }
    galleryStore.add(data);
}

function downloadMedia(el){
    let name = "";
    if(el.nodeName === 'IMG' ){
        name = "img.png"
    }
    else{
        name = "video.mp4"
    }
    let a = document.createElement('a');
    a.href = el.src;
    a.download = name
    a.click();
    a.remove();

}

function deleteMedia(el, id){
    el.parentElement.remove(parent);
    let tx = dbaccess.transaction('gallery', 'readwrite');
    let galleryStore = tx.objectStore('gallery');
    galleryStore.delete(Number(id));
}

function viewMedia(){
    //dbacces mil rkha h assumption
    let tx = dbaccess.transaction('gallery', 'readonly');
    let galleryStore = tx.objectStore('gallery')
    let req = galleryStore.openCursor();

    req.addEventListener('success', e => {
        let cursor = req.result;

        if(cursor){
            let div = document.createElement('div');
            div.classList.add('card');
            let el;
            div.innerHTML = `
                <div class="media"></div>
                <div class="action">
                    <button class="download">Download</button>
                    <button class="delete" data-id= "${cursor.value.mid}" >Delete</button>
                </div>
            `

            //adding video source
            let mediacontainer = div.querySelector('.media');
            if(cursor.value.type === 'img'){
                el = document.createElement('img');
                el.setAttribute("src", cursor.value.media);
                mediacontainer.appendChild(el);
            }
            else{
                el = document.createElement('video');
                el.autoplay = true;
                el.controls = true;
                el.loop = true;
                el.src = URL.createObjectURL(cursor.value.media);
                mediacontainer.appendChild(el);
            }

            //downloading
            let dbtn = div.querySelector('.download');
            let medialEl = div.querySelector('.media').children[0];
            dbtn.addEventListener('click', () => downloadMedia(medialEl));

            //deleting
            let delbtn = div.querySelector('.delete');
            delbtn.addEventListener('click', () => deleteMedia(delbtn.parentElement, delbtn.getAttribute('data-id')));

            container.appendChild(div);
            cursor.continue();
        }
    })
}