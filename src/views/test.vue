<template>
	<div class="ap">
		<!-- <VerificationCode /> -->

<VerificationCode   @completeVerificationCode="submitVerificationCode"/>
	</div>
</template>

<script setup>
	import { reactive, ref, onMounted, onUpdated,watch, onBeforeUpdate, provide, inject,computed ,onUnmounted} from 'vue';

	import VerificationCode from '@/components/verification_code.vue';
	
	const inputValue = ref('')

	
// 提交验证码
	function  submitVerificationCode  (val){
console.log('submitVerificationCode', val);
}

</script>

<style>
	.ap {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
</style>