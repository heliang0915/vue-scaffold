/**
 * Created by hotread on 2017/6/12.
 */
import * as types from '../mutaion-types';
import indexQuery from '../../api/indexQuery';
let {getIndexData}=indexQuery;

/*
*初始化状态
*
* */
const state={
   list:[],
   fetching:true
}

/**
 * 定义mutations
 * @type {{}}
 */
const mutations={
    [types.FETCH_INDEX_LIST](state,payload){
        state.fetching=false;
        state.list=payload;
    }
}

/**
 *  定义actions
 * @type {{fetchIndexList: function({commit: *})}}
 */
const actions={
    fetchIndexList:async ({commit})=>{
        let  data=await getIndexData();
        commit(types.FETCH_INDEX_LIST,data)
    }
}

//定义getters
const getters={
    getIndexList:state=>{
        return state
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
