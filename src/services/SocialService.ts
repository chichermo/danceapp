export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'student' | 'teacher' | 'admin';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  joinDate: Date;
  bio?: string;
  specialties: string[];
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  content: string;
  type: 'choreography' | 'achievement' | 'question' | 'tip' | 'video';
  attachments?: {
    type: 'image' | 'video' | 'choreography';
    url: string;
    thumbnail?: string;
  }[];
  likes: number;
  comments: Comment[];
  shares: number;
  createdAt: Date;
  tags: string[];
  visibility: 'public' | 'followers' | 'private';
}

export interface Comment {
  id: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: Date;
  likes: number;
  replies: Comment[];
}

export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface Like {
  userId: string;
  postId: string;
  createdAt: Date;
}

export interface Share {
  userId: string;
  postId: string;
  createdAt: Date;
  platform: 'internal' | 'facebook' | 'twitter' | 'instagram';
}

class SocialService {
  private users: User[] = [];
  private posts: Post[] = [];
  private follows: Follow[] = [];
  private likes: Like[] = [];
  private shares: Share[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.initializeUsers();
    this.generateSamplePosts();
  }

  // Inicializar usuarios de muestra
  private initializeUsers(): void {
    this.users = [
      {
        id: 'user-1',
        name: 'María González',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'teacher',
        level: 'expert',
        joinDate: new Date('2023-01-15'),
        bio: 'Profesora de danza contemporánea con 10 años de experiencia',
        specialties: ['Contemporary', 'Modern', 'Jazz']
      },
      {
        id: 'user-2',
        name: 'Carlos Ruiz',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'teacher',
        level: 'expert',
        joinDate: new Date('2023-02-01'),
        bio: 'Especialista en Hip Hop y danza urbana',
        specialties: ['Hip Hop', 'Urban', 'Breakdance']
      },
      {
        id: 'user-3',
        name: 'Ana García',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'student',
        level: 'intermediate',
        joinDate: new Date('2023-03-10'),
        bio: 'Estudiante apasionada por la danza contemporánea',
        specialties: ['Contemporary', 'Ballet']
      },
      {
        id: 'user-4',
        name: 'Luis Pérez',
        avatar: 'https://i.pravatar.cc/150?img=4',
        role: 'student',
        level: 'advanced',
        joinDate: new Date('2023-01-20'),
        bio: 'Bailarín de Hip Hop con experiencia en competencias',
        specialties: ['Hip Hop', 'Popping', 'Locking']
      }
    ];

    // Establecer usuario actual
    this.currentUser = this.users[0];
  }

  // Generar posts de muestra
  private generateSamplePosts(): void {
    this.posts = [
      {
        id: 'post-1',
        authorId: 'user-1',
        author: this.users[0],
        content: '¡Nueva coreografía de contemporáneo lista! Esta pieza explora la conexión entre el movimiento y la emoción. ¿Qué opinan?',
        type: 'choreography',
        attachments: [{
          type: 'video',
          url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZpZGVvPC90ZXh0Pjwvc3ZnPg=='
        }],
        likes: 24,
        comments: [
          {
            id: 'comment-1',
            authorId: 'user-3',
            author: this.users[2],
            content: '¡Increíble! Me encanta la fluidez de los movimientos',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            likes: 5,
            replies: []
          }
        ],
        shares: 8,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        tags: ['contemporary', 'choreography', 'emotion'],
        visibility: 'public'
      },
      {
        id: 'post-2',
        authorId: 'user-2',
        author: this.users[1],
        content: 'Consejo del día: La clave del Hip Hop está en el groove. No se trata solo de pasos, sino de sentir el ritmo en cada parte de tu cuerpo.',
        type: 'tip',
        likes: 18,
        comments: [],
        shares: 12,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        tags: ['hip-hop', 'tip', 'rhythm'],
        visibility: 'public'
      },
      {
        id: 'post-3',
        authorId: 'user-4',
        author: this.users[3],
        content: '¡Logré mi primer backflip! Después de meses de práctica, finalmente lo conseguí. La perseverancia es clave en la danza.',
        type: 'achievement',
        attachments: [{
          type: 'video',
          url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZpZGVvPC90ZXh0Pjwvc3ZnPg=='
        }],
        likes: 31,
        comments: [
          {
            id: 'comment-2',
            authorId: 'user-2',
            author: this.users[1],
            content: '¡Felicitaciones! Ese es un logro impresionante',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            likes: 3,
            replies: []
          }
        ],
        shares: 15,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        tags: ['achievement', 'backflip', 'perseverance'],
        visibility: 'public'
      }
    ];
  }

