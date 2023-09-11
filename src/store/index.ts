import { createStore } from 'vuex'
import { getFriends, FriendInfo } from '@/api/user';

export const store = createStore({
    state: {
        friends: new Array<FriendInfo>(),
        uid: -1
    },
    mutations: {
        async getfriends(state) {
            const res = await getFriends();
            state.friends.length = 0;
            state.friends.push(...res.firendsList)
            state.uid = state.friends[0].uid!;
            console.log(state.friends, state.uid)
        }
    },
    actions: {
        getfriend(context) {
            context.commit('getfriends')
        }
    },
    modules: {
    }
});

