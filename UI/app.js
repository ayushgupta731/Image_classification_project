Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1]!=null) {
            dz.removeFile(dz.files[0]);        
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;          
        
       var url = "http://127.0.0.1:5000/classify_image";   /* redirecting to flask server */ 
   
        // var url = "/api/classify_image";     // for nginx 

        $.post(url, {
            image_data: file.dataURL
        },function(data, status) {

            /* 
            Below is a sample response if you have two faces in an image lets say ayush and aman together.
            Most of the time if there is one person in the image you will get only one element in below array
            data = [
                {
                    class: "aman",
                    class_probability: [91.05, 12.67, 22.00, 4.5, 1.56],
                    class_dictionary: {
                        aman: 0,
                        arvind: 1,
                        ayush: 2,
                        sakib: 3,
                        virat_kohli: 4
                    }
                },
                {
                    class: "ayush",
                    class_probability: [7.02, 23.7, 52.00, 6.1, 1.62],
                    class_dictionary: {
                        aman: 0,
                        arvind: 1,
                        ayush: 2,
                        sakib: 3,
                        virat_kohli: 4
                    }
                }
            ]
            */
           
            console.log(data);
            if (!data || data.length==0) {
                $("#resultHolder").hide();
                $("#divClassTable").hide();                
                $("#error").show();
                return;
            }
            let person = ["aman", "arvind", "ayush", "sakib", "virat_kohli"];
            
            let match = null;
            let bestScore = -1;
            for (let i=0;i<data.length;++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass>bestScore) {
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                }
            }
            if (match) {
                $("#error").hide();
                $("#resultHolder").show();
                $("#divClassTable").show();
                $("#resultHolder").html($(`[data-friend="${match.class}"`).html());
                let classDictionary = match.class_dictionary;
                for(let personName in classDictionary) {
                    let index = classDictionary[personName];
                    let proabilityScore = match.class_probability[index];
                    let elementName = "#score_" + personName;
                    $(elementName).html(proabilityScore);
                }
            }
            // dz.removeFile(file);            
        });
    });

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();		
    });
}

$(document).ready(function() {
    console.log( "ready!" );
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init();
});