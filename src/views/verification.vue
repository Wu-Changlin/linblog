<template>
    <div class="verification-page">
        <!-- <VerificationCode /> -->

        <VerificationCode @completeVerificationCode="submitVerificationCode" />
    </div>
</template>

<script setup>
    import { reactive, ref, onMounted } from 'vue';

    import VerificationCode from '@/components/verification_code.vue';


    // 提交验证码
    function submitVerificationCode(val) {
        console.log('submitVerificationCode', val);
    }

</script>

<style>
    .verification-page {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
</style>