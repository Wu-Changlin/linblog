<template>
    <div class="header-container">
        <header class="mask-paper">
            <a aria-current="page" href="/" class="router-link-exact-active" id="link-guide" >
                <img crossorigin="anonymous" class="header-logo" style="pointer-events:none;" src="@/assets/img/logo.png">
            </a>


			<div class="tool-box"></div>
			
			<div class="input-box">
				<input type="text" class="search-input"
				placeholder="请输入搜索内容" />
				<div class="input-button">
					<div class="close-icon">
					<svg-icon  style="width: 1em; height: 1em;margin-left: 0px; margin-right: 18px" class="svg-icon" icon-class="close"/>
					</div>
					<div class="search-icon">
						<svg-icon  style="width: 1em; height: 1em; margin-right: 8px" class="svg-icon" icon-class="search"/>
					</div>
				</div>
			</div>


			<!-- <div class="input-box" v-if="show_right_search">
				<input type="text" class="search-input"
				placeholder="请输入搜索内容" />
				<div class="input-button">
					<div class="close-icon">
					<svg-icon  style="width: 1em; height: 1em;margin-left: 0px; margin-right: 18px" class="svg-icon" icon-class="close"/>
					</div>
					<div class="search-icon">
						<svg-icon  style="width: 1em; height: 1em; margin-right: 8px" class="svg-icon" icon-class="search"/>
					</div>
				</div>
			</div> -->

			<!-- <div class="right" style="display: flex">
				<svg-icon  class="svg-icon" icon-class="search"/>
				<NavTheme></NavTheme>
				
			</div> -->
			

            <div class="header-container-right-icon">
				
            <div class="icon-item">
				<div class="phone-show-right-search"><svg-icon  class="svg-icon" icon-class="search"  @click="clickPhoneSearch"/> </div>
				<div><NavTheme></NavTheme></div>	
				
			</div>
				    
				
            </div>

        </header>
    </div>

	

</template>

<script setup>
import {ref,reactive,onMounted,onUnmounted} from "vue";
import NavTheme from './nav_theme.vue';

const show_right_search=ref(false);
function clickPhoneSearch(){
	show_right_search.value=true
}

</script>
   

<style>
    .header-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		height: 72px;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 10;
		align-items: center;
		background:  var(--bg);
		

		.mask-paper {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			max-width: 1728px;
			height: 72px;
			/* padding: 0 16px 0 16px; */
            padding: 0;
			.header-logo {
				flex:1;
				width: auto;
				height: 32px
			}

			.tool-box {
          width: 24px;
          height: 70px;
          position: absolute;
          left: 0;
          top: 0;
        }

		/* 移除输入框在点击时边框的变化 */
		input:focus,
		input:hover {
			outline: none;
		}

        .input-box {
          height: 40px;
          position: fixed;
          left: 50%;
          transform: translate(-50%);
		  
          @media screen and (max-width: 695px) {
            display: none;
          }

          @media screen and (min-width: 960px) and (max-width: 1191px) {
            width: calc(-36px + 50vw);
          }

          @media screen and (min-width: 1192px) and (max-width: 1423px) {
            width: calc(-33.6px + 40vw);
          }

          @media screen and (min-width: 1424px) and (max-width: 1727px) {
            width: calc(-42.66667px + 33.33333vw);
          }

          @media screen and (min-width: 1728px) {
            width: 533.33333px;
          }

          .search-input {
            padding: 0 84px 0 16px;
            width: 100%;
            height: 100%;
            font-size: 16px;
            line-height: 120%;
            color: #333;
            background: rgba(0, 0, 0, 0.03);
			border: #333;
            border-radius:  999px;
          }

          .input-button {
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: rgba(51, 51, 51, 0.8);
			
			.search-icon {
              width: 40px;
              height: 100%;
              display: flex;
			 
              align-items: center;
              justify-content: center;
              cursor: pointer;
              color: rgba(51, 51, 51, 0.8);
			  
            }


		  .close-icon  {
              width: 40px;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              color: rgba(51, 51, 51, 0.8);
            }

          
          }
		  
        }

			.header-container-right-icon{
				align-items: center; 
				justify-content: space-between;
				height: 72px;
				width: 85px;
				.icon-item{
					margin-left: auto;
					display: flex;
					width: 100%;
					height: 100%;
					align-items: center; 
					justify-content:content;
					>div{
						margin-right: 10px;
						.svg-icon{
							width: 32px;
							height: 32px;
						}

					}

					.phone-show-right-search{

						display:none;
						@media screen and (max-width: 695px) {
							display: block;
							/* visibility: hidden; */
							
						}
					}
					
					
				}
			}

			
		}
	}


</style>