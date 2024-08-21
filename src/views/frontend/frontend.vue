<style>
 .width-height-ratio{
  background-color: red;
  /* width: 50%; */
  width: 1080px;
  margin: 0 auto;
 }

 .father-dev {
  width: 100%;
  height: 0;
  padding-top: 56.25%;
  position: relative;
 }

.son-dev{
  width: 100%;
  position:absolute;
  inset: 0;
  background-color: #333;
}


.wrapper {
  width: 40vw;
}
/* .intrinsic-aspect-ratio-container {
  width: 100%;
  height: 0;
  padding: 0;
  padding-bottom: 75%;
  margin: 50px;
  background-color: lightsalmon;
} */


.intrinsic-aspect-ratio {
  position: relative;
  width: 100%;
  height: 0;
  padding: 0;
  padding-bottom: 75%;
  margin: 50px;
  background-color: lightsalmon;
}
.content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}



</style>

<template>
   
<!-- 
    <div  class="width-height-ratio">
      <div class="father-dev">
        <div class="son-dev">
          <div>iiiii</div>
          <img src="" alt="">
        </div>
      </div>
    </div> -->


    <div class="wrapper">
      <div class="intrinsic-aspect-ratio-container">
        <div class="intrinsic-aspect-ratio">
          <div class="content">
            <img src="https://p3.ssl.qhimg.com/t01f7d210920c0c73bd.jpg" alt="">
          </div>
        </div>
      
      </div>
    </div>
</template>

