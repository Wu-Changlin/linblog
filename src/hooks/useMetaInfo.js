import { useHead } from '@unhead/vue'

export default  function useMetaInfo(meta_title,meta_keywords,meta_description){
    // console.log(`useMetaInfo:meta_title=${meta_title},meta_keywords=${meta_keywords},meta_description=${meta_description}`)
    meta_title= meta_title||'Blog 个人博客';
    meta_keywords= meta_keywords||'个人博客，笔记';
    meta_description= meta_description||'分享技术，写开源项目，工作日常等';
    useHead({
        titleTemplate: meta_title,
        meta: [
            { name: 'keywords', content: meta_keywords },
            { name: 'description', content:meta_description }
        ]
    })
};

