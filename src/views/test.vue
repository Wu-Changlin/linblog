<template>
	<MyForm @submit="resetPassword">
		<!-- 使用name指定插槽内容，这里添加一个密码框 -->
		<template #password>
			<label for="newPassword">新密码:</label>
			<input id="newPassword" v-model="form.newPassword" type="password" required>
		</template>
	</MyForm>
</template>

<script>
	import MyForm from './MyForm.vue';

	export default {
		components: {
			MyForm
		},
		data() {
			return {
				form: {
					newPassword: ''
				}
			};
		},
		methods: {
			resetPassword(formData) {
				// 重置密码逻辑
			}
		}
	};

	
</script>