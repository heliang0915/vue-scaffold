/**
 *
 */
import{createApp}from './app';
// import '../assets/js/lib/jquery.min.js';

let {app,store,router}=createApp();
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
    // console.log('初始化状态...');
}
router.onReady(() => {
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to)
        const prevMatched = router.getMatchedComponents(from)
        let diffed = false
        const activated = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c))
        })
        const asyncDataHooks = activated.map(c => c.asyncData==null?null:c.asyncData).filter(_ => _)
        if (!asyncDataHooks.length) {
            return next()
        }
        Promise.all(asyncDataHooks.map(hook => hook({ store, route: to }))).then(() => {
                next()
        }).catch(next)
    })
    // actually mount to DOM
    app.$mount('#app');
})