  // Obtener feed de posts
  getFeed(limit: number = 10, offset: number = 0): Post[] {
    return this.posts
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  // Obtener posts de un usuario
  getUserPosts(userId: string, limit: number = 10): Post[] {
    return this.posts
      .filter(post => post.authorId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Crear nuevo post
  createPost(content: string, type: Post['type'], attachments?: Post['attachments'], tags: string[] = [], visibility: Post['visibility'] = 'public'): Post {
    if (!this.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: this.currentUser.id,
      author: this.currentUser,
      content,
      type,
      attachments,
      likes: 0,
      comments: [],
      shares: 0,
      createdAt: new Date(),
      tags,
      visibility
    };

    this.posts.unshift(newPost);
    return newPost;
  }

  // Dar like a un post
  likePost(postId: string): boolean {
    if (!this.currentUser) return false;

    const existingLike = this.likes.find(
      like => like.userId === this.currentUser!.id && like.postId === postId
    );

    if (existingLike) {
      // Quitar like
      this.likes = this.likes.filter(like => like !== existingLike);
      const post = this.posts.find(p => p.id === postId);
      if (post) post.likes--;
      return false;
    } else {
      // Agregar like
      this.likes.push({
        userId: this.currentUser.id,
        postId,
        createdAt: new Date()
      });
      const post = this.posts.find(p => p.id === postId);
      if (post) post.likes++;
      return true;
    }
  }

  // Comentar en un post
  addComment(postId: string, content: string): Comment | null {
    if (!this.currentUser) return null;

    const post = this.posts.find(p => p.id === postId);
    if (!post) return null;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorId: this.currentUser.id,
      author: this.currentUser,
      content,
      createdAt: new Date(),
      likes: 0,
      replies: []
    };

    post.comments.push(newComment);
    return newComment;
  }

  // Compartir post
  sharePost(postId: string, platform: Share['platform'] = 'internal'): boolean {
    if (!this.currentUser) return false;

    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    this.shares.push({
      userId: this.currentUser.id,
      postId,
      createdAt: new Date(),
      platform
    });

    post.shares++;
    return true;
  }

  // Seguir usuario
  followUser(userId: string): boolean {
    if (!this.currentUser || this.currentUser.id === userId) return false;

    const existingFollow = this.follows.find(
      follow => follow.followerId === this.currentUser!.id && follow.followingId === userId
    );

    if (existingFollow) {
      // Dejar de seguir
      this.follows = this.follows.filter(follow => follow !== existingFollow);
      return false;
    } else {
      // Seguir
      this.follows.push({
        followerId: this.currentUser.id,
        followingId: userId,
        createdAt: new Date()
      });
      return true;
    }
  }

  // Obtener seguidores de un usuario
  getFollowers(userId: string): User[] {
    const followerIds = this.follows
      .filter(follow => follow.followingId === userId)
      .map(follow => follow.followerId);
    
    return this.users.filter(user => followerIds.includes(user.id));
  }

  // Obtener usuarios seguidos
  getFollowing(userId: string): User[] {
    const followingIds = this.follows
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followingId);
    
    return this.users.filter(user => followingIds.includes(user.id));
  }

  // Buscar usuarios
  searchUsers(query: string): User[] {
    const lowercaseQuery = query.toLowerCase();
    return this.users.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.specialties.some(specialty => specialty.toLowerCase().includes(lowercaseQuery)) ||
      (user.bio && user.bio.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Obtener posts por tag
  getPostsByTag(tag: string): Post[] {
    return this.posts.filter(post => 
      post.tags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  // Obtener tendencias
  getTrendingTags(): Array<{ tag: string; count: number }> {
    const tagCounts: { [key: string]: number } = {};
    
    this.posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Obtener usuario por ID
  getUserById(userId: string): User | undefined {
    return this.users.find(user => user.id === userId);
  }

  // Obtener estadísticas de usuario
  getUserStats(userId: string): {
    postsCount: number;
    followersCount: number;
    followingCount: number;
    totalLikes: number;
    totalShares: number;
  } {
    const userPosts = this.posts.filter(post => post.authorId === userId);
    const followers = this.getFollowers(userId);
    const following = this.getFollowing(userId);
    
    const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
    const totalShares = userPosts.reduce((sum, post) => sum + post.shares, 0);

    return {
      postsCount: userPosts.length,
      followersCount: followers.length,
      followingCount: following.length,
      totalLikes,
      totalShares
    };
  }

  // Obtener notificaciones
  getNotifications(): Array<{
    id: string;
    type: 'like' | 'comment' | 'follow' | 'share';
    message: string;
    userId: string;
    user: User;
    postId?: string;
    createdAt: Date;
    read: boolean;
  }> {
    // Simular notificaciones basadas en la actividad reciente
    const notifications: Array<{
      id: string;
      type: 'like' | 'comment' | 'follow' | 'share';
      message: string;
      userId: string;
      user: User;
      postId?: string;
      createdAt: Date;
      read: boolean;
    }> = [];
    
    // Notificaciones de likes
    this.likes.forEach(like => {
      if (like.userId !== this.currentUser?.id) {
        const post = this.posts.find(p => p.id === like.postId);
        if (post && post.authorId === this.currentUser?.id) {
          const user = this.getUserById(like.userId);
          if (user) {
            notifications.push({
              id: `notif-${like.userId}-${like.postId}`,
              type: 'like',
              message: `${user.name} le dio like a tu post`,
              userId: like.userId,
              user,
              postId: like.postId,
              createdAt: like.createdAt,
              read: false
            });
          }
        }
      }
    });

    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// Instancia singleton
const socialService = new SocialService();
export default socialService;
