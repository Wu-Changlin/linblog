import { useHead } from '@unhead/vue'
console.log(11);

export default  function useMetaInfo(current_meta_data){
    console.log('useMetaInfo:',current_meta_data)
    console.log(222);
    current_meta_data.meta_title= current_meta_data.meta_title?current_meta_data.meta_title:'LinBlog 个人博客';
    current_meta_data.meta_keywords= current_meta_data.meta_keywords?current_meta_data.meta_keywords:'个人博客，笔记';
    current_meta_data.meta_description= current_meta_data.meta_description?current_meta_data.meta_description:'分享技术，写开源项目，工作日常等';
    useHead({
        title: current_meta_data.meta_title,
        meta: [
            { name: 'keywords', content: current_meta_data.meta_keywords },
            { name: 'description', content: current_meta_data.meta_description }
        ]
    })
};

