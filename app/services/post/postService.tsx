import apiClient from '~/services/api/apiClient';

export interface postCreateProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface GetPosts {
    id: string;
    title: string;
    body: string;
    userId: string;
    userName: string;
}

export interface CreatePostPayload {
    title: string;
    content: string;
    type_id: number;
}


export const postService = {
    async getPosts(url?: string) {
        try {
            const isFullUrl = url?.startsWith('http');

            const response = await apiClient.get(
                isFullUrl ? url : 'posts',
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    }
                }
            );

            const apiResponse = response.data;

            const posts = apiResponse.data.map((post: any) => ({
                id: post.id,
                title: post.title,
                body: post.content,
                userId: post.user_id,
                userName: post.user?.char_name
            }));

            return {
                posts,
                meta: apiResponse.meta,
                links: apiResponse.links
            };

        } catch (error: any) {
            const errorMessage = error.response?.data?.message
                || error.message
                || 'Erro desconhecido ao buscar posts';

            throw new Error(`Falha ao carregar posts: ${errorMessage}`);
        }
    },

    async createPost(data: CreatePostPayload) {
        try {
            const response = await apiClient.post('post/store', data, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem("token")
                }
            });
            return response.data;
        } catch (error: any) {
            return error.response?.data || {
                success: false,
                message: "Erro ao fazer a publicação!",
            };
        }
    }
}