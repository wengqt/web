/**
 * Created by weng on 2016/11/20.
 */
var a='',b='';

var source = null;
var currentTime = null;
var voiceRate=0.1;
var musicNumber;



function music(songname,singer,time,i){
    this.songname=songname;
    this.singer=singer;
    this.time=time;
    this.i=i;
    this.addMusic =function(){
        var li = '<li class="songname">'+this.songname+'</li><li class="singername">'+this.singer+'</li><li class="songtime">'+this.time+'</li>';
        var aa =document.createElement("a");
        aa.href =' javascript:cMusic('+this.i+')';
        var ul =document.createElement("ul");

        $(".songlist").append(ul);
        $(ul).append(aa);
        $(aa).append(li);
};

    this.chooseMusic=function () {
         a =songname;
         b =singer;
    $(document).ready(function () {

            $(".song_pic").attr("src","music/"+a+".jpg");
        $(".thesong_name").text("歌曲名："+a);
        $(".thesinger").text("歌手："+b);
        $('#stopBtn').show();
        $('#playBtn').hide();
    });
        // alert(songname+b );
    };
    this.play =function (){
        a =songname;
        b =singer;
        musicplay();
    }

}



var music1  =new music("绅士","薛之谦","04：50",1);
var music2  =new music("丑八怪","薛之谦","04：21",2);
var music3  =new music("演员","薛之谦","04：08",3);
$(document).ready(function(){
    music1.addMusic();
    music2.addMusic();
    music3.addMusic();

});

var ctx,scriptNode,time =null,gainNode,stopTime =null;


// 读取音乐
function musicplay(){
    var url='music/'+b+ ' - ' +a+'.mp3';
    if (!window.AudioContext) {
        alert('您的浏览器不支持AudioContext');
    } else {

         ctx = new AudioContext();

        //使用Ajax获取音频文件
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';//配置数据的返回类型

        request.onload = function () {
            var arraybuffer = request.response;
            ctx.decodeAudioData(arraybuffer, function (buffer) {


                //创建AudioBufferSourceNode对象
                source = ctx.createBufferSource();
                source.buffer = buffer;
                // source.connect(ctx.destination);

                //mute node
                gainNode = ctx.createGain();


                scriptNode = ctx.createScriptProcessor();
                // var audioProcessing = scriptNode.AudioProcessingEvent();

                scriptNode.onaudioprocess = function(audioProcessingEvent) {



                            time =stopTime +audioProcessingEvent.playbackTime;




                        // console.log(audioProcessingEvent.playbackTime);

                        if(time == source.buffer.duration||time >source.buffer.duration){
                            nextMusic();
                            console.log(source.buffer.duration);
                        }
                        showTime();
                    processrange();
                    // The input buffer is the song we loaded earlier
                    var inputBuffer = audioProcessingEvent.inputBuffer;

                    // The output buffer contains the samples that will be modified and played
                    var outputBuffer = audioProcessingEvent.outputBuffer;
                    for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                        var inputData = inputBuffer.getChannelData(channel);
                        var outputData = outputBuffer.getChannelData(channel);

                        // Loop through the 4096 samples
                        for (var sample = 0; sample < inputBuffer.length; sample++) {
                            // make output equal to the same as the input
                            outputData[sample] = inputData[sample];


                        }
                    }





                };
                gainNode.gain.value = voiceRate;

                source.connect(scriptNode);
                // scriptNode.connect(ctx.destination);
                scriptNode.connect(gainNode);
                gainNode.connect(ctx.destination);
                // console.log(when);
                // console.log(time);
                //指定位置开始播放


                source.start(0,stopTime%buffer.duration);
                console.info(source);



            }, function (e) {
                console.info('处理出错');
            });
        };
        request.send();














    }











}



// 选择音乐
function cMusic(i){
    if(time !==null){
        source.stop();
        stopTime=null;
        source.disconnect(scriptNode);
        gainNode.disconnect(ctx.destination);
        ctx.close();
    }
    musicNumber=i||1;
    switch(i)
    {
        case 3:
            music3.chooseMusic();
            music3.play();
            break;
        case 2:
            music2.chooseMusic();
            music2.play();
            break;
        default:
            music1.play();
            music1.chooseMusic();
    }

}









//控制播放暂停
$(document).ready(function(){
        $('#stopBtn').click(function(){

                $('#stopBtn').hide();
                $('#playBtn').show();
                source.stop();
            stopTime = time-1;
console.log(stopTime);
                source.disconnect(scriptNode);
                gainNode.disconnect(ctx.destination);
            ctx.close();
            }
        );
     $('#playBtn').click(function(){

                $('#stopBtn').show();
                $('#playBtn').hide();
            if(stopTime==null){
                cMusic();
            }else{
                musicplay();}
            }
        );

    $('#next').click(function(){nextMusic()}
    );

    $('#pre').click(function(){

            $('#stopBtn').show();
            $('#playBtn').hide();
            // if(stopTime==null){
            var pre = musicNumber-1;
            if(pre==0){pre=3};
            cMusic(pre);
            // }else{
            //     musicplay();}
        }
    );




    $('.mute').click(function(){
            if(document.getElementById("muted")){
                $('.mute').text("mute").removeAttr("id");
                gainNode.gain.value = voiceRate;

            }else{
                $('.mute').text("unmute").attr("id","muted");
                gainNode.gain.value = 0;

            }

        }
    );



    }
);



// 控制音量条
$(function() {
    $(".voiceController").click(function(e) {

        var offset = $(this).offset();
        var relativeX = (e.pageX - offset.left);//获取鼠标相对于组建多位置


        var ballX = relativeX;
        $("#ball").css("left",ballX-10+'px');
        voiceRate = ballX/200;

        // alert("X: " + relativeX + "  Y: " + relativeY+'rate:'+voiceRate);
        $("#voice").text(Math.round(voiceRate*100)+"%");
        changeMUsicVoice();
    });
});


//音量调节
function changeMUsicVoice(){
    gainNode.gain.value  = voiceRate;
    // console.log(gainNode.gain.value);

}

function nextMusic(){

    $('#stopBtn').show();
    $('#playBtn').hide();
    // if(stopTime==null){
    var next = musicNumber+1;
    if(next==4){next=1};

    cMusic(next);
    // }else{
    //     musicplay();}
}


//显示时间
function showTime(){
    var min=0;
    var sec=0;
    sec = Math.round(time);
    exchangetime();

    function exchangetime() {
        if(sec>=60){
            min++;
            sec=sec-60;
            exchangetime();
        }
    }
    $("#time").text(min+':'+sec);
}



//进度条
function processrange(){
    var inputrange;
    var currentrange;
    currentrange =time;
    inputrange =source.buffer.duration;
    $("#processController").attr("max",inputrange).attr("value",currentrange);

    if (currentrange==inputrange||currentrange>=inputrange){
        $("#processController").removeAttr("max").attr("value",0);
        console.log("ok");
    }

}

function changeprocess(value) {
    console.log(value);
    source.stop();

    source.disconnect(scriptNode);
    gainNode.disconnect(ctx.destination);
    ctx.close();
    stopTime =parseInt(value);
    console.log(stopTime);
    musicplay();
}
