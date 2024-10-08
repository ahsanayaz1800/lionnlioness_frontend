import axios from "axios";

// Set the base URL for Axios based on the environment variable
const API_URL = process.env.VERCEL_URL || 'https://lionnlioness-backend.vercel.app';

const api = axios.create({
  baseURL: API_URL
});

export default {
  user: {
    getUserFromUsername: username =>
      api.get(`/users/profile/${username}`).then(res => res.data),
    getUserFromId: user_id =>
      api.get(`/users/profile/id/${user_id}`).then(res => res.data),
    updateUserField: (id, field, data) =>
      api
        .post(`/users/update/${id}/custom/${field}`, { data: data })
        .then(res => res.data),
    updateUserData: (id, data) =>
      api.post(`/users/update/${id}`, { data: data }).then(res => res.data),
    createUserTag: (user_id, tag_id) =>
      api
        .post(`/users/create/${user_id}/tag`, { tag_id: tag_id })
        .then(res => res.data),
    deleteUserTag: (user_id, tag_id) =>
      api
        .post(`/users/delete/${user_id}/tag`, { tag_id: tag_id })
        .then(res => res.data),
    updateUserPicture: (user_id, data) =>
      api
        .post(`/users/update/${user_id}/picture`, { data: data })
        .then(res => res.data),
    deleteUserPicture: (user_id, pic_index) =>
      api
        .post(`/users/delete/${user_id}/picture`, { pic_index: pic_index })
        .then(res => res.data),
    deleteUser: (user_id, headers) =>
      api
        .post(`/users/delete/${user_id}`, { headers: headers })
        .then(res => res.data),
    checkUserLikedByAndReverse: (user_id, username) =>
      api
        .get(`/users/profile/${user_id}/liked_by/${username}`)
        .then(res => res.data),
    checkUserIsReported: (user_id, target_id) =>
      api
        .get(`/users/isreported/${user_id}/${target_id}`)
        .then(res => res.data),
    checkUserIsBlocked: (user_id, target_id) =>
      api
        .get(`/users/isblocked/${user_id}/${target_id}`)
        .then(res => res.data),
    createUserLike: (user_id, by_id) =>
      api
        .post(`/users/create/${user_id}/liked_by/${by_id}`)
        .then(res => res.data),
    deleteUserLike: (user_id, by_id) =>
      api
        .post(`/users/delete/${user_id}/liked_by/${by_id}`)
        .then(res => res.data),
    updateUserProfilePicture: (user_id, pic_index, pic_url) =>
      api
        .post(`/users/update/${user_id}/profile_picture`, {
          pic_index: pic_index,
          pic_url: pic_url
        })
        .then(res => res.data),
    verifyPasswordWithId: (id, password) =>
      api
        .post(`/users/verify/${id}/password`, { password: password })
        .then(res => res.data),
    updatePasswordWithId: (id, password) =>
      api
        .post(`/users/update/${id}/password`, { password: password })
        .then(res => res.data),
    getUserRoomId: async (user_id, target_id) =>
      await api
        .get(`/users/get-room-id/${user_id}/${target_id}`)
        .then(res => res.data),
    getUserProfilesVisited: async user_id =>
      await api
        .get(`/users/profiles-visited/${user_id}`)
        .then(res => res.data),
    getUserProfilesLiked: async user_id =>
      await api.get(`/users/profiles-liked/${user_id}`).then(res => res.data),
    getUserProfilesBlocked: async user_id =>
      await api
        .get(`/users/profiles-blocked/${user_id}`)
        .then(res => res.data),
    getUserListProfileDataFromId: async id =>
      await api.get(`/users/profile/${id}/list-profile`).then(res => res.data),
  }
}
