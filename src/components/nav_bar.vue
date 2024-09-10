<template>
    <div class="header-container">
        <header class="mask-paper">
            <a aria-current="page" href="/" class="router-link-exact-active" id="link-guide" >
                <img crossorigin="anonymous" class="header-logo" style="pointer-events:none;" src="@/assets/img/logo.png">
            </a>

            <div class="header-container-right-icon">
				
            <div class="icon-item">
				<div><svg-icon  class="svg-icon" icon-class="search"/> </div>
				<div><NavTheme></NavTheme></div>	
				
			</div>
				    
				
            </div>

        </header>
    </div>

	

</template>

<script setup>
	
import NavTheme from './nav_theme.vue'


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
					
				}
			}

			
		}
	}


</style>