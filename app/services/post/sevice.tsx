import apiClient from '../api/client';

export interface postCreateProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface GetPosts {
    id: number;
    title: string;
    body: string;
    userId: number;
}

interface RegisterData {
    title: string;
    body: string;
    userId: number;
}

class PostService {
    static async getPosts() {
        try {
            const response = await apiClient.get<GetPosts[]>('posts');

            const posts: GetPosts[] = response.data.map(post => {
                return {
                    id: Number(post.id) || 0,
                    title: String(post.title || 'Sem título'),
                    body: String(post.body || ''),
                    userId: Number(post.userId) || 0
                };
            });
            return posts;

        } catch (error: any) {
            const errorMessage = error.response?.data?.message
                || error.message
                || 'Erro desconhecido ao buscar posts';

            throw new Error(`Falha ao carregar posts: ${errorMessage}`);
        }
    }


    static async createPost(data: RegisterData) {
        try {
            const response = await apiClient.post('posts', data);
            return response.data;
        } catch (error) {
            throw new Error('Erro ao criar post');
        }
    }
}

export default PostService;