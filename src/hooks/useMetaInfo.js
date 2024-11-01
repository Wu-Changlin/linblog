import { useMeta } from 'vue-meta';

export default  function useMetaInfo(current_meta_info){
    console.log('useMetaInfo:',current_meta_info)
    current_meta_info.meta_title= current_meta_info.meta_title?current_meta_info.meta_title:'LinBlog 个人博客';
    current_meta_info.meta_keywords= current_meta_info.meta_keywords?current_meta_info.meta_keywords:'个人博客，笔记';
    current_meta_info.meta_description= current_meta_info.meta_description?current_meta_info.meta_description:'分享技术，写开源项目，工作日常等';
    useMeta({
        title: current_meta_info.meta_title,
        meta: [
            { name: 'keywords', content: current_meta_info.meta_keywords },
            { name: 'description', content: current_meta_info.meta_description }
        ]
    })

};

